/**
 * Seeded evidence carries real document text (ADR-0017): the controlled
 * documents in `documents/` are written into the file itself — Markdown bytes,
 * Word paragraphs, spreadsheet rows or PDF lines. `evidence` is an upload
 * collection and Payload validates uploaded bytes against the declared type, so
 * every file is still a genuinely valid file of its format. A record with no
 * document text falls back to the one-line placeholder.
 */
import { zip } from '../lib/zip'

const MIME: Record<string, string> = {
  PDF: 'application/pdf',
  XLSX: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  PPTX: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  PNG: 'image/png',
  JPG: 'image/jpeg',
  MD: 'text/markdown',
}

/** Wraps a line to a fixed width, for the PDF's fixed-width page. */
function wrap(line: string, width: number): string[] {
  if (line.length <= width) return [line]
  const out: string[] = []
  let current = ''
  for (const word of line.split(' ')) {
    if (current && `${current} ${word}`.length > width) {
      out.push(current)
      current = word
    } else current = current ? `${current} ${word}` : word
  }
  if (current) out.push(current)
  return out
}

const escXml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** PDF text is written as latin1, so anything outside it is transliterated. */
const toLatin1 = (s: string) =>
  s
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, '-')
    .replace(/[^\u0020-\u00ff\n]/g, '?')

/** The document text as one Helvetica page, wrapped and truncated to fit. */
function textPdf(text: string): Uint8Array {
  const LINES = 62
  const lines: string[] = []
  for (const raw of toLatin1(text).split('\n')) {
    for (const l of wrap(raw, 92)) lines.push(l)
    if (lines.length > LINES) break
  }
  const shown = lines.slice(0, LINES)
  if (lines.length > LINES)
    shown.push('... continues; the full text is on the controlled document.')

  const content = shown
    .map((l, i) => `BT /F1 10 Tf 50 ${790 - i * 12} Td (${l.replace(/[\\()]/g, '')}) Tj ET`)
    .join('\n')
  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>',
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
  ]

  let pdf = '%PDF-1.4\n'
  const offsets: number[] = []
  objects.forEach((body, i) => {
    offsets.push(pdf.length)
    pdf += `${i + 1} 0 obj\n${body}\nendobj\n`
  })
  const xref = pdf.length
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`
  for (const o of offsets) pdf += `${String(o).padStart(10, '0')} 00000 n \n`
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`
  return Buffer.from(pdf, 'latin1')
}

// 1x1 transparent PNG.
const PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64',
)

// 1x1 JPEG.
const JPG = Buffer.from(
  '/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/wAALCAABAAEBAREA/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAD8AKp//2Q==',
  'base64',
)

const XML = '<?xml version="1.0" encoding="UTF-8"?>'
const NS_REL = 'http://schemas.openxmlformats.org/package/2006/relationships'

const rels = (target: string) =>
  `${XML}<Relationships xmlns="${NS_REL}"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="${target}"/></Relationships>`

const contentTypes = (part: string, type: string) =>
  `${XML}<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="${part}" ContentType="${type}"/></Types>`

/**
 * One spreadsheet row per line of text, one cell per `|`-separated field — the
 * shape the register extracts are actually kept in.
 */
function rows(text: string): string {
  const COLS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  return text
    .split('\n')
    .map((line, r) => {
      const cells = line
        .split('|')
        .map((v, c) =>
          v.trim()
            ? `<c r="${COLS[c] ?? 'Z'}${r + 1}" t="inlineStr"><is><t xml:space="preserve">${escXml(v.trim())}</t></is></c>`
            : '',
        )
        .join('')
      return `<row r="${r + 1}">${cells}</row>`
    })
    .join('')
}

/** One Word paragraph per line, so the document reads as a document. */
function paragraphs(text: string): string {
  return text
    .split('\n')
    .map((l) => `<w:p><w:r><w:t xml:space="preserve">${escXml(l)}</w:t></w:r></w:p>`)
    .join('')
}

function ooxml(kind: 'XLSX' | 'DOCX' | 'PPTX', text: string): Uint8Array {
  if (kind === 'XLSX') {
    return zip([
      {
        path: '[Content_Types].xml',
        content: contentTypes(
          '/xl/workbook.xml',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml',
        ),
      },
      { path: '_rels/.rels', content: rels('xl/workbook.xml') },
      {
        path: 'xl/workbook.xml',
        content: `${XML}<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Placeholder" sheetId="1" r:id="rId1"/></sheets></workbook>`,
      },
      {
        path: 'xl/_rels/workbook.xml.rels',
        content: `${XML}<Relationships xmlns="${NS_REL}"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>`,
      },
      {
        path: 'xl/worksheets/sheet1.xml',
        content: `${XML}<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>${rows(text)}</sheetData></worksheet>`,
      },
    ])
  }

  if (kind === 'DOCX') {
    return zip([
      {
        path: '[Content_Types].xml',
        content: contentTypes(
          '/word/document.xml',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml',
        ),
      },
      { path: '_rels/.rels', content: rels('word/document.xml') },
      {
        path: 'word/document.xml',
        content: `${XML}<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${paragraphs(text)}</w:body></w:document>`,
      },
    ])
  }

  return zip([
    {
      path: '[Content_Types].xml',
      content: contentTypes(
        '/ppt/presentation.xml',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml',
      ),
    },
    { path: '_rels/.rels', content: rels('ppt/presentation.xml') },
    {
      path: 'ppt/presentation.xml',
      content: `${XML}<p:presentation xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:sldIdLst/></p:presentation>`,
    },
  ])
}

/**
 * The bytes filed for one evidence record. `body` is the document's own text;
 * without it the file carries a single line naming the record, which is what
 * the derived coverage artefacts (`coverage.ts`) get.
 */
export function placeholderFile(name: string, fileType: string, body?: string) {
  const mimetype = MIME[fileType] ?? 'application/octet-stream'
  const text = body?.trim() ? body : `Placeholder for ${name}`
  let bytes: Uint8Array
  if (fileType === 'PDF') bytes = textPdf(text)
  else if (fileType === 'MD') bytes = Buffer.from(`${text}\n`, 'utf8')
  else if (fileType === 'PNG') bytes = PNG
  else if (fileType === 'JPG') bytes = JPG
  else bytes = ooxml(fileType as 'XLSX' | 'DOCX' | 'PPTX', text)

  // The writers return `Uint8Array` so they also run in the browser; Payload's
  // upload input wants a Buffer, and this module only ever runs under Node.
  const data = Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  return { data, mimetype, name, size: data.length }
}

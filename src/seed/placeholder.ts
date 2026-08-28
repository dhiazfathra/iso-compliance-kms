/**
 * The seed has no real documents to load, but `evidence` is an upload
 * collection and Payload validates uploaded bytes against the declared type,
 * so every placeholder has to be a genuinely valid file of its format.
 */
import { zip } from './zip'

const MIME: Record<string, string> = {
  PDF: 'application/pdf',
  XLSX: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  PPTX: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  PNG: 'image/png',
  JPG: 'image/jpeg',
}

/** A one-page PDF whose only content is the record's own filename. */
function minimalPdf(text: string): Buffer {
  const safe = text.replace(/[\\()]/g, '')
  const content = `BT /F1 12 Tf 60 760 Td (${safe}) Tj ET`
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

function ooxml(kind: 'XLSX' | 'DOCX' | 'PPTX', text: string): Buffer {
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
        content: `${XML}<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData><row r="1"><c r="A1" t="inlineStr"><is><t>${text}</t></is></c></row></sheetData></worksheet>`,
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
        content: `${XML}<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:p><w:r><w:t>${text}</w:t></w:r></w:p></w:body></w:document>`,
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

export function placeholderFile(name: string, fileType: string) {
  const mimetype = MIME[fileType] ?? 'application/octet-stream'
  let data: Buffer
  if (fileType === 'PDF') data = minimalPdf(name)
  else if (fileType === 'PNG') data = PNG
  else if (fileType === 'JPG') data = JPG
  else data = ooxml(fileType as 'XLSX' | 'DOCX' | 'PPTX', `Placeholder for ${name}`)

  return { data, mimetype, name, size: data.length }
}

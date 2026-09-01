/**
 * Minimal PDF writer for controlled documents.
 *
 * An auditor asks for the policy as a PDF, not as a web page, so a document
 * body leaves here as A4 pages of laid-out text. Same reasoning as `zip.ts`:
 * this application needs plain text in Helvetica and Courier, which is a page
 * of PDF syntax, not a rendering engine — and the bytes are generated on a
 * server route with no browser to print from.
 */

import { inlineText, parseMarkdown, type Block } from './markdown'
import { fromLatin1, latin1Length, type Bytes } from './bytes'

const PAGE = { width: 595.28, height: 841.89, margin: 56 }
const BODY_WIDTH = PAGE.width - PAGE.margin * 2

export type PdfLine = {
  text: string
  size: number
  bold?: boolean
  mono?: boolean
  /** Blank space above this line, in points. */
  spaceBefore?: number
  indent?: number
}

/**
 * ponytail: average glyph width, not per-character metrics — a line of capitals
 * wraps a little early. Embed the Helvetica widths table if a document ever
 * needs justified text or exact measurement.
 */
const CHAR_WIDTH = { helvetica: 0.5, courier: 0.6 }

const widthOf = (line: Pick<PdfLine, 'size' | 'mono'>) =>
  line.size * (line.mono ? CHAR_WIDTH.courier : CHAR_WIDTH.helvetica)

/** Greedy word wrap to the printable width, honouring the line's indent. */
export function wrap(text: string, line: Omit<PdfLine, 'text'>): string[] {
  const max = Math.max(8, Math.floor((BODY_WIDTH - (line.indent ?? 0)) / widthOf(line)))
  const out: string[] = []
  let current = ''
  for (const word of text.split(/\s+/).filter(Boolean)) {
    if (!current) current = word
    else if (current.length + 1 + word.length <= max) current += ` ${word}`
    else {
      out.push(current)
      current = word
    }
    while (current.length > max) {
      out.push(current.slice(0, max))
      current = current.slice(max)
    }
  }
  if (current) out.push(current)
  return out.length ? out : ['']
}

const HEADING_SIZE = [19, 16, 13.5, 12, 11.5, 11]

/** Markdown blocks to laid-out lines. */
export function layout(blocks: Block[]): PdfLine[] {
  const lines: PdfLine[] = []
  const push = (text: string, style: Omit<PdfLine, 'text'>) => {
    for (const [i, part] of wrap(text, style).entries()) {
      lines.push({ ...style, text: part, spaceBefore: i === 0 ? style.spaceBefore : 0 })
    }
  }

  for (const block of blocks) {
    switch (block.kind) {
      case 'heading':
        push(inlineText(block.inline), {
          size: HEADING_SIZE[block.level - 1] ?? 11,
          bold: true,
          spaceBefore: 14,
        })
        break
      case 'paragraph':
        push(inlineText(block.inline), { size: 10.5, spaceBefore: 8 })
        break
      case 'quote':
        push(inlineText(block.inline), { size: 10.5, spaceBefore: 8, indent: 18 })
        break
      case 'list':
        for (const [i, item] of block.items.entries()) {
          const marker = block.ordered ? `${i + 1}.` : '•'
          push(`${marker} ${inlineText(item)}`, {
            size: 10.5,
            spaceBefore: i === 0 ? 8 : 2,
            indent: 14,
          })
        }
        break
      case 'code':
        for (const [i, row] of block.text.split('\n').entries()) {
          push(row, { size: 9, mono: true, spaceBefore: i === 0 ? 8 : 0, indent: 14 })
        }
        break
      case 'rule':
        lines.push({ text: '', size: 10.5, spaceBefore: 12 })
        break
    }
  }
  return lines
}

/** Paginate lines at the bottom margin. */
function paginate(lines: PdfLine[]): { line: PdfLine; y: number }[][] {
  const pages: { line: PdfLine; y: number }[][] = []
  let page: { line: PdfLine; y: number }[] = []
  let y = PAGE.height - PAGE.margin

  for (const line of lines) {
    const step = line.size * 1.45
    y -= (line.spaceBefore ?? 0) + step
    if (y < PAGE.margin) {
      pages.push(page)
      page = []
      y = PAGE.height - PAGE.margin - step
    }
    page.push({ line, y })
  }
  pages.push(page)
  return pages
}

/**
 * PDF strings are Latin-1 byte strings with `(`, `)` and `\` escaped. Anything
 * outside that range is transliterated rather than emitted raw, which would
 * corrupt the stream.
 */
export function pdfString(text: string): string {
  return text
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, '-')
    .replace(/•/g, '\xb7')
    .replace(/[^\x20-\x7e\xa0-\xff]/g, '?')
    .replace(/([\\()])/g, '\\$1')
}

const FONT = (line: PdfLine) => (line.mono ? '/F3' : line.bold ? '/F2' : '/F1')

/** Lines to a single-column PDF document. `title` becomes the document title. */
export function pdf(lines: PdfLine[], title: string): Bytes {
  const pages = paginate(lines)

  const streams = pages.map((page) =>
    page
      .map(
        ({ line, y }) =>
          `BT ${FONT(line)} ${line.size} Tf 1 0 0 1 ${(PAGE.margin + (line.indent ?? 0)).toFixed(2)} ${y.toFixed(2)} Tm (${pdfString(line.text)}) Tj ET`,
      )
      .join('\n'),
  )

  // Object numbering: 1 catalog, 2 pages, 3 font dict, then a page and a
  // content stream per page.
  const pageIds = pages.map((_, i) => 4 + i * 2)
  const objects: string[] = [
    `<< /Type /Catalog /Pages 2 0 R >>`,
    `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${pages.length} >>`,
    `<< /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >> /F2 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >> /F3 << /Type /Font /Subtype /Type1 /BaseFont /Courier /Encoding /WinAnsiEncoding >> >>`,
  ]
  for (const [i, stream] of streams.entries()) {
    objects.push(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE.width} ${PAGE.height}] /Resources << /Font 3 0 R >> /Contents ${pageIds[i]! + 1} 0 R >>`,
    )
    objects.push(`<< /Length ${latin1Length(stream)} >>\nstream\n${stream}\nendstream`)
  }
  objects.push(`<< /Title (${pdfString(title)}) /Producer (iso-compliance-kms) >>`)

  const chunks: string[] = ['%PDF-1.4\n']
  const offsets: number[] = []
  let offset = latin1Length(chunks[0]!)
  for (const [i, body] of objects.entries()) {
    const obj = `${i + 1} 0 obj\n${body}\nendobj\n`
    offsets.push(offset)
    offset += latin1Length(obj)
    chunks.push(obj)
  }

  const xref = [
    `xref\n0 ${objects.length + 1}\n`,
    '0000000000 65535 f \n',
    ...offsets.map((o) => `${String(o).padStart(10, '0')} 00000 n \n`),
  ].join('')
  chunks.push(
    xref,
    `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R /Info ${objects.length} 0 R >>\nstartxref\n${offset}\n%%EOF\n`,
  )

  return fromLatin1(chunks.join(''))
}

/** A Markdown document as a PDF, with a title block ahead of the body. */
export function markdownPdf(markdown: string, meta: { title: string; subtitle?: string }): Bytes {
  const head: PdfLine[] = [{ text: meta.title, size: 21, bold: true }]
  if (meta.subtitle) head.push({ text: meta.subtitle, size: 10, spaceBefore: 6 })
  return pdf([...head, ...layout(parseMarkdown(markdown))], meta.title)
}

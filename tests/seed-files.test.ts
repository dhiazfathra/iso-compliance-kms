import { describe, expect, test } from 'bun:test'
import { placeholderFile } from '../src/seed/placeholder'
import { zip } from '../src/lib/zip'

describe('zip', () => {
  test('writes a readable stored archive', async () => {
    const buf = zip([{ path: 'a/b.txt', content: 'hello' }])
    // Local header, central directory and end-of-central-directory signatures.
    expect(buf.readUInt32LE(0)).toBe(0x04034b50)
    expect(buf.includes(Buffer.from('a/b.txt'))).toBe(true)
    expect(buf.readUInt32LE(buf.length - 22)).toBe(0x06054b50)
  })
})

describe('placeholderFile', () => {
  test('PDF starts with a PDF header and ends with EOF', () => {
    const f = placeholderFile('report.pdf', 'PDF')
    expect(f.mimetype).toBe('application/pdf')
    expect(f.data.subarray(0, 5).toString()).toBe('%PDF-')
    expect(f.data.toString('latin1').trimEnd().endsWith('%%EOF')).toBe(true)
    expect(f.data.toString('latin1')).toContain('report.pdf')
  })

  test('images are real PNG and JPEG byte streams', () => {
    expect(placeholderFile('a.png', 'PNG').data.subarray(1, 4).toString()).toBe('PNG')
    expect(placeholderFile('a.jpg', 'JPG').data.readUInt16BE(0)).toBe(0xffd8)
  })

  test('Office formats are ZIP packages carrying their own part', () => {
    for (const [type, part] of [
      ['XLSX', 'xl/workbook.xml'],
      ['DOCX', 'word/document.xml'],
      ['PPTX', 'ppt/presentation.xml'],
    ] as const) {
      const f = placeholderFile(`a.${type.toLowerCase()}`, type)
      expect(f.data.readUInt32LE(0)).toBe(0x04034b50)
      expect(f.data.includes(Buffer.from(part))).toBe(true)
      expect(f.size).toBe(f.data.length)
    }
  })

  test('document text reaches the bytes of every text format', () => {
    const body = ['# Deletion Policy', '', 'Backups expire in 35 days | owner | Dhiaz'].join('\n')

    const md = placeholderFile('a.md', 'MD', body)
    expect(md.mimetype).toBe('text/markdown')
    expect(md.data.toString()).toBe(`${body}\n`)

    // One paragraph per line, one row per line, one cell per pipe-separated field.
    const docx = placeholderFile('a.docx', 'DOCX', body).data.toString('latin1')
    expect(docx.includes('Deletion Policy')).toBe(true)
    const xlsx = placeholderFile('a.xlsx', 'XLSX', body).data.toString('latin1')
    expect(xlsx.includes('<c r="C3"')).toBe(true)

    const pdf = placeholderFile('a.pdf', 'PDF', body).data.toString('latin1')
    expect(pdf).toContain('Backups expire in 35 days')
  })

  test('PDF text stays inside latin1 and long documents are truncated', () => {
    const pdf = placeholderFile('a.pdf', 'PDF', 'reviewed — “quarterly” · ✅').data
    expect(pdf.toString('latin1')).toContain('reviewed - "quarterly"')

    const long = placeholderFile('a.pdf', 'PDF', 'line\n'.repeat(400)).data.toString('latin1')
    expect(long).toContain('... continues')
  })

  test('XML metacharacters in a document cannot break the package', () => {
    const docx = placeholderFile('a.docx', 'DOCX', '</w:t><w:br/> & <script>').data.toString(
      'latin1',
    )
    expect(docx).toContain('&lt;/w:t&gt;&lt;w:br/&gt; &amp; &lt;script&gt;')
    expect(docx.includes('<script>')).toBe(false)
  })
})

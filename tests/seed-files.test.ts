import { describe, expect, test } from 'bun:test'
import { placeholderFile } from '../src/seed/placeholder'
import { buildSeedData } from '../src/seed/build'
import { unzip, zip } from '../src/lib/zip'

describe('zip', () => {
  test('writes a readable stored archive', async () => {
    // `zip` returns a Uint8Array so it also runs in the browser; wrapped here
    // only to reach Node's reading helpers.
    const buf = Buffer.from(zip([{ path: 'a/b.txt', content: 'hello' }]))
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

describe('unzip', () => {
  test('reads back what zip wrote, including binary entries', async () => {
    const bytes = new Uint8Array([0, 1, 2, 255, 0, 128])
    const read = await unzip(
      zip([
        { path: 'a/b.txt', content: 'hello' },
        { path: 'raw.bin', content: bytes },
      ]),
    )
    expect(read.map((e) => e.path)).toEqual(['a/b.txt', 'raw.bin'])
    expect(new TextDecoder().decode(read[0]!.bytes)).toBe('hello')
    expect([...read[1]!.bytes]).toEqual([...bytes])
  })

  test('reads a deflated archive, which is what most tools produce', async () => {
    // Our own writer only stores; an archive that arrives from Finder, Windows
    // Explorer or `zip(1)` is deflated, and must read just the same.
    const body = 'compliance '.repeat(200)
    const deflated = new Uint8Array(
      await new Response(
        new Blob([body]).stream().pipeThrough(new CompressionStream('deflate-raw')),
      ).arrayBuffer(),
    )
    expect(deflated.length).toBeLessThan(body.length)

    const name = new TextEncoder().encode('notes.txt')
    const raw = new TextEncoder().encode(body)
    // Same headers as `zip`, but flagged deflate with the compressed length.
    const local = new Uint8Array(30 + name.length)
    const dv = new DataView(local.buffer)
    dv.setUint32(0, 0x04034b50, true)
    dv.setUint16(8, 8, true)
    dv.setUint32(18, deflated.length, true)
    dv.setUint32(22, raw.length, true)
    dv.setUint16(26, name.length, true)
    local.set(name, 30)

    const central = new Uint8Array(46 + name.length)
    const cv = new DataView(central.buffer)
    cv.setUint32(0, 0x02014b50, true)
    cv.setUint16(10, 8, true)
    cv.setUint32(20, deflated.length, true)
    cv.setUint32(24, raw.length, true)
    cv.setUint16(28, name.length, true)
    cv.setUint32(42, 0, true)
    central.set(name, 46)

    const end = new Uint8Array(22)
    const ev = new DataView(end.buffer)
    ev.setUint32(0, 0x06054b50, true)
    ev.setUint16(8, 1, true)
    ev.setUint16(10, 1, true)
    ev.setUint32(12, central.length, true)
    ev.setUint32(16, local.length + deflated.length, true)

    const archive = new Uint8Array(local.length + deflated.length + central.length + end.length)
    archive.set(local, 0)
    archive.set(deflated, local.length)
    archive.set(central, local.length + deflated.length)
    archive.set(end, local.length + deflated.length + central.length)

    const read = await unzip(archive)
    expect(new TextDecoder().decode(read[0]!.bytes)).toBe(body)
  })

  test('refuses something that is not an archive', async () => {
    await expect(unzip(new TextEncoder().encode('not a zip at all'))).rejects.toThrow('Not a ZIP')
  })
})

describe('the files the seed actually writes', () => {
  const data = buildSeedData({
    today: new Date('2026-09-10T00:00:00.000Z'),
    adminEmail: 'admin@dermaster.local',
    auditorEmail: 'auditor@dermaster.local',
    auditorSessionHours: 8,
  })
  const files = data.evidence.map((e) => ({ e, f: placeholderFile(e.title, e.fileType, e.body) }))

  test('no record is filed as an empty stub', () => {
    for (const { e, f } of files) {
      expect(e.body?.trim().length ?? 0).toBeGreaterThan(0)
      expect(f.data.toString('latin1')).not.toContain('Placeholder for')
      // A one-pixel image or a one-line note is not a record an auditor can
      // read. The Markdown logs are the smallest honest thing the seed files.
      expect(f.size).toBeGreaterThan(600)
    }
  })

  test('every declared format is a genuinely valid file of that format', () => {
    for (const { e, f } of files) {
      expect(e.title.split('.').pop()!.toLowerCase()).toBe(e.fileType.toLowerCase())
      if (e.fileType === 'PDF') expect(f.data.subarray(0, 5).toString()).toBe('%PDF-')
      else if (e.fileType === 'MD') expect(f.mimetype).toBe('text/markdown')
      else expect(f.data.readUInt32LE(0)).toBe(0x04034b50)
    }
  })

  test('every policy and form has an owner and text behind it', () => {
    for (const p of data.policies) expect(p.body.trim().length).toBeGreaterThan(400)
    for (const f of data.forms) {
      expect(f.name.trim().length).toBeGreaterThan(3)
      expect(data.evidence.some((e) => e.form === f.code)).toBe(true)
    }
  })
})

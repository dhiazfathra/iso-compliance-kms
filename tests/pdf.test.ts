import { describe, expect, test } from 'bun:test'
import { layout, markdownPdf, pdf, pdfString, wrap } from '../src/lib/pdf'
import { parseMarkdown } from '../src/lib/markdown'

describe('wrap', () => {
  test('breaks on words and never exceeds the printable width', () => {
    const lines = wrap('alpha beta gamma delta epsilon zeta eta theta iota kappa'.repeat(4), {
      size: 10.5,
    })
    expect(lines.length).toBeGreaterThan(1)
    for (const l of lines) expect(l.length).toBeLessThanOrEqual(92)
  })

  test('splits a word longer than the line and never returns nothing', () => {
    expect(wrap('x'.repeat(300), { size: 10.5 }).length).toBeGreaterThan(2)
    expect(wrap('   ', { size: 10.5 })).toEqual([''])
  })
})

describe('layout', () => {
  test('turns every block kind into lines with a marker for list items', () => {
    const lines = layout(
      parseMarkdown(['# T', 'body', '- a', '1. b', '> q', '```', 'code', '```', '---'].join('\n')),
    )
    const text = lines.map((l) => l.text)
    expect(text).toContain('T')
    expect(text).toContain('• a')
    expect(text).toContain('1. b')
    expect(lines.find((l) => l.text === 'code')?.mono).toBe(true)
    expect(lines.find((l) => l.text === 'T')?.bold).toBe(true)
  })
})

describe('pdfString', () => {
  test('escapes PDF syntax and transliterates what Latin-1 cannot hold', () => {
    expect(pdfString('a(b)c\\d')).toBe('a\\(b\\)c\\\\d')
    expect(pdfString('“q” — ‘r’')).toBe('"q" - \'r\'')
    expect(pdfString('日本')).toBe('??')
  })
})

describe('pdf', () => {
  test('writes a valid single-page document', () => {
    const bytes = pdf([{ text: 'Hello', size: 12 }], 'Title (v1)')
    const src = bytes.toString('latin1')
    expect(src.startsWith('%PDF-1.4')).toBe(true)
    expect(src.trimEnd().endsWith('%%EOF')).toBe(true)
    expect(src).toContain('/Type /Catalog')
    expect(src).toContain('/Count 1')
    expect(src).toContain('(Hello) Tj')
    expect(src).toContain('/Title (Title \\(v1\\))')
  })

  test('xref offsets point at their objects', () => {
    const src = markdownPdf('# A\n\nbody', { title: 'A', subtitle: 'v1 · Approved' }).toString(
      'latin1',
    )
    const offsets = [...src.matchAll(/^(\d{10}) 00000 n $/gm)].map((m) => Number(m[1]))
    expect(offsets.length).toBeGreaterThan(3)
    for (const [i, offset] of offsets.entries()) {
      expect(src.slice(offset, offset + 20)).toStartWith(`${i + 1} 0 obj`)
    }
    const startxref = Number(/startxref\n(\d+)/.exec(src)![1])
    expect(src.slice(startxref, startxref + 4)).toBe('xref')
  })

  test('paginates a long document', () => {
    const long = Array.from({ length: 400 }, (_, i) => `Paragraph ${i} of the policy.`).join('\n\n')
    const src = markdownPdf(long, { title: 'Long' }).toString('latin1')
    const count = Number(/\/Count (\d+)/.exec(src)![1])
    expect(count).toBeGreaterThan(3)
    expect(src.match(/\/Type \/Page\b/g)).toHaveLength(count)
  })

  test('an empty document still produces a titled PDF', () => {
    const src = markdownPdf('', { title: 'Empty' }).toString('latin1')
    expect(src).toContain('(Empty) Tj')
    expect(src).toContain('/Count 1')
  })
})

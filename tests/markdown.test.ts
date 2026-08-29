import { describe, expect, test } from 'bun:test'
import type { Block, Inline } from '../src/lib/markdown'
import {
  escapeHtml,
  inlineText,
  parseInline,
  parseMarkdown,
  renderHtml,
  safeHref,
} from '../src/lib/markdown'

describe('parseInline', () => {
  test('reads emphasis, code and links', () => {
    expect(parseInline('a **b** _c_ *d* `e`')).toEqual([
      { text: 'a ' },
      { text: 'b', bold: true },
      { text: ' ' },
      { text: 'c', italic: true },
      { text: ' ' },
      { text: 'd', italic: true },
      { text: ' ' },
      { text: 'e', code: true },
    ])
    expect(parseInline('see [the register](/policies)')).toEqual([
      { text: 'see ' },
      { text: 'the register', href: '/policies' },
    ])
  })

  test('keeps an unsafe link as literal text', () => {
    expect(parseInline('[x](javascript:alert(1))')).toEqual([
      { text: '[x](javascript:alert(1)' },
      { text: ')' },
    ])
    expect(inlineText(parseInline('**a**b'))).toBe('ab')
  })
})

describe('safeHref', () => {
  test('allows http(s), site paths and anchors only', () => {
    expect(safeHref('https://example.org/x')).toBe('https://example.org/x')
    expect(safeHref(' /clauses?q=A.5.1 ')).toBe('/clauses?q=A.5.1')
    expect(safeHref('#section-2')).toBe('#section-2')
    expect(safeHref('javascript:alert(1)')).toBeUndefined()
    expect(safeHref('data:text/html,<script>')).toBeUndefined()
    expect(safeHref('//evil.example')).toBeUndefined()
    expect(safeHref('/\\evil.example')).toBeUndefined()
  })
})

/** The inline segments of a block that has them, for assertions. */
const inlineOf = (block: Block | undefined): Inline[] =>
  block && 'inline' in block ? block.inline : []
const itemsOf = (block: Block | undefined): Inline[][] =>
  block && block.kind === 'list' ? block.items : []

describe('parseMarkdown', () => {
  test('splits headings, paragraphs, quotes, rules and code', () => {
    const blocks = parseMarkdown(
      [
        '## Purpose',
        '',
        'One line',
        'continued.',
        '',
        '> quoted',
        '> more',
        '',
        '---',
        '',
        '```',
        'a < b',
        '```',
      ].join('\n'),
    )
    expect(blocks.map((b) => b.kind)).toEqual(['heading', 'paragraph', 'quote', 'rule', 'code'])
    expect(blocks[0]).toMatchObject({ level: 2 })
    expect(inlineText(inlineOf(blocks[1]))).toBe('One line continued.')
    expect(inlineText(inlineOf(blocks[2]))).toBe('quoted more')
    expect(blocks[4]).toEqual({ kind: 'code', text: 'a < b' })
  })

  test('groups consecutive list items and separates ordered from bulleted', () => {
    const blocks = parseMarkdown(['- a', '- b', '', '1. x', '2) y'].join('\n'))
    expect(blocks).toHaveLength(2)
    expect(blocks[0]).toMatchObject({ kind: 'list', ordered: false })
    expect(blocks[1]).toMatchObject({ kind: 'list', ordered: true })
    expect(itemsOf(blocks[1])).toHaveLength(2)
  })

  test('handles empty input and CRLF line endings', () => {
    expect(parseMarkdown('')).toEqual([])
    expect(parseMarkdown('# a\r\n\r\nb')).toHaveLength(2)
  })
})

describe('renderHtml', () => {
  test('escapes every character of the source', () => {
    expect(escapeHtml(`<a href="x">&'`)).toBe('&lt;a href=&quot;x&quot;&gt;&amp;&#39;')
    expect(renderHtml('<script>alert(1)</script>')).toBe(
      '<p>&lt;script&gt;alert(1)&lt;/script&gt;</p>',
    )
    expect(renderHtml('`<img onerror=x>`')).toBe('<p><code>&lt;img onerror=x&gt;</code></p>')
  })

  test('emits the document structure', () => {
    expect(renderHtml('# T\n\n- a\n- b\n\n1. x')).toBe(
      ['<h1>T</h1>', '<ul><li>a</li><li>b</li></ul>', '<ol><li>x</li></ol>'].join('\n'),
    )
    expect(renderHtml('> note\n\n---')).toBe('<blockquote>note</blockquote>\n<hr />')
    expect(renderHtml('[x](https://a.example)')).toBe(
      '<p><a href="https://a.example" rel="noreferrer noopener">x</a></p>',
    )
    expect(renderHtml('**b** and *i*')).toBe('<p><strong>b</strong> and <em>i</em></p>')
  })
})

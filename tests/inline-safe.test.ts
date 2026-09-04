import { describe, expect, it } from 'bun:test'
import {
  INLINE_SAFE,
  canRenderInline,
  inlineContentType,
  safeFilename,
} from '../src/lib/inline-safe'

describe('canRenderInline', () => {
  it('allows exactly the inert types on the list', () => {
    for (const type of INLINE_SAFE) expect(canRenderInline(type)).toBe(true)
  })

  it('refuses scriptable documents, whatever the record claims', () => {
    for (const type of [
      'image/svg+xml',
      'text/html',
      'application/xhtml+xml',
      'application/javascript',
      'image/*',
    ]) {
      expect(canRenderInline(type)).toBe(false)
    }
  })

  it('refuses a record with no type at all rather than guessing', () => {
    expect(canRenderInline(null)).toBe(false)
    expect(canRenderInline(undefined)).toBe(false)
    expect(canRenderInline('')).toBe(false)
  })

  it('does not match a type by prefix', () => {
    expect(canRenderInline('application/pdf; charset=utf-8')).toBe(false)
    expect(canRenderInline('text/plaintext')).toBe(false)
  })
})

describe('inlineContentType', () => {
  it('serves markdown as plain text so nothing renders it as markup', () => {
    expect(inlineContentType('text/markdown')).toBe('text/plain; charset=utf-8')
  })

  it('leaves every other allowed type as it is', () => {
    expect(inlineContentType('application/pdf')).toBe('application/pdf')
    expect(inlineContentType('image/png')).toBe('image/png')
  })
})

describe('safeFilename', () => {
  it('keeps the characters a real document name uses', () => {
    expect(safeFilename('ISMS-SOP-A-8-28 (v2.1).pdf')).toBe('ISMS-SOP-A-8-28 (v2.1).pdf')
  })

  it('strips what would forge a second header parameter', () => {
    expect(safeFilename('a".pdf')).toBe('a_.pdf')
    expect(safeFilename('a\r\nX-Evil: 1.pdf')).toBe('a_X-Evil_ 1.pdf')
    expect(safeFilename('../../etc/passwd')).toBe('.._.._etc_passwd')
  })
})

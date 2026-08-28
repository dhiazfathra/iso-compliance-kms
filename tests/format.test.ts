import { describe, expect, it, test } from 'bun:test'
import { daysUntil, dueColor, expiresIn, fmtDate, relDue } from '../src/lib/format'

const NOW = new Date('2026-08-28T00:00:00Z')

describe('daysUntil', () => {
  test('counts whole days regardless of time of day', () => {
    expect(daysUntil('2026-09-30', NOW)).toBe(33)
    expect(daysUntil('2026-08-28T23:59:00Z', NOW)).toBe(0)
  })

  test('is negative when overdue and null without a date', () => {
    expect(daysUntil('2026-08-20', NOW)).toBe(-8)
    expect(daysUntil(null, NOW)).toBeNull()
    expect(daysUntil('not a date', NOW)).toBeNull()
  })
})

describe('dueColor', () => {
  test('warns inside 30 days and when overdue', () => {
    expect(dueColor('2026-08-20', NOW)).toBe('#a8562a')
    expect(dueColor('2026-09-20', NOW)).toBe('#a8562a')
  })

  test('steps down through 60 days and beyond', () => {
    expect(dueColor('2026-10-20', NOW)).toBe('#0073e6')
    expect(dueColor('2027-01-20', NOW)).toBe('#6b6b6b')
    expect(dueColor(null, NOW)).toBe('#8a8a84')
  })
})

describe('relDue', () => {
  test('reads as overdue or remaining days', () => {
    expect(relDue('2026-08-20', NOW)).toBe('8d overdue')
    expect(relDue('2026-09-30', NOW)).toBe('in 33d')
    expect(relDue(null, NOW)).toBe('')
  })
})

describe('fmtDate', () => {
  test('formats in UTC so a date never shifts by timezone', () => {
    expect(fmtDate('2026-09-30')).toBe('30 Sep 26')
    expect(fmtDate('2026-01-05T22:00:00Z')).toBe('05 Jan 26')
    expect(fmtDate(null)).toBe('—')
  })
})

describe('expiresIn', () => {
  const now = new Date('2026-08-28T12:00:00.000Z')
  it('reads in minutes under an hour and hours above it', () => {
    expect(expiresIn('2026-08-28T12:45:00.000Z', now)).toBe('45 min')
    expect(expiresIn('2026-08-28T20:00:00.000Z', now)).toBe('8 h')
  })
  it('never goes negative', () => {
    expect(expiresIn('2026-08-27T00:00:00.000Z', now)).toBe('0 min')
  })
})

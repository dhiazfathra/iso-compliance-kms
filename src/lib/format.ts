export const STATUS_META = {
  compliant: { label: 'Compliant', color: '#21201c', bg: 'transparent', border: 'rgba(33,32,28,0.28)' },
  progress: { label: 'In progress', color: '#0073e6', bg: 'transparent', border: 'rgba(0,115,230,0.35)' },
  review: { label: 'Needs review', color: '#a8562a', bg: 'transparent', border: 'rgba(168,86,42,0.34)' },
  gap: { label: 'Gap', color: '#fdfdfc', bg: '#a8562a', border: '#a8562a' },
} as const

export type StatusKey = keyof typeof STATUS_META

export const STANDARD_LABEL: Record<string, string> = {
  '27001': 'ISO/IEC 27001:2022',
  '9001': 'ISO 9001:2015',
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** Days from now until `d`. Negative means overdue. Null when there is no date. */
export function daysUntil(d?: string | null, now: Date = new Date()): number | null {
  if (!d) return null
  const target = new Date(d)
  if (Number.isNaN(target.getTime())) return null
  const a = Date.UTC(target.getUTCFullYear(), target.getUTCMonth(), target.getUTCDate())
  const b = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  return Math.round((a - b) / 86400000)
}

export function fmtDate(d?: string | null): string {
  if (!d) return '—'
  const dt = new Date(d)
  if (Number.isNaN(dt.getTime())) return '—'
  return `${String(dt.getUTCDate()).padStart(2, '0')} ${MONTHS[dt.getUTCMonth()]} ${String(dt.getUTCFullYear()).slice(2)}`
}

/** Colour ramp used everywhere a due date is shown, so urgency reads the same. */
export function dueColor(d?: string | null, now?: Date): string {
  const n = daysUntil(d, now)
  if (n === null) return '#8a8a84'
  if (n <= 30) return '#a8562a'
  if (n <= 60) return '#0073e6'
  return '#6b6b6b'
}

export function relDue(d?: string | null, now?: Date): string {
  const n = daysUntil(d, now)
  if (n === null) return ''
  return n < 0 ? `${Math.abs(n)}d overdue` : `in ${n}d`
}

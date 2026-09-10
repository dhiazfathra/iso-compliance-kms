/**
 * Which stored bytes may be rendered in place, and as what.
 *
 * Evidence is shown back on our own origin — through an iframe in the hosted
 * app, through a `blob:` URL in local mode, which is the same origin again. A
 * scriptable type rendered there is a stored XSS carried by an upload, so both
 * doors ask the same question here rather than each keeping its own list
 * (ADR-0015). Anything not named is saved to disk instead of rendered.
 */

/** Types the browser may render in place. */
export const INLINE_SAFE = new Set([
  'application/pdf',
  'image/png',
  'image/jpeg',
  'text/plain',
  'text/markdown',
])

/**
 * Markdown is handed to the browser as plain text: it has no renderer, and a
 * richer label would invite the browser to treat a stored document as markup.
 */
const INLINE_AS: Record<string, string> = { 'text/markdown': 'text/plain; charset=utf-8' }

/** True when `type` may be shown in place rather than downloaded. */
export const canRenderInline = (type: string | null | undefined): boolean =>
  !!type && INLINE_SAFE.has(type)

/** The `Content-Type` to render `type` under, once `canRenderInline` said yes. */
export const inlineContentType = (type: string): string => INLINE_AS[type] ?? type

/**
 * A filename safe to place inside a quoted `Content-Disposition` parameter.
 * Quotes and control characters would otherwise forge a second parameter, or
 * break the response outright.
 */
export const safeFilename = (name: string): string => name.replace(/[^\w.\-() ]+/g, '_')

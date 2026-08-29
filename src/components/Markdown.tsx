import { renderHtml } from '@/lib/markdown'

/**
 * Renders a Markdown document. The HTML is built by our own renderer, which
 * escapes every character of the source and emits a fixed tag set — there is no
 * path from a stored document to raw HTML (ADR-0016).
 */
export function Markdown({ source }: { source: string }) {
  if (!source.trim()) {
    return (
      <div className="mono" style={{ fontSize: 11.5, color: 'var(--muted)' }}>
        No document text yet.
      </div>
    )
  }
  return <div className="markdown" dangerouslySetInnerHTML={{ __html: renderHtml(source) }} />
}

/**
 * Markdown for controlled documents: one parse, two renderers.
 *
 * Policy bodies are written as Markdown in the app and leave it as HTML (on
 * screen) and as PDF (the download an auditor asks for). Both come from the
 * same block list here, so what is read is what is exported.
 *
 * The subset is the one a policy actually uses — headings, paragraphs, lists,
 * quotes, fenced code, rules, and inline emphasis, code and links. There is no
 * raw-HTML passthrough and no `dangerouslySetInnerHTML` on the other side: the
 * HTML renderer escapes every character it did not itself emit, so an author
 * with `write` access cannot store script in a document body.
 */

export type Inline = {
  text: string
  bold?: boolean
  italic?: boolean
  code?: boolean
  href?: string
}

export type Block =
  | { kind: 'heading'; level: number; inline: Inline[] }
  | { kind: 'paragraph'; inline: Inline[] }
  | { kind: 'quote'; inline: Inline[] }
  | { kind: 'list'; ordered: boolean; items: Inline[][] }
  | { kind: 'code'; text: string }
  | { kind: 'rule' }

// ── Inline ───────────────────────────────────────────────────────────────────

/** `[text](url)` | `` `code` `` | `**bold**` | `*italic*` / `_italic_` */
const INLINE = /\[([^\]\n]*)\]\(([^)\s]*)\)|`([^`\n]+)`|\*\*([^*\n]+)\*\*|\*([^*\n]+)\*|_([^_\n]+)_/

/**
 * A link target we are willing to emit. Anything that is not http(s) or a path
 * on this site — `javascript:`, `data:`, a protocol-relative host — is dropped
 * and rendered as plain text.
 */
export function safeHref(href: string): string | undefined {
  const url = href.trim()
  if (/^https?:\/\/[^/\\]/i.test(url)) return url
  if (/^\/(?![/\\])/.test(url) || /^#[\w-]/.test(url)) return url
  return undefined
}

export function parseInline(src: string): Inline[] {
  const out: Inline[] = []
  let rest = src
  for (let m = INLINE.exec(rest); m; m = INLINE.exec(rest)) {
    if (m.index > 0) out.push({ text: rest.slice(0, m.index) })
    const [, linkText, linkUrl, code, bold, star, underscore] = m
    if (linkUrl !== undefined) {
      const href = safeHref(linkUrl)
      out.push(href ? { text: linkText ?? '', href } : { text: `[${linkText}](${linkUrl})` })
    } else if (code !== undefined) out.push({ text: code, code: true })
    else if (bold !== undefined) out.push({ text: bold, bold: true })
    else out.push({ text: (star ?? underscore)!, italic: true })
    rest = rest.slice(m.index + m[0].length)
  }
  if (rest) out.push({ text: rest })
  return out.filter((s) => s.text !== '')
}

// ── Blocks ───────────────────────────────────────────────────────────────────

const BULLET = /^\s*[-*+]\s+(.*)$/
const NUMBER = /^\s*\d+[.)]\s+(.*)$/

export function parseMarkdown(src: string): Block[] {
  const lines = (src ?? '').replace(/\r\n?/g, '\n').split('\n')
  const blocks: Block[] = []
  let paragraph: string[] = []

  const flush = () => {
    if (paragraph.length)
      blocks.push({ kind: 'paragraph', inline: parseInline(paragraph.join(' ')) })
    paragraph = []
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!

    if (!line.trim()) {
      flush()
      continue
    }

    if (/^\s*```/.test(line)) {
      flush()
      const body: string[] = []
      for (i++; i < lines.length && !/^\s*```/.test(lines[i]!); i++) body.push(lines[i]!)
      blocks.push({ kind: 'code', text: body.join('\n') })
      continue
    }

    if (/^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) {
      flush()
      blocks.push({ kind: 'rule' })
      continue
    }

    const heading = /^(#{1,6})\s+(.*)$/.exec(line)
    if (heading) {
      flush()
      blocks.push({
        kind: 'heading',
        level: heading[1]!.length,
        inline: parseInline(heading[2]!.trim()),
      })
      continue
    }

    const quote = /^\s*>\s?(.*)$/.exec(line)
    if (quote) {
      flush()
      const body = [quote[1]!]
      while (i + 1 < lines.length && /^\s*>\s?/.test(lines[i + 1]!)) {
        body.push(lines[++i]!.replace(/^\s*>\s?/, ''))
      }
      blocks.push({ kind: 'quote', inline: parseInline(body.join(' ').trim()) })
      continue
    }

    const item = BULLET.exec(line) ?? NUMBER.exec(line)
    if (item) {
      flush()
      const ordered = !BULLET.test(line)
      const items: Inline[][] = [parseInline(item[1]!)]
      while (i + 1 < lines.length) {
        const next = lines[i + 1]!
        const nextItem = ordered ? NUMBER.exec(next) : BULLET.exec(next)
        if (!nextItem) break
        items.push(parseInline(nextItem[1]!))
        i++
      }
      blocks.push({ kind: 'list', ordered, items })
      continue
    }

    paragraph.push(line.trim())
  }
  flush()
  return blocks
}

// ── HTML ─────────────────────────────────────────────────────────────────────

export const escapeHtml = (s: string): string =>
  s.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!,
  )

function inlineHtml(segments: Inline[]): string {
  return segments
    .map((s) => {
      let html = escapeHtml(s.text)
      if (s.code) html = `<code>${html}</code>`
      if (s.bold) html = `<strong>${html}</strong>`
      if (s.italic) html = `<em>${html}</em>`
      if (s.href) {
        html = `<a href="${escapeHtml(s.href)}" rel="noreferrer noopener">${html}</a>`
      }
      return html
    })
    .join('')
}

/** Markdown to HTML. Every byte of the input is escaped before it is emitted. */
export function renderHtml(src: string): string {
  return parseMarkdown(src)
    .map((b) => {
      switch (b.kind) {
        case 'heading':
          return `<h${b.level}>${inlineHtml(b.inline)}</h${b.level}>`
        case 'paragraph':
          return `<p>${inlineHtml(b.inline)}</p>`
        case 'quote':
          return `<blockquote>${inlineHtml(b.inline)}</blockquote>`
        case 'list': {
          const tag = b.ordered ? 'ol' : 'ul'
          return `<${tag}>${b.items.map((it) => `<li>${inlineHtml(it)}</li>`).join('')}</${tag}>`
        }
        case 'code':
          return `<pre><code>${escapeHtml(b.text)}</code></pre>`
        case 'rule':
          return '<hr />'
      }
    })
    .join('\n')
}

/** The plain text of a block, for the PDF renderer and for search. */
export const inlineText = (segments: Inline[]): string => segments.map((s) => s.text).join('')

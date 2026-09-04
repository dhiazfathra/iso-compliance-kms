'use client'

/**
 * Hands bytes to the user without a server.
 *
 * The hosted app serves downloads from a route, and the screens link to
 * `/…/download`. Local mode keeps those links working by answering them with a
 * page that pulls the bytes out of the pack and turns them into an object URL —
 * either shown in place (`?inline=1`, which is how the evidence preview frame
 * asks) or saved straight away.
 */
import { useEffect, useMemo } from 'react'
import { canRenderInline } from '@/lib/inline-safe'

export function Deliver({
  bytes,
  filename,
  type,
  inline,
}: {
  bytes: Uint8Array
  filename: string
  type: string
  inline: boolean
}) {
  // A blob: URL runs on this origin, so local mode enforces the same list the
  // hosted route does. There is no server here to do it for us.
  const renderable = inline && canRenderInline(type)
  const url = useMemo(() => {
    const blob = new Blob([bytes as BlobPart], { type })
    return URL.createObjectURL(blob)
  }, [bytes, type])

  useEffect(() => () => URL.revokeObjectURL(url), [url])

  useEffect(() => {
    if (renderable) return
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
  }, [url, filename, renderable])

  if (renderable)
    return (
      <iframe
        src={url}
        title={filename}
        style={{ width: '100%', height: '100vh', border: 0, background: '#fff' }}
      />
    )

  return (
    <div className="block" style={{ maxWidth: 520 }}>
      <div className="eyebrow">Saved from this browser</div>
      <p style={{ fontSize: 13, color: 'var(--secondary)', lineHeight: 1.6 }}>
        <span className="mono">{filename}</span> was written to your downloads. Nothing left this
        machine.
      </p>
      <a className="btn" href={url} download={filename} style={{ alignSelf: 'flex-start' }}>
        Save again
      </a>
    </div>
  )
}

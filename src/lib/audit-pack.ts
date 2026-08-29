import { getPayload } from 'payload'
import config from '@payload-config'
import { del, put } from '@vercel/blob'
import { zip, type ZipEntry } from './zip'
import { fmtDate } from './format'
import type { Graph } from './data'

/** How long a pack stays downloadable before the sweep deletes it. */
export const PACK_TTL_DAYS = 14
const PREFIX = 'audit-packs/'

const csv = (rows: (string | number)[][]): string =>
  rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')

const esc = (s: string) =>
  s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c] ?? c)

/**
 * The hyperlinked index the pack promises: clause → policy → form → evidence,
 * with every evidence link pointing at the copy inside this ZIP, so the pack
 * works offline on the certification body's machine.
 */
export function packIndexHtml(graph: Graph, packId: string, at: Date): string {
  const names = evidenceEntryNames(graph)
  const tracked = graph.clauses.filter((c) => (c.criticality ?? 1) > 0)
  const rows = tracked
    .map((c) => {
      const chain = c.policies
        .map(
          (p) =>
            `<li>${esc(p.name)} ${esc(p.version)}<ul>${p.forms
              .map(
                (f) =>
                  `<li>${esc(f.code)} · ${esc(f.name)}<ul>${f.evidence
                    .map(
                      (e) =>
                        `<li><a href="evidence/${esc(
                          encodeURIComponent(names.get(e.id) ?? e.title),
                        )}">${esc(e.title)}</a></li>`,
                    )
                    .join('')}</ul></li>`,
              )
              .join('')}</ul></li>`,
        )
        .join('')
      return `<tr><td>${esc(c.clauseId)}</td><td>${esc(c.title)}</td><td>${esc(c.status)}</td><td>${esc(
        c.owner.name,
      )}</td><td><ul>${chain || '<li>No artefact filed</li>'}</ul></td></tr>`
    })
    .join('')

  return `<!doctype html><meta charset="utf-8"><title>${packId}</title>
<style>body{font:14px/1.5 -apple-system,system-ui,sans-serif;margin:40px;color:#21201c}
table{border-collapse:collapse;width:100%}th,td{border-bottom:1px solid #e5e3dd;padding:8px;text-align:left;vertical-align:top}
ul{margin:0;padding-left:16px}code{font-family:ui-monospace,monospace}</style>
<h1>Audit pack ${esc(packId)}</h1>
<p>Exported ${esc(fmtDate(at.toISOString()))} · ${tracked.length} requirements in scope ·
${graph.evidence.length} evidence files · ${graph.policies.length} policies.</p>
<p>Files are in <code>evidence/</code>; <code>clauses.csv</code>, <code>evidence.csv</code>,
<code>gaps.csv</code> and <code>cross-map.csv</code> hold the same data as tables.</p>
<table><thead><tr><th>Requirement</th><th>Title</th><th>Status</th><th>Owner</th>
<th>Chain of evidence</th></tr></thead><tbody>${rows}</tbody></table>`
}

/** Everything except the evidence bytes — pure, so the shape is testable. */
export function packEntries(graph: Graph, packId: string, at: Date): ZipEntry[] {
  const tracked = graph.clauses.filter((c) => (c.criticality ?? 1) > 0)
  return [
    { path: 'index.html', content: packIndexHtml(graph, packId, at) },
    {
      path: 'clauses.csv',
      content: csv([
        ['Requirement', 'Standard', 'Title', 'Status', 'Owner', 'Next review', 'In scope'],
        ...graph.clauses.map((c) => [
          c.clauseId,
          c.standard,
          c.title,
          c.status,
          c.owner.name,
          c.nextReview ?? '',
          (c.criticality ?? 1) > 0 ? 'yes' : 'no',
        ]),
      ]),
    },
    {
      path: 'evidence.csv',
      content: csv([
        ['File', 'Type', 'Uploaded', 'Expires', 'Owner', 'Satisfies', 'Versions'],
        ...graph.evidence.map((e) => [
          e.title,
          e.fileType,
          e.uploadedAt,
          e.expiryDate ?? '',
          e.uploader.name,
          e.satisfies.join(' '),
          e.revisions.length,
        ]),
      ]),
    },
    {
      path: 'gaps.csv',
      content: csv([
        ['Requirement', 'Finding', 'Task', 'Owner', 'Due', 'Blocking', 'Progress'],
        ...graph.gaps.map((g) => [
          g.clause?.clauseId ?? '',
          g.finding,
          g.task,
          g.owner?.name ?? '',
          g.due,
          g.blocking ? 'yes' : 'no',
          g.progress,
        ]),
      ]),
    },
    {
      path: 'cross-map.csv',
      content: csv([
        ['Artefact', 'Kind', 'Written for', 'Also satisfies'],
        ...graph.policies.map((p) => [
          p.name,
          'policy',
          p.primaryClause,
          p.clauses.filter((c) => c !== p.primaryClause).join(' '),
        ]),
        ...graph.forms.map((f) => [
          f.code,
          'form',
          f.primaryClause,
          [...f.alsoSatisfies, ...f.externalRefs].join(' '),
        ]),
      ]),
    },
    {
      path: 'MANIFEST.txt',
      content: [
        `Pack: ${packId}`,
        `Exported: ${at.toISOString()}`,
        `Requirements in scope: ${tracked.length} of ${graph.clauses.length}`,
        `Policies: ${graph.policies.length}`,
        `Forms: ${graph.forms.length}`,
        `Evidence files: ${graph.evidence.length}`,
        `Open gaps: ${graph.gaps.length}`,
        '',
        'Evidence files are the versions current at the moment of export.',
      ].join('\n'),
    },
  ]
}

/**
 * The name each evidence file gets inside the ZIP, keyed by evidence id.
 *
 * A ZIP entry name is a filename, not a path. Evidence titles are free text, so
 * a title of `../../.bashrc` would otherwise escape the extraction directory on
 * the certification body's machine — and two identical titles would silently
 * collide, delivering a pack whose evidence is not what it claims. Built once
 * and shared, so the index's links and the stored entries always agree.
 */
export function evidenceEntryNames(graph: Graph): Map<number, string> {
  const taken = new Set<string>()
  const names = new Map<number, string>()

  for (const item of graph.evidence) {
    const base = item.title
      .split(/[\\/]/)
      .pop()!
      .replace(/^\.+/, '')
      .replace(/[^\w.\-() ]+/g, '_')
    let name = base || 'evidence'
    if (taken.has(name)) {
      const dot = name.lastIndexOf('.')
      const [stem, ext] = dot > 0 ? [name.slice(0, dot), name.slice(dot)] : [name, '']
      let n = 2
      while (taken.has(`${stem} (${n})${ext}`)) n++
      name = `${stem} (${n})${ext}`
    }
    taken.add(name)
    names.set(item.id, name)
  }

  return names
}

export const packPathname = (packId: string) => `${PREFIX}${packId}.zip`

/**
 * The origin `buildPack` calls back into to read evidence bytes.
 *
 * That call carries the requester's session cookie, so the address must never
 * come from the request: a forged `Host` header would post the cookie to
 * whoever sent it. Configuration first (`NEXT_PUBLIC_SERVER_URL`), then the
 * platform's own injected hostname, and only outside production does the
 * request's host serve as a local-development convenience.
 */
export function selfOrigin(requestHost: string | null): string {
  const configured = process.env.NEXT_PUBLIC_SERVER_URL
  if (configured) return new URL(configured).origin

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL
  if (vercel) return `https://${vercel}`

  if (process.env.NODE_ENV === 'production') {
    throw new Error('NEXT_PUBLIC_SERVER_URL is not set; refusing to trust the request host.')
  }
  return `http://${requestHost ?? 'localhost:3000'}`
}

/**
 * Build the ZIP and store it. Runs after the response (`after()`), as the
 * system rather than as the requester: the pack is a fixed export, not a
 * user-shaped query. Evidence bytes are read back through the app's own gated
 * route, so there is still exactly one door to them (ADR-0010).
 */
export async function buildPack({
  packId,
  graph,
  origin,
  cookie,
}: {
  packId: string
  graph: Graph
  origin: string
  cookie: string
}): Promise<void> {
  const payload = await getPayload({ config })
  const at = new Date()

  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN
    if (!token) throw new Error('No BLOB_READ_WRITE_TOKEN: nowhere to store the pack.')

    const entries = packEntries(graph, packId, at)
    const names = evidenceEntryNames(graph)
    for (const item of graph.evidence) {
      if (!item.url) continue
      const res = await fetch(new URL(`/evidence/${item.id}/download?inline=1`, origin), {
        headers: { cookie },
      })
      if (!res.ok) throw new Error(`Could not read ${item.title} (${res.status}).`)
      entries.push({
        path: `evidence/${names.get(item.id)}`,
        content: Buffer.from(await res.arrayBuffer()),
      })
    }

    const buf = zip(entries)
    const stored = await put(packPathname(packId), buf, {
      access: 'public',
      addRandomSuffix: true,
      contentType: 'application/zip',
      token,
    })

    await payload.update({
      collection: 'audit-packs',
      where: { packId: { equals: packId } },
      overrideAccess: true,
      data: {
        status: 'ready',
        completedAt: at.toISOString(),
        expiresAt: new Date(at.getTime() + PACK_TTL_DAYS * 86_400_000).toISOString(),
        url: stored.url,
        pathname: stored.pathname,
        size: buf.length,
        itemCount: entries.length,
      },
    })
  } catch (err) {
    await payload.update({
      collection: 'audit-packs',
      where: { packId: { equals: packId } },
      overrideAccess: true,
      data: { status: 'failed', error: err instanceof Error ? err.message : String(err) },
    })
  }
}

/**
 * The other half of the lifecycle: a pack past its window is deleted from
 * storage and marked expired, so an export cannot outlive the audit it was
 * made for. Returns how many were swept.
 */
export async function sweepExpiredPacks(now = new Date()): Promise<number> {
  const payload = await getPayload({ config })
  const due = await payload.find({
    collection: 'audit-packs',
    where: { status: { equals: 'ready' }, expiresAt: { less_than: now.toISOString() } },
    limit: 100,
    depth: 0,
    overrideAccess: true,
  })

  const token = process.env.BLOB_READ_WRITE_TOKEN
  let swept = 0
  for (const pack of due.docs) {
    try {
      if (pack.url) {
        if (!token) throw new Error('No BLOB_READ_WRITE_TOKEN: cannot delete the stored pack.')
        await del(pack.url, { token })
      }
    } catch (err) {
      // The row keeps saying `ready` on purpose: a pack whose file is still out
      // there has not expired, whatever the date says. The next sweep retries.
      await payload.update({
        collection: 'audit-packs',
        id: pack.id,
        overrideAccess: true,
        data: { error: `Sweep failed: ${err instanceof Error ? err.message : String(err)}` },
      })
      continue
    }
    await payload.update({
      collection: 'audit-packs',
      id: pack.id,
      overrideAccess: true,
      data: { status: 'expired', url: null, size: null, error: null },
    })
    swept++
  }
  return swept
}

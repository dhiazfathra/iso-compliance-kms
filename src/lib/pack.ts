/**
 * The pack: everything the register is, as a folder of files.
 *
 * One format serves two jobs. An audit pack is handed to a certification body,
 * so it leads with `index.html` and CSVs a human reads without this
 * application. Local mode reads the same folder back in, so it also carries
 * `graph.json` — the register itself, machine-readable — and the controlled
 * text as Markdown under `policies/`.
 *
 * Nothing here touches the database, the network or the filesystem: it maps a
 * `Graph` to file contents and back. That is what lets the browser build and
 * read a pack with no server (ADR-0018).
 */
import { fmtDate } from './format'
import type { Graph } from './data'
import type { ZipEntry } from './zip'

/**
 * Bumped when a pack written by this version can no longer be read by the
 * previous one. The importer refuses a version it does not know rather than
 * guessing at a half-understood register.
 */
export const PACK_FORMAT_VERSION = 1

/**
 * `graph.json`: the register, plus where each document's text and each
 * evidence file live in the same folder. Paths are relative to the pack root.
 */
export type PackManifest = {
  version: number
  packId: string
  generatedAt: string
  graph: Graph
  /** Policy id to its Markdown file. */
  policyFiles: Record<number, string>
  /** Evidence id to its file. */
  evidenceFiles: Record<number, string>
}

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

/** The human-readable half of the pack: the index and the CSV tables. */
function reportEntries(graph: Graph, packId: string, at: Date): ZipEntry[] {
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
  for (const item of graph.evidence)
    names.set(item.id, safeEntryName(item.title, taken, 'evidence'))
  return names
}

/**
 * A single path segment safe to write to disk, unique within `taken`.
 *
 * Titles and document names are free text. A name of `../../.bashrc` would
 * otherwise escape the extraction directory on the reader's machine, and two
 * identical names would silently collide — delivering a pack whose contents are
 * not what its index claims.
 */
export function safeEntryName(raw: string, taken: Set<string>, fallback: string): string {
  const base =
    raw
      .split(/[\\/]/)
      .pop()!
      .replace(/^\.+/, '')
      .replace(/[^\w.\-() ]+/g, '_') || fallback
  let name = base
  if (taken.has(name)) {
    const dot = name.lastIndexOf('.')
    const [stem, ext] = dot > 0 ? [name.slice(0, dot), name.slice(dot)] : [name, '']
    let n = 2
    while (taken.has(`${stem} (${n})${ext}`)) n++
    name = `${stem} (${n})${ext}`
  }
  taken.add(name)
  return name
}

/**
 * The Markdown file each controlled document's text is written to, keyed by
 * policy id. Same escaping rules as the evidence names, for the same reason.
 *
 * A document name is not a path, even when it looks like one: `CBE/ISMS/SOP/19`
 * is one document number, so its separators are flattened rather than split on,
 * which would file the document as `19.md`.
 */
export function policyEntryNames(graph: Graph): Map<number, string> {
  const taken = new Set<string>()
  const names = new Map<number, string>()
  for (const p of graph.policies) {
    const flat = p.name.replace(/[\\/]+/g, '-').replace(/\s*·\s*/g, ' - ')
    names.set(p.id, safeEntryName(`${flat}.md`, taken, 'policy.md'))
  }
  return names
}

/** The whole pack except the evidence bytes, which only their holder can supply. */
export function packEntries(graph: Graph, packId: string, at: Date): ZipEntry[] {
  const policyNames = policyEntryNames(graph)
  const evidenceNames = evidenceEntryNames(graph)

  const manifest: PackManifest = {
    version: PACK_FORMAT_VERSION,
    packId,
    generatedAt: at.toISOString(),
    graph,
    policyFiles: Object.fromEntries([...policyNames].map(([id, n]) => [id, `policies/${n}`])),
    evidenceFiles: Object.fromEntries([...evidenceNames].map(([id, n]) => [id, `evidence/${n}`])),
  }

  return [
    ...reportEntries(graph, packId, at),
    { path: 'graph.json', content: JSON.stringify(manifest, null, 2) },
    ...graph.policies.map((p) => ({
      path: `policies/${policyNames.get(p.id)}`,
      content: p.body ?? `# ${p.name}\n\nNo text has been filed for this document.\n`,
    })),
  ]
}

/** One file out of a pack, however it was picked: a folder, or a zip. */
export type PackFile = { path: string; bytes: Uint8Array }

export type ParsedPack = {
  graph: Graph
  packId: string
  generatedAt: string
  /** Pack-relative path to bytes, for every file that came with the pack. */
  files: Map<string, Uint8Array>
  /** Policy id to the Markdown path holding its text. */
  policyFiles: Map<number, string>
  /** Evidence id to the path holding its bytes. */
  evidenceFiles: Map<number, string>
}

export type ParseResult = { ok: true; pack: ParsedPack } | { ok: false; error: string }

/**
 * A pack-relative path that cannot escape the pack.
 *
 * Everything here arrives from outside — a folder someone picked, or a zip
 * someone was sent — so a path is not trusted because `graph.json` names it.
 * Rejected rather than sanitised: a pack whose paths had to be rewritten is not
 * the pack its manifest describes, and quietly repairing it would hide that.
 */
export function safePath(path: string): string | undefined {
  if (!path || path.startsWith('/') || /^[a-zA-Z]:/.test(path)) return undefined
  if (path.includes('\\')) return undefined
  const parts = path.split('/')
  if (parts.some((p) => p === '..' || p === '' || p === '.')) return undefined
  return path
}

/**
 * Where `graph.json` sits in `input`, as a prefix to strip from every path.
 *
 * A folder picker reports paths relative to the folder the user chose, so every
 * path carries that folder as its first segment; a zip may too, and a pack made
 * at the root does not. Both readers — the parser and the OPFS writer — have to
 * agree on where the pack actually starts, so they ask here.
 */
export function packPrefix(input: PackFile[]): string {
  const manifest = input.find((f) => f.path === 'graph.json' || f.path.endsWith('/graph.json'))
  return manifest ? manifest.path.slice(0, manifest.path.length - 'graph.json'.length) : ''
}

/**
 * Reads a pack back into the register it came from.
 *
 * The whole point of the format is that this is the only parser: whether the
 * pack came from `bun run export:pack`, from an audit-pack download or from a
 * folder someone edited by hand, it is read here and nowhere else.
 */
export function parsePack(input: PackFile[]): ParseResult {
  const prefix = packPrefix(input)
  const manifestEntry = input.find((f) => f.path === `${prefix}graph.json`)
  if (!manifestEntry)
    return {
      ok: false,
      error: 'That folder is not a compliance pack — it has no graph.json at its root.',
    }

  let manifest: PackManifest
  try {
    manifest = JSON.parse(new TextDecoder().decode(manifestEntry.bytes)) as PackManifest
  } catch {
    return { ok: false, error: 'graph.json is not readable JSON; the pack may be truncated.' }
  }

  if (manifest.version !== PACK_FORMAT_VERSION)
    return {
      ok: false,
      error: `This pack is format version ${manifest.version}; this version of the application reads version ${PACK_FORMAT_VERSION}.`,
    }
  if (!manifest.graph?.clauses || !manifest.graph.policies || !manifest.graph.evidence)
    return { ok: false, error: 'graph.json carries no register.' }

  const files = new Map<string, Uint8Array>()
  for (const f of input) {
    if (prefix && !f.path.startsWith(prefix)) continue
    const rel = safePath(f.path.slice(prefix.length))
    if (rel) files.set(rel, f.bytes)
  }

  const resolve = (
    raw: Record<number, string> | undefined,
    kind: string,
  ): Map<number, string> | string => {
    const out = new Map<number, string>()
    for (const [id, path] of Object.entries(raw ?? {})) {
      const rel = safePath(path)
      if (!rel) return `${kind} ${id} points outside the pack: ${path}`
      if (!files.has(rel)) return `${kind} ${id} names a file the pack does not contain: ${path}`
      out.set(Number(id), rel)
    }
    return out
  }

  const policyFiles = resolve(manifest.policyFiles, 'Document')
  if (typeof policyFiles === 'string') return { ok: false, error: policyFiles }
  const evidenceFiles = resolve(manifest.evidenceFiles, 'Record')
  if (typeof evidenceFiles === 'string') return { ok: false, error: evidenceFiles }

  return {
    ok: true,
    pack: {
      graph: manifest.graph,
      packId: manifest.packId,
      generatedAt: manifest.generatedAt,
      files,
      policyFiles,
      evidenceFiles,
    },
  }
}

/**
 * The contract every screen is rendered through.
 *
 * A screen has two callers: the hosted app, which renders it on the server
 * against Payload, and local mode, which renders it in the browser against a
 * pack in OPFS. Everything that differs between them is in `ViewProps` — the
 * JSX itself is written once.
 *
 * Only serialisable values cross the boundary. Links are built from `base`
 * rather than passed as functions, because the hosted tree renders on the
 * server and cannot hand a closure to a client component; the two mutations
 * are `FormData` actions, which a server action satisfies and a plain
 * function in the local tree satisfies too.
 */
import type { Graph } from '@/lib/data'

export type ActionResult = { ok: boolean; error?: string }
export type FormAction = (data: FormData) => Promise<ActionResult>

export type ViewProps = {
  graph: Graph
  /** Prefix for every internal link: `''` hosted, `'/local'` in local mode. */
  base: string
  canWrite: boolean
}

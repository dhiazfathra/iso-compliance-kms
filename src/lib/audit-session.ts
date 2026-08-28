import { getPayload } from 'payload'
import config from '@payload-config'
import type { AuditSession } from '@/payload-types'

/**
 * Session bookkeeping. These writes are made by the application, not by the
 * user: the auditor holding the session is read-only and must not be able to
 * edit their own trail, so they run with `overrideAccess` and no `user`.
 * That is the one privileged path outside the seed (ADR-0009).
 */
async function record(session: AuditSession, data: Partial<AuditSession>, action: string) {
  const payload = await getPayload({ config })
  await Promise.all([
    payload.update({
      collection: 'audit-sessions',
      id: session.id,
      data: data as never,
      overrideAccess: true,
    }),
    payload.create({
      collection: 'activity',
      overrideAccess: true,
      data: {
        at: new Date().toISOString(),
        actor: session.label,
        action,
        ref: session.sessionId,
      },
    }),
  ])
}

/**
 * First view of a requirement in this session; repeat views are not re-counted.
 * Returns the distinct-clause count including this view, because the caller
 * renders it and the session document it holds is a request-cached copy.
 */
export async function recordClauseView(session: AuditSession, clauseId: string): Promise<number> {
  const viewed = session.clausesViewed ?? []
  if (viewed.some((v) => v.clauseId === clauseId)) return viewed.length
  await record(
    session,
    { clausesViewed: [...viewed, { clauseId, at: new Date().toISOString() }] },
    `read-only session — viewed ${clauseId}`,
  )
  return viewed.length + 1
}

export async function recordDownload(session: AuditSession, title: string): Promise<void> {
  await record(
    session,
    { downloads: (session.downloads ?? 0) + 1 },
    `read-only session — downloaded ${title}`,
  )
}

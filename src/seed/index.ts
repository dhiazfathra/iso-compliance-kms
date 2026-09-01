/**
 * Writes the seeded register (`build.ts`) into Payload.
 *
 * Everything about *what* the data is lives in `build.ts`; this file only
 * resolves natural keys to database ids and creates rows in dependency order.
 */
import { getPayload } from 'payload'
import config from '@payload-config'
import { buildSeedData } from './build'
import { placeholderFile } from './placeholder'

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || 'admin@dermaster.local'
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || 'changeme123'
const AUDITOR_EMAIL = process.env.SEED_AUDITOR_EMAIL || 'k.halim@external.audit'
/** How long the seeded external-auditor session stays live, in hours. */
const AUDITOR_SESSION_HOURS = Number(process.env.SEED_AUDITOR_SESSION_HOURS || 8)

const run = async () => {
  const payload = await getPayload({ config })

  const data = buildSeedData({
    adminEmail: ADMIN_EMAIL,
    auditorEmail: AUDITOR_EMAIL,
    auditorSessionHours: AUDITOR_SESSION_HOURS,
  })

  // Wipe in dependency order so the seed is repeatable.
  for (const collection of [
    'audit-sessions',
    'activity',
    'gaps',
    'evidence',
    'forms',
    'policies',
    'clauses',
  ] as const) {
    await payload.delete({ collection, where: { id: { exists: true } } })
  }

  // Users -----------------------------------------------------------------
  // Users are keyed by name across the register, and are not wiped above: an
  // account that already exists keeps its password and its session.
  const userIds = new Map<string, number>()
  for (const u of [...data.users, data.auditor]) {
    const existing = await payload.find({
      collection: 'users',
      where: { email: { equals: u.email } },
    })
    const doc =
      existing.docs[0] ??
      (await payload.create({
        collection: 'users',
        data: { ...u, password: ADMIN_PASSWORD },
      }))
    if (!userIds.has(u.name)) userIds.set(u.name, doc.id)
  }
  const userId = (name: string) => userIds.get(name) ?? userIds.values().next().value!

  // Clauses ---------------------------------------------------------------
  const clauseIds = new Map<string, number>()
  for (const c of data.clauses) {
    const doc = await payload.create({
      collection: 'clauses',
      data: {
        clauseId: c.clauseId,
        standard: c.standard,
        title: c.title,
        status: c.status,
        owner: userId(c.owner),
        nextReview: c.nextReview,
        criticality: c.criticality,
      },
    })
    clauseIds.set(c.clauseId, doc.id)
  }
  const clauseId = (id: string) => clauseIds.get(id)!

  // Policies --------------------------------------------------------------
  const policyIds = new Map<string, number>()
  for (const p of data.policies) {
    const doc = await payload.create({
      collection: 'policies',
      data: {
        name: p.name,
        version: p.version,
        status: p.status as 'Approved' | 'In review' | 'Draft',
        owner: userId(p.owner),
        primaryClause: clauseId(p.primaryClause),
        clauses: p.clauses.map(clauseId),
        body: p.body,
        revisions: p.revisions.map((r) => ({
          version: r.version,
          date: r.date,
          author: userId(r.author),
          approval: r.approval,
          status: r.status,
          note: r.note,
        })),
      },
    })
    policyIds.set(p.name, doc.id)
  }

  // Forms -----------------------------------------------------------------
  const formIds = new Map<string, number>()
  for (const f of data.forms) {
    const doc = await payload.create({
      collection: 'forms',
      data: {
        code: f.code,
        name: f.name,
        policy: policyIds.get(f.policy)!,
        primaryClause: clauseId(f.primaryClause),
        alsoSatisfies: f.alsoSatisfies.map(clauseId),
        externalRefs: f.externalRefs.map((ref) => ({ ref })),
      },
    })
    formIds.set(f.code, doc.id)
  }

  // Evidence --------------------------------------------------------------
  for (const e of data.evidence) {
    await payload.create({
      collection: 'evidence',
      data: {
        title: e.title,
        fileType: e.fileType,
        form: formIds.get(e.form)!,
        satisfies: e.satisfies.map(clauseId),
        uploader: userId(e.uploader),
        uploadedAt: e.uploadedAt,
        expiryDate: e.expiryDate,
        reviewDate: e.reviewDate,
        retention: e.retention,
        sha: e.sha,
        revisions: e.revisions.map((r) => ({
          version: r.version,
          date: r.date,
          author: userId(r.author),
          note: r.note,
        })),
      },
      file: placeholderFile(e.title, e.fileType, e.body),
    })
  }

  // Audit session and activity --------------------------------------------
  await payload.create({
    collection: 'audit-sessions',
    data: {
      ...data.auditSession,
      auditor: userId(data.auditSession.auditor),
    },
  })

  for (const a of data.activity) {
    await payload.create({ collection: 'activity', data: a })
  }

  payload.logger.info(
    `Seeded ${data.stats.inScope} in-scope requirements ` +
      `(+${data.stats.referenced} referenced, out of scope), ` +
      `${data.stats.policies} policies, 0 open gaps.`,
  )
  process.exit(0)
}

await run()

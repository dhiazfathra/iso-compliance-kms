# ISO Compliance KMS v0.1.0

A compliance repository for ISO/IEC 27001:2022 and ISO 9001:2015. It holds the
chain an auditor walks — clause, the policy that answers it, the form issued
under that policy, and the evidence filed against that form — and makes
cross-mapping visible everywhere: one form that satisfies requirements in both
standards is shown as such on every screen it appears on.

Built with Next.js 16 (App Router) and Payload CMS 3 in a single deployable,
backed by Turso and Vercel Blob.

## Quick start

```bash
bun install
cp .env.example .env
bun run migrate
bun run seed
bun run dev
```

The app is on http://localhost:3000, the Payload admin on
http://localhost:3000/admin. The seed creates a user per named owner; sign in
with `admin@dermaster.local` / `changeme123` (override with `SEED_ADMIN_EMAIL`
and `SEED_ADMIN_PASSWORD`).

## Commands

| Command                  | Description                                            |
| ------------------------ | ------------------------------------------------------ |
| `bun run dev`            | Development server                                     |
| `bun run build`          | Production build (type-checks as part of the build)    |
| `bun run start`          | Serve the production build                             |
| `bun run seed`           | Reset and reload the compliance dataset                |
| `bun run migrate`        | Apply pending schema migrations                        |
| `bun run migrate:create` | Write a new migration from the current collections     |
| `bun run migrate:status` | Show which migrations have run                         |
| `bun run lint`           | ESLint                                                 |
| `bun run typecheck`      | `tsc --noEmit`                                         |
| `bun run generate:types` | Regenerate `src/payload-types.ts` from the collections |

`bun run seed` is destructive: it clears clauses, policies, forms, evidence,
gaps and activity before reloading them.

## Environment

| Variable                | Required    | Purpose                                            |
| ----------------------- | ----------- | -------------------------------------------------- |
| `PAYLOAD_SECRET`        | yes         | Signs Payload sessions                             |
| `DATABASE_URI`          | yes         | `file:./iso-kms.db` locally, `libsql://…` on Turso |
| `DATABASE_AUTH_TOKEN`   | on Turso    | Turso database token                               |
| `BLOB_READ_WRITE_TOKEN` | for uploads | Vercel Blob store token                            |
| `CRON_SECRET`           | on Vercel   | Bearer token the daily audit-pack sweep requires   |

Without `BLOB_READ_WRITE_TOKEN` the app still builds and runs; evidence records
carry metadata but no stored file, and the preview panel says so.

## Screens

| Route                         | What it is for                                                                                                 |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `/`                           | Readiness by standard, requirement counts by status, expiries and reviews due, recent audit trail              |
| `/clauses`                    | The Clause → Policy → Form → Evidence tree, with search and filters by standard, status and owner              |
| `/matrix`                     | Cross-map matrix: filled mark = the requirement an artefact was written for, open mark = one it also satisfies |
| `/evidence`, `/evidence/[id]` | Evidence register, and the record with preview, metadata, clause satisfaction and version history              |
| `/policies`, `/policies/[id]` | Controlled documents, the forms issued under them, and revision history                                        |
| `/gaps`                       | Open findings, remediation tasks, owners, progress and due dates                                               |
| `/owners`                     | Requirement mix per accountable owner                                                                          |
| `/audit-pack`                 | Export for the certification body: request a ZIP, see past exports, download one                               |
| `/audit-session`              | Read-only presenting mode: one requirement, large type, whole chain of evidence, live session counters         |
| `/admin`                      | Payload admin for maintaining the data                                                                         |

Expiry and review dates use one colour ramp across every screen (due within 30
days or overdue is warning-coloured), so urgency reads the same everywhere.

## Architecture

```
src/
  app/(app)/          audit-facing screens, Server Components
  app/(payload)/      Payload admin panel and REST/GraphQL routes
  collections/        Payload collection configs (the domain model)
  components/         shared UI: sidebar, clause tree, chips, preview
  lib/access.ts       role ranking and every collection's access rules
  lib/auth.ts         session lookup, audit-session expiry, login guard
  lib/audit-pack.ts   ZIP export: contents, build job and storage sweep
  lib/audit-session.ts  view and download bookkeeping for auditor sessions
  lib/data.ts         loads and assembles the whole compliance graph
  lib/format.ts       dates, due-date colour ramp, status metadata
  migrations/         checked-in schema migrations
  seed/               dataset transcribed from the Claude Design mockup
```

The domain model is a strict hierarchy in its primary edges and many-to-many in
its cross-map edges: a policy has one `primaryClause` and many `clauses`; a form
has one `policy` and many `alsoSatisfies`; evidence has one `form` and many
`satisfies`. See [ADR-0004](docs/decisions/0004-clause-hierarchy-and-cross-mapping.md).

Decisions are recorded in [`docs/decisions/`](docs/decisions):

- [0001](docs/decisions/0001-nextjs-payload-single-deployment.md) — Next.js and Payload in one deployment
- [0002](docs/decisions/0002-turso-libsql-database.md) — Turso through the SQLite adapter
- [0003](docs/decisions/0003-vercel-blob-evidence-storage.md) — evidence files in Vercel Blob
- [0004](docs/decisions/0004-clause-hierarchy-and-cross-mapping.md) — hierarchy and cross-mapping
- [0005](docs/decisions/0005-version-history-as-array-fields.md) — version history as array fields
- [0006](docs/decisions/0006-whole-graph-load.md) — whole-graph load per request
- [0007](docs/decisions/0007-seed-generates-valid-files.md) — seed generates valid placeholder files
- [0008](docs/decisions/0008-authentication-and-role-model.md) — authentication and the role model
- [0009](docs/decisions/0009-external-auditor-sessions.md) — time-boxed external-auditor sessions
- [0010](docs/decisions/0010-evidence-bytes-served-through-the-app.md) — evidence bytes served through the app
- [0011](docs/decisions/0011-full-requirement-catalogue.md) — the full requirement catalogue, scored by scope
- [0012](docs/decisions/0012-audit-pack-export.md) — the audit pack as a real ZIP export

## Deploying to Vercel

1. Create a Turso database and a Vercel Blob store.
2. Set `PAYLOAD_SECRET`, `DATABASE_URI`, `DATABASE_AUTH_TOKEN`,
   `BLOB_READ_WRITE_TOKEN` and `CRON_SECRET` in the Vercel project. Without
   `CRON_SECRET` the daily audit-pack sweep refuses to run and exports are never
   deleted (ADR-0012).
3. Deploy. `vercel.json` runs `bun run migrate` before `next build`, so the
   schema comes from `src/migrations/` and nothing is derived from the running
   config (see [ADR-0002](docs/decisions/0002-turso-libsql-database.md)).
4. Run `bun run seed` against the production database only if you want the
   sample dataset there — it deletes existing compliance records first.

### Deployed

Production: **https://iso-compliance-kms.vercel.app** (Vercel, region `hnd1`;
Turso in `aws-ap-northeast-1`; Vercel Blob for evidence).

The function region is pinned in `vercel.json` because it has to be: `loadGraph`
issues seven queries per request (ADR-0006) and Turso speaks HTTP, so a function
in `iad1` reading a database in Tokyo paid the round trip seven times. Measured
warm, five samples per route, from Jakarta:

| Route            | Before (`iad1`) | After (`hnd1`) |
| ---------------- | --------------- | -------------- |
| `/`              | 1.58 – 2.75 s   | 0.32 – 0.63 s  |
| `/clauses`       | 1.49 – 1.72 s   | 0.37 – 0.55 s  |
| `/matrix`        | 1.81 – 1.92 s   | 0.44 – 0.57 s  |
| `/evidence`      | 1.50 – 1.93 s   | 0.30 – 0.33 s  |
| `/audit-session` | 1.54 – 1.73 s   | 0.28 – 0.39 s  |

Co-locating the function was the whole fix; `loadGraph` was left alone, since
its seven queries already run in parallel and the cost was latency per round
trip, not query count.

## Known limits

- Pack building holds every evidence file in memory in one function
  invocation. Fine at this size (29 files, 66 KB zipped); a repository with
  gigabytes of evidence needs streaming or a queue (ADR-0012).
- The readiness weighting (compliant 1, needs review 0.75, in progress 0.5, gap 0) is a stated assumption, not a customer-supplied formula.
- Referenced-only clause stubs exist so cross-map links resolve; they carry
  weight 0 and are excluded from readiness and dashboard counts.

import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'

import { Users } from './collections/Users'
import { Clauses } from './collections/Clauses'
import { Policies } from './collections/Policies'
import { Forms } from './collections/Forms'
import { Evidence } from './collections/Evidence'
import { Gaps } from './collections/Gaps'
import { Activity } from './collections/Activity'
import { AuditSessions } from './collections/AuditSessions'

const dirname = path.dirname(fileURLToPath(import.meta.url))

// Vercel Blob is only wired up when a token is present, so local dev and CI
// builds work without one.
const blobToken = process.env.BLOB_READ_WRITE_TOKEN

export default buildConfig({
  admin: { user: Users.slug, importMap: { baseDir: path.resolve(dirname) } },
  collections: [Users, Clauses, Policies, Forms, Evidence, Gaps, Activity, AuditSessions],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'dev-secret-change-me',
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || 'file:./iso-kms.db',
      authToken: process.env.DATABASE_AUTH_TOKEN,
    },
    // Schema comes from checked-in migrations, never from the running config:
    // production data is not re-seedable. See ADR-0002.
    push: false,
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  sharp: undefined,
  plugins: blobToken
    ? [
        vercelBlobStorage({
          enabled: true,
          collections: { evidence: true },
          token: blobToken,
          // Blob URLs are public to whoever holds them and the plugin supports
          // no other access level, so the object name is made unguessable and
          // the app serves the bytes itself (ADR-0010).
          addRandomSuffix: true,
        }),
      ]
    : [],
})

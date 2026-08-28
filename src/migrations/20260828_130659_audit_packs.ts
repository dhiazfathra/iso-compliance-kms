import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`audit_packs\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`pack_id\` text NOT NULL,
  	\`status\` text DEFAULT 'building' NOT NULL,
  	\`scope\` text DEFAULT 'All standards' NOT NULL,
  	\`requested_by_id\` integer NOT NULL,
  	\`requested_at\` text NOT NULL,
  	\`completed_at\` text,
  	\`expires_at\` text,
  	\`url\` text,
  	\`pathname\` text,
  	\`size\` numeric,
  	\`item_count\` numeric,
  	\`error\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`requested_by_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(
    sql`CREATE UNIQUE INDEX \`audit_packs_pack_id_idx\` ON \`audit_packs\` (\`pack_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`audit_packs_requested_by_idx\` ON \`audit_packs\` (\`requested_by_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`audit_packs_updated_at_idx\` ON \`audit_packs\` (\`updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`audit_packs_created_at_idx\` ON \`audit_packs\` (\`created_at\`);`,
  )
  await db.run(
    sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`audit_packs_id\` integer REFERENCES audit_packs(id);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_audit_packs_id_idx\` ON \`payload_locked_documents_rels\` (\`audit_packs_id\`);`,
  )
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`audit_packs\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	\`clauses_id\` integer,
  	\`policies_id\` integer,
  	\`forms_id\` integer,
  	\`evidence_id\` integer,
  	\`gaps_id\` integer,
  	\`activity_id\` integer,
  	\`audit_sessions_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`clauses_id\`) REFERENCES \`clauses\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`policies_id\`) REFERENCES \`policies\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`forms_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`evidence_id\`) REFERENCES \`evidence\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`gaps_id\`) REFERENCES \`gaps\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`activity_id\`) REFERENCES \`activity\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`audit_sessions_id\`) REFERENCES \`audit_sessions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "users_id", "clauses_id", "policies_id", "forms_id", "evidence_id", "gaps_id", "activity_id", "audit_sessions_id") SELECT "id", "order", "parent_id", "path", "users_id", "clauses_id", "policies_id", "forms_id", "evidence_id", "gaps_id", "activity_id", "audit_sessions_id" FROM \`payload_locked_documents_rels\`;`,
  )
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(
    sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`,
  )
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_clauses_id_idx\` ON \`payload_locked_documents_rels\` (\`clauses_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_policies_id_idx\` ON \`payload_locked_documents_rels\` (\`policies_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_forms_id_idx\` ON \`payload_locked_documents_rels\` (\`forms_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_evidence_id_idx\` ON \`payload_locked_documents_rels\` (\`evidence_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_gaps_id_idx\` ON \`payload_locked_documents_rels\` (\`gaps_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_activity_id_idx\` ON \`payload_locked_documents_rels\` (\`activity_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_rels_audit_sessions_id_idx\` ON \`payload_locked_documents_rels\` (\`audit_sessions_id\`);`,
  )
}

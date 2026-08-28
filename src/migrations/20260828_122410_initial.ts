import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`users_sessions\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`created_at\` text,
  	\`expires_at\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`users_sessions_order_idx\` ON \`users_sessions\` (\`_order\`);`)
  await db.run(
    sql`CREATE INDEX \`users_sessions_parent_id_idx\` ON \`users_sessions\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`users\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`role\` text NOT NULL,
  	\`access\` text DEFAULT 'write',
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`email\` text NOT NULL,
  	\`reset_password_token\` text,
  	\`reset_password_expiration\` text,
  	\`salt\` text,
  	\`hash\` text,
  	\`login_attempts\` numeric DEFAULT 0,
  	\`lock_until\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`users_updated_at_idx\` ON \`users\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`users_created_at_idx\` ON \`users\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`users_email_idx\` ON \`users\` (\`email\`);`)
  await db.run(sql`CREATE TABLE \`clauses\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`clause_id\` text NOT NULL,
  	\`standard\` text NOT NULL,
  	\`title\` text NOT NULL,
  	\`status\` text DEFAULT 'progress' NOT NULL,
  	\`owner_id\` integer NOT NULL,
  	\`next_review\` text,
  	\`criticality\` numeric DEFAULT 1,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`owner_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`clauses_clause_id_idx\` ON \`clauses\` (\`clause_id\`);`)
  await db.run(sql`CREATE INDEX \`clauses_owner_idx\` ON \`clauses\` (\`owner_id\`);`)
  await db.run(sql`CREATE INDEX \`clauses_updated_at_idx\` ON \`clauses\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`clauses_created_at_idx\` ON \`clauses\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`policies_revisions\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`version\` text NOT NULL,
  	\`date\` text NOT NULL,
  	\`author_id\` integer,
  	\`approval\` text,
  	\`status\` text,
  	\`note\` text,
  	FOREIGN KEY (\`author_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`policies\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`policies_revisions_order_idx\` ON \`policies_revisions\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`policies_revisions_parent_id_idx\` ON \`policies_revisions\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`policies_revisions_author_idx\` ON \`policies_revisions\` (\`author_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`policies\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`version\` text DEFAULT 'v1.0' NOT NULL,
  	\`status\` text DEFAULT 'Draft' NOT NULL,
  	\`owner_id\` integer,
  	\`primary_clause_id\` integer NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`owner_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`primary_clause_id\`) REFERENCES \`clauses\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`policies_name_idx\` ON \`policies\` (\`name\`);`)
  await db.run(sql`CREATE INDEX \`policies_owner_idx\` ON \`policies\` (\`owner_id\`);`)
  await db.run(
    sql`CREATE INDEX \`policies_primary_clause_idx\` ON \`policies\` (\`primary_clause_id\`);`,
  )
  await db.run(sql`CREATE INDEX \`policies_updated_at_idx\` ON \`policies\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`policies_created_at_idx\` ON \`policies\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`policies_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`clauses_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`policies\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`clauses_id\`) REFERENCES \`clauses\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`policies_rels_order_idx\` ON \`policies_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`policies_rels_parent_idx\` ON \`policies_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`policies_rels_path_idx\` ON \`policies_rels\` (\`path\`);`)
  await db.run(
    sql`CREATE INDEX \`policies_rels_clauses_id_idx\` ON \`policies_rels\` (\`clauses_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`forms_external_refs\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`ref\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`forms_external_refs_order_idx\` ON \`forms_external_refs\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`forms_external_refs_parent_id_idx\` ON \`forms_external_refs\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`forms\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`code\` text NOT NULL,
  	\`name\` text NOT NULL,
  	\`policy_id\` integer NOT NULL,
  	\`primary_clause_id\` integer NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`policy_id\`) REFERENCES \`policies\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`primary_clause_id\`) REFERENCES \`clauses\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`forms_code_idx\` ON \`forms\` (\`code\`);`)
  await db.run(sql`CREATE INDEX \`forms_policy_idx\` ON \`forms\` (\`policy_id\`);`)
  await db.run(sql`CREATE INDEX \`forms_primary_clause_idx\` ON \`forms\` (\`primary_clause_id\`);`)
  await db.run(sql`CREATE INDEX \`forms_updated_at_idx\` ON \`forms\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`forms_created_at_idx\` ON \`forms\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`forms_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`clauses_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`clauses_id\`) REFERENCES \`clauses\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`forms_rels_order_idx\` ON \`forms_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`forms_rels_parent_idx\` ON \`forms_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`forms_rels_path_idx\` ON \`forms_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`forms_rels_clauses_id_idx\` ON \`forms_rels\` (\`clauses_id\`);`)
  await db.run(sql`CREATE TABLE \`evidence_revisions\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`version\` text NOT NULL,
  	\`date\` text NOT NULL,
  	\`author_id\` integer,
  	\`note\` text,
  	FOREIGN KEY (\`author_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`evidence\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`evidence_revisions_order_idx\` ON \`evidence_revisions\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`evidence_revisions_parent_id_idx\` ON \`evidence_revisions\` (\`_parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`evidence_revisions_author_idx\` ON \`evidence_revisions\` (\`author_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`evidence\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`file_type\` text NOT NULL,
  	\`form_id\` integer NOT NULL,
  	\`uploader_id\` integer NOT NULL,
  	\`uploaded_at\` text NOT NULL,
  	\`expiry_date\` text,
  	\`review_date\` text,
  	\`retention\` text DEFAULT '3 years',
  	\`sha\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`url\` text,
  	\`thumbnail_u_r_l\` text,
  	\`filename\` text,
  	\`mime_type\` text,
  	\`filesize\` numeric,
  	\`width\` numeric,
  	\`height\` numeric,
  	\`focal_x\` numeric,
  	\`focal_y\` numeric,
  	FOREIGN KEY (\`form_id\`) REFERENCES \`forms\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`uploader_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`evidence_form_idx\` ON \`evidence\` (\`form_id\`);`)
  await db.run(sql`CREATE INDEX \`evidence_uploader_idx\` ON \`evidence\` (\`uploader_id\`);`)
  await db.run(sql`CREATE INDEX \`evidence_updated_at_idx\` ON \`evidence\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`evidence_created_at_idx\` ON \`evidence\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`evidence_filename_idx\` ON \`evidence\` (\`filename\`);`)
  await db.run(sql`CREATE TABLE \`evidence_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`clauses_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`evidence\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`clauses_id\`) REFERENCES \`clauses\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`evidence_rels_order_idx\` ON \`evidence_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`evidence_rels_parent_idx\` ON \`evidence_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`evidence_rels_path_idx\` ON \`evidence_rels\` (\`path\`);`)
  await db.run(
    sql`CREATE INDEX \`evidence_rels_clauses_id_idx\` ON \`evidence_rels\` (\`clauses_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`gaps\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`clause_id\` integer NOT NULL,
  	\`finding\` text NOT NULL,
  	\`task\` text NOT NULL,
  	\`owner_id\` integer NOT NULL,
  	\`due\` text NOT NULL,
  	\`blocking\` integer DEFAULT false,
  	\`progress\` numeric DEFAULT 0,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`clause_id\`) REFERENCES \`clauses\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`owner_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`gaps_clause_idx\` ON \`gaps\` (\`clause_id\`);`)
  await db.run(sql`CREATE INDEX \`gaps_owner_idx\` ON \`gaps\` (\`owner_id\`);`)
  await db.run(sql`CREATE INDEX \`gaps_updated_at_idx\` ON \`gaps\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`gaps_created_at_idx\` ON \`gaps\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`activity\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`at\` text NOT NULL,
  	\`actor\` text NOT NULL,
  	\`action\` text NOT NULL,
  	\`ref\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`activity_updated_at_idx\` ON \`activity\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`activity_created_at_idx\` ON \`activity\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`audit_sessions_clauses_viewed\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`clause_id\` text NOT NULL,
  	\`at\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`audit_sessions\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`audit_sessions_clauses_viewed_order_idx\` ON \`audit_sessions_clauses_viewed\` (\`_order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`audit_sessions_clauses_viewed_parent_id_idx\` ON \`audit_sessions_clauses_viewed\` (\`_parent_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`audit_sessions\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`session_id\` text NOT NULL,
  	\`label\` text NOT NULL,
  	\`auditor_id\` integer NOT NULL,
  	\`started_at\` text NOT NULL,
  	\`expires_at\` text NOT NULL,
  	\`revoked\` integer DEFAULT false,
  	\`downloads\` numeric DEFAULT 0,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`auditor_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(
    sql`CREATE UNIQUE INDEX \`audit_sessions_session_id_idx\` ON \`audit_sessions\` (\`session_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`audit_sessions_auditor_idx\` ON \`audit_sessions\` (\`auditor_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`audit_sessions_updated_at_idx\` ON \`audit_sessions\` (\`updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`audit_sessions_created_at_idx\` ON \`audit_sessions\` (\`created_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`payload_kv\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text NOT NULL,
  	\`data\` text NOT NULL
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`payload_kv_key_idx\` ON \`payload_kv\` (\`key\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`global_slug\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_global_slug_idx\` ON \`payload_locked_documents\` (\`global_slug\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_updated_at_idx\` ON \`payload_locked_documents\` (\`updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_locked_documents_created_at_idx\` ON \`payload_locked_documents\` (\`created_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`payload_locked_documents_rels\` (
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
  await db.run(sql`CREATE TABLE \`payload_preferences\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text,
  	\`value\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(
    sql`CREATE INDEX \`payload_preferences_key_idx\` ON \`payload_preferences\` (\`key\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_preferences_updated_at_idx\` ON \`payload_preferences\` (\`updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_preferences_created_at_idx\` ON \`payload_preferences\` (\`created_at\`);`,
  )
  await db.run(sql`CREATE TABLE \`payload_preferences_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_preferences\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(
    sql`CREATE INDEX \`payload_preferences_rels_order_idx\` ON \`payload_preferences_rels\` (\`order\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_preferences_rels_parent_idx\` ON \`payload_preferences_rels\` (\`parent_id\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_preferences_rels_path_idx\` ON \`payload_preferences_rels\` (\`path\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_preferences_rels_users_id_idx\` ON \`payload_preferences_rels\` (\`users_id\`);`,
  )
  await db.run(sql`CREATE TABLE \`payload_migrations\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`batch\` numeric,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(
    sql`CREATE INDEX \`payload_migrations_updated_at_idx\` ON \`payload_migrations\` (\`updated_at\`);`,
  )
  await db.run(
    sql`CREATE INDEX \`payload_migrations_created_at_idx\` ON \`payload_migrations\` (\`created_at\`);`,
  )
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`users_sessions\`;`)
  await db.run(sql`DROP TABLE \`users\`;`)
  await db.run(sql`DROP TABLE \`clauses\`;`)
  await db.run(sql`DROP TABLE \`policies_revisions\`;`)
  await db.run(sql`DROP TABLE \`policies\`;`)
  await db.run(sql`DROP TABLE \`policies_rels\`;`)
  await db.run(sql`DROP TABLE \`forms_external_refs\`;`)
  await db.run(sql`DROP TABLE \`forms\`;`)
  await db.run(sql`DROP TABLE \`forms_rels\`;`)
  await db.run(sql`DROP TABLE \`evidence_revisions\`;`)
  await db.run(sql`DROP TABLE \`evidence\`;`)
  await db.run(sql`DROP TABLE \`evidence_rels\`;`)
  await db.run(sql`DROP TABLE \`gaps\`;`)
  await db.run(sql`DROP TABLE \`activity\`;`)
  await db.run(sql`DROP TABLE \`audit_sessions_clauses_viewed\`;`)
  await db.run(sql`DROP TABLE \`audit_sessions\`;`)
  await db.run(sql`DROP TABLE \`payload_kv\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_migrations\`;`)
}

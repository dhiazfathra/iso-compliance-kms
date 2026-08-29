import * as migration_20260828_122410_initial from './20260828_122410_initial'
import * as migration_20260828_130659_audit_packs from './20260828_130659_audit_packs'
import * as migration_20260829_010555_policy_body from './20260829_010555_policy_body'

export const migrations = [
  {
    up: migration_20260828_122410_initial.up,
    down: migration_20260828_122410_initial.down,
    name: '20260828_122410_initial',
  },
  {
    up: migration_20260828_130659_audit_packs.up,
    down: migration_20260828_130659_audit_packs.down,
    name: '20260828_130659_audit_packs',
  },
  {
    up: migration_20260829_010555_policy_body.up,
    down: migration_20260829_010555_policy_body.down,
    name: '20260829_010555_policy_body',
  },
]

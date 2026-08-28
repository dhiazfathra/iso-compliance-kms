import * as migration_20260828_122410_initial from './20260828_122410_initial'

export const migrations = [
  {
    up: migration_20260828_122410_initial.up,
    down: migration_20260828_122410_initial.down,
    name: '20260828_122410_initial',
  },
]

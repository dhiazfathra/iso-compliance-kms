import type { SeedDocument } from './types'
import { SECURITY_DOCUMENTS } from './security'
import { ENGINEERING_DOCUMENTS } from './engineering'
import { MEASUREMENT_DOCUMENTS } from './measurement'
import { GOVERNANCE_DOCUMENTS } from './governance'

export type { SeedDocument, SeedEvidence, SeedRevision, DocFormat } from './types'

/** Every real controlled document the seed loads, in register order. */
export const DOCUMENTS: SeedDocument[] = [
  ...SECURITY_DOCUMENTS,
  ...ENGINEERING_DOCUMENTS,
  ...MEASUREMENT_DOCUMENTS,
  ...GOVERNANCE_DOCUMENTS,
]

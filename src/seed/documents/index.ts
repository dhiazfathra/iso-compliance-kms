import type { SeedDocument } from './types'
import { SECURITY_DOCUMENTS } from './security'
import { ENGINEERING_DOCUMENTS } from './engineering'
import { MEASUREMENT_DOCUMENTS } from './measurement'
import { GOVERNANCE_DOCUMENTS } from './governance'
import { ANNEX_A5_A_1 } from './annex-a5-a-1'
import { ANNEX_A5_A_2 } from './annex-a5-a-2'
import { ANNEX_A5_B_1 } from './annex-a5-b-1'
import { ANNEX_A5_B_2 } from './annex-a5-b-2'
import { ANNEX_A5_C } from './annex-a5-c'
import { ANNEX_A6_PEOPLE } from './annex-a6-people'
import { ANNEX_A7_PHYSICAL_1 } from './annex-a7-physical-1'
import { ANNEX_A7_PHYSICAL_2 } from './annex-a7-physical-2'
import { ANNEX_A8_A } from './annex-a8-a'
import { ANNEX_A8_B } from './annex-a8-b'
import { ANNEX_A8_C } from './annex-a8-c'
import { QMS_CONTEXT_LEADERSHIP_PLANNING } from './qms-context-leadership-planning'
import { QMS_SUPPORT } from './qms-support'
import { QMS_OPERATION_A } from './qms-operation-a'
import { QMS_OPERATION_B } from './qms-operation-b'
import { QMS_EVALUATION_IMPROVEMENT_1 } from './qms-evaluation-improvement-1'
import { QMS_EVALUATION_IMPROVEMENT_2 } from './qms-evaluation-improvement-2'
import { QMS_SUBCLAUSES_4_7 } from './qms-subclauses-4-7'
import { QMS_SUBCLAUSES_8 } from './qms-subclauses-8'
import { ISMS_CLAUSES_8_10 } from './isms-clauses-8-10'
import { ISMS_CLAUSES_6_7 } from './isms-clauses-6-7'
import { ISMS_CLAUSES_4_5 } from './isms-clauses-4-5'

export type { SeedDocument, SeedEvidence, SeedRevision, DocFormat } from './types'

/** Every real controlled document seed loads, in register order. */
export const DOCUMENTS: SeedDocument[] = [
  ...SECURITY_DOCUMENTS,
  ...ENGINEERING_DOCUMENTS,
  ...MEASUREMENT_DOCUMENTS,
  ...GOVERNANCE_DOCUMENTS,
  ...ANNEX_A5_A_1,
  ...ANNEX_A5_A_2,
  ...ANNEX_A5_B_1,
  ...ANNEX_A5_B_2,
  ...ANNEX_A5_C,
  ...ANNEX_A6_PEOPLE,
  ...ANNEX_A7_PHYSICAL_1,
  ...ANNEX_A7_PHYSICAL_2,
  ...ANNEX_A8_A,
  ...ANNEX_A8_B,
  ...ANNEX_A8_C,
  ...QMS_CONTEXT_LEADERSHIP_PLANNING,
  ...QMS_SUPPORT,
  ...QMS_OPERATION_A,
  ...QMS_OPERATION_B,
  ...QMS_EVALUATION_IMPROVEMENT_1,
  ...QMS_EVALUATION_IMPROVEMENT_2,
  ...QMS_SUBCLAUSES_4_7,
  ...QMS_SUBCLAUSES_8,
  ...ISMS_CLAUSES_4_5,
  ...ISMS_CLAUSES_6_7,
  ...ISMS_CLAUSES_8_10,
]

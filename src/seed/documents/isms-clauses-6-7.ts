import type { SeedDocument } from './types'

/** ISO/IEC 27001:2022 clauses 6 and 7 — ISMS planning and support. */
export const ISMS_CLAUSES_6_7: SeedDocument[] = [
  {
    code: 'ISMS-POL-C6-1',
    title: 'ISMS Planning Framework — Risks and Opportunities',
    clause: '27001 6.1',
    crossRefs: ['27001 6.1.1', '27001 6.1.2', '27001 6.1.3', '27001 4.4', '9001 6.1'],
    version: 'v2.1',
    owner: 'Dhiaz Fathra',
    form: { code: 'FRM-ISMS-C6-1-01', name: 'ISMS planning input and outcome sheet' },
    revisions: [
      {
        version: 'v1.4',
        date: '2024-07-30',
        author: 'Agil',
        approval: 'Reviewed by Dhiaz Fathra',
        status: 'Superseded',
        note: 'Planning ran once a year against a spreadsheet of threats with no link to the interested-party analysis.',
      },
      {
        version: 'v2.0',
        date: '2025-08-14',
        author: 'Dhiaz Fathra',
        approval: 'Reviewed by Aris Ihwan',
        status: 'Superseded',
        note: 'Framework rewritten to bind planning inputs to clause 4 context and to name opportunities, not only risks.',
      },
      {
        version: 'v2.1',
        date: '2026-03-05',
        author: 'Dhiaz Fathra',
        approval: 'Approved by Aris Ihwan',
        status: 'Current',
        note: 'Quarterly planning trigger added after the March CloudFront change bypassed the cycle entirely.',
      },
    ],
    evidence: [
      {
        name: 'isms-c6-1-planning-inputs-2026.xlsx',
        fileType: 'XLSX',
        uploadedAt: '2026-03-12',
        expiryDate: '2027-03-12',
        uploader: 'Agil',
        note: 'Planning input sheet for the 2026 cycle: context issue, party, risk or opportunity, and the owner who carries it.',
        body: [
          'Input | Source | Risk or opportunity | Owner | Planned outcome',
          'Patient photo archive growth (11.4 TB, ap-southeast-1) | Context issue C-03 | Risk — retention drift past the 7 year clinical limit | Agil | S3 lifecycle rules enforced by policy, verified quarterly',
          'BPJS and insurer data exchange | Interested party — payers | Risk — unencrypted SFTP drop at two payers | Tika | Move both to SFTP over VPN by 2026-06-30',
          'Clinic tablet fleet across 13 sites | Context issue C-07 | Risk — devices leaving site unwiped | Pak Andre | MDM enrolment mandatory before hand-over',
          'Single-region AWS footprint | Context issue C-11 | Opportunity — cross-region backup lowers RTO to 4h | Agil | Jakarta to Singapore copy funded in Q3',
          'New Bintaro clinic opening | Business plan 2026 | Risk — site live before network hardening signed off | Pak Chen | Hardening checklist gates the opening date',
          'Engineering hiring (6 roles) | Resource plan 2026 | Opportunity — dedicated security engineer | Dhiaz Fathra | Role approved, offer out 2026-04',
        ].join('\n'),
      },
    ],
    body: `# ISMS-POL-C6-1 · ISMS Planning Framework — Risks and Opportunities

**Owner** Dhiaz Fathra · **Approver** Aris Ihwan · **Version** v2.1 · **Review** annually, and after any change to the ISMS scope
**Requirement** ISO 27001 6.1 · **Also satisfies** 27001 6.1.1, 27001 6.1.2, 27001 6.1.3, 27001 4.4, 9001 6.1

## Purpose

Dermaster Indonesia holds patient identity, clinical photography and treatment records for 13
clinics, and runs the platform that carries them on AWS ap-southeast-1. This framework states
how the organisation decides what could stop the ISMS achieving its intended outcome, what
could help it, and how those decisions become funded work rather than a list nobody reads.
It is the parent document: the risk assessment procedure, the risk treatment procedure and the
objectives register sit underneath it and inherit its definitions.

## Scope

All information assets, processes, people and suppliers inside the ISMS scope statement —
clinic operations at every location, the engineering group, and the AWS estate. Clinical
outcome risk to a patient is a matter for the clinical governance committee and enters this
framework only where it depends on information or on a system.

## Roles and responsibilities

- **Aris Ihwan** owns the risk appetite and accepts any residual risk rated High.
- **Dhiaz Fathra** owns this framework and chairs the quarterly planning meeting.
- **Agil** supplies the platform and infrastructure inputs from real telemetry, not estimates.
- **Pak Andre** supplies the clinic operations input across the 13 locations.
- **Tika** maintains the risk register and the traceability from input to treatment plan.
- **Pak Chen** supplies the supplier and procurement input.

## Framework

1. Planning inputs are the clause 4 context issues, the interested-party requirements, the
   previous cycle's residual risks, incidents closed since the last cycle, audit findings, and
   the change pipeline. Each input is recorded on FRM-ISMS-C6-1-01 with a named owner.
2. Every input is classified as a risk, an opportunity, or both. Opportunities are recorded
   with the same discipline as risks; an ISMS that only records threats plans badly.
3. Risks pass to ISMS-SOP-C6-1-2 for assessment. Treatment decisions are made under
   ISMS-SOP-C6-1-3 and land in the Statement of Applicability.
4. Opportunities pass to the objectives register, ISMS-REG-C6-2, where they acquire a measure,
   a date and a budget line, or they are closed with a reason.
5. Planning runs quarterly, not annually. Any change that alters the ISMS scope, adds a
   processing location, or introduces a new external data flow triggers an out-of-cycle
   planning entry within 10 working days.
6. Actions planned here are integrated into the ISMS processes that deliver them — nothing is
   held as a standalone action list — and their effectiveness is evaluated at the next
   management review.

## Records

FRM-ISMS-C6-1-01 for each cycle, retained six years, held in this repository under the ISMS
planning folder alongside the meeting record that approved it.

## Review

Annually by Dhiaz Fathra, and immediately after any scope change or any incident rated Major.
`,
  },
  {
    code: 'ISMS-POL-C6-1-1',
    title: 'Determining Risks and Opportunities — General Method',
    clause: '27001 6.1.1',
    crossRefs: ['27001 6.1', '27001 4.1', '27001 4.2', '27001 9.3', '9001 6.1.1'],
    version: 'v1.6',
    owner: 'Tika',
    form: { code: 'FRM-ISMS-C6-1-1-01', name: 'Context-to-risk traceability sheet' },
    revisions: [
      {
        version: 'v1.4',
        date: '2024-11-06',
        author: 'Tika',
        approval: 'Reviewed by Dhiaz Fathra',
        status: 'Superseded',
        note: 'First issue of the traceability sheet; context issues were still copied by hand each cycle.',
      },
      {
        version: 'v1.6',
        date: '2026-02-02',
        author: 'Tika',
        approval: 'Approved by Dhiaz Fathra',
        status: 'Current',
        note: 'Orphan test added — a context issue with no risk, opportunity or written justification now fails the cycle.',
      },
    ],
    evidence: [
      {
        name: 'isms-c6-1-1-traceability-q1-2026.md',
        fileType: 'MD',
        uploadedAt: '2026-04-08',
        expiryDate: '2026-10-08',
        uploader: 'Tika',
        note: 'Q1 2026 traceability run: every context issue accounted for, two closed with justification.',
        body: [
          '# Context-to-risk traceability — Q1 2026',
          '',
          'Issue | Type | Carried to | Reference | Checked by',
          'C-01 Ministry of Health record retention | External | Risk register | RSK-2026-004 | Tika',
          'C-03 Photo archive growth | Internal | Risk register | RSK-2026-011 | Agil',
          'C-05 Payer data exchange | Interested party | Risk register | RSK-2026-013 | Tika',
          'C-07 Clinic tablet fleet | Internal | Risk register | RSK-2026-018 | Pak Andre',
          'C-09 Vendor laser maintenance access | External | Risk register | RSK-2026-021 | Pak Chen',
          'C-11 Single-region footprint | Internal | Objective OBJ-2026-03 | Opportunity | Agil',
          'C-12 Franchise enquiry, Surabaya | External | Closed — out of ISMS scope until a contract exists | Justified 2026-03-04 | Dhiaz Fathra',
          'C-14 Legacy on-prem NAS, Kemang | Internal | Closed — decommissioned 2026-01-22, disposal certificate filed | Justified 2026-03-04 | Agil',
          '',
          'Orphans found: 0. Cycle passes.',
        ].join('\n'),
      },
    ],
    body: `# ISMS-POL-C6-1-1 · Determining Risks and Opportunities — General Method

**Owner** Tika · **Approver** Dhiaz Fathra · **Version** v1.6 · **Review** annually
**Requirement** ISO 27001 6.1.1 · **Also satisfies** 27001 6.1, 27001 4.1, 27001 4.2, 27001 9.3, 9001 6.1.1

## Purpose

Clause 6.1.1 asks the organisation to determine risks and opportunities from its context and
from the needs of interested parties. This procedure states the mechanical part: how a context
issue at Dermaster becomes an entry in the risk register or the objectives register, and how we
prove at audit that none of them was quietly dropped.

## Scope

Every issue recorded in the ISMS context analysis and every requirement recorded in the
interested-party register — patients, the Ministry of Health, BPJS and private payers, device
vendors, AWS as processor, clinic landlords, and our own staff.

## Roles and responsibilities

- **Tika** runs the traceability sheet each quarter and reports orphans to the ISMS owner.
- **Dhiaz Fathra** approves any closure of a context issue without a downstream entry.
- **Agil** and **Pak Andre** confirm that platform and clinic issues are stated as they are
  actually experienced on site, not as the register would prefer them.

## Method

1. Each cycle starts from the current context analysis and interested-party register. Nothing
   is retyped; entries carry their identifier (C-nn) forward unchanged.
2. For every issue, the reviewer records one of three outcomes: it becomes a risk (with a
   register identifier), it becomes an opportunity (with an objective identifier), or it is
   closed with a written justification naming who decided and on what date.
3. An issue with none of the three is an orphan. Any orphan fails the cycle: the sheet is not
   signed off until each is resolved. This test exists because the 2024 cycle carried the
   Kemang NAS for three quarters with nobody owning it.
4. Determination is not scoring. Likelihood and consequence are set later, under
   ISMS-SOP-C6-1-2, so that the same issue is not argued twice.
5. The intended outcomes the ISMS must achieve — patient confidentiality, availability of the
   clinic booking and record systems during operating hours, and integrity of the clinical
   record — are stated at the top of every sheet, so that "prevent or reduce undesired effects"
   has something concrete to point at.
6. Interested-party requirements that are legal or contractual are marked as such; they cannot
   be closed as out of scope without a written legal opinion from the group's counsel.

## Records

FRM-ISMS-C6-1-1-01, one per quarter, retained six years. Closure justifications are held in
the same sheet, never in a separate document.

## Review

Annually, and whenever the context analysis is reissued.
`,
  },
  {
    code: 'ISMS-SOP-C6-1-2',
    title: 'Information Security Risk Assessment Procedure',
    clause: '27001 6.1.2',
    crossRefs: ['27001 6.1.3', '27001 8.2', '27001 6.1.1', '27001 9.3', 'A.5.7'],
    version: 'v3.0',
    owner: 'Dhiaz Fathra',
    form: { code: 'FRM-ISMS-C6-1-2-01', name: 'Information security risk register' },
    revisions: [
      {
        version: 'v2.2',
        date: '2024-10-01',
        author: 'Agil',
        approval: 'Reviewed by Dhiaz Fathra',
        status: 'Superseded',
        note: 'Asset-threat-vulnerability method with a 3x3 matrix; produced 180 entries and no priorities anyone acted on.',
      },
      {
        version: 'v3.0',
        date: '2025-11-18',
        author: 'Dhiaz Fathra',
        approval: 'Approved by Aris Ihwan',
        status: 'Current',
        note: 'Scenario-based method with a 5x5 matrix, explicit acceptance criteria and named risk owners; register capped by materiality, not by asset count.',
      },
    ],
    evidence: [
      {
        name: 'isms-c6-1-2-risk-register-2026.xlsx',
        fileType: 'XLSX',
        uploadedAt: '2026-04-15',
        expiryDate: '2027-04-15',
        uploader: 'Tika',
        note: 'Live risk register at the Q1 2026 assessment, showing inherent and residual scores after treatment.',
        body: [
          'ID | Scenario | Owner | Likelihood | Consequence | Inherent | Residual | Decision',
          'RSK-2026-004 | Clinical records deleted before the 7 year retention limit by an S3 lifecycle error | Agil | 2 | 5 | 10 High | 4 Low | Treat — versioning plus Object Lock on the records bucket',
          'RSK-2026-011 | Patient photo archive exposed via a mis-scoped presigned URL | Agil | 3 | 5 | 15 High | 6 Medium | Treat — 15 minute URL expiry, per-request audit log',
          'RSK-2026-013 | Payer file intercepted on plain SFTP to two insurers | Tika | 3 | 4 | 12 High | 4 Low | Treat — SFTP over VPN, both migrated 2026-06',
          'RSK-2026-018 | Clinic tablet lost with cached patient list | Pak Andre | 4 | 3 | 12 High | 6 Medium | Treat — MDM, remote wipe, no local cache beyond the session',
          'RSK-2026-021 | Laser vendor engineer uses a shared maintenance account | Pak Chen | 3 | 3 | 9 Medium | 3 Low | Treat — named accounts, access window, session recorded',
          'RSK-2026-026 | Single-region outage stops booking across all 13 clinics | Agil | 2 | 4 | 8 Medium | 8 Medium | Accept for 2026 — accepted by Aris Ihwan 2026-04-15, review Q4',
        ].join('\n'),
      },
      {
        name: 'isms-c6-1-2-assessment-minutes-2026-04.docx',
        fileType: 'DOCX',
        uploadedAt: '2026-04-16',
        uploader: 'Dhiaz Fathra',
        note: 'Minutes of the Q1 2026 assessment workshop, including the one accepted High-adjacent residual.',
        body: [
          'Q1 2026 risk assessment workshop — 15 April 2026, 09:00-12:20, Jakarta HQ and video',
          'Present: Dhiaz Fathra (chair), Aris Ihwan, Agil, Tika, Pak Andre, Pak Chen',
          '',
          'Item | Discussion | Outcome',
          '1 Criteria | Confirmed unchanged from v3.0: accept at <= 6, treat above | Carried',
          '2 RSK-2026-011 | Presigned URL expiry was 24h; Agil demonstrated a link still live after a week | Treat, expiry cut to 15 minutes, done 2026-04-22',
          '3 RSK-2026-018 | Pak Andre reported two tablets unaccounted for at Kelapa Gading in Feb | Treat, MDM enrolment mandatory, fleet audit by 2026-05-15',
          '4 RSK-2026-026 | Cross-region standby costed at 4,800 USD/mo; not funded this year | Accepted by Aris Ihwan, recorded with expiry Q4 2026',
          '5 Retired | RSK-2025-009 (Kemang NAS) closed, asset disposed 2026-01-22 | Removed from register',
        ].join('\n'),
      },
    ],
    body: `# ISMS-SOP-C6-1-2 · Information Security Risk Assessment Procedure

**Owner** Dhiaz Fathra · **Approver** Aris Ihwan · **Version** v3.0 · **Review** annually
**Requirement** ISO 27001 6.1.2 · **Also satisfies** 27001 6.1.3, 27001 8.2, 27001 6.1.1, 27001 9.3, A.5.7

## Purpose

To define and apply one repeatable information security risk assessment process for Dermaster,
so that assessments run at different times by different people produce comparable and valid
results, and so that every risk has a person who owns it by name.

## Scope

All information within the ISMS scope: patient identity and clinical records, clinical
photography, payer exchanges, staff records, source code and infrastructure credentials, at
all 13 clinics and in the AWS ap-southeast-1 estate.

## Roles and responsibilities

- **Dhiaz Fathra** owns this procedure and chairs each assessment workshop.
- **Tika** maintains the register and is the only person who edits scores after a workshop.
- **Risk owners** — named per entry — own the residual risk and the treatment actions.
- **Aris Ihwan** is the only person who may accept a residual risk above the acceptance line.

## Risk criteria

1. **Acceptance criteria.** Residual score of 6 or below is acceptable without further action.
   Above 6 must be treated, or accepted in writing by Aris Ihwan with an expiry date of no more
   than 12 months, after which it returns to the workshop.
2. **Performance criteria.** Likelihood 1-5 (1 = not expected in five years, 5 = expected
   monthly) and consequence 1-5 judged on the worst of confidentiality, integrity and
   availability. Consequence 5 means patient harm, a reportable data breach, or clinic
   operations stopped for more than one working day.

## Procedure

1. Assessment is scenario based, not asset-inventory based. A scenario names what happens, to
   which information, through which failure. The v2.2 asset-by-asset method produced 180 rows
   that nobody prioritised; that method is withdrawn.
2. Risks are identified from the planning inputs (ISMS-POL-C6-1), incidents, audit findings,
   vulnerability scan output, and the change pipeline.
3. Each risk is analysed for likelihood and consequence, scored, and given an inherent rating
   before controls, then a residual rating with existing controls applied. Both are recorded;
   a register that shows only residual hides how much the controls are carrying.
4. Risks are evaluated against the acceptance criteria and ordered for treatment. Treatment is
   decided under ISMS-SOP-C6-1-3.
5. Assessments run quarterly, and out of cycle within 10 working days of any Major incident,
   any new external data flow, or any new clinic location.
6. Every entry names a risk owner. An entry without one is not accepted into the register.

## Records

FRM-ISMS-C6-1-2-01 (the register) is retained for the life of the ISMS with each quarterly
snapshot kept six years. Workshop minutes are retained six years.

## Review

Annually, and after any assessment where the criteria were argued rather than applied.
`,
  },
  {
    code: 'ISMS-SOP-C6-1-3',
    title: 'Information Security Risk Treatment and Statement of Applicability',
    clause: '27001 6.1.3',
    crossRefs: ['27001 6.1.2', '27001 5.1', '27001 9.3', 'A.5.1', 'A.5.35'],
    version: 'v4.2',
    owner: 'Dhiaz Fathra',
    form: {
      code: 'FRM-ISMS-C6-1-3-01',
      name: 'Risk treatment plan and Statement of Applicability',
    },
    revisions: [
      {
        version: 'v4.0',
        date: '2024-12-09',
        author: 'Dhiaz Fathra',
        approval: 'Reviewed by Aris Ihwan',
        status: 'Superseded',
        note: 'Statement of Applicability rebuilt against Annex A of the 2022 edition, 93 controls.',
      },
      {
        version: 'v4.1',
        date: '2025-09-23',
        author: 'Tika',
        approval: 'Reviewed by Dhiaz Fathra',
        status: 'Superseded',
        note: 'Exclusion justifications rewritten; five read "not applicable" with no reason given.',
      },
      {
        version: 'v4.2',
        date: '2026-03-19',
        author: 'Dhiaz Fathra',
        approval: 'Approved by Aris Ihwan',
        status: 'Current',
        note: 'Risk owner approval of the plan and acceptance of residual risk separated into two signatures.',
      },
    ],
    evidence: [
      {
        name: 'isms-c6-1-3-statement-of-applicability-v4-2.xlsx',
        fileType: 'XLSX',
        uploadedAt: '2026-03-24',
        expiryDate: '2027-03-24',
        uploader: 'Tika',
        note: 'Approved Statement of Applicability v4.2 — 93 Annex A controls, inclusion or exclusion justified per row.',
        body: [
          'Control | Applicable | Justification | Implemented | Owner',
          'A.5.7 Threat intelligence | Yes | AWS GuardDuty and vendor advisories feed the quarterly assessment | Yes | Agil',
          'A.5.14 Information transfer | Yes | Payer exchanges and referral letters leave the organisation daily | Partial — two payers migrate to SFTP over VPN by 2026-06-30 | Tika',
          'A.5.23 Cloud services security | Yes | Whole platform runs on AWS ap-southeast-1 | Yes | Agil',
          'A.7.4 Physical security monitoring | Yes | 13 clinics hold records and devices on site | Yes | Pak Andre',
          'A.8.11 Data masking | Yes | Engineers use masked patient data in staging | Yes | Dhiaz Fathra',
          'A.8.23 Web filtering | Yes | Clinic and HQ endpoints filtered at the firewall | Yes | Agil',
          'A.5.19 Supplier relationships | Yes | Laser vendors, payers and AWS | Yes | Pak Chen',
          'A.8.30 Outsourced development | No | All application development is in-house; no development is outsourced. Reinstated if the position changes | n/a | Dhiaz Fathra',
        ].join('\n'),
      },
      {
        name: 'isms-c6-1-3-treatment-plan-2026.md',
        fileType: 'MD',
        uploadedAt: '2026-04-20',
        expiryDate: '2027-04-20',
        uploader: 'Dhiaz Fathra',
        note: 'Risk treatment plan for 2026 with owner approval and residual acceptance signatures.',
        body: [
          '# Risk treatment plan 2026',
          '',
          'Risk | Option | Action | Controls | Due | Plan approved by | Residual accepted by',
          'RSK-2026-004 | Modify | Object Lock and versioning on the records bucket | A.8.13, A.5.33 | 2026-05-30 | Agil | Agil',
          'RSK-2026-011 | Modify | 15 minute presigned URL expiry, per-request audit log | A.8.3, A.8.15 | 2026-04-22 (done) | Agil | Agil',
          'RSK-2026-013 | Modify | SFTP over VPN with both payers | A.5.14, A.8.24 | 2026-06-30 | Tika | Tika',
          'RSK-2026-018 | Modify | MDM enrolment, remote wipe, no session cache | A.8.1, A.7.9 | 2026-05-15 | Pak Andre | Pak Andre',
          'RSK-2026-021 | Modify | Named vendor accounts with a booked access window | A.5.19, A.8.18 | 2026-05-08 | Pak Chen | Pak Chen',
          'RSK-2026-026 | Accept | Cross-region standby deferred, 4,800 USD/mo unfunded | — | Review Q4 2026 | Agil | Aris Ihwan',
        ].join('\n'),
      },
    ],
    body: `# ISMS-SOP-C6-1-3 · Information Security Risk Treatment and Statement of Applicability

**Owner** Dhiaz Fathra · **Approver** Aris Ihwan · **Version** v4.2 · **Review** annually, and at every quarterly assessment
**Requirement** ISO 27001 6.1.3 · **Also satisfies** 27001 6.1.2, 27001 5.1, 27001 9.3, A.5.1, A.5.35

## Purpose

To state how Dermaster chooses what to do about an assessed information security risk, how the
chosen controls are compared against Annex A so that nothing necessary is missed, and how the
Statement of Applicability is produced, justified and approved.

## Scope

Every risk in FRM-ISMS-C6-1-2-01 rated above the acceptance line, and every control in Annex A
of ISO/IEC 27001:2022 whether applied or not.

## Roles and responsibilities

- **Dhiaz Fathra** determines the treatment options with the risk owner and maintains the SoA.
- **Risk owners** approve the treatment plan for their own risks.
- **Aris Ihwan** approves the SoA and accepts any residual risk above the acceptance line.
- **Tika** holds the version history of the SoA and reconciles it with the register quarterly.

## Procedure

1. For each risk above the line, the risk owner selects a treatment option: modify, avoid,
   share, or accept. The option is recorded with the reason in one sentence.
2. Controls necessary to implement the option are determined from the risk itself, not from a
   catalogue. Controls are then compared against all 93 Annex A controls to confirm none has
   been overlooked. Annex A is the check, not the starting point.
3. The Statement of Applicability records, for every Annex A control: whether it applies, the
   justification, and whether it is implemented. An exclusion says why in a full sentence; the
   words "not applicable" alone are a finding against this procedure.
4. The risk treatment plan names the action, the controls, the due date and the owner. Plans
   are approved by the risk owner. Acceptance of the *residual* risk is a separate signature,
   and above the acceptance line it can only be Aris Ihwan's.
5. Overdue treatment actions are reported to the ISMS owner monthly and to management review
   quarterly. An action overdue by two reporting cycles reverts to an accepted risk with a
   written acceptance, so the register never carries a fiction.
6. The SoA is reissued whenever a control's applicability or implementation state changes, and
   at minimum annually. Superseded versions are retained.

## Records

FRM-ISMS-C6-1-3-01 — the treatment plan and the SoA — retained for the life of the ISMS, with
each approved version kept six years.

## Review

Annually by Dhiaz Fathra, and at every quarterly risk assessment where a treatment option is
changed.
`,
  },
  {
    code: 'ISMS-REG-C6-2',
    title: 'Information Security Objectives and Plans to Achieve Them',
    clause: '27001 6.2',
    crossRefs: ['27001 6.1', '27001 9.1', '27001 9.3', '27001 5.2', '9001 6.2'],
    version: 'v2.3',
    owner: 'Aris Ihwan',
    form: { code: 'FRM-ISMS-C6-2-01', name: 'Information security objectives register' },
    revisions: [
      {
        version: 'v2.1',
        date: '2025-01-15',
        author: 'Dhiaz Fathra',
        approval: 'Reviewed by Aris Ihwan',
        status: 'Superseded',
        note: 'Objectives carried a target but no owner or resource line; three of six had no way to be measured.',
      },
      {
        version: 'v2.3',
        date: '2026-01-27',
        author: 'Aris Ihwan',
        approval: 'Approved by Aris Ihwan',
        status: 'Current',
        note: '2026 objectives set with measure, baseline, owner, resource and evaluation date; two 2025 objectives closed as not achieved with reasons recorded.',
      },
    ],
    evidence: [
      {
        name: 'isms-c6-2-objectives-register-2026.xlsx',
        fileType: 'XLSX',
        uploadedAt: '2026-02-03',
        expiryDate: '2027-02-03',
        uploader: 'Tika',
        note: 'Approved 2026 objectives with the 2025 outturn kept alongside, including the two that were missed.',
        body: [
          'ID | Objective | Measure | Baseline 2025 | Target 2026 | Owner | Resource | Evaluated',
          'OBJ-2026-01 | Cut mean time to patch a critical CVE on production | Days from advisory to deploy | 21 | 7 | Agil | Existing platform team | Quarterly',
          'OBJ-2026-02 | Every clinic tablet enrolled in MDM | % of fleet enrolled | 62% | 100% by 2026-05-15 | Pak Andre | 90,000,000 IDR licences | Monthly',
          'OBJ-2026-03 | Cross-region backup of clinical records | RTO in hours | 26 | 4 | Agil | 4,800 USD/mo, Q3 funding | At Q4 review',
          'OBJ-2026-04 | Security awareness completion for clinical staff | % completed within 30 days of hire | 71% | 95% | Rica | Existing LMS | Quarterly',
          'OBJ-2026-05 | No plaintext patient data leaving the estate | Count of unencrypted external transfers | 2 payers | 0 by 2026-06-30 | Tika | Engineering time, 12 days | Monthly',
          'OBJ-2025-04 (closed) | Phishing simulation click rate below 5% | Click rate | 11% | 5% | Rica | — | Not achieved, closed at 8%, carried into awareness plan 2026',
          'OBJ-2025-06 (closed) | Retire the Kemang on-prem NAS | Decommission date | — | 2025-09-30 | Agil | — | Achieved late, 2026-01-22, disposal certificate filed',
        ].join('\n'),
      },
    ],
    body: `# ISMS-REG-C6-2 · Information Security Objectives and Plans to Achieve Them

**Owner** Aris Ihwan · **Approver** Aris Ihwan · **Version** v2.3 · **Review** annually in January, evaluated quarterly
**Requirement** ISO 27001 6.2 · **Also satisfies** 27001 6.1, 27001 9.1, 27001 9.3, 27001 5.2, 9001 6.2

## Purpose

To set information security objectives for Dermaster at the levels and functions where they can
actually be delivered, and to record for each one what will be done, what resources it needs,
who is responsible, when it is due, and how the result will be evaluated.

## Scope

Group-level objectives set by the board, platform objectives held by engineering, and clinic
operations objectives held by the operations lead. Departmental targets that carry no
information security consequence are out of scope and belong to the business plan.

## Roles and responsibilities

- **Aris Ihwan** approves the objectives and the resources committed to them.
- **Dhiaz Fathra** proposes objectives from the risk register and the planning inputs.
- **Agil**, **Pak Andre**, **Rica** and **Tika** own the objectives listed against their names
  and report progress at the quarterly evaluation.

## Rules

1. Every objective is consistent with the information security policy and traceable to either a
   risk in FRM-ISMS-C6-1-2-01 or an opportunity recorded under ISMS-POL-C6-1.
2. Every objective is measurable where practicable, and where it is not, the register records
   how it will be judged instead. "Improve security posture" is not an objective and is not
   accepted into the register.
3. Every objective records: the measure, the current baseline, the target, the owner, the
   resources required, the completion date and the evaluation frequency. An objective without a
   funded resource line is either resourced or removed — it is not carried as an aspiration.
4. Objectives are monitored quarterly and reported at management review. The register keeps
   closed objectives visible for a full year, including the ones not achieved and why.
5. Objectives are updated as needed during the year; a change is a new row version, never an
   edit over the original target, so that the record shows what was actually promised.
6. Applicable information security requirements and the results of risk assessment and
   treatment are taken into account when objectives are set each January.

## Records

FRM-ISMS-C6-2-01, retained six years, with the quarterly evaluation notes attached.

## Review

Annually in January by Aris Ihwan, and at any management review where two consecutive quarters
show an objective off track.
`,
  },
  {
    code: 'ISMS-POL-C6-3',
    title: 'Planning of Changes to the ISMS',
    clause: '27001 6.3',
    crossRefs: ['27001 6.1', '27001 8.1', '27001 9.3', 'A.8.32', '9001 6.3'],
    version: 'v1.4',
    owner: 'Dhiaz Fathra',
    form: { code: 'FRM-ISMS-C6-3-01', name: 'ISMS change planning record' },
    revisions: [
      {
        version: 'v1.2',
        date: '2025-04-11',
        author: 'Dhiaz Fathra',
        approval: 'Reviewed by Aris Ihwan',
        status: 'Superseded',
        note: 'First issue after the 2022 edition added clause 6.3; covered documented changes only.',
      },
      {
        version: 'v1.4',
        date: '2026-03-30',
        author: 'Dhiaz Fathra',
        approval: 'Approved by Aris Ihwan',
        status: 'Current',
        note: 'Scope and organisational changes brought in after the March CloudFront rollout changed a data flow without an ISMS entry.',
      },
    ],
    evidence: [
      {
        name: 'isms-c6-3-change-record-2026.md',
        fileType: 'MD',
        uploadedAt: '2026-05-06',
        expiryDate: '2027-05-06',
        uploader: 'Tika',
        note: 'ISMS change planning records for 2026 to date, including the change that prompted v1.4.',
        body: [
          '# ISMS change planning records — 2026',
          '',
          'Ref | Change | Purpose | ISMS consequence | Resources | Decided | Approved by',
          'CHG-ISMS-2026-01 | CloudFront in front of the patient portal | Latency for eastern clinics | New egress path, WAF rules and log destination changed; RSK-2026-011 rescored | Existing team | 2026-03-11 (retrospective entry 2026-03-18) | Dhiaz Fathra',
          'CHG-ISMS-2026-02 | Bintaro clinic joins the ISMS scope | 14th location opening Q3 | Scope statement, asset register, physical controls A.7.x extended | 1 site survey, 40,000,000 IDR hardening | 2026-04-02 | Aris Ihwan',
          'CHG-ISMS-2026-03 | Security engineer role created | Dedicated ownership of A.8 controls | Responsibilities moved from Agil; RACI reissued | Headcount approved in resource plan | 2026-04-09 | Aris Ihwan',
          'CHG-ISMS-2026-04 | Move staff records to the HR SaaS | Retire the local share | New processor, DPA required, A.5.19 applies | Legal review 3 days | 2026-05-04 | Dhiaz Fathra',
        ].join('\n'),
      },
    ],
    body: `# ISMS-POL-C6-3 · Planning of Changes to the ISMS

**Owner** Dhiaz Fathra · **Approver** Aris Ihwan · **Version** v1.4 · **Review** annually
**Requirement** ISO 27001 6.3 · **Also satisfies** 27001 6.1, 27001 8.1, 27001 9.3, A.8.32, 9001 6.3

## Purpose

Clause 6.3 requires that changes to the information security management system are carried out
in a planned manner. This policy states what counts as an ISMS change at Dermaster, what has to
be thought about before it happens, and who decides. It is deliberately separate from the
technical change management standard: a firewall rule change is a system change, moving staff
records to a new processor is an ISMS change, and the second one is what this covers.

## Scope

Changes to the ISMS scope, the information security policy or objectives, the risk criteria,
the Statement of Applicability, ISMS roles and responsibilities, and any change to a business
process or supplier arrangement that alters how information inside the scope is handled.
Routine technical changes follow the engineering change standard and reach this policy only
when they alter a data flow, a processing location, or a control's applicability.

## Roles and responsibilities

- **Dhiaz Fathra** decides whether a proposed change is an ISMS change and records it.
- **Aris Ihwan** approves changes to scope, policy, objectives and risk criteria.
- **Agil** and **Pak Andre** raise changes arising from platform and clinic operations.
- **Tika** keeps the change record and reconciles it with the risk register each quarter.

## Policy

1. Before an ISMS change proceeds, the change record states its purpose, its potential
   consequence for information security, the resources it needs, and who is accountable for it
   afterwards. Four fields, one page, before the work starts.
2. Every ISMS change is tested against the risk register. If it creates a new risk or changes
   an existing score, the register is updated in the same week, not at the next quarterly
   assessment.
3. Changes that add a location, a processor, or an external data flow require the Statement of
   Applicability to be re-checked before go-live.
4. An emergency change may proceed without prior record, but the record is completed within 5
   working days and marked retrospective. CHG-ISMS-2026-01 is why that limit exists.
5. Changes are reported at management review with their post-change outcome, so the review sees
   whether the planning was any good, not only that it happened.
6. Availability and integrity of ISMS documented information is preserved across the change:
   superseded versions are retained, never overwritten.

## Records

FRM-ISMS-C6-3-01, retained six years, cross-referenced to the risk register entry it affected.

## Review

Annually, and after any change carried out retrospectively.
`,
  },
  {
    code: 'ISMS-POL-C7-1',
    title: 'ISMS Resources',
    clause: '27001 7.1',
    crossRefs: ['27001 7.2', '27001 5.1', '27001 6.2', '9001 7.1', 'A.5.4'],
    version: 'v2.2',
    owner: 'Aris Ihwan',
    form: { code: 'FRM-ISMS-C7-1-01', name: 'ISMS resource plan and shortfall log' },
    revisions: [
      {
        version: 'v2.0',
        date: '2024-08-20',
        author: 'Pak Rila',
        approval: 'Reviewed by Aris Ihwan',
        status: 'Superseded',
        note: 'Security spend was carried inside the general IT budget and could not be reported separately.',
      },
      {
        version: 'v2.2',
        date: '2026-01-22',
        author: 'Aris Ihwan',
        approval: 'Approved by Aris Ihwan',
        status: 'Current',
        note: 'Security budget separated from IT run cost; shortfall log made a standing management review input.',
      },
    ],
    evidence: [
      {
        name: 'isms-c7-1-resource-plan-2026.xlsx',
        fileType: 'XLSX',
        uploadedAt: '2026-02-05',
        expiryDate: '2027-02-05',
        uploader: 'Pak Rila',
        note: 'Approved ISMS resource plan 2026 with the shortfall log appended.',
        body: [
          'Resource | Requested | Approved | Decided by | Note',
          'Security engineer (1 FTE) | 1 | 1 | Aris Ihwan | Offer out April 2026, reports to Dhiaz Fathra',
          'MDM licences, clinic fleet | 340 seats | 340 seats | Pak Rila | 90,000,000 IDR, covers all 13 clinics',
          'AWS security services (GuardDuty, Config, Security Hub) | 2,100 USD/mo | 2,100 USD/mo | Agil | Enabled in ap-southeast-1 across all accounts',
          'External penetration test | 2 per year | 1 per year | Aris Ihwan | Reduced to one; shortfall logged 2026-02-05',
          'Cross-region standby | 4,800 USD/mo | 0 | Aris Ihwan | Deferred to Q3 review, tied to RSK-2026-026',
          'Awareness platform renewal | 48,000,000 IDR | 48,000,000 IDR | Rica | 12 month term from March 2026',
        ].join('\n'),
      },
    ],
    body: `# ISMS-POL-C7-1 · ISMS Resources

**Owner** Aris Ihwan · **Approver** Aris Ihwan · **Version** v2.2 · **Review** annually, at the January planning cycle
**Requirement** ISO 27001 7.1 · **Also satisfies** 27001 7.2, 27001 5.1, 27001 6.2, 9001 7.1, A.5.4

## Purpose

To determine and provide the people, tooling, infrastructure and money the ISMS needs to be
established, implemented, maintained and continually improved — and to record honestly what was
asked for and not granted, so that the organisation knows which risks it is carrying by choice.

## Scope

Resources for the ISMS across the 13 clinics, the engineering group and the AWS ap-southeast-1
estate: security headcount, security tooling and licences, external assessment, awareness
training, and the share of infrastructure spend attributable to security controls.

## Roles and responsibilities

- **Aris Ihwan** approves the ISMS resource plan and any single item above 100,000,000 IDR.
- **Pak Rila** consolidates the requests, holds the budget and maintains the shortfall log.
- **Dhiaz Fathra** states the ISMS requirement and defends it at the planning meeting.
- **Agil** sizes security tooling and cloud security spend from actual account usage.
- **Pak Chen** sources externally provided services — penetration testing, MDM, awareness.

## Policy

1. ISMS resources are planned in the January cycle alongside quality and clinic resources, on
   the same sheet, so that they compete visibly rather than being trimmed invisibly.
2. Security spend is reported as its own line, never absorbed into general IT run cost. The
   2024 arrangement made it impossible to say what security cost, and that is why v2.2 exists.
3. Every request states which risk or objective it serves, by identifier. A request with no
   traceable risk or objective is refused.
4. Reductions and refusals are recorded in the shortfall log with the risk consequence carried
   across verbatim, and the log is a standing input to every management review.
5. Where a refusal leaves a residual risk above the acceptance line, that risk must be formally
   accepted by Aris Ihwan under ISMS-SOP-C6-1-3. Funding decisions do not silently become risk
   acceptances.
6. Mid-year requests are allowed and must name what changed — a new incident, a new location, a
   new obligation. They are decided within 10 working days.

## Records

FRM-ISMS-C7-1-01, retained six years, including the shortfall log for each cycle.

## Review

Annually before the January cycle opens.
`,
  },
  {
    code: 'ISMS-SOP-C7-2',
    title: 'Competence for Information Security Roles',
    clause: '27001 7.2',
    crossRefs: ['27001 7.3', '27001 7.1', '27001 5.3', 'A.6.3', '9001 7.2'],
    version: 'v3.1',
    owner: 'Rica',
    form: { code: 'FRM-ISMS-C7-2-01', name: 'Competence matrix and evidence file' },
    revisions: [
      {
        version: 'v3.0',
        date: '2025-03-17',
        author: 'Rica',
        approval: 'Reviewed by Dhiaz Fathra',
        status: 'Superseded',
        note: 'Matrix built for engineering roles only; clinic front desk staff who handle patient records were not covered.',
      },
      {
        version: 'v3.1',
        date: '2026-02-18',
        author: 'Rica',
        approval: 'Approved by Aris Ihwan',
        status: 'Current',
        note: 'Clinic roles added, evidence of effectiveness required rather than attendance alone.',
      },
    ],
    evidence: [
      {
        name: 'isms-c7-2-competence-matrix-2026.xlsx',
        fileType: 'XLSX',
        uploadedAt: '2026-03-02',
        expiryDate: '2027-03-02',
        uploader: 'Rica',
        note: 'Competence matrix for ISMS roles with the evidence held for each person and the gaps still open.',
        body: [
          'Role | Person | Required competence | Evidence held | Effectiveness check | Gap',
          'ISMS owner | Dhiaz Fathra | ISO 27001 lead implementer, risk assessment | PECB certificate 2024-06, chairs quarterly workshops | Internal audit 2026-01 found no method drift | None',
          'Platform security | Agil | AWS security specialty, incident handling | AWS SCS-C02 2025-04, led INC-2025-14 response | Tabletop exercise 2026-02 passed | Renew SCS by 2028-04',
          'Register and evidence control | Tika | Documented information control, evidence handling | Internal training 2025-11, audit shadowing | Q1 2026 register reconciliation clean | None',
          'Clinic operations | Pak Andre | Patient record handling, physical security | Induction plus refresher 2026-01 | Spot check at Kelapa Gading 2026-02 — 1 finding, closed | Closed 2026-03-04',
          'Front desk (13 clinics, 41 staff) | Various | Patient data handling, phishing recognition | 38 of 41 completed 2026 module | Simulation click rate 8% | 3 staff outstanding, due 2026-03-31',
          'Supplier management | Pak Chen | Supplier security assessment | Internal workshop 2025-09 | DPA review for HR SaaS accepted by legal | None',
        ].join('\n'),
      },
    ],
    body: `# ISMS-SOP-C7-2 · Competence for Information Security Roles

**Owner** Rica · **Approver** Aris Ihwan · **Version** v3.1 · **Review** annually
**Requirement** ISO 27001 7.2 · **Also satisfies** 27001 7.3, 27001 7.1, 27001 5.3, A.6.3, 9001 7.2

## Purpose

To determine the competence needed by the people whose work affects information security
performance at Dermaster, to make sure they have it, and to keep the evidence that they do.
This procedure covers competence — what a person can actually do. Awareness, which everyone
needs regardless of role, is covered by ISMS-POL-C7-3.

## Scope

Every role in the competence matrix: the ISMS owner, platform and infrastructure engineers,
the register and evidence controller, clinic operations leads, front desk staff at all 13
clinics who handle patient records, and the supplier manager. Contractors and locum staff are
in scope for the duration of their engagement.

## Roles and responsibilities

- **Rica** owns the matrix, the training plan and the evidence file.
- **Dhiaz Fathra** defines the competence required for each ISMS role.
- **Line managers** confirm competence before a person works unsupervised in a role.
- **Aris Ihwan** approves the training budget and the annual plan.

## Procedure

1. The matrix records, for each role: the competence required, the person holding the role, the
   evidence held, the date of the last effectiveness check, and any open gap with a due date.
2. Competence is established from education, training or experience. A certificate alone is not
   competence; the matrix also records an effectiveness check — an audit observation, a tabletop
   exercise, a supervised task, or a spot check on site.
3. Where a gap exists, an action is taken — training, mentoring, reassignment, or hiring — and
   its effectiveness is evaluated within one quarter. Actions are tracked on the matrix, not in
   a separate list.
4. New staff in a scoped role complete their required training within 30 days of start. A
   person who has not is not given unsupervised access to patient records.
5. Certifications with an expiry are tracked with their renewal date; renewal is raised with
   the resource plan the January before it lapses.
6. The matrix is reviewed quarterly by Rica with the ISMS owner, and in full each February.

## Records

FRM-ISMS-C7-2-01 — the matrix and the underlying certificates, attendance records and check
notes — retained six years after a person leaves the role.

## Review

Annually each February, and whenever a new ISMS role is created.
`,
  },
  {
    code: 'ISMS-POL-C7-3',
    title: 'Information Security Awareness',
    clause: '27001 7.3',
    crossRefs: ['27001 7.2', '27001 5.2', '27001 7.4', 'A.6.3', 'A.5.4'],
    version: 'v2.4',
    owner: 'Rica',
    form: { code: 'FRM-ISMS-C7-3-01', name: 'Awareness programme plan and completion log' },
    revisions: [
      {
        version: 'v2.2',
        date: '2024-10-14',
        author: 'Rica',
        approval: 'Reviewed by Dhiaz Fathra',
        status: 'Superseded',
        note: 'Annual e-learning only; no measure of whether anything changed in behaviour.',
      },
      {
        version: 'v2.4',
        date: '2026-01-30',
        author: 'Rica',
        approval: 'Approved by Aris Ihwan',
        status: 'Current',
        note: 'Phishing simulation and clinic-specific scenarios added after the 2025 click rate stalled at 8 percent.',
      },
    ],
    evidence: [
      {
        name: 'isms-c7-3-awareness-log-2026.xlsx',
        fileType: 'XLSX',
        uploadedAt: '2026-04-30',
        expiryDate: '2027-04-30',
        uploader: 'Rica',
        note: 'Awareness completion and simulation results for 2026 to date, by site.',
        body: [
          'Site | Headcount | Module completed | Due date | Phishing simulation click rate | Reported to helpdesk',
          'Jakarta HQ (engineering) | 24 | 24 | 2026-02-28 | 2% | 19',
          'Kemang | 21 | 21 | 2026-02-28 | 6% | 12',
          'Kelapa Gading | 19 | 17 | 2026-02-28 | 11% | 6',
          'Pondok Indah | 18 | 18 | 2026-02-28 | 5% | 11',
          'Bandung | 16 | 15 | 2026-03-15 | 9% | 7',
          'Surabaya | 15 | 15 | 2026-03-15 | 4% | 10',
          'Remaining 8 clinics (aggregate) | 112 | 108 | 2026-03-15 | 8% | 54',
          'Group total | 225 | 218 (96.9%) | — | 7.4% | 119',
        ].join('\n'),
      },
    ],
    body: `# ISMS-POL-C7-3 · Information Security Awareness

**Owner** Rica · **Approver** Aris Ihwan · **Version** v2.4 · **Review** annually
**Requirement** ISO 27001 7.3 · **Also satisfies** 27001 7.2, 27001 5.2, 27001 7.4, A.6.3, A.5.4

## Purpose

To make sure every person doing work under Dermaster's control knows the information security
policy, knows how their own work contributes to it, and knows what happens if the requirements
are not met — including the ones that seem administrative, like sharing a front desk login
because the queue is long.

## Scope

All 225 staff across 13 clinics and the Jakarta engineering group, plus contractors, locum
practitioners and vendor engineers who have access to systems or to patient records.

## Roles and responsibilities

- **Rica** owns the awareness programme, the content and the completion log.
- **Dhiaz Fathra** approves the technical content and supplies incident material for it.
- **Pak Andre** ensures clinic staff are released from the floor to complete their module.
- **Line managers** follow up anyone past their due date; unfinished training is a performance
  matter, not an administrative one.

## Policy

1. Every person completes the awareness module within 30 days of joining and annually after
   that. Completion is logged per site on FRM-ISMS-C7-3-01.
2. Content covers the information security policy, the person's own contribution to it, the
   consequences of not meeting requirements, how to report an incident or a suspected one, and
   the current threats the organisation is actually seeing.
3. Clinic content and engineering content differ. Front desk staff get patient record handling,
   shoulder surfing, shared logins and lost devices; engineers get secrets handling, production
   access and secure development. A single generic module was withdrawn in v2.4.
4. Awareness is measured, not assumed. The programme runs quarterly phishing simulations and
   reports both the click rate and the report rate — a high report rate is the outcome we want,
   and it is tracked as OBJ-2026-04's supporting measure.
5. Reporting an incident is never penalised. This is stated in the module and repeated by
   managers; the 119 helpdesk reports in Q1 2026 are treated as a success, not as noise.
6. Sites whose click rate is above 10 percent receive a targeted session within one month.
   Kelapa Gading was scheduled on 2026-04-08 under this rule.

## Records

FRM-ISMS-C7-3-01 — the plan, the completion log and the simulation results — retained six
years. Individual results are held by Rica and shared with a line manager only in aggregate
unless a person is past their due date.

## Review

Annually each January, and after any incident whose cause was human error.
`,
  },
  {
    code: 'ISMS-POL-C7-4',
    title: 'Information Security Communication',
    clause: '27001 7.4',
    crossRefs: ['27001 7.3', '27001 5.1', '27001 9.3', 'A.5.5', 'A.6.8'],
    version: 'v1.8',
    owner: 'Dhiaz Fathra',
    form: { code: 'FRM-ISMS-C7-4-01', name: 'Communication plan and record' },
    revisions: [
      {
        version: 'v1.6',
        date: '2025-02-25',
        author: 'Tika',
        approval: 'Reviewed by Dhiaz Fathra',
        status: 'Superseded',
        note: 'Internal channels only; external notification duties were held informally by the ISMS owner.',
      },
      {
        version: 'v1.8',
        date: '2026-02-24',
        author: 'Dhiaz Fathra',
        approval: 'Approved by Aris Ihwan',
        status: 'Current',
        note: 'External communication to regulators, payers and patients added with named spokespeople and time limits.',
      },
    ],
    evidence: [
      {
        name: 'isms-c7-4-communication-plan-2026.md',
        fileType: 'MD',
        uploadedAt: '2026-03-10',
        expiryDate: '2027-03-10',
        uploader: 'Tika',
        note: 'Approved communication plan showing what is communicated, when, to whom, by whom and by which channel.',
        body: [
          '# ISMS communication plan 2026',
          '',
          'What | When | To whom | By whom | Channel',
          'ISMS performance dashboard | Monthly, first working day | Board and heads of function | Dhiaz Fathra | Email plus the register dashboard',
          'Risk register movement | Quarterly, after the workshop | Risk owners and Aris Ihwan | Tika | Register export plus a 20 minute call',
          'Incident notification, Major | Within 1 hour of classification | Aris Ihwan, Agil, Pak Andre | Duty responder | Phone, then written within 4 hours',
          'Personal data breach, reportable | Within 24 hours of confirmation | Regulator and affected patients | Aris Ihwan (sole spokesperson) | Formal letter drafted with legal',
          'Payer-facing incident affecting a data exchange | Within 1 working day | BPJS and private payer contacts | Tika | Agreed payer contact channel',
          'Awareness campaign and simulation results | Quarterly | All staff, by site | Rica | LMS and clinic noticeboard',
          'Change to the ISMS scope or policy | Within 5 working days of approval | All staff and affected suppliers | Dhiaz Fathra | Email plus the controlled document register',
          'Supplier security expectations | At onboarding and annually | All in-scope suppliers | Pak Chen | Contract annex and review meeting',
        ].join('\n'),
      },
    ],
    body: `# ISMS-POL-C7-4 · Information Security Communication

**Owner** Dhiaz Fathra · **Approver** Aris Ihwan · **Version** v1.8 · **Review** annually
**Requirement** ISO 27001 7.4 · **Also satisfies** 27001 7.3, 27001 5.1, 27001 9.3, A.5.5, A.6.8

## Purpose

To determine the internal and external communications relevant to the ISMS: what is
communicated, when, to whom, by whom, and by which channel. The point is that in an incident
nobody has to work out who speaks to a regulator at two in the morning — it is written down in
advance.

## Scope

All ISMS communication across the group: board reporting, risk and objective reporting, staff
communication at 13 clinics, incident notification, and external communication to regulators,
payers, patients and suppliers.

## Roles and responsibilities

- **Dhiaz Fathra** owns the communication plan and the monthly ISMS report.
- **Aris Ihwan** is the sole external spokesperson for a reportable personal data breach.
- **Tika** maintains the plan, the contact list and the record of what was actually sent.
- **Rica** communicates awareness material to staff.
- **Pak Chen** communicates security expectations to suppliers.

## Policy

1. FRM-ISMS-C7-4-01 records every planned communication against five fields — what, when, to
   whom, by whom, and how. A communication that cannot be filled in on all five is not planned;
   it is a hope.
2. Contact details for regulators, payers and the incident response team are verified quarterly
   by Tika. An out-of-date phone number is a control failure and is raised as one.
3. No one other than Aris Ihwan speaks externally about a security incident. Staff receiving an
   external enquiry route it to him without comment; this is stated in the awareness module.
4. Time limits are absolute, not targets: Major incident notification within one hour of
   classification, reportable personal data breach within 24 hours of confirmation, payer
   notification within one working day.
5. Every communication that this plan requires is recorded with its date and recipients, so the
   organisation can show what it said and when. Draft text for breach notification is prepared
   in advance with legal and held with the incident response plan.
6. Internal reporting is by exception as well as by schedule: an overdue treatment action or an
   objective off track is reported when it happens, not at the next monthly cycle.

## Records

FRM-ISMS-C7-4-01, retained six years, together with copies of external notifications issued.

## Review

Annually, and after every Major incident as part of its post-incident review.
`,
  },
  {
    code: 'ISMS-POL-C7-5',
    title: 'ISMS Documented Information Framework',
    clause: '27001 7.5',
    crossRefs: ['27001 7.5.1', '27001 7.5.2', '27001 7.5.3', 'A.5.33', '9001 7.5'],
    version: 'v2.0',
    owner: 'Tika',
    form: { code: 'FRM-ISMS-C7-5-01', name: 'ISMS documented information index' },
    revisions: [
      {
        version: 'v1.7',
        date: '2024-06-18',
        author: 'Tika',
        approval: 'Reviewed by Dhiaz Fathra',
        status: 'Superseded',
        note: 'Documents lived across a shared drive and two wikis; the index was maintained by hand and drifted.',
      },
      {
        version: 'v2.0',
        date: '2025-12-08',
        author: 'Tika',
        approval: 'Approved by Dhiaz Fathra',
        status: 'Current',
        note: 'Single controlled register adopted as the source of truth; the wikis became uncontrolled reference only.',
      },
    ],
    evidence: [
      {
        name: 'isms-c7-5-document-index-2026.xlsx',
        fileType: 'XLSX',
        uploadedAt: '2026-03-16',
        expiryDate: '2027-03-16',
        uploader: 'Tika',
        note: 'Index of ISMS documented information showing owner, version, approval date and next review.',
        body: [
          'Code | Title | Owner | Version | Approved | Next review',
          'ISMS-POL-C6-1 | ISMS planning framework | Dhiaz Fathra | v2.1 | 2026-03-05 | 2027-03-05',
          'ISMS-SOP-C6-1-2 | Risk assessment procedure | Dhiaz Fathra | v3.0 | 2025-11-18 | 2026-11-18',
          'ISMS-SOP-C6-1-3 | Risk treatment and SoA | Dhiaz Fathra | v4.2 | 2026-03-19 | 2027-03-19',
          'ISMS-REG-C6-2 | Objectives register | Aris Ihwan | v2.3 | 2026-01-27 | 2027-01-27',
          'ISMS-SOP-C7-2 | Competence | Rica | v3.1 | 2026-02-18 | 2027-02-18',
          'ISMS-POL-C7-4 | Communication | Dhiaz Fathra | v1.8 | 2026-02-24 | 2027-02-24',
          'ISMS-SOP-C7-5-3 | Control of documented information | Tika | v3.2 | 2026-03-11 | 2027-03-11',
          'Uncontrolled reference (engineering wiki) | — | Agil | n/a | n/a | Marked uncontrolled, banner on every page',
        ].join('\n'),
      },
    ],
    body: `# ISMS-POL-C7-5 · ISMS Documented Information Framework

**Owner** Tika · **Approver** Dhiaz Fathra · **Version** v2.0 · **Review** annually
**Requirement** ISO 27001 7.5 · **Also satisfies** 27001 7.5.1, 27001 7.5.2, 27001 7.5.3, A.5.33, 9001 7.5

## Purpose

To state what documented information Dermaster's ISMS holds, where it lives, and the principle
that governs all of it: there is one controlled register, and anything outside it is reference
material with no authority. The two sub-procedures — creating and updating (ISMS-SOP-C7-5-2)
and control (ISMS-SOP-C7-5-3) — sit under this framework and take their definitions from it.

## Scope

Documented information required by ISO/IEC 27001 — the scope statement, the policy, the risk
assessment and treatment procedures, the SoA, the objectives, competence evidence, monitoring
results, audit and management review records — and documented information the organisation has
itself determined necessary, such as the clinic record handling procedure.

## Roles and responsibilities

- **Tika** is the document controller and holds the index.
- **Dhiaz Fathra** approves the framework and adjudicates whether a document is ISMS-controlled.
- **Document owners** keep their own documents current and raise revisions.
- **Agil** maintains the engineering wiki as explicitly uncontrolled reference.

## Framework

1. One register is the source of truth. Every controlled document has a code, an owner, a
   version, an approval date and a next review date on the index, FRM-ISMS-C7-5-01.
2. Anything not in the register is uncontrolled and carries a visible banner saying so. The
   engineering wiki is useful and is kept; it simply cannot be cited as evidence.
3. Documented information exists in the extent needed to be confident the process is carried
   out as planned — no more. A procedure nobody follows is removed rather than reissued.
4. Every document states its purpose, scope, roles, requirements and review trigger, so that a
   reader can tell in thirty seconds whether it applies to them.
5. Records — the evidence of what happened — are distinguished from procedures. Records are not
   revised; a wrong record is corrected with a dated correction that leaves the original
   readable.
6. Retention is six years unless a legal or clinical requirement is longer. Patient clinical
   records follow the Ministry of Health retention period and are governed by the clinical
   records procedure, not by this framework.

## Records

FRM-ISMS-C7-5-01, the index itself, is a controlled record and is retained for the life of
the ISMS.

## Review

Annually by Tika, and whenever a new class of ISMS document is introduced.
`,
  },
  {
    code: 'ISMS-POL-C7-5-1',
    title: 'ISMS Documented Information — General Requirements',
    clause: '27001 7.5.1',
    crossRefs: ['27001 7.5', '27001 7.5.2', '27001 4.3', 'A.5.33', '9001 7.5.1'],
    version: 'v1.5',
    owner: 'Tika',
    form: { code: 'FRM-ISMS-C7-5-1-01', name: 'Required documented information checklist' },
    revisions: [
      {
        version: 'v1.3',
        date: '2024-05-21',
        author: 'Tika',
        approval: 'Reviewed by Dhiaz Fathra',
        status: 'Superseded',
        note: 'Checklist listed the standard clauses only; organisation-determined documents were not tracked.',
      },
      {
        version: 'v1.5',
        date: '2026-02-09',
        author: 'Tika',
        approval: 'Approved by Dhiaz Fathra',
        status: 'Current',
        note: 'Organisation-determined documents added with the reason each is considered necessary.',
      },
    ],
    evidence: [
      {
        name: 'isms-c7-5-1-required-information-checklist-2026.md',
        fileType: 'MD',
        uploadedAt: '2026-02-16',
        expiryDate: '2027-02-16',
        uploader: 'Tika',
        note: 'Checklist run for 2026: every clause-required item present, plus the organisation-determined list with reasons.',
        body: [
          '# Required documented information — checked 2026-02-16 by Tika',
          '',
          'Required by | Item | Held as | Present',
          '4.3 | ISMS scope statement | ISMS-SCOPE-01 v1.9 | Yes',
          '5.2 | Information security policy | ISMS-POL-01 v3.0 | Yes',
          '6.1.2 | Risk assessment process | ISMS-SOP-C6-1-2 v3.0 | Yes',
          '6.1.3 d) | Statement of Applicability | FRM-ISMS-C6-1-3-01 v4.2 | Yes',
          '6.2 | Information security objectives | ISMS-REG-C6-2 v2.3 | Yes',
          '7.2 d) | Competence evidence | FRM-ISMS-C7-2-01 | Yes',
          '8.1 | Confidence that processes ran as planned | Change and ops records | Yes',
          '9.1 | Monitoring and measurement results | Monthly ISMS dashboard | Yes',
          '9.2 | Internal audit programme and results | AUD-PRG-2026 | Yes',
          '9.3 | Management review results | MRM minutes 2026-Q1 | Yes',
          '10.2 | Nonconformity and corrective action | CAPA register | Yes',
          '',
          'Organisation-determined | Reason necessary',
          'Clinic patient record handling procedure | 41 front desk staff across 13 sites; without it practice varied per site',
          'AWS account baseline standard | Multi-account estate; drift caused INC-2025-14',
          'Vendor engineer access procedure | Laser vendors need on-site system access several times a year',
        ].join('\n'),
      },
    ],
    body: `# ISMS-POL-C7-5-1 · ISMS Documented Information — General Requirements

**Owner** Tika · **Approver** Dhiaz Fathra · **Version** v1.5 · **Review** annually
**Requirement** ISO 27001 7.5.1 · **Also satisfies** 27001 7.5, 27001 7.5.2, 27001 4.3, A.5.33, 9001 7.5.1

## Purpose

Clause 7.5.1 requires the ISMS to include the documented information the standard demands, plus
whatever the organisation itself determines is necessary for the ISMS to be effective. This
document states both lists for Dermaster and the test used to decide whether something belongs
on the second one.

## Scope

The full set of ISMS documented information across the group, whether policy, procedure,
register or record, in the controlled register.

## Roles and responsibilities

- **Tika** runs the checklist annually and reports missing items to the ISMS owner.
- **Dhiaz Fathra** decides whether a proposed organisation-determined document is necessary.
- **Document owners** confirm their items are present and current at the annual run.

## Requirements

1. The standard-required items are listed on FRM-ISMS-C7-5-1-01 against the clause that demands
   them. Each row names where the item is actually held, by code and version — not "in the
   register" but which document.
2. An organisation-determined document is necessary only if its absence would let the same
   process be carried out inconsistently in a way that matters. Two tests: does more than one
   person do this, and would doing it differently create risk? Both yes, it is written down.
3. The clinic patient record handling procedure, the AWS account baseline standard and the
   vendor engineer access procedure are on the list for exactly that reason — 41 front desk
   staff at 13 sites, a multi-account estate that drifted during INC-2025-14, and vendor
   engineers who need physical system access several times a year.
4. Documented information is proportionate to the size of the organisation, the complexity of
   its processes and the competence of its people. Where competence is high and the process is
   done by one person, a shorter document is correct.
5. The checklist is run annually each February and after any change to the ISMS scope. A
   missing item is a nonconformity and enters the CAPA register.
6. Documented information of external origin — vendor manuals, payer specifications, regulator
   guidance — is identified and controlled under ISMS-SOP-C7-5-3.

## Records

FRM-ISMS-C7-5-1-01, one run per year, retained six years.

## Review

Annually each February by Tika.
`,
  },
  {
    code: 'ISMS-SOP-C7-5-2',
    title: 'Creating and Updating ISMS Documented Information',
    clause: '27001 7.5.2',
    crossRefs: ['27001 7.5.1', '27001 7.5.3', '27001 6.3', 'A.5.33', '9001 7.5.2'],
    version: 'v2.2',
    owner: 'Tika',
    form: { code: 'FRM-ISMS-C7-5-2-01', name: 'Document drafting, review and approval record' },
    revisions: [
      {
        version: 'v2.0',
        date: '2024-08-06',
        author: 'Tika',
        approval: 'Reviewed by Dhiaz Fathra',
        status: 'Superseded',
        note: 'Approval was by email; three documents in 2024 could not be shown to have been approved at all.',
      },
      {
        version: 'v2.2',
        date: '2026-03-11',
        author: 'Tika',
        approval: 'Approved by Dhiaz Fathra',
        status: 'Current',
        note: 'Approval recorded in the register itself with reviewer and approver as separate people; markdown template mandated.',
      },
    ],
    evidence: [
      {
        name: 'isms-c7-5-2-approval-record-2026.xlsx',
        fileType: 'XLSX',
        uploadedAt: '2026-04-02',
        expiryDate: '2027-04-02',
        uploader: 'Tika',
        note: 'Drafting, review and approval record for ISMS documents issued in 2026 to date.',
        body: [
          'Document | Version | Drafted by | Reviewed by | Approved by | Draft date | Approval date',
          'ISMS-REG-C6-2 | v2.3 | Aris Ihwan | Dhiaz Fathra | Aris Ihwan | 2026-01-12 | 2026-01-27',
          'ISMS-POL-C7-3 | v2.4 | Rica | Dhiaz Fathra | Aris Ihwan | 2026-01-19 | 2026-01-30',
          'ISMS-POL-C7-5-1 | v1.5 | Tika | Agil | Dhiaz Fathra | 2026-01-28 | 2026-02-09',
          'ISMS-SOP-C7-2 | v3.1 | Rica | Pak Andre | Aris Ihwan | 2026-02-02 | 2026-02-18',
          'ISMS-POL-C7-4 | v1.8 | Dhiaz Fathra | Tika | Aris Ihwan | 2026-02-10 | 2026-02-24',
          'ISMS-POL-C6-1 | v2.1 | Dhiaz Fathra | Agil | Aris Ihwan | 2026-02-20 | 2026-03-05',
          'ISMS-SOP-C6-1-3 | v4.2 | Dhiaz Fathra | Tika | Aris Ihwan | 2026-03-04 | 2026-03-19',
          'Rejected — draft site security standard | v0.3 | Pak Chen | Agil | — | 2026-02-27 | Returned 2026-03-06, duplicated A.7 controls already held',
        ].join('\n'),
      },
    ],
    body: `# ISMS-SOP-C7-5-2 · Creating and Updating ISMS Documented Information

**Owner** Tika · **Approver** Dhiaz Fathra · **Version** v2.2 · **Review** annually
**Requirement** ISO 27001 7.5.2 · **Also satisfies** 27001 7.5.1, 27001 7.5.3, 27001 6.3, A.5.33, 9001 7.5.2

## Purpose

To make sure that when ISMS documented information is created or updated at Dermaster it is
identified properly, formatted consistently, and reviewed and approved by named people before
anyone is expected to follow it.

## Scope

Every controlled ISMS document and register in the register — policies, procedures, standards,
plans and the forms they reference. It does not cover records, which are created by running a
process and are controlled under ISMS-SOP-C7-5-3.

## Roles and responsibilities

- **Author** — the document owner or a delegate — drafts and states what changed and why.
- **Reviewer** — a competent person who is not the author — checks it against practice on the
  ground. For clinic procedures this is Pak Andre; for platform documents, Agil.
- **Approver** — Dhiaz Fathra for ISMS procedures, Aris Ihwan for policy, scope and objectives.
- **Tika** files the approval and issues the version.

## Procedure

1. **Identification and description.** Every document carries its code, title, version, owner,
   approver, the requirement it satisfies, and its review trigger in a header block. A document
   without a code is not issued.
2. **Format and media.** ISMS documents are written in Markdown and held in the controlled
   repository. Registers may be XLSX where a table is the honest shape of the content. PDFs are
   issued only for signature copies and always alongside the source.
3. **Review.** Reviewer and approver are never the same person. The reviewer's job is to say
   whether the document describes what actually happens; a document that describes an aspiration
   is returned.
4. **Approval.** Approval is recorded in the register with a date and a name, not by email.
   Three documents from 2024 could not be shown to have been approved at all, which is why v2.2
   exists.
5. **Updating.** An update creates a new version with a revision note stating what changed and
   why. The superseded version is retained and marked. Text is never edited in place.
6. **Minor corrections** — a typo, a broken link, a changed phone number — may be issued by the
   document controller as a point release with a note, without a full review cycle.

## Records

FRM-ISMS-C7-5-2-01, the drafting, review and approval record, retained six years, including
drafts that were rejected and why.

## Review

Annually each March by Tika.
`,
  },
  {
    code: 'ISMS-SOP-C7-5-3',
    title: 'Control of ISMS Documented Information',
    clause: '27001 7.5.3',
    crossRefs: ['27001 7.5.2', '27001 7.5.1', 'A.5.33', 'A.5.34', '9001 7.5.3'],
    version: 'v3.2',
    owner: 'Tika',
    form: { code: 'FRM-ISMS-C7-5-3-01', name: 'Document access, distribution and disposal log' },
    revisions: [
      {
        version: 'v3.0',
        date: '2024-11-25',
        author: 'Tika',
        approval: 'Reviewed by Dhiaz Fathra',
        status: 'Superseded',
        note: 'Access to ISMS documents was open to all staff, including the SoA and the risk register.',
      },
      {
        version: 'v3.1',
        date: '2025-07-14',
        author: 'Tika',
        approval: 'Reviewed by Dhiaz Fathra',
        status: 'Superseded',
        note: 'Access tiers introduced; external-origin documents still uncontrolled.',
      },
      {
        version: 'v3.2',
        date: '2026-03-11',
        author: 'Tika',
        approval: 'Approved by Dhiaz Fathra',
        status: 'Current',
        note: 'External-origin documents registered, and printed clinic copies given a 12 month expiry stamp after an obsolete copy was found in use.',
      },
    ],
    evidence: [
      {
        name: 'isms-c7-5-3-distribution-log-2026.xlsx',
        fileType: 'XLSX',
        uploadedAt: '2026-04-27',
        expiryDate: '2027-04-27',
        uploader: 'Tika',
        note: 'Access, distribution and disposal log including the obsolete printed copy withdrawn at Bandung.',
        body: [
          'Document | Access tier | Distributed to | Format | Issued | Withdrawn or disposed',
          'ISMS-POL-01 information security policy | All staff | 225 staff, 13 sites | Read-only in the register | 2026-01-05 | —',
          'FRM-ISMS-C6-1-3-01 Statement of Applicability | Restricted | ISMS owner, Aris Ihwan, auditors | Read-only, watermarked | 2026-03-24 | —',
          'FRM-ISMS-C6-1-2-01 risk register | Restricted | Risk owners only | Read-only, per-row | 2026-04-15 | —',
          'Clinic patient record handling procedure | All clinic staff | 13 printed copies, one per front desk | Printed, expiry stamped 2027-01-31 | 2026-01-31 | Bandung copy v2.1 withdrawn 2026-02-19, shredded, certificate held',
          'AWS Well-Architected security pillar (external origin) | Engineering | Platform team | Registered link, version noted | 2026-02-04 | —',
          'BPJS data exchange specification v4 (external origin) | Restricted | Tika, Agil | Registered PDF, superseded v3 archived | 2026-03-02 | v3 archived 2026-03-02',
          'ISMS-SOP-C7-5-3 v3.1 | — | — | Superseded | — | Retained, marked superseded 2026-03-11',
        ].join('\n'),
      },
    ],
    body: `# ISMS-SOP-C7-5-3 · Control of ISMS Documented Information

**Owner** Tika · **Approver** Dhiaz Fathra · **Version** v3.2 · **Review** annually
**Requirement** ISO 27001 7.5.3 · **Also satisfies** 27001 7.5.2, 27001 7.5.1, A.5.33, A.5.34, 9001 7.5.3

## Purpose

To control the ISMS's documented information so that it is available where it is needed, in a
form that is usable, and adequately protected — including protection from the quiet failure
mode of an obsolete printed copy sitting on a clinic front desk being followed in good faith.

## Scope

All controlled ISMS documents and records, in the register or printed, and documented
information of external origin that the ISMS depends on — the BPJS data exchange
specification, device vendor manuals, and AWS reference guidance.

## Roles and responsibilities

- **Tika** is the document controller: distribution, access tiers, withdrawal and disposal.
- **Dhiaz Fathra** approves the access tier for any document classified Restricted.
- **Pak Andre** confirms each quarter that printed copies at the 13 clinics are current.
- **Agil** registers external-origin technical documents the platform depends on.

## Procedure

1. **Availability.** Controlled documents are available in the register to everyone whose
   access tier permits, on the clinic network and over VPN. Availability is tested as part of
   the quarterly resilience check; a register nobody can reach during an incident is useless.
2. **Access tiers.** All-staff (the policy, awareness material, the clinic procedure),
   Engineering, and Restricted (the risk register, the SoA, audit findings). Restricted
   documents are read-only and watermarked with the recipient. The 2024 open-access
   arrangement was withdrawn in v3.0.
3. **Distribution and printed copies.** Printed copies are issued only where a screen is not
   practical at a front desk. Every printed copy carries a 12 month expiry stamp and appears on
   the distribution log. Pak Andre checks them quarterly; the obsolete Bandung copy found on
   2026-02-19 is why the stamp exists.
4. **Change control and version.** Superseded versions are retained and clearly marked, never
   deleted and never left in a place where they can be mistaken for current.
5. **Protection.** Documents are protected from loss of confidentiality, improper use and loss
   of integrity: the register is backed up daily, access is logged, and edits are attributable.
6. **External origin.** External documents the ISMS depends on are registered with their
   version and source, and rechecked for a newer edition at least annually.
7. **Retention and disposal.** Six years unless a longer legal period applies. Disposal of a
   printed copy is by cross-cut shredding with a certificate held against the log entry.

## Records

FRM-ISMS-C7-5-3-01, the access, distribution and disposal log, retained six years.

## Review

Annually each March, and after any finding involving an obsolete or over-shared document.
`,
  },
]

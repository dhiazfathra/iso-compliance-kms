import type { SeedDocument } from './types'

/** ISO/IEC 27001:2022 clauses 4 and 5 — context, scope, the ISMS itself, leadership. */
export const ISMS_CLAUSES_4_5: SeedDocument[] = [
  {
    code: 'ISMS-POL-C4-1',
    title: 'Organisational Context Analysis for the ISMS',
    clause: '27001 4.1',
    crossRefs: ['27001 4.2', '27001 4.3', '27001 6.1.2', '9001 4.1', 'A.5.1'],
    version: 'v2.1',
    owner: 'Dhiaz Fathra',
    form: { code: 'FRM-ISMS-C4-1-01', name: 'Internal and external issues register' },
    revisions: [
      {
        version: 'v1.4',
        date: '2024-08-05',
        author: 'Dhiaz Fathra',
        approval: 'Reviewed by Aris Ihwan',
        status: 'Superseded',
        note: 'First analysis written when the Super App still ran on a single Jakarta VM; clinic-side issues were listed only for the four original locations.',
      },
      {
        version: 'v2.0',
        date: '2025-07-14',
        author: 'Dhiaz Fathra',
        approval: 'Approved by Aris Ihwan',
        status: 'Superseded',
        note: 'Rewritten after the move to AWS ap-southeast-1 and the expansion to 13 clinics; UU PDP obligations added as an external issue in their own right.',
      },
      {
        version: 'v2.1',
        date: '2026-03-09',
        author: 'Dhiaz Fathra',
        approval: 'Approved by Aris Ihwan',
        status: 'Current',
        note: 'Each issue now carries a named owner and the risk or objective it feeds, so the analysis is traceable into the risk assessment rather than sitting beside it.',
      },
    ],
    evidence: [
      {
        name: 'isms-c4-1-issues-register-2026.xlsx',
        fileType: 'XLSX',
        uploadedAt: '2026-03-16',
        expiryDate: '2027-03-16',
        uploader: 'Dhiaz Fathra',
        note: 'Issues register as approved for the 2026 cycle, with the risk or objective each issue feeds.',
        body: [
          'Ref | Type | Issue | Effect on information security | Owner | Feeds',
          'C-01 | External | UU PDP 27/2022 enforcement window closed October 2024; sanctions now live | Patient data breach carries regulatory as well as clinical consequence | Rica | RISK-014, OBJ-2026-03',
          'C-02 | External | Kemenkes clinic licensing requires medical records retained and retrievable for 5 years | Retention and availability of the record store are compliance matters, not preferences | Pak Andre | RISK-021',
          'C-03 | External | Single-region dependency on AWS ap-southeast-1 (Singapore) | A regional failure takes all 13 clinics off the Super App at once | Agil | RISK-007, OBJ-2026-01',
          'C-04 | External | Aesthetic-clinic market in Jakarta is price-competitive; patient before/after imagery leaks are used against competitors | Confidentiality of image assets is a commercial as well as a privacy risk | Aris Ihwan | RISK-009',
          'C-05 | Internal | 13 clinics operate on shared front-desk workstations with rotating staff | Account sharing pressure at the desk; the strongest control is session-level, not password-level | Pak Andre | RISK-003, OBJ-2026-02',
          'C-06 | Internal | In-house engineering team of 11 deploys to production up to 14 times a week | Change velocity is the main source of both resilience and outage | Dhiaz Fathra | RISK-011',
          'C-07 | Internal | Clinical devices (Nd:YAG, HIFU) are vendor-serviced with vendor laptops on site | Third-party equipment touches the clinic network during service visits | Pak Chen | RISK-018',
          'C-08 | Internal | Loyalty and billing data flows to a third-party payment gateway | The organisation depends on a processor it does not run | Rica | RISK-016',
        ].join('\n'),
      },
      {
        name: 'isms-c4-1-context-workshop-minutes-2026-03-02.md',
        fileType: 'MD',
        uploadedAt: '2026-03-04',
        uploader: 'Tika',
        note: 'Minutes of the annual context workshop that produced the v2.1 register.',
        body: [
          '# Context workshop — 2 March 2026, Dermaster head office (Kemang) and video',
          '',
          '**Present** Aris Ihwan (chair), Dhiaz Fathra, Agil, Tika, Rica, Pak Andre, Pak Chen. **Apologies** Andreas (on call).',
          '',
          '| Item | Discussion | Outcome |',
          '| --- | --- | --- |',
          '| Region strategy | Agil presented 14 months of ap-southeast-1 availability; two provider-side degradations in the period, both under 40 minutes | C-03 retained as external issue; restore-to-second-region rehearsal made OBJ-2026-01 |',
          '| UU PDP | Rica reported the DPO appointment and the first two subject access requests (both closed inside 14 days) | C-01 kept; consent-record retention pulled into the risk assessment as RISK-014 |',
          '| Front desk | Pak Andre stated that Kelapa Gading and Bintaro run three shifts on two workstations | C-05 raised from low to medium; badge-tap session switching funded for H2 2026 |',
          '| Removed | "Possible acquisition of a Bandung chain" carried since 2024 with no movement | Struck; a speculative issue that never changes any decision is noise |',
          '',
          'Register v2.1 approved by Aris Ihwan on 9 March 2026. Next review March 2027, or on the opening of clinic 14.',
        ].join('\n'),
      },
    ],
    body: `# ISMS-POL-C4-1 · Organisational Context Analysis for the ISMS

**Owner** Dhiaz Fathra (Head of Engineering, ISMS owner) · **Approver** Aris Ihwan · **Version** v2.1 · **Review** annually
**Requirement** ISO/IEC 27001 4.1 · **Also satisfies** 27001 4.2, 27001 4.3, 27001 6.1.2, 9001 4.1, A.5.1

## Purpose

Dermaster is an Indonesian aesthetic-clinic group: 13 clinics from Kemang to Surabaya, a patient-facing Super App, and an in-house engineering team of eleven running everything on AWS ap-southeast-1. The information security management system exists to protect patient records, clinical imagery and the platform the clinics book on. It can only do that if the organisation is honest about what it is and what surrounds it. This document records that analysis and states how it is kept current.

## Scope

Covers the internal and external issues relevant to the purpose of the ISMS and to its ability to achieve its intended outcomes. It does not itself set the ISMS boundary — that is ISMS-POL-C4-3 — and it does not assess risk; it supplies the issues the risk assessment works from.

## Roles and responsibilities

- **Aris Ihwan** chairs the annual context workshop and approves the register. An issue he strikes is struck.
- **Dhiaz Fathra** owns this document, maintains the register and carries each issue into the risk assessment.
- **Agil** states the infrastructure and cloud-dependency issues from measured availability, not from vendor marketing.
- **Pak Andre** states clinic-floor reality across all 13 locations, including what staff actually do at the front desk.
- **Rica** states the regulatory and personal-data position under UU PDP 27/2022 and Kemenkes record rules.
- **Pak Chen** states issues arising from vendors, devices and externally provided services.
- **Tika** minutes the workshop and checks that every issue reaches a risk or an objective.

## Policy

1. The context is analysed at least annually, in a single workshop, before the risk assessment cycle opens. It is also reviewed on a trigger: a new clinic opening, a change of cloud region, a regulatory change, or any incident rated major.
2. Every issue is recorded in FRM-ISMS-C4-1-01 with a type (internal or external), a named owner, the effect it has on information security stated in one sentence, and the risk ID or objective it feeds.
3. An issue that feeds nothing is deleted. Carrying an issue that changes no decision makes the register look thorough and makes it useless.
4. Internal issues are stated from evidence held by the organisation — deployment counts, shift rosters, availability figures — not from opinion offered in the room.
5. External issues name the specific obligation or dependency, with its source. "Regulation" is not an issue; "UU PDP 27/2022 sanctions in force since October 2024" is.
6. Changes between versions are recorded with what was added, what was struck and why. The strike-out record is the part an auditor reads.
7. The current register is an input to management review and to the annual review of the ISMS scope.

## Records

The issues register (FRM-ISMS-C4-1-01) and the workshop minutes are held in the document repository under this document number and retained for six years.

## Review

Annually each March, and on any of the triggers named in clause 1.
`,
  },
  {
    code: 'ISMS-POL-C4-2',
    title: 'Interested Parties and Their Information Security Requirements',
    clause: '27001 4.2',
    crossRefs: ['27001 4.1', '27001 4.3', '27001 9.3', '9001 4.2', 'A.5.31'],
    version: 'v3.0',
    owner: 'Rica',
    form: { code: 'FRM-ISMS-C4-2-01', name: 'Interested parties and requirements register' },
    revisions: [
      {
        version: 'v2.2',
        date: '2024-11-21',
        author: 'Rica',
        approval: 'Reviewed by Dhiaz Fathra',
        status: 'Superseded',
        note: 'Parties listed with requirements stated in general terms; no distinction between what is a legal obligation and what is an expectation the organisation chose to meet.',
      },
      {
        version: 'v3.0',
        date: '2026-02-23',
        author: 'Rica',
        approval: 'Approved by Aris Ihwan',
        status: 'Current',
        note: 'Every requirement now marked as legal, contractual or expectation, with the clause or contract reference and the control that meets it; corporate-client security questionnaires added as a party in their own right.',
      },
    ],
    evidence: [
      {
        name: 'isms-c4-2-parties-register-2026.xlsx',
        fileType: 'XLSX',
        uploadedAt: '2026-03-02',
        expiryDate: '2027-03-02',
        uploader: 'Rica',
        note: 'Approved register of interested parties, their requirements and where each is met.',
        body: [
          'Party | Requirement | Basis | Reference | Met by | Owner',
          'Patients | Treatment records and before/after imagery kept confidential and disclosed only with consent | Legal | UU PDP 27/2022 art. 20 | A.5.34, A.8.24 consent register, image store encryption | Rica',
          'Patients | Access to their own record within 30 days of request | Legal | UU PDP 27/2022 art. 5 | Subject access procedure, 14-day internal target | Rica',
          'Kemenkes / Dinkes DKI | Medical records retained 5 years and produced on inspection | Legal | Permenkes 24/2022 | Retention schedule, quarterly retrieval test | Pak Andre',
          'Practitioners | Named accounts, no shared logins, access ends the day employment ends | Expectation | Staff handbook s.7 | A.5.16, joiner-mover-leaver run within 24h | Tika',
          'Corporate clients (2 insurers, 1 employer scheme) | Annual security questionnaire and breach notification within 48 hours | Contractual | MSA cl. 12, cl. 14.3 | Questionnaire pack, incident procedure | Aris Ihwan',
          'Payment gateway provider | PCI-relevant data never stored in Dermaster systems | Contractual | Gateway agreement cl. 6 | Tokenised flow, no PAN in Super App | Agil',
          'AWS (ap-southeast-1) | Customer-side configuration and identity management remain with Dermaster | Contractual | Shared responsibility model | IaC baseline, quarterly config review | Agil',
          'Engineering team | Deployment path that does not require production credentials on laptops | Expectation | Team charter | OIDC-federated pipeline, no long-lived keys | Dhiaz Fathra',
          'Clinical device vendors | Scheduled service access to devices with supervision | Contractual | Service contracts | Escorted-visit procedure, visitor log | Pak Chen',
        ].join('\n'),
      },
      {
        name: 'isms-c4-2-requirements-review-2026-02-18.md',
        fileType: 'MD',
        uploadedAt: '2026-02-19',
        uploader: 'Rica',
        note: 'Working note recording which requirements changed at the 2026 review and what was done about each.',
        body: [
          '# Interested-party requirements review — 18 February 2026',
          '',
          'Reviewed by Rica with Dhiaz Fathra and Pak Andre. Six changes since the November 2024 register.',
          '',
          '| Change | Party | What changed | Action | Closed |',
          '| --- | --- | --- | --- | --- |',
          '| New | Corporate clients | Insurer added a 48-hour breach-notification clause at renewal | Incident procedure ISMS notification step retimed from 72h to 48h | 2026-02-25 |',
          '| New | Patients | Two subject access requests received in 2025, both from the Bintaro clinic | 14-day internal target set below the 30-day legal limit | 2026-01-30 |',
          '| Changed | Payment gateway | Provider moved to tokenisation-only API | Confirmed with Agil that no PAN reaches Dermaster storage; evidence: schema review 2026-02-10 | 2026-02-12 |',
          '| Changed | Dinkes DKI | Inspection now sampled per clinic rather than group-wide | Quarterly retrieval test extended to cover all 13 clinics on rotation | 2026-03-15 |',
          '| Removed | Former marketing agency | Contract ended August 2025, access revoked | Verified no residual accounts in the image store | 2025-09-01 |',
          '| Unchanged | Practitioners, AWS, device vendors | No change | None | — |',
        ].join('\n'),
      },
    ],
    body: `# ISMS-POL-C4-2 · Interested Parties and Their Information Security Requirements

**Owner** Rica (Data Protection Officer) · **Approver** Aris Ihwan · **Version** v3.0 · **Review** annually
**Requirement** ISO/IEC 27001 4.2 · **Also satisfies** 27001 4.1, 27001 4.3, 27001 9.3, 9001 4.2, A.5.31

## Purpose

An aesthetic clinic holds some of the most sensitive material a person can hand over: a medical history, a face, a before-and-after photograph. Around that sit regulators, corporate clients, practitioners, vendors and a payment processor, each with their own requirement. This document records who those parties are, what each of them requires of Dermaster's information security, whether that requirement is law, contract or expectation, and where it is met.

## Scope

Covers all parties relevant to the ISMS across the 13 clinics, the Super App, and the engineering and infrastructure estate in AWS ap-southeast-1. Commercial expectations that carry no information security requirement — pricing, treatment outcomes, opening hours — are out of scope.

## Roles and responsibilities

- **Rica** owns this document and the register, and holds the legal and personal-data interpretation under UU PDP 27/2022.
- **Aris Ihwan** approves the register and owns the corporate-client relationships that carry contractual security clauses.
- **Pak Andre** represents the clinic-floor parties: patients at the desk, practitioners, Dinkes inspectors.
- **Agil** represents the infrastructure parties: AWS, the payment gateway, the observability provider.
- **Pak Chen** represents device and service vendors and holds the contract clauses they impose on us.
- **Dhiaz Fathra** confirms that every requirement in the register is met by a control that exists and is operating.

## Policy

1. The register (FRM-ISMS-C4-2-01) is reviewed annually and whenever a contract is signed, renewed or ended, a regulation changes, or a new class of party appears.
2. Every requirement is recorded with its party, its basis — **legal**, **contractual** or **expectation** — the clause, article or contract reference it comes from, the control that meets it and a named owner.
3. A requirement with no basis reference is not a requirement; it is an assumption, and it is either sourced or removed at the review.
4. Where the organisation sets itself a target tighter than the obligation, both figures are recorded. The 14-day subject-access target against the 30-day legal limit is stated as such, so nobody later mistakes the internal target for the law.
5. Requirements that Dermaster decides not to meet are recorded with that decision, its reason and its approver. Silence is not a decision.
6. Contractual security clauses accepted at signature are read into the register before the contract is countersigned, not after. Pak Chen and Aris Ihwan do not sign a clause the ISMS has not been shown.
7. The register is a standing input to management review and to the annual ISMS scope review.

## Records

Register FRM-ISMS-C4-2-01, the annual review note and the corporate-client questionnaire responses are retained for six years, or for the life of the contract plus two years, whichever is longer.

## Review

Annually each February, and on any contract, regulatory or party change as in clause 1.
`,
  },
  {
    code: 'ISMS-POL-C4-3',
    title: 'ISMS Scope Statement',
    clause: '27001 4.3',
    crossRefs: ['27001 4.1', '27001 4.2', '27001 4.4', '27001 8.1', 'A.5.9'],
    version: 'v4.0',
    owner: 'Dhiaz Fathra',
    form: { code: 'FRM-ISMS-C4-3-01', name: 'Scope boundary and interface register' },
    revisions: [
      {
        version: 'v3.1',
        date: '2024-10-02',
        author: 'Dhiaz Fathra',
        approval: 'Reviewed by Aris Ihwan',
        status: 'Superseded',
        note: 'Scope covered head office and the engineering platform only; the clinics were described as "supported locations" without being inside the boundary.',
      },
      {
        version: 'v4.0',
        date: '2025-11-17',
        author: 'Dhiaz Fathra',
        approval: 'Approved by Aris Ihwan',
        status: 'Current',
        note: 'All 13 clinics brought inside the boundary; interfaces to the payment gateway, device vendors and the corporate-client portals listed individually with the control that governs each.',
      },
    ],
    evidence: [
      {
        name: 'isms-c4-3-scope-boundary-register.xlsx',
        fileType: 'XLSX',
        uploadedAt: '2025-11-24',
        expiryDate: '2026-11-24',
        uploader: 'Agil',
        note: 'Boundary and interface register supporting the approved scope statement.',
        body: [
          'Item | In or out | Reason | Interface control | Owner',
          '13 clinic sites (Kemang, Kelapa Gading, Bintaro, PIK, BSD, Bandung x2, Surabaya x2, Semarang, Medan, Bali, Makassar) | In | Patient records are created and read here | A.7.1 physical entry, A.5.16 named accounts | Pak Andre',
          'Head office, Kemang | In | ISMS governance, engineering, finance | Badge access, segregated network | Pak Andre',
          'Super App (patient booking, records, loyalty) | In | Primary processing system for patient data | A.8.9 baseline, A.8.26 app requirements | Dhiaz Fathra',
          'AWS ap-southeast-1 account 4413-xxxx | In | All production workloads and the record store | IaC baseline, quarterly config review | Agil',
          'Corporate laptops and clinic workstations (146 devices) | In | Endpoints that reach patient data | MDM enrolment, disk encryption | Andreas',
          'Payment gateway | Out (interface) | Processor operates its own certified environment | Tokenised API only, no PAN stored; annual assurance report | Agil',
          'Clinical device firmware (Nd:YAG, HIFU) | Out (interface) | Vendor-controlled embedded systems | Escorted service visits, isolated device VLAN | Pak Chen',
          'Corporate-client claim portals | Out (interface) | Client-operated systems | Named federated accounts, quarterly access review | Rica',
          'Staff personal phones | Out | No patient data permitted; app access is read-only rota | Written prohibition, no MDM enrolment | Tika',
        ].join('\n'),
      },
      {
        name: 'isms-c4-3-scope-approval-2025-11-17.pdf',
        fileType: 'PDF',
        uploadedAt: '2025-11-18',
        uploader: 'Tika',
        note: 'Signed approval of scope v4.0 by the CEO, recording the two exclusions and their justification.',
        body: [
          '# Approval of ISMS scope v4.0 — 17 November 2025',
          '',
          'Approved by Aris Ihwan, Chief Executive, on the recommendation of Dhiaz Fathra (ISMS owner).',
          '',
          'Scope as approved: the provision of aesthetic clinical services across 13 Dermaster clinics in Indonesia, together with the in-house development and operation of the Dermaster Super App and its supporting infrastructure in AWS ap-southeast-1, including head office at Kemang, Jakarta.',
          '',
          '| Exclusion | Justification accepted | Residual interface control |',
          '| --- | --- | --- |',
          '| Payment gateway environment | Operated and certified by the provider; Dermaster stores no card data | Tokenised API, annual assurance report reviewed by Agil |',
          '| Clinical device embedded firmware | Not modifiable by Dermaster; vendor holds design authority | Isolated device VLAN, escorted service visits logged by Pak Chen |',
          '',
          'No other exclusion claimed. The CEO records that no clinic, system or process handling patient data has been placed outside the boundary. Next scope review November 2026 or on the opening of clinic 14.',
        ].join('\n'),
      },
    ],
    body: `# ISMS-POL-C4-3 · ISMS Scope Statement

**Owner** Dhiaz Fathra (Head of Engineering, ISMS owner) · **Approver** Aris Ihwan · **Version** v4.0 · **Review** annually
**Requirement** ISO/IEC 27001 4.3 · **Also satisfies** 27001 4.1, 27001 4.2, 27001 4.4, 27001 8.1, A.5.9

## Purpose

This is the statement an auditor reads first and a certificate is issued against. It fixes what the Dermaster ISMS covers, what it does not, and — where something is left out — why, and what governs the line between the two.

## The scope

The information security management system covers **the provision of aesthetic clinical services across the thirteen Dermaster clinics in Indonesia, together with the in-house development and operation of the Dermaster Super App and its supporting infrastructure in AWS ap-southeast-1, including head office functions at Kemang, Jakarta.**

Locations in scope: Kemang, Kelapa Gading, Bintaro, PIK, BSD, Bandung (2), Surabaya (2), Semarang, Medan, Bali and Makassar, plus head office.

## What determined the boundary

The boundary was set from the issues in ISMS-POL-C4-1, the requirements in ISMS-POL-C4-2, and the interfaces and dependencies recorded in FRM-ISMS-C4-3-01. Where patient data is created, stored, transmitted or destroyed, the location or system is inside the boundary. The clinics were brought inside at v4.0 for exactly that reason: records are created at the desk, not in head office.

## Exclusions

Two environments sit outside the boundary, both as interfaces rather than gaps:

1. **The payment gateway environment.** Operated and certified by the provider. Dermaster receives tokens; no card data is stored or transmitted through its systems. Governed by the tokenised API contract and an annual assurance report reviewed by Agil.
2. **Clinical device embedded firmware.** Vendor holds design authority over the Nd:YAG and HIFU device software; Dermaster cannot modify it. Governed by an isolated device VLAN and escorted, logged service visits.

No clinic, no system holding patient records and no part of the AWS production account is excluded.

## Roles and responsibilities

- **Aris Ihwan** approves the scope and every exclusion in it. An exclusion he has not signed does not exist.
- **Dhiaz Fathra** owns this statement and maintains the boundary and interface register.
- **Agil** confirms the infrastructure boundary against the actual AWS account inventory, not against a diagram.
- **Pak Andre** confirms the physical boundary across the 13 sites.
- **Rica** confirms that every flow of personal data crossing the boundary has a lawful basis and a named interface control.

## Policy

1. The scope is reviewed annually and on any trigger: a new clinic, a new region, a new externally provided service handling patient data, or a material change to the Super App.
2. Every exclusion is recorded with its justification, its approver and the interface control that governs the boundary. An exclusion without an interface control is refused.
3. The boundary register is reconciled against the AWS account inventory and the clinic asset list each quarter. A system found in the account but not in the register is treated as a nonconformity.
4. This statement is available as documented information to any interested party who asks for it.

## Review

Annually each November, and on any trigger in clause 1.
`,
  },
  {
    code: 'ISMS-MAN-C4-4',
    title: 'Information Security Management System Manual',
    clause: '27001 4.4',
    crossRefs: ['27001 4.3', '27001 5.1', '27001 6.1', '27001 9.3', '9001 4.4'],
    version: 'v3.2',
    owner: 'Dhiaz Fathra',
    form: { code: 'FRM-ISMS-C4-4-01', name: 'ISMS process map and interaction table' },
    revisions: [
      {
        version: 'v3.0',
        date: '2024-12-16',
        author: 'Tika',
        approval: 'Reviewed by Dhiaz Fathra',
        status: 'Superseded',
        note: 'Manual restructured around the clause order of the standard; process interactions described in prose only.',
      },
      {
        version: 'v3.1',
        date: '2025-09-08',
        author: 'Dhiaz Fathra',
        approval: 'Approved by Aris Ihwan',
        status: 'Superseded',
        note: 'Process map added with inputs, outputs and owners; the quality and information security systems documented as one management system with two standards.',
      },
      {
        version: 'v3.2',
        date: '2026-04-13',
        author: 'Dhiaz Fathra',
        approval: 'Approved by Aris Ihwan',
        status: 'Current',
        note: 'Each ISMS process now carries the measure that shows it is working, so effectiveness is read from the process map rather than assembled at management review.',
      },
    ],
    evidence: [
      {
        name: 'isms-c4-4-process-map-2026.xlsx',
        fileType: 'XLSX',
        uploadedAt: '2026-04-20',
        expiryDate: '2027-04-20',
        uploader: 'Tika',
        note: 'ISMS process map: inputs, outputs, owner, frequency and the measure of effectiveness for each process.',
        body: [
          'Process | Input | Output | Owner | Frequency | Measure | Latest value',
          'Context and interested parties | Workshop, contracts, regulation | Issues and parties registers | Dhiaz Fathra | Annual | Issues traced to a risk or objective | 8 of 8',
          'Risk assessment and treatment | Issues register, asset inventory, incidents | Risk register, Statement of Applicability | Dhiaz Fathra | Annual + on change | Risks with a treatment past due date | 2 of 47',
          'Access management | Joiner-mover-leaver feed from HR | Provisioned and revoked accounts | Andreas | Continuous | Leaver accounts closed within 24h | 31 of 32',
          'Change and deployment | Merged pull requests | Released changes | Agil | Continuous | Changes released without review | 0 of 612 (Q1 2026)',
          'Incident management | Alerts, staff reports, patient complaints | Incident records, corrective actions | Andreas | Continuous | Median time to containment | 41 minutes',
          'Supplier and vendor control | Contracts, service visits | Approved supplier list, visit logs | Pak Chen | Quarterly | Vendors with current assurance evidence | 14 of 15',
          'Awareness and competence | Role matrix, joiner list | Training records | Tika | Quarterly | Staff current on annual security training | 209 of 217',
          'Internal audit | Audit programme | Audit reports, findings | Tika | Programme-driven | Programme completed to plan | 6 of 6 audits (2025)',
          'Management review | All of the above | Review minutes and decisions | Aris Ihwan | Twice yearly | Actions closed by the next review | 11 of 13',
        ].join('\n'),
      },
      {
        name: 'isms-c4-4-manual-issue-note-v3-2.md',
        fileType: 'MD',
        uploadedAt: '2026-04-14',
        uploader: 'Dhiaz Fathra',
        note: 'Issue note recording what changed at v3.2 and who was told.',
        body: [
          '# ISMS manual v3.2 — issue note, 13 April 2026',
          '',
          'Approved by Aris Ihwan. Issued to all process owners and to the clinic managers of all 13 sites.',
          '',
          '| Section | Change | Reason |',
          '| --- | --- | --- |',
          '| 3. Process map | Measure of effectiveness added to every process row | The July 2025 management review spent 40 minutes assembling numbers that should already exist |',
          '| 5. Integration | Statement that the QMS (ISO 9001) and ISMS (ISO 27001) are one management system with two standards, one document control procedure and one internal audit programme | Two parallel systems were producing two sets of findings against the same clinic process |',
          '| 7. Outsourced processes | Payment gateway and device firmware named as controlled interfaces, matching ISMS-POL-C4-3 v4.0 | Manual was still describing them as "third parties" without naming the control |',
          '',
          'Distribution acknowledged by 11 of 13 clinic managers within five working days; Medan and Makassar acknowledged on 22 April after a follow-up from Pak Andre.',
        ].join('\n'),
      },
    ],
    body: `# ISMS-MAN-C4-4 · Information Security Management System Manual

**Owner** Dhiaz Fathra (Head of Engineering, ISMS owner) · **Approver** Aris Ihwan · **Version** v3.2 · **Review** annually
**Requirement** ISO/IEC 27001 4.4 · **Also satisfies** 27001 4.3, 27001 5.1, 27001 6.1, 27001 9.3, 9001 4.4

## Purpose

This manual is the description of the management system itself: the processes that make up the Dermaster ISMS, how they feed each other, who owns each one, and how the organisation knows each is working. It is the map; the individual policies and procedures are the terrain.

## Scope

Applies to the ISMS as scoped in ISMS-POL-C4-3 — 13 clinics, head office, the Super App and the AWS ap-southeast-1 estate.

## 1. The system

Dermaster operates **one** management system documented against two standards. ISO 9001 governs how treatment quality is planned and improved; ISO/IEC 27001 governs how the information supporting it is protected. They share one document control procedure, one internal audit programme, one corrective action process and one management review. Where a clause of either standard asks for something the other already provides, the existing process is used rather than duplicated.

## 2. Processes and their interactions

Nine processes make up the ISMS, recorded with their inputs, outputs, owners, frequency and measure in FRM-ISMS-C4-4-01: context and interested parties; risk assessment and treatment; access management; change and deployment; incident management; supplier and vendor control; awareness and competence; internal audit; management review.

The chain runs: context feeds risk assessment; risk treatment feeds the operational processes (access, change, incident, supplier); those processes produce measures; measures feed internal audit and management review; review decisions feed back into context and risk. A process that produces no output another process consumes does not belong in the system.

## 3. Establishing, maintaining and improving

- **Establish** — a process enters the ISMS when a risk treatment or a legal requirement needs it, with an owner named at that point.
- **Implement** — it is documented, its owner trained, and its first output produced before it is declared operating.
- **Maintain** — the owner reports its measure at each management review.
- **Continually improve** — findings, incidents and measures that miss target raise corrective actions under the improvement procedure.

## 4. Outsourced and interfaced processes

The payment gateway environment and clinical device firmware sit outside the boundary as controlled interfaces. Their controls are named in ISMS-POL-C4-3 and their assurance evidence is reviewed annually by Agil and Pak Chen respectively. Outsourcing a process does not outsource responsibility for it.

## 5. Documented information

All ISMS documents are controlled under the shared document control procedure: numbered, versioned, approved before issue, and held in the repository with revision history. This manual is reissued whenever a process is added, removed or reassigned.

## Review

Annually each April, and whenever a process, owner or standard scope changes.
`,
  },
  {
    code: 'ISMS-POL-C5-1',
    title: 'Leadership and Commitment to Information Security',
    clause: '27001 5.1',
    crossRefs: ['27001 5.2', '27001 5.3', '27001 9.3', '27001 7.1', '9001 5.1'],
    version: 'v2.2',
    owner: 'Aris Ihwan',
    form: { code: 'FRM-ISMS-C5-1-01', name: 'Leadership commitment and decision log' },
    revisions: [
      {
        version: 'v2.0',
        date: '2024-07-30',
        author: 'Aris Ihwan',
        approval: 'Reviewed by Dhiaz Fathra',
        status: 'Superseded',
        note: 'Commitment stated as a declaration; no record of what leadership actually decided or funded.',
      },
      {
        version: 'v2.1',
        date: '2025-08-19',
        author: 'Aris Ihwan',
        approval: 'Approved by Aris Ihwan',
        status: 'Superseded',
        note: 'Decision log introduced so each commitment is evidenced by a dated decision with a budget line or a resource.',
      },
      {
        version: 'v2.2',
        date: '2026-05-05',
        author: 'Aris Ihwan',
        approval: 'Approved by Aris Ihwan',
        status: 'Current',
        note: 'Added the rule that a security requirement overruled on commercial grounds is logged with the overruling decision named and dated, including refusals.',
      },
    ],
    evidence: [
      {
        name: 'isms-c5-1-decision-log-2025-2026.xlsx',
        fileType: 'XLSX',
        uploadedAt: '2026-05-12',
        expiryDate: '2027-05-12',
        uploader: 'Tika',
        note: 'Leadership decision log: what top management decided for information security, including what it declined.',
        body: [
          'Date | Decision | Decided by | Resource committed | Outcome',
          '2025-02-11 | Fund a dedicated security engineer rather than share QA capacity | Aris Ihwan | 1 FTE, 780,000,000 IDR/yr | Andreas started 2025-04-01',
          '2025-06-24 | Delay the Makassar clinic opening by three weeks until network segregation was in place | Aris Ihwan | ~340,000,000 IDR deferred revenue | Opened 2025-07-16 with segregated VLAN',
          '2025-08-19 | Approve the ISMS as a standing board agenda item twice yearly | Aris Ihwan | CEO and CFO time | Reviews held 2025-09-05 and 2026-03-20',
          '2025-10-02 | Decline a corporate client requiring patient data export to an unencrypted SFTP drop | Aris Ihwan | ~1,200,000,000 IDR/yr contract refused | Client re-tendered with API option 2026-01',
          '2026-01-15 | Fund badge-tap session switching at the 6 highest-throughput clinics | Aris Ihwan | 410,000,000 IDR capital | Rollout H2 2026, Kemang first',
          '2026-02-27 | Overrule engineering: keep the legacy loyalty export until June 2026 | Aris Ihwan | Risk RISK-016 accepted, review monthly | Accepted with compensating control (export encrypted, access limited to Rica and Agil)',
          '2026-04-08 | Approve second-region restore rehearsal as OBJ-2026-01 | Aris Ihwan | 6 engineer-days per quarter | First rehearsal 2026-06-11, RTO 3h47m against 4h target',
        ].join('\n'),
      },
      {
        name: 'isms-c5-1-management-review-minutes-2026-03-20.pdf',
        fileType: 'PDF',
        uploadedAt: '2026-03-24',
        uploader: 'Tika',
        note: 'Minutes of the March 2026 management review, chaired by the CEO, evidencing leadership participation.',
        body: [
          '# ISMS management review — 20 March 2026, head office Kemang',
          '',
          '**Chair** Aris Ihwan (CEO). **Present** Dhiaz Fathra, Agil, Tika, Rica, Pak Andre, Pak Chen, Andreas.',
          '',
          '| Input | Reported | Decision of the chair |',
          '| --- | --- | --- |',
          '| Incidents (H2 2025) | 9 incidents, 1 major (Surabaya workstation malware, contained 38 min, no data loss) | Endpoint EDR extended to all 146 devices; funded |',
          '| Objectives | OBJ-2026-01 restore rehearsal not yet run | Deadline held at Q2; 6 engineer-days released |',
          '| Audit findings | 6 audits, 11 findings, 9 closed | Two open findings escalated to named owners with April dates |',
          '| Resources | Security engineer at capacity | Second hire deferred to 2027; risk of deferral recorded in the shortfall log |',
          '| Interested parties | Insurer 48h breach clause | Incident procedure retimed; Rica to confirm by 2026-04-30 |',
          '',
          'The chair recorded that the ISMS is achieving its intended outcomes with two exceptions, both with owners and dates. Next review September 2026.',
        ].join('\n'),
      },
    ],
    body: `# ISMS-POL-C5-1 · Leadership and Commitment to Information Security

**Owner** Aris Ihwan (Chief Executive) · **Approver** Aris Ihwan · **Version** v2.2 · **Review** annually
**Requirement** ISO/IEC 27001 5.1 · **Also satisfies** 27001 5.2, 27001 5.3, 27001 9.3, 27001 7.1, 9001 5.1

## Purpose

Top management commitment is the one ISMS requirement that cannot be delegated and cannot be demonstrated by a statement. This document records how the leadership of Dermaster demonstrates it, and — in the decision log at FRM-ISMS-C5-1-01 — what it has actually decided, funded and refused.

## Scope

Applies to the Chief Executive and the leadership team across the 13 clinics, head office and the engineering function, for the ISMS as scoped in ISMS-POL-C4-3.

## Roles and responsibilities

- **Aris Ihwan (CEO)** is accountable for the effectiveness of the ISMS. He chairs management review, approves the information security policy, the scope and every exclusion, and personally records any decision that overrules a security requirement.
- **Pak Rila (Finance)** holds the ISMS budget lines and confirms at each review that what leadership committed was in fact released.
- **Dhiaz Fathra (ISMS owner)** reports to the CEO on performance and escalates anything the ISMS cannot resolve within its own authority.
- **Pak Andre (Clinic Operations)** carries leadership commitment onto the clinic floor and is accountable for it at all 13 sites.

## Policy

1. **Accountability is held, not delegated.** The CEO remains accountable for the ISMS. Assigning an ISMS owner assigns work, not accountability.
2. **The ISMS is reviewed by leadership twice yearly**, as a standing item, chaired by the CEO in person. A review chaired by a delegate is rescheduled, not recorded.
3. **Every commitment is evidenced by a decision.** Each entry in the decision log names the decision, its date, who took it, the resource committed and the outcome. A commitment with no resource behind it is not recorded as one.
4. **Refusals are logged too.** Where leadership declines a security request, or accepts a risk against advice, the decision is logged with its reason, its compensating control and its review date. The October 2025 refusal of a corporate contract and the February 2026 acceptance of RISK-016 are both in the log for exactly this reason.
5. **Security requirements are integrated into business processes**, not run beside them. Clinic openings, Super App releases and vendor contracts do not proceed past their gate without the relevant ISMS input.
6. **Resources are committed through the annual resource cycle**, on the same sheet as clinical and engineering requests, so information security competes visibly rather than being funded by exception.
7. **Leadership communicates the importance of the ISMS directly** — at the quarterly all-clinic briefing and in the joining pack — in its own words, not by circulating a policy PDF.
8. **Other managers are supported in their own leadership**: a clinic manager who stops a process on security grounds is backed by the CEO, and that backing is recorded.

## Records

Decision log FRM-ISMS-C5-1-01 and management review minutes are retained for six years.

## Review

Annually each May, and after any management review that raises a leadership action.
`,
  },
  {
    code: 'ISMS-POL-C5-2',
    title: 'Information Security Policy',
    clause: '27001 5.2',
    crossRefs: ['27001 5.1', '27001 5.3', '27001 6.2', '27001 7.4', 'A.5.1'],
    version: 'v5.0',
    owner: 'Aris Ihwan',
    form: { code: 'FRM-ISMS-C5-2-01', name: 'Policy issue and acknowledgement record' },
    revisions: [
      {
        version: 'v4.2',
        date: '2024-06-11',
        author: 'Dhiaz Fathra',
        approval: 'Approved by Aris Ihwan',
        status: 'Superseded',
        note: 'Policy ran to nine pages and repeated the control set; clinic staff acknowledged it without being able to say what it required of them.',
      },
      {
        version: 'v5.0',
        date: '2026-01-26',
        author: 'Aris Ihwan',
        approval: 'Approved by Aris Ihwan',
        status: 'Current',
        note: 'Rewritten to one page of commitments with the objectives framework and the four rules that apply to every member of staff; the control detail moved to the topic policies it belongs in.',
      },
    ],
    evidence: [
      {
        name: 'isms-c5-2-acknowledgement-record-2026.xlsx',
        fileType: 'XLSX',
        uploadedAt: '2026-02-09',
        expiryDate: '2027-02-09',
        uploader: 'Tika',
        note: 'Issue and acknowledgement record for policy v5.0 across all sites.',
        body: [
          'Site | Headcount | Acknowledged | Date complete | Outstanding | Follow-up',
          'Head office Kemang | 34 | 34 | 2026-02-02 | 0 | —',
          'Kemang clinic | 21 | 21 | 2026-02-03 | 0 | —',
          'Kelapa Gading | 19 | 19 | 2026-02-04 | 0 | —',
          'Bintaro | 17 | 16 | 2026-02-11 | 1 | Maternity leave, on return',
          'PIK | 15 | 15 | 2026-02-04 | 0 | —',
          'BSD | 14 | 14 | 2026-02-05 | 0 | —',
          'Bandung (2 sites) | 26 | 26 | 2026-02-06 | 0 | —',
          'Surabaya (2 sites) | 28 | 26 | 2026-02-13 | 2 | Locum practitioners, completed 2026-02-18',
          'Semarang | 12 | 12 | 2026-02-05 | 0 | —',
          'Medan | 13 | 13 | 2026-02-09 | 0 | —',
          'Bali | 11 | 11 | 2026-02-04 | 0 | —',
          'Makassar | 7 | 7 | 2026-02-06 | 0 | —',
          'Total | 217 | 214 | 2026-02-18 | 3 | 2 closed, 1 deferred to return date',
        ].join('\n'),
      },
      {
        name: 'isms-c5-2-policy-v5-signed.pdf',
        fileType: 'PDF',
        uploadedAt: '2026-01-27',
        uploader: 'Aris Ihwan',
        note: 'The signed one-page policy as issued to staff and published to interested parties on request.',
        body: [
          '# Dermaster information security policy — v5.0, signed 26 January 2026',
          '',
          'Signed: Aris Ihwan, Chief Executive. Countersigned: Dhiaz Fathra, ISMS owner.',
          '',
          '| Commitment | How it is measured | 2026 objective |',
          '| --- | --- | --- |',
          '| Protect patient records and clinical imagery | Confirmed unauthorised disclosures | Zero; 2025 actual zero |',
          '| Keep the Super App available to the clinics | Monthly availability against 99.5 percent | Second-region restore under 4h (OBJ-2026-01) |',
          '| Meet UU PDP and Kemenkes obligations | Subject requests answered within 14 days | 100 percent; 2025 actual 2 of 2 |',
          '| Give every member of staff their own account | Shared logins found at audit | Zero by Q4 (OBJ-2026-02) |',
          '| Improve the ISMS continually | Findings closed by due date | 90 percent; 2025 actual 82 percent |',
          '',
          'Issued to 217 staff across 13 clinics and head office. Available to any interested party on request from the DPO.',
        ].join('\n'),
      },
    ],
    body: `# ISMS-POL-C5-2 · Information Security Policy

**Owner** Aris Ihwan (Chief Executive) · **Approver** Aris Ihwan · **Version** v5.0 · **Review** annually
**Requirement** ISO/IEC 27001 5.2 · **Also satisfies** 27001 5.1, 27001 5.3, 27001 6.2, 27001 7.4, A.5.1

## Purpose

This is the organisation's information security policy: the statement of intent that every other security document hangs from, issued and signed by the Chief Executive.

## Scope

Applies to every member of Dermaster staff, every locum and contractor, and every system inside the ISMS scope — 13 clinics, head office, the Super App and the AWS ap-southeast-1 estate.

## The policy

Dermaster treats patients. That means holding medical histories, photographs of people's faces and bodies, and payment relationships, and it means the clinics cannot work if the Super App is down. On that basis Dermaster commits to:

1. **Protecting the confidentiality of patient records and clinical imagery**, disclosing them only with consent or where the law requires.
2. **Keeping the Super App and the record store available to the clinics**, at not less than 99.5 percent monthly availability, with a tested ability to restore in a second region.
3. **Meeting its legal obligations in full**, including UU PDP 27/2022 and Kemenkes record-retention rules, and the security obligations in its corporate-client contracts.
4. **Giving every member of staff their own named account**, and ending that access the day the person leaves.
5. **Continually improving the management system**, closing what audits and incidents find rather than recording it.

## What this requires of everyone

- Use your own account. Never work under someone else's, and never lend yours — not at the front desk, not during a busy shift.
- Do not move patient data out of Dermaster systems: no personal email, no personal phone, no unapproved drive.
- Photograph patients only through the Super App, never on a personal device.
- Report anything that looks wrong — a lost badge, an odd email, a screen left open — to your clinic manager or to security@dermaster the same day. Nobody is penalised for reporting.

## Framework for objectives

Information security objectives are set annually against these five commitments, each with a measure and an owner, and are reviewed at management review. The 2026 objectives are recorded in ISMS-OBJ-2026 and summarised on the signed policy sheet.

## Roles and responsibilities

- **Aris Ihwan** owns, signs and issues this policy.
- **Dhiaz Fathra** maintains it and ensures the topic policies beneath it stay consistent with it.
- **Pak Andre** ensures it is briefed and acknowledged at all 13 clinics.
- **Tika** holds the issue and acknowledgement record and chases what is outstanding.

## Availability and communication

The policy is issued to all staff on joining and at each revision, briefed in person at the quarterly all-clinic meeting, and made available to interested parties on request through the Data Protection Officer.

## Review

Annually each January, and on any material change to the scope, the legal position or the organisation's structure.
`,
  },
  {
    code: 'ISMS-POL-C5-3',
    title: 'ISMS Roles, Responsibilities and Authorities',
    clause: '27001 5.3',
    crossRefs: ['27001 5.1', '27001 5.2', '27001 7.2', '27001 9.3', 'A.5.2'],
    version: 'v3.1',
    owner: 'Tika',
    form: { code: 'FRM-ISMS-C5-3-01', name: 'ISMS RACI and delegated authority schedule' },
    revisions: [
      {
        version: 'v3.0',
        date: '2025-04-22',
        author: 'Tika',
        approval: 'Reviewed by Dhiaz Fathra',
        status: 'Superseded',
        note: 'RACI rebuilt around the nine ISMS processes after the dedicated security engineer role was created.',
      },
      {
        version: 'v3.1',
        date: '2026-06-15',
        author: 'Tika',
        approval: 'Approved by Aris Ihwan',
        status: 'Current',
        note: 'Delegated authority limits added — what each role may decide alone, and the point at which a decision goes to the CEO — plus named deputies for every accountable role.',
      },
    ],
    evidence: [
      {
        name: 'isms-c5-3-raci-2026.xlsx',
        fileType: 'XLSX',
        uploadedAt: '2026-06-22',
        expiryDate: '2027-06-22',
        uploader: 'Tika',
        note: 'ISMS RACI across the nine processes, with deputies and delegated authority limits.',
        body: [
          'Process | Accountable | Responsible | Consulted | Informed | Deputy | May decide alone up to',
          'Context and interested parties | Aris Ihwan | Dhiaz Fathra | Rica, Pak Andre | Clinic managers | Tika | Register content; scope changes go to CEO',
          'Risk assessment and treatment | Dhiaz Fathra | Andreas | Agil, Rica | Aris Ihwan | Agil | Accepting a risk rated low or medium',
          'Access management | Andreas | Andreas, Wiwin | Pak Andre | Tika | Wiwin | Any grant within an approved role profile',
          'Change and deployment | Agil | Engineering team | Andreas | Dhiaz Fathra | Randy | Any change passing review and tests',
          'Incident management | Andreas | On-call engineer | Rica, Pak Andre | Aris Ihwan | Agil | Containment actions, including taking a service down',
          'Supplier and vendor control | Pak Chen | Pak Chen | Rica, Agil | Pak Rila | Pak Andre | Renewals under 250,000,000 IDR with current assurance',
          'Awareness and competence | Tika | Tika, Wiwin | Pak Andre | All staff | Rica | Training content and schedule',
          'Internal audit | Tika | Tika, Andreas | Process owners | Aris Ihwan | Rica | Audit programme and scope',
          'Management review | Aris Ihwan | Tika | All process owners | All staff | Dhiaz Fathra | Nothing; review decisions are the CEO’s',
          'Personal data and UU PDP | Rica | Rica | Dhiaz Fathra | Aris Ihwan | Tika | Subject request outcomes; breach notification goes to CEO',
        ].join('\n'),
      },
      {
        name: 'isms-c5-3-appointment-letters-2026.pdf',
        fileType: 'PDF',
        uploadedAt: '2026-06-18',
        uploader: 'Aris Ihwan',
        note: 'Signed appointment letters for the ISMS owner, DPO and security engineer, recording authority and reporting line.',
        body: [
          '# ISMS appointments — signed 15 June 2026',
          '',
          '| Role | Appointee | Authority granted | Reports to | Effective |',
          '| --- | --- | --- | --- | --- |',
          '| ISMS owner | Dhiaz Fathra | Maintain the ISMS; report performance to the CEO; halt a release or a clinic process on security grounds | Aris Ihwan | 2024-03-01, reconfirmed 2026-06-15 |',
          '| Data Protection Officer | Rica | Decide subject request outcomes; direct access to the CEO on any personal-data matter | Aris Ihwan | 2025-01-06 |',
          '| Security engineer | Andreas | Declare and command an incident; take a production service offline to contain | Dhiaz Fathra | 2025-04-01 |',
          '| Infrastructure lead | Agil | Approve changes to the AWS ap-southeast-1 baseline within the IaC policy | Dhiaz Fathra | 2024-02-12 |',
          '| QA and audit lead | Tika | Set the internal audit programme; raise a nonconformity against any process owner | Aris Ihwan | 2023-11-20 |',
          '',
          'The CEO confirms that each appointee has the authority stated and that no appointee reports on their own work to themselves: internal audit reports to the CEO, not to the ISMS owner.',
        ].join('\n'),
      },
    ],
    body: `# ISMS-POL-C5-3 · ISMS Roles, Responsibilities and Authorities

**Owner** Tika (QA and Audit Lead) · **Approver** Aris Ihwan · **Version** v3.1 · **Review** annually
**Requirement** ISO/IEC 27001 5.3 · **Also satisfies** 27001 5.1, 27001 5.2, 27001 7.2, 27001 9.3, A.5.2

## Purpose

An ISMS fails most often not because nobody knew what to do, but because two people each believed the other was doing it. This document assigns every ISMS responsibility to a named person, states the authority that comes with it, names a deputy, and fixes the point at which a decision must go to the Chief Executive.

## Scope

Covers the nine ISMS processes in ISMS-MAN-C4-4 plus the personal-data function, for the scope in ISMS-POL-C4-3.

## The assignment

Full detail is held in FRM-ISMS-C5-3-01. In summary:

- **Aris Ihwan (CEO)** — accountable for the ISMS and for the outcome of management review. Approves the policy, the scope and every risk acceptance rated high.
- **Dhiaz Fathra (ISMS owner)** — maintains the ISMS, reports its performance to the CEO, and holds the standing authority to halt a release or a clinic process on security grounds.
- **Andreas (Security engineer)** — runs risk treatment and incident management, and may take a production service offline to contain an incident without prior approval.
- **Agil (Infrastructure lead)** — owns the AWS ap-southeast-1 baseline and the change and deployment process.
- **Rica (Data Protection Officer)** — owns the UU PDP position, decides subject request outcomes and has direct access to the CEO on any personal-data matter.
- **Tika (QA and audit lead)** — owns this document, the internal audit programme and the awareness process, and may raise a nonconformity against any process owner including the ISMS owner.
- **Pak Andre (Clinic operations)** — accountable for ISMS conformity at all 13 clinics.
- **Pak Chen (Procurement)** — owns supplier and vendor control and the security clauses in vendor contracts.
- **Pak Rila (Finance)** — confirms that resources leadership committed were released.

## Policy

1. Every ISMS process has exactly one accountable person and one named deputy. A process with two accountable names is treated as unassigned.
2. Each role's delegated authority is stated as a limit — what it may decide alone — and everything above that limit goes to the CEO. An authority that is not written down is not held.
3. **Independence of assurance is preserved.** Internal audit reports to the CEO, not to the ISMS owner, and no person audits a process they operate. Tika does not audit the awareness process she runs; that audit is performed by Rica.
4. Appointments are made in writing, signed by the CEO, and reconfirmed annually or on any change of post-holder.
5. When a post-holder leaves or changes role, the accountable name is reassigned before their last working day, and the RACI is reissued. An unassigned process is a nonconformity, not a gap to be filled later.
6. Every accountable person reports their process measure at management review in person or through their named deputy.

## Records

RACI FRM-ISMS-C5-3-01 and the signed appointment letters are retained for six years.

## Review

Annually each June, and on any change of post-holder or ISMS process.
`,
  },
]

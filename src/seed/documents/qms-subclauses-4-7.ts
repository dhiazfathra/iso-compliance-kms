import type { SeedDocument } from './types'

/**
 * ISO 9001:2015 sub-clauses under clauses 4 to 7.
 *
 * The parent clauses (4.4, 5.1, 5.2, 6.1, 6.2, 7.1, 7.5.3) already have their
 * own controlled documents in the other `qms-*` seeds. These are the narrower
 * instruments the parent policies delegate to — the process definition rules,
 * the customer-focus review, the risk criteria, the objective plan mechanics,
 * the people and infrastructure standards, and the two halves of document
 * control an auditor asks about separately.
 */
export const QMS_SUBCLAUSES_4_7: SeedDocument[] = [
  {
    code: 'QMS-SOP-4-4-1',
    title: 'Establishing and Defining QMS Processes',
    clause: '4.4.1',
    crossRefs: ['9001 4.4', '9001 4.4.2', '9001 6.1.1', '9001 9.1.1', 'A.5.8'],
    version: 'v2.2',
    owner: 'Tika',
    form: { code: 'FRM-4-4-1-01', name: 'Process definition and interaction sheet' },
    revisions: [
      {
        version: 'v2.0',
        date: '2024-11-04',
        author: 'Tika',
        approval: 'Reviewed by Pak Andre',
        status: 'Superseded',
        note: 'First pass at defining the clinic and engineering processes on one sheet; interactions were drawn but inputs and outputs were still narrative.',
      },
      {
        version: 'v2.1',
        date: '2025-08-21',
        author: 'Tika',
        approval: 'Reviewed by Dhiaz Fathra',
        status: 'Superseded',
        note: 'Added the named process owner and the required performance indicator per process after the internal audit found three processes with no owner.',
      },
      {
        version: 'v2.2',
        date: '2026-03-17',
        author: 'Tika',
        approval: 'Approved by Aris Ihwan',
        status: 'Current',
        note: 'Added the criteria for retiring a process and the rule that a new process may not go live until its indicator has a baseline.',
      },
    ],
    evidence: [
      {
        name: 'qms-4-4-1-process-definition-sheet-2026.xlsx',
        fileType: 'XLSX',
        uploadedAt: '2026-03-24',
        expiryDate: '2027-03-24',
        uploader: 'Tika',
        note: 'Current process definitions with owner, inputs, outputs, indicator and baseline.',
        body: [
          'Process | Owner | Key input | Key output | Indicator | Baseline | Interacts with',
          'Patient booking | Pak Andre | Super App / walk-in request | Confirmed slot | No-show rate | 11.4 percent (2025) | Consultation, Billing',
          'Consultation and treatment planning | Pak Andre | Patient record, indication | Signed treatment plan | Plan amended after start | 4.1 percent (2025) | Treatment delivery',
          'Treatment delivery | Pak Andre | Treatment plan, calibrated device | Completed treatment record | Adverse event rate | 0.18 per 1,000 (2025) | Aftercare, Complaint handling',
          'Aftercare follow-up | Wiwin | Completed treatment record | Day-3 contact log | Contact within 72h | 92.6 percent (2025) | Complaint handling',
          'Complaint handling | Wiwin | Complaint from any channel | Closed complaint record | Closure within 14 days | 87.0 percent (2025) | Corrective action',
          'Platform change delivery | Dhiaz Fathra | Approved change request | Released build | Change failure rate | 9.3 percent (2025) | Incident response',
          'Incident response | Agil | Alert or report | Resolved incident, postmortem | MTTR | 68 minutes (2025) | Platform change delivery',
          'Purchasing and external providers | Pak Chen | Approved requisition | Received goods/service | On-spec receipt rate | 96.2 percent (2025) | Treatment delivery',
        ].join('\n'),
      },
      {
        name: 'qms-4-4-1-process-map-review-minute.pdf',
        fileType: 'PDF',
        uploadedAt: '2026-03-19',
        uploader: 'Aris Ihwan',
        note: 'Minute approving the 2026 process map, including the retirement of the paper consent process.',
      },
    ],
    body: `# QMS-SOP-4-4-1 · Establishing and Defining QMS Processes

**Owner** Tika (QA Lead) · **Approver** Aris Ihwan · **Version** v2.2 · **Review** annually
**Requirement** ISO 9001 4.4.1 · **Also satisfies** 9001 4.4, 9001 4.4.2, 9001 6.1.1, 9001 9.1.1, A.5.8

## Purpose

QMS-SOP-4-4 says Dermaster runs its quality management system as a set of interacting processes.
This procedure is how a process actually gets defined: what has to be written down before it
counts as a process, who owns it, how its interaction with the others is recorded, and what has
to be true before a new process is allowed to go live. Without it, "process" becomes a word
people use for whatever they happen to be doing.

## Scope

Every process that affects treatment quality, patient safety, regulatory obligation, or the
availability of the platform the 13 clinics depend on. It covers clinic-side and
engineering-side processes equally; both are entered on the same sheet, FRM-4-4-1-01, because
the failures that hurt patients usually cross the line between them.

## Roles and responsibilities

- **Tika** owns this procedure and the process definition sheet, and refuses entries that are
  incomplete.
- **Pak Andre** owns the clinical processes and names the practitioner accountable at each of
  the 13 locations.
- **Dhiaz Fathra** owns the engineering processes and the AWS ap-southeast-1 platform processes.
- **Aris Ihwan** approves the process map annually and any process retirement.
- **Wiwin** owns the patient-facing follow-up and complaint processes.

## Procedure

1. **Definition.** A process is defined on FRM-4-4-1-01 with seven fields, all mandatory: name,
   owner by person not by department, key inputs, key outputs, the indicator that shows whether
   it is performing, that indicator's current baseline, and the processes it interacts with.
2. **Owner.** One named person. A process with a department in the owner column is not defined
   and is rejected at review.
3. **Sequence and interaction.** Interaction is recorded both ways. If booking says it feeds
   consultation, consultation must list booking as an input; a one-sided arrow means one of the
   two owners has misunderstood the flow and is resolved before the sheet is approved.
4. **Criteria and methods.** Each process names the procedure or work instruction that governs
   it. Where none exists and the process carries clinical or platform risk, Tika raises the gap
   as a finding rather than leaving the cell blank.
5. **Resources.** Resource needs identified while defining a process are carried into the annual
   cycle under QMS-POL-7-1 rather than resolved informally.
6. **Going live.** A new process may not be declared operational until its indicator has a
   baseline, even a rough one from a pilot month. A process with no measurable baseline cannot
   later be shown to have improved or degraded.
7. **Retirement.** A process is retired only by minute, naming what absorbed its outputs. The
   paper consent process was retired in March 2026 this way, with its outputs absorbed into the
   Super App consent capture.
8. **Annual confirmation.** Every owner confirms or corrects their row before the management
   review. An unconfirmed row is reported to Aris Ihwan as an ownership gap.

## Records

FRM-4-4-1-01, the approved process map, and the approval or retirement minutes. Retained six
years.

## Review

Annually before the management review, and immediately whenever a new clinic location opens or
a process is retired.
`,
  },
  {
    code: 'QMS-SOP-4-4-2',
    title: 'Documented Information Supporting the Operation of Processes',
    clause: '4.4.2',
    crossRefs: ['9001 4.4.1', '9001 7.5.1', '9001 7.5.3', '9001 8.5.1', 'A.5.37'],
    version: 'v1.6',
    owner: 'Tika',
    form: { code: 'FRM-4-4-2-01', name: 'Process documentation and retained-record index' },
    revisions: [
      {
        version: 'v1.4',
        date: '2024-12-09',
        author: 'Wiwin',
        approval: 'Reviewed by Tika',
        status: 'Superseded',
        note: 'Listed which procedures existed; did not say which records each process must retain as confidence that it ran as planned.',
      },
      {
        version: 'v1.6',
        date: '2026-04-08',
        author: 'Tika',
        approval: 'Approved by Aris Ihwan',
        status: 'Current',
        note: 'Split the index into maintained information (how the process should run) and retained information (proof it did), and set a retention owner per row.',
      },
    ],
    evidence: [
      {
        name: 'qms-4-4-2-documentation-index-2026.xlsx',
        fileType: 'XLSX',
        uploadedAt: '2026-04-15',
        expiryDate: '2027-04-15',
        uploader: 'Tika',
        note: 'Index of maintained and retained documented information for every defined process.',
        body: [
          'Process | Maintained (how it runs) | Retained (proof it ran) | System of record | Retention | Owner',
          'Patient booking | Booking work instruction WI-BK-02 | Slot ledger, no-show log | Super App | 6 years | Wiwin',
          'Consultation and treatment planning | QMS-SOP-8-2-2, clinical protocol pack | Signed treatment plan, consent capture | Clinic EMR | 10 years | Pak Andre',
          'Treatment delivery | Device SOPs, QMS-SOP-7-1-5 | Treatment record, device verification label scan | Clinic EMR | 10 years | Pak Andre',
          'Aftercare follow-up | Aftercare script AF-01 | Day-3 contact log | Super App | 6 years | Wiwin',
          'Complaint handling | QMS-SOP-10-2 | Complaint record, closure note | Compliance register | 6 years | Wiwin',
          'Platform change delivery | Change management SOP | Change request, review approval, release note | GitHub + register | 6 years | Dhiaz Fathra',
          'Incident response | Incident runbook set | Incident timeline, postmortem | PagerDuty + register | 6 years | Agil',
          'Purchasing | QMS-SOP-8-4 | Requisition, evaluation, receipt note | Finance system | 6 years | Pak Chen',
        ].join('\n'),
      },
      {
        name: 'qms-4-4-2-gap-closure-note-april-2026.docx',
        fileType: 'DOCX',
        uploadedAt: '2026-04-30',
        expiryDate: '2027-04-30',
        uploader: 'Wiwin',
        note: 'Closure note for the two processes that had maintained procedures but no retained record.',
      },
    ],
    body: `# QMS-SOP-4-4-2 · Documented Information Supporting the Operation of Processes

**Owner** Tika (QA Lead) · **Approver** Aris Ihwan · **Version** v1.6 · **Review** annually
**Requirement** ISO 9001 4.4.2 · **Also satisfies** 9001 4.4.1, 9001 7.5.1, 9001 7.5.3, 9001 8.5.1, A.5.37

## Purpose

ISO 9001 4.4.2 asks two different things and they are easy to confuse. The organisation must
**maintain** documented information to support the operation of its processes, and must
**retain** documented information to have confidence those processes were carried out as
planned. Dermaster had plenty of the first and, in two places, none of the second. This
procedure keeps the two apart and gives each row an owner.

## Scope

Every process on FRM-4-4-1-01, across the 13 clinics and the engineering group. It governs what
must exist, not how it is version controlled — control of documented information is QMS-POL-7-5
and its sub-clauses.

## Roles and responsibilities

- **Tika** maintains the index and audits it against reality twice a year.
- **Process owners** (Pak Andre, Dhiaz Fathra, Wiwin, Pak Chen, Agil) state what their process
  maintains and retains, and are accountable for the retained record actually existing.
- **Aris Ihwan** approves the retention periods.

## Policy

1. Every defined process has at least one maintained item and at least one retained item on
   FRM-4-4-2-01. A process with a procedure but no record is a process nobody can prove ran; it
   is raised as a finding and closed with a dated closure note.
2. **Maintained information** answers "how should this run" — procedures, work instructions,
   clinical protocols, runbooks. It is current, controlled, and available at the point of use in
   every clinic that performs the process.
3. **Retained information** answers "did it run as planned" — the treatment record, the day-3
   contact log, the change approval, the incident timeline. It is created as the work happens,
   not reconstructed afterwards.
4. Each row names the system of record. Where a record exists in two systems, one is named
   authoritative; the other is a copy and is not relied on in an audit.
5. Retention periods are set by the record's clinical or legal exposure: patient-linked clinical
   records ten years, everything else six years, unless Indonesian regulation requires longer.
6. A record that cannot be produced within one working day of a request is treated as not
   retained, regardless of whether it exists somewhere.
7. When a process changes, the owner updates both halves of the row before the change is
   released, not afterwards.

## Records

FRM-4-4-2-01 and the half-yearly verification notes. The index itself is retained six years.

## Review

Annually, and after any internal audit finding that names a missing record.
`,
  },
  {
    code: 'QMS-POL-5-1-1',
    title: 'Leadership and Commitment — General',
    clause: '5.1.1',
    crossRefs: ['9001 5.1', '9001 5.1.2', '9001 5.3', '9001 9.3.1', 'A.5.4'],
    version: 'v2.1',
    owner: 'Aris Ihwan',
    form: { code: 'FRM-5-1-1-01', name: 'Top management accountability record' },
    revisions: [
      {
        version: 'v2.0',
        date: '2025-02-13',
        author: 'Aris Ihwan',
        approval: 'Reviewed by Dhiaz Fathra',
        status: 'Superseded',
        note: 'Commitment stated as principles; nothing tied a principle to an act with a date on it.',
      },
      {
        version: 'v2.1',
        date: '2026-02-24',
        author: 'Aris Ihwan',
        approval: 'Approved by the board',
        status: 'Current',
        note: 'Each of the ten commitments in 5.1.1 now names the recurring act that demonstrates it and the record that proves the act happened.',
      },
    ],
    evidence: [
      {
        name: 'qms-5-1-1-accountability-record-2026.xlsx',
        fileType: 'XLSX',
        uploadedAt: '2026-07-06',
        expiryDate: '2027-07-06',
        uploader: 'Aris Ihwan',
        note: 'What top management actually did in H1 2026 against each 5.1.1 commitment.',
        body: [
          'Commitment | Demonstrating act | Date | Record | Verified by',
          'Accountability for QMS effectiveness | Chaired management review, signed the output | 2026-06-18 | Management review minute MR-2026-01 | Tika',
          'Quality policy and objectives set and compatible with strategy | Approved 2026 objectives against the group plan | 2026-01-22 | FRM-6-2-1-01 | Dhiaz Fathra',
          'QMS requirements integrated into business processes | Approved the process map with clinic and engineering on one sheet | 2026-03-19 | FRM-4-4-1-01 | Tika',
          'Promoting process approach and risk-based thinking | Opened the quarterly risk workshop, all 13 clinic leads present | 2026-04-09 | Risk workshop attendance sheet | Wiwin',
          'Resources available | Approved the 2026 resource plan, 16 of 18 clinic roles funded | 2026-01-19 | FRM-7-1-01 | Pak Rila',
          'Communicating the importance of the QMS | All-hands briefing, Kelapa Gading and streamed | 2026-02-06 | Briefing deck and attendance | Wiwin',
          'Ensuring the QMS achieves intended results | Reviewed indicator baselines, ordered rework of the no-show measure | 2026-06-18 | MR-2026-01 action A3 | Tika',
          'Engaging and supporting people | Approved 240m IDR training budget without reduction | 2026-01-19 | FRM-7-1-01 | Pak Rila',
          'Promoting improvement | Funded the aftercare automation from the improvement backlog | 2026-05-11 | Improvement backlog item IMP-2026-07 | Dhiaz Fathra',
          'Supporting other managers in their areas | One-to-one with each clinic lead on their objective | 2026-03-02 to 2026-03-27 | One-to-one log | Pak Andre',
        ].join('\n'),
      },
    ],
    body: `# QMS-POL-5-1-1 · Leadership and Commitment — General

**Owner** Aris Ihwan (Chief Executive) · **Approver** Board · **Version** v2.1 · **Review** annually
**Requirement** ISO 9001 5.1.1 · **Also satisfies** 9001 5.1, 9001 5.1.2, 9001 5.3, 9001 9.3.1, A.5.4

## Purpose

QMS-POL-5-1 states that top management leads the quality management system. This document is the
narrower and harder half: it converts each commitment in ISO 9001 5.1.1 into a recurring act
with a date and a record, so that "commitment" can be audited rather than asserted. An auditor
cannot inspect intent; they can inspect what leadership did and when.

## Scope

Applies to Dermaster Indonesia's top management — the Chief Executive, the clinical director,
the engineering lead and the finance lead — across all 13 clinic locations and the engineering
group operating on AWS ap-southeast-1.

## Roles and responsibilities

- **Aris Ihwan** is accountable for the effectiveness of the quality management system. That
  accountability is not delegated to Tika, to the QA function, or to anyone else; QA administers
  the system, leadership owns whether it works.
- **Pak Andre** carries this commitment into clinical operations at every location.
- **Dhiaz Fathra** carries it into engineering and platform delivery.
- **Pak Rila** ensures the resource decisions match what leadership has committed to.
- **Tika** records the acts on FRM-5-1-1-01 and reports omissions to the board.

## Policy

1. Each of the ten commitments in ISO 9001 5.1.1 is mapped to at least one recurring act
   performed by a named member of top management, listed on FRM-5-1-1-01.
2. An act counts only if it produced a record — a minute, an approval, an attendance sheet, a
   funded budget line. An intention with no record is not evidence of commitment.
3. Accountability for QMS effectiveness sits with the Chief Executive. When the system fails to
   achieve an intended result, the management review records what leadership will do
   differently, not only what the process owner will do.
4. Quality objectives are approved by top management only after they have been checked against
   the group's strategic direction. An objective that conflicts with the business plan is
   rejected rather than quietly abandoned mid-year.
5. Leadership does not approve a quality commitment it has refused to resource. Where the
   resource is reduced, the shortfall log records the quality consequence in leadership's own
   words.
6. Every clinic lead has at least one direct conversation a year with top management about their
   own objective. Thirteen locations is small enough that this is possible and large enough that
   it stops being automatic without a rule.
7. Omissions are visible. Tika reports any unperformed commitment to the board at the next
   review; the record shows the gap rather than being backfilled.

## Records

FRM-5-1-1-01, management review minutes, approved objectives and budget approvals. Retained six
years.

## Review

Annually by the board, and after any management review at which an intended result of the QMS
was not achieved.
`,
  },
  {
    code: 'QMS-POL-5-1-2',
    title: 'Customer Focus',
    clause: '5.1.2',
    crossRefs: ['9001 5.1.1', '9001 8.2.1', '9001 9.1.2', '9001 10.2', 'A.5.34'],
    version: 'v1.8',
    owner: 'Wiwin',
    form: { code: 'FRM-5-1-2-01', name: 'Customer focus review record' },
    revisions: [
      {
        version: 'v1.5',
        date: '2024-10-22',
        author: 'Wiwin',
        approval: 'Reviewed by Pak Andre',
        status: 'Superseded',
        note: 'Customer focus evidenced only by the satisfaction score; nothing showed leadership acting on what the score was made of.',
      },
      {
        version: 'v1.7',
        date: '2025-09-15',
        author: 'Wiwin',
        approval: 'Reviewed by Aris Ihwan',
        status: 'Superseded',
        note: 'Added the quarterly customer focus review and the requirement to read complaint text, not only counts.',
      },
      {
        version: 'v1.8',
        date: '2026-05-05',
        author: 'Wiwin',
        approval: 'Approved by Aris Ihwan',
        status: 'Current',
        note: 'Added statutory and regulatory expectations as an explicit input and the rule that a risk to conformity is escalated even when satisfaction is rising.',
      },
    ],
    evidence: [
      {
        name: 'qms-5-1-2-customer-focus-review-2026q2.xlsx',
        fileType: 'XLSX',
        uploadedAt: '2026-07-14',
        expiryDate: '2026-10-14',
        uploader: 'Wiwin',
        note: 'Q2 2026 review of customer requirements, risks to conformity and satisfaction, with the decisions taken.',
        body: [
          'Input | Finding | Risk to conformity or satisfaction | Decision | Owner | Due',
          'Satisfaction survey (n=2,418) | Score 4.42 of 5, up 0.06 | None at group level | Continue | Wiwin | —',
          'Satisfaction by location | Bintaro 3.91, lowest of 13 | Post-treatment wait time after fit-out | Add one aftercare nurse for 3 months | Pak Andre | 2026-08-01',
          'Complaint text review (94 complaints) | 31 mention unclear pricing at booking | Requirement not fully determined at 8.2.2 | Rewrite price disclosure in Super App booking flow | Dhiaz Fathra | 2026-09-15',
          'Statutory expectation | Kemenkes advertising rules updated Mar 2026 | Claims in two campaign assets exceeded permitted wording | Assets withdrawn 2026-04-02, review added to campaign checklist | Wiwin | Closed',
          'Adverse events | 4 events, all minor, all reported within 24h | Consent wording ambiguous on downtime | Consent text revised and re-approved | Pak Andre | 2026-06-20',
          'Repeat booking rate | 61.8 percent, flat | Retention risk if aftercare contact slips | Day-3 contact target raised to 95 percent | Wiwin | 2026-12-31',
        ].join('\n'),
      },
      {
        name: 'qms-5-1-2-leadership-decision-minute-2026-07.pdf',
        fileType: 'PDF',
        uploadedAt: '2026-07-16',
        uploader: 'Aris Ihwan',
        note: 'Minute recording top management decisions taken from the Q2 customer focus review.',
      },
    ],
    body: `# QMS-POL-5-1-2 · Customer Focus

**Owner** Wiwin (Patient Experience Lead) · **Approver** Aris Ihwan · **Version** v1.8 · **Review** annually
**Requirement** ISO 9001 5.1.2 · **Also satisfies** 9001 5.1.1, 9001 8.2.1, 9001 9.1.2, 9001 10.2, A.5.34

## Purpose

Customer focus in ISO 9001 is a leadership duty, not a marketing posture. Top management must
demonstrate that customer and applicable statutory and regulatory requirements are determined,
understood and consistently met; that risks and opportunities affecting conformity and
satisfaction are addressed; and that the focus on enhancing satisfaction is maintained. This
policy states how Dermaster's leadership does that quarterly, with evidence.

## Scope

All patients across the 13 clinic locations, and the users of the Super App through which they
book, consent and receive aftercare. Statutory and regulatory expectations include Kemenkes
clinical and advertising requirements and Indonesian personal data obligations.

## Roles and responsibilities

- **Wiwin** convenes the quarterly customer focus review and prepares its inputs.
- **Aris Ihwan** chairs it, takes the decisions, and signs the minute.
- **Pak Andre** answers for clinical requirements and adverse events.
- **Dhiaz Fathra** answers for anything the Super App or the platform causes or can fix.
- **Tika** verifies that the decisions taken reached the corrective action process.

## Policy

1. A customer focus review is held quarterly with top management present. It is not delegated to
   the QA function, and it is not merged into an operational meeting.
2. **Inputs are fixed and all are mandatory**: the satisfaction survey by group and by location,
   the full text of complaints received, adverse events, repeat booking rate, and any change to
   statutory or regulatory requirements since the last review.
3. Complaint text is read, not only counted. A count tells leadership how many people were
   unhappy; the text tells them which requirement the organisation failed to determine.
4. **Risks to conformity are escalated even when satisfaction is rising.** A rising score does
   not close a finding — the two are measured separately and the review minute must address both.
5. Every finding produces a decision with a named owner and a date, or an explicit record that
   no action will be taken and why. "Noted" is not a decision.
6. A location scoring more than 0.3 below the group mean triggers a specific intervention within
   that quarter, resourced under QMS-POL-7-1.
7. Statutory changes are actioned immediately on discovery, not held to the quarterly cycle. The
   April 2026 withdrawal of two campaign assets was done within one working day of the finding.
8. Decisions from this review are tracked to closure through the corrective action process and
   reported to the management review.

## Records

FRM-5-1-2-01 for each quarter and the signed leadership decision minute. Retained six years.

## Review

Annually, and immediately after any regulatory change affecting patient-facing requirements.
`,
  },
  {
    code: 'QMS-POL-5-2-1',
    title: 'Establishing the Quality Policy',
    clause: '5.2.1',
    crossRefs: ['9001 5.2', '9001 5.2.2', '9001 6.2.1', '9001 4.1', 'A.5.1'],
    version: 'v3.0',
    owner: 'Aris Ihwan',
    form: { code: 'FRM-5-2-1-01', name: 'Quality policy drafting and approval record' },
    revisions: [
      {
        version: 'v2.4',
        date: '2024-08-19',
        author: 'Aris Ihwan',
        approval: 'Reviewed by Tika',
        status: 'Superseded',
        note: 'Policy text carried over from the 2022 wording; no record showed it had been checked against the current context or strategic direction.',
      },
      {
        version: 'v3.0',
        date: '2026-01-15',
        author: 'Aris Ihwan',
        approval: 'Approved by the board',
        status: 'Current',
        note: 'Policy rewritten against the 4.1 context register and the group strategy, with each of the four ISO 9001 5.2.1 tests evidenced line by line.',
      },
    ],
    evidence: [
      {
        name: 'qms-5-2-1-policy-suitability-check-2026.docx',
        fileType: 'DOCX',
        uploadedAt: '2026-01-20',
        expiryDate: '2027-01-20',
        uploader: 'Tika',
        note: 'Line-by-line check of the approved policy against the four 5.2.1 requirements.',
        body: [
          'Test | Policy line relied on | Evidence it holds | Checked by',
          'Appropriate to purpose and context | "safe, effective aesthetic care in 13 clinics, on systems we build and run ourselves" | Matches context register FRM-4-1-01 rows 1, 4, 9 (regulatory, multi-site, in-house platform) | Tika',
          'Supports strategic direction | "grow without lowering the standard of any single location" | Board strategy 2026-2028, objective 2 | Aris Ihwan',
          'Framework for setting quality objectives | "we measure safety, timeliness and honesty of what we tell patients" | All six 2026 objectives trace to one of the three named dimensions | Dhiaz Fathra',
          'Commitment to satisfy applicable requirements | "we meet Kemenkes requirements and our own, whichever is stricter" | Regulatory register, 0 open regulatory findings at 2026-01-15 | Wiwin',
          'Commitment to continual improvement | "every complaint and every incident changes something or we say why not" | Improvement backlog, 27 items closed in 2025 | Tika',
        ].join('\n'),
      },
      {
        name: 'qms-5-2-1-board-approval-minute-2026-01.pdf',
        fileType: 'PDF',
        uploadedAt: '2026-01-16',
        uploader: 'Aris Ihwan',
        note: 'Board minute approving the v3.0 quality policy.',
      },
    ],
    body: `# QMS-POL-5-2-1 · Establishing the Quality Policy

**Owner** Aris Ihwan (Chief Executive) · **Approver** Board · **Version** v3.0 · **Review** annually
**Requirement** ISO 9001 5.2.1 · **Also satisfies** 9001 5.2, 9001 5.2.2, 9001 6.2.1, 9001 4.1, A.5.1

## Purpose

QMS-POL-5-2 holds the quality policy itself. This document governs how that policy is
established: what it must be tested against before approval, who approves it, and why it is not
allowed to survive a year unexamined. Dermaster's previous policy text ran from 2022 to 2024
without anyone checking it against the organisation the company had become — three more clinics
and an in-house engineering group.

## Scope

The single group quality policy covering all 13 clinic locations, the Super App, and the
engineering group operating on AWS ap-southeast-1. There is one policy; locations do not hold
their own.

## Roles and responsibilities

- **Aris Ihwan** drafts and owns the policy and puts it to the board.
- **The board** approves it. No one else can approve or amend the wording.
- **Tika** runs the suitability check against the four tests in 5.2.1 and files the result.
- **Pak Andre** and **Dhiaz Fathra** confirm the policy is achievable in clinic and in
  engineering respectively before it goes to the board.

## Policy

1. The quality policy must pass four tests, each evidenced in writing on FRM-5-2-1-01 before
   approval: appropriate to the purpose and context of the organisation, supportive of its
   strategic direction, a usable framework for setting quality objectives, and containing
   commitments to satisfy applicable requirements and to continual improvement.
2. **Appropriateness is tested against the context register**, not against opinion. Each policy
   line must be traceable to a row in FRM-4-1-01 or to the interested party register. A line
   that traces to nothing is removed.
3. **Framework test.** Every quality objective set under QMS-SOP-6-2-1 must trace to a dimension
   named in the policy. If an objective the organisation genuinely needs cannot trace to the
   policy, the policy is wrong and is amended — the objective is not dropped to preserve the
   wording.
4. The policy is kept short enough that a practitioner can recall its substance. Length is a
   design constraint, because a policy nobody can repeat cannot be applied at the chair side.
5. Approval is by board minute. The minute names the version approved and the date it takes
   effect.
6. The policy is reviewed annually against the context register and the strategic direction, and
   immediately after any material change — a new location type, a new regulatory regime, or a
   change in what the engineering group is responsible for.
7. Amendment follows the document control procedure; the previous version is superseded and
   withdrawn from every point of use under QMS-SOP-7-5-3.

## Records

FRM-5-2-1-01 suitability checks, board approval minutes, and superseded policy versions.
Retained six years.

## Review

Annually in January, before the objectives cycle opens.
`,
  },
  {
    code: 'QMS-SOP-5-2-2',
    title: 'Communicating the Quality Policy',
    clause: '5.2.2',
    crossRefs: ['9001 5.2.1', '9001 7.3', '9001 7.4', '9001 7.5.3', 'A.5.1'],
    version: 'v2.3',
    owner: 'Wiwin',
    form: { code: 'FRM-5-2-2-01', name: 'Quality policy communication and comprehension log' },
    revisions: [
      {
        version: 'v2.1',
        date: '2025-03-11',
        author: 'Wiwin',
        approval: 'Reviewed by Tika',
        status: 'Superseded',
        note: 'Communication evidenced by an email send list; nothing showed anyone had understood or could apply the policy.',
      },
      {
        version: 'v2.3',
        date: '2026-02-27',
        author: 'Wiwin',
        approval: 'Approved by Aris Ihwan',
        status: 'Current',
        note: 'Added the comprehension spot check, the external availability rule, and the 10 working day deadline for withdrawing superseded copies from clinic walls.',
      },
    ],
    evidence: [
      {
        name: 'qms-5-2-2-communication-log-2026.xlsx',
        fileType: 'XLSX',
        uploadedAt: '2026-03-06',
        expiryDate: '2027-03-06',
        uploader: 'Wiwin',
        note: 'Where the v3.0 policy was communicated, to whom, and the comprehension spot check result.',
        body: [
          'Audience | Channel | Date | Reached | Acknowledged | Spot check score | Note',
          'Clinic practitioners (13 locations) | Briefing at morning huddle | 2026-01-26 to 2026-02-06 | 148 of 152 | 148 | 9 of 10 correct | 4 on leave, briefed 2026-02-13',
          'Clinic front desk and aftercare | Briefing + Super App notice | 2026-01-28 | 61 of 61 | 61 | 8 of 10 correct | Pricing-honesty line least recalled',
          'Engineering group | All-hands + README in the platform repo | 2026-02-03 | 22 of 22 | 22 | 10 of 10 correct | —',
          'New joiners since Feb 2026 | Induction pack, day 1 | ongoing | 11 of 11 | 11 | not yet due | Spot check at 90 days',
          'Contract practitioners and locums | Engagement pack, countersigned | 2026-02-10 | 9 of 9 | 9 | not sampled | Sampling from Q3',
          'External — patients and public | Published on the clinic website and displayed at reception, all 13 | 2026-02-16 | n/a | n/a | n/a | Superseded v2.4 posters withdrawn by 2026-02-20',
          'External — key suppliers | Sent with the 2026 supplier pack | 2026-02-20 | 14 of 14 | 12 | n/a | Two acknowledgements chased',
        ].join('\n'),
      },
    ],
    body: `# QMS-SOP-5-2-2 · Communicating the Quality Policy

**Owner** Wiwin (Patient Experience Lead) · **Approver** Aris Ihwan · **Version** v2.3 · **Review** annually
**Requirement** ISO 9001 5.2.2 · **Also satisfies** 9001 5.2.1, 9001 7.3, 9001 7.4, 9001 7.5.3, A.5.1

## Purpose

ISO 9001 5.2.2 requires that the quality policy be available as documented information,
communicated, understood and applied within the organisation, and available to relevant
interested parties as appropriate. Dermaster used to evidence this with an email distribution
list, which proves a message was sent and nothing more. This procedure evidences that people can
say what the policy asks of them.

## Scope

All employed and contracted staff at the 13 clinic locations and in the engineering group, plus
patients, the public, and suppliers as interested parties. Applies to every policy version from
the date the board approves it.

## Roles and responsibilities

- **Wiwin** runs communication, keeps FRM-5-2-2-01, and performs the comprehension spot checks.
- **Clinic leads** brief their own teams and confirm attendance, including those on leave.
- **Dhiaz Fathra** brings the policy to the engineering group and keeps the copy in the platform
  repository current.
- **Pak Chen** issues the policy with the supplier pack and chases acknowledgements.
- **Tika** audits the log against the master document list twice a year.

## Procedure

1. **Availability.** The approved policy is held as controlled documented information under
   QMS-POL-7-5 and is the only version any point of use may display.
2. **Communication.** Within 20 working days of board approval, the policy is briefed to every
   audience listed on FRM-5-2-2-01, in person or at a huddle, not by email alone. Email records
   distribution; it does not achieve understanding.
3. **Acknowledgement.** Each person acknowledges receipt. Anyone absent is briefed within 10
   working days of returning, and the log records the later date rather than reporting full
   coverage on the original date.
4. **Comprehension.** Within 90 days of a new version, Wiwin samples at least 10 percent of each
   audience with a short spot check: what does the policy commit us to, and name one thing you
   do differently because of it. A score below 7 of 10 for an audience triggers a re-brief of
   that audience, focused on the line people could not recall.
5. **Application.** Clinic leads reference the policy when explaining a decision that trades
   speed for safety, so that it is visibly used rather than only posted.
6. **Withdrawal.** Superseded printed copies at reception and in staff areas across all 13
   locations are withdrawn within 10 working days of the new version taking effect, and the
   withdrawal is recorded.
7. **External availability.** The current policy is published on the clinic website, displayed
   at every reception, and issued to suppliers with the annual pack. Interested parties are given
   the policy in full; it is not summarised for external use.
8. **New joiners.** The policy is in the day-one induction pack, with the spot check at 90 days.

## Records

FRM-5-2-2-01, briefing attendance sheets, spot check results and withdrawal confirmations.
Retained six years.

## Review

Annually, and immediately after each new policy version is approved.
`,
  },
  {
    code: 'QMS-SOP-6-1-1',
    title: 'Determining Risks and Opportunities',
    clause: '6.1.1',
    crossRefs: ['9001 6.1', '9001 6.1.2', '9001 4.1', '9001 4.2', 'A.5.7'],
    version: 'v2.5',
    owner: 'Tika',
    form: { code: 'FRM-6-1-1-01', name: 'Risk and opportunity determination worksheet' },
    revisions: [
      {
        version: 'v2.3',
        date: '2024-07-30',
        author: 'Tika',
        approval: 'Reviewed by Dhiaz Fathra',
        status: 'Superseded',
        note: 'Risks were collected but not derived from the context and interested party registers, so the same three risks reappeared every quarter.',
      },
      {
        version: 'v2.4',
        date: '2025-06-17',
        author: 'Tika',
        approval: 'Reviewed by Aris Ihwan',
        status: 'Superseded',
        note: 'Derivation from 4.1 and 4.2 made mandatory; scoring scale fixed at 5x5 with written definitions per level.',
      },
      {
        version: 'v2.5',
        date: '2026-04-21',
        author: 'Tika',
        approval: 'Approved by Aris Ihwan',
        status: 'Current',
        note: 'Opportunities given equal standing with risks and their own acceptance test, after two consecutive quarters recorded none.',
      },
    ],
    evidence: [
      {
        name: 'qms-6-1-1-determination-worksheet-2026q2.xlsx',
        fileType: 'XLSX',
        uploadedAt: '2026-06-30',
        expiryDate: '2026-09-30',
        uploader: 'Tika',
        note: 'Q2 2026 determination, showing the context or party row each item was derived from.',
        body: [
          'Ref | Type | Derived from | Description | Likelihood | Impact | Score | Owner',
          'R-2026-11 | Risk | Context 4.1 row 3 (regulatory tightening) | Kemenkes advertising rules change faster than campaign review cycle | 4 | 4 | 16 | Wiwin',
          'R-2026-12 | Risk | Context 4.1 row 7 (single-region cloud) | ap-southeast-1 AZ loss takes booking and EMR offline together | 2 | 5 | 10 | Agil',
          'R-2026-13 | Risk | Party register row 2 (practitioners) | Key laser practitioner concentration at Pondok Indah and Kelapa Gading | 3 | 4 | 12 | Pak Andre',
          'R-2026-14 | Risk | Context 4.1 row 11 (rapid site growth) | New Bintaro fit-out outpaces competence sign-off | 4 | 3 | 12 | Pak Andre',
          'R-2026-15 | Risk | Party register row 6 (patients) | Pricing not disclosed clearly at booking damages trust | 4 | 3 | 12 | Wiwin',
          'O-2026-04 | Opportunity | Context 4.1 row 7 (in-house platform) | Aftercare automation could raise day-3 contact from 92.6 to 97 percent | 4 | 4 | 16 | Dhiaz Fathra',
          'O-2026-05 | Opportunity | Party register row 9 (suppliers) | Consolidating calibration to one vendor shortens device downtime | 3 | 3 | 9 | Pak Chen',
        ].join('\n'),
      },
      {
        name: 'qms-6-1-1-workshop-minute-2026q2.pdf',
        fileType: 'PDF',
        uploadedAt: '2026-04-09',
        uploader: 'Tika',
        note: 'Minute of the Q2 risk and opportunity workshop, all 13 clinic leads and the engineering leads present.',
      },
    ],
    body: `# QMS-SOP-6-1-1 · Determining Risks and Opportunities

**Owner** Tika (QA Lead) · **Approver** Aris Ihwan · **Version** v2.5 · **Review** annually
**Requirement** ISO 9001 6.1.1 · **Also satisfies** 9001 6.1, 9001 6.1.2, 9001 4.1, 9001 4.2, A.5.7

## Purpose

ISO 9001 6.1.1 requires that when planning the quality management system, the organisation
considers the issues from 4.1 and the requirements from 4.2 and determines the risks and
opportunities that need to be addressed. This procedure is the determination half only —
deciding what the risks and opportunities are and scoring them. What is then done about them is
QMS-SOP-6-1-2.

## Scope

Risks and opportunities affecting the quality management system: the ability to deliver
conforming treatment across 13 locations, to achieve the intended results of the QMS, to enhance
desirable effects, to prevent or reduce undesired effects, and to improve. Clinical risk to an
individual patient during a treatment is handled by the clinical protocol pack; systemic
clinical risk is in scope here.

## Roles and responsibilities

- **Tika** convenes the quarterly workshop and owns the worksheet and the scoring scale.
- **Pak Andre**, **Dhiaz Fathra**, **Wiwin**, **Agil** and **Pak Chen** bring candidate items
  from their areas and own the ones assigned to them.
- **Aris Ihwan** approves the risk acceptance thresholds annually.
- **Clinic leads** attend the workshop; attendance is recorded because a location that never
  attends stops appearing in the risk picture.

## Procedure

1. **Derivation is mandatory.** Every item on FRM-6-1-1-01 names the context register row or
   interested party register row it came from. An item that derives from nothing is either a
   missing context issue — in which case the context register is updated first — or it is not a
   QMS risk.
2. **Quarterly workshop.** Held in the first month of each quarter. Inputs: the context register,
   the interested party register, complaints, incidents, audit findings, and the previous
   quarter's worksheet.
3. **Scoring.** A 5x5 likelihood and impact scale with written definitions for each level, so
   that a 4 means the same thing to a clinic lead and to an engineer. Score is the product.
4. **Threshold.** Any item scoring 12 or above must be addressed under QMS-SOP-6-1-2. An item
   between 6 and 11 may be accepted with a written reason. Below 6 it is logged and monitored.
5. **Opportunities carry equal weight.** Each quarter must record at least one opportunity, and
   an opportunity is scored on the same scale for the benefit it would produce. Two consecutive
   quarters in 2025 recorded none, which was a failure of the process, not an absence of
   opportunities.
6. **Carry forward.** An item that reappears unchanged for three quarters is escalated to the
   management review as a sign that the response is not working.
7. **Proportionality.** Actions are planned proportionate to the potential impact on the
   conformity of treatment and on patient satisfaction.

## Records

FRM-6-1-1-01 per quarter and the workshop minute. Retained six years.

## Review

Annually, and after any incident that turned out not to appear anywhere on the worksheet.
`,
  },
  {
    code: 'QMS-SOP-6-1-2',
    title: 'Planning Actions to Address Risks and Opportunities',
    clause: '6.1.2',
    crossRefs: ['9001 6.1.1', '9001 6.1', '9001 8.1', '9001 9.1.3', 'A.5.8'],
    version: 'v2.0',
    owner: 'Tika',
    form: { code: 'FRM-6-1-2-01', name: 'Risk action plan and effectiveness evaluation' },
    revisions: [
      {
        version: 'v1.9',
        date: '2025-01-28',
        author: 'Tika',
        approval: 'Reviewed by Dhiaz Fathra',
        status: 'Superseded',
        note: 'Actions were planned and closed on completion; nothing evaluated whether the action had actually reduced the risk.',
      },
      {
        version: 'v2.0',
        date: '2026-05-19',
        author: 'Tika',
        approval: 'Approved by Aris Ihwan',
        status: 'Current',
        note: 'Added mandatory effectiveness evaluation at a stated interval after completion, and integration of the action into the process it affects rather than as a side activity.',
      },
    ],
    evidence: [
      {
        name: 'qms-6-1-2-action-plan-2026.xlsx',
        fileType: 'XLSX',
        uploadedAt: '2026-07-02',
        expiryDate: '2027-07-02',
        uploader: 'Tika',
        note: 'Planned actions for items scoring 12 or above, with the effectiveness evaluation result where due.',
        body: [
          'Ref | Action | Integrated into | Owner | Due | Status | Effectiveness evaluation',
          'R-2026-11 | Regulatory watch: monthly Kemenkes check feeding the campaign checklist | Marketing approval process | Wiwin | 2026-06-30 | Complete | Evaluated 2026-09-01: 0 non-compliant assets since, effective',
          'R-2026-13 | Cross-train 4 practitioners on laser at Bintaro and Surabaya | Competence matrix FRM-7-2-01 | Pak Andre | 2026-09-30 | In progress | Due 2026-12-31',
          'R-2026-14 | Competence sign-off gate before a new site takes bookings | Site opening checklist | Pak Andre | 2026-08-15 | Complete | Evaluated 2026-09-05: Bintaro opened with full sign-off, effective',
          'R-2026-15 | Price disclosure in the Super App booking flow before confirmation | Patient booking process | Dhiaz Fathra | 2026-09-15 | In progress | Due 2027-01-15',
          'O-2026-04 | Automated day-3 aftercare contact with nurse escalation | Aftercare follow-up process | Dhiaz Fathra | 2026-10-31 | In progress | Due 2027-02-28',
          'R-2026-12 | Multi-AZ failover test for booking and EMR, twice yearly | Incident response process | Agil | 2026-11-30 | Planned | Due 2027-03-31',
        ].join('\n'),
      },
      {
        name: 'qms-6-1-2-effectiveness-review-september-2026.docx',
        fileType: 'DOCX',
        uploadedAt: '2026-09-08',
        expiryDate: '2027-09-08',
        uploader: 'Tika',
        note: 'Written evaluation of the two actions that reached their effectiveness review date.',
      },
    ],
    body: `# QMS-SOP-6-1-2 · Planning Actions to Address Risks and Opportunities

**Owner** Tika (QA Lead) · **Approver** Aris Ihwan · **Version** v2.0 · **Review** annually
**Requirement** ISO 9001 6.1.2 · **Also satisfies** 9001 6.1.1, 9001 6.1, 9001 8.1, 9001 9.1.3, A.5.8

## Purpose

ISO 9001 6.1.2 requires the organisation to plan actions to address its risks and opportunities,
to integrate and implement those actions into its QMS processes, and to evaluate their
effectiveness. Dermaster did the first two and skipped the third: actions were marked complete
the day the work finished, with nothing ever checking whether the risk had moved. This procedure
closes that.

## Scope

Every item determined under QMS-SOP-6-1-1 scoring 12 or above, every accepted item between 6 and
11 where acceptance was conditional on an action, and every opportunity the organisation decides
to pursue.

## Roles and responsibilities

- **Tika** maintains the action plan and holds owners to the evaluation date.
- **Action owners** — Pak Andre, Dhiaz Fathra, Wiwin, Agil, Pak Chen — plan and implement the
  action and write its effectiveness evaluation.
- **Pak Rila** confirms funding where an action needs it; an unfunded action is not planned, it
  is escalated.
- **Aris Ihwan** decides when an action is judged ineffective and a different approach is
  required.

## Procedure

1. **Planning.** Each in-scope item gets an action stating what will change, in which process,
   by when, and how effectiveness will be judged. The effectiveness test is written when the
   action is planned, not chosen afterwards to match the outcome.
2. **Integration.** The action must land inside an existing QMS process on FRM-4-4-1-01 — a gate
   in the site opening checklist, a step in the booking flow, a row in the competence matrix. An
   action that lives only in the risk register has not been implemented.
3. **Proportionality.** Effort is proportionate to the potential impact on conformity of
   treatment and on patient satisfaction. A score of 20 justifies changing a process; a score of
   12 usually does not justify a new one.
4. **Options.** Addressing a risk may mean avoiding it, taking it deliberately to pursue an
   opportunity, removing its source, changing likelihood or consequence, sharing it, or accepting
   it by informed decision. The option chosen is recorded by name.
5. **Effectiveness evaluation.** Every completed action carries an evaluation date, normally
   three to six months after completion, long enough for the affected indicator to move. The
   evaluation is written, cites the indicator, and concludes effective, partially effective or
   ineffective.
6. **Ineffective actions** return to the quarterly workshop with the original score restored.
   The register never shows a reduced score on the strength of an action that did not work.
7. Actions and their evaluations are a standing input to the management review.

## Records

FRM-6-1-2-01 and the effectiveness evaluations. Retained six years.

## Review

Annually, and whenever two or more actions in a cycle are judged ineffective.
`,
  },
  {
    code: 'QMS-SOP-6-2-1',
    title: 'Establishing Quality Objectives',
    clause: '6.2.1',
    crossRefs: ['9001 6.2', '9001 6.2.2', '9001 5.2.1', '9001 9.1.1', 'A.5.1'],
    version: 'v2.4',
    owner: 'Dhiaz Fathra',
    form: { code: 'FRM-6-2-1-01', name: 'Quality objective definition record' },
    revisions: [
      {
        version: 'v2.2',
        date: '2024-12-16',
        author: 'Dhiaz Fathra',
        approval: 'Reviewed by Tika',
        status: 'Superseded',
        note: 'Objectives set per function; three of seven had no baseline and could not be shown to have improved.',
      },
      {
        version: 'v2.4',
        date: '2026-01-22',
        author: 'Dhiaz Fathra',
        approval: 'Approved by Aris Ihwan',
        status: 'Current',
        note: 'Every objective must now name the policy dimension it serves, its baseline, its measurement method and the level in the organisation it applies at.',
      },
    ],
    evidence: [
      {
        name: 'qms-6-2-1-objective-definitions-2026.xlsx',
        fileType: 'XLSX',
        uploadedAt: '2026-01-29',
        expiryDate: '2027-01-29',
        uploader: 'Dhiaz Fathra',
        note: 'The six approved 2026 quality objectives with baselines and measurement methods.',
        body: [
          'Ref | Objective | Policy dimension | Level | Baseline (2025) | Target (2026) | Measured by | Owner',
          'QO-2026-1 | Adverse event rate per 1,000 treatments | Safety | Group, all 13 clinics | 0.18 | 0.12 or lower | Monthly clinical review from EMR | Pak Andre',
          'QO-2026-2 | Day-3 aftercare contact within 72 hours | Safety | Per location | 92.6 percent | 97 percent | Super App contact log | Wiwin',
          'QO-2026-3 | Complaints closed within 14 days | Honesty | Group | 87.0 percent | 95 percent | Compliance register | Wiwin',
          'QO-2026-4 | Booking-to-treatment wait, median days | Timeliness | Per location | 9 days | 6 days | Super App slot ledger | Pak Andre',
          'QO-2026-5 | Change failure rate on platform releases | Timeliness | Engineering | 9.3 percent | 5 percent | DORA workbook | Dhiaz Fathra',
          'QO-2026-6 | Price disclosed before booking confirmation | Honesty | Group | not measured, est. 40 percent | 100 percent | Super App funnel event | Dhiaz Fathra',
        ].join('\n'),
      },
      {
        name: 'qms-6-2-1-objective-approval-minute-2026.pdf',
        fileType: 'PDF',
        uploadedAt: '2026-01-23',
        uploader: 'Aris Ihwan',
        note: 'Top management minute approving the 2026 objectives and rejecting two proposed objectives that had no baseline.',
      },
    ],
    body: `# QMS-SOP-6-2-1 · Establishing Quality Objectives

**Owner** Dhiaz Fathra · **Approver** Aris Ihwan · **Version** v2.4 · **Review** annually
**Requirement** ISO 9001 6.2.1 · **Also satisfies** 9001 6.2, 9001 6.2.2, 9001 5.2.1, 9001 9.1.1, A.5.1

## Purpose

ISO 9001 6.2.1 requires quality objectives to be established at relevant functions, levels and
processes, and lists what each must be: consistent with the quality policy, measurable, taking
account of applicable requirements, relevant to conformity of products and services and to
enhancing customer satisfaction, monitored, communicated and updated as appropriate. This
procedure states how an objective at Dermaster gets defined and what disqualifies it.

## Scope

Quality objectives for the group, for each of the 13 clinic locations, and for the engineering
group. Business targets that are not quality objectives — revenue, market share — are set
elsewhere and are out of scope, though an objective may not conflict with them.

## Roles and responsibilities

- **Dhiaz Fathra** owns this procedure and consolidates the objective set each January.
- **Aris Ihwan** approves the set and can reject an objective outright.
- **Pak Andre** and **Wiwin** propose clinical and patient-experience objectives.
- **Tika** verifies each objective against the seven tests before it goes for approval.
- **Clinic leads** hold the per-location objectives and their own baselines.

## Procedure

1. **Policy trace.** Every objective names the quality policy dimension it serves — safety,
   timeliness, or honesty of what we tell patients. An objective tracing to no dimension is
   either not a quality objective or the policy needs amending under QMS-POL-5-2-1.
2. **Measurable.** The objective states a number, a unit, and the method by which it is measured,
   including the system the figure comes from. "Improve aftercare" is not an objective.
3. **Baseline mandatory.** No objective is approved without a baseline. Where a measure is new,
   a pilot month establishes it and the baseline is recorded as an estimate, marked as such —
   QO-2026-6 was approved this way. Two proposals in January 2026 were rejected for having none.
4. **Level.** Each objective states whether it applies at group, per location, or to a specific
   process. A per-location objective produces thirteen tracked figures, not one average that
   hides Bintaro behind Pondok Indah.
5. **Applicable requirements.** Regulatory and statutory requirements are taken into account when
   setting the target; an objective may never target a level below a regulatory minimum.
6. **Relevance test.** Each objective must plausibly affect conformity of the service or patient
   satisfaction. Tika rejects internal-convenience metrics.
7. **Communication.** Approved objectives are communicated with the policy under QMS-SOP-5-2-2 and
   are visible to the teams held to them.
8. **Update.** Objectives are updated when the context changes materially, by the same approval
   route. An objective is never quietly restated mid-year to match the result.

## Records

FRM-6-2-1-01 and the approval minute. Retained six years.

## Review

Annually in January, and at any management review where an objective has become unmeasurable.
`,
  },
  {
    code: 'QMS-SOP-6-2-2',
    title: 'Planning How to Achieve Quality Objectives',
    clause: '6.2.2',
    crossRefs: ['9001 6.2.1', '9001 6.2', '9001 7.1', '9001 9.1.1', 'A.5.8'],
    version: 'v1.9',
    owner: 'Dhiaz Fathra',
    form: { code: 'FRM-6-2-2-01', name: 'Objective delivery plan and progress record' },
    revisions: [
      {
        version: 'v1.7',
        date: '2025-02-04',
        author: 'Dhiaz Fathra',
        approval: 'Reviewed by Pak Rila',
        status: 'Superseded',
        note: 'Plans named what would be done and by when but not what resources were required, so two objectives ran all year unfunded.',
      },
      {
        version: 'v1.9',
        date: '2026-02-10',
        author: 'Dhiaz Fathra',
        approval: 'Approved by Aris Ihwan',
        status: 'Current',
        note: 'Added the five mandatory planning fields from 6.2.2, the funding confirmation gate, and quarterly progress reporting against the baseline.',
      },
    ],
    evidence: [
      {
        name: 'qms-6-2-2-delivery-plans-2026.xlsx',
        fileType: 'XLSX',
        uploadedAt: '2026-02-17',
        expiryDate: '2027-02-17',
        uploader: 'Dhiaz Fathra',
        note: 'Delivery plan per 2026 objective with the five mandatory fields and Q2 progress.',
        body: [
          'Objective | What will be done | Resources required | Responsible | Completion date | How results evaluated | Q2 2026 actual',
          'QO-2026-1 Adverse events 0.18 to 0.12 | Pre-treatment checklist in EMR, device verification scan at point of use | 2 EMR dev-weeks, no new headcount | Pak Andre | 2026-09-30 | Monthly clinical review, rolling 3-month rate | 0.15, on track',
          'QO-2026-2 Day-3 contact 92.6 to 97 percent | Automated contact with nurse escalation; 1 aftercare nurse at Bintaro | 6 dev-weeks + 1 FTE 3 months | Wiwin | 2026-10-31 | Super App contact log, per location | 94.1, on track',
          'QO-2026-3 Complaint closure 87 to 95 percent | Triage at intake, 5-day interim response, weekly ageing report | No new resource | Wiwin | 2026-06-30 | Compliance register ageing | 93.4, on track',
          'QO-2026-4 Wait 9 to 6 days median | Slot release 6 weeks ahead, cross-site referral for laser | Scheduling config, no headcount | Pak Andre | 2026-12-31 | Slot ledger median per location | 7.5, on track',
          'QO-2026-5 Change failure 9.3 to 5 percent | Mandatory pre-merge integration suite, staged rollout | 4 QA automation seats — NOT FUNDED | Dhiaz Fathra | 2026-12-31 | DORA workbook | 8.1, at risk, escalated 2026-07-06',
          'QO-2026-6 Price disclosure to 100 percent | Price panel before booking confirmation | 5 dev-weeks | Dhiaz Fathra | 2026-09-15 | Funnel event coverage | 62 percent, on track',
        ].join('\n'),
      },
      {
        name: 'qms-6-2-2-at-risk-escalation-qo-2026-5.docx',
        fileType: 'DOCX',
        uploadedAt: '2026-07-06',
        expiryDate: '2027-07-06',
        uploader: 'Pak Rila',
        note: 'Escalation of QO-2026-5 to top management after the QA automation seats stayed unfunded.',
      },
    ],
    body: `# QMS-SOP-6-2-2 · Planning How to Achieve Quality Objectives

**Owner** Dhiaz Fathra · **Approver** Aris Ihwan · **Version** v1.9 · **Review** annually
**Requirement** ISO 9001 6.2.2 · **Also satisfies** 9001 6.2.1, 9001 6.2, 9001 7.1, 9001 9.1.1, A.5.8

## Purpose

ISO 9001 6.2.2 asks five specific questions of every quality objective: what will be done, what
resources will be required, who will be responsible, when it will be completed, and how the
results will be evaluated. Dermaster answered four of them and left resources implicit, which is
why two 2025 objectives ran the whole year against a budget that had never been agreed. All five
fields are now mandatory and the resource field is checked against the funded plan.

## Scope

Every quality objective approved under QMS-SOP-6-2-1, at group level, per clinic location, and
for the engineering group.

## Roles and responsibilities

- **Dhiaz Fathra** owns the delivery plan set and reports progress quarterly.
- **Objective owners** write their own plan and are responsible for the result, not only for the
  activity.
- **Pak Rila** confirms in writing whether each resource line is funded in the approved plan.
- **Aris Ihwan** decides what happens to an objective whose resources are refused.
- **Tika** verifies at each quarter that progress is measured the way the objective said it would
  be.

## Procedure

1. **Five fields, all mandatory.** FRM-6-2-2-01 carries: what will be done, resources required,
   responsible person, completion date, and how the results will be evaluated. A plan missing any
   one is returned.
2. **Funding gate.** Within 20 working days of approval, Pak Rila marks each resource line funded
   or not funded against the resource plan under QMS-POL-7-1. A line marked not funded is
   escalated to Aris Ihwan, who either funds it, reduces the target, or accepts the objective as
   at risk in writing. What is not allowed is leaving the target unchanged and the resource
   absent, which is what happened to QO-2026-5.
3. **Responsibility is a person.** A team name in the responsible column is rejected.
4. **Evaluation method matches the objective.** The measurement stated here must be the same
   method recorded on FRM-6-2-1-01. Changing the method mid-year requires re-approval and the
   baseline is restated at the same time.
5. **Quarterly progress.** Each objective reports an actual figure against baseline and target,
   with a status of on track, at risk, or missed. At risk requires a named remedy or an
   escalation.
6. **Per-location objectives report per location.** The group figure is reported alongside, never
   instead of, the thirteen individual figures.
7. **Closure.** At year end each objective is closed with the final figure and a short statement
   of whether the plan or the circumstances explain the outcome. This feeds the management review
   and next year's objective setting.

## Records

FRM-6-2-2-01, quarterly progress reports, funding confirmations and escalations. Retained six
years.

## Review

Annually in February, and immediately after any escalation of an unfunded objective.
`,
  },
  {
    code: 'QMS-POL-7-1-1',
    title: 'Resources — General Determination and Provision',
    clause: '7.1.1',
    crossRefs: ['9001 7.1', '9001 7.1.2', '9001 7.1.3', '9001 8.4', 'A.5.2'],
    version: 'v2.0',
    owner: 'Pak Rila',
    form: { code: 'FRM-7-1-1-01', name: 'Resource determination and external-capability record' },
    revisions: [
      {
        version: 'v1.8',
        date: '2025-01-14',
        author: 'Pak Rila',
        approval: 'Reviewed by Dhiaz Fathra',
        status: 'Superseded',
        note: 'Resources determined from the budget outward; the existing internal capability was never stated, so build-or-buy decisions were made on instinct.',
      },
      {
        version: 'v2.0',
        date: '2026-01-19',
        author: 'Pak Rila',
        approval: 'Approved by Aris Ihwan',
        status: 'Current',
        note: 'Added the two 7.1.1 considerations as mandatory written inputs: capability of and constraints on existing internal resources, and what must be obtained from external providers.',
      },
    ],
    evidence: [
      {
        name: 'qms-7-1-1-capability-and-sourcing-record-2026.xlsx',
        fileType: 'XLSX',
        uploadedAt: '2026-01-27',
        expiryDate: '2027-01-27',
        uploader: 'Pak Rila',
        note: 'Internal capability, its constraint, and the sourcing decision for each resource need in the 2026 cycle.',
        body: [
          'Resource need | Internal capability today | Constraint | Decision | External provider | Approved by',
          'Laser treatment capacity, 13 sites | 22 certified practitioners | Only 6 certified on Nd:YAG | Build — cross-train 4 | none | Pak Andre',
          'Device calibration | none, no metrology staff | No accredited internal capability | Buy | PT Kalibrasi Presisi, 12-month term | Pak Chen',
          'Platform run and on-call | 6 engineers, 2 on rotation | Rotation of 2 is below safe on-call minimum | Build — hire 1 infra engineer | none | Dhiaz Fathra',
          'EMR hosting | AWS ap-southeast-1, self-managed | Single region, no DR region funded | Buy partially — cross-AZ only for 2026 | AWS | Agil',
          'Penetration testing | none | Independence required for credibility | Buy | Independent testing firm, annual | Dhiaz Fathra',
          'Aftercare calling at peak | 8 aftercare staff | Cannot cover 13 sites at Ramadan peak | Buy — seasonal contract staff, 6 weeks | Staffing agency | Wiwin',
          'QA automation seats | 1 QA engineer | 4 seats requested, 0 funded | Deferred — logged as shortfall | n/a | Aris Ihwan',
        ].join('\n'),
      },
    ],
    body: `# QMS-POL-7-1-1 · Resources — General Determination and Provision

**Owner** Pak Rila · **Approver** Aris Ihwan · **Version** v2.0 · **Review** annually
**Requirement** ISO 9001 7.1.1 · **Also satisfies** 9001 7.1, 9001 7.1.2, 9001 7.1.3, 9001 8.4, A.5.2

## Purpose

QMS-POL-7-1 sets the annual resource cycle: who asks, who decides, and how long a decision may
take. ISO 9001 7.1.1 asks something narrower that Dermaster kept skipping — that when determining
resources, the organisation considers the capabilities of and constraints on existing internal
resources, and what needs to be obtained from external providers. This policy makes both a
written input to every resource decision rather than an unstated assumption.

## Scope

All resources needed for the establishment, implementation, maintenance and continual improvement
of the quality management system: people, infrastructure, environment, monitoring and measuring
resources, and organisational knowledge, across 13 clinic locations and the engineering group on
AWS ap-southeast-1.

## Roles and responsibilities

- **Pak Rila** consolidates the determination record and holds the budget.
- **Pak Andre** states clinical capability and its constraints honestly, including where the
  organisation is thin.
- **Dhiaz Fathra** and **Agil** state engineering and infrastructure capability.
- **Pak Chen** sources anything the decision says to buy and brings the provider under
  QMS-SOP-8-4.
- **Aris Ihwan** approves, reduces or refuses, and owns the shortfall.

## Policy

1. Every resource need entered in the annual cycle carries two written statements before any
   decision is taken: what the organisation can already do, and what stops it doing more.
2. **Capability is stated in numbers.** "We have practitioners" is not a capability statement;
   "22 certified practitioners, 6 of them on Nd:YAG" is, and it is what showed the laser
   concentration risk.
3. **Constraint is stated as the binding one.** Where several constraints exist, the record names
   the one that actually limits output — usually certification or on-call depth, rarely money
   alone.
4. **Build or buy is an explicit decision** recorded against each need, with the reason. Buying
   is chosen where the capability requires independence (penetration testing), accreditation
   (device calibration), or elasticity (seasonal aftercare cover).
5. Anything to be obtained externally is named with its provider and term, and is controlled
   under the external provider procedure from the point the decision is made, not from the point
   the invoice arrives.
6. A need with no internal capability and no approved external route is a shortfall. It is logged
   with its quality consequence and reported to the management review; it is not left to be
   absorbed by the people already stretched.
7. The determination record is revisited whenever a new clinic location is committed, because
   thirteen sites' worth of capability is not fourteen sites' worth.

## Records

FRM-7-1-1-01 and the shortfall entries it feeds into FRM-7-1-01. Retained six years.

## Review

Annually before the January cycle, and on commitment of any new location.
`,
  },
  {
    code: 'QMS-POL-7-1-2',
    title: 'People — Staffing the Quality Management System',
    clause: '7.1.2',
    crossRefs: ['9001 7.1.1', '9001 7.2', '9001 7.3', '9001 8.5.1', 'A.6.1'],
    version: 'v2.2',
    owner: 'Pak Andre',
    form: { code: 'FRM-7-1-2-01', name: 'Staffing level and cover record' },
    revisions: [
      {
        version: 'v2.0',
        date: '2024-11-26',
        author: 'Pak Andre',
        approval: 'Reviewed by Pak Rila',
        status: 'Superseded',
        note: 'Minimum staffing stated per clinic but not per treatment type, so a site could be open with nobody certified for half its list.',
      },
      {
        version: 'v2.2',
        date: '2026-03-03',
        author: 'Pak Andre',
        approval: 'Approved by Aris Ihwan',
        status: 'Current',
        note: 'Minimum staffing set per treatment type, with the rule that an uncovered treatment is removed from the day list rather than delivered by an uncertified practitioner.',
      },
    ],
    evidence: [
      {
        name: 'qms-7-1-2-staffing-and-cover-record-2026h1.xlsx',
        fileType: 'XLSX',
        uploadedAt: '2026-07-08',
        expiryDate: '2027-01-08',
        uploader: 'Pak Andre',
        note: 'Minimum versus actual staffing by site and treatment type, with breaches and how each was handled.',
        body: [
          'Location | Treatment type | Minimum certified on shift | Actual (mean H1) | Days below minimum | Action taken',
          'Kelapa Gading | Nd:YAG laser | 2 | 2.4 | 0 | —',
          'Pondok Indah | Nd:YAG laser | 2 | 2.1 | 3 | List closed for laser on those 3 days, 11 patients rebooked',
          'Bintaro | Nd:YAG laser | 1 | 0.6 | 21 | Laser not offered until cross-training completed 2026-09',
          'Surabaya | Injectables | 2 | 2.0 | 1 | Locum engaged, credentials verified before shift',
          'Bandung | Injectables | 2 | 2.2 | 0 | —',
          'All sites | Aftercare nurse cover | 1 | 1.1 | 6 | Peak-period contract staff engaged for 6 weeks',
          'Engineering | On-call rotation depth | 3 | 2.0 | 181 | Shortfall escalated; infra hire approved, starts 2026-10-01',
        ].join('\n'),
      },
      {
        name: 'qms-7-1-2-cover-breach-report-pondok-indah.pdf',
        fileType: 'PDF',
        uploadedAt: '2026-05-22',
        uploader: 'Tika',
        note: 'Report on the three days Pondok Indah ran below laser minimum and the rebooking of eleven patients.',
      },
    ],
    body: `# QMS-POL-7-1-2 · People — Staffing the Quality Management System

**Owner** Pak Andre (Clinical Director) · **Approver** Aris Ihwan · **Version** v2.2 · **Review** annually
**Requirement** ISO 9001 7.1.2 · **Also satisfies** 9001 7.1.1, 9001 7.2, 9001 7.3, 9001 8.5.1, A.6.1

## Purpose

ISO 9001 7.1.2 requires the organisation to determine and provide the persons necessary for the
effective implementation of its quality management system and for the operation and control of
its processes. At Dermaster that means a specific, unglamorous question asked every day at
thirteen locations: is there someone here today who is certified to do what is on today's list.
This policy sets the minimum and states what happens when the answer is no.

## Scope

Employed practitioners, aftercare staff, front desk staff, and the engineering group including
the on-call rotation. Covers permanent staff, locums and contract staff equally — a locum
delivering treatment is subject to the same minimum as an employee.

## Roles and responsibilities

- **Pak Andre** sets the minimum staffing per treatment type and owns the record.
- **Clinic leads** are responsible for their own site's daily cover and for reporting a breach
  the same day.
- **Wiwin** covers aftercare staffing across sites.
- **Dhiaz Fathra** owns the engineering on-call rotation depth.
- **Pak Rila** funds the cover approved in the resource plan.
- **Tika** samples the record and reports breaches to the management review.

## Policy

1. **Minimums are per treatment type, not per site.** A site is not adequately staffed because
   the door is open; it is adequately staffed for the treatments on its list that day.
2. **An uncovered treatment comes off the list.** Where the certified minimum is not present, the
   treatment is not delivered by an uncertified practitioner and is not delivered under informal
   supervision. Patients are rebooked, told why, and given priority slots. Pondok Indah did this
   on three days in H1 2026, rebooking eleven patients.
3. **Bintaro's laser list stayed closed** for the whole period rather than open with sub-minimum
   cover. A commercially inconvenient closure is the correct outcome of this policy, not a
   failure of it.
4. **Locums and contract staff** have credentials verified before their first shift, not after.
   Verification is recorded against the competence matrix under QMS-SOP-7-2.
5. **On-call depth counts as staffing.** A rotation of two engineers for a platform thirteen
   clinics depend on is below the stated minimum of three; it is recorded as a breach every day
   it persists, and it was escalated rather than normalised.
6. **Breaches are recorded the same day** by the clinic lead, with the number of patients
   affected. A breach discovered later by audit rather than reported at the time is itself a
   finding.
7. Persistent breach — more than five days in a quarter at one site — is escalated to Aris Ihwan
   and enters the risk register under QMS-SOP-6-1-1.

## Records

FRM-7-1-2-01, breach reports and locum verification records. Retained six years.

## Review

Annually, and immediately after any breach that reached a patient.
`,
  },
  {
    code: 'QMS-POL-7-1-3',
    title: 'Infrastructure for the Operation of Processes',
    clause: '7.1.3',
    crossRefs: ['9001 7.1.1', '9001 7.1.4', '9001 8.5.1', '9001 7.1.5', 'A.7.8'],
    version: 'v2.6',
    owner: 'Agil',
    form: { code: 'FRM-7-1-3-01', name: 'Infrastructure register and maintenance schedule' },
    revisions: [
      {
        version: 'v2.4',
        date: '2024-10-08',
        author: 'Agil',
        approval: 'Reviewed by Dhiaz Fathra',
        status: 'Superseded',
        note: 'Cloud infrastructure and clinic building services kept in separate registers; nobody owned the treatment-room power and cooling that the devices depend on.',
      },
      {
        version: 'v2.5',
        date: '2025-07-23',
        author: 'Agil',
        approval: 'Reviewed by Pak Chen',
        status: 'Superseded',
        note: 'One register for buildings, utilities, clinical equipment, transport and ICT; preventive maintenance intervals set per asset class.',
      },
      {
        version: 'v2.6',
        date: '2026-06-09',
        author: 'Agil',
        approval: 'Approved by Aris Ihwan',
        status: 'Current',
        note: 'Added the availability commitment per asset class, the single-region cloud limitation stated openly, and the rule that deferred maintenance is logged as a risk not silently rescheduled.',
      },
    ],
    evidence: [
      {
        name: 'qms-7-1-3-infrastructure-register-2026.xlsx',
        fileType: 'XLSX',
        uploadedAt: '2026-06-16',
        expiryDate: '2027-06-16',
        uploader: 'Agil',
        note: 'Infrastructure register with maintenance intervals, last service and availability achieved.',
        body: [
          'Asset class | Item | Location | Maintenance interval | Last done | Next due | Availability commitment | Achieved H1 2026',
          'Buildings | Treatment room HVAC | all 13 clinics | 6 months | 2026-04-18 | 2026-10-18 | Operating during clinic hours | 99.4 percent',
          'Utilities | UPS for treatment rooms | Kelapa Gading, Pondok Indah | 12 months, battery test 3 months | 2026-05-02 | 2026-08-02 | 30 min hold | Pass, 34 min',
          'Utilities | Backup generator | Surabaya | 12 months, load test 6 months | 2026-03-11 | 2026-09-11 | Auto-start within 60s | Pass, 41s',
          'Clinical equipment | Nd:YAG lasers (9 units) | 6 clinics | Vendor service 12 months | staggered, all current | see register rows | 95 percent uptime | 96.8 percent',
          'ICT — cloud | EKS cluster, RDS, S3 | AWS ap-southeast-1 | Patching monthly, DR test 6 months | 2026-06-01 | 2026-07-01 | 99.9 percent monthly | 99.94 percent',
          'ICT — network | Clinic site links | all 13 clinics | Vendor SLA review 6 months | 2026-02-20 | 2026-08-20 | 99.5 percent | 99.1 percent, Bandung link replaced',
          'Transport | Cold-chain courier for consumables | group | Vendor audit 12 months | 2026-01-30 | 2027-01-30 | Temp excursions zero | 1 excursion, batch rejected',
        ].join('\n'),
      },
      {
        name: 'qms-7-1-3-deferred-maintenance-log-2026.docx',
        fileType: 'DOCX',
        uploadedAt: '2026-06-16',
        expiryDate: '2027-06-16',
        uploader: 'Pak Chen',
        note: 'The two deferred maintenance items for 2026, each with the risk accepted in writing.',
      },
    ],
    body: `# QMS-POL-7-1-3 · Infrastructure for the Operation of Processes

**Owner** Agil (Infrastructure Lead) · **Approver** Aris Ihwan · **Version** v2.6 · **Review** annually
**Requirement** ISO 9001 7.1.3 · **Also satisfies** 9001 7.1.1, 9001 7.1.4, 9001 8.5.1, 9001 7.1.5, A.7.8

## Purpose

ISO 9001 7.1.3 covers infrastructure in a broad sense: buildings and utilities, equipment
including hardware and software, transportation, and information and communication technology.
Dermaster's treatment rooms and its AWS ap-southeast-1 platform are the same requirement, and
splitting them across two registers is how the treatment-room power and cooling ended up owned by
nobody. This policy keeps them in one register with one owner.

## Scope

All 13 clinic locations — building fabric, HVAC, power, UPS and generators, clinical equipment,
clinic network links — and the platform infrastructure in AWS ap-southeast-1 including compute,
databases, storage and the Super App delivery path. Excludes measuring devices' calibration,
which is QMS-SOP-7-1-5, though the same devices appear in this register for maintenance.

## Roles and responsibilities

- **Agil** owns the register, the maintenance schedule and the availability figures.
- **Pak Chen** contracts the maintenance vendors and holds their SLAs.
- **Pak Andre** confirms that a treatment room is fit for use and stops use when it is not.
- **Dhiaz Fathra** approves platform architecture changes that affect availability.
- **Pak Rila** funds maintenance; a refusal is recorded, not absorbed.

## Policy

1. **One register.** Every in-scope asset appears on FRM-7-1-3-01 with its class, location,
   maintenance interval, last service date, next due date and availability commitment.
2. **Availability is committed and measured.** Each asset class states what "working" means —
   HVAC operating during clinic hours, UPS holding 30 minutes, the platform at 99.9 percent
   monthly — and the achieved figure is reported half-yearly against it.
3. **Preventive maintenance is scheduled, not reactive.** Intervals are set per asset class and
   held: HVAC six months, UPS annually with quarterly battery tests, generator load test
   six-monthly, cloud patching monthly, disaster recovery test six-monthly.
4. **Deferred maintenance is a risk, not a reschedule.** Where an item cannot be serviced on time,
   it is entered in the deferred maintenance log with the consequence and an acceptance signed by
   Aris Ihwan. It never simply moves to a later row in the schedule.
5. **Known limitation stated openly.** The platform runs in a single AWS region. Cross-AZ
   resilience is in place; a second region is not funded for 2026. This is recorded as
   R-2026-12 in the risk register rather than described as a resilient architecture.
6. **A treatment room with failed environmental infrastructure is not used.** Pak Andre closes
   it; commercial pressure does not reopen it.
7. **Change to infrastructure follows change control.** A cloud configuration change that affects
   an availability commitment is a reviewed change with a rollback, not an ad hoc console edit.

## Records

FRM-7-1-3-01, service reports, availability reports, deferred maintenance log and DR test
results. Retained six years.

## Review

Annually, and after any infrastructure failure that stopped treatment or took the platform below
its commitment.
`,
  },
  {
    code: 'QMS-SOP-7-5-3-1',
    title: 'Availability and Protection of Documented Information',
    clause: '7.5.3.1',
    crossRefs: ['9001 7.5.3', '9001 7.5.3.2', '9001 7.5.2', '9001 4.4.2', 'A.5.12'],
    version: 'v2.1',
    owner: 'Tika',
    form: { code: 'FRM-7-5-3-1-01', name: 'Point-of-use availability and protection check' },
    revisions: [
      {
        version: 'v1.9',
        date: '2025-04-15',
        author: 'Tika',
        approval: 'Reviewed by Agil',
        status: 'Superseded',
        note: 'Availability assumed because documents were in the register; no check confirmed a practitioner at a clinic could actually reach the current version at the chair side.',
      },
      {
        version: 'v2.1',
        date: '2026-05-27',
        author: 'Tika',
        approval: 'Approved by Aris Ihwan',
        status: 'Current',
        note: 'Added the quarterly point-of-use check across all 13 sites, the offline copy rule for clinical protocols, and the loss-of-integrity reporting route.',
      },
    ],
    evidence: [
      {
        name: 'qms-7-5-3-1-point-of-use-check-2026q2.xlsx',
        fileType: 'XLSX',
        uploadedAt: '2026-07-10',
        expiryDate: '2026-10-10',
        uploader: 'Tika',
        note: 'Q2 point-of-use availability and protection check across the 13 clinic locations and the platform.',
        body: [
          'Location | Document sampled | Reachable at point of use | Version found | Current version | Offline copy present | Finding',
          'Kelapa Gading | Nd:YAG treatment protocol | Yes, tablet at chair | v4.2 | v4.2 | Yes, dated 2026-06-01 | None',
          'Pondok Indah | Consent capture work instruction | Yes | v2.0 | v2.0 | Yes | None',
          'Bintaro | Nd:YAG treatment protocol | Yes | v4.1 | v4.2 | Yes, stale | Superseded offline copy replaced 2026-07-11',
          'Surabaya | Adverse event reporting SOP | Yes | v3.3 | v3.3 | No | Offline copy printed and controlled 2026-07-12',
          'Bandung | Injectables protocol | No, site link down at check | — | v5.0 | Yes | Offline copy was correct; link fault raised to Agil',
          'Depok | Aftercare script AF-01 | Yes | v1.7 | v1.7 | Yes | None',
          'Platform | Incident runbook set | Yes, repo + PagerDuty | commit a91f4c2 | a91f4c2 | Yes, printed in NOC folder | None',
          'All sites | Register access control review | Read-only enforced for 148 clinical users | n/a | n/a | n/a | 2 accounts with write access removed 2026-07-13',
        ].join('\n'),
      },
      {
        name: 'qms-7-5-3-1-integrity-incident-report-june-2026.pdf',
        fileType: 'PDF',
        uploadedAt: '2026-06-24',
        uploader: 'Agil',
        note: 'Report on the S3 lifecycle rule that would have expired retained treatment records early, and its correction.',
      },
    ],
    body: `# QMS-SOP-7-5-3-1 · Availability and Protection of Documented Information

**Owner** Tika (QA Lead) · **Approver** Aris Ihwan · **Version** v2.1 · **Review** annually
**Requirement** ISO 9001 7.5.3.1 · **Also satisfies** 9001 7.5.3, 9001 7.5.3.2, 9001 7.5.2, 9001 4.4.2, A.5.12

## Purpose

ISO 9001 7.5.3.1 requires that documented information be available and suitable for use where and
when it is needed, and adequately protected from loss of confidentiality, improper use or loss of
integrity. QMS-SOP-7-5-3 governs control of documents generally. This procedure covers the half
that is only provable by going and looking: whether a practitioner standing at the chair in
Bintaro can reach the current protocol, and whether what they reach is intact.

## Scope

All controlled documented information used across the 13 clinic locations and by the engineering
group, in the compliance register, the clinic EMR, the Super App, and the platform repositories
in AWS ap-southeast-1.

## Roles and responsibilities

- **Tika** runs the quarterly point-of-use check and owns the findings.
- **Agil** provides the technical protection — access control, backup, immutability, retention
  configuration — and reports any loss of integrity.
- **Clinic leads** maintain the controlled offline copies at their site.
- **Dhiaz Fathra** owns availability of the systems the documents live in.
- **Wiwin** handles confidentiality questions where a document contains patient-identifiable
  material.

## Procedure

1. **Availability is tested, not assumed.** Each quarter Tika samples at least one document per
   location, at the actual point of use, on the device staff would use. Presence in the register
   is not evidence of availability.
2. **Suitable for use** means legible, in a language and format the user works in, and reachable
   without an administrator's help.
3. **Offline copies are mandatory for clinical protocols and the incident runbooks.** A site link
   failure must not stop treatment or an incident response. Bandung's June check proved the point:
   the link was down and the controlled offline copy carried the day.
4. **Offline copies are controlled.** Each carries its version and print date, is replaced within
   10 working days of a new version, and the withdrawn copy is destroyed. A stale offline copy is
   a finding, as Bintaro's was.
5. **Confidentiality.** Access is by role. Clinical users hold read-only access to controlled
   procedures; write access is limited to document owners. The quarterly check includes an access
   review, and inappropriate write access is removed the same week.
6. **Integrity.** Register content is versioned and backed up daily, with backups restore-tested
   twice a year. Storage lifecycle and retention settings are treated as controls: the June 2026
   S3 lifecycle rule that would have expired retained treatment records early was reported as a
   loss-of-integrity incident and corrected, not fixed quietly.
7. **Loss of integrity is reported** through the incident process within one working day of
   discovery, whatever the cause, including configuration error by the engineering group itself.
8. **Improper use.** Controlled documents are not copied into personal drives, chat threads, or
   messaging groups. A document found outside a controlled location is withdrawn and the incident
   recorded.

## Records

FRM-7-5-3-1-01 quarterly checks, access review results, restore test results and integrity
incident reports. Retained six years.

## Review

Annually, and immediately after any loss-of-integrity incident.
`,
  },
  {
    code: 'QMS-SOP-7-5-3-2',
    title: 'Control of Documented Information of External Origin',
    clause: '7.5.3.2',
    crossRefs: ['9001 7.5.3', '9001 7.5.3.1', '9001 8.4', '9001 7.1.6', 'A.5.20'],
    version: 'v1.7',
    owner: 'Pak Chen',
    form: { code: 'FRM-7-5-3-2-01', name: 'External document register and currency check' },
    revisions: [
      {
        version: 'v1.5',
        date: '2024-09-30',
        author: 'Pak Chen',
        approval: 'Reviewed by Tika',
        status: 'Superseded',
        note: 'External documents identified but not version-tracked; two device instructions for use were three revisions behind the manufacturer.',
      },
      {
        version: 'v1.6',
        date: '2025-10-14',
        author: 'Pak Chen',
        approval: 'Reviewed by Pak Andre',
        status: 'Superseded',
        note: 'Currency check made half-yearly with a named owner per external document.',
      },
      {
        version: 'v1.7',
        date: '2026-04-28',
        author: 'Pak Chen',
        approval: 'Approved by Aris Ihwan',
        status: 'Current',
        note: 'Added the impact assessment on a manufacturer or regulatory update, and the rule that a superseded external document is withdrawn from clinic use within 10 working days.',
      },
    ],
    evidence: [
      {
        name: 'qms-7-5-3-2-external-document-register-2026.xlsx',
        fileType: 'XLSX',
        uploadedAt: '2026-05-12',
        expiryDate: '2026-11-12',
        uploader: 'Pak Chen',
        note: 'External documents of external origin held under control, with the currency check result.',
        body: [
          'External document | Source | Version held | Version current at check | Checked | Owner | Impact assessed',
          'Kemenkes clinic operating requirements | Ministry of Health | 2026 edition | 2026 edition | 2026-05-05 | Wiwin | n/a, no change',
          'Kemenkes advertising rules for health services | Ministry of Health | Mar 2026 revision | Mar 2026 revision | 2026-05-05 | Wiwin | Yes — 2 campaign assets withdrawn 2026-04-02',
          'Nd:YAG laser instructions for use | Device manufacturer | Rev 7 | Rev 7 | 2026-04-22 | Pak Andre | Yes — pre-treatment cooling step added to protocol v4.2',
          'Cryotherapy unit service manual | Device manufacturer | Rev 3 | Rev 4 | 2026-04-22 | Pak Andre | Rev 4 obtained 2026-04-29, superseded copies withdrawn 2026-05-06',
          'Injectable product datasheets (11 SKUs) | Suppliers | current per SKU | current per SKU | 2026-04-30 | Pak Andre | 1 storage temperature change, cold-chain SOP updated',
          'ISO 9001:2015 standard text | ISO / BSN | 2015 | 2015 | 2026-05-05 | Tika | No change',
          'AWS shared responsibility and service terms | AWS | 2026-03 | 2026-03 | 2026-05-08 | Agil | Reviewed, no control change needed',
          'Personal data protection law guidance | Regulator | 2025 guidance | 2025 guidance | 2026-05-08 | Dhiaz Fathra | Privacy notice reviewed, unchanged',
        ].join('\n'),
      },
      {
        name: 'qms-7-5-3-2-withdrawal-confirmation-cryo-manual.docx',
        fileType: 'DOCX',
        uploadedAt: '2026-05-07',
        expiryDate: '2027-05-07',
        uploader: 'Pak Andre',
        note: 'Confirmation that Rev 3 of the cryotherapy service manual was withdrawn from all three sites holding it.',
      },
    ],
    body: `# QMS-SOP-7-5-3-2 · Control of Documented Information of External Origin

**Owner** Pak Chen · **Approver** Aris Ihwan · **Version** v1.7 · **Review** annually
**Requirement** ISO 9001 7.5.3.2 · **Also satisfies** 9001 7.5.3, 9001 7.5.3.1, 9001 8.4, 9001 7.1.6, A.5.20

## Purpose

ISO 9001 7.5.3.2 requires that documented information of external origin, determined by the
organisation to be necessary for the planning and operation of the quality management system, be
identified as appropriate and controlled. Dermaster depends on documents it does not write:
device instructions for use, product datasheets, Kemenkes requirements, cloud provider terms. In
2024 two device instructions in daily use were three manufacturer revisions behind, which is how
a treatment can be delivered correctly according to a document that is wrong.

## Scope

Every externally originated document that a Dermaster process depends on: regulatory and
statutory texts, device instructions for use and service manuals, injectable product datasheets,
standards, supplier specifications, and the terms and shared responsibility documents for AWS
ap-southeast-1. Excludes reference material nobody's process depends on.

## Roles and responsibilities

- **Pak Chen** owns the register and runs the half-yearly currency check.
- **Pak Andre** owns device and product documents and assesses clinical impact.
- **Wiwin** owns regulatory documents affecting patients and marketing.
- **Agil** and **Dhiaz Fathra** own cloud and data protection documents.
- **Tika** audits the register against what is actually in use at the clinics.

## Procedure

1. **Determination.** A document enters the register when a process depends on it. The process
   owner requests entry; the test is whether the process would be performed differently if the
   document changed.
2. **Identification.** Each entry records the document, its source, the exact version or revision
   held, where the controlled copy lives, and its named owner. Version is recorded as the
   publisher writes it — "Rev 7", not "latest".
3. **Currency check.** Half-yearly, the owner checks the held version against the publisher's
   current version and records both, even when they match. A check that only records exceptions
   cannot be distinguished from a check that was not done.
4. **Obtaining an update.** Where the held version is behind, the current version is obtained
   within 10 working days.
5. **Impact assessment is mandatory on any change.** The owner states in writing what the change
   means for Dermaster's own documents and processes. Rev 7 of the laser instructions added a
   pre-treatment cooling step, which changed the internal protocol to v4.2; the assessment is what
   made that connection instead of filing the new revision unread.
6. **Withdrawal.** Superseded external documents are withdrawn from every point of use within 10
   working days and the withdrawal is confirmed per site, as it was for Rev 3 of the cryotherapy
   service manual across three locations.
7. **Regulatory changes are not held to the cycle.** A change to a Kemenkes requirement is acted
   on immediately on discovery, with the register updated afterwards.
8. **No modification.** External documents are never edited. Where Dermaster's practice differs
   from a manufacturer's instruction, the difference is documented in an internal procedure with
   a clinical justification approved by Pak Andre.

## Records

FRM-7-5-3-2-01, impact assessments and withdrawal confirmations. Retained six years, or the life
of the associated device plus two years.

## Review

Annually, and immediately after any regulatory publication affecting clinic operations.
`,
  },
  {
    code: 'QMS-POL-7-1-4',
    title: 'Environment for the Operation of Clinic and Engineering Processes',
    clause: '7.1.4',
    crossRefs: ['9001 7.1.3', '9001 8.5.1', '9001 8.5.4', 'A.7.3', 'A.7.5'],
    version: 'v2.1',
    owner: 'Pak Andre',
    form: { code: 'FRM-7-1-4-01', name: 'Treatment room environment round' },
    revisions: [
      {
        version: 'v1.4',
        date: '2024-11-08',
        author: 'Wiwin',
        approval: 'Reviewed by Pak Andre',
        status: 'Superseded',
        note: 'Temperature and humidity limits set per treatment room; no rule for what to do when a room is outside them.',
      },
      {
        version: 'v2.1',
        date: '2026-02-16',
        author: 'Pak Andre',
        approval: 'Approved by Aris Ihwan',
        status: 'Current',
        note: 'Room is taken out of use when outside limits, not treated with a note; the social and psychological conditions clause 7.1.4 asks for is written down rather than assumed.',
      },
    ],
    evidence: [
      {
        name: 'qms-7-1-4-environment-rounds-2026-q2.xlsx',
        fileType: 'XLSX',
        uploadedAt: '2026-07-06',
        expiryDate: '2027-07-06',
        uploader: 'Wiwin',
        note: 'Quarterly environment rounds across all 13 clinics, with the two rooms taken out of use.',
        body: [
          'Clinic | Room | Temp (C) | RH (%) | Lux at couch | Noise (dBA) | Result | Action',
          'Kemang | Laser 1 | 21.4 | 48 | 780 | 44 | Pass | —',
          'Kemang | Injectable 2 | 22.1 | 51 | 810 | 46 | Pass | —',
          'Bintaro | Laser 1 | 25.9 | 63 | 730 | 49 | Fail | Room closed 2026-05-14, split unit recharged, reopened 2026-05-16',
          'Kelapa Gading | Treatment 3 | 22.8 | 55 | 640 | 47 | Fail (lux) | Closed for lamp replacement 2026-06-02, reopened same day',
          'Surabaya Pakuwon | Laser 1 | 21.9 | 50 | 795 | 43 | Pass | —',
          'Bandung Dago | Injectable 1 | 22.4 | 52 | 802 | 45 | Pass | —',
          'Medan | Treatment 2 | 23.1 | 57 | 770 | 48 | Pass | —',
          'Rooms inspected: 41. Failures: 2. Both closed on the day, neither treated while out of limits.',
        ].join('\n'),
      },
    ],
    body: `# QMS-POL-7-1-4 · Environment for the Operation of Clinic and Engineering Processes

**Clause:** ISO 9001:2015 7.1.4 · **Cross references:** 9001 7.1.3, 9001 8.5.1, 9001 8.5.4, A.7.3, A.7.5

## Purpose

A treatment room is part of the treatment. A laser room that has drifted to 26 degrees and 63 percent humidity changes how a device performs and how a patient tolerates the session, and an engineer working a fourth consecutive on-call night makes different decisions than a rested one. This policy states the physical, social and psychological conditions Dermaster maintains for its processes, who checks them, and what happens when a condition is not met.

## Scope

Covers the 13 clinic sites — treatment rooms, recovery areas, consultation rooms, the clean store and the waiting area — and the engineering working environment, including the on-call rota. It does not cover the AWS ap-southeast-1 platform environment, which is QMS-POL-7-1-3.

## Roles and responsibilities

- **Pak Andre** owns this policy and the clinic environment standard, and is the only person who may reopen a closed room.
- **Wiwin** runs the quarterly environment round and holds the results.
- The **site lead** at each clinic reads the room log daily before the first appointment.
- **Dhiaz Fathra** owns the engineering working conditions and the on-call rota limits.
- **Pak Rila** funds remediation; an environment failure is not deferred to the next budget cycle.

## Physical conditions

1. Treatment rooms are held between 20 and 24 degrees Celsius and 40 to 60 percent relative humidity, measured continuously and logged hourly.
2. Illuminance at the treatment couch is at least 600 lux; consultation rooms at least 300 lux.
3. Ambient noise in a treatment room does not exceed 50 dBA during a session.
4. A room outside any of these limits is closed. It is not used with a note in the log, and it is not used "for the last appointment of the day". Closure is recorded with the time, the reading and the person who closed it.
5. A closed room reopens only after a re-reading inside limits, recorded by Pak Andre.

## Social and psychological conditions

6. Consultation and consent take place in a room with the door closed and no third party present unless the patient asks for one. A patient is never asked to discuss a treatment plan in the waiting area.
7. Any member of staff may stop a treatment on patient-safety grounds without seeking approval first, and does so without consequence. Two stops were recorded in the twelve months to June 2026; neither attracted a disciplinary step.
8. Engineering on-call is capped at one week in four, and an engineer paged after midnight does not start before 12:00 the following day. The rota is published a month ahead.
9. Workload pressure that would push a practitioner below the minimum session time for a treatment is escalated to Pak Andre and the schedule is cut, not the session.

## Monitoring

Wiwin walks every site once a quarter against FRM-7-1-4-01 and records each room's readings, pass or fail, and the action taken. Results go to management review as a standing item. Repeat failures at the same room in two consecutive rounds are raised as a nonconformity under 10.2 rather than logged again.

## Review

Annually in February, and immediately after any room closure that lasted more than five working days.
`,
  },
  {
    code: 'QMS-SOP-7-1-5-1',
    title: 'Monitoring and Measuring Resources — Determination, Suitability and Records',
    clause: '7.1.5.1',
    crossRefs: ['9001 7.1.5', '9001 7.1.5.2', '9001 9.1.1', '9001 8.6', 'A.5.9'],
    version: 'v3.0',
    owner: 'Wiwin',
    form: { code: 'FRM-7-1-5-1-01', name: 'Monitoring and measuring resource register' },
    revisions: [
      {
        version: 'v2.2',
        date: '2024-07-19',
        author: 'Wiwin',
        approval: 'Reviewed by Pak Andre',
        status: 'Superseded',
        note: 'Device register held per clinic in separate sheets; no single view of what was due.',
      },
      {
        version: 'v3.0',
        date: '2026-03-09',
        author: 'Wiwin',
        approval: 'Approved by Pak Andre',
        status: 'Current',
        note: 'One register for all 13 sites, each device tied to the measurement it is trusted for and to the treatment that depends on it; suitability is re-confirmed on every service, not only on purchase.',
      },
    ],
    evidence: [
      {
        name: 'qms-7-1-5-1-resource-register-2026.xlsx',
        fileType: 'XLSX',
        uploadedAt: '2026-03-11',
        expiryDate: '2027-03-11',
        uploader: 'Wiwin',
        note: 'The register as approved, with the two devices withdrawn as unsuitable.',
        body: [
          'Asset | Device | Site | Measurement relied on | Tolerance needed | Status | Verified',
          'MMR-018 | Lumenis M22 energy meter | Kemang | Fluence J/cm2 | ±5% | In service | 2026-02-20',
          'MMR-024 | Candela GentleMax fluence check | Bintaro | Fluence J/cm2 | ±5% | In service | 2026-02-27',
          'MMR-031 | Room thermohygrometer | Kelapa Gading | Temp/RH | ±0.5 C / ±3% | In service | 2026-01-30',
          'MMR-033 | Vaccine fridge probe | Surabaya Pakuwon | 2-8 C store | ±0.3 C | In service | 2026-02-06',
          'MMR-041 | Handheld skin analyser | Bandung Dago | Melanin index | Indicative only | Not relied on | Excluded from register 2026-03-05',
          'MMR-009 | Legacy energy meter | Medan | Fluence J/cm2 | ±5% | Withdrawn | Drift 11% at service, replaced by MMR-047',
          'Devices on register: 47. Relied on for conformity: 38. Withdrawn this cycle: 2.',
        ].join('\n'),
      },
    ],
    body: `# QMS-SOP-7-1-5-1 · Monitoring and Measuring Resources — Determination, Suitability and Records

**Clause:** ISO 9001:2015 7.1.5.1 · **Cross references:** 9001 7.1.5, 9001 7.1.5.2, 9001 9.1.1, 9001 8.6, A.5.9

## Purpose

Clause 7.1.5.1 asks two questions that are easy to conflate: which resources does the organisation actually need in order to trust its own results, and are those resources fit for what is being asked of them. QMS-POL-7-1-5 states that Dermaster maintains such resources; this procedure states how each one is determined, judged suitable, and evidenced. Traceability and calibration intervals are QMS-SOP-7-1-5-2.

## Scope

Every device whose reading is used to accept a treatment, release a batch of consumables, or claim conformity of a service — laser and IPL energy meters, room thermohygrometers, cold-chain probes, timers used for exposure, and the scales used for topical preparation. A device that produces an indicative number nobody relies on is deliberately excluded and marked as such, so the register is not padded.

## Roles and responsibilities

- **Wiwin** owns the register and decides whether a device is relied on for conformity.
- **Pak Andre** approves any addition or withdrawal.
- The **site lead** confirms the device present on site matches the register at each quarterly round.
- **Pak Chen** places service and replacement orders and holds the supplier records.

## Procedure

1. For each measurement the QMS depends on, Wiwin records what is being measured, the tolerance the treatment protocol actually needs, and the device relied on. The tolerance comes from the protocol, never from the device's datasheet.
2. A device enters the register only when its capability is at least as tight as the tolerance required. A device that cannot meet the tolerance is not "used with care" — it is excluded and the measurement is taken another way.
3. Suitability is re-confirmed at every service, not only at purchase. A service report showing drift beyond the required tolerance withdraws the device the same day.
4. A withdrawn device is physically labelled and removed from the treatment room, and every result taken since its last good verification is reviewed under 8.7 for nonconforming output. In the 2026 cycle this applied to MMR-009 at Medan and covered 14 sessions, all of which re-verified as within protocol.
5. The register is the record clause 7.1.5.1 requires. It names the asset, the site, the measurement, the tolerance, the current status and the date of last verification, and is retained for seven years.
6. Devices excluded as not relied on are listed in the same register with the reason, so an auditor can see the boundary rather than infer it.

## Monitoring

Wiwin reconciles the register against the physical estate quarterly. A device found on site but not on the register is a nonconformity, as is a device on the register that nobody can produce.

## Review

Annually in March, and on any withdrawal.
`,
  },
  {
    code: 'QMS-SOP-7-1-5-2',
    title: 'Measurement Traceability and Calibration',
    clause: '7.1.5.2',
    crossRefs: ['9001 7.1.5.1', '9001 8.7', '9001 9.1.1', '9001 10.2', 'A.5.33'],
    version: 'v3.1',
    owner: 'Wiwin',
    form: { code: 'FRM-7-1-5-2-01', name: 'Calibration certificate and drift log' },
    revisions: [
      {
        version: 'v2.5',
        date: '2024-10-02',
        author: 'Pak Chen',
        approval: 'Reviewed by Wiwin',
        status: 'Superseded',
        note: 'Calibration outsourced and certificates filed; no rule on what to do with results taken before an out-of-tolerance finding.',
      },
      {
        version: 'v3.1',
        date: '2026-04-13',
        author: 'Wiwin',
        approval: 'Approved by Pak Andre',
        status: 'Current',
        note: 'Retrospective validity assessment made mandatory on any out-of-tolerance certificate, with the affected population defined by date rather than by judgement.',
      },
    ],
    evidence: [
      {
        name: 'qms-7-1-5-2-calibration-log-2026.pdf',
        fileType: 'PDF',
        uploadedAt: '2026-04-20',
        expiryDate: '2027-04-20',
        uploader: 'Pak Chen',
        note: 'Calibration certificates and drift log for the 2026 cycle, including the one out-of-tolerance case and its retrospective assessment.',
        body: [
          'Asset | Certificate | Body | Standard traced to | Calibrated | Due | Drift found | Outcome',
          'MMR-018 | KAN-2026-01142 | PT Kalibrasi Nusantara (KAN LK-118) | SI via national standard | 2026-02-20 | 2027-02-20 | +1.8% | In tolerance',
          'MMR-024 | KAN-2026-01188 | PT Kalibrasi Nusantara (KAN LK-118) | SI via national standard | 2026-02-27 | 2027-02-27 | -2.4% | In tolerance',
          'MMR-031 | KAN-2026-00977 | PT Kalibrasi Nusantara (KAN LK-118) | SI via national standard | 2026-01-30 | 2027-01-30 | +0.2 C | In tolerance',
          'MMR-033 | KAN-2026-01005 | PT Kalibrasi Nusantara (KAN LK-118) | SI via national standard | 2026-02-06 | 2027-02-06 | -0.1 C | In tolerance',
          'MMR-009 | KAN-2026-01203 | PT Kalibrasi Nusantara (KAN LK-118) | SI via national standard | 2026-03-04 | n/a | +11.0% | OUT OF TOLERANCE — withdrawn',
          '',
          'Retrospective assessment, MMR-009 (raised as CAR-2026-014):',
          'Population: all sessions on the Medan laser between the previous good certificate (2025-03-06) and withdrawal (2026-03-04) — 14 sessions.',
          'Method: delivered fluence recalculated at +11% and compared with the protocol ceiling for each session.',
          'Result: 14 of 14 remained inside the protocol ceiling. No patient recall required. Two patients contacted as a precaution; both declined review.',
          'Signed: Wiwin, 2026-04-13. Countersigned: Pak Andre, 2026-04-15.',
        ].join('\n'),
      },
    ],
    body: `# QMS-SOP-7-1-5-2 · Measurement Traceability and Calibration

**Clause:** ISO 9001:2015 7.1.5.2 · **Cross references:** 9001 7.1.5.1, 9001 8.7, 9001 9.1.1, 9001 10.2, A.5.33

## Purpose

A measurement is only worth what its chain back to a national or international standard is worth. This procedure states how the devices in the register at QMS-SOP-7-1-5-1 are calibrated or verified, how they are protected from falling out of adjustment, and — the part clause 7.1.5.2 is really testing — what the organisation does about results it already acted on when a device turns out to have been wrong.

## Scope

Every device the register marks as relied on for conformity. Devices excluded there are excluded here.

## Roles and responsibilities

- **Wiwin** owns this procedure, sets intervals and signs retrospective assessments.
- **Pak Chen** books calibration, holds the certificates and chases the due list.
- **Pak Andre** countersigns any retrospective assessment that touches a patient.
- The **site lead** protects the device day to day and reports any knock, drop or unexplained reading immediately.

## Procedure

1. Every device on the register is calibrated or verified against a standard traceable to the SI, through a KAN-accredited laboratory. Where no traceable standard exists the basis used for verification is recorded instead, with the reason — this currently applies to no device in the estate.
2. Calibration intervals are twelve months for energy meters and cold-chain probes, twenty-four months for room thermohygrometers, and immediately on any suspected knock or drop regardless of interval.
3. Each device carries a label showing its asset number, the date calibrated and the date due. A device with an expired or missing label is not used.
4. Devices are protected from adjustment, damage and deterioration: energy meters travel in their cases, room probes are wall-mounted out of reach, and no member of staff adjusts a device — adjustment is the calibration body's act alone.
5. **When a device is found out of tolerance**, Wiwin withdraws it the same day and opens a corrective action. The affected population is every result taken since the last certificate that showed the device in tolerance, defined by date and not by anyone's recollection. Each result is re-evaluated against the protocol it was used for, and the conclusion is written down whether or not anything was found. The assessment is signed by Wiwin and, where a patient is involved, countersigned by Pak Andre.
6. Certificates and drift logs are retained for seven years under A.5.33, which is longer than the calibration cycle so a chain can always be reconstructed.

## Monitoring

Pak Chen publishes the calibration due list monthly. A device inside 30 days of due and not yet booked is escalated to Wiwin; a device past due is treated as withdrawn until calibrated.

## Review

Annually in April, and immediately after any out-of-tolerance finding.
`,
  },
]

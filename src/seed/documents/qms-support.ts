import type { SeedDocument } from './types'

/** ISO 9001:2015 clause 7 — resources, competence, awareness, communication, documents. */
export const QMS_SUPPORT: SeedDocument[] = [
  {
    code: 'QMS-POL-7-1',
    title: 'Provision of Resources for the Quality Management System',
    clause: '7.1',
    crossRefs: ['9001 7.1.5', '9001 7.2', '9001 5.1', 'A.5.2'],
    version: 'v2.0',
    owner: 'Dhiaz Fathra',
    form: { code: 'FRM-7-1-01', name: 'Annual resource plan and shortfall log' },
    revisions: [
      {
        version: 'v1.3',
        date: '2024-09-12',
        author: 'Pak Rila',
        approval: 'Reviewed by Dhiaz Fathra',
        status: 'Superseded',
        note: 'Budget lines listed per clinic; engineering headcount still carried under general overhead.',
      },
      {
        version: 'v2.0',
        date: '2026-01-19',
        author: 'Dhiaz Fathra',
        approval: 'Approved by Aris Ihwan',
        status: 'Current',
        note: 'Engineering, infrastructure and clinic resources planned in one cycle; shortfall escalation route and the 10 working day decision limit added.',
      },
    ],
    evidence: [
      {
        name: 'resource-plan-2026.xlsx',
        fileType: 'XLSX',
        uploadedAt: '2026-01-26',
        expiryDate: '2027-01-26',
        uploader: 'Pak Rila',
        note: 'Approved resource plan for the 2026 cycle with the shortfall log appended.',
        body: [
          'Area | Requested | Approved | Decided by | Note',
          'Clinic practitioner headcount (13 locations) | 18 | 16 | Aris Ihwan | Two deferred to H2 pending Bintaro fit-out',
          'Engineering headcount | 6 | 6 | Aris Ihwan | Two backend, one QA, one infra, two data',
          'AWS ap-southeast-1 run rate | 21,000 USD/mo | 19,500 USD/mo | Pak Rila | Reserved instance purchase closes the gap',
          'Calibration contract (measuring devices) | 1 vendor | 1 vendor | Pak Chen | Renewed with the incumbent, 12 month term',
          'Training budget | 240,000,000 IDR | 240,000,000 IDR | Aris Ihwan | Split 60/40 clinical/engineering',
          'Shortfall — QA automation licences | 4 seats | 0 | Pak Rila | Logged 2026-03-02, revisit at the Q3 review',
        ].join('\n'),
      },
    ],
    body: `# QMS-POL-7-1 · Provision of Resources for the Quality Management System

**Owner** Dhiaz Fathra · **Approver** Aris Ihwan · **Version** v2.0 · **Review** annually, at the January planning cycle
**Requirement** ISO 9001 7.1 · **Also satisfies** 9001 7.1.5, 9001 7.2, 9001 5.1, A.5.2

## Purpose

Dermaster Indonesia runs clinic operations at 13 locations and an in-house engineering group
that builds the systems those clinics depend on. Both consume people, equipment, infrastructure
and money, and both used to ask for them separately, at different times, from the same budget.
This policy states how resources for the quality management system are decided, who decides
them, and what happens when the answer is no.

## Scope

Covers people, premises, clinical and measuring equipment, IT infrastructure, and externally
provided capacity used to deliver treatment or to build and run the platform. It does not cover
capital projects for new clinic locations, which follow the group's investment approval process
and reach this policy only once the location is operating.

## Roles and responsibilities

- **Aris Ihwan** approves the annual resource plan and any single item above 100,000,000 IDR.
- **Pak Rila** consolidates the requests, holds the budget, and maintains the shortfall log.
- **Pak Andre** states the clinic requirement — practitioner cover, treatment rooms, devices.
- **Dhiaz Fathra** states the engineering and infrastructure requirement and owns this policy.
- **Agil** sizes cloud capacity from the previous twelve months of usage, not from estimates.
- **Pak Chen** sources anything the group buys rather than builds.

## Policy

1. Resources are planned once a year in January, in one cycle, with clinic and engineering
   requests on the same sheet. Mid-year requests are allowed but are exceptions and must name
   what changed.
2. Every request states the quality consequence of refusal in one sentence. A request that
   cannot state one does not enter the plan.
3. Infrastructure capacity for AWS ap-southeast-1 is sized against the trailing twelve month
   usage curve plus 30 percent headroom. Agil publishes the curve before the cycle opens.
4. A resource decision — approved, reduced or refused — is given within 10 working days of the
   request being consolidated. Silence is not a decision.
5. Refusals and reductions are recorded in the shortfall log with the quality consequence
   carried across verbatim. The log is a standing input to the management review; it is the
   organisation's honest record of what it chose not to fund.
6. Practitioner cover at each location is planned to the treatment schedule, never below the
   minimum staffing stated in the clinic operating procedure, regardless of budget pressure.
7. Externally provided capacity — locum practitioners, contract engineers, the calibration
   vendor — is planned in this cycle and controlled under the external provider procedure.

## Records

The approved resource plan and the shortfall log are held as FRM-7-1-01 in this repository,
retained for six years. Purchase records sit with finance under their own retention.

## Review

Annually before the January cycle opens, and at any management review where the shortfall log
shows an item deferred twice.
`,
  },
  {
    code: 'QMS-SOP-7-1-5',
    title: 'Control of Monitoring and Measuring Resources',
    clause: '7.1.5',
    crossRefs: ['9001 7.1', '9001 9.1.1', '9001 8.5.1', 'A.8.16'],
    version: 'v3.1',
    owner: 'Tika',
    form: { code: 'FRM-7-1-5-01', name: 'Calibration and verification register' },
    revisions: [
      {
        version: 'v3.0',
        date: '2025-05-08',
        author: 'Tika',
        approval: 'Reviewed by Pak Andre',
        status: 'Superseded',
        note: 'Clinical devices and measurement pipelines brought under one register after the Kelapa Gading laser drifted unnoticed for six weeks.',
      },
      {
        version: 'v3.1',
        date: '2026-02-11',
        author: 'Tika',
        approval: 'Approved by Aris Ihwan',
        status: 'Current',
        note: 'Added the retrospective validity step for out-of-tolerance findings and the monthly ETL reconciliation check.',
      },
    ],
    evidence: [
      {
        name: 'calibration-register-2026.xlsx',
        fileType: 'XLSX',
        uploadedAt: '2026-06-02',
        expiryDate: '2026-12-02',
        uploader: 'Tika',
        note: 'Live register of measuring devices and measurement pipelines with due dates.',
        body: [
          'Asset | Location | Type | Last verified | Interval | Next due | Status',
          'Nd:YAG laser #4 | Kelapa Gading | External calibration | 2026-04-14 | 12 months | 2027-04-14 | In tolerance',
          'Nd:YAG laser #7 | Pondok Indah | External calibration | 2026-01-20 | 12 months | 2027-01-20 | In tolerance',
          'Cryotherapy unit #2 | Bintaro | External calibration | 2025-11-03 | 12 months | 2026-11-03 | In tolerance',
          'Digital thermometer set (14) | all clinics | Internal verification | 2026-05-30 | 3 months | 2026-08-30 | In tolerance',
          'Weighing scale #9 | Surabaya | Internal verification | 2026-02-08 | 3 months | 2026-05-08 | Overdue — removed from service 2026-05-09',
          'SPACE/DORA ETL | AWS ap-southeast-1 | Pipeline reconciliation | 2026-06-01 | Monthly | 2026-07-01 | Reconciled, 0.2 percent variance',
          'Satisfaction survey export | Super App | Pipeline reconciliation | 2026-06-01 | Monthly | 2026-07-01 | Reconciled',
        ].join('\n'),
      },
      {
        name: 'out-of-tolerance-report-scale-9.pdf',
        fileType: 'PDF',
        uploadedAt: '2026-05-16',
        uploader: 'Pak Andre',
        note: 'Retrospective validity assessment after the Surabaya scale was found out of tolerance.',
      },
    ],
    body: `# QMS-SOP-7-1-5 · Control of Monitoring and Measuring Resources

**Owner** Tika (QA Lead) · **Approver** Aris Ihwan · **Version** v3.1 · **Review** every six months
**Requirement** ISO 9001 7.1.5 · **Also satisfies** 9001 7.1, 9001 9.1.1, 9001 8.5.1, A.8.16

## Purpose

Two different things measure at Dermaster: devices in the treatment room, and pipelines that
produce the numbers management reads. Both can drift, and a drifting measurement is worse than
no measurement because it is believed. This procedure keeps both under the same discipline.

## Scope

Clinical and diagnostic devices whose reading affects a treatment decision or a safety limit;
weighing, temperature and timing instruments used in clinic; and the measurement pipelines that
feed the SPACE/DORA workbook and the customer satisfaction report. Excludes office equipment
and any device used only for comfort or display.

## Roles and responsibilities

- **Tika** owns the register, sets intervals, and runs the pipeline reconciliation.
- **Pak Andre** takes devices out of service and assesses treatment validity.
- **Pak Chen** holds the external calibration contract and books the vendor.
- **Agil** provides the infrastructure evidence when a pipeline discrepancy is traced to
  ingestion rather than to the calculation.

## Procedure

1. **Register.** Every in-scope asset is entered in FRM-7-1-5-01 with its identifier, location,
   verification method, interval and next due date. An asset not in the register may not be used
   for a measurement that is recorded.
2. **Intervals.** Clinical devices requiring external calibration: 12 months. Internally
   verified instruments (thermometers, scales, timers): 3 months. Measurement pipelines:
   reconciled monthly against source rows.
3. **Booking.** Pak Chen raises the calibration order 20 working days before the due date. Tika
   receives the certificate and files it against the register row.
4. **Verification method for pipelines.** Tika re-derives one month of a metric directly from
   the source tables and compares it with the published figure. A variance above 1 percent is a
   finding and stops publication of that metric until resolved.
5. **Identification.** Each calibrated device carries a label showing the last verification date
   and the next due date. An unlabelled device is treated as unverified.
6. **Out of tolerance.** The device is removed from service the same day. Tika and Pak Andre
   then assess, in writing, the validity of results produced since the last good verification
   and whether any patient must be recalled. That assessment is filed as a PDF report and is
   mandatory even when the conclusion is that nothing was affected.
7. **Return to service.** Only after a passing certificate or verification, with the register
   row updated and the label replaced.
8. **Safeguarding.** Devices are stored and transported per the manufacturer's instruction;
   pipeline code and its parameters are version controlled, and an adjustment to a calculation
   is a reviewed change like any other.

## Records

Calibration certificates, internal verification sheets, out-of-tolerance assessments and monthly
reconciliation notes. Retained for six years, or the life of the asset plus two years,
whichever is longer.

## Review

Every six months by Tika, and immediately after any out-of-tolerance finding that reached a
patient result.
`,
  },
  {
    code: 'QMS-POL-7-1-6',
    title: 'Organizational Knowledge',
    clause: '7.1.6',
    crossRefs: ['9001 7.2', '9001 7.4', '9001 7.5.3', 'A.5.37'],
    version: 'v1.4',
    owner: 'Andreas',
    form: { code: 'FRM-7-1-6-01', name: 'Knowledge asset and key-person risk register' },
    revisions: [
      {
        version: 'v1.2',
        date: '2024-11-27',
        author: 'Andreas',
        approval: 'Reviewed by Dhiaz Fathra',
        status: 'Superseded',
        note: 'Knowledge listed only for engineering; clinical technique knowledge sat outside the register.',
      },
      {
        version: 'v1.4',
        date: '2026-03-23',
        author: 'Andreas',
        approval: 'Approved by Aris Ihwan',
        status: 'Current',
        note: 'Clinical technique and supplier knowledge added; key-person risk scored and the ADR rule made mandatory for contract-level decisions.',
      },
    ],
    evidence: [
      {
        name: 'knowledge-register-2026.xlsx',
        fileType: 'XLSX',
        uploadedAt: '2026-03-23',
        expiryDate: '2027-03-23',
        uploader: 'Andreas',
        note: 'Knowledge the organisation depends on, where it is written down, and who else holds it.',
        body: [
          'Knowledge | Held by | Written down where | Second holder | Key-person risk',
          'Patient identity model and merge rules | Rica | ADR-0009, data-map.yaml | Andreas | Low',
          'Laser settings per skin type protocol | Pak Andre | Clinical protocol binder, rev 7 | Senior practitioner per location | Medium',
          'AWS ap-southeast-1 network and failover design | Agil | Infrastructure runbook | Randy | High — single holder of the DR runbook until Q3',
          'Billing reconciliation with the finance ledger | Pak Rila | QMS-SOP-8-6 appendix | Wiwin | Medium',
          'Supplier qualification history | Pak Chen | Supplier register | Wiwin | Medium',
          'Measurement ETL and metric definitions | Tika | Measurement workbook notes | Randy | Medium',
        ].join('\n'),
      },
    ],
    body: `# QMS-POL-7-1-6 · Organizational Knowledge

**Owner** Andreas (Solutions Architect) · **Approver** Aris Ihwan · **Version** v1.4 · **Review** twice a year
**Requirement** ISO 9001 7.1.6 · **Also satisfies** 9001 7.2, 9001 7.4, 9001 7.5.3, A.5.37

## Purpose

Most of what makes Dermaster work is not in any document: why the patient merge rule is what it
is, which laser setting suits which skin type, how the failover was actually tested. When one
person holds that alone, an ordinary resignation becomes an incident. This policy names the
knowledge the organisation depends on and requires that it be written down and held twice.

## Scope

Applies to knowledge needed to deliver treatment consistently and to operate and change the
platform. It covers clinical technique, engineering design intent, supplier history and the
definitions behind reported numbers. It does not cover individual professional qualifications,
which are handled as competence, nor general industry knowledge available in textbooks.

## Roles and responsibilities

- **Andreas** maintains the register and challenges entries that are vague.
- **Dhiaz Fathra** decides which engineering decisions require an ADR.
- **Pak Andre** owns clinical technique knowledge and the protocol binder.
- **Pak Chen** owns supplier and procurement history.
- **Tika** owns metric definitions, so that a number means the same thing next quarter.

## Policy

1. Knowledge the organisation depends on is listed in FRM-7-1-6-01 with its holder, where it is
   recorded, and a named second holder.
2. **Every decision that changes a contract, a clinical protocol or a failure mode is recorded
   as an ADR or a protocol revision, stating what was decided and what was rejected.** The
   rejected option is the part that saves the next person a week.
3. Any entry with no second holder is a key-person risk, scored High, and carries a dated plan
   to close it. High entries are reported at the management review until closed.
4. Knowledge is recorded where the work happens: engineering knowledge in the repository beside
   the code, clinical technique in the protocol binder, supplier history in the supplier
   register. It is not copied into a separate knowledge base that nobody updates.
5. A leaver's knowledge is handed over in writing before the last working day, against the
   register rows they hold. Handover is checked by the receiving second holder, not by HR.
6. Where the organisation lacks knowledge it needs — a new device, a new regulation, a new
   platform capability — it is acquired deliberately: vendor training, a hired specialist, or a
   time-boxed spike with a written outcome. Hoping to pick it up is not an acquisition route.

## Records

The knowledge register, ADRs in the repository, protocol binder revisions and handover notes.
ADRs are permanent. Handover notes are retained three years.

## Review

Twice a year by Andreas with Pak Andre and Pak Chen, and whenever a High key-person entry
changes holder.
`,
  },
  {
    code: 'QMS-SOP-7-2',
    title: 'Competence, Training and Authorisation to Practise',
    clause: '7.2',
    crossRefs: ['9001 7.3', '9001 7.1.6', '9001 8.5.1', 'A.6.3'],
    version: 'v2.2',
    owner: 'Pak Andre',
    form: { code: 'FRM-7-2-01', name: 'Competence matrix and authorisation record' },
    revisions: [
      {
        version: 'v2.1',
        date: '2025-02-17',
        author: 'Pak Andre',
        approval: 'Reviewed by Dhiaz Fathra',
        status: 'Superseded',
        note: 'Competence matrix limited to clinical roles; engineering competence assessed informally at review time.',
      },
      {
        version: 'v2.2',
        date: '2026-04-06',
        author: 'Pak Andre',
        approval: 'Approved by Aris Ihwan',
        status: 'Current',
        note: 'Engineering and QA roles added to the matrix; supervised-practice route and the effectiveness check after training made explicit.',
      },
    ],
    evidence: [
      {
        name: 'competence-matrix-2026.xlsx',
        fileType: 'XLSX',
        uploadedAt: '2026-04-06',
        expiryDate: '2027-04-06',
        uploader: 'Pak Andre',
        note: 'Role, required competence, evidence held and reassessment date for every in-scope person.',
        body: [
          'Role | Required competence | Evidence | Reassessed | Authorised by',
          'Practitioner — injectables | STR, vendor certification per device, 20 supervised cases | Certificate + supervision log | Annually | Pak Andre',
          'Practitioner — laser | STR, device training per platform, skin-type protocol test | Certificate + test result | Annually | Pak Andre',
          'Clinic nurse | Nursing licence, aseptic technique assessment | Licence + assessment sheet | Annually | Pak Andre',
          'Backend engineer | Production access review, on-call runbook walkthrough | Access review record | Annually | Dhiaz Fathra',
          'Infrastructure engineer | Restore drill executed, DR runbook walkthrough | Drill record | Every six months | Dhiaz Fathra',
          'QA engineer | Test strategy review, measurement definition test | Review note | Annually | Tika',
        ].join('\n'),
      },
      {
        name: 'training-effectiveness-review-q1-2026.docx',
        fileType: 'DOCX',
        uploadedAt: '2026-04-20',
        uploader: 'Tika',
        note: 'Assessment of whether Q1 training actually changed practice, with two actions raised.',
      },
    ],
    body: `# QMS-SOP-7-2 · Competence, Training and Authorisation to Practise

**Owner** Pak Andre (Clinic Operations) · **Approver** Aris Ihwan · **Version** v2.2 · **Review** annually
**Requirement** ISO 9001 7.2 · **Also satisfies** 9001 7.3, 9001 7.1.6, 9001 8.5.1, A.6.3

## Purpose

A patient does not care how the rota was filled; they care that the person holding the device
knows what they are doing. The same is true of the engineer holding production access. This
procedure sets how competence is defined, proved, authorised and re-proved.

## Scope

Everyone whose work affects treatment quality, patient safety, or the availability and integrity
of the platform: practitioners, nurses, clinic coordinators, engineers with production access,
QA and data staff. Contract and locum staff are in scope from their first shift. Purely
administrative roles are out of scope.

## Procedure

1. **Define.** Each in-scope role has a row in the competence matrix stating the qualifications,
   training and demonstrated experience required. Pak Andre owns clinical rows; Dhiaz Fathra
   owns engineering rows; Tika owns QA and measurement rows.
2. **Evidence on entry.** Before a person works unsupervised, the row's evidence is collected and
   checked: the registration or licence verified against the issuing body, vendor certificates
   sighted in original, supervised case logs countersigned by the supervising practitioner.
3. **Supervised practice.** Where experience is short, the person works under a named supervisor
   for a stated number of cases. The supervisor signs each case; authorisation follows the count,
   not the calendar.
4. **Authorise.** Authorisation is granted per person per procedure or per system, recorded in
   FRM-7-2-01 with the date and the authorising manager. Production access in Zitadel and device
   authorisation in clinic are both granted only against an authorisation row.
5. **Gaps.** A gap between required and held competence is closed by training, mentoring,
   reassignment, or hiring. The chosen action and its due date are recorded; leaving the gap open
   is a decision that must be signed by Aris Ihwan.
6. **Check the training worked.** Every training action is followed within 60 days by an
   effectiveness check appropriate to the subject — an observed case, a knowledge test, a
   reviewed change, or an incident-free period. Attendance is not evidence of competence.
7. **Reassess.** Clinical and engineering authorisations are reassessed annually; infrastructure
   restore competence every six months. Authorisation lapses automatically on the due date.
8. **Withdraw.** Pak Andre or Dhiaz Fathra may withdraw an authorisation immediately after an
   incident or a failed reassessment. Withdrawal is recorded with a reason and a route back.

## Records

Competence matrix, authorisation records, certificates, supervision logs and effectiveness
checks. Retained for the duration of employment plus five years; clinical records follow the
longer retention set by the clinic operating procedure.

## Review

Annually, and after any incident whose cause analysis names competence.
`,
  },
  {
    code: 'QMS-POL-7-3',
    title: 'Quality Awareness',
    clause: '7.3',
    crossRefs: ['9001 7.2', '9001 7.4', '9001 5.2', '9001 10.2'],
    version: 'v1.2',
    owner: 'Pak Andre',
    form: { code: 'FRM-7-3-01', name: 'Awareness briefing and acknowledgement log' },
    revisions: [
      {
        version: 'v1.1',
        date: '2024-08-05',
        author: 'Wiwin',
        approval: 'Reviewed by Pak Andre',
        status: 'Superseded',
        note: 'Awareness handled as an annual all-hands slide deck with a signature sheet.',
      },
      {
        version: 'v1.2',
        date: '2026-05-12',
        author: 'Pak Andre',
        approval: 'Approved by Aris Ihwan',
        status: 'Current',
        note: 'Replaced the annual deck with role-specific briefings and a spot-check on whether people can state their own contribution.',
      },
    ],
    evidence: [
      {
        name: 'awareness-spot-check-may-2026.docx',
        fileType: 'DOCX',
        uploadedAt: '2026-05-28',
        uploader: 'Wiwin',
        note: 'Results of asking 24 staff across six locations what quality means in their own role.',
      },
    ],
    body: `# QMS-POL-7-3 · Quality Awareness

**Owner** Pak Andre · **Approver** Aris Ihwan · **Version** v1.2 · **Review** annually
**Requirement** ISO 9001 7.3 · **Also satisfies** 9001 7.2, 9001 7.4, 9001 5.2, 9001 10.2

## Purpose

Awareness is not the same as training. A trained practitioner knows how to run the device; an
aware practitioner also knows what the quality policy commits the clinic to, what their own work
contributes to it, and what happens if they stay quiet about a near miss. This policy states
what every person must be able to say about their own role, and how the organisation checks that
they can.

## Scope

Everyone who works for Dermaster Indonesia, including locum practitioners, contract engineers
and long-term agency staff, at all 13 locations and in the engineering group. It applies from
the first week of engagement.

## Roles and responsibilities

- **Aris Ihwan** states the quality policy and speaks to it in person at least twice a year.
- **Pak Andre** delivers clinic briefings and owns this policy.
- **Dhiaz Fathra** delivers the engineering equivalent, framed around change and availability.
- **Wiwin** runs the spot check and reports the result to the management review.
- **Every manager** is responsible for their own team's awareness; it is not delegated to HR.

## Policy

1. Each person must be able to state, unprompted and in their own words: what the quality policy
   commits us to, what their work contributes to it, what improvement in their area looks like,
   and what the consequence is of not following the procedure that applies to them.
2. Awareness is delivered as a short role-specific briefing, not a company-wide deck. Clinic
   staff hear it in terms of treatment outcomes and complaints; engineers hear it in terms of
   change failure, restore and incident response.
3. New joiners receive their briefing within the first five working days, before unsupervised
   work begins.
4. Briefings are repeated at least annually, and immediately after a change to the quality
   policy, a serious complaint, or a nonconformity whose cause was a misunderstanding of
   expectations.
5. **Reporting a problem is never penalised.** Anyone may raise a near miss, a defect or a
   concern to their manager, to Pak Andre, or directly to Aris Ihwan, and may do so anonymously
   through the suggestion channel. A manager who discourages reporting is the nonconformity.
6. Twice a year, Wiwin asks a sample of at least 20 people across at least five locations the
   four questions in clause 1. Fewer than 80 percent answering the first two adequately raises a
   nonconformity against this policy, not against the individuals.

## Records

Briefing content, the acknowledgement log FRM-7-3-01, and spot-check results. Retained three
years.

## Review

Annually by Pak Andre with Wiwin, and after any spot check that falls below threshold.
`,
  },
  {
    code: 'QMS-SOP-7-4',
    title: 'Internal and External Communication',
    clause: '7.4',
    crossRefs: ['9001 7.3', '9001 9.1.2', '9001 8.2', 'A.5.5'],
    version: 'v2.0',
    owner: 'Wiwin',
    form: { code: 'FRM-7-4-01', name: 'Communication matrix' },
    revisions: [
      {
        version: 'v1.5',
        date: '2025-01-30',
        author: 'Wiwin',
        approval: 'Reviewed by Pak Andre',
        status: 'Superseded',
        note: 'Matrix covered marketing and patient channels only; incident and regulator communication was undefined.',
      },
      {
        version: 'v2.0',
        date: '2026-02-27',
        author: 'Wiwin',
        approval: 'Approved by Aris Ihwan',
        status: 'Current',
        note: 'Incident, regulator and supplier channels added with named spokespersons and response times.',
      },
    ],
    evidence: [
      {
        name: 'communication-matrix-2026.xlsx',
        fileType: 'XLSX',
        uploadedAt: '2026-02-27',
        expiryDate: '2027-02-27',
        uploader: 'Wiwin',
        note: 'Who says what, to whom, through which channel, how quickly.',
        body: [
          'Subject | Audience | Channel | Owner | Timing',
          'Quality policy and objectives | All staff | Location briefing + intranet | Pak Andre | On change, at least annually',
          'Treatment aftercare instructions | Patient | Printed sheet + Super App message | Pak Andre | At discharge',
          'Appointment change | Patient | Super App push, SMS fallback | Wiwin | Within 2 hours of the change',
          'Service incident affecting booking | Patients and clinic staff | Status page + in-app banner | Randy | Within 30 minutes of declaration',
          'Personal data breach | Affected subjects and the regulator | Formal letter, per PDP procedure | Rica | Within statutory deadline',
          'Complaint acknowledgement | Complainant | E-mail or call | Pak Andre | Within 2 working days',
          'Specification and change to an order | Supplier | Purchase order amendment | Pak Chen | Before work starts',
          'Platform change with user impact | Clinic staff | Release note in the clinic channel | Tika | 3 working days before release',
        ].join('\n'),
      },
    ],
    body: `# QMS-SOP-7-4 · Internal and External Communication

**Owner** Wiwin · **Approver** Aris Ihwan · **Version** v2.0 · **Review** annually
**Requirement** ISO 9001 7.4 · **Also satisfies** 9001 7.3, 9001 9.1.2, 9001 8.2, A.5.5

## Purpose

Most quality failures that reach a patient are communication failures first: the aftercare sheet
that was not handed over, the release nobody told the clinic about, the incident where three
people each assumed another was writing the update. This procedure fixes, per subject, who
speaks, to whom, through which channel, and how fast.

## Scope

Communication relevant to the quality management system, internal and external, including
patients, staff, suppliers, and regulators. Routine clinical conversation during a consultation
is out of scope. Marketing campaigns are in scope only where they state a claim about a
treatment or a price.

## Roles and responsibilities

- **Wiwin** maintains the communication matrix and is the default external spokesperson.
- **Aris Ihwan** is the only spokesperson for anything involving patient harm or litigation.
- **Rica** is the sole contact for personal data breach notification.
- **Randy** publishes service incident updates while on call.
- **Pak Chen** is the single channel to suppliers on specification and order changes.
- **Pak Andre** communicates with complainants.

## Procedure

1. **Find the row.** Before communicating on any subject in FRM-7-4-01, use the row: it names the
   owner, channel and timing. If no row fits, ask Wiwin, then add a row.
2. **One voice per subject.** Nobody outside the named owner communicates externally on that
   subject. Enquiries received by anyone else are passed to the owner the same day, unanswered.
3. **Incidents.** The on-call engineer declares, then publishes the first update within 30
   minutes of declaration and every 60 minutes until resolution, on the status page and the
   in-app banner. Updates state impact and next update time; they do not speculate on cause.
4. **Patients.** Aftercare and appointment communication goes through the Super App with an SMS
   fallback where no app account exists. Delivery failure is retried once, then escalated to the
   clinic coordinator for a phone call.
5. **Regulators and personal data.** Only Rica communicates, using the notification template in
   the personal data procedure, with the draft reviewed by Aris Ihwan before sending.
6. **Suppliers.** Requirements, changes and performance feedback reach a supplier only as a
   written purchase order amendment issued by Pak Chen.
7. **Internal upward channel.** Anyone may raise a quality concern to their manager, to Pak
   Andre, or to Aris Ihwan. Concerns raised this way are logged and answered within 5 working
   days, whether or not action follows.
8. **Language.** Patient-facing communication is written in Bahasa Indonesia first; English is a
   translation, never the source.

## Records

The matrix, status page history, complaint correspondence, breach notifications and internal
concern log. Retained three years, except breach notifications, kept for six.

## Review

Annually by Wiwin, and after any incident where the cause analysis names a communication gap.
`,
  },
  {
    code: 'QMS-POL-7-5',
    title: 'Documented Information Framework',
    clause: '7.5',
    crossRefs: ['9001 7.5.1', '9001 7.5.2', '9001 7.5.3', 'A.5.37'],
    version: 'v2.3',
    owner: 'Dhiaz Fathra',
    form: { code: 'FRM-7-5-01', name: 'Master document list' },
    revisions: [
      {
        version: 'v2.2',
        date: '2025-06-19',
        author: 'Dhiaz Fathra',
        approval: 'Reviewed by Tika',
        status: 'Superseded',
        note: 'Framework assumed a single document store; engineering documents were still held only in the repository.',
      },
      {
        version: 'v2.3',
        date: '2026-05-04',
        author: 'Dhiaz Fathra',
        approval: 'Approved by Aris Ihwan',
        status: 'Current',
        note: 'Two-store model recognised and reconciled through this repository; numbering convention and the four-tier hierarchy fixed.',
      },
    ],
    evidence: [
      {
        name: 'master-document-list-2026.xlsx',
        fileType: 'XLSX',
        uploadedAt: '2026-05-04',
        expiryDate: '2027-05-04',
        uploader: 'Tika',
        note: 'Every controlled document with its tier, owner, version and store.',
        body: [
          'Code | Title | Tier | Owner | Version | Store',
          'QMS-MAN-01 | Quality manual | 1 | Aris Ihwan | v3.0 | Compliance repository',
          'QMS-POL-7-1 | Provision of resources | 2 | Dhiaz Fathra | v2.0 | Compliance repository',
          'QMS-SOP-7-2 | Competence and authorisation | 3 | Pak Andre | v2.2 | Compliance repository',
          'QMS-SOP-7-5-3 | Control of documented information | 3 | Dhiaz Fathra | v3.0 | Compliance repository',
          'FRM-7-2-01 | Competence matrix | 4 | Pak Andre | v2.2 | Compliance repository',
          'ADR-0009 | Patient identity ownership | 3 | Andreas | accepted | Git repository',
          'Clinical protocol binder rev 7 | Treatment protocols | 3 | Pak Andre | rev 7 | Clinic, controlled copy',
        ].join('\n'),
      },
    ],
    body: `# QMS-POL-7-5 · Documented Information Framework

**Owner** Dhiaz Fathra · **Approver** Aris Ihwan · **Version** v2.3 · **Review** annually
**Requirement** ISO 9001 7.5 · **Also satisfies** 9001 7.5.1, 9001 7.5.2, 9001 7.5.3, A.5.37

## Purpose

This policy is the map: it says what tiers of document exist, how they are numbered, where they
live, and which of the three clause 7.5 documents governs what. It exists because the group
genuinely has two document cultures — a clinic that works from signed binders and an engineering
group that works from Git — and pretending otherwise produced two versions of the truth.

## Scope

All documented information required by the quality management system and by the ISMS, in either
store. Personal notebooks, draft working files and chat messages are not documented information
and are never cited as evidence.

## Roles and responsibilities

- **Dhiaz Fathra** owns this framework and the numbering convention.
- **Tika** maintains the master document list and reconciles the two stores monthly.
- **Aris Ihwan** approves tier 1 and tier 2 documents.
- **Document owners** named on each document approve its content and keep it current.

## Policy

1. **Four tiers.** Tier 1 is the quality manual. Tier 2 are policies — statements of intent.
   Tier 3 are procedures and protocols — how work is done. Tier 4 are forms, registers and
   records. A document belongs to exactly one tier.
2. **Numbering.** QMS documents are \`QMS-POL-<clause>\` or \`QMS-SOP-<clause>\` with dots replaced
   by dashes; ISMS documents use the \`ISMS-\` prefix on the Annex A control. Forms take
   \`FRM-<same suffix>-NN\`. A code is never reused, even after withdrawal.
3. **Two stores, one list.** Controlled documents live in this compliance repository. Engineering
   design records — ADRs, runbooks, \`data-map.yaml\` — live in the Git repository beside the code
   they describe, and are referenced from the master list rather than copied. Tika reconciles the
   list against both stores monthly.
4. **Clinic copies.** Where a printed copy is needed at a location, it is stamped as a controlled
   copy with its issue date, and the location coordinator destroys the superseded copy on the day
   the replacement arrives.
5. **Every document names an owner, an approver, a version and a review cadence** in its header.
   A document without those four is not controlled and cannot be cited in an audit.
6. **Proportion.** The organisation writes a document when its absence causes variation, not to
   demonstrate diligence. A procedure nobody follows is a nonconformity, so before adding one,
   the owner must say which existing document could carry the content instead.

## Records

The master document list is itself a controlled record, retained permanently. Superseded
versions are retained six years under the control procedure.

## Review

Annually by Dhiaz Fathra with Tika, and whenever a new store or repository enters scope.
`,
  },
  {
    code: 'QMS-POL-7-5-1',
    title: 'Extent of Documented Information',
    clause: '7.5.1',
    crossRefs: ['9001 7.5', '9001 4.4', '9001 8.1', '9001 7.5.3'],
    version: 'v1.1',
    owner: 'Tika',
    form: { code: 'FRM-7-5-1-01', name: 'Required-documents determination sheet' },
    revisions: [
      {
        version: 'v1.0',
        date: '2025-03-11',
        author: 'Tika',
        approval: 'Drafted',
        status: 'Superseded',
        note: 'First determination of what the QMS must document, written during certification preparation.',
      },
      {
        version: 'v1.1',
        date: '2026-01-08',
        author: 'Tika',
        approval: 'Approved by Aris Ihwan',
        status: 'Current',
        note: 'Test added for whether a proposed document is needed; three procedures retired as redundant.',
      },
    ],
    evidence: [
      {
        name: 'documented-information-determination-2026.docx',
        fileType: 'DOCX',
        uploadedAt: '2026-01-08',
        expiryDate: '2027-01-08',
        uploader: 'Tika',
        note: 'The reasoning behind what the QMS documents and what it deliberately leaves undocumented.',
      },
    ],
    body: `# QMS-POL-7-5-1 · Extent of Documented Information

**Owner** Tika (QA Lead) · **Approver** Aris Ihwan · **Version** v1.1 · **Review** annually
**Requirement** ISO 9001 7.5.1 · **Also satisfies** 9001 7.5, 9001 4.4, 9001 8.1, 9001 7.5.3

## Purpose

A quality system can drown in its own paperwork. This document states what Dermaster Indonesia
documents beyond what the standard obliges, what it has decided not to document, and the test
used to settle the question when someone proposes a new procedure.

## Scope

Applies to the decision about whether documented information should exist. How it is then created
is governed by QMS-SOP-7-5-2, and how it is controlled by QMS-SOP-7-5-3.

## Roles and responsibilities

- **Tika** applies the test and maintains the determination sheet.
- **Dhiaz Fathra** decides for engineering processes; **Pak Andre** for clinical processes.
- **Aris Ihwan** approves the retirement of any tier 2 or tier 3 document.

## Policy

1. **The test.** A document is required when at least one holds: the standard or Indonesian law
   obliges it; the activity is performed by more than one person and variation between them would
   affect a patient, a payment or availability; the activity is performed rarely enough that the
   performer will not remember it; or an incident or audit finding has already shown that memory
   was insufficient. If none holds, the answer is no, and the reason is recorded.
2. **What the organisation documents beyond obligation.** Clinical treatment protocols per device
   and skin type; the on-call runbook and its escalation ladder; restore and failover procedure;
   the measurement definitions behind every reported metric; supplier qualification criteria.
   Each is documented because it failed the memory test at least once.
3. **What it deliberately does not document.** Individual consultation style; day-to-day rota
   mechanics; internal engineering conventions already enforced by linting or CI, which are
   controlled by the tooling rather than by prose; and any step whose correctness the system
   itself refuses to let a person get wrong.
4. **Size follows risk.** A procedure for a high-risk clinical activity is detailed and stepwise.
   A procedure for a low-risk administrative one is a page. Length is never evidence of control.
5. **Retirement.** Where a document is redundant, superseded by tooling, or unread for a full
   review cycle, its owner proposes retirement with reasons. Three procedures were retired in
   January 2026 under this clause.
6. Determinations are recorded on FRM-7-5-1-01 with the date and the decider, so that the next
   audit sees a decision rather than an absence.

## Records

Determination sheets and retirement approvals, retained six years alongside the master document
list.

## Review

Annually by Tika, and whenever a process is added to the QMS scope.
`,
  },
  {
    code: 'QMS-SOP-7-5-2',
    title: 'Creating and Updating Documented Information',
    clause: '7.5.2',
    crossRefs: ['9001 7.5.3', '9001 7.5.1', '9001 6.3', 'A.5.37'],
    version: 'v2.1',
    owner: 'Andreas',
    form: { code: 'FRM-7-5-2-01', name: 'Document change request and approval record' },
    revisions: [
      {
        version: 'v2.0',
        date: '2025-08-21',
        author: 'Andreas',
        approval: 'Reviewed by Dhiaz Fathra',
        status: 'Superseded',
        note: 'Introduced pull-request review for controlled documents; approval was still recorded by e-mail.',
      },
      {
        version: 'v2.1',
        date: '2026-04-15',
        author: 'Andreas',
        approval: 'Approved by Aris Ihwan',
        status: 'Current',
        note: 'Approval recorded in the merge itself; header block and the impact question made mandatory before review.',
      },
    ],
    evidence: [
      {
        name: 'document-change-log-2026.xlsx',
        fileType: 'XLSX',
        uploadedAt: '2026-06-05',
        expiryDate: '2027-06-05',
        uploader: 'Andreas',
        note: 'Change requests raised against controlled documents in 2026 and how each was resolved.',
        body: [
          'Request | Document | Raised by | Reason | Reviewer | Approved | Outcome',
          'DCR-2026-004 | QMS-SOP-7-2 | Tika | Engineering roles missing from the matrix | Dhiaz Fathra | 2026-04-06 | v2.2 issued',
          'DCR-2026-007 | QMS-SOP-7-1-5 | Pak Andre | Out-of-tolerance step gave no validity assessment | Tika | 2026-02-11 | v3.1 issued',
          'DCR-2026-009 | QMS-POL-7-3 | Wiwin | Annual deck was not changing behaviour | Pak Andre | 2026-05-12 | v1.2 issued',
          'DCR-2026-011 | QMS-SOP-7-4 | Randy | Incident update cadence undefined | Wiwin | 2026-02-27 | v2.0 issued',
          'DCR-2026-013 | QMS-POL-7-1-6 | Agil | DR runbook single-holder risk | Andreas | 2026-03-23 | v1.4 issued, action open',
        ].join('\n'),
      },
    ],
    body: `# QMS-SOP-7-5-2 · Creating and Updating Documented Information

**Owner** Andreas · **Approver** Aris Ihwan · **Version** v2.1 · **Review** annually
**Requirement** ISO 9001 7.5.2 · **Also satisfies** 9001 7.5.3, 9001 7.5.1, 9001 6.3, A.5.37

## Purpose

Once QMS-POL-7-5-1 has decided a document should exist, this procedure says how it is written,
reviewed, approved and identified — so that two documents written a year apart by different
people still look and behave the same.

## Scope

Creation and revision of tier 1 to tier 4 documents in either store. Records captured on an
approved form are not revised under this procedure; a wrong record is corrected under the
control procedure instead.

## Procedure

1. **Raise a change request.** Anyone may raise one on FRM-7-5-2-01 stating the document, the
   problem in one sentence, and what would go wrong if nothing changed. Requests without a stated
   problem are returned, not queued.
2. **Answer the impact question.** Before drafting, the author states which other documents,
   forms, systems or trainings the change touches. This answer is what stops a revised procedure
   from leaving a stale form behind it.
3. **Draft in the right store.** Compliance documents are drafted as Markdown in the compliance
   repository on a branch; clinical protocol revisions are drafted against the binder master.
   Never draft by editing the published copy in place.
4. **Header block.** Every document opens with title and code, then owner, approver, version,
   review cadence, the requirement it satisfies and its cross references. A draft missing any of
   these is not reviewable.
5. **House style.** Bahasa Indonesia for anything a patient or clinic reads; English for
   engineering documents. Present tense, active voice, named roles rather than "the relevant
   person", and a specific figure wherever a frequency, threshold or deadline is meant.
6. **Review.** One reviewer who did not write the draft, chosen for subject knowledge: clinical
   drafts by Pak Andre, engineering by Dhiaz Fathra, measurement by Tika, supplier by Pak Chen,
   personal data by Rica. The reviewer checks the substance, not the spelling.
7. **Approve.** Tier 1 and 2 by Aris Ihwan; tier 3 and 4 by the document owner. Approval is
   recorded by the approving merge in the repository, or by signature on the binder master. An
   approval in chat is not an approval.
8. **Version and issue.** Editorial changes increment the minor number, substantive changes the
   major. The revision history gains one line saying what actually changed — never "minor
   updates". Issue then follows QMS-SOP-7-5-3.
9. **Carry the impact.** Before closing the request, the author completes every downstream change
   named in step 2: forms, cross references, training, and controlled copies at each location.

## Records

Change requests, review comments, approval records and revision histories, retained six years.

## Review

Annually by Andreas, and after any audit finding about document accuracy.
`,
  },
  {
    code: 'QMS-SOP-7-5-3',
    title: 'Control of Documented Information',
    clause: '7.5.3',
    crossRefs: ['9001 7.5.2', '9001 7.5', 'A.5.33', 'A.8.12'],
    version: 'v3.0',
    owner: 'Dhiaz Fathra',
    form: { code: 'FRM-7-5-3-01', name: 'Document issue, retention and disposal register' },
    revisions: [
      {
        version: 'v2.4',
        date: '2024-12-02',
        author: 'Tika',
        approval: 'Reviewed by Dhiaz Fathra',
        status: 'Superseded',
        note: 'Retention was stated per document type; external documents and controlled printed copies were not covered.',
      },
      {
        version: 'v3.0',
        date: '2026-06-01',
        author: 'Dhiaz Fathra',
        approval: 'Approved by Aris Ihwan',
        status: 'Current',
        note: 'Access rules tied to Zitadel roles, external documents brought under control, and withdrawal of printed clinic copies given a same-day rule.',
      },
    ],
    evidence: [
      {
        name: 'retention-and-disposal-register-2026.xlsx',
        fileType: 'XLSX',
        uploadedAt: '2026-06-01',
        expiryDate: '2027-06-01',
        uploader: 'Tika',
        note: 'Retention period, storage and disposal method for each class of controlled information.',
        body: [
          'Class | Store | Retention | Disposal | Owner',
          'Quality manual and policies | Compliance repository | Permanent | Not disposed | Dhiaz Fathra',
          'Procedures, superseded versions | Compliance repository (Git history) | 6 years after supersession | Retained in history | Dhiaz Fathra',
          'Competence and authorisation records | Compliance repository | Employment + 5 years | Deleted on schedule | Pak Andre',
          'Calibration certificates | Compliance repository | Asset life + 2 years | Deleted on schedule | Tika',
          'Patient treatment records | Clinical system | Per health regulation | Per PDP deletion job | Rica',
          'Controlled printed clinic copies | Clinic location | Current issue only | Shredded on replacement day | Pak Andre',
          'External standards and device manuals | Compliance repository | While in force | Withdrawn on supersession | Pak Chen',
        ].join('\n'),
      },
      {
        name: 'controlled-copy-withdrawal-check-may-2026.pdf',
        fileType: 'PDF',
        uploadedAt: '2026-05-22',
        uploader: 'Pak Andre',
        note: 'Signed check across 13 locations confirming no superseded protocol copy remained in circulation.',
      },
    ],
    body: `# QMS-SOP-7-5-3 · Control of Documented Information

**Owner** Dhiaz Fathra · **Approver** Aris Ihwan · **Version** v3.0 · **Review** annually
**Requirement** ISO 9001 7.5.3 · **Also satisfies** 9001 7.5.2, 9001 7.5, A.5.33, A.8.12

## Purpose

A controlled document is only controlled if the right version is available where the work
happens, the wrong version is not, and neither can be quietly altered. This procedure covers
distribution, access, storage, protection, retention and disposal for both stores, and brings
external documents under the same discipline.

## Scope

All documented information in the master document list, in the compliance repository, the Git
repository, and as printed controlled copies at the 13 clinic locations. Also covers external
documents the organisation depends on: standards, device manuals, regulatory guidance.

## Roles and responsibilities

- **Dhiaz Fathra** owns this procedure and the access model.
- **Tika** issues documents and maintains the retention register.
- **Agil** operates backup and restore for both stores.
- **Pak Andre** controls printed copies at clinic locations.
- **Pak Chen** registers external documents and watches for new editions.

## Procedure

1. **Availability.** The current version of every controlled document is available to those who
   need it, at the point of use: in the compliance repository for staff with access, and as a
   stamped printed copy where a clinic room has no screen.
2. **Access.** Read access follows the Zitadel role: all staff read tier 1 and 2; tier 3 and 4
   are scoped to the roles that perform the work. Write access to a document belongs to its owner
   and the approver. Personal data records follow the stricter access rules in the personal data
   procedure.
3. **Issue.** On approval, Tika updates the master document list, publishes the new version, and
   notifies affected roles through the channel named in the communication matrix.
4. **Withdrawal of printed copies.** The location coordinator destroys the superseded printed
   copy on the day the replacement arrives and signs the withdrawal check. A superseded copy kept
   for reference is stamped OBSOLETE — FOR REFERENCE ONLY and stored away from the treatment
   room.
5. **Protection.** Both stores are version controlled, so change is attributable and reversible.
   Direct edits to the published branch are blocked; every change arrives through a reviewed
   merge. Agil backs both stores up daily to AWS ap-southeast-1 and proves a restore quarterly.
6. **Records may not be edited.** A record found to be wrong is corrected by a dated addendum
   naming the corrector and the reason; the original stays legible. Overwriting a record is a
   nonconformity.
7. **Retention and disposal.** Retention is set per class in FRM-7-5-3-01. Disposal is by
   scheduled deletion for digital records and by shredding for paper, both logged.
8. **External documents.** Pak Chen registers each external document the QMS relies on, with its
   edition and date, and checks quarterly for a newer edition. A superseded edition is withdrawn
   the same way an internal document is.
9. **Superseded versions.** Kept in repository history for six years — accessible for audit,
   never presented as current.

## Records

Master document list, issue notifications, withdrawal checks, restore-test results, and the
retention and disposal register. Retained six years.

## Review

Annually by Dhiaz Fathra with Tika, and after any finding that a superseded document was in use.
`,
  },
]

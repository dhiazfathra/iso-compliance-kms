import type { SeedDocument } from './types'

/**
 * Annex A.8 (technological controls), second batch: backup and redundancy,
 * logging and monitoring, time, privileged utilities, software installation,
 * and the network controls.
 */
export const ANNEX_A8_B: SeedDocument[] = [
  {
    code: 'ISMS-SOP-A-8-13',
    title: 'Backup and Restore Procedure',
    clause: 'A.8.13',
    crossRefs: ['A.5.30', 'A.8.14', 'A.5.33'],
    version: 'v2.2',
    owner: 'Agil',
    form: { code: 'FRM-A-8-13-01', name: 'Restore test log' },
    revisions: [
      {
        version: 'v2.1',
        date: '2025-09-08',
        author: 'Agil',
        approval: 'Reviewed by Dhiaz Fathra',
        status: 'Superseded',
        note: 'RDS snapshot retention raised from 7 to 35 days after the March pricing-table incident needed a 19-day-old copy.',
      },
      {
        version: 'v2.2',
        date: '2026-05-19',
        author: 'Agil',
        approval: 'Approved by Aris Ihwan',
        status: 'Current',
        note: 'Quarterly restore rehearsal made mandatory and its evidence moved into this register; object-storage versioning added for patient photographs.',
      },
    ],
    evidence: [
      {
        name: 'restore-test-log-2026.xlsx',
        fileType: 'XLSX',
        uploadedAt: '2026-05-19',
        expiryDate: '2026-08-19',
        uploader: 'Agil',
        note: 'Every restore rehearsal run in 2026, with the measured time to a working service.',
        body: [
          'Date | System restored | Source copy | Target | Time to service | Data loss | Verified by | Result',
          '2026-01-22 | patient (PostgreSQL) | RDS snapshot, 14 days old | eternesia-dr | 41 min | 0 rows | Randy | Pass',
          '2026-02-19 | billing (PostgreSQL) | PITR to 03:15 WIB | eternesia-dr | 58 min | 0 rows | Agil | Pass',
          '2026-03-25 | object storage (photographs) | versioned bucket copy | staging | 2 h 10 min | 0 objects | Rica | Pass, slow — parallel copy added',
          '2026-04-21 | catalogue (PostgreSQL) | logical dump, nightly | staging | 12 min | 0 rows | Tika | Pass',
          '2026-05-14 | Zitadel configuration | daily export | eternesia-dr | 26 min | 0 records | Agil | Pass',
        ].join('\n'),
      },
    ],
    body: `# ISMS-SOP-A-8-13 · Backup and Restore Procedure

**Owner** Agil (Infrastructure Engineer) · **Approver** Aris Ihwan · **Version** v2.2
**Requirement** A.8.13 · **Also satisfies** A.5.30, A.8.14, A.5.33

## Purpose

A backup nobody has restored is a rumour. This procedure states what is copied, how
often, where the copies live, and — the part that actually gets audited — how the
engineering group proves each quarter that a copy can be turned back into a running
service within the recovery time the business agreed.

## Scope

Every production data store of the Eternesia ERP in AWS ap-southeast-1: the PostgreSQL
databases behind the 21 Go services, the object-storage buckets holding patient
photographs and invoices, the Zitadel identity configuration, and the NATS JetStream
streams that carry cross-service events.

Excluded: developer laptops (covered by A.8.1), the clinic point-of-sale terminals whose
state is a projection rebuildable from the billing service, and CI build artefacts, which
are reproducible from source.

## Roles and responsibilities

- **Agil** owns the backup configuration, the schedules, and this procedure.
- **Randy**, as on-call, executes a restore during an incident and records the outcome.
- **Rica** is consulted before any restore that lands patient data outside production.
- **Dhiaz Fathra** reviews the restore test log at each quarterly management review.

## Procedure

1. **Automated copies.** RDS automated backups run continuously with point-in-time
   recovery, retained 35 days. A logical dump of every database is taken nightly at
   01:00 WIB and written to a separate account's bucket.
2. **Object storage.** Buckets holding patient photographs have versioning and a 90-day
   noncurrent-version retention. Deletion of a current version therefore never destroys
   the object within the window.
3. **Separation.** Copies are written to an AWS account that production roles cannot
   write to. Only the backup role may delete, and object lock is on for the nightly dumps.
4. **Encryption.** All copies are encrypted with a customer-managed KMS key. The key
   policy is reviewed with the cryptography control (A.8.24).
5. **Quarterly rehearsal.** Once per quarter Agil restores one production database into
   the isolated \`eternesia-dr\` environment, brings the owning service up against it, and
   runs the service's smoke suite. Time to a working service and any data loss are entered
   in FRM-A-8-13-01. A rehearsal that exceeds 2 hours is raised as a nonconformity.
6. **Restore during an incident.** The on-call engineer opens an incident record first,
   confirms the target environment with a second engineer, then restores. Restoring over
   a live production database requires Dhiaz Fathra's approval, spoken and then written
   into the incident record.
7. **Failure of a backup job.** A failed nightly job pages the on-call rota. Two
   consecutive failures for the same store are treated as an incident under A.5.26.

## Records

Restore test log (FRM-A-8-13-01) and backup job history, retained three years in the
compliance repository. Incident-driven restores are recorded in the incident record and
inherit its retention.

## Review

Annually by Agil, and after any restore that missed its recovery time objective.`,
  },
  {
    code: 'ISMS-POL-A-8-14',
    title: 'Redundancy of Information Processing Facilities',
    clause: 'A.8.14',
    crossRefs: ['A.8.13', 'A.5.29', 'A.8.6'],
    version: 'v1.3',
    owner: 'Agil',
    form: { code: 'FRM-A-8-14-01', name: 'Service availability and redundancy register' },
    revisions: [
      {
        version: 'v1.2',
        date: '2025-07-30',
        author: 'Andreas',
        approval: 'Reviewed by Dhiaz Fathra',
        status: 'Superseded',
        note: 'Multi-AZ made the default for every database after a single-AZ failover cost 51 minutes of booking downtime.',
      },
      {
        version: 'v1.3',
        date: '2026-04-02',
        author: 'Agil',
        approval: 'Approved by Aris Ihwan',
        status: 'Current',
        note: 'Availability tiers introduced so that not every service pays for the same redundancy; clinic-hours definition tightened.',
      },
    ],
    evidence: [
      {
        name: 'service-availability-register-2026-q2.xlsx',
        fileType: 'XLSX',
        uploadedAt: '2026-04-02',
        expiryDate: '2026-10-02',
        uploader: 'Agil',
        note: 'Tier, redundancy posture and measured availability for each production service.',
        body: [
          'Service | Tier | Redundancy | Target availability | Measured (Q1 2026) | Notes',
          'patient | 1 | Multi-AZ RDS, 3 app replicas | 99.9% | 99.96% | Failover tested 2026-01-22',
          'billing | 1 | Multi-AZ RDS, 3 app replicas | 99.9% | 99.91% | One 4-min blip during a node rotation',
          'Super App gateway | 1 | 3 replicas, 2 AZs | 99.9% | 99.98% | —',
          'catalogue | 2 | Single-AZ RDS, 2 app replicas | 99.5% | 99.99% | Read-mostly, cacheable',
          'reporting ETL | 3 | Single instance, restartable | best effort | n/a | Rerun tolerated',
          'marketplace | 2 | 2 replicas, 1 AZ | 99.5% | 99.72% | Tier review due after migration',
        ].join('\n'),
      },
    ],
    body: `# ISMS-POL-A-8-14 · Redundancy of Information Processing Facilities

**Owner** Agil · **Approver** Aris Ihwan · **Version** v1.3
**Requirement** A.8.14 · **Also satisfies** A.8.13, A.5.29, A.8.6

## Purpose

Thirteen clinics take bookings and payments through the same platform. When a component
fails, the question is not whether the group can rebuild it but whether a patient at the
counter in Kelapa Gading notices. This policy sets how much redundancy each service
carries and refuses to spend the same money on all of them.

## Scope

Production compute, databases, message transport and network paths for the Eternesia ERP,
the Super App backend and the marketplace services, all in AWS ap-southeast-1. Clinic
premises, power and connectivity are covered by the physical controls (A.7.11); this
policy stops at the cloud boundary and at the clinic router.

## Roles and responsibilities

- **Agil** assigns each service a tier and maintains the register.
- **Andreas** approves the tier of a new service as part of its architecture review.
- **Pak Andre** states, from clinic operations, what downtime is actually tolerable in
  clinic hours — 09:00 to 21:00 WIB, seven days.
- **Aris Ihwan** approves any tier that costs more than the current infrastructure budget.

## Policy

1. **Three tiers, no more.** Tier 1 is anything a patient touches during a visit —
   booking, patient record, payment. Tier 2 is internal but same-day. Tier 3 tolerates a
   rerun the next morning.
2. **Tier 1** runs at least three application replicas spread across two availability
   zones behind a load balancer, on a Multi-AZ database, with automatic failover. Target
   99.9% availability measured over the calendar month, clinic hours weighted.
3. **Tier 2** runs at least two replicas and a single-AZ database with a tested restore
   path. Target 99.5%.
4. **Tier 3** runs single-instance. No availability target; the job must be safely
   re-runnable, which the owning team demonstrates rather than asserts.
5. **No single point in a Tier 1 path may be undeclared.** If a Tier 1 service depends on
   a Tier 2 or Tier 3 component synchronously, that dependency is a defect and is either
   raised in tier or made asynchronous.
6. **Failover is exercised, not assumed.** Agil forces one Tier 1 database failover per
   half-year in a maintenance window and records the observed interruption.
7. **Capacity headroom.** A Tier 1 service must survive the loss of one availability zone
   at peak load. Capacity is reviewed against this under A.8.6 each quarter.

## Deliberate limits

The group runs in one AWS region. A second region is not funded and would not be
credibly exercised at the current team size; the accepted position is that a regional
loss is a business continuity event handled under A.5.29 with the backup copies in a
separate account, not an automatic failover.

## Records

Service availability and redundancy register (FRM-A-8-14-01), failover exercise notes,
and monthly availability figures. Retained three years.

## Review

Half-yearly by Agil with Andreas, and whenever a new service enters production.`,
  },
  {
    code: 'ISMS-SOP-A-8-15',
    title: 'Event Logging Procedure',
    clause: 'A.8.15',
    crossRefs: ['A.8.16', 'A.8.17', 'A.5.28', 'A.8.2'],
    version: 'v2.0',
    owner: 'Dhiaz Fathra',
    form: { code: 'FRM-A-8-15-01', name: 'Log source and retention register' },
    revisions: [
      {
        version: 'v1.4',
        date: '2025-06-11',
        author: 'Randy',
        approval: 'Reviewed by Dhiaz Fathra',
        status: 'Superseded',
        note: 'Structured JSON logging adopted across the Go services; free-text log lines deprecated.',
      },
      {
        version: 'v2.0',
        date: '2026-03-17',
        author: 'Dhiaz Fathra',
        approval: 'Approved by Aris Ihwan',
        status: 'Current',
        note: 'Actor claim from Zitadel made mandatory on every patient-data read; redaction list moved into the shared logging library so it cannot be forgotten per service.',
      },
    ],
    evidence: [
      {
        name: 'log-source-retention-register.xlsx',
        fileType: 'XLSX',
        uploadedAt: '2026-03-17',
        expiryDate: '2027-03-17',
        uploader: 'Randy',
        note: 'What is logged, where it lands, how long it is kept and who may read it.',
        body: [
          'Source | Content | Destination | Retention | Readable by',
          'Go services (application) | Structured JSON, request id, actor claim | CloudWatch Logs | 90 days hot, 1 year archived | Engineering',
          'Patient data access | Actor, patient ref, purpose, location | Dedicated audit stream | 3 years | Dhiaz Fathra, Rica',
          'Zitadel | Sign-in, MFA, role change | Zitadel audit + export | 2 years | Dhiaz Fathra',
          'AWS CloudTrail | Control-plane API calls | Log archive account | 3 years | Agil, Dhiaz Fathra',
          'PostgreSQL | Connections, DDL, slow queries | CloudWatch Logs | 90 days | Agil',
          'Clinic POS | Till open/close, refund, void | billing service | 5 years (finance) | Pak Rila',
        ].join('\n'),
      },
    ],
    body: `# ISMS-SOP-A-8-15 · Event Logging Procedure

**Owner** Dhiaz Fathra · **Approver** Aris Ihwan · **Version** v2.0
**Requirement** A.8.15 · **Also satisfies** A.8.16, A.8.17, A.5.28, A.8.2

## Purpose

After an incident the only honest account of what happened is the log. This procedure
fixes what every service must record, in what shape, so that an investigation does not
depend on which engineer happened to write that service.

## Scope

All Go services in the Eternesia ERP, the Super App backend, the marketplace services,
the managed AWS platform, Zitadel, and the clinic point-of-sale terminals. Excluded:
local development, and the ephemeral output of CI jobs, which is kept only with the build.

## Roles and responsibilities

- **Dhiaz Fathra** owns this procedure and the audit stream for patient-data access.
- **Randy** maintains the shared Go logging library that implements it.
- **Agil** owns log shipping, storage and the log-archive account.
- **Rica** approves any change to what is recorded about a data subject.

## Procedure

1. **One library.** Services log through the shared \`pkg/log\` package. It emits JSON with
   a fixed set of keys: timestamp in UTC, service, version, level, request id, trace id,
   actor, and message. A service that writes its own log format fails code review.
2. **Every log line carries an actor.** For a request behind authentication the actor is
   the Zitadel subject claim plus the clinic location scope. For a background job it is
   the job name. "unknown" is not acceptable in a production line.
3. **Security-relevant events are always recorded**: authentication success and failure,
   MFA challenge, role or entitlement change, privileged utility execution (A.8.18),
   configuration change, and any read or export of patient data.
4. **Nothing sensitive in the message.** The library redacts a maintained key list —
   passwords, tokens, NIK, full patient name, photograph URLs — before the line is
   emitted. Redaction happens in the library, not in each call site.
5. **Shipping.** Logs go to CloudWatch Logs in the owning account and are forwarded to a
   log-archive account that production roles cannot write to or delete from.
6. **Retention** follows FRM-A-8-15-01: 90 days hot for application logs, three years for
   patient-data access and CloudTrail, five years for till records held by Finance.
7. **Reading a log is itself an event.** Access to the patient-data audit stream is
   granted per investigation, time-boxed to 7 days, and logged.
8. **Clocks.** Correlation across services only works if the clocks agree; time is
   governed by ISMS-POL-A-8-17.

## Records

Log source and retention register (FRM-A-8-15-01), quarterly evidence that the audit
stream is receiving from every service that touches patient data, and grants of audit
stream access.

## Review

Annually, and whenever a new service enters production or a new log source appears.`,
  },
  {
    code: 'ISMS-SOP-A-8-16',
    title: 'Monitoring and Alerting Procedure',
    clause: 'A.8.16',
    crossRefs: ['A.8.15', 'A.5.25', 'A.5.26', 'A.8.6'],
    version: 'v1.6',
    owner: 'Randy',
    form: { code: 'FRM-A-8-16-01', name: 'Alert rule and response register' },
    revisions: [
      {
        version: 'v1.5',
        date: '2025-10-27',
        author: 'Randy',
        approval: 'Reviewed by Dhiaz Fathra',
        status: 'Superseded',
        note: 'Alert rules pruned from 214 to 61 after a month in which 83% of pages were acknowledged with no action.',
      },
      {
        version: 'v1.6',
        date: '2026-05-06',
        author: 'Randy',
        approval: 'Approved by Aris Ihwan',
        status: 'Current',
        note: 'Security detections separated from availability alerts and routed to Dhiaz Fathra rather than the on-call rota.',
      },
    ],
    evidence: [
      {
        name: 'alert-rule-response-register.xlsx',
        fileType: 'XLSX',
        uploadedAt: '2026-05-06',
        expiryDate: '2027-05-06',
        uploader: 'Randy',
        note: 'Live alert rules, their threshold, route and the documented first response.',
        body: [
          'Rule | Signal | Threshold | Routes to | First response',
          'Booking error rate | HTTP 5xx on /booking | >2% over 5 min | On-call (page) | Check deploy, roll back if within 30 min of release',
          'Patient read spike | audit stream reads per actor | >200 in 10 min | Dhiaz Fathra (page) | Confirm with clinic manager, suspend session if unexplained',
          'Failed sign-in burst | Zitadel auth failures per IP | >30 in 5 min | Dhiaz Fathra (ticket) | Block source, check for credential stuffing',
          'Backup job failure | nightly dump exit code | any failure | Agil (page) | Rerun, escalate on second failure',
          'DB connection saturation | pool in use | >85% for 10 min | On-call (ticket) | Check slow queries, raise capacity review',
          'Certificate expiry | days to expiry | <21 days | Agil (ticket) | Renew and verify chain',
        ].join('\n'),
      },
    ],
    body: `# ISMS-SOP-A-8-16 · Monitoring and Alerting Procedure

**Owner** Randy (Backend Engineer, on-call) · **Approver** Aris Ihwan · **Version** v1.6
**Requirement** A.8.16 · **Also satisfies** A.8.15, A.5.25, A.5.26, A.8.6

## Purpose

Logging records what happened; monitoring is the part that wakes someone up. This
procedure states which signals are watched, what threshold turns a signal into a page,
and what the person who is paged is expected to do first.

## Scope

Production services and platform in AWS ap-southeast-1, the Zitadel tenant, and the
network path from the clinics. It covers both availability monitoring and security
detection, and deliberately keeps them on separate routes.

## Roles and responsibilities

- **Randy** owns the alert rules and the on-call rota for availability.
- **Dhiaz Fathra** receives security detections and decides, under A.5.25, whether an
  event is an incident.
- **Agil** owns the monitoring infrastructure itself and its own health check.
- **Tika** reviews the alert quality figures at the quarterly measurement review.

## Procedure

1. **Every rule has a documented first response.** A rule with no written first action is
   removed at the next review — a page nobody knows how to answer is noise with a siren.
2. **Two routes.** Availability alerts page the on-call engineer. Security detections go
   to Dhiaz Fathra and never to the general rota, so that an unexplained access pattern is
   not triaged by whoever is awake.
3. **Thresholds are stated in FRM-A-8-16-01** and are absolute or rate-based, never "high".
   A change to a threshold is a change to that register, reviewed by Randy.
4. **Acknowledgement.** A paged alert is acknowledged within 15 minutes in clinic hours
   and 30 minutes outside them. An unacknowledged page escalates to Agil, then to
   Dhiaz Fathra.
5. **Baseline detections that must exist**: failed sign-in bursts, privileged utility use
   outside a change window, unusual volume of patient-record reads by one actor, egress to
   an unexpected destination, and disabled logging on any source.
6. **Monitoring the monitor.** The alerting pipeline emits a heartbeat every 5 minutes; a
   missing heartbeat for 15 minutes pages Agil directly through an independent channel.
7. **Alert quality.** Each quarter Randy reports pages per week, the share closed with no
   action, and median acknowledgement time. A rule above 70% no-action for two consecutive
   quarters is either retuned or deleted.

## Records

Alert rule and response register (FRM-A-8-16-01), the alert history export, and the
quarterly alert quality figures. Retained two years.

## Review

Quarterly by Randy with Tika; immediately after any incident that no rule caught.`,
  },
  {
    code: 'ISMS-POL-A-8-17',
    title: 'Time Synchronization Standard',
    clause: 'A.8.17',
    crossRefs: ['A.8.15', 'A.5.28', 'A.8.16'],
    version: 'v1.1',
    owner: 'Agil',
    form: { code: 'FRM-A-8-17-01', name: 'Time source conformance check' },
    revisions: [
      {
        version: 'v1.0',
        date: '2024-11-05',
        author: 'Agil',
        approval: 'Drafted',
        status: 'Superseded',
        note: 'Written after two clinic terminals were found 6 minutes apart, making a refund dispute impossible to sequence.',
      },
      {
        version: 'v1.1',
        date: '2026-01-30',
        author: 'Agil',
        approval: 'Approved by Aris Ihwan',
        status: 'Current',
        note: 'Amazon Time Sync named as the single reference; drift tolerance tightened to one second and a quarterly conformance check added.',
      },
    ],
    evidence: [
      {
        name: 'time-source-conformance-2026-q2.xlsx',
        fileType: 'XLSX',
        uploadedAt: '2026-04-14',
        expiryDate: '2026-07-14',
        uploader: 'Agil',
        note: 'Measured offset of each estate against the reference at the Q2 check.',
        body: [
          'Estate | Time source | Sampled hosts | Max offset | Tolerance | Result',
          'EKS nodes (production) | Amazon Time Sync 169.254.169.123 | 14 | 3 ms | 1 s | Pass',
          'RDS instances | AWS managed | 9 | n/a (managed) | 1 s | Pass',
          'Clinic POS terminals | pool.ntp.org via clinic router | 26 | 780 ms | 1 s | Pass',
          'Clinic router (Bintaro) | ISP NTP | 1 | 2.4 s | 1 s | Fail — repointed 2026-04-15',
          'Engineering laptops | OS default | 11 | 120 ms | 1 s | Pass',
        ].join('\n'),
      },
    ],
    body: `# ISMS-POL-A-8-17 · Time Synchronization Standard

**Owner** Agil · **Approver** Aris Ihwan · **Version** v1.1
**Requirement** A.8.17 · **Also satisfies** A.8.15, A.5.28, A.8.16

## Purpose

Every control that depends on evidence depends on time. If the payment terminal and the
billing service disagree by six minutes, an investigation cannot say which came first, and
a refund dispute becomes one person's word against another's. This standard fixes a single
time reference for the group and a tolerance that makes log correlation meaningful.

## Scope

All production and staging compute in AWS ap-southeast-1, clinic point-of-sale terminals
and their routers at 13 locations, engineering workstations, and any appliance that emits
a timestamped record — including the CCTV recorders, whose clocks are checked with the
same conformance run even though the recorders themselves are owned under A.7.4.

## Roles and responsibilities

- **Agil** owns the time reference, the configuration and the quarterly conformance check.
- **Pak Andre** arranges access to clinic terminals when a device is found out of
  tolerance and must be corrected on site.
- **Dhiaz Fathra** is told of any estate that fails the check twice in a row, as it
  undermines the evidential value of the logs.

## Policy

1. **One reference.** Amazon Time Sync Service (169.254.169.123) is the authoritative
   source for everything inside AWS. Clinic devices synchronise through their site router,
   which itself synchronises to \`pool.ntp.org\`; the router is the only clinic device
   permitted to reach an external time source.
2. **UTC everywhere in machines.** Systems, databases and log lines record UTC. Conversion
   to WIB happens only at the point of display, in the Super App and the admin console.
3. **Tolerance is one second.** A host more than one second from the reference is out of
   conformance and is corrected within 5 working days; a point-of-sale terminal is
   corrected before its next trading day.
4. **No manual clock setting.** Setting a clock by hand on a production host or a terminal
   is a privileged action under ISMS-SOP-A-8-18 and requires a change record.
5. **Quarterly conformance check.** Agil samples every estate, records the maximum measured
   offset in FRM-A-8-17-01, and repoints or repairs anything that fails.
6. **Timestamps in evidence.** Any record collected under A.5.28 states the source of its
   timestamp and the offset measured at the most recent check.

## Records

Time source conformance check (FRM-A-8-17-01), four per year, retained three years with
the log register they support.

## Review

Annually by Agil, and whenever a new site or a new class of appliance is added.`,
  },
  {
    code: 'ISMS-SOP-A-8-18',
    title: 'Use of Privileged Utility Programs',
    clause: 'A.8.18',
    crossRefs: ['A.8.2', 'A.8.15', 'A.8.32'],
    version: 'v1.4',
    owner: 'Dhiaz Fathra',
    form: { code: 'FRM-A-8-18-01', name: 'Privileged utility session record' },
    revisions: [
      {
        version: 'v1.3',
        date: '2025-08-19',
        author: 'Agil',
        approval: 'Reviewed by Dhiaz Fathra',
        status: 'Superseded',
        note: 'Direct psql access to production removed for all but two named engineers; break-glass path documented.',
      },
      {
        version: 'v1.4',
        date: '2026-02-11',
        author: 'Dhiaz Fathra',
        approval: 'Approved by Aris Ihwan',
        status: 'Current',
        note: 'Session recording made mandatory for production shells; the list of controlled utilities pinned to this document rather than to tribal memory.',
      },
    ],
    evidence: [
      {
        name: 'privileged-utility-sessions-2026-q1.xlsx',
        fileType: 'XLSX',
        uploadedAt: '2026-04-04',
        expiryDate: '2027-04-04',
        uploader: 'Dhiaz Fathra',
        note: 'Every production privileged session in Q1 2026, with its justification and reviewer.',
        body: [
          'Date | Engineer | Utility | Target | Reason | Change/incident ref | Reviewed by',
          '2026-01-09 | Agil | psql | billing (prod) | Correct 3 orphaned invoice rows | CHG-2026-011 | Dhiaz Fathra',
          '2026-01-22 | Randy | kubectl exec | patient pod | Capture goroutine dump during latency incident | INC-2026-003 | Dhiaz Fathra',
          '2026-02-14 | Agil | aws ssm session | bastion | Rotate expired agent certificate | CHG-2026-024 | Andreas',
          '2026-03-03 | Randy | psql (read-only) | catalogue (prod) | Verify price migration counts | CHG-2026-038 | Dhiaz Fathra',
          '2026-03-27 | Agil | pg_repack | billing (prod) | Reclaim bloat before quarter close | CHG-2026-052 | Dhiaz Fathra',
        ].join('\n'),
      },
    ],
    body: `# ISMS-SOP-A-8-18 · Use of Privileged Utility Programs

**Owner** Dhiaz Fathra · **Approver** Aris Ihwan · **Version** v1.4
**Requirement** A.8.18 · **Also satisfies** A.8.2, A.8.15, A.8.32

## Purpose

Some tools step over the application's own rules: a database shell, a container exec, a
packet capture, a disk utility. They are occasionally necessary and always dangerous,
because nothing above them enforces the access decisions the platform normally makes.
This procedure lists those tools, limits who may run them, and makes every use visible.

## Scope

Production and staging systems of the Eternesia ERP and the marketplace, the Zitadel
administration console, and the AWS management plane. Local development is out of scope;
so are read-only observability tools, which carry no write capability.

## Controlled utilities

\`psql\` and other direct database clients against production · \`kubectl exec\`, \`kubectl
port-forward\` and node shells · \`aws ssm start-session\` · \`pg_repack\`, \`pg_dump\` against
production · packet capture (\`tcpdump\`) · any binary run as root on a production host ·
the Zitadel administration console when changing roles or grants.

## Roles and responsibilities

- **Dhiaz Fathra** approves standing access to a controlled utility and reviews the
  session record quarterly.
- **Agil** holds the technical controls that enforce the list and maintains the bastion.
- **Randy**, as on-call, may use the break-glass path during a declared incident.
- **Andreas** reviews any use that changes a data structure other services depend on.

## Procedure

1. **No standing production shell.** Access is requested per session through AWS SSM,
   granted for four hours, and expires automatically. Two engineers — currently Agil and
   Randy — hold the ability to request it; anyone else needs Dhiaz Fathra's approval first.
2. **A reason before a session.** Every session names a change record or an incident
   record. "Having a look" is not a reason and is refused.
3. **Sessions are recorded.** SSM session logging is on and writes to the log-archive
   account. A session that cannot be recorded does not start, except on the break-glass
   path.
4. **Break-glass.** During a declared Sev-1, the on-call engineer may take a recorded
   session without prior approval, and must file the record within 24 hours. Dhiaz Fathra
   reviews every break-glass use.
5. **Writes to production data** require a second engineer watching the session and the
   statement pasted into the change record before it is executed.
6. **Utilities are removed from images.** Container images built by CI contain no shell
   utilities beyond the service binary and its runtime; debugging uses an ephemeral
   sidecar image, which is pulled only for the session.
7. **Quarterly review.** Dhiaz Fathra reconciles the recorded sessions against the change
   and incident registers. A session with no matching record is a nonconformity.

## Records

Privileged utility session record (FRM-A-8-18-01) and the SSM session transcripts,
retained three years in the log-archive account.

## Review

Annually, and whenever a new utility is added to the controlled list.`,
  },
  {
    code: 'ISMS-SOP-A-8-19',
    title: 'Installation of Software on Operational Systems',
    clause: 'A.8.19',
    crossRefs: ['A.8.32', 'A.8.9', 'A.5.32', 'A.8.8'],
    version: 'v2.0',
    owner: 'Andreas',
    form: { code: 'FRM-A-8-19-01', name: 'Approved software and deployment record' },
    revisions: [
      {
        version: 'v1.6',
        date: '2025-05-27',
        author: 'Andreas',
        approval: 'Reviewed by Dhiaz Fathra',
        status: 'Superseded',
        note: 'Immutable container images made the only deployment mechanism for the Go services.',
      },
      {
        version: 'v2.0',
        date: '2026-06-01',
        author: 'Andreas',
        approval: 'Approved by Aris Ihwan',
        status: 'Current',
        note: 'Extended to clinic workstations and the Super App release train; image signing and provenance checks added at admission.',
      },
    ],
    evidence: [
      {
        name: 'deployment-record-2026-05.xlsx',
        fileType: 'XLSX',
        uploadedAt: '2026-06-01',
        expiryDate: '2027-06-01',
        uploader: 'Andreas',
        note: 'Production deployments for May 2026 with their approval and rollback outcome.',
        body: [
          'Date | Target | Artefact | Version | Approved by | Rollback | Result',
          '2026-05-04 | patient | ghcr/patient | 1.42.0 | Dhiaz Fathra | not needed | Success',
          '2026-05-08 | billing | ghcr/billing | 2.11.3 | Dhiaz Fathra | rolled back 22 min | Reverted, rounding defect',
          '2026-05-12 | billing | ghcr/billing | 2.11.4 | Dhiaz Fathra | not needed | Success',
          '2026-05-19 | Super App (Android) | Play internal track | 3.8.0 | Wiwin | staged 10% | Success',
          '2026-05-26 | catalogue | ghcr/catalogue | 1.9.7 | Andreas | not needed | Success',
        ].join('\n'),
      },
      {
        name: 'clinic-workstation-software-baseline.docx',
        fileType: 'DOCX',
        uploadedAt: '2026-06-01',
        expiryDate: '2027-06-01',
        uploader: 'Pak Andre',
        note: 'The approved application set for a clinic front-desk workstation, signed by clinic operations.',
      },
    ],
    body: `# ISMS-SOP-A-8-19 · Installation of Software on Operational Systems

**Owner** Andreas (Solutions Architect) · **Approver** Aris Ihwan · **Version** v2.0
**Requirement** A.8.19 · **Also satisfies** A.8.32, A.8.9, A.5.32, A.8.8

## Purpose

Software reaches a live system by exactly two routes in this organisation: a pipeline, or
someone with a login. This procedure makes the first route the only supported one and
states what happens on the rare occasion the second is used.

## Scope

Production and staging clusters of the Eternesia ERP and the marketplace, clinic
front-desk workstations and point-of-sale terminals, and the Super App release train on
the Play Store and App Store. Engineering laptops follow A.8.1 instead.

## Roles and responsibilities

- **Andreas** owns the deployment pipeline and the admission rules.
- **Agil** operates the cluster and the image registry.
- **Pak Andre** owns the approved application set for clinic workstations.
- **Wiwin** approves Super App releases from a product and commercial standpoint.
- **Dhiaz Fathra** approves any deployment made outside the pipeline.

## Procedure

1. **Build once, promote.** An artefact is built by CI from a tagged commit, scanned, and
   promoted unchanged from staging to production. Rebuilding for production is forbidden —
   the thing tested must be the thing that runs.
2. **Admission control.** The cluster admits only images from the group registry, signed
   by the CI identity, with a recorded provenance attestation. Anything else is refused at
   admission, not by convention.
3. **Approval.** A production deployment names its change record and its approver. In
   clinic hours, only a Tier 1 fix or a scheduled release may deploy; other releases wait
   for the 21:30 WIB window.
4. **Rollback is part of the release.** Every deployment states how to reverse it. If the
   previous image cannot be redeployed — because of a forward-only migration — the change
   record says so explicitly and carries Dhiaz Fathra's sign-off.
5. **No installation by hand.** Installing a package, patching a binary or editing code on
   a running production host is prohibited. If an emergency forces it, the engineer follows
   the break-glass path in ISMS-SOP-A-8-18, and the change is put back into the pipeline
   within 5 working days or reverted.
6. **Clinic workstations** run only the applications in the signed baseline. Staff accounts
   are not local administrators, so an unapproved installer simply cannot run; a request for
   new software goes to Pak Andre and then to Agil.
7. **Third-party components** entering an image are checked for licence compatibility under
   A.5.32 and for known vulnerabilities under A.8.8 before the image is promoted.
8. **Old versions.** The previous two production images are retained in the registry for
   rollback; anything older is pruned monthly.

## Records

Approved software and deployment record (FRM-A-8-19-01), the clinic workstation baseline,
and CI provenance attestations. Deployment records retained two years, attestations for
the life of the image plus one year.

## Review

Half-yearly by Andreas, and after any deployment that had to be reversed in production.`,
  },
  {
    code: 'ISMS-POL-A-8-20',
    title: 'Network Security Policy',
    clause: 'A.8.20',
    crossRefs: ['A.8.21', 'A.8.22', 'A.8.24', 'A.8.16'],
    version: 'v2.3',
    owner: 'Agil',
    form: { code: 'FRM-A-8-20-01', name: 'Network control and firewall rule register' },
    revisions: [
      {
        version: 'v2.2',
        date: '2025-04-16',
        author: 'Agil',
        approval: 'Reviewed by Dhiaz Fathra',
        status: 'Superseded',
        note: 'Public database endpoints eliminated; all clinic traffic moved behind the site-to-site tunnel.',
      },
      {
        version: 'v2.3',
        date: '2026-03-10',
        author: 'Agil',
        approval: 'Approved by Aris Ihwan',
        status: 'Current',
        note: 'Egress default-deny adopted for production workloads and a half-yearly rule recertification introduced.',
      },
    ],
    evidence: [
      {
        name: 'firewall-rule-recertification-2026-h1.xlsx',
        fileType: 'XLSX',
        uploadedAt: '2026-03-10',
        expiryDate: '2026-09-10',
        uploader: 'Agil',
        note: 'Half-yearly recertification of ingress and egress rules; unjustified rules removed.',
        body: [
          'Rule | Direction | Source | Destination | Port | Justification | Decision',
          'clinic-vpn-in | Ingress | Clinic site tunnels | app subnet | 443 | POS and front desk | Keep',
          'alb-public | Ingress | 0.0.0.0/0 | ALB | 443 | Super App and web | Keep',
          'app-to-rds | Internal | app subnet | data subnet | 5432 | Service to database | Keep',
          'egress-payments | Egress | billing | payment gateway | 443 | Settlement API | Keep',
          'egress-any-staging | Egress | staging | 0.0.0.0/0 | any | Legacy, unowned | Removed 2026-03-10',
          'admin-ssh-office | Ingress | office range | bastion | 22 | Superseded by SSM | Removed 2026-03-10',
        ].join('\n'),
      },
    ],
    body: `# ISMS-POL-A-8-20 · Network Security Policy

**Owner** Agil · **Approver** Aris Ihwan · **Version** v2.3
**Requirement** A.8.20 · **Also satisfies** A.8.21, A.8.22, A.8.24, A.8.16

## Purpose

The network is where a clinic in Bandung, a patient's phone, a payment gateway and 21
services meet. This policy states the default posture of that network — deny — and the
conditions under which a path is opened, so that connectivity is a decision on record
rather than an accident of history.

## Scope

The AWS VPCs in ap-southeast-1 that host the Eternesia ERP and the marketplace, the
site-to-site tunnels to 13 clinic locations, clinic local networks, the office network,
and the public entry points used by the Super App. Supplier-operated networks are governed
through the supplier controls (A.5.19–A.5.22).

## Roles and responsibilities

- **Agil** owns network configuration, the rule register and the recertification.
- **Andreas** approves a new network path as part of an architecture review.
- **Randy** is paged on network detections raised under A.8.16.
- **Pak Andre** is the point of contact for anything that touches a clinic's local network.

## Policy

1. **Default deny, both directions.** Ingress and egress are denied unless a rule in
   FRM-A-8-20-01 permits them. Every rule names a justification and an owner; a rule
   without an owner is removed at the next recertification.
2. **No public data plane.** Databases, caches, message brokers and internal services have
   no public address. The only public endpoints are the application load balancer and the
   CDN in front of it.
3. **Encryption in transit is unconditional.** TLS 1.2 or better externally; service-to-
   service traffic inside the VPC uses mutual TLS. Plain HTTP exists nowhere, including
   between a load balancer and its target.
4. **Clinic connectivity** runs over IPsec site-to-site tunnels. A clinic's local network
   is treated as untrusted: reaching a production service still requires an authenticated
   session, and the tunnel grants network reachability, not authorisation.
5. **Remote access** to infrastructure is through AWS SSM only. There are no open SSH
   ports and no VPN concentrator for engineers.
6. **Half-yearly recertification.** Agil walks every ingress and egress rule with its
   stated owner; anything unjustified is deleted in the same session rather than deferred.
7. **Changes are changes.** A firewall or routing modification follows change management
   (A.8.32) and is applied through Terraform, never through the console. Console drift is
   detected by the nightly plan and reverted.
8. **Wireless.** Clinic guest Wi-Fi is on a separate VLAN with no route to any clinic or
   production system, and its credentials rotate quarterly.

## Records

Network control and firewall rule register (FRM-A-8-20-01), recertification sheets, and
Terraform state history. Retained three years.

## Review

Half-yearly with the recertification, and after any incident with a network cause.`,
  },
  {
    code: 'ISMS-SOP-A-8-21',
    title: 'Security of Network Services',
    clause: 'A.8.21',
    crossRefs: ['A.8.20', 'A.5.20', 'A.5.22', 'A.8.14'],
    version: 'v1.2',
    owner: 'Andreas',
    form: { code: 'FRM-A-8-21-01', name: 'Network service agreement register' },
    revisions: [
      {
        version: 'v1.1',
        date: '2025-02-20',
        author: 'Andreas',
        approval: 'Reviewed by Dhiaz Fathra',
        status: 'Superseded',
        note: 'Security terms for connectivity providers separated from the general supplier agreement template.',
      },
      {
        version: 'v1.2',
        date: '2026-02-27',
        author: 'Andreas',
        approval: 'Approved by Aris Ihwan',
        status: 'Current',
        note: 'Availability and incident-notification terms made measurable, with the provider review moved into the quarterly supplier cycle.',
      },
    ],
    evidence: [
      {
        name: 'network-service-agreement-register.xlsx',
        fileType: 'XLSX',
        uploadedAt: '2026-02-27',
        expiryDate: '2027-02-27',
        uploader: 'Pak Chen',
        note: 'Connectivity and network service providers with their agreed security and availability terms.',
        body: [
          'Provider | Service | Security terms | Availability term | Incident notice | Review',
          'ISP A | Clinic fibre, 9 sites | IPsec endpoints, no traffic inspection | 99.5% monthly | 2 hours | Quarterly with Pak Chen',
          'ISP B | Clinic fibre, 4 sites + office | IPsec endpoints | 99.0% monthly | 4 hours | Quarterly',
          'AWS | VPC, Transit Gateway, ALB | Shared responsibility model | Per service SLA | Health Dashboard | Annual',
          'CDN provider | Edge and WAF for Super App | WAF ruleset agreed, TLS 1.2+ | 99.9% monthly | 1 hour | Half-yearly',
          'Payment gateway | Settlement API | Mutual TLS, IP allowlist, PCI DSS AoC | 99.9% monthly | 1 hour | Annual with Pak Rila',
        ].join('\n'),
      },
    ],
    body: `# ISMS-SOP-A-8-21 · Security of Network Services

**Owner** Andreas · **Approver** Aris Ihwan · **Version** v1.2
**Requirement** A.8.21 · **Also satisfies** A.8.20, A.5.20, A.5.22, A.8.14

## Purpose

The group does not own a metre of the fibre between its clinics and its platform. Every
network service is bought, which means its security properties are contractual before they
are technical. This procedure states what must be agreed with a provider, and how the
group verifies it is getting what it pays for rather than trusting the brochure.

## Scope

Internet connectivity at 13 clinic locations and the office, the AWS networking services
that carry production traffic, the CDN and WAF in front of the Super App, and the private
link to the payment gateway. Internal network design is governed by A.8.20 and A.8.22.

## Roles and responsibilities

- **Andreas** defines the security requirements a network service must meet.
- **Pak Chen** negotiates and holds the agreements as procurement lead.
- **Agil** verifies the technical configuration on the group's side of each service.
- **Pak Rila** is involved where the service carries settlement traffic.

## Procedure

1. **Requirements before procurement.** Before a connectivity or network service is
   bought, Andreas records what it must provide: encryption expectations, availability,
   incident notification time, whether the provider may inspect traffic, and where the
   traffic may be routed. Pak Chen does not sign without that sheet.
2. **The group encrypts its own traffic regardless.** Every service is treated as an
   untrusted carrier: clinic traffic is inside an IPsec tunnel the group terminates, and
   application traffic is inside TLS. A provider's own encryption claim is welcome and is
   never relied upon alone.
3. **Mandatory terms** for any provider carrying production traffic: a named security
   contact, notification of a security incident affecting the group within the time in
   FRM-A-8-21-01, no subcontracting of the transport without notice, and the right to
   receive availability figures monthly.
4. **Verification.** Agil checks each quarter that tunnels are up on the agreed
   parameters, that no unexpected route exists, and that the measured availability matches
   what the provider reported. Discrepancies go to Pak Chen for the supplier review
   (A.5.22).
5. **Diversity where it matters.** Clinics with the highest booking volume — currently
   Kelapa Gading, Bintaro and Bandung — carry a second connection from a different
   provider. Others fall back to a 4G router held on site.
6. **Exit.** Each agreement states how the service is withdrawn and how long the group has
   to migrate. A provider cannot be the only party able to reconfigure the tunnel.

## Records

Network service agreement register (FRM-A-8-21-01), quarterly verification notes, and
provider availability reports. Retained for the term of the agreement plus three years.

## Review

Annually by Andreas with Pak Chen, and whenever a provider or a site changes.`,
  },
  {
    code: 'ISMS-POL-A-8-22',
    title: 'Network Segregation Standard',
    clause: 'A.8.22',
    crossRefs: ['A.8.20', 'A.8.31', 'A.8.3'],
    version: 'v1.5',
    owner: 'Agil',
    form: { code: 'FRM-A-8-22-01', name: 'Network zone and permitted flow register' },
    revisions: [
      {
        version: 'v1.4',
        date: '2025-12-03',
        author: 'Agil',
        approval: 'Reviewed by Dhiaz Fathra',
        status: 'Superseded',
        note: 'Staging separated into its own VPC after a staging job was found reading a production replica.',
      },
      {
        version: 'v1.5',
        date: '2026-05-28',
        author: 'Agil',
        approval: 'Approved by Aris Ihwan',
        status: 'Current',
        note: 'Clinic device zones defined per site, and the permitted-flow register made the single source for both security groups and Terraform modules.',
      },
    ],
    evidence: [
      {
        name: 'network-zone-flow-register.xlsx',
        fileType: 'XLSX',
        uploadedAt: '2026-05-28',
        expiryDate: '2026-11-28',
        uploader: 'Agil',
        note: 'Defined zones and every flow permitted between them.',
        body: [
          'From zone | To zone | Protocol/port | Purpose | Owner | Status',
          'Clinic POS | Production app | TCP 443 | Booking, billing calls | Pak Andre | Permitted',
          'Clinic guest Wi-Fi | any internal | — | none | Pak Andre | Denied by design',
          'Production app | Production data | TCP 5432 | Service databases | Agil | Permitted',
          'Staging | Production | — | none | Andreas | Denied by design',
          'Production | Log archive account | TCP 443 | Log shipping, write-only | Agil | Permitted',
          'Office | Production | — | none, use SSM | Agil | Denied by design',
          'CI runners | Registry | TCP 443 | Image push | Andreas | Permitted',
        ].join('\n'),
      },
    ],
    body: `# ISMS-POL-A-8-22 · Network Segregation Standard

**Owner** Agil · **Approver** Aris Ihwan · **Version** v1.5
**Requirement** A.8.22 · **Also satisfies** A.8.20, A.8.31, A.8.3

## Purpose

Segregation decides how far a compromise travels. A till terminal at a clinic front desk
and the database holding 240,000 patient records should not be on speaking terms, and this
standard makes that structural rather than a matter of anyone remembering it. It defines
the zones the group operates and the only flows permitted between them.

## Scope

All networks the group controls: the production and staging VPCs in ap-southeast-1, the
log-archive account, CI runners, clinic local networks at 13 sites, clinic guest Wi-Fi,
and the office network. Supplier networks are outside; the boundary with them is the
tunnel endpoint.

## Roles and responsibilities

- **Agil** defines the zones and implements them in Terraform.
- **Andreas** approves a new zone or a new flow between existing zones.
- **Pak Andre** is accountable for keeping clinic devices in their assigned zone — in
  practice, for nobody plugging a personal laptop into the till network.
- **Dhiaz Fathra** is informed of any flow granted as a temporary exception.

## Policy

1. **Zones are named and few.** Production application, production data, staging,
   log archive, CI, clinic devices (per site), clinic guest, office. A system that does
   not fit an existing zone gets a new zone and a register entry, not an exception.
2. **Flows are allow-listed in FRM-A-8-22-01.** The register is the source that Terraform
   modules render into security groups and route tables; a rule that exists in the cloud
   but not in the register is drift and is removed by the nightly reconciliation.
3. **Production and staging never meet.** Separate VPCs, separate accounts, no peering, no
   shared database, no shared credential. Test data comes from the masking process
   (A.8.11), never from a production replica.
4. **The data zone accepts nothing from outside the application zone.** Databases have no
   route to the internet, inbound or outbound, other than through a controlled endpoint for
   managed-service traffic.
5. **The log archive is write-only from production.** Production roles may append and may
   not read, list or delete, so an attacker inside production cannot erase the record of
   being there.
6. **Clinic guest Wi-Fi is a dead end.** It reaches the internet and nothing else. It is on
   its own VLAN with client isolation, and its key rotates quarterly.
7. **Temporary flows expire.** A flow opened for a migration carries an expiry date in the
   register, and the nightly reconciliation closes it on that date whether or not anyone
   remembered to ask.

## Records

Network zone and permitted flow register (FRM-A-8-22-01), the nightly drift reconciliation
output, and approvals for new zones. Retained three years.

## Review

Half-yearly by Agil with Andreas, alongside the firewall rule recertification.`,
  },
]

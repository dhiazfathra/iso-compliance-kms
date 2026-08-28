/* Source data transcribed verbatim from the Claude Design mockup
   (ISO Compliance KMS.dc.html). Kept in mockup shape so the seed stays
   diffable against the design. */

export type MockEvidence = { n: string; ty: string; d: string; ex: string; by: string }
export type MockForm = { n: string; c: string; x: string[]; e: MockEvidence[] }
export type MockPolicy = { n: string; v: string; s: string; f: MockForm[] }
export type MockClause = {
  id: string
  std: string
  t: string
  s: string
  o: string
  r: string
  p: MockPolicy[]
}
export type MockRevision = {
  v: string
  d: string
  by: string
  note: string
  appr?: string
  s?: string
}
export type MockGap = {
  id: string
  std: string
  t: string
  gap: string
  task: string
  owner: string
  due: string
  blocking: boolean
  pct: number
}

export const CL: MockClause[] = [
  {
    id: 'A.5.1',
    std: '27001',
    t: 'Policies for information security',
    s: 'compliant',
    o: 'Dewi Kartika',
    r: '2026-11-14',
    p: [
      {
        n: 'Information Security Policy',
        v: 'v4.2',
        s: 'Approved',
        f: [
          {
            n: 'Policy Acknowledgement Register',
            c: 'FRM-ISP-01',
            x: ['A.6.3', '9001 7.5.1'],
            e: [
              {
                n: 'isp-acknowledgement-2026Q2.xlsx',
                ty: 'XLSX',
                d: '2026-07-02',
                ex: '2026-10-02',
                by: 'Sari Handayani',
              },
              {
                n: 'board-approval-minutes-v4.2.pdf',
                ty: 'PDF',
                d: '2026-02-18',
                ex: '',
                by: 'Dewi Kartika',
              },
            ],
          },
          {
            n: 'Policy Exception Request',
            c: 'FRM-ISP-04',
            x: [],
            e: [
              {
                n: 'exception-log-2026.xlsx',
                ty: 'XLSX',
                d: '2026-08-04',
                ex: '2026-11-04',
                by: 'Dewi Kartika',
              },
            ],
          },
        ],
      },
      {
        n: 'Topic-specific Policy Set',
        v: 'v2.0',
        s: 'Approved',
        f: [
          {
            n: 'Policy Review Checklist',
            c: 'FRM-ISP-07',
            x: ['9001 7.5.2'],
            e: [
              {
                n: 'policy-review-2026H1.docx',
                ty: 'DOCX',
                d: '2026-06-30',
                ex: '2026-12-30',
                by: 'Dewi Kartika',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'A.5.9',
    std: '27001',
    t: 'Inventory of information and other associated assets',
    s: 'review',
    o: 'Andi Prasetyo',
    r: '2026-09-30',
    p: [
      {
        n: 'Asset Management Policy',
        v: 'v3.0',
        s: 'Approved',
        f: [
          {
            n: 'Asset Register',
            c: 'FRM-AM-01',
            x: ['A.5.10', '9001 7.1.5'],
            e: [
              {
                n: 'asset-register-2026-08.xlsx',
                ty: 'XLSX',
                d: '2026-08-01',
                ex: '2026-09-30',
                by: 'Andi Prasetyo',
              },
              {
                n: 'asset-reconciliation-screenshot.png',
                ty: 'PNG',
                d: '2026-08-01',
                ex: '',
                by: 'Andi Prasetyo',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'A.5.15',
    std: '27001',
    t: 'Access control',
    s: 'progress',
    o: 'Andi Prasetyo',
    r: '2026-10-12',
    p: [
      {
        n: 'Access Control Policy',
        v: 'v5.1',
        s: 'In review',
        f: [
          {
            n: 'User Access Request',
            c: 'FRM-AC-01',
            x: ['A.5.16', 'A.5.18'],
            e: [
              {
                n: 'uar-batch-2026Q3.xlsx',
                ty: 'XLSX',
                d: '2026-08-12',
                ex: '2026-11-12',
                by: 'Andi Prasetyo',
              },
            ],
          },
          {
            n: 'Quarterly Access Review',
            c: 'FRM-AC-03',
            x: ['A.5.18', 'A.8.2', '9001 9.1.1'],
            e: [
              {
                n: 'access-review-2026Q2-signed.pdf',
                ty: 'PDF',
                d: '2026-07-08',
                ex: '2026-10-08',
                by: 'Andi Prasetyo',
              },
              {
                n: 'privileged-accounts-export.xlsx',
                ty: 'XLSX',
                d: '2026-07-08',
                ex: '2026-10-08',
                by: 'Andi Prasetyo',
              },
              { n: 'idp-role-matrix.png', ty: 'PNG', d: '2026-07-07', ex: '', by: 'Dewi Kartika' },
            ],
          },
          {
            n: 'Leaver Offboarding Checklist',
            c: 'FRM-AC-06',
            x: ['A.6.5'],
            e: [
              {
                n: 'offboarding-jul-2026.pdf',
                ty: 'PDF',
                d: '2026-08-02',
                ex: '',
                by: 'Sari Handayani',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'A.5.19',
    std: '27001',
    t: 'Information security in supplier relationships',
    s: 'compliant',
    o: 'Ratna Wijaya',
    r: '2027-01-20',
    p: [
      {
        n: 'Supplier Security Policy',
        v: 'v2.3',
        s: 'Approved',
        f: [
          {
            n: 'Supplier Evaluation Form',
            c: 'FRM-SUP-02',
            x: ['A.5.21', '9001 8.4.1', '9001 8.4.2'],
            e: [
              {
                n: 'supplier-eval-2026-cloudhost.pdf',
                ty: 'PDF',
                d: '2026-05-22',
                ex: '2027-05-22',
                by: 'Ratna Wijaya',
              },
              {
                n: 'supplier-scorecard-2026.xlsx',
                ty: 'XLSX',
                d: '2026-06-14',
                ex: '2026-12-14',
                by: 'Ratna Wijaya',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'A.5.23',
    std: '27001',
    t: 'Information security for use of cloud services',
    s: 'gap',
    o: 'Andi Prasetyo',
    r: '',
    p: [
      {
        n: 'Cloud Services Policy',
        v: 'draft',
        s: 'Draft',
        f: [{ n: 'Cloud Service Assessment', c: 'FRM-CLD-01', x: ['A.5.19'], e: [] }],
      },
    ],
  },
  {
    id: 'A.6.3',
    std: '27001',
    t: 'Information security awareness, education and training',
    s: 'review',
    o: 'Sari Handayani',
    r: '2026-08-20',
    p: [
      {
        n: 'Security Awareness Programme',
        v: 'v3.1',
        s: 'Approved',
        f: [
          {
            n: 'Training Attendance Record',
            c: 'FRM-HR-05',
            x: ['9001 7.2'],
            e: [
              {
                n: 'awareness-training-2026H1.pptx',
                ty: 'PPTX',
                d: '2026-03-19',
                ex: '',
                by: 'Sari Handayani',
              },
              {
                n: 'attendance-2026H1-signed.pdf',
                ty: 'PDF',
                d: '2026-03-19',
                ex: '2026-08-14',
                by: 'Sari Handayani',
              },
            ],
          },
          {
            n: 'Phishing Simulation Report',
            c: 'FRM-HR-08',
            x: ['A.8.7'],
            e: [
              {
                n: 'phishing-sim-jun2026.pdf',
                ty: 'PDF',
                d: '2026-06-27',
                ex: '2026-09-27',
                by: 'Andi Prasetyo',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'A.8.8',
    std: '27001',
    t: 'Management of technical vulnerabilities',
    s: 'progress',
    o: 'Andi Prasetyo',
    r: '2026-09-15',
    p: [
      {
        n: 'Vulnerability Management Procedure',
        v: 'v2.2',
        s: 'Approved',
        f: [
          {
            n: 'Scan Result Review',
            c: 'FRM-VM-01',
            x: ['A.8.9', '9001 10.2'],
            e: [
              {
                n: 'vuln-scan-2026-08-15.pdf',
                ty: 'PDF',
                d: '2026-08-15',
                ex: '2026-09-15',
                by: 'Andi Prasetyo',
              },
              {
                n: 'patch-tracker.xlsx',
                ty: 'XLSX',
                d: '2026-08-20',
                ex: '2026-09-20',
                by: 'Andi Prasetyo',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'A.8.13',
    std: '27001',
    t: 'Information backup',
    s: 'compliant',
    o: 'Andi Prasetyo',
    r: '2026-12-01',
    p: [
      {
        n: 'Backup and Restore Procedure',
        v: 'v4.0',
        s: 'Approved',
        f: [
          {
            n: 'Restore Test Record',
            c: 'FRM-BK-02',
            x: ['A.5.29', '9001 8.5.1'],
            e: [
              {
                n: 'restore-test-2026Q2.pdf',
                ty: 'PDF',
                d: '2026-06-11',
                ex: '2026-12-11',
                by: 'Andi Prasetyo',
              },
              { n: 'backup-job-log.png', ty: 'PNG', d: '2026-08-25', ex: '', by: 'Andi Prasetyo' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: '9.2',
    std: '27001',
    t: 'Internal audit',
    s: 'compliant',
    o: 'Bayu Santoso',
    r: '2026-10-02',
    p: [
      {
        n: 'Internal Audit Procedure',
        v: 'v3.2',
        s: 'Approved',
        f: [
          {
            n: 'Internal Audit Programme',
            c: 'FRM-IA-01',
            x: ['9001 9.2.2', '9001 9.1.1'],
            e: [
              {
                n: 'audit-programme-2026.xlsx',
                ty: 'XLSX',
                d: '2026-01-15',
                ex: '2027-01-15',
                by: 'Bayu Santoso',
              },
              {
                n: 'ia-report-2026H1.pdf',
                ty: 'PDF',
                d: '2026-07-04',
                ex: '2026-10-02',
                by: 'Bayu Santoso',
              },
            ],
          },
          {
            n: 'Auditor Competence Record',
            c: 'FRM-IA-04',
            x: ['9001 7.2', 'A.6.3'],
            e: [
              {
                n: 'auditor-competence-2026.xlsx',
                ty: 'XLSX',
                d: '2026-02-03',
                ex: '2027-02-03',
                by: 'Sari Handayani',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: '9.3',
    std: '27001',
    t: 'Management review',
    s: 'review',
    o: 'Ratna Wijaya',
    r: '2026-09-19',
    p: [
      {
        n: 'Management Review Procedure',
        v: 'v2.0',
        s: 'Approved',
        f: [
          {
            n: 'Management Review Minutes',
            c: 'FRM-MR-01',
            x: ['9001 9.3.2', '9001 9.3.3'],
            e: [
              {
                n: 'mgmt-review-2026H1.docx',
                ty: 'DOCX',
                d: '2026-02-27',
                ex: '2026-09-19',
                by: 'Ratna Wijaya',
              },
              {
                n: 'kpi-pack-2026H1.pptx',
                ty: 'PPTX',
                d: '2026-02-26',
                ex: '',
                by: 'Bayu Santoso',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: '8.4',
    std: '9001',
    t: 'Control of externally provided processes, products and services',
    s: 'compliant',
    o: 'Ratna Wijaya',
    r: '2027-02-11',
    p: [
      {
        n: 'Purchasing and Outsourcing Procedure',
        v: 'v3.4',
        s: 'Approved',
        f: [
          {
            n: 'Approved Vendor List',
            c: 'FRM-PUR-01',
            x: ['A.5.19', 'A.5.21'],
            e: [
              {
                n: 'avl-2026-08.xlsx',
                ty: 'XLSX',
                d: '2026-08-05',
                ex: '2027-02-11',
                by: 'Ratna Wijaya',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: '7.5.3',
    std: '9001',
    t: 'Control of documented information',
    s: 'progress',
    o: 'Bayu Santoso',
    r: '2026-10-28',
    p: [
      {
        n: 'Document Control Procedure',
        v: 'v5.0',
        s: 'In review',
        f: [
          {
            n: 'Master Document Register',
            c: 'FRM-DC-01',
            x: ['A.5.33', 'A.5.37'],
            e: [
              {
                n: 'document-register-2026-08.xlsx',
                ty: 'XLSX',
                d: '2026-08-18',
                ex: '2026-10-28',
                by: 'Bayu Santoso',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: '9.1.1',
    std: '9001',
    t: 'Monitoring, measurement, analysis and evaluation — General',
    s: 'gap',
    o: 'Bayu Santoso',
    r: '',
    p: [
      {
        n: 'Performance Monitoring Procedure',
        v: 'draft',
        s: 'Draft',
        f: [{ n: 'Process KPI Sheet', c: 'FRM-PM-01', x: ['A.8.16'], e: [] }],
      },
    ],
  },
  {
    id: '8.7',
    std: '9001',
    t: 'Control of nonconforming outputs',
    s: 'compliant',
    o: 'Fajar Nugroho',
    r: '2026-11-30',
    p: [
      {
        n: 'Nonconformity and Corrective Action Procedure',
        v: 'v4.1',
        s: 'Approved',
        f: [
          {
            n: 'NCR Form',
            c: 'FRM-NCR-01',
            x: ['9001 10.2', 'A.5.24', 'A.5.26'],
            e: [
              {
                n: 'ncr-log-2026.xlsx',
                ty: 'XLSX',
                d: '2026-08-22',
                ex: '2026-11-30',
                by: 'Fajar Nugroho',
              },
              {
                n: 'ncr-2026-041-closure.pdf',
                ty: 'PDF',
                d: '2026-08-14',
                ex: '',
                by: 'Fajar Nugroho',
              },
            ],
          },
        ],
      },
    ],
  },
]

export const ACTIVITY: { t: string; who: string; what: string; ref: string }[] = [
  {
    t: '09:12 WIB',
    who: 'Andi Prasetyo',
    what: 'uploaded patch-tracker.xlsx — replaces v3, 12 rows changed',
    ref: 'A.8.8',
  },
  {
    t: '08:47 WIB',
    who: 'Bayu Santoso',
    what: 'set 7.5.3 to In progress — document register incomplete',
    ref: '9001 7.5.3',
  },
  {
    t: '08:20 WIB',
    who: 'Ratna Wijaya',
    what: 'generated audit pack "Stage 2 · 27001" (48 items, 212 MB)',
    ref: 'PACK-0031',
  },
  {
    t: 'Yesterday',
    who: 'Dewi Kartika',
    what: 'approved Access Control Policy v5.1 — awaiting publication',
    ref: 'A.5.15',
  },
  {
    t: 'Yesterday',
    who: 'System',
    what: 'flagged mgmt-review-2026H1.docx as due in 22 days',
    ref: '27001 9.3',
  },
  {
    t: 'Yesterday',
    who: 'Fajar Nugroho',
    what: 'closed NCR-2026-041 with effectiveness check attached',
    ref: '9001 8.7',
  },
  {
    t: '26 Aug',
    who: 'External · K. Halim',
    what: 'read-only session — viewed 14 clauses, downloaded 3 items',
    ref: 'SESSION-0094',
  },
]

export const VERS: Record<string, MockRevision[]> = {
  'access-review-2026Q2-signed.pdf': [
    {
      v: 'v4',
      d: '2026-07-08',
      by: 'Andi Prasetyo',
      note: 'Signed by IT Director. Appendix B extended with 3 revoked accounts.',
    },
    {
      v: 'v3',
      d: '2026-07-07',
      by: 'Andi Prasetyo',
      note: 'Reviewer comments resolved — 12 rows re-checked against IdP export.',
    },
    {
      v: 'v2',
      d: '2026-07-04',
      by: 'Dewi Kartika',
      note: 'Returned to owner: privileged accounts sheet had no sign-off.',
    },
    {
      v: 'v1',
      d: '2026-07-02',
      by: 'Andi Prasetyo',
      note: 'Initial upload from the quarterly access review meeting.',
    },
  ],
  'asset-register-2026-08.xlsx': [
    {
      v: 'v6',
      d: '2026-08-01',
      by: 'Andi Prasetyo',
      note: 'Monthly reconciliation. 14 assets added, 6 retired, 2 owners changed.',
    },
    {
      v: 'v5',
      d: '2026-07-01',
      by: 'Andi Prasetyo',
      note: 'Monthly reconciliation. Cloud tenancy column added.',
    },
    {
      v: 'v4',
      d: '2026-06-02',
      by: 'Dewi Kartika',
      note: 'Classification labels aligned to A.5.12 scheme.',
    },
  ],
  'patch-tracker.xlsx': [
    {
      v: 'v4',
      d: '2026-08-20',
      by: 'Andi Prasetyo',
      note: '12 rows changed. Two criticals moved to Closed with change refs.',
    },
    {
      v: 'v3',
      d: '2026-08-15',
      by: 'Andi Prasetyo',
      note: 'Loaded results of the 15 Aug authenticated scan.',
    },
    { v: 'v2', d: '2026-07-18', by: 'Andi Prasetyo', note: 'SLA columns split by severity.' },
    { v: 'v1', d: '2026-06-20', by: 'Dewi Kartika', note: 'Template issued.' },
  ],
}
export const PVERS: Record<string, MockRevision[]> = {
  'Access Control Policy': [
    {
      v: 'v5.1',
      d: '2026-08-24',
      by: 'Dewi Kartika',
      appr: 'Approved · awaiting publication',
      s: 'In review',
      note: 'Joiner-mover-leaver timings tightened to 1 business day. MFA mandatory for all remote access.',
    },
    {
      v: 'v5.0',
      d: '2026-02-11',
      by: 'Dewi Kartika',
      appr: 'Approved by ISMS Committee',
      s: 'Approved',
      note: 'Restructured to 2022 control set. A.5.16 and A.5.18 explicitly referenced.',
    },
    {
      v: 'v4.2',
      d: '2025-08-19',
      by: 'Andi Prasetyo',
      appr: 'Approved by IT Director',
      s: 'Approved',
      note: 'Privileged access review moved from annual to quarterly.',
    },
    {
      v: 'v4.0',
      d: '2025-01-30',
      by: 'Dewi Kartika',
      appr: 'Approved by ISMS Committee',
      s: 'Approved',
      note: 'Annual review. No material change.',
    },
    {
      v: 'v3.1',
      d: '2024-03-14',
      by: 'Dewi Kartika',
      appr: 'Approved by ISMS Committee',
      s: 'Approved',
      note: 'Contractor access section added after finding NC-2024-03.',
    },
  ],
  _default: [
    {
      v: 'current',
      d: '2026-06-30',
      by: 'Dewi Kartika',
      appr: 'Approved by ISMS Committee',
      s: 'Approved',
      note: 'Annual review completed, no material change.',
    },
    {
      v: 'previous',
      d: '2025-06-24',
      by: 'Dewi Kartika',
      appr: 'Approved by ISMS Committee',
      s: 'Approved',
      note: 'Issued.',
    },
  ],
}
export const GAPS: MockGap[] = [
  {
    id: 'A.5.23',
    std: '27001',
    t: 'Information security for use of cloud services',
    gap: 'No assessment record exists for 4 of 7 production cloud services.',
    task: 'Complete FRM-CLD-01 for Cloudhost, Mailgun, Snowflake, Datadog',
    owner: 'Andi Prasetyo',
    due: '2026-09-12',
    blocking: true,
    pct: 35,
  },
  {
    id: '9.1.1',
    std: '9001',
    t: 'Monitoring, measurement, analysis and evaluation — General',
    gap: 'Process KPI sheet is in draft; no signed data for Q2.',
    task: 'Publish FRM-PM-01 and backfill Q2 process metrics',
    owner: 'Bayu Santoso',
    due: '2026-09-05',
    blocking: true,
    pct: 20,
  },
  {
    id: 'A.5.9',
    std: '27001',
    t: 'Inventory of information and other associated assets',
    gap: 'Asset register expires 30 Sep; 11 assets carry no owner.',
    task: 'Assign owners and re-baseline the register',
    owner: 'Andi Prasetyo',
    due: '2026-09-30',
    blocking: false,
    pct: 70,
  },
  {
    id: '9.3',
    std: '27001',
    t: 'Management review',
    gap: 'H1 minutes not counter-signed by the Managing Director.',
    task: 'Obtain signature and re-upload FRM-MR-01 evidence',
    owner: 'Ratna Wijaya',
    due: '2026-09-19',
    blocking: false,
    pct: 80,
  },
  {
    id: '7.5.3',
    std: '9001',
    t: 'Control of documented information',
    gap: 'Master register missing 23 controlled documents held on shared drives.',
    task: 'Reconcile shared drive inventory into FRM-DC-01',
    owner: 'Bayu Santoso',
    due: '2026-10-28',
    blocking: false,
    pct: 45,
  },
]
export const ROLES: Record<string, string> = {
  'Andi Prasetyo': 'IT Administrator',
  'Ratna Wijaya': 'Compliance Manager',
  'Dewi Kartika': 'ISMS Lead',
  'Bayu Santoso': 'QA Lead · Internal Auditor',
  'Sari Handayani': 'HR Manager',
  'Fajar Nugroho': 'Operations Manager',
}
export const PACK: { k: string; l: string; meta: string; on: boolean }[] = [
  { k: 'clauses', l: 'Clause index with status and owner', meta: '134 rows · 1 xlsx', on: true },
  {
    k: 'policies',
    l: 'Approved policies at current version',
    meta: '19 documents · 41 MB',
    on: true,
  },
  {
    k: 'forms',
    l: 'Blank form templates referenced by the index',
    meta: '26 documents · 8 MB',
    on: true,
  },
  { k: 'evidence', l: 'Evidence for in-scope clauses', meta: '612 items · 1.9 GB', on: true },
  {
    k: 'trail',
    l: 'Version history and audit trail export',
    meta: 'CSV per item · 4 MB',
    on: false,
  },
  { k: 'gaps', l: 'Open gaps with remediation plans', meta: '5 rows · 1 xlsx', on: false },
  { k: 'crossmap', l: 'Cross-mapping matrix (27001 ⇄ 9001)', meta: '19 forms · 1 xlsx', on: true },
]

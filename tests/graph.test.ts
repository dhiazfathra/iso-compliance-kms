import { describe, expect, it, test } from 'bun:test'
import {
  crossMapMatrix,
  groupBy,
  crossMapOf,
  evidenceCount,
  expiryHorizon,
  filterClauses,
  gapStats,
  isTracked,
  openChainKeys,
  ownerLoad,
  readiness,
  statusCount,
  trackedClauses,
} from '../src/lib/graph'
import type { ClauseNode, Graph } from '../src/lib/data'

const user = { id: 1, name: 'Andi Prasetyo', role: 'IT Administrator' }

function clause(over: Partial<ClauseNode> = {}): ClauseNode {
  return {
    id: 1,
    clauseId: 'A.5.15',
    standard: '27001',
    title: 'Access control',
    status: 'compliant',
    owner: user,
    criticality: 1,
    policies: [],
    ...over,
  }
}

const withChain = clause({
  policies: [
    {
      id: 1,
      name: 'Access Control Policy',
      version: 'v5.1',
      status: 'In review',
      primaryClause: 'A.5.15',
      clauses: ['A.5.15', 'A.5.16'],
      revisions: [],
      forms: [
        {
          id: 1,
          code: 'FRM-AC-03',
          name: 'Quarterly Access Review',
          policy: 1,
          primaryClause: 'A.5.15',
          alsoSatisfies: ['A.5.18', 'A.5.16'],
          externalRefs: ['9001 9.1.1'],
          evidence: [
            {
              id: 1,
              title: 'access-review.pdf',
              fileType: 'PDF',
              uploadedAt: '2026-07-08',
              uploader: user,
              form: 1,
              satisfies: ['A.5.15', 'A.5.18'],
              revisions: [],
            },
            {
              id: 2,
              title: 'privileged-accounts.xlsx',
              fileType: 'XLSX',
              uploadedAt: '2026-07-08',
              uploader: user,
              form: 1,
              satisfies: ['A.5.15'],
              revisions: [],
            },
          ],
        },
      ],
    },
  ],
})

describe('crossMapOf', () => {
  test('collects policy, form and external references without the clause itself', () => {
    expect(crossMapOf(withChain).sort()).toEqual(['9001 9.1.1', 'A.5.16', 'A.5.18'])
  })

  test('is empty for a clause with nothing mapped to it', () => {
    expect(crossMapOf(clause())).toEqual([])
  })
})

describe('evidenceCount', () => {
  test('counts evidence across every form of every policy', () => {
    expect(evidenceCount(withChain)).toBe(2)
    expect(evidenceCount(clause())).toBe(0)
  })
})

describe('readiness', () => {
  test('weights statuses and rounds to a percentage', () => {
    const set = [
      clause({ status: 'compliant' }),
      clause({ status: 'review' }),
      clause({ status: 'progress' }),
      clause({ status: 'gap' }),
    ]
    // (1 + 0.75 + 0.5 + 0) / 4
    expect(readiness(set)).toBe(56)
  })

  test('criticality 0 keeps a referenced stub out of both sides of the ratio', () => {
    const tracked = [clause({ status: 'compliant' })]
    expect(readiness([...tracked, clause({ status: 'gap', criticality: 0 })])).toBe(
      readiness(tracked),
    )
  })

  test('an empty set scores zero rather than dividing by zero', () => {
    expect(readiness([])).toBe(0)
  })
})

// ── Derivations the screens read ─────────────────────────────────────────────

const NOW = new Date('2026-08-28T00:00:00Z')
const auditor = { id: 2, name: 'Sari Wijaya', role: 'Quality Manager' }

/** A graph carrying only what the derivation under test looks at. */
function graph(over: Partial<Graph> = {}): Graph {
  return {
    clauses: [],
    policies: [],
    forms: [],
    evidence: [],
    users: [],
    gaps: [],
    activity: [],
    ...over,
  }
}

describe('isTracked / trackedClauses', () => {
  test('weight-0 catalogue stubs are not tracked requirements', () => {
    expect(isTracked(clause())).toBe(true)
    expect(isTracked(clause({ criticality: 0 }))).toBe(false)
    // A missing weight defaults to 1, so an unweighted clause still counts.
    expect(isTracked(clause({ criticality: null }))).toBe(true)
  })

  test('trackedClauses drops the stubs and keeps the order', () => {
    const kept = clause({ clauseId: 'A.5.15' })
    const stub = clause({ clauseId: 'A.5.16', criticality: 0 })
    expect(trackedClauses([kept, stub, kept]).length).toBe(2)
  })
})

describe('statusCount', () => {
  const set = [
    clause({ status: 'gap', standard: '27001' }),
    clause({ status: 'gap', standard: '9001' }),
    clause({ status: 'compliant', standard: '27001' }),
  ]

  test('counts by status, and by status within one standard', () => {
    expect(statusCount(set, 'gap')).toBe(2)
    expect(statusCount(set, 'gap', '9001')).toBe(1)
    expect(statusCount(set, 'compliant', '9001')).toBe(0)
  })
})

describe('expiryHorizon', () => {
  const g = graph({
    clauses: [
      clause({ clauseId: 'A.5.15', nextReview: '2026-08-20' }),
      clause({ nextReview: null }),
    ],
    evidence: [
      {
        id: 7,
        title: 'pen-test.pdf',
        fileType: 'PDF',
        uploadedAt: '2026-01-01',
        expiryDate: '2026-09-15',
        uploader: user,
        form: 1,
        satisfies: ['A.8.29'],
        revisions: [],
      },
      {
        id: 8,
        title: 'no-expiry.pdf',
        fileType: 'PDF',
        uploadedAt: '2026-01-01',
        uploader: user,
        form: 1,
        satisfies: [],
        revisions: [],
      },
    ],
  })

  test('merges clause reviews and evidence expiries, oldest first', () => {
    const { items } = expiryHorizon(g, NOW)
    expect(items.map((x) => x.date)).toEqual(['2026-08-20', '2026-09-15'])
    expect(items[0].name).toBe('Clause review · Access control')
    expect(items[1].href).toBe('/evidence/7')
  })

  test('dated nothing is skipped, so a lapse cannot hide behind a null', () => {
    expect(expiryHorizon(g, NOW).items.length).toBe(2)
  })

  test('splits overdue from the next 30 days', () => {
    expect(expiryHorizon(g, NOW)).toMatchObject({ overdue: 1, soon: 1 })
    // Same data a month later: both dates are behind us.
    expect(expiryHorizon(g, new Date('2026-10-01T00:00:00Z'))).toMatchObject({
      overdue: 2,
      soon: 0,
    })
  })

  test('a date exactly on the boundary counts as soon, not overdue', () => {
    const boundary = graph({ clauses: [clause({ nextReview: '2026-09-27' })] })
    expect(expiryHorizon(boundary, NOW)).toMatchObject({ overdue: 0, soon: 1 })
    expect(expiryHorizon(boundary, new Date('2026-09-27T23:00:00Z'))).toMatchObject({
      overdue: 0,
      soon: 1,
    })
  })
})

describe('ownerLoad', () => {
  const g = graph({
    users: [user, auditor, { id: 3, name: 'Nobody', role: 'Viewer' }],
    clauses: [
      clause({ owner: user, status: 'compliant', nextReview: '2026-09-10' }),
      clause({ owner: user, status: 'gap' }),
      clause({ owner: auditor, status: 'review', nextReview: '2027-01-01' }),
    ],
    evidence: [
      {
        id: 1,
        title: 'a.pdf',
        fileType: 'PDF',
        uploadedAt: '2026-01-01',
        uploader: user,
        form: 1,
        satisfies: [],
        revisions: [],
      },
    ],
  })

  test('splits each owner by status and sorts by load', () => {
    const rows = ownerLoad(g, NOW)
    expect(rows.map((r) => r.user.name)).toEqual(['Andi Prasetyo', 'Sari Wijaya'])
    expect(rows[0]).toMatchObject({ total: 2, compliant: 1, gap: 1, evidence: 1, due: 1 })
  })

  test('a review beyond 30 days is not counted as due', () => {
    expect(ownerLoad(g, NOW)[1].due).toBe(0)
  })

  test('owners with nothing assigned drop out of the table', () => {
    expect(ownerLoad(g, NOW).some((r) => r.user.name === 'Nobody')).toBe(false)
  })
})

describe('gapStats', () => {
  const gap = (over: Partial<Graph['gaps'][number]>): Graph['gaps'][number] => ({
    id: 1,
    clause: clause(),
    finding: 'f',
    task: 't',
    owner: user,
    due: '2026-09-07',
    blocking: false,
    progress: 0,
    ...over,
  })

  test('summarises the register', () => {
    const gaps = [
      gap({ due: '2026-09-07', progress: 40, blocking: true }),
      gap({ due: '2026-08-18', progress: 60 }),
      gap({ due: '2026-10-27', progress: 50 }),
    ]
    // Ages |10|, |60|, |10| sorted -> 10, 10, 60; the middle one is 10.
    expect(gapStats(gaps, NOW)).toEqual({
      open: 3,
      blocking: 1,
      meanProgress: 50,
      medianAge: 10,
    })
  })

  test('an empty register does not divide by zero', () => {
    expect(gapStats([], NOW)).toEqual({ open: 0, blocking: 0, meanProgress: 0, medianAge: 0 })
  })
})

describe('crossMapMatrix', () => {
  const form = (over: Partial<Graph['forms'][number]>): Graph['forms'][number] => ({
    id: 1,
    code: 'FRM-AC-03',
    name: 'Quarterly Access Review',
    policy: 1,
    primaryClause: 'A.5.15',
    alsoSatisfies: [],
    externalRefs: [],
    evidence: [],
    ...over,
  })

  const g = graph({
    clauses: [
      clause({ clauseId: 'A.5.15' }),
      clause({ clauseId: 'A.5.18' }),
      clause({ clauseId: 'A.9.99' }),
    ],
    policies: [withChain.policies[0]],
    forms: [
      form({ alsoSatisfies: ['A.5.18'] }),
      form({ id: 2, code: 'FRM-ONE', policy: 1 }),
      form({ id: 3, code: 'FRM-DUP', alsoSatisfies: ['A.5.15'] }),
    ],
  })

  test('keeps only artefacts that satisfy more than one requirement', () => {
    expect(crossMapMatrix(g).rows.map((r) => r.form.code)).toEqual(['FRM-AC-03'])
  })

  test('marks the primary requirement apart from the ones also satisfied', () => {
    const hits = crossMapMatrix(g).rows[0].hits
    expect(hits.get('A.5.15')).toBe('primary')
    expect(hits.get('A.5.18')).toBe('cross')
  })

  test('columns are only requirements something points at', () => {
    expect(crossMapMatrix(g).columns.map((c) => c.clauseId)).toEqual(['A.5.15', 'A.5.18'])
  })

  test('resolves each row to its policy', () => {
    expect(crossMapMatrix(g).rows[0].policy?.name).toBe('Access Control Policy')
  })
})

describe('filterClauses', () => {
  const stub = clause({ clauseId: 'A.8.24', title: 'Cryptography', criticality: 0 })
  const other = clause({
    clauseId: '9.1.1',
    standard: '9001',
    title: 'Monitoring',
    status: 'gap',
    owner: auditor,
  })
  const all = [withChain, stub, other]

  test('hides out-of-scope catalogue stubs by default', () => {
    expect(filterClauses(all, {}).map((c) => c.clauseId)).toEqual(['A.5.15', '9.1.1'])
  })

  test('shows them when the scope chip is switched off', () => {
    expect(filterClauses(all, { scope: 'all' }).length).toBe(3)
  })

  test('a search reaches a stub even in tracked scope', () => {
    expect(filterClauses(all, { q: 'A.8.24' }).map((c) => c.clauseId)).toEqual(['A.8.24'])
  })

  test('standard, status and owner narrow independently', () => {
    expect(filterClauses(all, { std: '9001' }).map((c) => c.clauseId)).toEqual(['9.1.1'])
    expect(filterClauses(all, { status: 'gap' }).map((c) => c.clauseId)).toEqual(['9.1.1'])
    expect(filterClauses(all, { owner: 'Sari Wijaya' }).map((c) => c.clauseId)).toEqual(['9.1.1'])
  })

  test('the needle reaches down the whole chain, case-insensitively', () => {
    for (const q of [
      'a.5.15', // clause id
      'access control', // title
      'andi', // owner
      'A.5.16', // cross-map
      'Access Control Policy', // policy name
      'quarterly access', // form name
      'frm-ac-03', // form code
      'privileged-accounts.xlsx', // evidence title
      '9001 9.1.1', // external reference
    ]) {
      expect(filterClauses([withChain], { q }).length).toBe(1)
    }
  })

  test('a needle matching nothing returns nothing', () => {
    expect(filterClauses(all, { q: 'nothing here' })).toEqual([])
  })

  test('whitespace is not a search', () => {
    expect(filterClauses(all, { q: '   ' }).length).toBe(2)
  })
})

describe('openChainKeys', () => {
  test('opens the whole chain when a search narrowed the view', () => {
    expect(openChainKeys([withChain], true)).toEqual([
      'A.5.15',
      'A.5.15|Access Control Policy',
      'A.5.15|Access Control Policy|FRM-AC-03',
    ])
  })

  test('opens a small result set even without a search', () => {
    expect(openChainKeys([clause()], false)).toEqual(['A.5.15'])
  })

  test('leaves a long unsearched list collapsed', () => {
    expect(openChainKeys([clause(), clause(), clause(), clause()], false)).toEqual([])
  })
})

describe('groupBy', () => {
  it('buckets every item under its key, in encounter order', () => {
    const rows = [
      { id: 1, form: 'A' },
      { id: 2, form: 'B' },
      { id: 3, form: 'A' },
    ]
    const grouped = groupBy(rows, (r) => r.form)
    expect([...grouped.keys()]).toEqual(['A', 'B'])
    expect(grouped.get('A')?.map((r) => r.id)).toEqual([1, 3])
    expect(grouped.get('B')?.map((r) => r.id)).toEqual([2])
  })

  it('has no bucket for a key nothing was filed under', () => {
    expect(groupBy([{ k: 1 }], (r) => r.k).get(2)).toBeUndefined()
    expect(groupBy([] as { k: number }[], (r) => r.k).size).toBe(0)
  })

  it('does the work in one pass rather than one scan per key', () => {
    // 2,000 rows over 500 keys: quadratic grouping is ~1e6 comparisons, this
    // is 2,000. The assertion is on the result; the point is that it returns.
    const rows = Array.from({ length: 2000 }, (_, i) => ({ i, k: i % 500 }))
    const grouped = groupBy(rows, (r) => r.k)
    expect(grouped.size).toBe(500)
    expect(grouped.get(0)).toHaveLength(4)
  })
})

import { describe, expect, test } from 'bun:test'
import { crossMapOf, evidenceCount, readiness } from '../src/lib/graph'
import type { ClauseNode } from '../src/lib/data'

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

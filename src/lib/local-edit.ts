/**
 * The two edits local mode can make to a register, as pure functions.
 *
 * The graph is nested — a policy appears both in `graph.policies` and under
 * every clause that lists it — so an edit that touched only one of them would
 * show a different document depending on the screen you came from. These
 * rewrite every copy, and are pure so the part that has to be right is
 * testable without a browser.
 */
import type { EvidenceItem, FormNode, Graph, PolicyNode } from './data'

const LOCAL_ACTOR = 'Local pack'

function withActivity(graph: Graph, action: string, ref: string, at: Date): Graph['activity'] {
  const id = Math.max(0, ...graph.activity.map((a) => a.id)) + 1
  return [{ id, at: at.toISOString(), actor: LOCAL_ACTOR, action, ref }, ...graph.activity]
}

/** Replaces a controlled document's text, everywhere it appears. */
export function withPolicyBody(graph: Graph, id: number, body: string, at: Date): Graph {
  const target = graph.policies.find((p) => p.id === id)
  if (!target) throw new Error(`No document with id ${id} in this pack.`)
  const edit = (p: PolicyNode): PolicyNode => (p.id === id ? { ...p, body } : p)

  return {
    ...graph,
    policies: graph.policies.map(edit),
    clauses: graph.clauses.map((c) => ({ ...c, policies: c.policies.map(edit) })),
    activity: withActivity(graph, 'Edited document text', target.name, at),
  }
}

/**
 * Files a new version of an evidence record. The bytes are written to OPFS by
 * the caller; what happens to the register is here.
 */
export function withEvidenceVersion(
  graph: Graph,
  id: number,
  { note, filesize, at }: { note: string; filesize: number; at: Date },
): Graph {
  const target = graph.evidence.find((e) => e.id === id)
  if (!target) throw new Error(`No record with id ${id} in this pack.`)

  const edit = (e: EvidenceItem): EvidenceItem =>
    e.id === id
      ? {
          ...e,
          filesize,
          uploadedAt: at.toISOString(),
          revisions: [
            {
              version: `v${e.revisions.length + 1}`,
              date: at.toISOString(),
              author: LOCAL_ACTOR,
              note: note.trim() || 'New version uploaded.',
            },
            ...e.revisions,
          ],
        }
      : e

  const inForm = (f: FormNode): FormNode => ({ ...f, evidence: f.evidence.map(edit) })

  return {
    ...graph,
    evidence: graph.evidence.map(edit),
    forms: graph.forms.map(inForm),
    policies: graph.policies.map((p) => ({ ...p, forms: p.forms.map(inForm) })),
    clauses: graph.clauses.map((c) => ({
      ...c,
      policies: c.policies.map((p) => ({ ...p, forms: p.forms.map(inForm) })),
    })),
    activity: withActivity(graph, 'Uploaded a new version', target.title, at),
  }
}

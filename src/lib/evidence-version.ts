export type Revision = {
  version: string
  date: string
  author?: number | { id: number } | null
  note?: string | null
}

/**
 * What a new evidence version does to the record's history: the next `vN`
 * label, newest first, attributed to whoever uploaded it. Pure, because this is
 * the part of the upload that has to be right — the rest of the server action
 * is Payload calls.
 */
export function prependRevision(
  existing: unknown,
  { note, authorId, at }: { note: string; authorId: number; at: Date },
): Revision[] {
  const revisions: Revision[] = Array.isArray(existing) ? (existing as Revision[]) : []
  return [
    {
      version: `v${revisions.length + 1}`,
      date: at.toISOString(),
      author: authorId,
      note: note.trim() || 'New version uploaded.',
    },
    ...revisions,
  ]
}

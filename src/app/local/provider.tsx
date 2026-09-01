'use client'

/**
 * Local mode's data source.
 *
 * The hosted app loads the register from Payload in an RSC; here the register
 * is a pack the user picked, held in OPFS and parsed once into the same
 * `Graph` every screen already takes. `save` writes the register back so an
 * edit survives a reload — the pack is the database.
 */
import { createContext, useContext, useEffect, useState } from 'react'
import type { Graph } from '@/lib/data'
import type { ParsedPack } from '@/lib/pack'
import { loadStoredPack, opfsAvailable, saveGraph } from '@/lib/opfs'

type LocalState = {
  pack: ParsedPack | undefined
  /** Undefined while OPFS is still being read — not the same as "no pack". */
  loading: boolean
  error: string | undefined
  /** Replaces the register and writes it back to OPFS. */
  save: (graph: Graph) => Promise<void>
  /** Re-reads OPFS, after an import or a wipe. */
  reload: () => Promise<void>
}

const Ctx = createContext<LocalState | undefined>(undefined)

export function useLocalPack(): LocalState {
  const state = useContext(Ctx)
  if (!state) throw new Error('useLocalPack must be used inside LocalPackProvider.')
  return state
}

export function LocalPackProvider({ children }: { children: React.ReactNode }) {
  const [pack, setPack] = useState<ParsedPack | undefined>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | undefined>()

  const read = async () => {
    try {
      if (!opfsAvailable()) throw new Error('This browser cannot store a pack locally.')
      const stored = await loadStoredPack()
      setPack(stored)
      setError(undefined)
    } catch (e) {
      setPack(undefined)
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }

  // Runs once: OPFS is read when the tab opens, and after that only on demand.
  // OPFS is an external store with no subscription to render from, so reading
  // it on mount and holding the result in state is the only way in.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void read()
  }, [])

  /** Re-reads OPFS after an import or a wipe, showing the loading state again. */
  const reload = async () => {
    setLoading(true)
    await read()
  }

  const save = async (graph: Graph) => {
    if (!pack) throw new Error('There is no pack open to save into.')
    const next = { ...pack, graph }
    await saveGraph(next, graph)
    setPack(next)
  }

  return <Ctx.Provider value={{ pack, loading, error, save, reload }}>{children}</Ctx.Provider>
}

'use client'

/**
 * Local mode's shell.
 *
 * Same sidebar, same topbar, same screens as the hosted app — but rendered in
 * the browser over a pack in OPFS, with no account behind it. There is one
 * implicit user with write access: the data never left the machine, so there
 * is nobody to check permissions against.
 */
import { Sidebar } from '@/components/Sidebar'
import { Topbar } from '@/components/Topbar'
import { LocalPackProvider, useLocalPack } from './provider'

function Frame({ children }: { children: React.ReactNode }) {
  const { pack } = useLocalPack()
  const graph = pack?.graph
  const counts = {
    clauses: graph?.clauses.length ?? 0,
    evidence: graph?.evidence.length ?? 0,
    gaps: graph?.gaps.length ?? 0,
  }

  return (
    <div className="shell">
      <Sidebar counts={counts} base="/local" />
      <main className="main">
        <Topbar user={{ name: 'Local pack', access: 'write' }} base="/local" />
        <div className="content">{children}</div>
      </main>
    </div>
  )
}

export function LocalShell({ children }: { children: React.ReactNode }) {
  return (
    <LocalPackProvider>
      <Frame>{children}</Frame>
    </LocalPackProvider>
  )
}

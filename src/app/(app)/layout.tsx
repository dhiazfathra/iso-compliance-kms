import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Sidebar } from '@/components/Sidebar'
import { Topbar } from '@/components/Topbar'
import { loadGraph } from '@/lib/data'
import { requireUser } from '@/lib/auth'

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-inter' })
const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono' })

export const metadata: Metadata = {
  title: 'Compliance Repository · Dermaster ISMS',
  description: 'ISO/IEC 27001:2022 and ISO 9001:2015 clause, policy, form and evidence repository',
}

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser()
  const graph = await loadGraph()
  const counts = {
    clauses: graph.clauses.length,
    evidence: graph.evidence.length,
    gaps: graph.gaps.length,
  }

  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`} suppressHydrationWarning>
      <body>
        <div className="shell">
          <Sidebar counts={counts} />
          <main className="main">
            <Topbar user={{ name: user.name, access: user.access }} />
            <div className="content">{children}</div>
          </main>
        </div>
      </body>
    </html>
  )
}

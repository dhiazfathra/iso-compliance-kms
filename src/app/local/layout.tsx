import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import '../(app)/globals.css'
import { LocalShell } from './shell'

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-inter' })
const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono' })

export const metadata: Metadata = {
  title: 'Local mode · Compliance Repository',
  description: 'The register, held in this browser. Nothing is sent anywhere.',
}

export default function LocalLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`} suppressHydrationWarning>
      <body>
        <LocalShell>{children}</LocalShell>
      </body>
    </html>
  )
}

import { loadGraph } from '@/lib/data'
import { DashboardView } from '@/views/dashboard'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  return <DashboardView graph={await loadGraph()} base="" />
}

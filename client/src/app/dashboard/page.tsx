'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { clearAuthSession, getAuthToken } from '@/lib/authSession'
import { getApiBaseUrl } from '@/lib/apiBase'

type ActionCount = {
  action: string
  count: number
}

type RecentActivity = {
  action: string
  endpoint: string
  repoUrl: string | null
  repoSlug: string | null
  statusCode: number
  fromCache: boolean
  durationMs: number
  createdAt: string | null
}

type CachedRepo = {
  repoSlug: string
  cacheHits: number
  lastAction: string
  lastAccessedAt: string | null
}

type DashboardResponse = {
  user: {
    id: string
    username: string
    email: string
    createdAt: string
    updatedAt: string
  }
  cumulative: {
    totalActivities: number
    totalRepositories: number
    cachedActivities: number
    mostUsedActions: ActionCount[]
  }
  recentActivities: RecentActivity[]
  recentRepositories: Array<{
    repoSlug: string
    lastAction: string
    lastStatusCode: number
    lastAccessedAt: string | null
    fromCache: boolean
  }>
  cachedRepositories: CachedRepo[]
}

function toLabel(value: string): string {
  return String(value || '')
    .replace(/[_-]+/g, ' ')
    .trim()
    .replace(/\b\w/g, (m) => m.toUpperCase())
}

function formatDate(value: string | null): string {
  if (!value) return 'N/A'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'N/A'
  return date.toLocaleString()
}

export default function DashboardPage() {
  const router = useRouter()
  const apiBase = getApiBaseUrl()

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [data, setData] = useState<DashboardResponse | null>(null)

  useEffect(() => {
    let cancelled = false

    const run = async () => {
      const token = getAuthToken()
      if (!token) {
        router.replace('/login?next=%2Fdashboard')
        return
      }

      try {
        setIsLoading(true)
        setError('')

        const response = await fetch(`${apiBase}/api/auth/dashboard`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const payload = (await response.json().catch(() => ({}))) as DashboardResponse & { message?: string }

        if (!response.ok) {
          if (response.status === 401) {
            clearAuthSession()
            router.replace('/login?next=%2Fdashboard')
            return
          }

          if (!cancelled) {
            setError(payload.message || 'Unable to load dashboard data.')
          }
          return
        }

        if (!cancelled) {
          setData(payload)
        }
      } catch {
        if (!cancelled) {
          setError('Unable to reach backend service.')
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [apiBase, router])

  const actionCounts = useMemo(() => data?.cumulative.mostUsedActions || [], [data])
  const recentActivities = useMemo(() => data?.recentActivities || [], [data])
  const cachedRepositories = useMemo(() => data?.cachedRepositories || [], [data])

  return (
    <div className="min-h-screen overflow-x-hidden bg-linear-to-br from-blue-950 via-slate-950 to-black text-white">
      <Header />

      <main className="container mx-auto space-y-8 px-4 py-10">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-sm">
          <p className="text-sm uppercase tracking-[0.2em] text-blue-200">User Dashboard</p>
          <h1 className="mt-2 text-3xl font-bold">Welcome{data?.user?.username ? `, ${data.user.username}` : ''}</h1>
          <p className="mt-2 text-blue-100/90">Cumulative profile insights, recent activities, and cached repositories.</p>

          {data?.user ? (
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-wide text-blue-200">Email</p>
                <p className="mt-1 break-all text-sm text-white">{data.user.email}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-wide text-blue-200">Joined</p>
                <p className="mt-1 text-sm text-white">{formatDate(data.user.createdAt)}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-wide text-blue-200">Last Profile Update</p>
                <p className="mt-1 text-sm text-white">{formatDate(data.user.updatedAt)}</p>
              </div>
            </div>
          ) : null}
        </section>

        {isLoading ? (
          <section className="rounded-3xl border border-white/10 bg-white/5 p-8 text-blue-100">Loading dashboard...</section>
        ) : null}

        {!isLoading && error ? (
          <section className="rounded-3xl border border-red-300/30 bg-red-500/10 p-6 text-red-100">{error}</section>
        ) : null}

        {!isLoading && !error && data ? (
          <>
            <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
              <article className="rounded-xl border border-white/10 bg-white/5 p-5">
                <p className="text-xs uppercase tracking-wide text-blue-200">Total Activities</p>
                <p className="mt-2 text-3xl font-bold text-cyan-300">{data.cumulative.totalActivities}</p>
              </article>
              <article className="rounded-xl border border-white/10 bg-white/5 p-5">
                <p className="text-xs uppercase tracking-wide text-blue-200">Repositories Tracked</p>
                <p className="mt-2 text-3xl font-bold text-cyan-300">{data.cumulative.totalRepositories}</p>
              </article>
              <article className="rounded-xl border border-white/10 bg-white/5 p-5">
                <p className="text-xs uppercase tracking-wide text-blue-200">Cached Activities</p>
                <p className="mt-2 text-3xl font-bold text-cyan-300">{data.cumulative.cachedActivities}</p>
              </article>
              <article className="rounded-xl border border-white/10 bg-white/5 p-5">
                <p className="text-xs uppercase tracking-wide text-blue-200">Recent Activity Rows</p>
                <p className="mt-2 text-3xl font-bold text-cyan-300">{recentActivities.length}</p>
              </article>
            </section>

            <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <article className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h2 className="text-xl font-semibold">Most Used Actions</h2>
                <div className="mt-4 space-y-3">
                  {actionCounts.length > 0 ? actionCounts.map((row) => (
                    <div key={row.action} className="flex items-center justify-between rounded-lg border border-white/10 bg-black/20 px-3 py-2">
                      <span className="text-sm text-blue-100">{toLabel(row.action)}</span>
                      <span className="text-sm font-semibold text-cyan-300">{row.count}</span>
                    </div>
                  )) : <p className="text-sm text-blue-100">No actions recorded yet.</p>}
                </div>
              </article>

              <article className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <h2 className="text-xl font-semibold">Cached Repositories</h2>
                <div className="mt-4 space-y-3">
                  {cachedRepositories.length > 0 ? cachedRepositories.map((row) => (
                    <div key={`${row.repoSlug}-${row.lastAccessedAt || ''}`} className="rounded-lg border border-white/10 bg-black/20 p-3">
                      <p className="text-sm font-semibold text-cyan-300">{row.repoSlug}</p>
                      <p className="mt-1 text-xs text-blue-100">Cache Hits: {row.cacheHits} | Last Action: {toLabel(row.lastAction)}</p>
                      <p className="mt-1 text-xs text-blue-100">Last Accessed: {formatDate(row.lastAccessedAt)}</p>
                    </div>
                  )) : <p className="text-sm text-blue-100">No cached repository activity yet.</p>}
                </div>
              </article>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-xl font-semibold">Recent Activities</h2>
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-y-2 text-left text-sm">
                  <thead>
                    <tr className="text-blue-200">
                      <th className="px-3 py-2">Action</th>
                      <th className="px-3 py-2">Repository</th>
                      <th className="px-3 py-2">Status</th>
                      <th className="px-3 py-2">Cache</th>
                      <th className="px-3 py-2">Duration</th>
                      <th className="px-3 py-2">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentActivities.length > 0 ? recentActivities.map((row, idx) => (
                      <tr key={`${row.action}-${row.createdAt || ''}-${idx}`} className="rounded-lg border border-white/10 bg-black/20">
                        <td className="px-3 py-2 text-blue-100">{toLabel(row.action)}</td>
                        <td className="px-3 py-2 text-blue-100">{row.repoSlug || row.repoUrl || 'N/A'}</td>
                        <td className="px-3 py-2 text-blue-100">{row.statusCode}</td>
                        <td className="px-3 py-2 text-blue-100">{row.fromCache ? 'HIT' : 'MISS'}</td>
                        <td className="px-3 py-2 text-blue-100">{row.durationMs} ms</td>
                        <td className="px-3 py-2 text-blue-100">{formatDate(row.createdAt)}</td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={6} className="px-3 py-4 text-blue-100">No recent activities yet. Run an analysis to start populating this dashboard.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        ) : null}
      </main>

      <Footer />
    </div>
  )
}

"use client"

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

type AnalyzeResponse = {
  input?: {
    owner?: string
    repo?: string
    url?: string
  }
  repo?: {
    fullName?: string
    htmlUrl?: string
    description?: string
    stars?: number
    forks?: number
    openIssues?: number
    defaultBranch?: string
    visibility?: string
  }
  snapshot?: {
    files?: {
      fileCount?: number
      directoryCount?: number
    }
    languagesTop?: Array<{
      name: string
      percent: number
    }>
    readme?: {
      present?: boolean
      wordCount?: number
    }
    git?: {
      commitsLast90Days?: number
      contributors?: number
      pullRequests?: number
      releases?: number
    }
  }
  score?: {
    value?: number
    band?: string
    reasons?: string[]
  }
  summary?: string
  roadmap?: string[]
}

export default function AnalyzePage() {
  const router = useRouter()
  const [repoUrl, setRepoUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<AnalyzeResponse | null>(null)

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'

  const token = useMemo(() => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('gitguard_token')
  }, [])

  const ensureAuth = () => {
    const currentToken = typeof window !== 'undefined' ? localStorage.getItem('gitguard_token') : null
    if (!currentToken) {
      router.push('/login')
      return null
    }
    return currentToken
  }

  const handleAnalyze = async () => {
    setError('')
    setResult(null)

    if (!repoUrl.trim()) {
      setError('Please enter a GitHub repository URL.')
      return
    }

    const authToken = ensureAuth()
    if (!authToken) return

    try {
      setIsLoading(true)

      const response = await fetch(`${apiBase}/api/repo/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ url: repoUrl.trim() }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        if (response.status === 401) {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('gitguard_token')
            localStorage.removeItem('gitguard_user')
          }
          router.push('/login')
          return
        }

        setError(data?.message || 'Analyze request failed.')
        return
      }

      setResult(data)
    } catch {
      setError('Unable to reach backend. Verify server is running and CORS is enabled.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-linear-to-br from-blue-950 via-slate-950 to-black px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">GitGuard Analyze</p>
          <h1 className="text-3xl font-bold sm:text-4xl">Repository Analyze Dashboard</h1>
          <p className="max-w-3xl text-blue-100">
            Submit a GitHub repository URL to run the backend analyzeRepository workflow from repo.controller.js.
          </p>
        </header>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md sm:p-6">
          <div className="flex flex-col gap-4 md:flex-row">
            <input
              type="url"
              value={repoUrl}
              onChange={(event) => setRepoUrl(event.target.value)}
              placeholder="https://github.com/owner/repo"
              className="w-full flex-1 rounded-xl border border-white/20 bg-black/30 px-4 py-3 text-white placeholder:text-blue-200/70 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/40"
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  handleAnalyze()
                }
              }}
            />
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={isLoading || !repoUrl.trim() || !token}
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? 'Analyzing...' : 'Analyze Repository'}
            </button>
          </div>

          {!token && (
            <p className="mt-4 rounded-lg border border-yellow-300/30 bg-yellow-400/10 px-3 py-2 text-sm text-yellow-100">
              You are not logged in. Please sign in first.
            </p>
          )}

          {error && (
            <p className="mt-4 rounded-lg border border-red-300/30 bg-red-400/10 px-3 py-2 text-sm text-red-100">{error}</p>
          )}
        </section>

        {result && (
          <section className="grid gap-6 lg:grid-cols-3">
            <article className="rounded-2xl border border-white/10 bg-white/5 p-5 lg:col-span-1">
              <p className="text-xs uppercase tracking-wide text-blue-200">Score</p>
              <p className="mt-2 text-4xl font-bold text-blue-300">{result.score?.value ?? '-'} / 100</p>
              <p className="mt-2 text-sm text-blue-100">Band: {result.score?.band ?? 'Unknown'}</p>
            </article>

            <article className="rounded-2xl border border-white/10 bg-white/5 p-5 lg:col-span-2">
              <p className="text-xs uppercase tracking-wide text-blue-200">Repository</p>
              <h2 className="mt-2 text-2xl font-semibold">{result.repo?.fullName ?? 'N/A'}</h2>
              <p className="mt-2 text-blue-100">{result.repo?.description || 'No description available.'}</p>
              {result.repo?.htmlUrl && (
                <a
                  href={result.repo.htmlUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-sm font-medium text-blue-300 hover:text-blue-200"
                >
                  Open repository
                </a>
              )}
            </article>

            <article className="rounded-2xl border border-white/10 bg-white/5 p-5 lg:col-span-3">
              <p className="text-xs uppercase tracking-wide text-blue-200">Summary</p>
              <p className="mt-3 leading-relaxed text-blue-100">{result.summary || 'No summary returned.'}</p>
            </article>

            <article className="rounded-2xl border border-white/10 bg-white/5 p-5 lg:col-span-3">
              <p className="text-xs uppercase tracking-wide text-blue-200">Snapshot</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                  <p className="text-xs text-blue-200">Files</p>
                  <p className="mt-1 text-lg font-semibold">{result.snapshot?.files?.fileCount ?? 0}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                  <p className="text-xs text-blue-200">Directories</p>
                  <p className="mt-1 text-lg font-semibold">{result.snapshot?.files?.directoryCount ?? 0}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                  <p className="text-xs text-blue-200">Contributors</p>
                  <p className="mt-1 text-lg font-semibold">{result.snapshot?.git?.contributors ?? 0}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                  <p className="text-xs text-blue-200">Commits (90d)</p>
                  <p className="mt-1 text-lg font-semibold">{result.snapshot?.git?.commitsLast90Days ?? 0}</p>
                </div>
              </div>
            </article>

            <article className="rounded-2xl border border-white/10 bg-white/5 p-5 lg:col-span-3">
              <p className="text-xs uppercase tracking-wide text-blue-200">Roadmap</p>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-blue-100">
                {(result.roadmap || []).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </section>
        )}
      </div>
    </main>
  )
}

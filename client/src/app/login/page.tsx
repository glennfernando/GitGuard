"use client"

import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getAuthToken, setAuthSession, validateAuthSession } from '@/lib/authSession'
import { getApiBaseUrl } from '@/lib/apiBase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSocialSubmitting, setIsSocialSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [nextPath, setNextPath] = useState('/analyze')

  const apiBase = getApiBaseUrl()
  const githubClientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || process.env.NEXT_PUBLIC_GITHUB_OAUTH_CLIENT_ID || ''
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID || ''
  const redirectUri = useMemo(() => {
    if (typeof window === 'undefined') return ''
    if (process.env.NEXT_PUBLIC_AUTH_REDIRECT_URI?.trim()) {
      return process.env.NEXT_PUBLIC_AUTH_REDIRECT_URI.trim()
    }
    return `${window.location.origin}/login`
  }, [])
  const validatedApiBase = apiBase

  const handleSocialResponse = async (endpoint: string, payload: Record<string, unknown>) => {
    setError('')
    setIsSocialSubmitting(true)
    try {
      const response = await fetch(`${apiBase}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        setError(data?.message || 'Social sign-in failed.')
        return
      }

      setAuthSession(data)
      router.push(nextPath)
    } catch {
      setError('Unable to reach the server for social sign-in.')
    } finally {
      setIsSocialSubmitting(false)
    }
  }

  useEffect(() => {
    if (typeof window === 'undefined') return

    const params = new URLSearchParams(window.location.search)
    const nextTarget = params.get('next')
    const redirectTo = nextTarget && nextTarget.startsWith('/') ? nextTarget : '/analyze'
    setNextPath(redirectTo)

    const code = params.get('code')
    const state = params.get('state')
    const providerError = params.get('error')
    const providerErrorDescription = params.get('error_description')
    const emailFromQuery = params.get('email')
    const passwordFromQuery = params.get('password')

    const checkSession = async () => {
      const currentToken = getAuthToken()
      if (!currentToken) return

      const valid = await validateAuthSession(validatedApiBase)
      if (valid) {
        router.replace('/analyze')
      }
    }
    checkSession()

    if (providerError) {
      const providerMessage = providerErrorDescription
        ? decodeURIComponent(providerErrorDescription.replace(/\+/g, ' '))
        : providerError
      setError(`OAuth sign-in failed: ${providerMessage}`)
      window.history.replaceState({}, document.title, '/login')
      return
    }

    if (emailFromQuery || passwordFromQuery) {
      if (emailFromQuery) setEmail(emailFromQuery)
      if (passwordFromQuery) setPassword(passwordFromQuery)
      window.history.replaceState({}, document.title, '/login')
    }

    if (code && state === 'github') {
      handleSocialResponse('/api/auth/github', { code, redirectUri })
      window.history.replaceState({}, document.title, '/login')
      return
    }

    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''))
    const accessToken = hashParams.get('access_token')
    const tokenState = hashParams.get('state')
    const hashError = hashParams.get('error')
    const hashErrorDescription = hashParams.get('error_description')
    if (hashError) {
      const providerMessage = hashErrorDescription
        ? decodeURIComponent(hashErrorDescription.replace(/\+/g, ' '))
        : hashError
      setError(`OAuth sign-in failed: ${providerMessage}`)
      window.history.replaceState({}, document.title, '/login')
      return
    }

    if (accessToken && tokenState === 'google') {
      handleSocialResponse('/api/auth/google', { access_token: accessToken })
      window.history.replaceState({}, document.title, '/login')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [redirectUri, router, validatedApiBase])

  const startGithubSignIn = () => {
    if (!githubClientId) {
      setError('GitHub sign-in is not configured. Set NEXT_PUBLIC_GITHUB_CLIENT_ID in client env.')
      return
    }

    const authUrl = new URL('https://github.com/login/oauth/authorize')
    authUrl.searchParams.set('client_id', githubClientId)
    authUrl.searchParams.set('redirect_uri', redirectUri)
    authUrl.searchParams.set('scope', 'read:user user:email')
    authUrl.searchParams.set('state', 'github')
    window.location.href = authUrl.toString()
  }

  const startGoogleSignIn = () => {
    if (!googleClientId) {
      setError('Google sign-in is not configured. Set NEXT_PUBLIC_GOOGLE_CLIENT_ID in client env.')
      return
    }

    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
    authUrl.searchParams.set('client_id', googleClientId)
    authUrl.searchParams.set('redirect_uri', redirectUri)
    authUrl.searchParams.set('response_type', 'token')
    authUrl.searchParams.set('scope', 'openid email profile')
    authUrl.searchParams.set('state', 'google')
    authUrl.searchParams.set('prompt', 'select_account')
    authUrl.searchParams.set('include_granted_scopes', 'true')
    window.location.href = authUrl.toString()
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    if (!email.trim() || !password.trim()) {
      setError('Email and password are required.')
      return
    }

    try {
      setIsSubmitting(true)

      const response = await fetch(`${apiBase}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        setError(data?.message || 'Login failed. Please try again.')
        return
      }

      setAuthSession(data)

      router.push(nextPath)
    } catch {
      setError('Unable to reach the server. Please check backend connectivity.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-linear-to-br from-[#060b18] via-[#0b1220] to-[#19153a] px-4 py-12 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-blue-500/25 blur-[120px]" />
        <div className="absolute -left-20 top-1/3 h-72 w-72 rounded-full bg-cyan-500/15 blur-[110px]" />
      </div>
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-6xl items-center justify-center">
        <section className="relative grid w-full overflow-hidden rounded-3xl border border-blue-400/20 bg-linear-to-br from-white/8 via-white/5 to-white/3 shadow-[0_24px_90px_rgba(9,20,50,0.5)] backdrop-blur-xl lg:grid-cols-2">
          <div className="hidden bg-linear-to-br from-[#0a1935] via-[#0f2c5f] to-[#134286] p-10 text-white lg:flex lg:flex-col lg:justify-between">
            <div>
              <p className="inline-flex rounded-full border border-blue-300/35 bg-blue-400/10 px-3 py-1 text-xs font-semibold tracking-[0.18em] text-blue-100">
                GITGUARD ACCESS
              </p>
              <h1
                className="mt-6 text-4xl font-bold leading-tight"
                style={{ fontFamily: 'var(--font-black-ops-one)' }}
              >
                Welcome back to your security workspace.
              </h1>
              <p className="mt-4 max-w-md text-blue-100/90">
                Continue scanning repositories, review malware risk verdicts, and monitor critical alerts from one place.
              </p>
            </div>
            <p className="text-sm text-blue-100/85">Protecting open-source workflows, one scan at a time.</p>
          </div>

          <div className="p-7 sm:p-10 lg:p-12">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">Sign In</p>
            <h2
              className="mt-3 text-3xl font-bold text-white"
              style={{ fontFamily: 'var(--font-black-ops-one)' }}
            >
              Log in to GitGuard
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              Do not have an account?{' '}
              <Link href="/signup" className="font-semibold text-blue-300 hover:text-blue-200">
                Create one
              </Link>
            </p>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-200">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  autoComplete="email"
                  className="w-full rounded-xl border border-blue-300/25 bg-[#0b1730]/70 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20"
                  placeholder="you@company.com"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium text-slate-200">
                    Password
                  </label>
                  <Link href="#" className="text-sm font-medium text-blue-300 hover:text-blue-200">
                    Forgot password?
                  </Link>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-blue-300/25 bg-[#0b1730]/70 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/20"
                  placeholder="Enter your password"
                />
              </div>

              {error && (
                <p className="rounded-lg border border-red-500/35 bg-red-500/12 px-3 py-2 text-sm text-red-200">{error}</p>
              )}

              <label className="flex items-center gap-3 text-sm text-slate-300">
                <input type="checkbox" name="remember" className="h-4 w-4 rounded border-blue-300/30 bg-[#0b1730]/70 text-blue-400" />
                Keep me signed in
              </label>

              <button
                type="submit"
                disabled={isSubmitting || isSocialSubmitting}
                className="w-full rounded-xl border border-blue-300/45 bg-linear-to-r from-blue-600 to-blue-500 px-4 py-3 text-base font-semibold text-white shadow-[0_10px_28px_rgba(37,99,235,0.4)] transition hover:from-blue-500 hover:to-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? 'Signing in...' : 'Log In'}
              </button>

              <div className="relative py-1">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/15"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-[#0b1220] px-3 text-slate-400">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={startGoogleSignIn}
                  disabled={isSubmitting || isSocialSubmitting}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-300/25 bg-[#0b1730]/70 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-blue-300/45 hover:bg-[#102043] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="text-base">G</span>
                  Google
                </button>

                <button
                  type="button"
                  onClick={startGithubSignIn}
                  disabled={isSubmitting || isSocialSubmitting}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-300/25 bg-[#0b1730]/70 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-blue-300/45 hover:bg-[#102043] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-[#0a101f] text-xs font-bold text-white">GH</span>
                  GitHub
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  )
}

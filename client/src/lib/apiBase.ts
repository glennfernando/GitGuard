function stripTrailingSlashes(url: string): string {
  return String(url || "").trim().replace(/\/+$/, "")
}

function isLoopbackHost(value: string): boolean {
  const host = String(value || "").trim().toLowerCase()
  return host === "localhost" || host === "127.0.0.1" || host === "::1"
}

const DEFAULT_DEPLOYED_API_BASE_URL = 'https://gitguard.onrender.com'
const DEFAULT_DEVELOPMENT_API_BASE_URL = 'http://localhost:5000'

export function getApiBaseUrl(): string {
  const envBaseDevelopment = stripTrailingSlashes(process.env.NEXT_PUBLIC_API_BASE_URL_DEV || '')
  const envBaseProduction = stripTrailingSlashes(process.env.NEXT_PUBLIC_API_BASE_URL_PROD || '')
  const envBaseLegacy = stripTrailingSlashes(
    process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || '',
  )
  const defaultByEnv = process.env.NODE_ENV === 'production'
    ? (envBaseProduction || DEFAULT_DEPLOYED_API_BASE_URL)
    : (envBaseDevelopment || DEFAULT_DEVELOPMENT_API_BASE_URL)
  const envBase = envBaseLegacy || defaultByEnv

  if (typeof window === 'undefined') {
    return envBase
  }

  const currentHost = window.location.hostname

  // If frontend is opened from LAN IP, never force localhost backend.
  if (envBase) {
    try {
      const envUrl = new URL(envBase)
      if (!isLoopbackHost(currentHost) && isLoopbackHost(envUrl.hostname)) {
        return `${envUrl.protocol}//${currentHost}${envUrl.port ? `:${envUrl.port}` : ''}`
      }
      return envBase
    } catch {
      // If malformed env URL, fall through to safe default.
    }
  }

  if (isLoopbackHost(currentHost)) {
    return `http://${currentHost}:5000`
  }

  return envBaseProduction || DEFAULT_DEPLOYED_API_BASE_URL
}

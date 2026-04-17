import Link from 'next/link'

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-6xl items-center justify-center">
        <section className="grid w-full overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-[0_20px_80px_rgba(0,60,140,0.14)] lg:grid-cols-2">
          <div className="hidden bg-linear-to-br from-blue-700 via-blue-600 to-cyan-500 p-10 text-white lg:flex lg:flex-col lg:justify-between">
            <div>
              <p className="inline-flex rounded-full border border-white/30 px-3 py-1 text-xs font-semibold tracking-[0.18em]">
                GITGUARD ACCESS
              </p>
              <h1 className="mt-6 text-4xl font-bold leading-tight">
                Welcome back to your security workspace.
              </h1>
              <p className="mt-4 max-w-md text-blue-100">
                Continue scanning repositories, review malware risk verdicts, and monitor critical alerts from one place.
              </p>
            </div>
            <p className="text-sm text-blue-100">Protecting open-source workflows, one scan at a time.</p>
          </div>

          <div className="p-7 sm:p-10 lg:p-12">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Sign In</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900">Log in to GitGuard</h2>
            <p className="mt-2 text-sm text-slate-600">
              Do not have an account?{' '}
              <Link href="/signup" className="font-semibold text-blue-600 hover:text-blue-700">
                Create one
              </Link>
            </p>

            <form className="mt-8 space-y-5" action="#" method="post">
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-800">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  placeholder="you@company.com"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium text-slate-800">
                    Password
                  </label>
                  <Link href="#" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                    Forgot password?
                  </Link>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  placeholder="Enter your password"
                />
              </div>

              <label className="flex items-center gap-3 text-sm text-slate-700">
                <input type="checkbox" name="remember" className="h-4 w-4 rounded border-slate-300 text-blue-600" />
                Keep me signed in
              </label>

              <button
                type="submit"
                className="w-full rounded-xl bg-blue-600 px-4 py-3 text-base font-semibold text-white transition hover:bg-blue-700"
              >
                Log In
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  )
}

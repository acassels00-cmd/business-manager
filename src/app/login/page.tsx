import { login } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const params = await searchParams;
  const hasError = params.error === "1";
  const next = params.next || "/";

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-950 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500 text-2xl font-bold text-white">
            GW
          </div>
          <h1 className="text-xl font-semibold text-white">Gator Wash Solutions</h1>
          <p className="mt-1 text-sm text-brand-200">Business Manager</p>
        </div>
        <form action={login} className="card p-6 space-y-4">
          <input type="hidden" name="next" value={next} />
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-ink-700 mb-1.5">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoFocus
              className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              placeholder="Enter password"
            />
          </div>
          {hasError && (
            <p className="text-sm text-red-600">Incorrect password. Try again.</p>
          )}
          <button
            type="submit"
            className="w-full rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-700 transition"
          >
            Sign in
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-brand-300">
          Set APP_PASSWORD in your environment to change this password.
        </p>
      </div>
    </div>
  );
}

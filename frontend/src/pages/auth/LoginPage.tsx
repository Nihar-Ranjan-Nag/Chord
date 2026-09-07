import {
  Eye,
  EyeOff,
  LockKeyhole,
  LogIn,
  Mail,
  ShieldCheck,
  Sparkles,
  UserPlus,
  UsersRound,
} from 'lucide-react'

import {
  FormEvent,
  useState,
} from 'react'

import {
  Link,
  useNavigate,
} from 'react-router-dom'

import {
  roleHome,
  useAuth,
} from '@/features/auth/AuthContext'

import { AuthShell } from '@/components/layout/AuthShell'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [showPassword, setShowPassword] =
    useState(false)

  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const { login } = useAuth()

  const navigate = useNavigate()

  async function submit(e: FormEvent) {
    e.preventDefault()

    setError('')
    setBusy(true)

    try {
      const user = await login(
        email.trim(),
        password
      )

      navigate(
        roleHome(user.role),
        {
          replace: true,
        }
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Login failed'
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthShell
      title={
        <>
          Your campus.
          <br />

          Your voice.
          <br />

          <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
            Your impact.
          </span>
        </>
      }
      description="Discover events, connect with your community, earn points and turn every participation into something meaningful."
    >
      <form
        onSubmit={submit}
        className="w-full"
      >
        {/* HEADER */}
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-violet-500/10 text-violet-400">
              <Sparkles size={13} />
            </span>

            <span className="text-[9px] font-extrabold tracking-[0.14em] text-violet-400">
              WELCOME BACK
            </span>
          </div>

          <h2 className="mt-3 text-[23px] font-black leading-tight tracking-[-0.025em] text-white min-[380px]:text-[26px] sm:text-[32px]">
            Sign in to{' '}

            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              CHORD
            </span>
          </h2>

          <p className="mt-1.5 text-[9.5px] leading-[16px] text-slate-500 min-[380px]:text-[10px] sm:text-[12px] sm:leading-5">
            Continue your journey, explore opportunities
            and make every campus moment count.
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/[0.08] px-3 py-2.5 text-[10px] leading-5 text-red-300">
            {error}
          </div>
        )}

        {/* FIELDS */}
        <div className="mt-5 space-y-4">
          {/* EMAIL */}
          <label className="block">
            <span className="mb-1.5 block text-[10px] font-bold text-slate-300">
              Email address
            </span>

            <div
              className="
                group
                flex h-11
                items-center
                gap-2.5
                rounded-xl
                border border-white/[0.08]
                bg-white/[0.035]
                px-3
                transition-all

                focus-within:border-violet-500/40
                focus-within:bg-white/[0.05]
                focus-within:ring-4
                focus-within:ring-violet-500/[0.07]
              "
            >
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-violet-500/[0.08] text-slate-500 transition group-focus-within:text-violet-400">
                <Mail size={14} />
              </span>

              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={e =>
                  setEmail(e.target.value)
                }
                placeholder="you@example.com"
                className="min-w-0 flex-1 bg-transparent text-[11px] text-white outline-none placeholder:text-slate-600 sm:text-sm"
              />
            </div>
          </label>

          {/* PASSWORD */}
          <label className="block">
            <div className="mb-1.5 flex items-center justify-between gap-3">
              <span className="text-[10px] font-bold text-slate-300">
                Password
              </span>

              <Link
                to="/forgot-password"
                className="text-[9px] font-bold text-violet-400 transition hover:text-violet-300"
              >
                Forgot password?
              </Link>
            </div>

            <div
              className="
                group
                flex h-11
                items-center
                gap-2.5
                rounded-xl
                border border-white/[0.08]
                bg-white/[0.035]
                px-3
                transition-all

                focus-within:border-violet-500/40
                focus-within:bg-white/[0.05]
                focus-within:ring-4
                focus-within:ring-violet-500/[0.07]
              "
            >
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-violet-500/[0.08] text-slate-500 transition group-focus-within:text-violet-400">
                <LockKeyhole size={14} />
              </span>

              <input
                type={
                  showPassword
                    ? 'text'
                    : 'password'
                }
                required
                autoComplete="current-password"
                value={password}
                onChange={e =>
                  setPassword(e.target.value)
                }
                placeholder="Enter your password"
                className="min-w-0 flex-1 bg-transparent text-[11px] text-white outline-none placeholder:text-slate-600 sm:text-sm"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(value => !value)
                }
                aria-label={
                  showPassword
                    ? 'Hide password'
                    : 'Show password'
                }
                className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-slate-500 transition hover:bg-white/[0.05] hover:text-violet-400"
              >
                {showPassword ? (
                  <EyeOff size={15} />
                ) : (
                  <Eye size={15} />
                )}
              </button>
            </div>
          </label>
        </div>

        {/* SIGN IN */}
        <button
          type="submit"
          disabled={busy}
          className="
            mt-5
            flex h-11
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-gradient-to-r
            from-violet-600
            via-purple-600
            to-fuchsia-600
            px-5
            text-[11px]
            font-extrabold
            text-white
            shadow-[0_0_30px_rgba(124,58,237,0.28)]
            transition-all
            hover:-translate-y-0.5
            disabled:cursor-not-allowed
            disabled:opacity-60
            sm:h-12
            sm:text-sm
          "
        >
          {busy ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

              Signing in...
            </>
          ) : (
            <>
              <LogIn size={15} />

              Sign in
            </>
          )}
        </button>

        {/* SECURITY */}
        <div className="mt-2.5 flex items-center justify-center gap-1.5 text-[8px] font-medium text-slate-600">
          <ShieldCheck
            size={11}
            className="text-emerald-500/80"
          />

          Secure account access
        </div>

        {/* DIVIDER */}
        <div className="my-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/[0.06]" />

          <span className="text-[8px] font-semibold uppercase tracking-[0.1em] text-slate-600">
            New to CHORD?
          </span>

          <div className="h-px flex-1 bg-white/[0.06]" />
        </div>

        {/* REGISTRATION */}
        <div className="grid grid-cols-2 gap-2.5">
          <Link
            to="/register"
            className="
              flex min-h-[58px]
              items-center
              gap-2
              rounded-xl
              border border-violet-500/15
              bg-violet-500/[0.05]
              px-2.5
              transition
              hover:bg-violet-500/[0.08]
            "
          >
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-violet-500/10 text-violet-400">
              <UserPlus size={14} />
            </span>

            <span className="min-w-0">
              <span className="block text-[8.5px] font-extrabold text-white min-[380px]:text-[9px]">
                User Signup
              </span>

              <span className="mt-0.5 block text-[7px] text-slate-600">
                Join CHORD
              </span>
            </span>
          </Link>

          <Link
            to="/organizer/register"
            className="
              flex min-h-[58px]
              items-center
              gap-2
              rounded-xl
              border border-blue-500/15
              bg-blue-500/[0.04]
              px-2.5
              transition
              hover:bg-blue-500/[0.07]
            "
          >
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-blue-500/10 text-blue-400">
              <UsersRound size={14} />
            </span>

            <span className="min-w-0">
              <span className="block text-[8.5px] font-extrabold text-white min-[380px]:text-[9px]">
                Organizer
              </span>

              <span className="mt-0.5 block text-[7px] text-slate-600">
                Create events
              </span>
            </span>
          </Link>
        </div>

        {/* HOME */}
        <p className="mt-4 text-center text-[8.5px] text-slate-600 lg:hidden">
          Want to explore first?{' '}

          <Link
            to="/"
            className="font-bold text-violet-400"
          >
            Go to CHORD home
          </Link>
        </p>
      </form>
    </AuthShell>
  )
}
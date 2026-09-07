import {
  CalendarDays,
  Eye,
  EyeOff,
  GraduationCap,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  UserRound,
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

import { AuthShell } from '@/components/layout/AuthShell'
import { useAuth } from '@/features/auth/AuthContext'

export function UserRegisterPage() {
  const { registerUser } = useAuth()

  const navigate = useNavigate()

  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const [showPassword, setShowPassword] =
    useState(false)

  const [form, setForm] = useState({
    name: '',
    email: '',
    dateOfBirth: '',
    password: '',
    college: '',
  })

  const change = (
    key: keyof typeof form,
    value: string
  ) => {
    setForm(current => ({
      ...current,
      [key]: value,
    }))
  }

  async function submit(event: FormEvent) {
    event.preventDefault()

    setBusy(true)
    setError('')

    try {
      await registerUser({
        name:
          form.name.trim(),

        email:
          form.email.trim(),

        dateOfBirth:
          form.dateOfBirth,

        password:
          form.password,

        college:
          form.college.trim() || undefined,
      })

      navigate(
        '/dashboard',
        {
          replace: true,
        }
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Registration failed'
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthShell
      title={
        <>
          Join the community.
          <br />

          Find your people.
          <br />

          <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
            Make it count.
          </span>
        </>
      }
      description="Discover activities, participate in experiences, earn verified points and unlock rewards with CHORD."
    >
      <form
        onSubmit={submit}
        className="w-full"
      >
        {/* =================================================
            HEADER
        ================================================= */}
        <div>
          <div
            className="
              inline-flex
              items-center
              gap-2
              rounded-full

              border
              border-violet-500/15

              bg-violet-500/[0.06]

              px-3
              py-1.5

              text-[8px]
              font-extrabold
              tracking-[0.12em]
              text-violet-300

              min-[380px]:text-[9px]

              sm:text-[10px]
            "
          >
            <UserRound size={13} />

            USER REGISTRATION
          </div>

          <h2
            className="
              mt-3
              text-[23px]
              font-black
              leading-tight
              tracking-[-0.025em]
              text-white

              min-[380px]:text-[26px]

              sm:text-[32px]
            "
          >
            Create your{' '}

            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              CHORD account
            </span>
          </h2>

          <p
            className="
              mt-1.5
              text-[9.5px]
              leading-[16px]
              text-slate-500

              min-[380px]:text-[10px]

              sm:text-[12px]
              sm:leading-5
            "
          >
            Get started with the essentials.
            You can complete your profile anytime.
          </p>
        </div>

        {/* =================================================
            ERROR
        ================================================= */}
        {error && (
          <div
            className="
              mt-4
              rounded-xl
              border
              border-red-500/20
              bg-red-500/[0.08]
              px-3
              py-2.5
              text-[10px]
              leading-5
              text-red-300

              sm:px-4
              sm:text-xs
            "
          >
            {error}
          </div>
        )}

        {/* =================================================
            FORM
        ================================================= */}
        <div className="mt-5 space-y-4 sm:mt-6">
          {/* FULL NAME */}
          <label className="block">
            <span className="mb-1.5 block text-[10px] font-bold text-slate-300 sm:text-xs">
              Full name
            </span>

            <div
              className="
                group
                flex h-11
                items-center
                gap-2.5
                rounded-xl

                border
                border-white/[0.08]

                bg-white/[0.035]

                px-3

                transition-all

                focus-within:border-violet-500/40
                focus-within:bg-white/[0.05]
                focus-within:ring-4
                focus-within:ring-violet-500/[0.06]

                sm:h-12
              "
            >
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-violet-500/[0.08] text-slate-500 transition group-focus-within:text-violet-400">
                <UserRound size={14} />
              </span>

              <input
                type="text"
                required
                autoComplete="name"
                value={form.name}
                onChange={event =>
                  change(
                    'name',
                    event.target.value
                  )
                }
                placeholder="Enter your full name"
                className="
                  min-w-0
                  flex-1
                  bg-transparent
                  text-[11px]
                  text-white
                  outline-none
                  placeholder:text-slate-600
                  sm:text-sm
                "
              />
            </div>
          </label>

          {/* EMAIL */}
          <label className="block">
            <span className="mb-1.5 block text-[10px] font-bold text-slate-300 sm:text-xs">
              Email address
            </span>

            <div
              className="
                group
                flex h-11
                items-center
                gap-2.5
                rounded-xl

                border
                border-white/[0.08]

                bg-white/[0.035]

                px-3

                transition-all

                focus-within:border-blue-500/40
                focus-within:bg-white/[0.05]
                focus-within:ring-4
                focus-within:ring-blue-500/[0.06]

                sm:h-12
              "
            >
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-blue-500/[0.08] text-slate-500 transition group-focus-within:text-blue-400">
                <Mail size={14} />
              </span>

              <input
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={event =>
                  change(
                    'email',
                    event.target.value
                  )
                }
                placeholder="you@example.com"
                className="
                  min-w-0
                  flex-1
                  bg-transparent
                  text-[11px]
                  text-white
                  outline-none
                  placeholder:text-slate-600
                  sm:text-sm
                "
              />
            </div>
          </label>

          {/* =================================================
              DATE + COLLEGE

              MOBILE = STACKED
              TABLET+ = 2 COLUMNS
          ================================================= */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* DATE */}
            <label className="block min-w-0">
              <span className="mb-1.5 block text-[10px] font-bold text-slate-300 sm:text-xs">
                Date of birth
              </span>

              <div
                className="
                  group
                  flex h-11
                  min-w-0
                  items-center
                  gap-2
                  rounded-xl

                  border
                  border-white/[0.08]

                  bg-white/[0.035]

                  px-3

                  transition-all

                  focus-within:border-fuchsia-500/40
                  focus-within:bg-white/[0.05]

                  sm:h-12
                "
              >
                <CalendarDays
                  size={14}
                  className="shrink-0 text-fuchsia-400"
                />

                <input
                  type="date"
                  required
                  max={
                    new Date()
                      .toISOString()
                      .slice(0, 10)
                  }
                  value={form.dateOfBirth}
                  onChange={event =>
                    change(
                      'dateOfBirth',
                      event.target.value
                    )
                  }
                  className="
                    min-w-0
                    flex-1
                    bg-transparent
                    text-[10px]
                    text-slate-300
                    outline-none
                    [color-scheme:dark]
                    sm:text-xs
                  "
                />
              </div>
            </label>

            {/* COLLEGE */}
            <label className="block min-w-0">
              <span className="mb-1.5 block text-[10px] font-bold text-slate-300 sm:text-xs">
                College{' '}

                <span className="font-medium text-slate-600">
                  (optional)
                </span>
              </span>

              <div
                className="
                  group
                  flex h-11
                  min-w-0
                  items-center
                  gap-2
                  rounded-xl

                  border
                  border-white/[0.08]

                  bg-white/[0.035]

                  px-3

                  transition-all

                  focus-within:border-blue-500/40
                  focus-within:bg-white/[0.05]

                  sm:h-12
                "
              >
                <GraduationCap
                  size={14}
                  className="shrink-0 text-blue-400"
                />

                <input
                  type="text"
                  value={form.college}
                  onChange={event =>
                    change(
                      'college',
                      event.target.value
                    )
                  }
                  placeholder="College / Institution"
                  className="
                    min-w-0
                    flex-1
                    bg-transparent
                    text-[10px]
                    text-white
                    outline-none
                    placeholder:text-slate-600
                    sm:text-xs
                  "
                />
              </div>
            </label>
          </div>

          {/* PASSWORD */}
          <label className="block">
            <span className="mb-1.5 block text-[10px] font-bold text-slate-300 sm:text-xs">
              Password
            </span>

            <div
              className="
                group
                flex h-11
                items-center
                gap-2.5
                rounded-xl

                border
                border-white/[0.08]

                bg-white/[0.035]

                px-3

                transition-all

                focus-within:border-violet-500/40
                focus-within:bg-white/[0.05]
                focus-within:ring-4
                focus-within:ring-violet-500/[0.06]

                sm:h-12
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
                minLength={8}
                autoComplete="new-password"
                value={form.password}
                onChange={event =>
                  change(
                    'password',
                    event.target.value
                  )
                }
                placeholder="Minimum 8 characters"
                className="
                  min-w-0
                  flex-1
                  bg-transparent
                  text-[11px]
                  text-white
                  outline-none
                  placeholder:text-slate-600
                  sm:text-sm
                "
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

        {/* =================================================
            SECURITY
        ================================================= */}
        <div
          className="
            mt-4
            flex
            items-start
            gap-2.5
            rounded-xl

            border
            border-emerald-500/10

            bg-emerald-500/[0.035]

            px-3
            py-2.5

            text-[9px]
            leading-[16px]
            text-slate-400

            sm:rounded-2xl
            sm:px-4
            sm:py-3
            sm:text-[11px]
            sm:leading-5
          "
        >
          <ShieldCheck
            size={15}
            className="mt-0.5 shrink-0 text-emerald-400"
          />

          <p>
            Your account is created as a standard CHORD
            user. Administrative access cannot be
            self-registered.
          </p>
        </div>

        {/* =================================================
            SUBMIT
        ================================================= */}
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

            text-[11px]
            font-extrabold
            text-white

            shadow-[0_0_30px_rgba(124,58,237,0.28)]

            transition-all

            hover:-translate-y-0.5
            hover:shadow-[0_0_40px_rgba(124,58,237,0.4)]

            disabled:cursor-not-allowed
            disabled:opacity-60

            sm:h-12
            sm:text-sm
          "
        >
          {busy ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

              Creating account...
            </>
          ) : (
            <>
              <UserRound size={15} />

              Create user account
            </>
          )}
        </button>

        {/* =================================================
            LINKS
        ================================================= */}
        <div className="mt-4 space-y-2 text-center text-[9px] text-slate-600 sm:mt-5 sm:text-[11px]">
          <p>
            Already registered?{' '}

            <Link
              to="/login"
              className="font-bold text-violet-400 transition hover:text-violet-300"
            >
              Sign in
            </Link>
          </p>

          <p>
            Represent an organization?{' '}

            <Link
              to="/organizer/register"
              className="font-bold text-blue-400 transition hover:text-blue-300"
            >
              Create organizer account
            </Link>
          </p>
        </div>
      </form>
    </AuthShell>
  )
}
import {
  Building2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  UserRound,
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

export function OrganizerRegisterPage() {
  const { registerOrganizer } = useAuth()

  const navigate = useNavigate()

  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const [showPassword, setShowPassword] =
    useState(false)

  const [form, setForm] = useState({
    organizationName: '',
    email: '',
    password: '',
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
      await registerOrganizer({
        organizationName:
          form.organizationName.trim(),

        email:
          form.email.trim(),

        password:
          form.password,
      })

      navigate(
        '/organizer',
        {
          replace: true,
        }
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Organizer registration failed'
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthShell
      title={
        <>
          Create experiences.
          <br />

          Build community.
          <br />

          <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
            Make an impact.
          </span>
        </>
      }
      description="Create events, connect with participants and build meaningful experiences through CHORD."
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
              border-blue-500/15
              bg-blue-500/[0.06]
              px-3
              py-1.5
              text-[8px]
              font-extrabold
              tracking-[0.12em]
              text-blue-300
              min-[380px]:text-[9px]
              sm:text-[10px]
            "
          >
            <Building2 size={13} />

            ORGANIZER REGISTRATION
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

            <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              organizer account
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
            For clubs, institutions, communities and
            teams that want to create and manage
            meaningful events.
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
          {/* ORGANIZATION */}
          <label className="block">
            <span className="mb-1.5 block text-[10px] font-bold text-slate-300 sm:text-xs">
              Organization name
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
              <span
                className="
                  grid h-7 w-7
                  shrink-0
                  place-items-center
                  rounded-lg

                  bg-blue-500/[0.08]
                  text-slate-500

                  transition

                  group-focus-within:text-blue-400
                "
              >
                <Building2 size={14} />
              </span>

              <input
                type="text"
                required
                autoComplete="organization"
                value={form.organizationName}
                onChange={event =>
                  change(
                    'organizationName',
                    event.target.value
                  )
                }
                placeholder="Enter organization name"
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
              Organization email
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
              <span
                className="
                  grid h-7 w-7
                  shrink-0
                  place-items-center
                  rounded-lg

                  bg-violet-500/[0.08]
                  text-slate-500

                  transition

                  group-focus-within:text-violet-400
                "
              >
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
                placeholder="team@organization.com"
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

                focus-within:border-fuchsia-500/40
                focus-within:bg-white/[0.05]
                focus-within:ring-4
                focus-within:ring-fuchsia-500/[0.06]

                sm:h-12
              "
            >
              <span
                className="
                  grid h-7 w-7
                  shrink-0
                  place-items-center
                  rounded-lg

                  bg-fuchsia-500/[0.07]
                  text-slate-500

                  transition

                  group-focus-within:text-fuchsia-400
                "
              >
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
                className="
                  grid h-8 w-8
                  shrink-0
                  place-items-center
                  rounded-lg
                  text-slate-500
                  transition
                  hover:bg-white/[0.05]
                  hover:text-violet-400
                "
              >
                {showPassword ? (
                  <EyeOff size={15} />
                ) : (
                  <Eye size={15} />
                )}
              </button>
            </div>

            <p className="mt-1.5 text-[8px] text-slate-600 sm:text-[9px]">
              Use at least 8 characters.
            </p>
          </label>
        </div>

        {/* =================================================
            INFO
        ================================================= */}
        <div
          className="
            mt-4
            flex
            items-start
            gap-2.5
            rounded-xl

            border
            border-blue-500/10

            bg-blue-500/[0.04]

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
            className="mt-0.5 shrink-0 text-blue-400"
          />

          <p>
            Your organizer workspace lets you create
            events, manage participants and oversee
            community activities.
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
            from-blue-600
            via-violet-600
            to-fuchsia-600

            px-4

            text-[11px]
            font-extrabold
            text-white

            shadow-[0_0_30px_rgba(99,102,241,0.25)]

            transition-all

            hover:-translate-y-0.5
            hover:shadow-[0_0_40px_rgba(124,58,237,0.36)]

            disabled:cursor-not-allowed
            disabled:opacity-60

            sm:h-12
            sm:text-sm
          "
        >
          {busy ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />

              Creating organizer...
            </>
          ) : (
            <>
              <Building2 size={15} />

              Create organizer account
            </>
          )}
        </button>

        {/* =================================================
            BOTTOM LINKS
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
            Joining as a participant?{' '}

            <Link
              to="/register"
              className="font-bold text-blue-400 transition hover:text-blue-300"
            >
              Create user account
            </Link>
          </p>
        </div>
      </form>
    </AuthShell>
  )
}
import {
  Award,
  BarChart3,
  Bell,
  BookMarked,
  BookOpen,
  Building2,
  CalendarDays,
  CalendarPlus,
  Coins,
  Gift,
  LayoutDashboard,
  LogOut,
  Menu,
  PackageCheck,
  Trophy,
  UserRound,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react'

import {
  NavLink,
  Outlet,
  useNavigate,
} from 'react-router-dom'

import { useState } from 'react'

import { Logo } from '@/components/common/Logo'
import { UserAvatar } from '@/components/common/UserAvatar'

import { useAuth } from '@/features/auth/AuthContext'

import type { Role } from '@/types'

type PortalMode = Role

export function PortalLayout({
  mode = 'user',
}: {
  mode?: PortalMode
}) {
  const {
    user,
    logout,
  } = useAuth()

  const navigate = useNavigate()

  const [open, setOpen] = useState(false)

  /* ==========================================================
     USER MENU
  ========================================================== */

  const userItems = [
    ['/dashboard', 'Dashboard', LayoutDashboard],
    ['/dashboard/events', 'Explore events', CalendarDays],
    ['/dashboard/my-events', 'My events', Award],
    ['/dashboard/books', 'Borrow books', BookOpen],
    ['/dashboard/my-books', 'My books', BookMarked],
    ['/dashboard/points', 'Points wallet', Coins],
    ['/dashboard/rewards', 'Rewards', Gift],
    ['/dashboard/leaderboard', 'Leaderboard', Trophy],
    ['/dashboard/notifications', 'Notifications', Bell],
    ['/dashboard/profile', 'Profile', UserRound],
  ] as const

  /* ==========================================================
     ORGANIZER MENU
  ========================================================== */

  const organizerItems = [
    ['/organizer', 'Overview', LayoutDashboard],
    ['/organizer/events', 'My events', CalendarDays],
    ['/organizer/events/create', 'Create event', CalendarPlus],
    ['/organizer/books', 'Books', BookOpen],
    ['/organizer/borrows', 'Borrow & returns', BookMarked],
    ['/organizer/profile', 'Profile', Building2],
  ] as const

  /* ==========================================================
     ADMIN MENU
  ========================================================== */

  const adminItems = [
    ['/admin', 'Overview', LayoutDashboard],
    ['/admin/users', 'Users', Users],
    ['/admin/organizers', 'Organizers', Building2],
    ['/admin/events', 'All events', CalendarDays],
    ['/admin/events/create', 'Create event', CalendarPlus],
    ['/admin/books', 'Books', BookOpen],
    ['/admin/borrows', 'Borrow & returns', BookMarked],
    ['/admin/rewards', 'Rewards', Gift],
    ['/admin/redemptions', 'Redemptions', PackageCheck],
    ['/admin/reports', 'Reports', BarChart3],
  ] as const

  const items: ReadonlyArray<
    readonly [string, string, LucideIcon]
  > =
    mode === 'admin'
      ? adminItems
      : mode === 'organizer'
        ? organizerItems
        : userItems

  const base =
    mode === 'admin'
      ? '/admin'
      : mode === 'organizer'
        ? '/organizer'
        : '/dashboard'

  const section =
    mode === 'admin'
      ? 'ADMIN CONSOLE'
      : mode === 'organizer'
        ? 'ORGANIZER SPACE'
        : 'USER SPACE'

  const subtitle =
    mode === 'admin'
      ? 'Administrator'
      : mode === 'organizer'
        ? 'Organizer'
        : `${user?.points ?? 0} points`

  async function signOut() {
    await logout()
    navigate('/')
  }

  return (
    <div
      className="
        relative
        min-h-screen

        bg-[#050818]

        text-white
      "
    >
      {/* ======================================================
          BACKGROUND
      ====================================================== */}
      <div
        className="
          pointer-events-none
          fixed
          inset-0
          z-0
        "
      >
        <div
          className="
            absolute
            -left-[170px]
            top-[80px]

            h-[390px]
            w-[390px]

            rounded-full

            bg-violet-700/[0.07]

            blur-[120px]
          "
        />

        <div
          className="
            absolute
            -right-[170px]
            top-[45%]

            h-[430px]
            w-[430px]

            rounded-full

            bg-fuchsia-700/[0.05]

            blur-[130px]
          "
        />
      </div>

      {/* ======================================================
          MOBILE BACKDROP
      ====================================================== */}
      {open && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setOpen(false)}
          className="
            fixed
            inset-0
            z-40

            bg-black/70

            backdrop-blur-[2px]

            lg:hidden
          "
        />
      )}

      {/* ======================================================
          SIDEBAR
      ====================================================== */}
      <aside
        className={`
          fixed
          inset-y-0
          left-0
          z-50

          flex

          w-[82%]
          max-w-[310px]

          flex-col

          border-r
          border-white/[0.07]

          bg-gradient-to-b
          from-[#090d20]
          via-[#080b1d]
          to-[#050818]

          shadow-[20px_0_60px_rgba(0,0,0,0.45)]

          transition-transform
          duration-300
          ease-out

          lg:w-[270px]
          lg:max-w-none
          lg:translate-x-0

          ${
            open
              ? 'translate-x-0'
              : '-translate-x-full'
          }
        `}
      >
        {/* ==================================================
            SIDEBAR LOGO
        ================================================== */}
        <div
          className="
            flex
            h-[68px]
            shrink-0
            items-center
            justify-between

            border-b
            border-white/[0.06]

            px-4
          "
        >
          <Logo to={base} />

          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="
              grid
              h-9
              w-9
              place-items-center

              rounded-xl

              border
              border-white/[0.07]

              bg-white/[0.03]

              text-slate-300

              transition

              hover:border-violet-500/30
              hover:bg-violet-500/10
              hover:text-white

              lg:hidden
            "
          >
            <X size={19} />
          </button>
        </div>

        {/* ==================================================
            MOBILE PROFILE

            Visible only on mobile/tablet.
            Hidden on desktop.
        ================================================== */}
        <div
          className="
            shrink-0

            border-b
            border-white/[0.06]

            px-3
            py-3

            lg:hidden
          "
        >
          <div
            className="
              flex
              items-center
              gap-3

              rounded-xl

              border
              border-violet-500/[0.12]

              bg-gradient-to-r
              from-violet-500/[0.10]
              via-fuchsia-500/[0.045]
              to-transparent

              p-3
            "
          >
            <UserAvatar
              name={user?.name}
              src={user?.avatar}
              size="md"
              className="
                shrink-0

                border-2
                border-violet-400/25

                shadow-[0_6px_20px_rgba(0,0,0,0.35)]

                ring-1
                ring-white/[0.06]
              "
            />

            <div className="min-w-0">
              <strong
                className="
                  block
                  truncate

                  text-[12px]
                  font-extrabold

                  text-white
                "
              >
                {user?.name || 'User'}
              </strong>

              <small
                className="
                  mt-1
                  block
                  truncate

                  text-[9px]
                  font-semibold

                  text-violet-300
                "
              >
                {subtitle}
              </small>
            </div>
          </div>
        </div>

        {/* ==================================================
            SECTION
        ================================================== */}
        <p
          className="
            mb-2
            mt-3
            shrink-0

            px-4

            text-[9px]
            font-extrabold
            tracking-[0.16em]

            text-violet-400
          "
        >
          {section}
        </p>

        {/* ==================================================
            NAVIGATION
        ================================================== */}
        <nav
          className="
            min-h-0
            flex-1

            space-y-1

            overflow-x-hidden
            overflow-y-auto

            px-3
            pb-3

            overscroll-contain

            [-webkit-overflow-scrolling:touch]
          "
        >
          {items.map(([to, label, Icon]) => (
            <NavLink
              key={to}
              end={to === base}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                [
                  'group',
                  'flex',
                  'min-h-[42px]',
                  'items-center',
                  'gap-2.5',
                  'rounded-xl',
                  'border',
                  'px-2.5',
                  'text-[11px]',
                  'font-semibold',
                  'transition',
                  'duration-200',

                  'sm:min-h-[44px]',
                  'sm:text-[12px]',

                  isActive
                    ? 'border-violet-500/25 bg-gradient-to-r from-violet-500/15 via-purple-500/[0.08] to-transparent text-white'
                    : 'border-transparent text-slate-400 hover:bg-white/[0.03] hover:text-white',
                ].join(' ')
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`
                      grid
                      h-8
                      w-8
                      shrink-0
                      place-items-center

                      rounded-lg

                      ${
                        isActive
                          ? 'bg-violet-500/15 text-violet-300'
                          : 'bg-white/[0.025] text-slate-500'
                      }
                    `}
                  >
                    <Icon size={15} />
                  </span>

                  <span className="truncate">
                    {label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* ==================================================
            LOGOUT
        ================================================== */}
        <div
          className="
            shrink-0

            border-t
            border-white/[0.06]

            bg-[#060919]

            p-3
          "
        >
          <button
  type="button"
  onClick={signOut}
  className="
    flex
    min-h-[44px]
    w-full
    items-center
    gap-3

    rounded-xl

    border
    border-rose-500/25

    bg-rose-500/10

    px-2.5

    text-[12px]
    font-bold

    text-rose-200

    shadow-[0_6px_20px_rgba(244,63,94,0.10)]

    transition
    duration-200

    hover:border-rose-400/40
    hover:bg-rose-500/18
    hover:text-white

    active:scale-[0.99]

    sm:px-3
  "
>
  <span
    className="
      grid
      h-8
      w-8
      shrink-0
      place-items-center

      rounded-lg

      bg-rose-500/18

      text-rose-200

      transition

      group-hover:bg-rose-500/25
    "
  >
    <LogOut size={16} />
  </span>

  <span>
    Sign out
  </span>
</button>
        </div>
      </aside>

      {/* ======================================================
          PAGE AREA
      ====================================================== */}
      <div
        className="
          relative
          z-10

          min-h-screen

          lg:pl-[270px]
        "
      >
        {/* ==================================================
            TOP BAR
        ================================================== */}
        <header
          className="
            sticky
            top-0
            z-30

            h-[68px]

            border-b
            border-white/[0.06]

            bg-[#070a18]/95

            backdrop-blur-xl
          "
        >
          <div
            className="
              mx-auto
              flex
              h-full
              w-full
              max-w-[1500px]
              items-center
              justify-between

              px-4

              sm:px-5

              lg:px-7

              xl:px-8
            "
          >
            {/* ==================================================
                MOBILE LOGO
            ================================================== */}
            <div className="lg:hidden">
              <Logo to={base} />
            </div>

            {/* ==================================================
                DESKTOP HEADER
            ================================================== */}
            <div
              className="
                hidden
                w-full
                items-center
                justify-between

                lg:flex
              "
            >
              {/* LEFT */}
              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >
                <span
                  className="
                    h-2
                    w-2

                    rounded-full

                    bg-violet-400

                    shadow-[0_0_14px_rgba(167,139,250,0.8)]
                  "
                />

                <span
                  className="
                    text-[10px]
                    font-extrabold
                    tracking-[0.14em]

                    text-slate-500
                  "
                >
                  {section}
                </span>
              </div>

              {/* ==================================================
                  DESKTOP PROFILE - TOP RIGHT
              ================================================== */}
              <div
                className="
                  flex
                  items-center
                  gap-3

                  rounded-xl

                  border
                  border-violet-500/[0.12]

                  bg-gradient-to-r
                  from-violet-500/[0.08]
                  via-fuchsia-500/[0.04]
                  to-transparent

                  px-3
                  py-2
                "
              >
                <UserAvatar
                  name={user?.name}
                  src={user?.avatar}
                  size="md"
                  className="
                    shrink-0

                    border-2
                    border-violet-400/25

                    shadow-[0_5px_18px_rgba(0,0,0,0.30)]

                    ring-1
                    ring-white/[0.06]
                  "
                />

                <div className="min-w-0">
                  <strong
                    className="
                      block
                      max-w-[180px]
                      truncate

                      text-[11px]
                      font-extrabold

                      text-white
                    "
                  >
                    {user?.name || 'User'}
                  </strong>

                  <small
                    className="
                      mt-0.5
                      block

                      text-[9px]
                      font-semibold

                      text-violet-300
                    "
                  >
                    {subtitle}
                  </small>
                </div>
              </div>
            </div>

            {/* ==================================================
                MOBILE MENU
            ================================================== */}
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="
                ml-auto

                grid
                h-10
                w-10
                place-items-center

                rounded-xl

                border
                border-white/[0.08]

                bg-white/[0.035]

                text-slate-300

                transition

                hover:border-violet-500/30
                hover:bg-violet-500/10
                hover:text-white

                lg:hidden
              "
            >
              <Menu size={20} />
            </button>
          </div>
        </header>

        {/* ==================================================
            CONTENT
        ================================================== */}
        <main
          className="
            relative
            w-full
          "
        >
          {/* BACKGROUND DECORATION */}
          <div
            className="
              pointer-events-none
              absolute
              inset-0

              overflow-hidden
            "
          >
            <div
              className="
                absolute
                -left-[130px]
                top-[80px]

                h-[320px]
                w-[320px]

                rounded-full

                bg-violet-700/[0.06]

                blur-[105px]
              "
            />

            <div
              className="
                absolute
                -right-[130px]
                top-[400px]

                h-[380px]
                w-[380px]

                rounded-full

                bg-fuchsia-700/[0.05]

                blur-[120px]
              "
            />
          </div>

          {/* ==================================================
              OUTLET CONTENT
          ================================================== */}
          <div
            className="
              relative
              mx-auto
              w-full
              max-w-[1500px]

              px-3
              pb-24
              pt-5

              min-[380px]:px-4
              min-[380px]:pb-28

              sm:px-5
              sm:pb-24
              sm:pt-6

              lg:px-7
              lg:pb-16
              lg:pt-8

              xl:px-8
            "
          >
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
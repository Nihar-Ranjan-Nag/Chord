import {
  CalendarDays,
  Gift,
  Home,
  Info,
  LogIn,
  Menu,
  Sparkles,
  Trophy,
  UserPlus,
  UsersRound,
  X,
} from 'lucide-react'

import {
  Link,
  NavLink,
  Outlet,
} from 'react-router-dom'

import { useState } from 'react'

import { Logo } from '@/components/common/Logo'
import { PublicFooter } from '@/components/layout/PublicFooter'

const items = [
  ['/', 'Home', Home],
  ['/events', 'Explore', CalendarDays],
  ['/rewards', 'Rewards', Gift],
  ['/leaderboard', 'Points', Trophy],
  ['/about', 'How it works', Info],
] as const

export function PublicLayout() {
  const [open, setOpen] = useState(false)

  const closeMenu = () => setOpen(false)

  return (
    <div className="min-h-screen bg-[#050818] text-white">
      {/* =====================================================
          NORMAL PAGE LAYOUT

          IMPORTANT:
          - no fixed page wrapper
          - no absolute page scroller
          - browser handles normal scrolling
          - footer naturally stays at bottom
      ===================================================== */}
      <div className="flex min-h-screen flex-col overflow-x-clip pt-[68px]">
        {/* =====================================================
            NAVBAR
        ===================================================== */}
        <header
          className="
            fixed
            inset-x-0
            top-0
            z-50

            w-full

            shrink-0

            border-b
            border-white/[0.06]

            bg-[#050716]/95

            backdrop-blur-xl

            shadow-[0_8px_30px_rgba(0,0,0,0.22)]

            supports-[backdrop-filter]:bg-[#050716]/85
          "
        >
          <div
            className="
              mx-auto
              flex
              h-[68px]
              w-full
              max-w-[1380px]
              items-center

              px-4

              sm:px-6

              lg:px-10
            "
          >
            {/* LOGO */}
            <Link
              to="/"
              onClick={closeMenu}
              className="shrink-0"
            >
              <Logo />
            </Link>

            {/* =================================================
                DESKTOP NAV
            ================================================= */}
            <nav className="mx-auto hidden items-center gap-1 lg:flex">
              {items.map(([to, label, Icon]) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `
                      flex
                      h-10
                      items-center
                      gap-2

                      rounded-xl

                      px-4

                      text-[13px]
                      font-semibold

                      transition-all
                      duration-300

                      ${
                        isActive
                          ? `
                            border
                            border-violet-500/25

                            bg-violet-500/10

                            text-violet-300

                            shadow-[0_0_25px_rgba(124,58,237,0.12)]
                          `
                          : `
                            text-slate-300

                            hover:bg-white/[0.04]
                            hover:text-white
                          `
                      }
                    `
                  }
                >
                  <Icon
                    size={16}
                    strokeWidth={1.9}
                  />

                  {label}
                </NavLink>
              ))}
            </nav>

            {/* =================================================
                DESKTOP ACTIONS
            ================================================= */}
            <div className="hidden items-center gap-3 lg:flex">
              <Link
                to="/login"
                className="
                  flex
                  h-10
                  items-center
                  justify-center

                  rounded-xl

                  border
                  border-white/10

                  px-5

                  text-[13px]
                  font-bold
                  text-white

                  transition

                  hover:border-violet-400/40
                  hover:bg-white/[0.04]
                "
              >
                Login
              </Link>

              <Link
                to="/register"
                className="
                  flex
                  h-10
                  items-center
                  justify-center

                  rounded-xl

                  bg-gradient-to-r
                  from-violet-600
                  via-purple-600
                  to-fuchsia-600

                  px-5

                  text-[13px]
                  font-bold
                  text-white

                  shadow-[0_0_30px_rgba(124,58,237,0.35)]

                  transition

                  hover:-translate-y-0.5
                "
              >
                Sign Up
              </Link>
            </div>

            {/* =================================================
                MOBILE MENU BUTTON
            ================================================= */}
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open navigation"
              className="
                ml-auto

                grid
                h-10
                w-10
                place-items-center

                rounded-xl

                border
                border-white/10

                bg-white/[0.03]

                text-white

                lg:hidden
              "
            >
              <Menu size={21} />
            </button>
          </div>
        </header>

        {/* =====================================================
            PAGE

            flex-1 is the important sticky-footer fix.
            If page content is short this section fills the
            remaining viewport and pushes footer to bottom.
        ===================================================== */}
        <main className="relative w-full flex-1">
          <Outlet />
        </main>

        {/* =====================================================
            FOOTER
        ===================================================== */}
        <PublicFooter />
      </div>

      {/* =====================================================
          MOBILE BACKDROP
      ===================================================== */}
      <button
        type="button"
        aria-label="Close navigation"
        onClick={closeMenu}
        className={`
          fixed
          inset-0
          z-[60]

          bg-black/70

          backdrop-blur-[2px]

          transition-opacity
          duration-300

          lg:hidden

          ${
            open
              ? 'pointer-events-auto opacity-100'
              : 'pointer-events-none opacity-0'
          }
        `}
      />

      {/* =====================================================
          MOBILE SIDEBAR
      ===================================================== */}
      <aside
        className={`
          fixed
          inset-y-0
          left-0
          z-[70]

          flex

          w-[82%]
          max-w-[320px]

          flex-col

          border-r
          border-violet-500/15

          bg-[#080b1d]

          shadow-[20px_0_60px_rgba(0,0,0,0.55)]

          transition-transform
          duration-300
          ease-out

          lg:hidden

          ${
            open
              ? 'translate-x-0'
              : '-translate-x-full'
          }
        `}
      >
        {/* =================================================
            SIDEBAR HEADER
        ================================================= */}
        <div
          className="
            flex
            h-[68px]
            shrink-0
            items-center
            justify-between

            border-b
            border-white/[0.07]

            px-5
          "
        >
          <Link
            to="/"
            onClick={closeMenu}
          >
            <Logo />
          </Link>

          <button
            type="button"
            onClick={closeMenu}
            aria-label="Close navigation"
            className="
              grid
              h-9
              w-9
              place-items-center

              rounded-xl

              border
              border-white/10

              bg-white/[0.03]

              text-slate-300
            "
          >
            <X size={19} />
          </button>
        </div>

        {/* =================================================
            SIDEBAR SCROLL
        ================================================= */}
        <div
          className="
            min-h-0
            flex-1

            overflow-y-auto

            px-3
            pb-8
          "
        >
          {/* INTRO */}
          <div className="px-2 pb-4 pt-5">
            <div className="flex items-center gap-2">
              <Sparkles
                size={12}
                className="text-violet-400"
              />

              <p className="text-[9px] font-extrabold tracking-[0.13em] text-violet-400">
                CHORD COMMUNITY
              </p>
            </div>

            <h3 className="mt-2 text-[18px] font-black leading-6 text-white">
              Explore. Participate.
              <br />
              Earn rewards.
            </h3>

            <p className="mt-2 max-w-[240px] text-[10px] leading-[17px] text-slate-500">
              Discover events, connect with your community
              and make every experience count.
            </p>
          </div>

          {/* LABEL */}
          <p
            className="
              px-3
              pb-2

              text-[8px]
              font-bold
              tracking-[0.14em]
              text-slate-600
            "
          >
            NAVIGATION
          </p>

          {/* =================================================
              NAVIGATION
          ================================================= */}
          <nav className="space-y-1">
            {items.map(([to, label, Icon]) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={closeMenu}
                className={({ isActive }) =>
                  `
                    flex
                    h-[48px]
                    items-center
                    gap-3

                    rounded-xl

                    px-3

                    text-[13px]
                    font-semibold

                    transition

                    ${
                      isActive
                        ? `
                          border
                          border-violet-500/20

                          bg-gradient-to-r
                          from-violet-600/20
                          to-fuchsia-600/5

                          text-violet-300
                        `
                        : `
                          border
                          border-transparent

                          text-slate-400

                          hover:bg-white/[0.04]
                          hover:text-white
                        `
                    }
                  `
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
                            ? 'bg-violet-500/15 text-violet-400'
                            : 'bg-white/[0.035] text-slate-400'
                        }
                      `}
                    >
                      <Icon size={16} />
                    </span>

                    {label}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* =================================================
              ACCOUNT
          ================================================= */}
          <div
            className="
              mt-5

              rounded-[18px]

              border
              border-white/[0.07]

              bg-white/[0.025]

              p-3
            "
          >
            <p className="px-1 text-[8px] font-extrabold tracking-[0.14em] text-violet-400">
              YOUR ACCOUNT
            </p>

            <p className="mt-1 px-1 text-[10px] leading-4 text-slate-500">
              Login or create your CHORD account.
            </p>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <Link
                to="/login"
                onClick={closeMenu}
                className="
                  flex
                  h-11
                  items-center
                  justify-center
                  gap-1.5

                  rounded-xl

                  border
                  border-white/10

                  bg-white/[0.025]

                  text-[11px]
                  font-bold
                  text-white
                "
              >
                <LogIn size={14} />

                Login
              </Link>

              <Link
                to="/register"
                onClick={closeMenu}
                className="
                  flex
                  h-11
                  items-center
                  justify-center
                  gap-1.5

                  rounded-xl

                  bg-gradient-to-r
                  from-violet-600
                  via-purple-600
                  to-fuchsia-600

                  text-[11px]
                  font-bold
                  text-white
                "
              >
                <UserPlus size={14} />

                Sign Up
              </Link>
            </div>

            <Link
              to="/organizer/register"
              onClick={closeMenu}
              className="
                mt-2

                flex
                h-10
                items-center
                justify-center
                gap-2

                rounded-xl

                border
                border-violet-500/20

                bg-violet-500/[0.06]

                text-[10px]
                font-semibold
                text-violet-300
              "
            >
              <UsersRound size={13} />

              Organizer Registration
            </Link>
          </div>

          <div className="h-8" />
        </div>
      </aside>
    </div>
  )
}
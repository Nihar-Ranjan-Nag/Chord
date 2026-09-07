import type { ReactNode } from 'react'

import {
  CalendarDays,
  Gift,
  ShieldCheck,
  Sparkles,
  Trophy,
  UsersRound,
  Zap,
} from 'lucide-react'

import { Link } from 'react-router-dom'

import { Logo } from '@/components/common/Logo'

type AuthShellProps = {
  children: ReactNode
  title?: ReactNode
  description?: string
  footnote?: string
}

const features = [
  {
    icon: CalendarDays,
    title: 'Discover Events',
    text: 'Find activities, opportunities and experiences around you.',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
  },
  {
    icon: Trophy,
    title: 'Earn Points',
    text: 'Get rewarded for verified participation and impact.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
  },
  {
    icon: Gift,
    title: 'Unlock Rewards',
    text: 'Turn your participation into rewards and experiences.',
    color: 'text-fuchsia-400',
    bg: 'bg-fuchsia-500/10',
  },
]

export function AuthShell({
  children,
  title,
  description,
  footnote,
}: AuthShellProps) {
  return (
    <div className="fixed inset-0 z-0 bg-[#050818] text-white">

      {/* =====================================================
          ONE SCROLL CONTAINER FOR EVERYTHING
      ===================================================== */}
      <div
        className="
          absolute
          inset-0
          overflow-y-auto
          overflow-x-hidden
          overscroll-y-contain
          [-webkit-overflow-scrolling:touch]
        "
      >
        {/* =====================================================
            BACKGROUND
        ===================================================== */}
        <div className="pointer-events-none fixed inset-0 z-0">
          <div className="absolute -left-[180px] -top-[180px] h-[430px] w-[430px] rounded-full bg-violet-700/15 blur-[130px]" />

          <div className="absolute -right-[180px] top-[18%] h-[430px] w-[430px] rounded-full bg-blue-700/10 blur-[130px]" />

          <div className="absolute bottom-[-180px] left-[35%] h-[400px] w-[400px] rounded-full bg-fuchsia-700/[0.08] blur-[130px]" />
        </div>

        {/* =====================================================
            MOBILE HEADER
        ===================================================== */}
        <header
          className="
            sticky
            top-0
            z-50
            border-b
            border-white/[0.06]
            bg-[#050716]/95
            backdrop-blur-xl
            lg:hidden
          "
        >
          <div className="mx-auto flex h-[64px] items-center justify-between px-4 min-[380px]:px-5 sm:px-6">
            <Link to="/">
              <Logo />
            </Link>

            <Link
              to="/"
              className="
                rounded-xl
                border border-white/[0.08]
                bg-white/[0.03]
                px-3
                py-2
                text-[9px]
                font-bold
                text-slate-300
                transition
                hover:border-violet-400/20
                hover:text-white
              "
            >
              Back Home
            </Link>
          </div>
        </header>

        {/* =====================================================
            MAIN
        ===================================================== */}
        <main
          className="
            relative
            z-10
            mx-auto
            grid
            w-full
            max-w-[1440px]
            lg:grid-cols-[0.92fr_1.08fr]
          "
        >
          {/* =================================================
              DESKTOP LEFT
          ================================================= */}
          <section
            className="
              relative
              hidden
              border-r
              border-white/[0.06]

              lg:sticky
              lg:top-0
              lg:flex
              lg:h-screen
              lg:flex-col
              lg:self-start
              lg:px-10

              xl:px-14
            "
          >
            {/* LOGO */}
            <div className="flex h-[88px] shrink-0 items-center">
              <Link to="/">
                <Logo />
              </Link>
            </div>

            {/* LEFT CONTENT */}
            <div className="flex flex-1 items-center py-8">
              <div className="w-full max-w-[540px]">

                <div className="mb-4 flex items-center gap-2 text-[10px] font-extrabold tracking-[0.14em] text-violet-400">
                  <Sparkles size={14} />

                  WELCOME TO CHORD
                </div>

                <h1
                  className="
                    text-[44px]
                    font-black
                    leading-[1.03]
                    tracking-[-0.045em]
                    text-white
                    xl:text-[54px]
                  "
                >
                  {title || (
                    <>
                      Your campus.
                      <br />

                      Your voice.
                      <br />

                      <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                        Your impact.
                      </span>
                    </>
                  )}
                </h1>

                {description && (
                  <p className="mt-5 max-w-[500px] text-[14px] leading-7 text-slate-400">
                    {description}
                  </p>
                )}

                {/* FEATURES */}
                <div className="mt-7 grid gap-3">
                  {features.map(feature => {
                    const Icon = feature.icon

                    return (
                      <div
                        key={feature.title}
                        className="
                          flex
                          items-center
                          gap-4
                          rounded-2xl
                          border
                          border-white/[0.06]
                          bg-white/[0.025]
                          p-4
                          transition
                          hover:border-violet-500/20
                          hover:bg-white/[0.04]
                        "
                      >
                        <span
                          className={`
                            grid
                            h-11
                            w-11
                            shrink-0
                            place-items-center
                            rounded-xl
                            ${feature.bg}
                            ${feature.color}
                          `}
                        >
                          <Icon size={20} />
                        </span>

                        <div>
                          <h3 className="text-sm font-extrabold text-white">
                            {feature.title}
                          </h3>

                          <p className="mt-1 text-xs leading-5 text-slate-500">
                            {feature.text}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* TRUST */}
                <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] font-semibold text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck
                      size={14}
                      className="text-emerald-400"
                    />

                    Secure access
                  </span>

                  <span className="flex items-center gap-1.5">
                    <UsersRound
                      size={14}
                      className="text-blue-400"
                    />

                    Students & organizers
                  </span>

                  <span className="flex items-center gap-1.5">
                    <Zap
                      size={14}
                      className="text-violet-400"
                    />

                    One community
                  </span>
                </div>

                {footnote && (
                  <p className="mt-5 text-[10px] text-slate-600">
                    {footnote}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* =================================================
              FORM SIDE
          ================================================= */}
          <section
            className="
              relative
              flex
              min-h-[calc(100svh-64px)]
              items-start
              justify-center

              px-3
              pt-3

              pb-[140px]

              min-[380px]:px-4
              min-[380px]:pb-[160px]

              sm:px-6
              sm:pt-4
              sm:pb-[160px]

              lg:min-h-screen
              lg:px-10
              lg:pb-20
              lg:pt-10

              xl:px-14
            "
          >
            {/* BACKGROUND GLOW */}
            <div
              className="
                pointer-events-none
                absolute
                left-1/2
                top-[10%]
                h-[420px]
                w-[420px]
                -translate-x-1/2
                rounded-full
                bg-violet-700/[0.08]
                blur-[100px]
              "
            />

            <div className="relative w-full max-w-[500px]">

              {/* =================================================
                  MOBILE INTRO
              ================================================= */}
              <div
                className="
                  mb-3
                  px-2
                  text-center
                  sm:mb-4
                  lg:hidden
                "
              >
                <div className="flex items-center justify-center gap-2 text-[8px] font-extrabold tracking-[0.14em] text-violet-400">
                  <Sparkles size={10} />

                  WELCOME TO CHORD
                </div>

                <h1
                  className="
                    mx-auto
                    mt-1.5
                    max-w-[350px]
                    text-[20px]
                    font-black
                    leading-[1.13]
                    tracking-[-0.025em]
                    text-white

                    min-[380px]:text-[23px]
                  "
                >
                  Your campus. Your voice.
                  <br />

                  <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                    Your impact.
                  </span>
                </h1>

                <p
                  className="
                    mx-auto
                    mt-1.5
                    max-w-[350px]
                    text-[9px]
                    leading-[15px]
                    text-slate-500

                    min-[380px]:text-[10px]
                  "
                >
                  Discover events, connect, earn points
                  and make every participation count.
                </p>
              </div>

              {/* =================================================
                  FORM CARD
              ================================================= */}
              <div
                className="
                  relative
                  overflow-hidden

                  rounded-[20px]

                  border
                  border-white/[0.08]

                  bg-[#0a0e23]/95

                  p-4

                  shadow-[0_25px_80px_rgba(0,0,0,0.32)]
                  backdrop-blur-xl

                  min-[380px]:p-5

                  sm:rounded-[26px]
                  sm:p-7

                  lg:p-8
                "
              >
                <div
                  className="
                    pointer-events-none
                    absolute
                    -right-20
                    -top-20
                    h-[220px]
                    w-[220px]
                    rounded-full
                    bg-violet-600/10
                    blur-[70px]
                  "
                />

                <div className="relative">
                  {children}
                </div>
              </div>

              {/* =================================================
                  VERY IMPORTANT

                  This is REAL content height,
                  not absolute/fixed.
              ================================================= */}
              <div
                aria-hidden="true"
                className="
                  h-[100px]
                  min-[380px]:h-[120px]
                  sm:h-[140px]
                  lg:h-10
                "
              />
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
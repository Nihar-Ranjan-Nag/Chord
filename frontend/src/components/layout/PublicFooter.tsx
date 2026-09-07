import {
  ArrowRight,
  Compass,
  Sparkles,
  UserRound,
  UsersRound,
} from 'lucide-react'

import { Link } from 'react-router-dom'

import { Logo } from '@/components/common/Logo'

export function PublicFooter() {
  return (
    <footer
      className="
        relative
        w-full
        shrink-0

        border-t
        border-white/[0.06]

        bg-[#050716]
      "
    >
      {/* =====================================================
          DECORATIVE BACKGROUND
      ===================================================== */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-10 h-56 w-56 rounded-full bg-violet-700/[0.06] blur-[90px]" />

        <div className="absolute -right-24 bottom-0 h-56 w-56 rounded-full bg-fuchsia-600/[0.05] blur-[90px]" />
      </div>

      <div
        className="
          relative

          mx-auto

          w-full
          max-w-[1240px]

          px-4
          pb-6
          pt-6

          min-[380px]:px-5

          sm:px-7
          sm:pb-8
          sm:pt-8

          lg:px-8
          lg:pb-6
          lg:pt-8
        "
      >
        {/* =====================================================
            CTA
        ===================================================== */}
        <div
          className="
            relative

            mb-7

            overflow-hidden

            rounded-[18px]

            border
            border-violet-500/[0.16]

            bg-gradient-to-r
            from-[#10142f]
            via-[#0d1229]
            to-[#1a0d38]

            px-4
            py-4

            sm:rounded-[22px]
            sm:px-6
            sm:py-5

            lg:flex
            lg:items-center
            lg:justify-between
            lg:px-8
          "
        >
          {/* GLOW */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-violet-600/15 blur-[70px]" />

          {/* TEXT */}
          <div className="relative">
            <div
              className="
                flex
                items-center
                gap-2

                text-[10px]
                font-extrabold
                tracking-[0.12em]
                text-violet-400

                min-[380px]:text-[11px]

                sm:text-xs
              "
            >
              <Sparkles
                size={13}
                className="shrink-0"
              />

              START YOUR CHORD JOURNEY
            </div>

            <h2
              className="
                mt-2

                text-[19px]
                font-black
                leading-tight
                text-white

                min-[380px]:text-[20px]

                sm:text-2xl
              "
            >
              Ready to participate and earn?
            </h2>

            <p
              className="
                mt-2

                max-w-[540px]

                text-[11px]
                leading-[18px]
                text-slate-400

                min-[380px]:text-[12px]
                min-[380px]:leading-5

                sm:text-[13px]
                sm:leading-6
              "
            >
              Discover events, participate, earn points
              and unlock rewards with CHORD.
            </p>
          </div>

          {/* BUTTONS */}
          <div
            className="
              relative

              mt-4

              grid
              grid-cols-2
              gap-2

              lg:mt-0
              lg:min-w-[300px]
            "
          >
            <Link
              to="/events"
              className="
                inline-flex

                h-10

                items-center
                justify-center
                gap-1.5

                rounded-xl

                border
                border-white/10

                bg-white/[0.035]

                px-2

                text-[10px]
                font-bold
                text-white

                transition

                hover:bg-white/[0.07]

                min-[380px]:text-[11px]

                sm:h-11
                sm:text-xs
              "
            >
              Explore Events

              <ArrowRight size={13} />
            </Link>

            <Link
              to="/register"
              className="
                inline-flex

                h-10

                items-center
                justify-center
                gap-1.5

                rounded-xl

                bg-gradient-to-r
                from-violet-600
                via-purple-600
                to-fuchsia-600

                px-2

                text-[10px]
                font-bold
                text-white

                shadow-[0_0_25px_rgba(124,58,237,0.25)]

                transition

                hover:-translate-y-0.5

                min-[380px]:text-[11px]

                sm:h-11
                sm:text-xs
              "
            >
              Join Now

              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* =====================================================
            BRAND + LINKS
        ===================================================== */}
        <div
          className="
            grid
            gap-7

            lg:grid-cols-[1.15fr_2.2fr]
            lg:gap-14
          "
        >
          {/* =================================================
              BRAND
          ================================================= */}
          <div>
            <Logo />

            <p
              className="
                mt-3

                max-w-[390px]

                text-[11px]
                leading-[18px]
                text-slate-500

                min-[380px]:text-[12px]
                min-[380px]:leading-5

                sm:text-[13px]
                sm:leading-6
              "
            >
              Discover events. Join communities. Earn points.
              Unlock rewards. Make every experience count.
            </p>
          </div>

          {/* =================================================
              THREE COLUMNS
          ================================================= */}
          <div
            className="
              grid
              grid-cols-3

              gap-x-3

              min-[380px]:gap-x-4

              sm:gap-x-8

              lg:gap-x-12
            "
          >
            {/* ===============================================
                EXPLORE
            =============================================== */}
            <div className="min-w-0">
              <div className="flex min-w-0 items-center gap-1.5">
                <span
                  className="
                    grid
                    h-7
                    w-7
                    shrink-0
                    place-items-center

                    rounded-lg

                    bg-violet-500/10
                    text-violet-400

                    sm:h-8
                    sm:w-8
                  "
                >
                  <Compass
                    size={13}
                    className="sm:size-[15px]"
                  />
                </span>

                <h3
                  className="
                    truncate

                    text-[11px]
                    font-extrabold
                    text-violet-300

                    min-[380px]:text-[12px]

                    sm:text-sm
                  "
                >
                  Explore
                </h3>
              </div>

              <div
                className="
                  mt-3

                  flex
                  flex-col
                  gap-2.5

                  text-[10px]
                  leading-5
                  text-slate-500

                  min-[380px]:text-[11px]

                  sm:mt-4
                  sm:gap-3
                  sm:text-[13px]
                "
              >
                <Link
                  to="/events"
                  className="transition hover:text-white"
                >
                  Events
                </Link>

                <Link
                  to="/rewards"
                  className="transition hover:text-white"
                >
                  Rewards
                </Link>

                <Link
                  to="/leaderboard"
                  className="transition hover:text-white"
                >
                  Leaderboard
                </Link>
              </div>
            </div>

            {/* ===============================================
                COMMUNITY
            =============================================== */}
            <div className="min-w-0">
              <div className="flex min-w-0 items-center gap-1.5">
                <span
                  className="
                    grid
                    h-7
                    w-7
                    shrink-0
                    place-items-center

                    rounded-lg

                    bg-blue-500/10
                    text-blue-400

                    sm:h-8
                    sm:w-8
                  "
                >
                  <UsersRound
                    size={13}
                    className="sm:size-[15px]"
                  />
                </span>

                <h3
                  className="
                    truncate

                    text-[11px]
                    font-extrabold
                    text-violet-300

                    min-[380px]:text-[12px]

                    sm:text-sm
                  "
                >
                  Community
                </h3>
              </div>

              <div
                className="
                  mt-3

                  flex
                  flex-col
                  gap-2.5

                  text-[10px]
                  leading-5
                  text-slate-500

                  min-[380px]:text-[11px]

                  sm:mt-4
                  sm:gap-3
                  sm:text-[13px]
                "
              >
                <Link
                  to="/about"
                  className="transition hover:text-white"
                >
                  How it works
                </Link>

                <Link
                  to="/organizer/register"
                  className="transition hover:text-white"
                >
                  Organizers
                </Link>

                <Link
                  to="/register"
                  className="break-words transition hover:text-white"
                >
                  Join CHORD
                </Link>
              </div>
            </div>

            {/* ===============================================
                ACCOUNT
            =============================================== */}
            <div className="min-w-0">
              <div className="flex min-w-0 items-center gap-1.5">
                <span
                  className="
                    grid
                    h-7
                    w-7
                    shrink-0
                    place-items-center

                    rounded-lg

                    bg-fuchsia-500/10
                    text-fuchsia-400

                    sm:h-8
                    sm:w-8
                  "
                >
                  <UserRound
                    size={13}
                    className="sm:size-[15px]"
                  />
                </span>

                <h3
                  className="
                    truncate

                    text-[11px]
                    font-extrabold
                    text-violet-300

                    min-[380px]:text-[12px]

                    sm:text-sm
                  "
                >
                  Account
                </h3>
              </div>

              <div
                className="
                  mt-3

                  flex
                  flex-col
                  gap-2.5

                  text-[10px]
                  leading-5
                  text-slate-500

                  min-[380px]:text-[11px]

                  sm:mt-4
                  sm:gap-3
                  sm:text-[13px]
                "
              >
                <Link
                  to="/login"
                  className="transition hover:text-white"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="break-words transition hover:text-white"
                >
                  User registration
                </Link>

                <Link
                  to="/forgot-password"
                  className="break-words transition hover:text-white"
                >
                  Forgot password
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            COPYRIGHT
        ===================================================== */}
        <div
          className="
            mt-6

            border-t
            border-white/[0.06]

            pt-4

            lg:mt-7
          "
        >
          <div
            className="
              flex
              flex-col
              gap-1.5

              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <p
              className="
                text-[10px]
                leading-5
                text-slate-600

                min-[380px]:text-[11px]

                sm:text-xs
              "
            >
              © {new Date().getFullYear()} CHORD.
              All rights reserved.
            </p>

            <div
              className="
                flex
                flex-wrap
                items-center

                gap-x-2

                text-[9px]
                leading-5
                text-slate-600

                min-[380px]:text-[10px]

                sm:text-[11px]
              "
            >
              <span>Speak up.</span>

              <span className="text-violet-500">
                •
              </span>

              <span>Participate.</span>

              <span className="text-violet-500">
                •
              </span>

              <span>Earn.</span>

              <span className="text-violet-500">
                •
              </span>

              <span>Grow.</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
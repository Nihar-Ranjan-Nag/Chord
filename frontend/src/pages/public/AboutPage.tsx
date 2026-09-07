import {
  ArrowRight,
  CalendarCheck,
  Gift,
  Sparkles,
  UserPlus,
} from 'lucide-react'

import { Link } from 'react-router-dom'

export function AboutPage() {
  const steps = [
    {
      icon: UserPlus,
      title: 'Create your profile',
      text: 'Register once and maintain your student profile.',
      gradient: 'from-violet-600 to-fuchsia-600',
      glow: 'bg-violet-500/10',
      numberColor: 'text-violet-400',
    },
    {
      icon: CalendarCheck,
      title: 'Join events',
      text: 'Discover published events and register while slots are available.',
      gradient: 'from-blue-500 to-indigo-600',
      glow: 'bg-blue-500/10',
      numberColor: 'text-blue-400',
    },
    {
      icon: Sparkles,
      title: 'Earn verified points',
      text: 'Points are credited through verified registration, attendance and completion.',
      gradient: 'from-emerald-400 to-teal-600',
      glow: 'bg-emerald-500/10',
      numberColor: 'text-emerald-400',
    },
    {
      icon: Gift,
      title: 'Redeem rewards',
      text: 'Use your available balance to request rewards from the live catalog.',
      gradient: 'from-fuchsia-500 to-pink-600',
      glow: 'bg-fuchsia-500/10',
      numberColor: 'text-fuchsia-400',
    },
  ]

  return (
    <main className="relative overflow-hidden bg-[#050818]">
      {/* ======================================================
          BACKGROUND
      ====================================================== */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-[160px] top-[80px] h-[380px] w-[380px] rounded-full bg-violet-700/[0.08] blur-[110px]" />

        <div className="absolute -right-[170px] top-[320px] h-[430px] w-[430px] rounded-full bg-fuchsia-700/[0.07] blur-[120px]" />

        <div className="absolute bottom-[5%] left-[35%] h-[280px] w-[380px] rounded-full bg-blue-700/[0.05] blur-[110px]" />
      </div>

      <div
        className="
          relative
          mx-auto
          max-w-[1140px]

          px-3
          pb-10
          pt-7

          min-[380px]:px-4

          sm:px-6
          sm:pb-12
          sm:pt-10

          lg:px-8
          lg:pb-14
          lg:pt-12
        "
      >
        {/* ======================================================
            HERO
        ====================================================== */}
        <section className="mx-auto max-w-[760px] text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-violet-500/10 text-violet-400 sm:h-8 sm:w-8">
              <Sparkles
                size={15}
                className="sm:size-[17px]"
              />
            </span>

            <span
              className="
                text-[9px]
                font-extrabold
                uppercase
                tracking-[0.15em]
                text-violet-400

                sm:text-[11px]
              "
            >
              How it works
            </span>
          </div>

          <h1
            className="
              mx-auto
              mt-3

              text-[28px]
              font-black
              leading-[1.06]
              tracking-[-0.035em]

              text-white

              min-[380px]:text-[31px]

              sm:text-[42px]

              md:text-[48px]
            "
          >
            Participation that turns into{' '}

            <span
              className="
                bg-gradient-to-r
                from-violet-400
                via-fuchsia-400
                to-blue-400

                bg-clip-text
                text-transparent
              "
            >
              progress
            </span>
          </h1>

          <p
            className="
              mx-auto
              mt-3
              max-w-[650px]

              text-[11px]
              leading-5
              text-slate-400

              min-[380px]:text-[12px]

              sm:mt-4
              sm:text-sm
              sm:leading-7
            "
          >
            CHORD gives students one place to discover experiences,
            track verified participation, earn points and unlock
            meaningful rewards.
          </p>
        </section>

        {/* ======================================================
            STEPS
        ====================================================== */}
        <section
          className="
            mt-7

            grid
            grid-cols-2

            gap-2.5

            min-[380px]:gap-3

            sm:mt-9
            sm:gap-4

            lg:grid-cols-4
          "
        >
          {steps.map((step, index) => {
            const Icon = step.icon

            return (
              <article
                key={step.title}
                className="
                  group
                  relative
                  min-w-0
                  overflow-hidden

                  rounded-xl

                  border
                  border-white/[0.07]

                  bg-gradient-to-b
                  from-[#10142d]
                  to-[#090d20]

                  p-3

                  shadow-[0_10px_30px_rgba(0,0,0,0.25)]

                  transition
                  duration-300

                  hover:-translate-y-1
                  hover:border-violet-500/30

                  min-[380px]:p-3.5

                  sm:rounded-2xl
                  sm:p-5
                "
              >
                {/* GLOW */}
                <div
                  className={`
                    pointer-events-none
                    absolute
                    -right-8
                    -top-8

                    h-28
                    w-28

                    rounded-full

                    blur-3xl

                    ${step.glow}
                  `}
                />

                {/* STEP NUMBER */}
                <span
                  className={`
                    absolute
                    right-2.5
                    top-2

                    text-[22px]
                    font-black

                    opacity-70

                    sm:right-4
                    sm:top-3
                    sm:text-[30px]

                    ${step.numberColor}
                  `}
                >
                  0{index + 1}
                </span>

                {/* ICON */}
                <div
                  className={`
                    relative
                    grid
                    h-9
                    w-9
                    place-items-center

                    rounded-lg

                    bg-gradient-to-br

                    ${step.gradient}

                    text-white

                    shadow-[0_8px_22px_rgba(0,0,0,0.25)]

                    sm:h-11
                    sm:w-11
                    sm:rounded-xl
                  `}
                >
                  <Icon
                    size={17}
                    className="sm:size-[20px]"
                  />
                </div>

                {/* CONTENT */}
                <div className="relative mt-3 sm:mt-4">
                  <h3
                    className="
                      text-[11px]
                      font-extrabold
                      leading-[15px]
                      text-white

                      min-[380px]:text-[12px]
                      min-[380px]:leading-[17px]

                      sm:text-[15px]
                      sm:leading-5
                    "
                  >
                    {step.title}
                  </h3>

                  <p
                    className="
                      mt-1.5

                      text-[8px]
                      leading-[13px]

                      text-slate-400

                      min-[380px]:text-[9px]
                      min-[380px]:leading-[14px]

                      sm:mt-2
                      sm:text-[11px]
                      sm:leading-5
                    "
                  >
                    {step.text}
                  </p>
                </div>
              </article>
            )
          })}
        </section>

        {/* ======================================================
            FLOW / PROGRESS AREA
        ====================================================== */}
        <section
          className="
            relative
            mt-5
            overflow-hidden

            rounded-2xl

            border
            border-violet-500/[0.14]

            bg-gradient-to-br
            from-[#0d1129]
            via-[#0b0f25]
            to-[#15102f]

            px-4
            py-5

            shadow-[0_15px_45px_rgba(0,0,0,0.28)]

            sm:mt-7
            sm:rounded-[22px]
            sm:px-6
            sm:py-7
          "
        >
          <div className="pointer-events-none absolute -right-20 -top-20 h-[260px] w-[260px] rounded-full bg-fuchsia-600/[0.12] blur-[90px]" />

          <div className="relative">
            <div className="flex items-center gap-2">
              <Sparkles
                size={15}
                className="text-violet-400"
              />

              <span
                className="
                  text-[8px]
                  font-extrabold
                  uppercase
                  tracking-[0.14em]
                  text-violet-400

                  sm:text-[10px]
                "
              >
                Your CHORD journey
              </span>
            </div>

            <h2
              className="
                mt-2

                text-[19px]
                font-black
                leading-tight

                text-white

                min-[380px]:text-[21px]

                sm:text-[26px]
              "
            >
              Join. Participate. Earn. Redeem.
            </h2>

            <p
              className="
                mt-2
                max-w-[650px]

                text-[10px]
                leading-5

                text-slate-400

                min-[380px]:text-[11px]

                sm:text-[13px]
                sm:leading-6
              "
            >
              Every activity you complete moves you forward. Your participation
              is verified, your points are tracked, and your rewards stay
              connected to your CHORD profile.
            </p>

            {/* PROGRESS LINE */}
            <div
              className="
                mt-5

                grid
                grid-cols-4

                gap-1.5

                sm:mt-6
                sm:gap-3
              "
            >
              {['Profile', 'Events', 'Points', 'Rewards'].map(
                (item, index) => (
                  <div
                    key={item}
                    className="relative text-center"
                  >
                    <div
                      className="
                        mx-auto
                        grid
                        h-7
                        w-7
                        place-items-center

                        rounded-full

                        border
                        border-violet-400/20

                        bg-violet-500/10

                        text-[8px]
                        font-black

                        text-violet-300

                        sm:h-9
                        sm:w-9
                        sm:text-[10px]
                      "
                    >
                      {index + 1}
                    </div>

                    <span
                      className="
                        mt-1.5
                        block

                        text-[7px]
                        font-bold

                        text-slate-400

                        min-[380px]:text-[8px]

                        sm:text-[10px]
                      "
                    >
                      {item}
                    </span>

                    {index !== 3 && (
                      <div
                        className="
                          absolute
                          left-[65%]
                          top-[13px]

                          h-px
                          w-[70%]

                          bg-gradient-to-r
                          from-violet-500/40
                          to-fuchsia-500/20

                          sm:top-[17px]
                        "
                      />
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        </section>

        {/* ======================================================
            CTA
        ====================================================== */}
        <section
          className="
            relative
            mt-5
            overflow-hidden

            rounded-2xl

            border
            border-violet-500/[0.16]

            bg-gradient-to-r
            from-[#241047]
            via-[#17102f]
            to-[#0c1028]

            px-4
            py-5

            sm:mt-7
            sm:rounded-[22px]
            sm:px-7
            sm:py-7
          "
        >
          <div className="pointer-events-none absolute -right-16 -top-16 h-[220px] w-[220px] rounded-full bg-fuchsia-600/15 blur-[80px]" />

          <div
            className="
              relative

              flex
              flex-col

              gap-4

              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <div>
              <span
                className="
                  text-[8px]
                  font-extrabold
                  uppercase
                  tracking-[0.14em]
                  text-violet-300

                  sm:text-[10px]
                "
              >
                Get started
              </span>

              <h2
                className="
                  mt-1.5

                  text-[20px]
                  font-black
                  leading-tight

                  text-white

                  min-[380px]:text-[22px]

                  sm:text-[27px]
                "
              >
                Ready to start your CHORD journey?
              </h2>

              <p
                className="
                  mt-2
                  max-w-[520px]

                  text-[10px]
                  leading-5

                  text-slate-400

                  min-[380px]:text-[11px]

                  sm:text-[13px]
                  sm:leading-6
                "
              >
                Create your profile, join student activities and start
                earning verified points.
              </p>
            </div>

            <Link
              to="/register"
              className="
                inline-flex
                h-10
                shrink-0
                items-center
                justify-center
                gap-1.5

                rounded-xl

                bg-gradient-to-r
                from-violet-600
                via-purple-600
                to-fuchsia-600

                px-5

                text-[10px]
                font-extrabold

                text-white

                shadow-[0_8px_30px_rgba(124,58,237,0.32)]

                transition
                duration-300

                hover:-translate-y-0.5

                sm:h-11
                sm:px-6
                sm:text-xs
              "
            >
              Join CHORD

              <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
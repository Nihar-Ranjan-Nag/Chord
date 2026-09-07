
import {
  ArrowRight,
  CalendarCheck,
  ChevronRight,
  Gift,
  MessageCircle,
  Play,
  Sparkles,
  Trophy,
  UploadCloud,
  Users,
  Zap,
} from 'lucide-react'

import { Link } from 'react-router-dom'

import heroRight from '@/assets/heroRight.png'

import bagImage from '@/assets/bag.png'
import giftImage from '@/assets/gift.png'
import bottleImage from '@/assets/bottle.png'
import headPhoneImage from '@/assets/headPhone.png'

import { EventCard } from '@/components/cards/EventCard'
import { RewardCard } from '@/components/cards/RewardCard'

import { useAsyncData } from '@/hooks/useAsyncData'
import { api } from '@/services/api'

import {
  mapEvent,
  mapReward,
} from '@/services/mappers'

/* ============================================================
   HOW CHORD WORKS
============================================================ */
const steps = [
  {
    number: '01',
    title: 'Discover Events',
    description:
      'Explore events, volunteering, competitions and campus experiences.',
    icon: CalendarCheck,
    gradient: 'from-violet-600 to-fuchsia-600',
    numberColor: 'text-violet-500',
  },
  {
    number: '02',
    title: 'Join & Participate',
    description:
      'Register for activities, take part and connect with your community.',
    icon: MessageCircle,
    gradient: 'from-blue-500 to-indigo-600',
    numberColor: 'text-blue-500',
  },
  {
    number: '03',
    title: 'Get Verified',
    description:
      'Your attendance and participation are verified by event organizers.',
    icon: UploadCloud,
    gradient: 'from-emerald-400 to-teal-600',
    numberColor: 'text-emerald-400',
  },
  {
    number: '04',
    title: 'Track Points',
    description:
      'Earn points for participation and climb the student leaderboard.',
    icon: Trophy,
    gradient: 'from-orange-400 to-orange-600',
    numberColor: 'text-orange-400',
  },
]

/* ============================================================
   REWARD PROGRESSION
============================================================ */
const rewardProgression = [
  {
    points: '2000 PTS',
    image: headPhoneImage,
    alt: 'Headphones reward',
    borderClass: 'border-blue-500/30',
    glowClass: 'bg-blue-500/10',
    pointsClass: 'bg-blue-500/10',
    arrowClass: 'text-blue-500',
  },
  {
    points: '5000 PTS',
    image: bottleImage,
    alt: 'Bottle reward',
    borderClass: 'border-cyan-500/30',
    glowClass: 'bg-cyan-500/10',
    pointsClass: 'bg-cyan-500/10',
    arrowClass: 'text-cyan-500',
  },
  {
    points: '8000 PTS',
    image: bagImage,
    alt: 'Bag reward',
    borderClass: 'border-violet-500/30',
    glowClass: 'bg-violet-500/10',
    pointsClass: 'bg-violet-500/10',
    arrowClass: 'text-violet-500',
  },
  {
    points: '12000 PTS',
    image: giftImage,
    alt: 'Gift reward',
    borderClass: 'border-fuchsia-500/30',
    glowClass: 'bg-fuchsia-500/10',
    pointsClass: 'bg-fuchsia-500/10',
    arrowClass: 'text-fuchsia-500',
  },
]

/* ============================================================
   STATS
============================================================ */
const stats = [
  {
    icon: Users,
    label: 'Active Members',
    value: '25K+',
    caption: 'and growing',
  },
  {
    icon: Zap,
    label: 'Student Activities',
    value: '1,200+',
    caption: 'events hosted',
  },
  {
    icon: Sparkles,
    label: 'Communities',
    value: '320+',
    caption: 'schools & groups',
  },
  {
    icon: Trophy,
    label: 'Points Earned',
    value: '50K+',
    caption: 'student achievements',
  },
]

export function HomePage() {
  /* ==========================================================
     API DATA
  ========================================================== */
  const { data } = useAsyncData(
    async () => {
      const [
        eventsBody,
        rewardsBody,
      ]: any[] = await Promise.all([
        api('/events?limit=4'),
        api('/rewards'),
      ])

      return {
        events: (
          eventsBody?.data?.items || []
        )
          .map(mapEvent)
          .slice(0, 4),

        rewards: (
          rewardsBody?.data || []
        )
          .map(mapReward)
          .slice(0, 4),
      }
    },
    []
  )

  return (
    <>
      {/* ======================================================
          HERO
      ====================================================== */}
      <section className="relative overflow-hidden bg-[#050818]">
        {/* BACKGROUND GLOW */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-[10%] top-10 h-[520px] w-[620px] rounded-full bg-violet-700/20 blur-[130px]" />

          <div className="absolute left-[35%] top-[30%] h-[360px] w-[360px] rounded-full bg-blue-700/10 blur-[120px]" />

          <div className="absolute bottom-[-100px] right-[20%] h-[250px] w-[450px] rounded-full bg-fuchsia-600/10 blur-[100px]" />

          <span className="absolute left-[6%] top-[18%] text-sm text-violet-400">
            ✦
          </span>

          <span className="absolute left-[35%] top-[12%] text-xs text-blue-400">
            ✦
          </span>

          <span className="absolute left-[45%] top-[32%] text-lg text-violet-500">
            ✦
          </span>

          <span className="absolute right-[8%] top-[22%] text-xs text-fuchsia-400">
            ✦
          </span>

          <span className="absolute right-[16%] top-[55%] text-sm text-blue-400">
            ✦
          </span>
        </div>

        <div
          className="
            relative
            mx-auto
            grid
            max-w-[1380px]
            items-center
            px-5
            pb-8
            pt-8
            sm:px-7
            sm:pb-10
            sm:pt-10
            md:pt-12
            lg:min-h-[500px]
            lg:grid-cols-[0.82fr_1.18fr]
            lg:px-10
            lg:pb-0
            lg:pt-0
          "
        >
          {/* LEFT HERO */}
          <div
            className="
              relative
              z-20
              py-5
              text-center
              sm:py-8
              lg:py-14
              lg:text-left
            "
          >
            <div
              className="
                mb-4
                flex
                items-center
                justify-center
                gap-2
                text-[10px]
                font-bold
                tracking-[0.08em]
                text-slate-300
                sm:text-[11px]
                lg:justify-start
              "
            >
              <Sparkles
                size={14}
                className="text-fuchsia-400"
              />

              STUDENTS SPEAK. PARTICIPATE. EARN.
            </div>

            <h1
              className="
                mx-auto
                max-w-[600px]
                text-[39px]
                font-black
                leading-[0.98]
                tracking-[-0.045em]
                text-white
                min-[400px]:text-[43px]
                sm:text-[55px]
                md:text-[64px]
                lg:mx-0
                lg:text-[62px]
                xl:text-[70px]
              "
            >
              Join events.
              <br />

              Earn points.
              <br />

              <span
                className="
                  bg-gradient-to-r
                  from-fuchsia-500
                  via-violet-500
                  to-blue-500
                  bg-clip-text
                  text-transparent
                "
              >
                Unlock rewards.
              </span>

              <Zap
                size={31}
                fill="currentColor"
                className="ml-1 inline text-violet-500 sm:ml-2 sm:size-[34px]"
              />
            </h1>

            <p
              className="
                mx-auto
                mt-5
                max-w-[530px]
                text-[13px]
                leading-6
                text-slate-400
                sm:mt-6
                sm:text-[15px]
                sm:leading-7
                lg:mx-0
              "
            >
              CHORD is the student community for events,
              volunteering, competitions, campus activities and
              meaningful experiences. Participate, earn verified
              points and unlock exciting rewards.
            </p>

            {/* HERO BUTTONS */}
            <div
              className="
                mt-6
                flex
                flex-row
                justify-center
                gap-2
                sm:mt-7
                sm:gap-3
                lg:justify-start
              "
            >
              <Link
                to="/register"
                className="
                  inline-flex
                  h-11
                  min-w-0
                  items-center
                  justify-center
                  gap-1.5
                  rounded-xl
                  bg-gradient-to-r
                  from-violet-600
                  via-purple-600
                  to-fuchsia-600
                  px-4
                  text-[12px]
                  font-bold
                  text-white
                  shadow-[0_0_35px_rgba(124,58,237,0.38)]
                  transition
                  duration-300
                  hover:-translate-y-1
                  hover:shadow-[0_0_45px_rgba(124,58,237,0.55)]
                  sm:h-12
                  sm:gap-2
                  sm:px-7
                  sm:text-sm
                "
              >
                Join CHORD

                <ArrowRight
                  size={15}
                  className="shrink-0"
                />
              </Link>

              <Link
                to="/about"
                className="
                  inline-flex
                  h-11
                  min-w-0
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-white/10
                  bg-white/[0.025]
                  px-4
                  text-[12px]
                  font-semibold
                  text-slate-200
                  transition
                  hover:border-violet-500/30
                  hover:bg-white/[0.05]
                  sm:h-12
                  sm:gap-3
                  sm:px-7
                  sm:text-sm
                "
              >
                <Play
                  size={14}
                  className="shrink-0"
                />

                Learn More
              </Link>
            </div>
          </div>

          {/* RIGHT HERO IMAGE */}
          <div
            className="
              relative
              z-10
              flex
              min-h-[250px]
              items-end
              justify-center
              sm:min-h-[330px]
              lg:min-h-[500px]
              lg:justify-end
            "
          >
            <div className="absolute bottom-[3%] right-[5%] h-[65%] w-[75%] rounded-full bg-gradient-to-r from-violet-700/20 via-blue-700/20 to-fuchsia-700/20 blur-[70px]" />

            <Zap
              size={80}
              fill="currentColor"
              className="absolute left-[3%] top-[18%] hidden rotate-12 text-violet-600/50 lg:block"
            />

            <Zap
              size={70}
              fill="currentColor"
              className="absolute right-[4%] top-[7%] hidden -rotate-12 text-fuchsia-600/50 xl:block"
            />

            <img
              src={heroRight}
              alt="CHORD students"
              className="
                relative
                z-10
                block
                w-full
                max-w-[580px]
                object-contain
                object-bottom
                drop-shadow-[0_20px_50px_rgba(89,34,255,0.18)]
                sm:max-w-[680px]
                lg:max-h-[500px]
                lg:max-w-[760px]
              "
            />
          </div>
        </div>
      </section>

      {/* ======================================================
          HOW CHORD WORKS
      ====================================================== */}
      <section
        className="
          relative
          bg-[#050818]
          px-3
          pb-12
          sm:px-6
          sm:pb-14
          lg:px-8
        "
      >
        <div
          className="
            mx-auto
            max-w-[1240px]
            rounded-[20px]
            border
            border-violet-500/[0.16]
            bg-gradient-to-b
            from-[#0a0e24]
            to-[#070a1c]
            p-3
            shadow-[0_0_80px_rgba(70,35,180,0.08)]
            sm:rounded-[26px]
            sm:p-6
          "
        >
          {/* HEADING */}
          <div className="mb-5 text-center">
            <h2 className="text-[19px] font-extrabold text-white sm:text-2xl">
              How{' '}

              <span
                className="
                  bg-gradient-to-r
                  from-violet-500
                  to-fuchsia-500
                  bg-clip-text
                  text-transparent
                "
              >
                CHORD
              </span>{' '}

              Works
            </h2>
          </div>

          {/* ==================================================
              STEPS
          ================================================== */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
            {steps.map((step, index) => {
              const Icon = step.icon

              const iconClasses = [
                'grid',
                'h-9',
                'w-9',
                'place-items-center',
                'rounded-lg',
                'bg-gradient-to-br',
                step.gradient,
                'text-white',
                'shadow-lg',
                'sm:h-11',
                'sm:w-11',
                'sm:rounded-xl',
              ].join(' ')

              const numberClasses = [
                'absolute',
                'bottom-2',
                'right-2',
                'text-[21px]',
                'font-black',
                'sm:bottom-3',
                'sm:right-4',
                'sm:text-[28px]',
                step.numberColor,
              ].join(' ')

              return (
                <div
                  key={step.number}
                  className="relative min-w-0"
                >
                  <div
                    className="
                      group
                      relative
                      h-full
                      min-h-[170px]
                      overflow-hidden
                      rounded-xl
                      border
                      border-white/[0.08]
                      bg-[#0b0f25]
                      p-3
                      transition
                      duration-300
                      hover:-translate-y-1
                      hover:border-violet-500/30
                      hover:bg-[#0e122c]
                      sm:min-h-[155px]
                      sm:rounded-2xl
                      sm:p-5
                    "
                  >
                    {/* ICON */}
                    <div className={iconClasses}>
                      <Icon
                        size={18}
                        className="sm:size-[21px]"
                      />
                    </div>

                    {/* TEXT */}
                    <div className="mt-3 sm:mt-4 sm:pr-8">
                      <h3 className="text-[12px] font-bold leading-4 text-white sm:text-[15px] sm:leading-5">
                        {step.title}
                      </h3>

                      <p className="mt-1.5 text-[10px] leading-[15px] text-slate-400 sm:mt-2 sm:text-[12px] sm:leading-5">
                        {step.description}
                      </p>
                    </div>

                    {/* NUMBER */}
                    <span className={numberClasses}>
                      {step.number}
                    </span>
                  </div>

                  {/* DESKTOP ARROW */}
                  {index !== steps.length - 1 && (
                    <ChevronRight
                      size={26}
                      className="absolute -right-[21px] top-1/2 z-10 hidden -translate-y-1/2 text-violet-600 lg:block"
                    />
                  )}
                </div>
              )
            })}
          </div>


          {/* ==================================================
    EARN POINTS & UNLOCK REWARDS
================================================== */}
          <div
            className="
    relative
    mt-4
    overflow-hidden
    rounded-2xl
    border
    border-violet-500/[0.18]
    bg-[#090c20]
    px-4
    py-6

    sm:px-6
    sm:py-7

    lg:px-8
    lg:py-8
  "
          >
            {/* BACKGROUND GLOW */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(124,58,237,0.14),transparent_38%)]" />

            <div
              className="
      relative
      grid
      items-center
      gap-7

      lg:grid-cols-[230px_1fr]
      lg:gap-10
    "
            >
              {/* LEFT TEXT */}
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center gap-3 lg:justify-start">
                  <h3
                    className="
            text-[20px]
            font-black
            leading-tight
            text-white

            sm:text-[24px]
          "
                  >
                    Earn Points &
                    <br />
                    Unlock Rewards
                  </h3>

                  <Zap
                    size={34}
                    fill="currentColor"
                    className="rotate-12 text-fuchsia-500 sm:size-[38px]"
                  />
                </div>

                <p
                  className="
          mx-auto
          mt-3
          max-w-[310px]
          text-[12px]
          leading-5
          text-slate-400

          sm:text-[13px]
          sm:leading-6

          lg:mx-0
          lg:max-w-[220px]
        "
                >
                  Get points for your impact. Use points to unlock exciting rewards
                  and perks.
                </p>

                <Link
                  to="/rewards"
                  className="
          mt-5
          inline-flex
          h-10
          items-center
          justify-center
          rounded-lg
          border
          border-violet-500/50
          px-5

          text-[12px]
          font-semibold
          text-violet-300

          transition
          duration-300

          hover:border-violet-400
          hover:bg-violet-500/10
          hover:text-white
        "
                >
                  View Rewards
                </Link>
              </div>

              {/* =================================================
        REWARD PROGRESSION

        MOBILE = 2 PER ROW
        TABLET/DESKTOP = 4 PER ROW
    ================================================= */}
              <div
                className="
        grid
        grid-cols-2
        gap-x-4
        gap-y-8

        sm:gap-x-6
        sm:gap-y-8

        md:grid-cols-4

        lg:gap-6
      "
              >
                {rewardProgression.map((reward, index) => {
                  const circleClasses = [
                    'group',
                    'relative',
                    'mx-auto',
                    'flex',

                    'h-[125px]',
                    'w-[125px]',

                    'items-center',
                    'justify-center',
                    'overflow-hidden',

                    'rounded-full',

                    'border',
                    reward.borderClass,

                    'bg-[#0c1129]',

                    'shadow-[0_15px_35px_rgba(0,0,0,0.28)]',

                    'transition',
                    'duration-300',

                    'hover:-translate-y-1',
                    'hover:scale-[1.04]',

                    'min-[380px]:h-[138px]',
                    'min-[380px]:w-[138px]',

                    'sm:h-[150px]',
                    'sm:w-[150px]',

                    'md:h-[140px]',
                    'md:w-[140px]',

                    'lg:h-[155px]',
                    'lg:w-[155px]',

                    'xl:h-[165px]',
                    'xl:w-[165px]',
                  ].join(' ')

                  const imageClasses = [
                    'relative',
                    'z-10',

                    'h-[100px]',
                    'w-[100px]',

                    'object-contain',

                    'drop-shadow-[0_12px_22px_rgba(0,0,0,0.4)]',

                    'transition',
                    'duration-300',

                    'group-hover:scale-110',

                    'min-[380px]:h-[112px]',
                    'min-[380px]:w-[112px]',

                    'sm:h-[122px]',
                    'sm:w-[122px]',

                    'md:h-[112px]',
                    'md:w-[112px]',

                    'lg:h-[128px]',
                    'lg:w-[128px]',

                    'xl:h-[136px]',
                    'xl:w-[136px]',
                  ].join(' ')

                  const pointsClasses = [
                    'relative',
                    'z-20',
                    'mx-auto',

                    '-mt-3',

                    'w-fit',
                    'min-w-[86px]',

                    'rounded-full',

                    reward.pointsClass,

                    'border',
                    'border-white/[0.05]',

                    'px-3',
                    'py-2',

                    'text-[11px]',
                    'font-extrabold',
                    'tracking-[0.04em]',
                    'text-white',

                    'backdrop-blur-md',

                    'shadow-[0_6px_18px_rgba(0,0,0,0.22)]',

                    'sm:min-w-[95px]',
                    'sm:px-4',
                    'sm:text-xs',

                    'lg:min-w-[105px]',
                    'lg:py-2.5',
                  ].join(' ')

                  const arrowClasses = [
                    'absolute',

                    '-left-[20px]',
                    'top-[58px]',

                    'z-20',

                    'hidden',

                    'md:block',

                    reward.arrowClass,
                  ].join(' ')

                  const glowClasses = [
                    'absolute',
                    'inset-4',

                    'rounded-full',

                    reward.glowClass,

                    'blur-2xl',
                    'opacity-80',
                  ].join(' ')

                  return (
                    <div
                      key={reward.points}
                      className="relative min-w-0 text-center"
                    >
                      {/* ARROW BETWEEN ITEMS */}
                      {index !== 0 && (
                        <ChevronRight
                          size={27}
                          className={arrowClasses}
                        />
                      )}

                      {/* REWARD CIRCLE */}
                      <div className={circleClasses}>
                        {/* OUTER GLOW */}
                        <div className={glowClasses} />

                        {/* INNER SOFT BACKGROUND */}
                        <div
                          className="
                  pointer-events-none
                  absolute
                  inset-[7px]
                  rounded-full
                  border
                  border-white/[0.06]
                  bg-white/[0.015]
                "
                        />

                        {/* IMAGE */}
                        <img
                          src={reward.image}
                          alt={reward.alt}
                          className={imageClasses}
                        />
                      </div>

                      {/* POINTS */}
                      <div className={pointsClasses}>
                        {reward.points}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>



          {/* ==================================================
              STATS
          ================================================== */}
          <div className="mt-4 grid grid-cols-2 lg:grid-cols-4">
            {stats.map(
              (
                {
                  icon: Icon,
                  label,
                  value,
                  caption,
                },
                index
              ) => {
                const statClasses = [
                  'flex',
                  'min-w-0',
                  'items-center',
                  'gap-2',
                  'border-white/[0.07]',
                  'px-2',
                  'py-4',
                  'sm:gap-4',
                  'sm:px-5',
                  'sm:py-5',
                  index % 2 === 0 ? 'border-r' : '',
                  index < 2
                    ? 'border-b lg:border-b-0'
                    : '',
                  'lg:border-r',
                  'last:lg:border-r-0',
                ]
                  .filter(Boolean)
                  .join(' ')

                return (
                  <div
                    key={label}
                    className={statClasses}
                  >
                    <Icon
                      size={25}
                      strokeWidth={1.5}
                      className="shrink-0 text-slate-400 sm:size-[32px]"
                    />

                    <div className="min-w-0">
                      <p className="truncate text-[9px] text-slate-400 sm:text-[11px]">
                        {label}
                      </p>

                      <p className="mt-0.5 text-[15px] font-extrabold text-white sm:text-xl">
                        {value}
                      </p>

                      <p className="truncate text-[9px] text-slate-500 sm:text-[11px]">
                        {caption}
                      </p>
                    </div>
                  </div>
                )
              }
            )}
          </div>
        </div>
      </section>

      {/* ======================================================
          UPCOMING EVENTS
      ====================================================== */}
      <section
        className="
          relative
          bg-[#050818]
          px-3
          pb-12
          sm:px-6
          sm:pb-14
          lg:px-8
        "
      >
        <div className="mx-auto max-w-[1240px]">
          {/* SECTION HEADING */}
          <div className="mb-5 flex items-end justify-between gap-3 sm:mb-7">
            <div>
              <div className="flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-violet-500/10 text-violet-400 sm:h-8 sm:w-8">
                  <CalendarCheck size={16} />
                </span>

                <span className="text-[10px] font-extrabold tracking-[0.12em] text-violet-400 sm:text-xs">
                  UPCOMING
                </span>
              </div>

              <h2 className="mt-2 text-[21px] font-black text-white sm:text-3xl">
                Explore Events
              </h2>

              <p className="mt-1 hidden text-sm text-slate-500 sm:block">
                Discover activities, competitions, volunteering
                and campus experiences.
              </p>
            </div>

            <Link
              to="/events"
              className="
                flex
                shrink-0
                items-center
                gap-1
                text-[11px]
                font-bold
                text-violet-400
                transition
                hover:text-violet-300
                sm:text-sm
              "
            >
              View all

              <ArrowRight size={14} />
            </Link>
          </div>

          {/* EVENTS */}
          {data?.events?.length ? (
            <div
              className="
                grid
                grid-cols-2
                gap-2.5
                sm:gap-4
                lg:grid-cols-3
                xl:gap-5
              "
            >
              {data.events.map(
                (event: any) => (
                  <div
                    key={event.id}
                    className="min-w-0"
                  >
                    <EventCard
                      event={event}
                    />
                  </div>
                )
              )}
            </div>
          ) : (
            <div
              className="
                rounded-2xl
                border
                border-dashed
                border-white/10
                bg-white/[0.025]
                py-10
                text-center
                text-sm
                text-slate-500
              "
            >
              No published events yet.
            </div>
          )}
        </div>
      </section>

      {/* ======================================================
          REWARDS
      ====================================================== */}
      <section
        className="
          relative
          overflow-hidden
          bg-[#050818]
          px-3
          pb-8
          sm:px-6
          sm:pb-12
          lg:px-8
        "
      >
        <div className="pointer-events-none absolute bottom-0 left-[20%] h-[220px] w-[420px] rounded-full bg-violet-700/[0.07] blur-[110px]" />

        <div className="relative mx-auto max-w-[1240px]">
          {/* SECTION HEADING */}
          <div className="mb-5 flex items-end justify-between gap-3 sm:mb-7">
            <div>
              <div className="flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-fuchsia-500/10 text-fuchsia-400 sm:h-8 sm:w-8">
                  <Gift size={16} />
                </span>

                <span className="text-[10px] font-extrabold tracking-[0.12em] text-fuchsia-400 sm:text-xs">
                  REWARDS
                </span>
              </div>

              <h2 className="mt-2 text-[21px] font-black text-white sm:text-3xl">
                Unlock Rewards
              </h2>

              <p className="mt-1 hidden text-sm text-slate-500 sm:block">
                Use your verified participation points to
                redeem exciting rewards.
              </p>
            </div>

            <Link
              to="/rewards"
              className="
                flex
                shrink-0
                items-center
                gap-1
                text-[11px]
                font-bold
                text-fuchsia-400
                transition
                hover:text-fuchsia-300
                sm:text-sm
              "
            >
              View all

              <ArrowRight size={14} />
            </Link>
          </div>

          {/* REWARD CARDS */}
          {data?.rewards?.length ? (
            <div
              className="
                grid
                grid-cols-2
                gap-2.5
                sm:gap-4
                lg:grid-cols-3
                xl:gap-5
              "
            >
              {data.rewards.map(
                (reward: any) => (
                  <div
                    key={reward.id}
                    className="min-w-0"
                  >
                    <RewardCard
                      reward={reward}
                    />
                  </div>
                )
              )}
            </div>
          ) : (
            <div
              className="
                rounded-2xl
                border
                border-dashed
                border-white/10
                bg-white/[0.025]
                py-10
                text-center
                text-sm
                text-slate-500
              "
            >
              No rewards available yet.
            </div>
          )}
        </div>
      </section>
    </>
  )
}


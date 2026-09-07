import {
  ArrowRight,
  Award,
  BookOpen,
  CalendarDays,
  Coins,
  Gift,
  Sparkles,
  Trophy,
} from 'lucide-react'

import { Link } from 'react-router-dom'

import {
  ApiError,
  ApiLoading,
} from '@/components/common/ApiState'

import { useAsyncData } from '@/hooks/useAsyncData'

import { api } from '@/services/api'

import {
  mapEvent,
  mapPoint,
} from '@/services/mappers'

import { useAuth } from '@/features/auth/AuthContext'

export function DashboardPage() {
  const {
    user,
  } = useAuth()

  const {
    data,
    loading,
    error,
  } = useAsyncData(
    async () => {
      const body: any = await api(
        '/dashboard/student',
        {
          auth: true,
        }
      )

      return {
        points: Number(
          body?.data?.user
            ?.pointsBalance || 0
        ),

        eventsJoined: Number(
          body?.data?.stats
            ?.eventsJoined || 0
        ),

        eventsCompleted: Number(
          body?.data?.stats
            ?.eventsCompleted || 0
        ),

        rewardsRedeemed: Number(
          body?.data?.stats
            ?.rewardsRedeemed || 0
        ),

        activeBorrows: Number(
          body?.data?.stats
            ?.activeBorrows || 0
        ),

        upcomingEvents: (
          body?.data
            ?.upcomingEvents || []
        ).map(mapEvent),

        recentPoints: (
          body?.data
            ?.recentPoints || []
        ).map(mapPoint),
      }
    },
    [user?.id]
  )

  if (loading) {
    return (
      <div className="py-10">
        <ApiLoading />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="py-10">
        <ApiError
          message={
            error ||
            'Unable to load dashboard'
          }
        />
      </div>
    )
  }

  const stats = [
    {
      label: 'Available points',
      value:
        data.points.toLocaleString(),
      icon: Coins,

      iconClass:
        'text-violet-100',

      iconBg:
        'bg-violet-400/18',

      cardBg:
        'from-violet-600/[0.26] via-purple-600/[0.13] to-[#0b1024]',

      border:
        'border-violet-400/25',

      glow:
        'bg-violet-500/28',
    },

    {
      label: 'Events joined',
      value:
        data.eventsJoined,
      icon: CalendarDays,

      iconClass:
        'text-blue-100',

      iconBg:
        'bg-blue-400/18',

      cardBg:
        'from-blue-600/[0.26] via-indigo-600/[0.13] to-[#0b1024]',

      border:
        'border-blue-400/25',

      glow:
        'bg-blue-500/28',
    },

    {
      label: 'Events completed',
      value:
        data.eventsCompleted,
      icon: Award,

      iconClass:
        'text-fuchsia-100',

      iconBg:
        'bg-fuchsia-400/18',

      cardBg:
        'from-fuchsia-600/[0.26] via-pink-600/[0.13] to-[#0b1024]',

      border:
        'border-fuchsia-400/25',

      glow:
        'bg-fuchsia-500/28',
    },

    {
      label: 'Active book borrows',
      value:
        data.activeBorrows,
      icon: BookOpen,

      iconClass:
        'text-cyan-100',

      iconBg:
        'bg-cyan-400/18',

      cardBg:
        'from-cyan-600/[0.26] via-sky-600/[0.13] to-[#0b1024]',

      border:
        'border-cyan-400/25',

      glow:
        'bg-cyan-500/28',
    },

    {
      label: 'Rewards redeemed',
      value:
        data.rewardsRedeemed,
      icon: Gift,

      iconClass:
        'text-emerald-100',

      iconBg:
        'bg-emerald-400/18',

      cardBg:
        'from-emerald-600/[0.26] via-teal-600/[0.13] to-[#0b1024]',

      border:
        'border-emerald-400/25',

      glow:
        'bg-emerald-500/28',
    },
  ]

  return (
    <div className="w-full">
      {/* ======================================================
          HEADING
      ====================================================== */}
      <section
        className="
          mb-5

          sm:mb-7
        "
      >
        <div
          className="
            flex
            items-center
            gap-2
          "
        >
          <span
            className="
              grid
              h-7
              w-7
              place-items-center

              rounded-lg

              bg-violet-500/12

              text-violet-300
            "
          >
            <Sparkles size={14} />
          </span>

          <span
            className="
              text-[9px]
              font-extrabold
              tracking-[0.15em]

              text-violet-300

              sm:text-[10px]
            "
          >
            USER DASHBOARD
          </span>
        </div>

        <h1
          className="
            mt-3

            text-[27px]
            font-black
            leading-[1.08]
            tracking-[-0.035em]

            text-white

            min-[380px]:text-[30px]

            sm:text-[38px]

            lg:text-[42px]
          "
        >
          Welcome,{' '}

          <span
            className="
              bg-gradient-to-r
              from-violet-300
              via-fuchsia-300
              to-blue-300

              bg-clip-text
              text-transparent
            "
          >
            {user?.name || 'User'}
          </span>
        </h1>

        <p
          className="
            mt-2

            max-w-[650px]

            text-[10px]
            leading-5

            text-white/80

            min-[380px]:text-[11px]

            sm:mt-3
            sm:text-[13px]
            sm:leading-6
          "
        >
          Your events, book borrowing, points and rewards summary.
        </p>
      </section>

      {/* ======================================================
          COLORFUL STATS
      ====================================================== */}
      <section
        className="
          grid
          grid-cols-2

          gap-2

          min-[380px]:gap-2.5

          sm:gap-4

          lg:grid-cols-3

          xl:grid-cols-5
        "
      >
        {stats.map(
          ({
            label,
            value,
            icon: Icon,
            iconClass,
            iconBg,
            cardBg,
            border,
            glow,
          }) => (
            <article
              key={label}
              className={`
                group
                relative
                min-w-0
                overflow-hidden

                rounded-xl

                border

                ${border}

                bg-gradient-to-br

                ${cardBg}

                p-3

                shadow-[0_12px_35px_rgba(0,0,0,0.26)]

                transition
                duration-300

                hover:-translate-y-1
                hover:scale-[1.01]

                sm:rounded-2xl
                sm:p-4
              `}
            >
              {/* TOP GLOW */}
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

                  ${glow}
                `}
              />

              {/* BOTTOM GLOW */}
              <div
                className={`
                  pointer-events-none
                  absolute
                  -bottom-12
                  -left-10

                  h-24
                  w-24

                  rounded-full

                  opacity-50

                  blur-3xl

                  ${glow}
                `}
              />

              <div
                className="
                  relative

                  flex
                  items-center
                  gap-2.5

                  sm:gap-3
                "
              >
                {/* ICON */}
                <span
                  className={`
                    grid
                    h-10
                    w-10
                    shrink-0
                    place-items-center

                    rounded-xl

                    border
                    border-white/[0.10]

                    ${iconBg}
                    ${iconClass}

                    shadow-[0_8px_20px_rgba(0,0,0,0.18)]

                    sm:h-11
                    sm:w-11
                  `}
                >
                  <Icon
                    size={18}
                    className="sm:size-[20px]"
                  />
                </span>

                {/* CONTENT */}
                <div className="min-w-0">
                  <span
                    className="
                      block
                      truncate

                      text-[7px]
                      font-bold

                      text-white/90

                      min-[380px]:text-[8px]

                      sm:text-[10px]
                    "
                  >
                    {label}
                  </span>

                  <strong
                    className="
                      mt-0.5
                      block

                      text-[18px]
                      font-black

                      text-white

                      sm:text-[23px]
                    "
                  >
                    {value}
                  </strong>
                </div>
              </div>
            </article>
          )
        )}
      </section>

      {/* ======================================================
          LOWER SECTION
      ====================================================== */}
      <div
        className="
          mt-5

          grid
          gap-4

          sm:mt-6
          sm:gap-5

          xl:grid-cols-[1.6fr_1fr]
        "
      >
        {/* ==================================================
            UPCOMING EVENTS
        ================================================== */}
        <section
          className="
            overflow-hidden

            rounded-2xl

            border
            border-violet-500/[0.14]

            bg-gradient-to-br
            from-violet-600/[0.10]
            via-[#0d1129]
            to-[#080c1f]

            shadow-[0_14px_40px_rgba(0,0,0,0.24)]
          "
        >
          {/* HEADER */}
          <div
            className="
              flex
              items-start
              justify-between
              gap-3

              border-b
              border-white/[0.08]

              px-4
              py-4

              sm:px-5
            "
          >
            <div>
              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >
                <span
                  className="
                    grid
                    h-8
                    w-8
                    place-items-center

                    rounded-lg

                    bg-violet-500/14

                    text-violet-300
                  "
                >
                  <CalendarDays size={15} />
                </span>

                <h2
                  className="
                    text-[14px]
                    font-black

                    text-white

                    sm:text-lg
                  "
                >
                  Upcoming events
                </h2>
              </div>

              <p
                className="
                  mt-1

                  text-[8px]

                  text-white/65

                  sm:text-[10px]
                "
              >
                Published events from the backend.
              </p>
            </div>

            <Link
              to="/dashboard/events"
              className="
                flex
                shrink-0
                items-center
                gap-1

                text-[8px]
                font-bold

                text-violet-300

                transition

                hover:text-white

                sm:text-[10px]
              "
            >
              View all
              <ArrowRight size={12} />
            </Link>
          </div>

          {/* BODY */}
          <div className="px-4 sm:px-5">
            {data.upcomingEvents.length === 0 ? (
              <div
                className="
                  py-8
                  text-center
                "
              >
                <CalendarDays
                  size={30}
                  className="
                    mx-auto
                    text-violet-400/55
                  "
                />

                <h3
                  className="
                    mt-2

                    text-[11px]
                    font-bold

                    text-white
                  "
                >
                  No upcoming events
                </h3>

                <p
                  className="
                    mt-1

                    text-[9px]

                    text-white/65
                  "
                >
                  There are no upcoming published events.
                </p>
              </div>
            ) : (
              <div>
                {data.upcomingEvents.map(
                  (event) => {
                    const totalPoints =
                      event.participationPoints +
                      event.attendancePoints +
                      event.completionPoints

                    return (
                      <div
                        key={event.id}
                        className="
                          flex
                          items-center
                          justify-between
                          gap-3

                          border-b
                          border-white/[0.08]

                          py-3.5

                          last:border-b-0

                          sm:py-4
                        "
                      >
                        <div
                          className="
                            flex
                            min-w-0
                            items-center
                            gap-2.5

                            sm:gap-3
                          "
                        >
                          <span
                            className="
                              grid
                              h-9
                              w-9
                              shrink-0
                              place-items-center

                              rounded-xl

                              bg-violet-500/14

                              text-violet-300

                              sm:h-10
                              sm:w-10
                            "
                          >
                            <CalendarDays
                              size={15}
                            />
                          </span>

                          <div className="min-w-0">
                            <strong
                              className="
                                block
                                truncate

                                text-[10px]
                                font-bold

                                text-white

                                min-[380px]:text-[11px]

                                sm:text-[13px]
                              "
                            >
                              {event.title}
                            </strong>

                            <small
                              className="
                                mt-1
                                block
                                truncate

                                text-[7px]

                                text-white/60

                                min-[380px]:text-[8px]

                                sm:text-[10px]
                              "
                            >
                              {new Date(
                                event.startDate
                              ).toLocaleString()}
                            </small>
                          </div>
                        </div>

                        <span
                          className="
                            inline-flex
                            shrink-0
                            items-center
                            gap-1

                            rounded-full

                            border
                            border-violet-400/20

                            bg-violet-500/[0.10]

                            px-2
                            py-1

                            text-[7px]
                            font-extrabold

                            text-white

                            min-[380px]:text-[8px]

                            sm:px-2.5
                            sm:py-1.5
                            sm:text-[10px]
                          "
                        >
                          <Trophy size={9} />

                          {totalPoints}

                          <span className="hidden min-[400px]:inline">
                            pts
                          </span>
                        </span>
                      </div>
                    )
                  }
                )}
              </div>
            )}
          </div>
        </section>

        {/* ==================================================
            RECENT POINTS
        ================================================== */}
        <section
          className="
            overflow-hidden

            rounded-2xl

            border
            border-emerald-500/[0.14]

            bg-gradient-to-br
            from-emerald-600/[0.09]
            via-[#0d1129]
            to-[#080c1f]

            shadow-[0_14px_40px_rgba(0,0,0,0.24)]
          "
        >
          {/* HEADER */}
          <div
            className="
              border-b
              border-white/[0.08]

              px-4
              py-4

              sm:px-5
            "
          >
            <div
              className="
                flex
                items-center
                gap-2
              "
            >
              <span
                className="
                  grid
                  h-8
                  w-8
                  place-items-center

                  rounded-lg

                  bg-emerald-500/14

                  text-emerald-300
                "
              >
                <Coins size={15} />
              </span>

              <h2
                className="
                  text-[14px]
                  font-black

                  text-white

                  sm:text-lg
                "
              >
                Recent points
              </h2>
            </div>

            <p
              className="
                mt-1

                text-[8px]

                text-white/65

                sm:text-[10px]
              "
            >
              Latest wallet activity.
            </p>
          </div>

          {/* BODY */}
          <div className="px-4 sm:px-5">
            {data.recentPoints.length === 0 ? (
              <div
                className="
                  py-8
                  text-center
                "
              >
                <Coins
                  size={30}
                  className="
                    mx-auto
                    text-emerald-400/55
                  "
                />

                <p
                  className="
                    mt-2

                    text-[9px]

                    text-white/65

                    sm:text-[10px]
                  "
                >
                  No point transactions yet.
                </p>
              </div>
            ) : (
              <div>
                {data.recentPoints.map(
                  (transaction) => {
                    const isCredit =
                      transaction.type ===
                      'credit'

                    return (
                      <div
                        key={transaction.id}
                        className="
                          flex
                          items-center
                          justify-between
                          gap-3

                          border-b
                          border-white/[0.08]

                          py-3.5

                          last:border-b-0

                          sm:py-4
                        "
                      >
                        <div
                          className="
                            flex
                            min-w-0
                            items-center
                            gap-2.5
                          "
                        >
                          <span
                            className={`
                              grid
                              h-8
                              w-8
                              shrink-0
                              place-items-center

                              rounded-lg

                              ${
                                isCredit
                                  ? 'bg-emerald-500/14 text-emerald-300'
                                  : 'bg-rose-500/14 text-rose-300'
                              }
                            `}
                          >
                            <Coins size={14} />
                          </span>

                          <div className="min-w-0">
                            <strong
                              className="
                                block
                                truncate

                                text-[9px]
                                font-bold

                                text-white

                                min-[380px]:text-[10px]

                                sm:text-xs
                              "
                            >
                              {transaction.description}
                            </strong>

                            <small
                              className="
                                mt-1
                                block
                                truncate

                                text-[7px]

                                text-white/60

                                min-[380px]:text-[8px]

                                sm:text-[9px]
                              "
                            >
                              {new Date(
                                transaction.date
                              ).toLocaleString()}
                            </small>
                          </div>
                        </div>

                        <strong
                          className={`
                            shrink-0

                            text-[10px]
                            font-black

                            sm:text-xs

                            ${
                              isCredit
                                ? 'text-emerald-300'
                                : 'text-rose-300'
                            }
                          `}
                        >
                          {isCredit
                            ? '+'
                            : '-'}
                          {transaction.points}
                        </strong>
                      </div>
                    )
                  }
                )}
              </div>
            )}
          </div>
        </section>
      </div>

      <div className="h-4 sm:h-0" />
    </div>
  )
}
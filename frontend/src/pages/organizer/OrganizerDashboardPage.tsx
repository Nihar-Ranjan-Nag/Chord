import {
  ArrowRight,
  BookOpen,
  CalendarCheck2,
  CalendarDays,
  CheckCircle2,
  Plus,
  RotateCcw,
  Sparkles,
  Users,
} from 'lucide-react'

import { Link } from 'react-router-dom'

import {
  ApiError,
  ApiLoading,
} from '@/components/common/ApiState'

import { useAsyncData } from '@/hooks/useAsyncData'

import { api } from '@/services/api'

import { mapEvent } from '@/services/mappers'

export function OrganizerDashboardPage() {
  const {
    data,
    loading,
    error,
  } = useAsyncData(
    async () => {
      const body: any =
        await api(
          '/dashboard/organizer',
          {
            auth: true,
          }
        )

      return {
        stats:
          body?.data?.stats ||
          {},

        recentEvents:
          (
            body?.data
              ?.recentEvents ||
            []
          ).map(mapEvent),
      }
    },
    []
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
            'Unable to load organizer dashboard'
          }
        />
      </div>
    )
  }

  const stats = data.stats

  const statCards = [
    {
      label: 'Total events',
      value: Number(
        stats.totalEvents || 0
      ).toLocaleString(),
      icon: CalendarDays,
      iconClass:
        'text-violet-100',
      iconBg:
        'bg-violet-400/15',
      cardBg:
        'from-violet-600/[0.24] via-purple-600/[0.10] to-[#0b1024]',
      border:
        'border-violet-400/20',
      glow:
        'bg-violet-500/24',
    },

    {
      label: 'Published',
      value: Number(
        stats.publishedEvents ||
          0
      ).toLocaleString(),
      icon: CalendarCheck2,
      iconClass:
        'text-blue-100',
      iconBg:
        'bg-blue-400/15',
      cardBg:
        'from-blue-600/[0.24] via-indigo-600/[0.10] to-[#0b1024]',
      border:
        'border-blue-400/20',
      glow:
        'bg-blue-500/24',
    },

    {
      label: 'Registrations',
      value: Number(
        stats.totalRegistrations ||
          0
      ).toLocaleString(),
      icon: Users,
      iconClass:
        'text-fuchsia-100',
      iconBg:
        'bg-fuchsia-400/15',
      cardBg:
        'from-fuchsia-600/[0.24] via-pink-600/[0.10] to-[#0b1024]',
      border:
        'border-fuchsia-400/20',
      glow:
        'bg-fuchsia-500/24',
    },

    {
      label: 'Completed',
      value: Number(
        stats.completedUsers || 0
      ).toLocaleString(),
      icon: CheckCircle2,
      iconClass:
        'text-emerald-100',
      iconBg:
        'bg-emerald-400/15',
      cardBg:
        'from-emerald-600/[0.24] via-teal-600/[0.10] to-[#0b1024]',
      border:
        'border-emerald-400/20',
      glow:
        'bg-emerald-500/24',
    },

    {
      label: 'Books',
      value: Number(
        stats.totalBooks || 0
      ).toLocaleString(),
      icon: BookOpen,
      iconClass:
        'text-cyan-100',
      iconBg:
        'bg-cyan-400/15',
      cardBg:
        'from-cyan-600/[0.24] via-sky-600/[0.10] to-[#0b1024]',
      border:
        'border-cyan-400/20',
      glow:
        'bg-cyan-500/24',
    },

    {
      label: 'Active borrows',
      value: Number(
        stats.activeBorrows || 0
      ).toLocaleString(),
      icon: BookOpen,
      iconClass:
        'text-amber-100',
      iconBg:
        'bg-amber-400/15',
      cardBg:
        'from-amber-600/[0.22] via-orange-600/[0.09] to-[#0b1024]',
      border:
        'border-amber-400/20',
      glow:
        'bg-amber-500/22',
    },

    {
      label: 'Return requests',
      value: Number(
        stats.returnRequests || 0
      ).toLocaleString(),
      icon: RotateCcw,
      iconClass:
        'text-rose-100',
      iconBg:
        'bg-rose-400/15',
      cardBg:
        'from-rose-600/[0.22] via-pink-600/[0.09] to-[#0b1024]',
      border:
        'border-rose-400/20',
      glow:
        'bg-rose-500/22',
    },

    {
      label: 'Upcoming events',
      value: Number(
        stats.upcomingEvents || 0
      ).toLocaleString(),
      icon: CalendarDays,
      iconClass:
        'text-indigo-100',
      iconBg:
        'bg-indigo-400/15',
      cardBg:
        'from-indigo-600/[0.24] via-violet-600/[0.10] to-[#0b1024]',
      border:
        'border-indigo-400/20',
      glow:
        'bg-indigo-500/24',
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

              bg-violet-500/10

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
            ORGANIZER WORKSPACE
          </span>
        </div>

        <div
          className="
            mt-3

            flex
            flex-col
            gap-4

            sm:flex-row
            sm:items-end
            sm:justify-between
          "
        >
          <div className="min-w-0">
            <h1
              className="
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
              Management{' '}

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
                center
              </span>
            </h1>

            <p
              className="
                mt-2
                max-w-[720px]

                text-[10px]
                leading-5

                text-white/80

                min-[380px]:text-[11px]

                sm:mt-3
                sm:text-[13px]
                sm:leading-6
              "
            >
              Create and update events, manage books, track registrations, returns and refunds.
            </p>
          </div>

          {/* CREATE EVENT */}
          <Link
            to="/organizer/events/create"
            className="
              inline-flex
              h-10
              w-full
              shrink-0
              items-center
              justify-center
              gap-2

              rounded-xl

              bg-gradient-to-r
              from-violet-600
              via-purple-600
              to-blue-600

              px-4

              text-[10px]
              font-extrabold

              text-white

              shadow-[0_10px_30px_rgba(124,58,237,0.22)]

              transition

              hover:-translate-y-0.5

              sm:h-11
              sm:w-auto
              sm:px-5
              sm:text-xs
            "
          >
            <Plus size={15} />

            Create event
          </Link>
        </div>
      </section>

      {/* ======================================================
          STATS
          MOBILE = 2 PER ROW
          DESKTOP = 4 PER ROW
      ====================================================== */}
      <section
        className="
          grid
          grid-cols-2

          gap-2.5

          min-[380px]:gap-3

          sm:gap-4

          lg:grid-cols-4
        "
      >
        {statCards.map(
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

                shadow-[0_12px_35px_rgba(0,0,0,0.24)]

                transition
                duration-300

                hover:-translate-y-1

                sm:rounded-2xl
                sm:p-4
              `}
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
                <span
                  className={`
                    grid
                    h-10
                    w-10
                    shrink-0
                    place-items-center

                    rounded-xl

                    border
                    border-white/[0.08]

                    ${iconBg}
                    ${iconClass}

                    sm:h-11
                    sm:w-11
                  `}
                >
                  <Icon
                    size={18}
                    className="sm:size-[20px]"
                  />
                </span>

                <div className="min-w-0">
                  <span
                    className="
                      block
                      truncate

                      text-[7px]
                      font-bold

                      text-white/85

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
          RECENT EVENTS
      ====================================================== */}
      <section
        className="
          mt-5
          overflow-hidden

          rounded-2xl

          border
          border-white/[0.08]

          bg-gradient-to-br
          from-violet-600/[0.08]
          via-[#0d1129]
          to-[#080c1f]

          shadow-[0_14px_40px_rgba(0,0,0,0.24)]

          sm:mt-6
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
            border-white/[0.07]

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

                  bg-violet-500/10

                  text-violet-300
                "
              >
                <CalendarDays
                  size={15}
                />
              </span>

              <h2
                className="
                  text-[14px]
                  font-black

                  text-white

                  sm:text-lg
                "
              >
                Recent events
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
              Your latest event activity.
            </p>
          </div>

          <Link
            to="/organizer/events"
            className="
              inline-flex
              shrink-0
              items-center
              gap-1

              text-[8px]
              font-extrabold

              text-violet-300

              transition

              hover:text-white

              sm:text-[10px]
            "
          >
            Manage all

            <ArrowRight
              size={11}
            />
          </Link>
        </div>

        {/* BODY */}
        <div className="px-4 sm:px-5">
          {data.recentEvents.length ===
          0 ? (
            <div
              className="
                py-10
                text-center
              "
            >
              <span
                className="
                  mx-auto
                  grid
                  h-11
                  w-11
                  place-items-center

                  rounded-xl

                  bg-violet-500/10

                  text-violet-300
                "
              >
                <CalendarDays
                  size={20}
                />
              </span>

              <h3
                className="
                  mt-3

                  text-[12px]
                  font-black

                  text-white
                "
              >
                No events yet
              </h3>

              <p
                className="
                  mt-1

                  text-[9px]

                  text-white/65
                "
              >
                Create your first organizer event.
              </p>

              <Link
                to="/organizer/events/create"
                className="
                  mt-4

                  inline-flex
                  h-9
                  items-center
                  justify-center
                  gap-1.5

                  rounded-xl

                  bg-gradient-to-r
                  from-violet-600
                  to-blue-600

                  px-4

                  text-[9px]
                  font-extrabold

                  text-white
                "
              >
                <Plus size={13} />

                Create event
              </Link>
            </div>
          ) : (
            <div>
              {data.recentEvents.map(
                event => (
                  <div
                    key={event.id}
                    className="
                      flex
                      items-center
                      justify-between
                      gap-3

                      border-b
                      border-white/[0.07]

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

                          bg-violet-500/10

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
                            font-extrabold

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
                            font-medium

                            text-white/65

                            min-[380px]:text-[8px]

                            sm:text-[10px]
                          "
                        >
                          {event.registered}{' '}
                          registrations
                          {' • '}
                          {event.status}
                        </small>
                      </div>
                    </div>

                    <Link
                      to={`/organizer/events/${event.id}/edit`}
                      className="
                        inline-flex
                        shrink-0
                        items-center
                        gap-1

                        rounded-lg

                        border
                        border-violet-400/15

                        bg-violet-500/10

                        px-2
                        py-1.5

                        text-[7px]
                        font-extrabold

                        text-violet-200

                        transition

                        hover:bg-violet-500/20
                        hover:text-white

                        min-[380px]:text-[8px]

                        sm:px-2.5
                        sm:text-[9px]
                      "
                    >
                      Edit

                      <ArrowRight
                        size={9}
                      />
                    </Link>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </section>

      <div className="h-5" />
    </div>
  )
}
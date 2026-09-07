import {
  ArrowRight,
  CalendarDays,
  Search,
  Sparkles,
  Zap,
} from 'lucide-react'

import {
  useMemo,
  useState,
} from 'react'

import { Link } from 'react-router-dom'

import { EventCard } from '@/components/cards/EventCard'

import { ApiError } from '@/components/common/ApiState'

import { useAsyncData } from '@/hooks/useAsyncData'

import { api } from '@/services/api'

import { mapEvent } from '@/services/mappers'

function EventGridSkeleton() {
  return (
    <div
      className="
        grid
        grid-cols-2
        gap-2
        min-[380px]:gap-2.5
        sm:gap-4
        lg:grid-cols-3
        xl:grid-cols-4
        xl:gap-5
      "
    >
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="
            overflow-hidden
            rounded-2xl
            border
            border-white/[0.07]
            bg-[#0a0e24]
          "
        >
          <div className="aspect-[16/10] animate-pulse bg-white/[0.045]" />

          <div className="space-y-3 p-3 sm:p-4">
            <div className="h-4 w-3/4 animate-pulse rounded bg-white/[0.07]" />
            <div className="h-3 w-full animate-pulse rounded bg-white/[0.045]" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-white/[0.045]" />

            <div className="mt-4 flex items-center justify-between">
              <div className="h-7 w-20 animate-pulse rounded-lg bg-violet-500/[0.08]" />
              <div className="h-7 w-14 animate-pulse rounded-lg bg-white/[0.04]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function EventsPage() {
  const [search, setSearch] = useState('')

  const {
    data: events,
    loading,
    error,
  } = useAsyncData(
    async () => {
      const body: any = await api('/events')

      const items =
        body?.data?.items ||
        body?.data ||
        []

      return items.map(mapEvent)
    },
    []
  )

  const filteredEvents = useMemo(() => {
    if (!events) {
      return []
    }

    const value = search
      .trim()
      .toLowerCase()

    if (!value) {
      return events
    }

    return events.filter(
      (event: any) => {
        return (
          event.title
            ?.toLowerCase()
            .includes(value) ||
          event.shortDescription
            ?.toLowerCase()
            .includes(value) ||
          event.category
            ?.toLowerCase()
            .includes(value) ||
          event.location
            ?.toLowerCase()
            .includes(value)
        )
      }
    )
  }, [events, search])

  return (
    <>
      {/* ======================================================
          EVENTS
      ====================================================== */}
      <main
        className="
          relative
          overflow-hidden
          bg-[#050818]
        "
      >
        {/* BACKGROUND DECORATION */}
        <div className="pointer-events-none absolute inset-0">
          <div
            className="
              absolute
              -left-[160px]
              top-[80px]

              h-[360px]
              w-[360px]

              rounded-full

              bg-violet-700/[0.08]

              blur-[110px]
            "
          />

          <div
            className="
              absolute
              -right-[160px]
              top-[300px]

              h-[420px]
              w-[420px]

              rounded-full

              bg-fuchsia-700/[0.07]

              blur-[120px]
            "
          />
        </div>

        <div
          className="
            relative
            mx-auto
            w-full
            max-w-[1240px]

            px-3
            pb-5
            pt-7

            min-[380px]:px-4
            min-[380px]:pb-6

            sm:px-6
            sm:pb-8
            sm:pt-10

            lg:px-8
            lg:pb-9
            lg:pt-12
          "
        >
          {/* ==================================================
              HEADER
          ================================================== */}
          <div
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

                  text-violet-400

                  sm:h-8
                  sm:w-8
                "
              >
                <CalendarDays
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
                Events
              </span>
            </div>

            <h1
              className="
                mt-3
                max-w-[650px]

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
              Explore student{' '}

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
                events
              </span>
            </h1>

            <p
              className="
                mt-3
                max-w-[600px]

                text-[11px]
                leading-5

                text-slate-400

                min-[380px]:text-[12px]

                sm:text-sm
                sm:leading-6
              "
            >
              Discover activities, competitions,
              volunteering, workshops and meaningful
              campus experiences.
            </p>
          </div>

          {/* ==================================================
              SEARCH
          ================================================== */}
          <div
            className="
              relative
              mb-4

              sm:mb-6
            "
          >
            <Search
              size={15}
              className="
                absolute
                left-3
                top-1/2

                -translate-y-1/2

                text-slate-500

                sm:left-4
                sm:size-[18px]
              "
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Search events..."
              className="
                h-11
                w-full

                rounded-xl

                border
                border-white/[0.08]

                bg-[#0c1028]

                pl-10
                pr-4

                text-[11px]
                text-white

                outline-none

                transition
                duration-300

                placeholder:text-slate-600

                focus:border-violet-500/40
                focus:bg-[#0e132d]

                sm:h-12
                sm:rounded-2xl
                sm:pl-12
                sm:text-sm
              "
            />
          </div>

          {/* ==================================================
              RESULT COUNT
          ================================================== */}
          {!loading &&
            !error && (
              <div
                className="
                  mb-3

                  flex
                  items-center
                  justify-between

                  sm:mb-4
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-1.5

                    text-[9px]

                    text-slate-500

                    sm:text-xs
                  "
                >
                  <Sparkles
                    size={12}
                    className="text-violet-400"
                  />

                  <span>
                    {
                      filteredEvents.length
                    }{' '}
                    {filteredEvents.length ===
                    1
                      ? 'event'
                      : 'events'}
                  </span>
                </div>
              </div>
            )}

          {/* ==================================================
              EVENTS
          ================================================== */}
          {loading ? (
            <EventGridSkeleton />
          ) : error ? (
            <div className="py-8">
              <ApiError
                message={error}
              />
            </div>
          ) : filteredEvents.length ? (
            <div
              className="
                grid
                grid-cols-2

                gap-2

                min-[380px]:gap-2.5

                sm:gap-4

                lg:grid-cols-3

                xl:grid-cols-4
                xl:gap-5
              "
            >
              {filteredEvents.map(
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

                px-5
                py-10

                text-center

                sm:py-12
              "
            >
              <CalendarDays
                size={36}
                className="
                  mx-auto
                  text-violet-500/50
                "
              />

              <h3
                className="
                  mt-3

                  text-sm
                  font-bold

                  text-white
                "
              >
                No events found
              </h3>

              <p
                className="
                  mt-1

                  text-[11px]

                  text-slate-500
                "
              >
                Try searching with another
                keyword.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* ======================================================
          CTA
      ====================================================== */}
      <section
        className="
          relative
          overflow-hidden

          bg-[#050818]

          px-3
          pb-8
          pt-1

          min-[380px]:px-4

          sm:px-6
          sm:pb-10
          sm:pt-2

          lg:px-8
          lg:pb-12
        "
      >
        <div
          className="
            relative
            mx-auto
            max-w-[1240px]

            overflow-hidden

            rounded-2xl

            border
            border-violet-500/[0.18]

            bg-gradient-to-br
            from-[#241047]
            via-[#17102f]
            to-[#0c1028]

            px-4
            py-5

            shadow-[0_15px_50px_rgba(0,0,0,0.28)]

            sm:rounded-[24px]
            sm:px-7
            sm:py-7

            lg:px-9
            lg:py-8
          "
        >
          {/* CTA BACKGROUND GLOWS */}
          <div
            className="
              pointer-events-none
              absolute
              -right-20
              -top-20

              h-[260px]
              w-[260px]

              rounded-full

              bg-fuchsia-600/20

              blur-[90px]
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -bottom-20
              left-[25%]

              h-[220px]
              w-[300px]

              rounded-full

              bg-violet-600/15

              blur-[90px]
            "
          />

          <div
            className="
              relative

              flex
              flex-col

              gap-5

              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            {/* LEFT */}
            <div className="min-w-0">
              <div
                className="
                  flex
                  items-center
                  gap-2

                  text-[9px]
                  font-extrabold
                  uppercase
                  tracking-[0.14em]

                  text-violet-300

                  sm:text-[10px]
                "
              >
                <Sparkles
                  size={13}
                />

                Start your CHORD journey
              </div>

              <h2
                className="
                  mt-2

                  text-[21px]
                  font-black
                  leading-tight
                  tracking-[-0.025em]

                  text-white

                  min-[380px]:text-[23px]

                  sm:text-[28px]

                  lg:text-[32px]
                "
              >
                Ready to participate
                and earn?
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
                Join CHORD, discover
                student experiences,
                participate in events and
                earn verified points toward
                exciting rewards.
              </p>
            </div>

            {/* RIGHT */}
            <div
              className="
                flex
                shrink-0
                gap-2

                sm:gap-3
              "
            >
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

                  px-4

                  text-[10px]
                  font-extrabold

                  text-white

                  shadow-[0_8px_25px_rgba(124,58,237,0.3)]

                  transition
                  duration-300

                  hover:-translate-y-0.5

                  min-[380px]:px-5
                  min-[380px]:text-[11px]

                  sm:h-11
                  sm:px-6
                  sm:text-xs
                "
              >
                Join CHORD

                <ArrowRight
                  size={14}
                />
              </Link>

              <Link
                to="/rewards"
                className="
                  inline-flex
                  h-10
                  items-center
                  justify-center
                  gap-1.5

                  rounded-xl

                  border
                  border-white/10

                  bg-white/[0.04]

                  px-4

                  text-[10px]
                  font-bold

                  text-slate-300

                  transition
                  duration-300

                  hover:border-violet-400/30
                  hover:bg-white/[0.07]
                  hover:text-white

                  min-[380px]:px-5
                  min-[380px]:text-[11px]

                  sm:h-11
                  sm:px-6
                  sm:text-xs
                "
              >
                <Zap
                  size={14}
                  className="text-violet-400"
                />

                Rewards
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
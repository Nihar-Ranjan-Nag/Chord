import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  MapPin,
  Sparkles,
  Trophy,
} from 'lucide-react'

import {
  Link,
  useParams,
} from 'react-router-dom'

import {
  ApiError,
  ApiLoading,
} from '@/components/common/ApiState'

import { useAsyncData } from '@/hooks/useAsyncData'
import { api } from '@/services/api'
import { mapEvent } from '@/services/mappers'

export function EventDetailsPage() {
  const { slug } = useParams()

  const {
    data: event,
    loading,
    error,
  } = useAsyncData(
    async () => {
      const body: any = await api(`/events/${slug}`)
      return mapEvent(body.data)
    },
    [slug]
  )

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050818] px-4 py-10">
        <div className="mx-auto max-w-[1200px]">
          <ApiLoading />
        </div>
      </main>
    )
  }

  if (error || !event) {
    return (
      <main className="min-h-screen bg-[#050818] px-4 py-10">
        <div className="mx-auto max-w-[1200px]">
          <ApiError
            message={error || 'Event not found'}
          />
        </div>
      </main>
    )
  }

  const total =
    event.participationPoints +
    event.attendancePoints +
    event.completionPoints

  const startDate = new Date(event.startDate)
  const endDate = new Date(event.endDate)

  const startDateText = startDate.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  const startTimeText = startDate.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  })

  const endDateText = endDate.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  const endTimeText = endDate.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  })

  return (
    <main className="relative overflow-hidden bg-[#050818]">
      {/* =====================================================
          BACKGROUND GLOWS
      ===================================================== */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-[160px] top-[100px] h-[380px] w-[380px] rounded-full bg-violet-700/[0.08] blur-[110px]" />

        <div className="absolute -right-[180px] top-[350px] h-[430px] w-[430px] rounded-full bg-fuchsia-700/[0.07] blur-[120px]" />
      </div>

      <div
        className="
          relative
          mx-auto
          max-w-[1240px]

          px-3
          pb-8
          pt-5

          min-[380px]:px-4
          min-[380px]:pt-6

          sm:px-6
          sm:pb-10
          sm:pt-8

          lg:px-8
          lg:pb-12
          lg:pt-10
        "
      >
        {/* =====================================================
            BACK
        ===================================================== */}
        <Link
          to="/events"
          className="
            mb-4
            inline-flex
            items-center
            gap-1.5

            text-[10px]
            font-bold
            text-slate-400

            transition

            hover:text-violet-300

            sm:mb-6
            sm:text-xs
          "
        >
          <ArrowLeft size={14} />

          Back to events
        </Link>

        {/* =====================================================
            MAIN GRID
        ===================================================== */}
        <div
          className="
            grid
            gap-5

            lg:grid-cols-[minmax(0,1fr)_340px]
            lg:gap-7

            xl:grid-cols-[minmax(0,1fr)_370px]
          "
        >
          {/* ===================================================
              LEFT
          =================================================== */}
          <div className="min-w-0">
            {/* CATEGORY + POINTS */}
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="
                  inline-flex
                  max-w-full
                  items-center

                  rounded-full

                  border
                  border-violet-500/20

                  bg-violet-500/10

                  px-2.5
                  py-1

                  text-[8px]
                  font-extrabold
                  uppercase
                  tracking-[0.12em]

                  text-violet-300

                  sm:px-3
                  sm:py-1.5
                  sm:text-[10px]
                "
              >
                {event.category}
              </span>

              <span
                className="
                  inline-flex
                  items-center
                  gap-1.5

                  rounded-full

                  border
                  border-fuchsia-500/15

                  bg-fuchsia-500/[0.07]

                  px-2.5
                  py-1

                  text-[8px]
                  font-extrabold

                  text-fuchsia-300

                  sm:px-3
                  sm:py-1.5
                  sm:text-[10px]
                "
              >
                <Sparkles size={11} />

                {total} points
              </span>
            </div>

            {/* TITLE */}
            <h1
              className="
                mt-3

                text-[27px]
                font-black
                leading-[1.06]
                tracking-[-0.035em]

                text-white

                min-[380px]:text-[30px]

                sm:text-[40px]

                md:text-[46px]

                lg:text-[50px]
              "
            >
              {event.title}
            </h1>

            {/* SHORT DESCRIPTION */}
            <p
              className="
                mt-3
                max-w-[800px]

                text-[11px]
                leading-5

                text-slate-400

                min-[380px]:text-[12px]

                sm:mt-4
                sm:text-sm
                sm:leading-7
              "
            >
              {event.shortDescription}
            </p>

            {/* =================================================
                IMAGE
            ================================================= */}
            <div
              className="
                group
                relative

                mt-5

                overflow-hidden

                rounded-2xl

                border
                border-white/[0.07]

                bg-gradient-to-br
                from-[#151a3a]
                via-[#0e1431]
                to-[#17102f]

                shadow-[0_18px_50px_rgba(0,0,0,0.30)]

                sm:mt-6
                sm:rounded-[22px]
              "
            >
              {event.image ? (
                <>
                  <img
                    src={event.image}
                    alt={event.title}
                    className="
                      h-[205px]
                      w-full
                      object-cover

                      transition
                      duration-700

                      group-hover:scale-[1.02]

                      min-[380px]:h-[230px]

                      sm:h-[340px]

                      md:h-[410px]

                      lg:h-[430px]
                    "
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#050818]/55 via-transparent to-transparent" />
                </>
              ) : (
                <div
                  className="
                    relative
                    grid

                    h-[205px]

                    place-items-center

                    min-[380px]:h-[230px]

                    sm:h-[340px]

                    md:h-[410px]
                  "
                >
                  <div className="absolute h-28 w-28 rounded-full bg-violet-600/15 blur-3xl" />

                  <CalendarDays
                    size={55}
                    className="relative text-violet-400/65 sm:size-[70px]"
                  />
                </div>
              )}

              {/* IMAGE POINTS BADGE */}
              <div
                className="
                  absolute
                  bottom-2.5
                  left-2.5

                  flex
                  items-center
                  gap-1.5

                  rounded-full

                  border
                  border-white/10

                  bg-[#070a18]/80

                  px-2.5
                  py-1.5

                  text-[9px]
                  font-extrabold
                  text-white

                  backdrop-blur-md

                  sm:bottom-4
                  sm:left-4
                  sm:px-3
                  sm:py-2
                  sm:text-[11px]
                "
              >
                <Sparkles
                  size={12}
                  className="text-violet-400"
                />

                {total} Points
              </div>
            </div>

            {/* =================================================
                QUICK INFO
            ================================================= */}
            <div
              className="
                mt-4

                grid
                grid-cols-2

                gap-2

                min-[380px]:gap-2.5

                sm:mt-5
                sm:gap-4

                md:grid-cols-4
              "
            >
              {/* START DATE */}
              <div
                className="
                  rounded-xl

                  border
                  border-white/[0.07]

                  bg-[#0b0f25]

                  p-3

                  sm:rounded-2xl
                  sm:p-4
                "
              >
                <div className="grid h-7 w-7 place-items-center rounded-lg bg-violet-500/10 text-violet-400 sm:h-9 sm:w-9">
                  <CalendarDays size={14} className="sm:size-[17px]" />
                </div>

                <span className="mt-2.5 block text-[7px] font-bold uppercase tracking-wider text-slate-500 sm:text-[9px]">
                  Start date
                </span>

                <strong className="mt-1 block text-[9px] leading-4 text-white min-[380px]:text-[10px] sm:text-xs">
                  {startDateText}
                </strong>
              </div>

              {/* START TIME */}
              <div
                className="
                  rounded-xl

                  border
                  border-white/[0.07]

                  bg-[#0b0f25]

                  p-3

                  sm:rounded-2xl
                  sm:p-4
                "
              >
                <div className="grid h-7 w-7 place-items-center rounded-lg bg-blue-500/10 text-blue-400 sm:h-9 sm:w-9">
                  <Clock3 size={14} className="sm:size-[17px]" />
                </div>

                <span className="mt-2.5 block text-[7px] font-bold uppercase tracking-wider text-slate-500 sm:text-[9px]">
                  Start time
                </span>

                <strong className="mt-1 block text-[9px] text-white min-[380px]:text-[10px] sm:text-xs">
                  {startTimeText}
                </strong>
              </div>

              {/* LOCATION */}
              <div
                className="
                  rounded-xl

                  border
                  border-white/[0.07]

                  bg-[#0b0f25]

                  p-3

                  sm:rounded-2xl
                  sm:p-4
                "
              >
                <div className="grid h-7 w-7 place-items-center rounded-lg bg-fuchsia-500/10 text-fuchsia-400 sm:h-9 sm:w-9">
                  <MapPin size={14} className="sm:size-[17px]" />
                </div>

                <span className="mt-2.5 block text-[7px] font-bold uppercase tracking-wider text-slate-500 sm:text-[9px]">
                  Location
                </span>

                <strong
                  className="
                    mt-1
                    block

                    line-clamp-2

                    text-[9px]
                    leading-4

                    text-white

                    min-[380px]:text-[10px]

                    sm:text-xs
                  "
                >
                  {event.location}
                </strong>
              </div>

              {/* TOTAL POINTS */}
              <div
                className="
                  rounded-xl

                  border
                  border-violet-500/[0.14]

                  bg-gradient-to-br
                  from-violet-500/[0.10]
                  to-fuchsia-500/[0.04]

                  p-3

                  sm:rounded-2xl
                  sm:p-4
                "
              >
                <div className="grid h-7 w-7 place-items-center rounded-lg bg-violet-500/15 text-violet-300 sm:h-9 sm:w-9">
                  <Trophy size={14} className="sm:size-[17px]" />
                </div>

                <span className="mt-2.5 block text-[7px] font-bold uppercase tracking-wider text-slate-500 sm:text-[9px]">
                  Points
                </span>

                <strong className="mt-1 block text-[15px] font-black text-violet-300 sm:text-xl">
                  {total}
                </strong>
              </div>
            </div>

            {/* =================================================
                ABOUT
            ================================================= */}
            <section
              className="
                relative

                mt-4

                overflow-hidden

                rounded-2xl

                border
                border-white/[0.07]

                bg-gradient-to-b
                from-[#0d1129]
                to-[#080c1f]

                p-4

                sm:mt-5
                sm:rounded-[22px]
                sm:p-6

                lg:p-7
              "
            >
              <div className="pointer-events-none absolute -right-16 -top-16 h-[190px] w-[190px] rounded-full bg-violet-600/[0.08] blur-[70px]" />

              <div className="relative">
                <div className="flex items-center gap-2.5">
                  <div
                    className="
                      grid
                      h-8
                      w-8
                      shrink-0
                      place-items-center

                      rounded-lg

                      bg-violet-500/10

                      text-violet-400

                      sm:h-10
                      sm:w-10
                      sm:rounded-xl
                    "
                  >
                    <Sparkles size={15} className="sm:size-[18px]" />
                  </div>

                  <div>
                    <span className="block text-[7px] font-extrabold uppercase tracking-[0.13em] text-violet-400 sm:text-[9px]">
                      Event details
                    </span>

                    <h2 className="mt-0.5 text-[16px] font-black text-white sm:text-xl">
                      About this event
                    </h2>
                  </div>
                </div>

                <p
                  className="
                    mt-4

                    whitespace-pre-line

                    text-[10px]
                    leading-5

                    text-slate-400

                    min-[380px]:text-[11px]

                    sm:mt-5
                    sm:text-sm
                    sm:leading-7
                  "
                >
                  {event.description}
                </p>
              </div>
            </section>
          </div>

          {/* ===================================================
              SIDEBAR
          =================================================== */}
          <aside
            className="
              h-fit

              overflow-hidden

              rounded-2xl

              border
              border-violet-500/[0.13]

              bg-gradient-to-b
              from-[#10142d]
              to-[#090d20]

              shadow-[0_18px_50px_rgba(0,0,0,0.30)]

              sm:rounded-[22px]

              lg:sticky
              lg:top-24
            "
          >
            {/* POINT HERO */}
            <div
              className="
                relative

                overflow-hidden

                border-b
                border-white/[0.06]

                p-4

                sm:p-6
              "
            >
              <div className="pointer-events-none absolute -right-12 -top-14 h-[180px] w-[180px] rounded-full bg-violet-600/15 blur-[60px]" />

              <div className="relative">
                <span className="text-[8px] font-extrabold uppercase tracking-[0.14em] text-violet-400 sm:text-[9px]">
                  Event reward
                </span>

                <div className="mt-2 flex items-end gap-2">
                  <strong
                    className="
                      bg-gradient-to-r
                      from-violet-300
                      via-fuchsia-300
                      to-blue-300

                      bg-clip-text

                      text-[34px]
                      font-black
                      leading-none

                      text-transparent

                      sm:text-[42px]
                    "
                  >
                    {total}
                  </strong>

                  <span className="mb-1 text-[9px] font-bold text-slate-400 sm:text-xs">
                    POINTS
                  </span>
                </div>

                <p className="mt-2.5 text-[9px] leading-5 text-slate-500 sm:text-[11px]">
                  Complete the event requirements to earn your verified points.
                </p>
              </div>
            </div>

            {/* DETAILS */}
            <div className="space-y-4 p-4 sm:space-y-5 sm:p-6">
              {/* START */}
              <div className="flex gap-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-violet-500/10 text-violet-400 sm:h-10 sm:w-10">
                  <CalendarDays size={16} className="sm:size-[18px]" />
                </div>

                <div className="min-w-0">
                  <small className="block text-[8px] font-bold uppercase tracking-wider text-slate-500 sm:text-[9px]">
                    Starts
                  </small>

                  <strong className="mt-1 block text-[10px] leading-5 text-white sm:text-xs">
                    {startDateText}
                  </strong>

                  <span className="text-[9px] text-slate-400 sm:text-[11px]">
                    {startTimeText}
                  </span>
                </div>
              </div>

              {/* END */}
              <div className="flex gap-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-blue-500/10 text-blue-400 sm:h-10 sm:w-10">
                  <Clock3 size={16} className="sm:size-[18px]" />
                </div>

                <div className="min-w-0">
                  <small className="block text-[8px] font-bold uppercase tracking-wider text-slate-500 sm:text-[9px]">
                    Ends
                  </small>

                  <strong className="mt-1 block text-[10px] leading-5 text-white sm:text-xs">
                    {endDateText}
                  </strong>

                  <span className="text-[9px] text-slate-400 sm:text-[11px]">
                    {endTimeText}
                  </span>
                </div>
              </div>

              {/* LOCATION */}
              <div className="flex gap-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-fuchsia-500/10 text-fuchsia-400 sm:h-10 sm:w-10">
                  <MapPin size={16} className="sm:size-[18px]" />
                </div>

                <div className="min-w-0">
                  <small className="block text-[8px] font-bold uppercase tracking-wider text-slate-500 sm:text-[9px]">
                    Location
                  </small>

                  <strong className="mt-1 block break-words text-[10px] leading-5 text-white sm:text-xs">
                    {event.location}
                  </strong>
                </div>
              </div>

              <div className="border-t border-white/[0.06]" />

              {/* POINT BREAKDOWN */}
              <div>
                <div className="mb-2.5 flex items-center gap-2">
                  <Trophy
                    size={14}
                    className="text-violet-400"
                  />

                  <h3 className="text-[10px] font-bold text-white sm:text-[11px]">
                    Points breakdown
                  </h3>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between rounded-lg bg-white/[0.025] px-3 py-2">
                    <span className="text-[9px] text-slate-400 sm:text-[10px]">
                      Participation
                    </span>

                    <strong className="text-[9px] text-violet-300 sm:text-[11px]">
                      {event.participationPoints} pts
                    </strong>
                  </div>

                  <div className="flex items-center justify-between rounded-lg bg-white/[0.025] px-3 py-2">
                    <span className="text-[9px] text-slate-400 sm:text-[10px]">
                      Attendance
                    </span>

                    <strong className="text-[9px] text-blue-300 sm:text-[11px]">
                      {event.attendancePoints} pts
                    </strong>
                  </div>

                  <div className="flex items-center justify-between rounded-lg bg-white/[0.025] px-3 py-2">
                    <span className="text-[9px] text-slate-400 sm:text-[10px]">
                      Completion
                    </span>

                    <strong className="text-[9px] text-fuchsia-300 sm:text-[11px]">
                      {event.completionPoints} pts
                    </strong>
                  </div>
                </div>
              </div>

              {/* SIGN IN NOTICE */}
              <div
                className="
                  rounded-xl

                  border
                  border-violet-500/[0.12]

                  bg-violet-500/[0.06]

                  p-3
                "
              >
                <p className="text-[9px] leading-5 text-slate-400 sm:text-[10px]">
                  Sign in as a user to register for this event and earn points.
                </p>
              </div>

              {/* BUTTON */}
              <Link
                to="/login"
                className="
                  flex
                  h-10
                  w-full
                  items-center
                  justify-center

                  rounded-xl

                  bg-gradient-to-r
                  from-violet-600
                  via-purple-600
                  to-fuchsia-600

                  px-4

                  text-[10px]
                  font-extrabold

                  text-white

                  shadow-[0_8px_28px_rgba(124,58,237,0.28)]

                  transition
                  duration-300

                  hover:-translate-y-0.5

                  sm:h-11
                  sm:text-xs
                "
              >
                Sign in to register
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
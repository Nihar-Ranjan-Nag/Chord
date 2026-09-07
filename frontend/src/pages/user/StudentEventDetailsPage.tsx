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

export function StudentEventDetailsPage() {
  const {
    slug,
  } = useParams()

  const {
    data: event,
    loading,
    error,
  } = useAsyncData(
    async () => {
      const body: any =
        await api(
          `/events/${slug}`,
          {
            auth: true,
          }
        )

      return mapEvent(body.data)
    },
    [slug]
  )

  if (loading) {
    return (
      <div className="py-10">
        <ApiLoading />
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="py-10">
        <ApiError
          message={
            error ||
            'Event not found'
          }
        />
      </div>
    )
  }

  const totalPoints =
    event.participationPoints +
    event.attendancePoints +
    event.completionPoints

  const startDate =
    new Date(event.startDate)

  const endDate =
    new Date(event.endDate)

  const dateText =
    startDate.toLocaleDateString(
      undefined,
      {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }
    )

  const timeText =
    startDate.toLocaleTimeString(
      undefined,
      {
        hour: 'numeric',
        minute: '2-digit',
      }
    )

  return (
    <div className="w-full">
      {/* BACK */}
      <Link
        to="/dashboard/events"
        className="
          mb-5
          inline-flex
          items-center
          gap-1.5

          text-[10px]
          font-bold

          text-white/70

          transition

          hover:text-violet-300

          sm:mb-6
          sm:text-xs
        "
      >
        <ArrowLeft size={14} />

        Back to events
      </Link>

      <div
        className="
          grid
          gap-5

          lg:grid-cols-[minmax(0,1fr)_330px]

          xl:grid-cols-[minmax(0,1fr)_360px]
        "
      >
        {/* LEFT */}
        <section
          className="
            min-w-0
            overflow-hidden

            rounded-2xl

            border
            border-white/[0.08]

            bg-gradient-to-br
            from-[#11152e]
            to-[#080c1f]
          "
        >
          {/* IMAGE */}
          <div
            className="
              relative

              h-[200px]

              overflow-hidden

              sm:h-[300px]

              lg:h-[360px]
            "
          >
            {event.image ? (
              <img
                src={event.image}
                alt={event.title}
                className="
                  h-full
                  w-full
                  object-cover
                "
              />
            ) : (
              <div
                className="
                  grid
                  h-full
                  place-items-center

                  bg-violet-500/10

                  text-violet-300
                "
              >
                <CalendarDays
                  size={48}
                />
              </div>
            )}

            <div
              className="
                absolute
                inset-0

                bg-gradient-to-t
                from-[#080c1f]
                via-transparent
                to-transparent
              "
            />
          </div>

          <div
            className="
              p-4

              sm:p-6
            "
          >
            {/* BADGES */}
            <div
              className="
                flex
                flex-wrap
                gap-2
              "
            >
              <span
                className="
                  rounded-full

                  border
                  border-violet-400/20

                  bg-violet-500/10

                  px-2.5
                  py-1

                  text-[8px]
                  font-extrabold

                  text-violet-200

                  sm:text-[10px]
                "
              >
                {event.category}
              </span>

              <span
                className="
                  inline-flex
                  items-center
                  gap-1

                  rounded-full

                  border
                  border-fuchsia-400/20

                  bg-fuchsia-500/10

                  px-2.5
                  py-1

                  text-[8px]
                  font-extrabold

                  text-fuchsia-200

                  sm:text-[10px]
                "
              >
                <Sparkles
                  size={10}
                />

                {totalPoints} points
              </span>
            </div>

            <h1
              className="
                mt-3

                text-[26px]
                font-black
                leading-tight

                text-white

                sm:text-[38px]
              "
            >
              {event.title}
            </h1>

            <p
              className="
                mt-3

                text-[11px]
                leading-6

                text-white/75

                sm:text-[13px]
              "
            >
              {event.shortDescription}
            </p>

            {/* ABOUT */}
            <div
              className="
                mt-6

                border-t
                border-white/[0.07]

                pt-5
              "
            >
              <h2
                className="
                  text-base
                  font-black

                  text-white
                "
              >
                About this event
              </h2>

              <p
                className="
                  mt-3

                  whitespace-pre-line

                  text-[11px]
                  leading-6

                  text-white/75

                  sm:text-[13px]
                "
              >
                {event.description}
              </p>
            </div>
          </div>
        </section>

        {/* RIGHT */}
        <aside
          className="
            h-fit

            rounded-2xl

            border
            border-white/[0.08]

            bg-gradient-to-br
            from-violet-600/[0.10]
            via-[#0d1129]
            to-[#080c1f]

            p-4

            sm:p-5

            lg:sticky
            lg:top-[90px]
          "
        >
          <h2
            className="
              text-base
              font-black

              text-white
            "
          >
            Event details
          </h2>

          <div
            className="
              mt-4
              space-y-3
            "
          >
            <DetailRow
              icon={CalendarDays}
              label="Date"
              value={dateText}
            />

            <DetailRow
              icon={Clock3}
              label="Time"
              value={timeText}
            />

            <DetailRow
              icon={MapPin}
              label="Location"
              value={event.location}
            />

            <DetailRow
              icon={Trophy}
              label="Total points"
              value={`${totalPoints} pts`}
            />

            <DetailRow
              icon={CalendarDays}
              label="Ends"
              value={endDate.toLocaleString()}
            />
          </div>
        </aside>
      </div>

      <div className="h-5" />
    </div>
  )
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CalendarDays
  label: string
  value: string
}) {
  return (
    <div
      className="
        flex
        items-start
        gap-3

        rounded-xl

        border
        border-white/[0.06]

        bg-white/[0.025]

        p-3
      "
    >
      <span
        className="
          grid
          h-9
          w-9
          shrink-0
          place-items-center

          rounded-lg

          bg-violet-500/10

          text-violet-300
        "
      >
        <Icon size={15} />
      </span>

      <div className="min-w-0">
        <span
          className="
            block

            text-[8px]
            font-bold
            uppercase
            tracking-[0.1em]

            text-white/55
          "
        >
          {label}
        </span>

        <strong
          className="
            mt-1
            block

            break-words

            text-[10px]
            font-bold

            text-white

            sm:text-xs
          "
        >
          {value}
        </strong>
      </div>
    </div>
  )
}
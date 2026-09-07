import {
  CalendarDays,
  MapPin,
  Sparkles,
} from 'lucide-react'

import { Link } from 'react-router-dom'

import type { EventItem } from '@/types'

export function EventCard({
  event,
  detailsTo,
}: {
  event: EventItem
  detailsTo?: string
}) {
  const points =
    event.participationPoints +
    event.attendancePoints +
    event.completionPoints

  const eventDate = new Date(event.startDate)

  const mobileDate =
    eventDate.toLocaleDateString(
      undefined,
      {
        day: 'numeric',
        month: 'short',
      }
    )

  const desktopDate =
    eventDate.toLocaleString(
      undefined,
      {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      }
    )

  const viewDetailsTo =
    detailsTo ||
    `/events/${event.slug}`

  return (
    <article
      className="
        group
        relative

        flex
        h-full
        min-w-0
        flex-col

        overflow-hidden

        rounded-xl

        border
        border-violet-500/[0.18]

        bg-gradient-to-b
        from-[#10142d]
        to-[#090d20]

        shadow-[0_8px_25px_rgba(0,0,0,0.24)]

        transition
        duration-300

        hover:-translate-y-1
        hover:border-violet-500/40

        sm:rounded-2xl
      "
    >
      {/* CARD GLOW */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0

          bg-[radial-gradient(circle_at_80%_10%,rgba(139,92,246,0.12),transparent_35%)]
        "
      />

      {/* ======================================================
          IMAGE
      ====================================================== */}
      <div
        className="
          relative

          h-[100px]

          shrink-0
          overflow-hidden

          border-b
          border-white/[0.06]

          bg-gradient-to-br
          from-[#151a3a]
          via-[#0e1431]
          to-[#17102f]

          min-[380px]:h-[112px]

          sm:h-[165px]

          lg:h-48
        "
      >
        {event.image ? (
          <>
            <img
              src={event.image}
              alt={event.title}
              className="
                h-full
                w-full
                object-cover

                transition
                duration-500

                group-hover:scale-105
              "
            />

            <div
              className="
                absolute
                inset-0

                bg-gradient-to-t
                from-[#080b1d]/65
                via-transparent
                to-transparent
              "
            />
          </>
        ) : (
          <div
            className="
              relative
              grid
              h-full
              place-items-center
            "
          >
            <div
              className="
                absolute
                h-14
                w-14

                rounded-full

                bg-violet-600/10

                blur-xl
              "
            />

            <CalendarDays
              size={27}
              className="
                relative
                text-violet-300

                sm:size-[45px]
              "
            />
          </div>
        )}

        {/* CATEGORY */}
        <div
          className="
            absolute
            left-1.5
            top-1.5

            max-w-[calc(100%-12px)]

            sm:left-3
            sm:top-3
          "
        >
          <span
            className="
              block
              max-w-full
              truncate

              rounded-full

              border
              border-violet-400/20

              bg-[#080b1d]/90

              px-1.5
              py-0.5

              text-[6.5px]
              font-extrabold

              text-white

              backdrop-blur-md

              min-[380px]:px-2
              min-[380px]:py-1
              min-[380px]:text-[7px]

              sm:px-3
              sm:text-[10px]
            "
          >
            {event.category}
          </span>
        </div>

        {/* MOBILE POINTS */}
        <div
          className="
            absolute
            bottom-1.5
            right-1.5

            flex
            items-center
            gap-0.5

            rounded-full

            border
            border-violet-400/20

            bg-[#080b1d]/90

            px-1.5
            py-0.5

            text-[6.5px]
            font-extrabold

            text-white

            backdrop-blur-md

            sm:hidden
          "
        >
          <Sparkles size={7} />

          {points}
        </div>
      </div>

      {/* ======================================================
          CONTENT
      ====================================================== */}
      <div
        className="
          relative
          z-10

          flex
          min-w-0
          flex-1
          flex-col

          p-2

          min-[380px]:p-2.5

          sm:p-4

          lg:p-5
        "
      >
        {/* TITLE */}
        <h3
          className="
            line-clamp-2

            min-h-[31px]

            text-[10px]
            font-extrabold
            leading-[14px]

            text-white

            min-[380px]:min-h-[34px]
            min-[380px]:text-[11px]
            min-[380px]:leading-[16px]

            sm:min-h-0
            sm:text-base
            sm:leading-6

            lg:text-lg
          "
        >
          {event.title}
        </h3>

        {/* DESCRIPTION */}
        <p
          className="
            mt-1

            line-clamp-2

            text-[7.5px]
            leading-[12px]

            text-white/75

            min-[380px]:text-[8.5px]
            min-[380px]:leading-[13px]

            sm:mt-2
            sm:text-xs
            sm:leading-5

            lg:text-sm
            lg:leading-6
          "
        >
          {event.shortDescription}
        </p>

        {/* ==================================================
            DATE + LOCATION
        ================================================== */}
        <div
          className="
            mt-2

            space-y-1

            text-[7px]
            font-medium

            text-white/80

            min-[380px]:mt-2.5
            min-[380px]:space-y-1.5
            min-[380px]:text-[8px]

            sm:mt-4
            sm:space-y-2
            sm:text-xs
          "
        >
          {/* DATE */}
          <div
            className="
              flex
              min-w-0
              items-center
              gap-1

              sm:gap-2
            "
          >
            <span
              className="
                grid
                h-4
                w-4
                shrink-0
                place-items-center

                rounded-[4px]

                bg-violet-500/12

                text-violet-300

                min-[380px]:h-[18px]
                min-[380px]:w-[18px]

                sm:h-6
                sm:w-6
                sm:rounded-md
              "
            >
              <CalendarDays
                size={8}
                className="sm:size-[13px]"
              />
            </span>

            <span
              className="
                truncate
                sm:hidden
              "
            >
              {mobileDate}
            </span>

            <span
              className="
                hidden
                truncate
                sm:block
              "
            >
              {desktopDate}
            </span>
          </div>

          {/* LOCATION */}
          <div
            className="
              flex
              min-w-0
              items-center
              gap-1

              sm:gap-2
            "
          >
            <span
              className="
                grid
                h-4
                w-4
                shrink-0
                place-items-center

                rounded-[4px]

                bg-blue-500/12

                text-blue-300

                min-[380px]:h-[18px]
                min-[380px]:w-[18px]

                sm:h-6
                sm:w-6
                sm:rounded-md
              "
            >
              <MapPin
                size={8}
                className="sm:size-[13px]"
              />
            </span>

            <span className="truncate">
              {event.location}
            </span>
          </div>
        </div>

        {/* ==================================================
            FOOTER
        ================================================== */}
        <div
          className="
            mt-auto

            flex
            min-w-0
            items-center
            justify-between

            gap-1

            border-t
            border-white/[0.07]

            pt-2

            sm:gap-3
            sm:pt-4
          "
        >
          {/* POINTS */}
          <span
            className="
              hidden

              items-center
              gap-1

              rounded-full

              border
              border-violet-500/20

              bg-violet-500/10

              px-2
              py-1

              font-extrabold

              text-white

              min-[380px]:inline-flex
              min-[380px]:text-[7px]

              sm:gap-1.5
              sm:px-3
              sm:py-1.5
              sm:text-xs
            "
          >
            <Sparkles
              size={8}
              className="
                text-violet-300

                sm:size-[13px]
              "
            />

            {points}

            <span
              className="
                hidden
                min-[420px]:inline
              "
            >
              pts
            </span>
          </span>

          {/* DETAILS */}
          <Link
            to={viewDetailsTo}
            className="
              ml-auto

              whitespace-nowrap

              text-[7.5px]
              font-extrabold

              text-violet-300

              transition

              hover:text-white

              min-[380px]:text-[8px]

              sm:text-xs
            "
          >
            <span className="sm:hidden">
              View →
            </span>

            <span className="hidden sm:inline">
              View details →
            </span>
          </Link>
        </div>
      </div>
    </article>
  )
}
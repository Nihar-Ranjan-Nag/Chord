import {
  Award,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Sparkles,
} from 'lucide-react'

import {
  ApiError,
  ApiLoading,
} from '@/components/common/ApiState'

import { useAsyncData } from '@/hooks/useAsyncData'

import { api } from '@/services/api'

import { mapRegistration } from '@/services/mappers'

export function MyEventsPage() {
  const {
    data,
    loading,
    error,
  } = useAsyncData(
    async () => {
      const body: any = await api(
        '/events/mine',
        {
          auth: true,
        }
      )

      return (
        body?.data || []
      ).map(mapRegistration)
    },
    []
  )

  const registrations =
    data || []

  if (loading) {
    return (
      <div className="py-10">
        <ApiLoading />
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-10">
        <ApiError
          message={error}
        />
      </div>
    )
  }

  function statusStyles(
    status?: string
  ) {
    switch (status) {
      case 'completed':
        return {
          text:
            'text-emerald-200',
          bg:
            'bg-emerald-500/10',
          border:
            'border-emerald-400/20',
          icon:
            CheckCircle2,
        }

      case 'attended':
        return {
          text:
            'text-blue-200',
          bg:
            'bg-blue-500/10',
          border:
            'border-blue-400/20',
          icon:
            Award,
        }

      default:
        return {
          text:
            'text-violet-200',
          bg:
            'bg-violet-500/10',
          border:
            'border-violet-400/20',
          icon:
            Clock3,
        }
    }
  }

  return (
    <div className="w-full">
      {/* ======================================================
          PAGE HEADING
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
            MY EVENTS
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
          Participation{' '}

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
            history
          </span>
        </h1>

        <p
          className="
            mt-2
            max-w-[640px]

            text-[10px]
            leading-5

            text-white/75

            min-[380px]:text-[11px]

            sm:mt-3
            sm:text-[13px]
            sm:leading-6
          "
        >
          View your registered events and track your participation status.
        </p>
      </section>

      {/* ======================================================
          EMPTY STATE
      ====================================================== */}
      {registrations.length ===
        0 && (
        <section
          className="
            overflow-hidden

            rounded-2xl

            border
            border-violet-500/[0.12]

            bg-gradient-to-br
            from-violet-600/[0.09]
            via-[#0d1129]
            to-[#080c1f]

            px-5
            py-10

            text-center

            shadow-[0_14px_40px_rgba(0,0,0,0.24)]

            sm:py-14
          "
        >
          <span
            className="
              mx-auto

              grid
              h-12
              w-12
              place-items-center

              rounded-2xl

              bg-violet-500/10

              text-violet-300

              sm:h-14
              sm:w-14
            "
          >
            <CalendarDays
              size={23}
            />
          </span>

          <h2
            className="
              mt-4

              text-[15px]
              font-black

              text-white

              sm:text-lg
            "
          >
            No registrations yet
          </h2>

          <p
            className="
              mx-auto
              mt-2
              max-w-[380px]

              text-[10px]
              leading-5

              text-white/65

              sm:text-xs
              sm:leading-6
            "
          >
            Register for an event and it will appear here with your participation status.
          </p>
        </section>
      )}

      {/* ======================================================
          MOBILE CARDS
      ====================================================== */}
      {registrations.length >
        0 && (
        <div
          className="
            grid
            gap-3

            md:hidden
          "
        >
          {registrations.map(
            (registration) => {
              const status =
                statusStyles(
                  registration.status
                )

              const StatusIcon =
                status.icon

              return (
                <article
                  key={
                    registration.id
                  }
                  className="
                    relative
                    overflow-hidden

                    rounded-2xl

                    border
                    border-white/[0.07]

                    bg-gradient-to-br
                    from-[#11152e]
                    via-[#0c1025]
                    to-[#080c1f]

                    p-4

                    shadow-[0_12px_35px_rgba(0,0,0,0.24)]
                  "
                >
                  {/* GLOW */}
                  <div
                    className="
                      pointer-events-none
                      absolute
                      -right-12
                      -top-12

                      h-28
                      w-28

                      rounded-full

                      bg-violet-500/[0.10]

                      blur-3xl
                    "
                  />

                  <div
                    className="
                      relative

                      flex
                      items-start
                      justify-between
                      gap-3
                    "
                  >
                    <div
                      className="
                        flex
                        min-w-0
                        items-start
                        gap-3
                      "
                    >
                      <span
                        className="
                          grid
                          h-10
                          w-10
                          shrink-0
                          place-items-center

                          rounded-xl

                          bg-violet-500/10

                          text-violet-300
                        "
                      >
                        <CalendarDays
                          size={17}
                        />
                      </span>

                      <div className="min-w-0">
                        <h2
                          className="
                            line-clamp-2

                            text-[12px]
                            font-extrabold
                            leading-5

                            text-white

                            min-[380px]:text-[13px]
                          "
                        >
                          {registration
                            .event
                            ?.title ||
                            `Event #${registration.eventId}`}
                        </h2>

                        {registration
                          .event
                          ?.category && (
                          <p
                            className="
                              mt-1

                              truncate

                              text-[9px]
                              font-medium

                              text-white/60
                            "
                          >
                            {
                              registration
                                .event
                                ?.category
                            }
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* DETAILS */}
                  <div
                    className="
                      relative

                      mt-4

                      grid
                      grid-cols-2
                      gap-2
                    "
                  >
                    <div
                      className="
                        rounded-xl

                        border
                        border-white/[0.06]

                        bg-white/[0.025]

                        p-3
                      "
                    >
                      <span
                        className="
                          flex
                          items-center
                          gap-1.5

                          text-[8px]
                          font-semibold

                          text-white/55
                        "
                      >
                        <Clock3
                          size={11}
                        />

                        REGISTERED
                      </span>

                      <strong
                        className="
                          mt-1.5
                          block

                          text-[9px]
                          font-bold
                          leading-4

                          text-white
                        "
                      >
                        {new Date(
                          registration.registeredAt
                        ).toLocaleString()}
                      </strong>
                    </div>

                    <div
                      className="
                        rounded-xl

                        border
                        border-white/[0.06]

                        bg-white/[0.025]

                        p-3
                      "
                    >
                      <span
                        className="
                          text-[8px]
                          font-semibold

                          text-white/55
                        "
                      >
                        STATUS
                      </span>

                      <div className="mt-1.5">
                        <span
                          className={`
                            inline-flex
                            items-center
                            gap-1

                            rounded-full

                            border

                            px-2
                            py-1

                            text-[8px]
                            font-extrabold
                            capitalize

                            ${status.bg}
                            ${status.border}
                            ${status.text}
                          `}
                        >
                          <StatusIcon
                            size={10}
                          />

                          {
                            registration.status
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              )
            }
          )}
        </div>
      )}

      {/* ======================================================
          DESKTOP TABLE
      ====================================================== */}
      {registrations.length >
        0 && (
        <section
          className="
            hidden
            overflow-hidden

            rounded-2xl

            border
            border-white/[0.07]

            bg-gradient-to-br
            from-[#0d1129]
            to-[#080c1f]

            shadow-[0_14px_40px_rgba(0,0,0,0.24)]

            md:block
          "
        >
          {/* TABLE HEADER */}
          <div
            className="
              flex
              items-center
              justify-between

              border-b
              border-white/[0.07]

              px-5
              py-4
            "
          >
            <div>
              <h2
                className="
                  text-[15px]
                  font-black

                  text-white
                "
              >
                Your registrations
              </h2>

              <p
                className="
                  mt-1

                  text-[10px]

                  text-white/60
                "
              >
                {registrations.length}{' '}
                {registrations.length ===
                1
                  ? 'event'
                  : 'events'}
              </p>
            </div>

            <span
              className="
                grid
                h-9
                w-9
                place-items-center

                rounded-xl

                bg-violet-500/10

                text-violet-300
              "
            >
              <Award size={17} />
            </span>
          </div>

          <div className="overflow-x-auto">
            <table
              className="
                w-full
                min-w-[720px]
                border-collapse
              "
            >
              <thead>
                <tr
                  className="
                    border-b
                    border-white/[0.07]

                    bg-white/[0.02]
                  "
                >
                  <th
                    className="
                      px-5
                      py-3.5

                      text-left

                      text-[9px]
                      font-extrabold
                      tracking-[0.12em]

                      text-white/55
                    "
                  >
                    EVENT
                  </th>

                  <th
                    className="
                      px-5
                      py-3.5

                      text-left

                      text-[9px]
                      font-extrabold
                      tracking-[0.12em]

                      text-white/55
                    "
                  >
                    REGISTERED
                  </th>

                  <th
                    className="
                      px-5
                      py-3.5

                      text-left

                      text-[9px]
                      font-extrabold
                      tracking-[0.12em]

                      text-white/55
                    "
                  >
                    STATUS
                  </th>
                </tr>
              </thead>

              <tbody>
                {registrations.map(
                  (
                    registration
                  ) => {
                    const status =
                      statusStyles(
                        registration.status
                      )

                    const StatusIcon =
                      status.icon

                    return (
                      <tr
                        key={
                          registration.id
                        }
                        className="
                          border-b
                          border-white/[0.06]

                          transition

                          last:border-b-0

                          hover:bg-white/[0.025]
                        "
                      >
                        {/* EVENT */}
                        <td
                          className="
                            px-5
                            py-4
                          "
                        >
                          <div
                            className="
                              flex
                              items-center
                              gap-3
                            "
                          >
                            <span
                              className="
                                grid
                                h-10
                                w-10
                                shrink-0
                                place-items-center

                                rounded-xl

                                bg-violet-500/10

                                text-violet-300
                              "
                            >
                              <CalendarDays
                                size={17}
                              />
                            </span>

                            <div className="min-w-0">
                              <strong
                                className="
                                  block
                                  max-w-[420px]
                                  truncate

                                  text-[12px]
                                  font-bold

                                  text-white
                                "
                              >
                                {registration
                                  .event
                                  ?.title ||
                                  `Event #${registration.eventId}`}
                              </strong>

                              <small
                                className="
                                  mt-1
                                  block

                                  text-[10px]

                                  text-white/60
                                "
                              >
                                {registration
                                  .event
                                  ?.category ||
                                  'Event'}
                              </small>
                            </div>
                          </div>
                        </td>

                        {/* DATE */}
                        <td
                          className="
                            px-5
                            py-4

                            text-[11px]
                            font-medium

                            text-white/80
                          "
                        >
                          {new Date(
                            registration.registeredAt
                          ).toLocaleString()}
                        </td>

                        {/* STATUS */}
                        <td
                          className="
                            px-5
                            py-4
                          "
                        >
                          <span
                            className={`
                              inline-flex
                              items-center
                              gap-1.5

                              rounded-full

                              border

                              px-2.5
                              py-1.5

                              text-[9px]
                              font-extrabold
                              capitalize

                              ${status.bg}
                              ${status.border}
                              ${status.text}
                            `}
                          >
                            <StatusIcon
                              size={11}
                            />

                            {
                              registration.status
                            }
                          </span>
                        </td>
                      </tr>
                    )
                  }
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* MOBILE BOTTOM SAFE SPACE */}
      <div className="h-5 md:hidden" />
    </div>
  )
}
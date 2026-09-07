import {
  CalendarDays,
  CalendarPlus,
  Edit3,
  Sparkles,
  Trash2,
  Users,
} from 'lucide-react'

import {
  useState,
} from 'react'

import {
  Link,
} from 'react-router-dom'

import {
  ApiError,
  ApiLoading,
} from '@/components/common/ApiState'

import {
  useAsyncData,
} from '@/hooks/useAsyncData'

import {
  api,
} from '@/services/api'

import {
  mapEvent,
} from '@/services/mappers'

export function ManagedEventsTable({
  apiBase,
  routeBase,
  eyebrow,
  title,
  description,
}: {
  apiBase: string
  routeBase: string
  eyebrow: string
  title: string
  description: string
}) {
  const [
    deletingId,
    setDeletingId,
  ] = useState<string | null>(
    null
  )

  const [
    deleteError,
    setDeleteError,
  ] = useState('')

  const {
    data,
    loading,
    error,
    refresh,
  } = useAsyncData(
    async () => {
      const body: any =
        await api(
          apiBase,
          {
            auth: true,
          }
        )

      return (
        body?.data || []
      ).map(mapEvent)
    },
    [
      apiBase,
    ]
  )

  const events =
    data || []

  const organizerMode =
    apiBase ===
    '/organizer/events'

  function statusStyle(
    status?: string
  ) {
    switch (
      status?.toLowerCase()
    ) {
      case 'open':
      case 'published':
        return {
          text:
            'text-emerald-200',
          bg:
            'bg-emerald-500/10',
          border:
            'border-emerald-400/20',
        }

      case 'completed':
        return {
          text:
            'text-slate-200',
          bg:
            'bg-white/[0.05]',
          border:
            'border-white/[0.10]',
        }

      case 'cancelled':
        return {
          text:
            'text-rose-200',
          bg:
            'bg-rose-500/10',
          border:
            'border-rose-400/20',
        }

      case 'draft':
        return {
          text:
            'text-amber-200',
          bg:
            'bg-amber-500/10',
          border:
            'border-amber-400/20',
        }

      default:
        return {
          text:
            'text-blue-200',
          bg:
            'bg-blue-500/10',
          border:
            'border-blue-400/20',
        }
    }
  }

  async function deleteEvent(
    eventId: string,
    eventTitle: string
  ) {
    if (deletingId) {
      return
    }

    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${eventTitle}"?\n\nThis action cannot be undone.`
      )

    if (!confirmed) {
      return
    }

    setDeleteError('')
    setDeletingId(
      eventId
    )

    try {
      await api(
        `${apiBase}/${eventId}`,
        {
          method:
            'DELETE',

          auth: true,
        }
      )

      await refresh()
    } catch (err) {
      setDeleteError(
        err instanceof Error
          ? err.message
          : 'Unable to delete event.'
      )
    } finally {
      setDeletingId(
        null
      )
    }
  }

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

  return (
    <div className="w-full">
      {/* ======================================================
          HEADER
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
            <Sparkles
              size={14}
            />
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
            {eyebrow}
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
              {title}
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
              {description}
            </p>
          </div>

          <Link
            to={`${routeBase}/create`}
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
            <CalendarPlus
              size={15}
            />

            Create event
          </Link>
        </div>
      </section>

      {/* ======================================================
          DELETE ERROR
      ====================================================== */}
      {deleteError && (
        <div className="mb-4">
          <ApiError
            message={
              deleteError
            }
          />
        </div>
      )}

      {/* ======================================================
          EMPTY
      ====================================================== */}
      {events.length ===
        0 && (
        <section
          className="
            rounded-2xl

            border
            border-violet-500/[0.12]

            bg-gradient-to-br
            from-violet-600/[0.08]
            via-[#0d1129]
            to-[#080c1f]

            px-5
            py-10

            text-center

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
            "
          >
            <CalendarDays
              size={22}
            />
          </span>

          <h2
            className="
              mt-3

              text-[14px]
              font-black

              text-white
            "
          >
            No events yet
          </h2>

          <p
            className="
              mt-1

              text-[10px]

              text-white/70
            "
          >
            Create your first event and publish it when it is ready.
          </p>
        </section>
      )}

      {/* ======================================================
          MOBILE CARDS
      ====================================================== */}
      {events.length > 0 && (
        <div
          className="
            grid
            gap-3

            md:hidden
          "
        >
          {events.map(
            event => {
              const status =
                statusStyle(
                  event.status
                )

              const deleting =
                deletingId ===
                event.id

              return (
                <article
                  key={
                    event.id
                  }
                  className="
                    overflow-hidden

                    rounded-2xl

                    border
                    border-white/[0.08]

                    bg-gradient-to-br
                    from-[#11152e]
                    via-[#0d1129]
                    to-[#080c1f]

                    shadow-[0_12px_35px_rgba(0,0,0,0.24)]
                  "
                >
                  {/* IMAGE */}
                  <div
                    className="
                      relative

                      h-[150px]

                      overflow-hidden

                      bg-gradient-to-br
                      from-violet-500/10
                      to-blue-500/10
                    "
                  >
                    {event.image ? (
                      <img
                        src={
                          event.image
                        }
                        alt={
                          event.title
                        }
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

                          text-violet-300
                        "
                      >
                        <CalendarDays
                          size={34}
                        />
                      </div>
                    )}

                    <div
                      className="
                        absolute
                        inset-0

                        bg-gradient-to-t
                        from-[#080c1f]/70
                        via-transparent
                        to-transparent
                      "
                    />

                    <span
                      className={`
                        absolute
                        left-2.5
                        top-2.5

                        rounded-full

                        border

                        px-2.5
                        py-1

                        text-[8px]
                        font-extrabold
                        capitalize

                        backdrop-blur-md

                        ${status.bg}
                        ${status.border}
                        ${status.text}
                      `}
                    >
                      {event.status}
                    </span>
                  </div>

                  {/* CONTENT */}
                  <div className="p-4">
                    <h2
                      className="
                        break-words

                        text-[13px]
                        font-extrabold
                        leading-5

                        text-white
                      "
                    >
                      {event.title}
                    </h2>

                    <p
                      className="
                        mt-1

                        text-[9px]
                        font-medium

                        text-white/65
                      "
                    >
                      {event.category}

                      {event.createdByName
                        ? ` • ${event.createdByName}`
                        : ''}
                    </p>

                    {/* INFO */}
                    <div
                      className="
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
                            block

                            text-[7px]
                            font-bold
                            uppercase
                            tracking-[0.08em]

                            text-white/55
                          "
                        >
                          Schedule
                        </span>

                        <strong
                          className="
                            mt-1
                            block

                            text-[8px]
                            font-semibold
                            leading-4

                            text-white
                          "
                        >
                          {new Date(
                            event.startDate
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
                            flex
                            items-center
                            gap-1

                            text-[7px]
                            font-bold
                            uppercase
                            tracking-[0.08em]

                            text-white/55
                          "
                        >
                          <Users
                            size={9}
                          />

                          Users
                        </span>

                        <strong
                          className="
                            mt-1
                            block

                            text-[10px]
                            font-black

                            text-white
                          "
                        >
                          {event.registered}

                          {event.capacity
                            ? ` / ${event.capacity}`
                            : ''}
                        </strong>
                      </div>
                    </div>

                    {/* ==================================================
                        MOBILE ACTIONS
                    ================================================== */}
                    <div
                      className={`
                        mt-4

                        grid
                        gap-2

                        ${
                          organizerMode
                            ? 'grid-cols-3'
                            : 'grid-cols-2'
                        }
                      `}
                    >
                      <Link
                        to={`${routeBase}/${event.id}/edit`}
                        className="
                          inline-flex
                          h-9
                          min-w-0
                          items-center
                          justify-center
                          gap-1

                          rounded-xl

                          border
                          border-violet-400/20

                          bg-violet-500/10

                          px-1.5

                          text-[8px]
                          font-extrabold

                          text-violet-200

                          transition

                          hover:bg-violet-500/20
                          hover:text-white
                        "
                      >
                        <Edit3
                          size={11}
                        />

                        Edit
                      </Link>

                      <Link
                        to={`${routeBase}/${event.id}/users`}
                        className="
                          inline-flex
                          h-9
                          min-w-0
                          items-center
                          justify-center
                          gap-1

                          rounded-xl

                          border
                          border-blue-400/20

                          bg-blue-500/10

                          px-1.5

                          text-[8px]
                          font-extrabold

                          text-blue-200

                          transition

                          hover:bg-blue-500/20
                          hover:text-white
                        "
                      >
                        <Users
                          size={11}
                        />

                        Users
                      </Link>

                      {organizerMode && (
                        <button
                          type="button"
                          disabled={
                            deleting
                          }
                          onClick={() =>
                            deleteEvent(
                              event.id,
                              event.title
                            )
                          }
                          className="
                            inline-flex
                            h-9
                            min-w-0
                            items-center
                            justify-center
                            gap-1

                            rounded-xl

                            border
                            border-rose-400/25

                            bg-rose-500/10

                            px-1

                            text-[8px]
                            font-extrabold

                            text-rose-200

                            transition

                            hover:bg-rose-500/20
                            hover:text-white

                            disabled:cursor-not-allowed
                            disabled:opacity-50
                          "
                        >
                          <Trash2
                            size={11}
                          />

                          {deleting
                            ? '...'
                            : 'Delete'}
                        </button>
                      )}
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
      {events.length > 0 && (
        <section
          className="
            hidden
            overflow-hidden

            rounded-2xl

            border
            border-white/[0.08]

            bg-gradient-to-br
            from-[#0d1129]
            to-[#080c1f]

            shadow-[0_14px_40px_rgba(0,0,0,0.24)]

            md:block
          "
        >
          <div className="overflow-x-auto">
            <table
              className="
                w-full
                min-w-[1000px]
                border-collapse
              "
            >
              <thead>
                <tr
                  className="
                    border-b
                    border-white/[0.07]

                    bg-white/[0.025]
                  "
                >
                  {[
                    'Event',
                    'Schedule',
                    'Users',
                    'Status',
                    'Actions',
                  ].map(
                    label => (
                      <th
                        key={
                          label
                        }
                        className="
                          px-5
                          py-3.5

                          text-left

                          text-[9px]
                          font-extrabold
                          uppercase
                          tracking-[0.1em]

                          text-white/60
                        "
                      >
                        {label}
                      </th>
                    )
                  )}
                </tr>
              </thead>

              <tbody>
                {events.map(
                  event => {
                    const status =
                      statusStyle(
                        event.status
                      )

                    const deleting =
                      deletingId ===
                      event.id

                    return (
                      <tr
                        key={
                          event.id
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
                        <td className="px-5 py-4">
                          <div
                            className="
                              flex
                              min-w-[280px]
                              items-center
                              gap-3
                            "
                          >
                            <div
                              className="
                                grid
                                h-14
                                w-20
                                shrink-0
                                place-items-center

                                overflow-hidden

                                rounded-xl

                                bg-gradient-to-br
                                from-violet-500/10
                                to-blue-500/10

                                text-violet-300
                              "
                            >
                              {event.image ? (
                                <img
                                  src={
                                    event.image
                                  }
                                  alt={
                                    event.title
                                  }
                                  className="
                                    h-full
                                    w-full
                                    object-cover
                                  "
                                />
                              ) : (
                                <CalendarDays
                                  size={22}
                                />
                              )}
                            </div>

                            <div className="min-w-0">
                              <strong
                                className="
                                  block
                                  max-w-[280px]
                                  truncate

                                  text-[11px]
                                  font-extrabold

                                  text-white
                                "
                              >
                                {event.title}
                              </strong>

                              <small
                                className="
                                  mt-1
                                  block
                                  max-w-[280px]
                                  truncate

                                  text-[9px]

                                  text-white/60
                                "
                              >
                                {event.category}

                                {event.createdByName
                                  ? ` • ${event.createdByName}`
                                  : ''}
                              </small>
                            </div>
                          </div>
                        </td>

                        {/* SCHEDULE */}
                        <td
                          className="
                            px-5
                            py-4

                            text-[10px]
                            font-semibold

                            text-white/80
                          "
                        >
                          <span className="whitespace-nowrap">
                            {new Date(
                              event.startDate
                            ).toLocaleString()}
                          </span>
                        </td>

                        {/* USERS */}
                        <td className="px-5 py-4">
                          <span
                            className="
                              inline-flex
                              items-center
                              gap-2

                              whitespace-nowrap

                              text-[10px]
                              font-semibold

                              text-white/80
                            "
                          >
                            <Users
                              size={14}
                              className="text-violet-300"
                            />

                            {event.registered}

                            {event.capacity
                              ? ` / ${event.capacity}`
                              : ''}
                          </span>
                        </td>

                        {/* STATUS */}
                        <td className="px-5 py-4">
                          <span
                            className={`
                              inline-flex

                              rounded-full

                              border

                              px-2.5
                              py-1.5

                              text-[8px]
                              font-extrabold
                              capitalize

                              ${status.bg}
                              ${status.border}
                              ${status.text}
                            `}
                          >
                            {event.status}
                          </span>
                        </td>

                        {/* ACTIONS */}
                        <td className="px-5 py-4">
                          <div
                            className="
                              flex
                              items-center
                              gap-2
                            "
                          >
                            <Link
                              to={`${routeBase}/${event.id}/edit`}
                              className="
                                inline-flex
                                items-center
                                gap-1.5

                                rounded-lg

                                border
                                border-violet-400/20

                                bg-violet-500/10

                                px-2.5
                                py-1.5

                                text-[9px]
                                font-extrabold

                                text-violet-200

                                transition

                                hover:bg-violet-500/20
                                hover:text-white
                              "
                            >
                              <Edit3
                                size={11}
                              />

                              Edit
                            </Link>

                            <Link
                              to={`${routeBase}/${event.id}/users`}
                              className="
                                inline-flex
                                items-center
                                gap-1.5

                                rounded-lg

                                border
                                border-blue-400/20

                                bg-blue-500/10

                                px-2.5
                                py-1.5

                                text-[9px]
                                font-extrabold

                                text-blue-200

                                transition

                                hover:bg-blue-500/20
                                hover:text-white
                              "
                            >
                              <Users
                                size={11}
                              />

                              Users
                            </Link>

                            {organizerMode && (
                              <button
                                type="button"
                                disabled={
                                  deleting
                                }
                                onClick={() =>
                                  deleteEvent(
                                    event.id,
                                    event.title
                                  )
                                }
                                className="
                                  inline-flex
                                  items-center
                                  gap-1.5

                                  rounded-lg

                                  border
                                  border-rose-400/25

                                  bg-rose-500/10

                                  px-2.5
                                  py-1.5

                                  text-[9px]
                                  font-extrabold

                                  text-rose-200

                                  transition

                                  hover:border-rose-400/40
                                  hover:bg-rose-500/20
                                  hover:text-white

                                  disabled:cursor-not-allowed
                                  disabled:opacity-50
                                "
                              >
                                <Trash2
                                  size={11}
                                />

                                {deleting
                                  ? 'Deleting...'
                                  : 'Delete'}
                              </button>
                            )}
                          </div>
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

      <div className="h-5" />
    </div>
  )
}
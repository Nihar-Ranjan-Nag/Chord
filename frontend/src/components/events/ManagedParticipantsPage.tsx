import {
  CalendarCheck2,
  CheckCircle2,
  Clock3,
  Sparkles,
  UserCheck,
  Users,
} from 'lucide-react'

import {
  useParams,
} from 'react-router-dom'

import {
  ApiError,
  ApiLoading,
} from '@/components/common/ApiState'

import { useAsyncData } from '@/hooks/useAsyncData'

import { api } from '@/services/api'

import { mapRegistration } from '@/services/mappers'

export function ManagedUsersPage({
  apiBase,
  eyebrow,
}: {
  apiBase: string
  eyebrow: string
}) {
  const {
    id,
  } = useParams()

  const {
    data,
    loading,
    error,
    refresh,
  } = useAsyncData(
    async () => {
      const body: any =
        await api(
          `${apiBase}/${id}/participants`,
          {
            auth: true,
          }
        )

      return (
        body?.data || []
      ).map(mapRegistration)
    },
    [
      id,
      apiBase,
    ]
  )

  const users =
    data || []

  async function attendance(
    uid: string
  ) {
    await api(
      `${apiBase}/${id}/participants/${uid}/attendance`,
      {
        method: 'PATCH',
        auth: true,
      }
    )

    await refresh()
  }

  async function complete(
    uid: string
  ) {
    await api(
      `${apiBase}/${id}/participants/${uid}/complete`,
      {
        method: 'PATCH',
        auth: true,
      }
    )

    await refresh()
  }

  function statusStyle(
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
            UserCheck,
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
          HEADING
      ====================================================== */}
      <section className="mb-5 sm:mb-7">
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
            {eyebrow}
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
          Event{' '}

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
            users
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
          Verify attendance and completion. Points remain protected against duplicate credits by the backend.
        </p>
      </section>

      {/* ======================================================
          EMPTY
      ====================================================== */}
      {users.length === 0 && (
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
            <Users size={22} />
          </span>

          <h2
            className="
              mt-3

              text-[14px]
              font-black

              text-white
            "
          >
            No users
          </h2>

          <p
            className="
              mt-1

              text-[10px]

              text-white/70
            "
          >
            No users have registered for this event yet.
          </p>
        </section>
      )}

      {/* ======================================================
          MOBILE USER CARDS
      ====================================================== */}
      {users.length > 0 && (
        <div
          className="
            grid
            gap-3

            md:hidden
          "
        >
          {users.map(
            registration => {
              const status =
                statusStyle(
                  registration.status
                )

              const StatusIcon =
                status.icon

              const attendanceDisabled =
                registration.status ===
                  'completed' ||
                registration.status ===
                  'attended'

              const completeDisabled =
                registration.status !==
                'attended'

              return (
                <article
                  key={registration.id}
                  className="
                    rounded-2xl

                    border
                    border-white/[0.08]

                    bg-gradient-to-br
                    from-[#11152e]
                    via-[#0d1129]
                    to-[#080c1f]

                    p-4

                    shadow-[0_12px_35px_rgba(0,0,0,0.24)]
                  "
                >
                  {/* USER */}
                  <div
                    className="
                      flex
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
                      <Users size={17} />
                    </span>

                    <div className="min-w-0 flex-1">
                      <h2
                        className="
                          break-words

                          text-[12px]
                          font-extrabold

                          text-white
                        "
                      >
                        {registration.user
                          ?.name ||
                          'User'}
                      </h2>

                      <p
                        className="
                          mt-1

                          break-all

                          text-[8px]

                          text-white/65
                        "
                      >
                        {registration.user
                          ?.email}
                      </p>
                    </div>

                    <span
                      className={`
                        inline-flex
                        shrink-0
                        items-center
                        gap-1

                        rounded-full

                        border

                        px-2
                        py-1

                        text-[7px]
                        font-extrabold
                        capitalize

                        ${status.bg}
                        ${status.border}
                        ${status.text}
                      `}
                    >
                      <StatusIcon size={9} />

                      {registration.status}
                    </span>
                  </div>

                  {/* REGISTERED */}
                  <div
                    className="
                      mt-4

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

                        text-[7px]
                        font-bold
                        uppercase
                        tracking-[0.08em]

                        text-white/55
                      "
                    >
                      <CalendarCheck2
                        size={10}
                      />

                      Registered
                    </span>

                    <strong
                      className="
                        mt-1
                        block

                        text-[9px]
                        font-semibold
                        leading-4

                        text-white
                      "
                    >
                      {new Date(
                        registration.registeredAt
                      ).toLocaleString()}
                    </strong>
                  </div>

                  {/* ACTIONS */}
                  <div
                    className="
                      mt-3

                      grid
                      grid-cols-2

                      gap-2
                    "
                  >
                    <button
                      type="button"
                      disabled={
                        attendanceDisabled
                      }
                      onClick={() =>
                        attendance(
                          registration.userId
                        )
                      }
                      className="
                        inline-flex
                        h-9
                        items-center
                        justify-center
                        gap-1.5

                        rounded-xl

                        border
                        border-violet-400/20

                        bg-violet-500/10

                        px-2

                        text-[8px]
                        font-extrabold

                        text-violet-200

                        transition

                        hover:bg-violet-500/20
                        hover:text-white

                        disabled:cursor-not-allowed
                        disabled:border-white/[0.06]
                        disabled:bg-white/[0.03]
                        disabled:text-white/30
                      "
                    >
                      <UserCheck size={11} />

                      Attendance
                    </button>

                    <button
                      type="button"
                      disabled={
                        completeDisabled
                      }
                      onClick={() =>
                        complete(
                          registration.userId
                        )
                      }
                      className="
                        inline-flex
                        h-9
                        items-center
                        justify-center
                        gap-1.5

                        rounded-xl

                        border
                        border-emerald-400/20

                        bg-emerald-500/10

                        px-2

                        text-[8px]
                        font-extrabold

                        text-emerald-200

                        transition

                        hover:bg-emerald-500/20
                        hover:text-white

                        disabled:cursor-not-allowed
                        disabled:border-white/[0.06]
                        disabled:bg-white/[0.03]
                        disabled:text-white/30
                      "
                    >
                      <CheckCircle2
                        size={11}
                      />

                      Complete
                    </button>
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
      {users.length > 0 && (
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
                min-w-[850px]
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
                  <th
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
                    User
                  </th>

                  <th
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
                    Registered
                  </th>

                  <th
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
                    Status
                  </th>

                  <th
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
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {users.map(
                  registration => {
                    const status =
                      statusStyle(
                        registration.status
                      )

                    const StatusIcon =
                      status.icon

                    const attendanceDisabled =
                      registration.status ===
                        'completed' ||
                      registration.status ===
                        'attended'

                    const completeDisabled =
                      registration.status !==
                      'attended'

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
                        {/* USER */}
                        <td
                          className="
                            px-5
                            py-4
                          "
                        >
                          <div
                            className="
                              min-w-[220px]
                            "
                          >
                            <strong
                              className="
                                block

                                text-[11px]
                                font-extrabold

                                text-white
                              "
                            >
                              {registration.user
                                ?.name ||
                                'User'}
                            </strong>

                            <small
                              className="
                                mt-1
                                block

                                text-[9px]

                                text-white/60
                              "
                            >
                              {registration.user
                                ?.email}
                            </small>
                          </div>
                        </td>

                        {/* REGISTERED */}
                        <td
                          className="
                            px-5
                            py-4

                            text-[10px]
                            font-medium

                            text-white/75
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
                              gap-1

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
                            <StatusIcon
                              size={10}
                            />

                            {registration.status}
                          </span>
                        </td>

                        {/* ACTIONS */}
                        <td
                          className="
                            px-5
                            py-4
                          "
                        >
                          <div
                            className="
                              flex
                              flex-wrap
                              gap-2
                            "
                          >
                            <button
                              type="button"
                              disabled={
                                attendanceDisabled
                              }
                              onClick={() =>
                                attendance(
                                  registration.userId
                                )
                              }
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

                                disabled:cursor-not-allowed
                                disabled:border-white/[0.05]
                                disabled:bg-white/[0.025]
                                disabled:text-white/25
                              "
                            >
                              <UserCheck
                                size={11}
                              />

                              Mark attendance
                            </button>

                            <button
                              type="button"
                              disabled={
                                completeDisabled
                              }
                              onClick={() =>
                                complete(
                                  registration.userId
                                )
                              }
                              className="
                                inline-flex
                                items-center
                                gap-1.5

                                rounded-lg

                                border
                                border-emerald-400/20

                                bg-emerald-500/10

                                px-2.5
                                py-1.5

                                text-[9px]
                                font-extrabold

                                text-emerald-200

                                transition

                                hover:bg-emerald-500/20
                                hover:text-white

                                disabled:cursor-not-allowed
                                disabled:border-white/[0.05]
                                disabled:bg-white/[0.025]
                                disabled:text-white/25
                              "
                            >
                              <CheckCircle2
                                size={11}
                              />

                              Mark complete
                            </button>
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
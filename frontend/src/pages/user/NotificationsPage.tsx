import {
  Bell,
  CalendarDays,
  Check,
  Gift,
  Sparkles,
} from 'lucide-react'

import {
  ApiError,
  ApiLoading,
} from '@/components/common/ApiState'

import { useAsyncData } from '@/hooks/useAsyncData'

import { api } from '@/services/api'

import { mapNotification } from '@/services/mappers'

export function NotificationsPage() {
  const {
    data,
    loading,
    error,
    refresh,
  } = useAsyncData(
    async () => {
      const body: any =
        await api(
          '/users/notifications',
          {
            auth: true,
          }
        )

      return (
        body?.data || []
      ).map(mapNotification)
    },
    []
  )

  async function markRead(
    id: string
  ) {
    await api(
      `/users/notifications/${id}/read`,
      {
        method: 'PATCH',
        auth: true,
      }
    )

    await refresh()
  }

  const notifications =
    data || []

  function notificationStyle(
    type: string
  ) {
    switch (type) {
      case 'reward':
        return {
          icon: Gift,
          iconBg:
            'bg-fuchsia-500/12',
          iconText:
            'text-fuchsia-300',
          border:
            'border-fuchsia-500/[0.15]',
          glow:
            'bg-fuchsia-500/[0.08]',
        }

      case 'points':
        return {
          icon: Sparkles,
          iconBg:
            'bg-emerald-500/12',
          iconText:
            'text-emerald-300',
          border:
            'border-emerald-500/[0.15]',
          glow:
            'bg-emerald-500/[0.08]',
        }

      case 'event':
        return {
          icon: CalendarDays,
          iconBg:
            'bg-blue-500/12',
          iconText:
            'text-blue-300',
          border:
            'border-blue-500/[0.15]',
          glow:
            'bg-blue-500/[0.08]',
        }

      default:
        return {
          icon: Bell,
          iconBg:
            'bg-violet-500/12',
          iconText:
            'text-violet-300',
          border:
            'border-violet-500/[0.15]',
          glow:
            'bg-violet-500/[0.08]',
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
        <div className="flex items-center gap-2">
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
            <Bell size={14} />
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
            NOTIFICATIONS
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
          Your{' '}

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
            notifications
          </span>
        </h1>

        <p
          className="
            mt-2
            max-w-[620px]

            text-[10px]
            leading-5

            text-white/80

            min-[380px]:text-[11px]

            sm:mt-3
            sm:text-[13px]
            sm:leading-6
          "
        >
          Stay updated with events, rewards, points and account activity.
        </p>
      </section>

      {/* ======================================================
          EMPTY
      ====================================================== */}
      {notifications.length === 0 && (
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
          <Bell
            size={34}
            className="
              mx-auto
              text-violet-300
            "
          />

          <h2
            className="
              mt-3
              text-sm
              font-black
              text-white
            "
          >
            No notifications
          </h2>

          <p
            className="
              mt-1
              text-[10px]
              text-white/70
            "
          >
            There are no notifications for your account.
          </p>
        </section>
      )}

      {/* ======================================================
          NOTIFICATIONS
      ====================================================== */}
      {notifications.length > 0 && (
        <div
          className="
            grid
            gap-3

            sm:gap-4

            xl:grid-cols-2
          "
        >
          {notifications.map(
            notification => {
              const style =
                notificationStyle(
                  notification.type
                )

              const Icon =
                style.icon

              return (
                <article
                  key={
                    notification.id
                  }
                  className={`
                    relative
                    overflow-hidden

                    rounded-2xl

                    border

                    ${
                      notification.read
                        ? 'border-white/[0.07]'
                        : style.border
                    }

                    bg-gradient-to-br
                    from-[#11152e]
                    via-[#0d1129]
                    to-[#080c1f]

                    p-4

                    shadow-[0_10px_30px_rgba(0,0,0,0.20)]

                    sm:p-5
                  `}
                >
                  {!notification.read && (
                    <div
                      className={`
                        pointer-events-none
                        absolute
                        -right-14
                        -top-14

                        h-36
                        w-36

                        rounded-full

                        blur-3xl

                        ${style.glow}
                      `}
                    />
                  )}

                  <div
                    className="
                      relative

                      flex
                      items-start
                      gap-3
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

                        ${style.iconBg}
                        ${style.iconText}

                        sm:h-11
                        sm:w-11
                      `}
                    >
                      <Icon
                        size={17}
                      />
                    </span>

                    {/* CONTENT */}
                    <div className="min-w-0 flex-1">
                      <div
                        className="
                          flex
                          items-start
                          justify-between
                          gap-2
                        "
                      >
                        <strong
                          className="
                            break-words

                            text-[11px]
                            font-extrabold
                            leading-5

                            text-white

                            sm:text-[13px]
                          "
                        >
                          {notification.title}
                        </strong>

                        {!notification.read && (
                          <span
                            className="
                              mt-1
                              h-2
                              w-2
                              shrink-0

                              rounded-full

                              bg-violet-400

                              shadow-[0_0_10px_rgba(167,139,250,0.8)]
                            "
                          />
                        )}
                      </div>

                      <p
                        className="
                          mt-1.5

                          text-[9px]
                          leading-5

                          text-white/75

                          sm:text-[11px]
                          sm:leading-6
                        "
                      >
                        {notification.message}
                      </p>

                      <div
                        className="
                          mt-3

                          flex
                          flex-wrap
                          items-center
                          justify-between
                          gap-2
                        "
                      >
                        <small
                          className="
                            text-[8px]
                            font-medium

                            text-white/55

                            sm:text-[9px]
                          "
                        >
                          {new Date(
                            notification.date
                          ).toLocaleString()}
                        </small>

                        {!notification.read ? (
                          <button
                            type="button"
                            onClick={() =>
                              markRead(
                                notification.id
                              )
                            }
                            className="
                              inline-flex
                              items-center
                              gap-1

                              rounded-lg

                              border
                              border-violet-400/20

                              bg-violet-500/10

                              px-2.5
                              py-1.5

                              text-[8px]
                              font-extrabold

                              text-violet-200

                              transition

                              hover:bg-violet-500/20

                              sm:text-[9px]
                            "
                          >
                            <Check
                              size={10}
                            />

                            Mark read
                          </button>
                        ) : (
                          <span
                            className="
                              inline-flex
                              items-center
                              gap-1

                              text-[8px]
                              font-bold

                              text-emerald-300/80
                            "
                          >
                            <Check
                              size={10}
                            />

                            Read
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              )
            }
          )}
        </div>
      )}

      <div className="h-5" />
    </div>
  )
}
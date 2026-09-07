import {
  CalendarDays,
  CheckCircle2,
  Sparkles,
} from 'lucide-react'

import {
  useState,
} from 'react'

import { EventCard } from '@/components/cards/EventCard'

import {
  ApiError,
  ApiLoading,
} from '@/components/common/ApiState'

import { useAsyncData } from '@/hooks/useAsyncData'

import { api } from '@/services/api'

import {
  mapEvent,
  mapRegistration,
} from '@/services/mappers'

import { useAuth } from '@/features/auth/AuthContext'

export function StudentEventsPage() {
  const {
    refreshUser,
  } = useAuth()

  const [
    message,
    setMessage,
  ] = useState('')

  const [
    actionError,
    setActionError,
  ] = useState('')

  const [
    registeringId,
    setRegisteringId,
  ] = useState<string | null>(
    null
  )

  const {
    data,
    loading,
    error,
    refresh,
  } = useAsyncData(
    async () => {
      const [
        eventsResponse,
        mineResponse,
      ]: any[] =
        await Promise.all([
          api(
            '/events?limit=50'
          ),

          api(
            '/events/mine',
            {
              auth: true,
            }
          ),
        ])

      return {
        events: (
          eventsResponse?.data
            ?.items || []
        ).map(mapEvent),

        registeredIds:
          new Set(
            (
              mineResponse?.data ||
              []
            ).map(
              (registration: any) =>
                mapRegistration(
                  registration
                ).eventId
            )
          ),
      }
    },
    []
  )

  async function register(
    id: string
  ) {
    setMessage('')
    setActionError('')
    setRegisteringId(id)

    try {
      await api(
        `/events/${id}/register`,
        {
          method: 'POST',
          auth: true,
        }
      )

      setMessage(
        'Event registration completed successfully.'
      )

      await Promise.all([
        refresh(),
        refreshUser(),
      ])
    } catch (err) {
      setActionError(
        err instanceof Error
          ? err.message
          : 'Registration failed'
      )
    } finally {
      setRegisteringId(null)
    }
  }

  const events =
    data?.events || []

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
            EVENTS
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
          Explore{' '}

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
            events
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
          Register for published events and build your participation history.
        </p>
      </section>

      {/* ======================================================
          SUCCESS
      ====================================================== */}
      {message && (
        <div
          className="
            mb-4

            flex
            items-center
            gap-2.5

            rounded-xl

            border
            border-emerald-400/20

            bg-emerald-500/[0.10]

            px-3
            py-3

            text-[10px]
            font-semibold

            text-emerald-100

            sm:mb-5
            sm:px-4
            sm:text-xs
          "
        >
          <CheckCircle2
            size={15}
            className="
              shrink-0
              text-emerald-300
            "
          />

          {message}
        </div>
      )}

      {/* ACTION ERROR */}
      {actionError && (
        <div className="mb-4">
          <ApiError
            message={actionError}
          />
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="py-8">
          <ApiLoading />
        </div>
      )}

      {/* API ERROR */}
      {error && (
        <div className="py-8">
          <ApiError
            message={error}
          />
        </div>
      )}

      {/* ======================================================
          EMPTY STATE
      ====================================================== */}
      {!loading &&
        !error &&
        events.length === 0 && (
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
              <CalendarDays
                size={22}
              />
            </span>

            <h2
              className="
                mt-3

                text-sm
                font-black

                text-white
              "
            >
              No events
            </h2>

            <p
              className="
                mt-1

                text-[10px]

                text-white/70
              "
            >
              No events are currently published.
            </p>
          </section>
        )}

      {/* ======================================================
          EVENT GRID

          MOBILE = 2
          TABLET = 2
          LARGE DESKTOP = 3
      ====================================================== */}
      {!loading &&
        !error &&
        events.length > 0 && (
          <section
            className="
              grid
              grid-cols-2

              gap-2.5

              min-[380px]:gap-3

              sm:gap-4

              xl:grid-cols-3
            "
          >
            {events.map(event => {
              const registered =
                data?.registeredIds.has(
                  event.id
                )

              const registering =
                registeringId ===
                event.id

              return (
                <div
                  key={event.id}
                  className="
                    flex
                    min-w-0
                    flex-col
                    gap-2

                    sm:gap-3
                  "
                >
                  <EventCard
                    event={event}
                    detailsTo={`/dashboard/events/${event.slug}`}
                  />

                  <button
                    type="button"
                    disabled={
                      registered ||
                      registering
                    }
                    onClick={() =>
                      register(event.id)
                    }
                    className="
                      h-8
                      w-full

                      rounded-lg

                      bg-gradient-to-r
                      from-violet-600
                      via-purple-600
                      to-blue-600

                      px-1.5

                      text-[8px]
                      font-extrabold

                      text-white

                      shadow-[0_8px_24px_rgba(124,58,237,0.18)]

                      transition

                      hover:-translate-y-0.5

                      disabled:cursor-not-allowed
                      disabled:border
                      disabled:border-white/[0.07]
                      disabled:bg-none
                      disabled:bg-white/[0.045]
                      disabled:text-white/45

                      min-[380px]:h-9
                      min-[380px]:text-[9px]

                      sm:h-11
                      sm:rounded-xl
                      sm:px-4
                      sm:text-xs
                    "
                  >
                    {registering
                      ? 'Registering...'
                      : registered
                        ? 'Already registered'
                        : 'Register for event'}
                  </button>
                </div>
              )
            })}
          </section>
        )}

      <div className="h-5 sm:h-0" />
    </div>
  )
}
import {
  Crown,
  Medal,
  Sparkles,
  Trophy,
} from 'lucide-react'

import {
  ApiError,
  ApiLoading,
  EmptyState,
} from '@/components/common/ApiState'

import { useAsyncData } from '@/hooks/useAsyncData'
import { api } from '@/services/api'
import { mapUser } from '@/services/mappers'

export function LeaderboardPage() {
  const {
    data: users,
    loading,
    error,
  } = useAsyncData(
    async () => {
      const body: any = await api('/users/leaderboard')

      return (body?.data || []).map(mapUser)
    },
    []
  )

  const leaderboard = users || []

  const first = leaderboard[0]
  const second = leaderboard[1]
  const third = leaderboard[2]

  const remainingUsers = leaderboard.slice(3)

  const getInitials = (name?: string) => {
    return String(name || 'Student')
      .split(' ')
      .filter(Boolean)
      .map((item) => item[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
  }

  const renderAvatar = (
    user: any,
    sizeClass: string
  ) => {
    const initials = getInitials(user?.name)

    return (
      <div
        className={`
          relative
          shrink-0
          overflow-hidden
          rounded-full
          border-2
          border-violet-400/25
          bg-gradient-to-br
          from-violet-500/20
          to-fuchsia-500/10
          shadow-[0_10px_30px_rgba(0,0,0,0.30)]
          ${sizeClass}
        `}
      >
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt={user.name || 'Student'}
            className="
              h-full
              w-full
              object-cover
              object-center
            "
          />
        ) : (
          <div
            className="
              grid
              h-full
              w-full
              place-items-center
              text-[10px]
              font-extrabold
              text-violet-200
              sm:text-sm
            "
          >
            {initials}
          </div>
        )}
      </div>
    )
  }

  const renderPodiumCard = (
    user: any,
    rank: number
  ) => {
    if (!user) return null

    const isFirst = rank === 1
    const isSecond = rank === 2

    const rankStyles =
      rank === 1
        ? {
            border: 'border-amber-400/30',
            bg: 'from-amber-500/[0.10] via-[#151127] to-[#0d1025]',
            text: 'text-amber-300',
            icon: 'text-amber-400',
            ring: 'ring-amber-400/30',
          }
        : rank === 2
          ? {
              border: 'border-slate-400/20',
              bg: 'from-slate-500/[0.08] via-[#11152c] to-[#0d1025]',
              text: 'text-slate-200',
              icon: 'text-slate-300',
              ring: 'ring-slate-300/20',
            }
          : {
              border: 'border-orange-400/20',
              bg: 'from-orange-500/[0.08] via-[#151127] to-[#0d1025]',
              text: 'text-orange-300',
              icon: 'text-orange-400',
              ring: 'ring-orange-400/20',
            }

    return (
      <div
        className={`
          relative
          overflow-hidden
          rounded-2xl
          border
          bg-gradient-to-b
          p-3
          text-center
          shadow-[0_15px_40px_rgba(0,0,0,0.28)]

          min-[380px]:p-4

          sm:rounded-[22px]
          sm:p-5

          ${rankStyles.border}
          ${rankStyles.bg}

          ${
            isFirst
              ? 'md:-translate-y-8'
              : ''
          }
        `}
      >
        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-0
            h-28
            w-28
            -translate-x-1/2
            rounded-full
            bg-violet-500/10
            blur-3xl
          "
        />

        {/* RANK */}
        <div
          className={`
            relative
            mx-auto
            mb-2
            flex
            items-center
            justify-center
            gap-1

            text-[9px]
            font-black
            uppercase
            tracking-[0.13em]

            sm:text-[10px]

            ${rankStyles.text}
          `}
        >
          {isFirst ? (
            <Crown
              size={14}
              className={rankStyles.icon}
            />
          ) : (
            <Trophy
              size={13}
              className={rankStyles.icon}
            />
          )}

          Rank {rank}
        </div>

        {/* AVATAR */}
        <div className="relative mx-auto w-fit">
          {renderAvatar(
            user,
            isFirst
              ? 'h-[74px] w-[74px] min-[380px]:h-[82px] min-[380px]:w-[82px] sm:h-[96px] sm:w-[96px]'
              : 'h-[62px] w-[62px] min-[380px]:h-[70px] min-[380px]:w-[70px] sm:h-[82px] sm:w-[82px]'
          )}

          <div
            className={`
              pointer-events-none
              absolute
              inset-0
              rounded-full
              ring-2
              ring-offset-2
              ring-offset-[#0d1025]

              ${rankStyles.ring}
            `}
          />
        </div>

        {/* USER */}
        <h3
          className="
            mt-3
            truncate

            text-[11px]
            font-black
            text-white

            min-[380px]:text-[12px]

            sm:text-base
          "
        >
          {user.name}
        </h3>

        <p
          className="
            mt-1
            truncate

            text-[7px]
            text-slate-500

            min-[380px]:text-[8px]

            sm:text-[11px]
          "
        >
          {user.college ||
            user.course ||
            'Student'}
        </p>

        {/* POINTS */}
        <div
          className="
            mt-3
            inline-flex
            items-center
            gap-1

            rounded-full

            border
            border-violet-500/15

            bg-violet-500/[0.08]

            px-2
            py-1

            text-[8px]
            font-extrabold
            text-violet-300

            min-[380px]:px-2.5
            min-[380px]:text-[9px]

            sm:px-3
            sm:py-1.5
            sm:text-xs
          "
        >
          <Medal
            size={9}
            className="text-fuchsia-400 sm:size-[13px]"
          />

          {Number(
            user.points || 0
          ).toLocaleString()}

          <span className="hidden min-[420px]:inline">
            pts
          </span>
        </div>
      </div>
    )
  }

  return (
    <main
      className="
        relative
        overflow-hidden
        bg-[#050818]
      "
    >
      {/* ======================================================
          BACKGROUND
      ====================================================== */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="
            absolute
            -left-[170px]
            top-[100px]
            h-[400px]
            w-[400px]
            rounded-full
            bg-violet-700/[0.08]
            blur-[120px]
          "
        />

        <div
          className="
            absolute
            -right-[170px]
            top-[300px]
            h-[440px]
            w-[440px]
            rounded-full
            bg-fuchsia-700/[0.07]
            blur-[130px]
          "
        />
      </div>

      <div
        className="
          relative
          mx-auto
          w-full
          max-w-[1120px]

          px-3
          pb-10
          pt-7

          min-[380px]:px-4

          sm:px-6
          sm:pb-12
          sm:pt-10

          lg:px-8
          lg:pb-14
          lg:pt-12
        "
      >
        {/* ======================================================
            HEADER
        ====================================================== */}
        <div
          className="
            mb-8
            text-center

            sm:mb-10
          "
        >
          <div
            className="
              flex
              items-center
              justify-center
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
              <Trophy
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
              Leaderboard
            </span>
          </div>

          <h1
            className="
              mx-auto
              mt-3
              max-w-[720px]

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
            Top CHORD{' '}

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
              performers
            </span>
          </h1>

          <p
            className="
              mx-auto
              mt-3
              max-w-[620px]

              text-[11px]
              leading-5

              text-slate-400

              min-[380px]:text-[12px]

              sm:text-sm
              sm:leading-6
            "
          >
            Celebrate students who are leading through
            participation, activities and verified points.
          </p>
        </div>

        {/* ======================================================
            STATES
        ====================================================== */}
        {loading && (
          <div className="py-10">
            <ApiLoading />
          </div>
        )}

        {error && (
          <div className="py-10">
            <ApiError message={error} />
          </div>
        )}

        {!loading &&
          !error &&
          leaderboard.length === 0 && (
            <EmptyState
              title="Leaderboard is empty"
              message="No active students have points yet."
            />
          )}

        {!loading &&
          !error &&
          leaderboard.length > 0 && (
            <>
              {/* ==================================================
                  TOP 3 PODIUM

                  MOBILE:
                    #1 TOP FULL WIDTH
                    #2 + #3 BELOW

                  DESKTOP:
                    #2  #1  #3
              ================================================== */}
              <section
                className="
                  mx-auto
                  max-w-[880px]
                "
              >
                {/* MOBILE #1 */}
                <div
                  className="
                    mx-auto
                    mb-3
                    max-w-[230px]

                    md:hidden
                  "
                >
                  {renderPodiumCard(first, 1)}
                </div>

                {/* MOBILE #2 + #3 */}
                <div
                  className="
                    grid
                    grid-cols-2
                    gap-2.5

                    min-[380px]:gap-3

                    md:hidden
                  "
                >
                  {second && renderPodiumCard(second, 2)}
                  {third && renderPodiumCard(third, 3)}
                </div>

                {/* DESKTOP PODIUM */}
                <div
                  className="
                    hidden

                    md:grid
                    md:grid-cols-3
                    md:items-end
                    md:gap-5

                    lg:gap-7
                  "
                >
                  <div>
                    {second &&
                      renderPodiumCard(
                        second,
                        2
                      )}
                  </div>

                  <div>
                    {renderPodiumCard(
                      first,
                      1
                    )}
                  </div>

                  <div>
                    {third &&
                      renderPodiumCard(
                        third,
                        3
                      )}
                  </div>
                </div>
              </section>

              {/* ==================================================
                  REST OF RANKINGS
              ================================================== */}
              {remainingUsers.length > 0 && (
                <section
                  className="
                    mt-5
                    overflow-hidden

                    rounded-2xl

                    border
                    border-violet-500/[0.14]

                    bg-gradient-to-b
                    from-[#0d1129]
                    to-[#080c1f]

                    shadow-[0_18px_55px_rgba(0,0,0,0.30)]

                    sm:mt-7
                    sm:rounded-[22px]

                    md:mt-10
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      justify-between

                      border-b
                      border-white/[0.06]

                      px-3
                      py-3

                      sm:px-5
                      sm:py-4
                    "
                  >
                    <div>
                      <span
                        className="
                          text-[8px]
                          font-extrabold
                          uppercase
                          tracking-[0.14em]

                          text-violet-400

                          sm:text-[9px]
                        "
                      >
                        Rankings
                      </span>

                       
                    </div>

                    <Sparkles
                      size={18}
                      className="text-violet-400/70"
                    />
                  </div>

                  {remainingUsers.map(
                    (
                      user: any,
                      index: number
                    ) => {
                      const rank = index + 4

                      return (
                        <div
                          key={user.id}
                          className="
                            grid
                            grid-cols-[30px_40px_minmax(0,1fr)_auto]
                            items-center
                            gap-2

                            border-b
                            border-white/[0.06]

                            px-2.5
                            py-3

                            last:border-b-0

                            transition
                            duration-300

                            hover:bg-white/[0.025]

                            min-[380px]:grid-cols-[34px_44px_minmax(0,1fr)_auto]
                            min-[380px]:gap-2.5
                            min-[380px]:px-3

                            sm:grid-cols-[42px_50px_minmax(0,1fr)_auto]
                            sm:gap-3
                            sm:px-5
                            sm:py-4
                          "
                        >
                          {/* RANK */}
                          <div
                            className="
                              grid
                              place-items-center

                              text-[9px]
                              font-black

                              text-slate-500

                              sm:text-sm
                            "
                          >
                            {rank}
                          </div>

                          {/* AVATAR */}
                          {renderAvatar(
                            user,
                            'h-[40px] w-[40px] min-[380px]:h-[44px] min-[380px]:w-[44px] sm:h-[50px] sm:w-[50px]'
                          )}

                          {/* INFO */}
                          <div className="min-w-0">
                            <strong
                              className="
                                block
                                truncate

                                text-[9px]
                                font-extrabold

                                text-white

                                min-[380px]:text-[10px]

                                sm:text-sm
                              "
                            >
                              {user.name}
                            </strong>

                            <small
                              className="
                                mt-0.5
                                block
                                truncate

                                text-[6.5px]

                                text-slate-500

                                min-[380px]:text-[7.5px]

                                sm:mt-1
                                sm:text-xs
                              "
                            >
                              {user.college ||
                                user.course ||
                                'Student'}
                            </small>
                          </div>

                          {/* POINTS */}
                          <div
                            className="
                              flex
                              shrink-0
                              items-center
                              gap-1

                              rounded-full

                              border
                              border-violet-500/15

                              bg-violet-500/[0.08]

                              px-1.5
                              py-1

                              text-[7px]
                              font-extrabold

                              text-violet-300

                              min-[380px]:px-2
                              min-[380px]:text-[8px]

                              sm:gap-1.5
                              sm:px-3
                              sm:py-1.5
                              sm:text-xs
                            "
                          >
                            <Medal
                              size={8}
                              className="text-fuchsia-400 sm:size-[13px]"
                            />

                            {Number(
                              user.points || 0
                            ).toLocaleString()}

                            <span className="hidden min-[430px]:inline">
                              pts
                            </span>
                          </div>
                        </div>
                      )
                    }
                  )}
                </section>
              )}
            </>
          )}
      </div>
    </main>
  )
}
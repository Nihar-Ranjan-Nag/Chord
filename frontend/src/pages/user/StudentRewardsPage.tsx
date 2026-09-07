import {
  CheckCircle2,
  Gift,
  PackageCheck,
  Sparkles,
  Trophy,
  XCircle,
} from 'lucide-react'

import { useState } from 'react'

import { RewardCard } from '@/components/cards/RewardCard'

import {
  ApiError,
  ApiLoading,
} from '@/components/common/ApiState'

import { useAsyncData } from '@/hooks/useAsyncData'

import { api } from '@/services/api'

import {
  mapRedemption,
  mapReward,
} from '@/services/mappers'

import { useAuth } from '@/features/auth/AuthContext'

export function StudentRewardsPage() {
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
    redeemingId,
    setRedeemingId,
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
        rewardsResponse,
        redemptionsResponse,
      ]: any[] =
        await Promise.all([
          api('/rewards'),

          api(
            '/rewards/mine',
            {
              auth: true,
            }
          ),
        ])

      return {
        rewards:
          (
            rewardsResponse?.data ||
            []
          ).map(mapReward),

        redemptions:
          (
            redemptionsResponse?.data ||
            []
          ).map(mapRedemption),
      }
    },
    []
  )

  async function redeem(
    id: string
  ) {
    setMessage('')
    setActionError('')
    setRedeemingId(id)

    try {
      await api(
        `/rewards/${id}/redeem`,
        {
          method: 'POST',
          auth: true,
        }
      )

      setMessage(
        'Reward redemption request submitted.'
      )

      await Promise.all([
        refresh(),
        refreshUser(),
      ])
    } catch (err) {
      setActionError(
        err instanceof Error
          ? err.message
          : 'Unable to redeem reward'
      )
    } finally {
      setRedeemingId(null)
    }
  }

  const rewards =
    data?.rewards || []

  const redemptions =
    data?.redemptions || []

  function redemptionStyle(
    status: string
  ) {
    if (
      status === 'delivered' ||
      status === 'approved'
    ) {
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
    }

    if (
      status === 'rejected'
    ) {
      return {
        text:
          'text-rose-200',
        bg:
          'bg-rose-500/10',
        border:
          'border-rose-400/20',
        icon:
          XCircle,
      }
    }

    return {
      text:
        'text-blue-200',
      bg:
        'bg-blue-500/10',
      border:
        'border-blue-400/20',
      icon:
        PackageCheck,
    }
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
            REWARDS
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
          Rewards{' '}

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
            store
          </span>
        </h1>

        <p
          className="
            mt-2
            max-w-[640px]

            text-[10px]
            leading-5

            text-white/80

            min-[380px]:text-[11px]

            sm:mt-3
            sm:text-[13px]
            sm:leading-6
          "
        >
          Explore the live reward catalog and track your redemption requests.
        </p>
      </section>

      {/* SUCCESS */}
      {message && (
        <div
          className="
            mb-4

            flex
            items-center
            gap-2

            rounded-xl

            border
            border-emerald-400/20

            bg-emerald-500/10

            px-3
            py-3

            text-[10px]
            font-semibold

            text-emerald-100

            sm:mb-5
            sm:text-xs
          "
        >
          <CheckCircle2
            size={15}
            className="shrink-0"
          />

          {message}
        </div>
      )}

      {actionError && (
        <div className="mb-4">
          <ApiError
            message={actionError}
          />
        </div>
      )}

      {loading && (
        <div className="py-8">
          <ApiLoading />
        </div>
      )}

      {error && (
        <div className="py-8">
          <ApiError
            message={error}
          />
        </div>
      )}

      {/* EMPTY REWARDS */}
      {!loading &&
        !error &&
        rewards.length === 0 && (
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
            <Gift
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
              No rewards
            </h2>

            <p
              className="
                mt-1
                text-[10px]
                text-white/70
              "
            >
              No rewards are currently available.
            </p>
          </section>
        )}

      {/* ======================================================
          REWARD GRID

          2 CARDS ON MOBILE
      ====================================================== */}
      {!loading &&
        !error &&
        rewards.length > 0 && (
          <section
            className="
              grid
              grid-cols-2

              gap-2.5

              min-[380px]:gap-3

              sm:gap-4

              lg:grid-cols-3

              xl:grid-cols-4
            "
          >
            {rewards.map(reward => {
              const outOfStock =
                reward.stock <= 0

              const redeeming =
                redeemingId ===
                reward.id

              return (
                <div
                  key={reward.id}
                  className="
                    flex
                    min-w-0
                    flex-col
                    gap-2

                    sm:gap-3
                  "
                >
                  <RewardCard
                    reward={reward}
                  />

                  <button
                    type="button"
                    disabled={
                      outOfStock ||
                      redeeming
                    }
                    onClick={() =>
                      redeem(
                        reward.id
                      )
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

                      text-[7px]
                      font-extrabold

                      text-white

                      shadow-[0_8px_24px_rgba(124,58,237,0.18)]

                      transition

                      hover:-translate-y-0.5

                      disabled:cursor-not-allowed
                      disabled:bg-none
                      disabled:bg-white/[0.05]
                      disabled:text-white/45

                      min-[380px]:h-9
                      min-[380px]:text-[8px]

                      sm:h-10
                      sm:rounded-xl
                      sm:px-3
                      sm:text-[10px]
                    "
                  >
                    {redeeming
                      ? 'Redeeming...'
                      : outOfStock
                        ? 'Out of stock'
                        : `Redeem ${reward.points} pts`}
                  </button>
                </div>
              )
            })}
          </section>
        )}

      {/* ======================================================
          REDEMPTIONS
      ====================================================== */}
      {redemptions.length > 0 && (
        <section className="mt-7 sm:mt-9">
          <div
            className="
              mb-4

              flex
              items-center
              gap-2
            "
          >
            <span
              className="
                grid
                h-8
                w-8
                place-items-center

                rounded-lg

                bg-fuchsia-500/10
                text-fuchsia-300
              "
            >
              <Trophy size={15} />
            </span>

            <div>
              <h2
                className="
                  text-[15px]
                  font-black

                  text-white

                  sm:text-lg
                "
              >
                My redemptions
              </h2>

              <p
                className="
                  mt-0.5
                  text-[8px]
                  text-white/60
                  sm:text-[10px]
                "
              >
                Your reward request history
              </p>
            </div>
          </div>

          {/* MOBILE */}
          <div
            className="
              grid
              gap-3

              md:hidden
            "
          >
            {redemptions.map(item => {
              const style =
                redemptionStyle(
                  item.status
                )

              const StatusIcon =
                style.icon

              return (
                <article
                  key={item.id}
                  className="
                    rounded-2xl

                    border
                    border-white/[0.08]

                    bg-gradient-to-br
                    from-[#11152e]
                    to-[#080c1f]

                    p-4
                  "
                >
                  <div
                    className="
                      flex
                      items-start
                      justify-between
                      gap-3
                    "
                  >
                    <div className="min-w-0">
                      <h3
                        className="
                          break-words
                          text-[11px]
                          font-extrabold
                          text-white
                        "
                      >
                        {item.reward?.name ||
                          `Reward #${item.rewardId}`}
                      </h3>

                      <p
                        className="
                          mt-1
                          text-[8px]
                          text-white/65
                        "
                      >
                        {new Date(
                          item.requestedAt
                        ).toLocaleString()}
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

                        ${style.bg}
                        ${style.border}
                        ${style.text}
                      `}
                    >
                      <StatusIcon
                        size={9}
                      />

                      {item.status}
                    </span>
                  </div>

                  <div
                    className="
                      mt-3

                      rounded-xl

                      border
                      border-white/[0.06]

                      bg-white/[0.025]

                      px-3
                      py-2
                    "
                  >
                    <span
                      className="
                        text-[8px]
                        font-bold
                        text-white/60
                      "
                    >
                      Points used
                    </span>

                    <strong
                      className="
                        ml-2
                        text-[10px]
                        font-black
                        text-violet-200
                      "
                    >
                      {item.points} pts
                    </strong>
                  </div>
                </article>
              )
            })}
          </div>

          {/* DESKTOP */}
          <div
            className="
              hidden
              overflow-hidden

              rounded-2xl

              border
              border-white/[0.08]

              bg-[#0a0e22]

              md:block
            "
          >
            <div className="overflow-x-auto">
              <table
                className="
                  w-full
                  min-w-[720px]
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
                      'Reward',
                      'Points',
                      'Requested',
                      'Status',
                    ].map(label => (
                      <th
                        key={label}
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
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {redemptions.map(
                    item => {
                      const style =
                        redemptionStyle(
                          item.status
                        )

                      return (
                        <tr
                          key={item.id}
                          className="
                            border-b
                            border-white/[0.06]

                            last:border-b-0

                            hover:bg-white/[0.025]
                          "
                        >
                          <td
                            className="
                              px-5
                              py-4

                              text-[11px]
                              font-bold

                              text-white
                            "
                          >
                            {item.reward?.name ||
                              `Reward #${item.rewardId}`}
                          </td>

                          <td
                            className="
                              px-5
                              py-4

                              text-[11px]
                              font-black

                              text-violet-200
                            "
                          >
                            {item.points}
                          </td>

                          <td
                            className="
                              px-5
                              py-4

                              text-[10px]

                              text-white/75
                            "
                          >
                            {new Date(
                              item.requestedAt
                            ).toLocaleString()}
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`
                                rounded-full
                                border

                                px-2.5
                                py-1.5

                                text-[9px]
                                font-extrabold
                                capitalize

                                ${style.bg}
                                ${style.border}
                                ${style.text}
                              `}
                            >
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      )
                    }
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      <div className="h-5" />
    </div>
  )
}
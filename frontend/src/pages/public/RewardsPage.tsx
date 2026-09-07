import {
  Gift,
  Search,
  Sparkles,
  Trophy,
} from 'lucide-react'

import {
  useMemo,
  useState,
} from 'react'

import { RewardCard } from '@/components/cards/RewardCard'

import {
  ApiError,
  EmptyState,
} from '@/components/common/ApiState'

import { useAsyncData } from '@/hooks/useAsyncData'
import { api } from '@/services/api'
import { mapReward } from '@/services/mappers'

function RewardGridSkeleton() {
  return (
    <div
      className="
        grid
        grid-cols-2
        gap-2
        min-[380px]:gap-2.5
        sm:gap-4
        lg:grid-cols-3
        xl:grid-cols-4
        xl:gap-5
      "
    >
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="
            overflow-hidden
            rounded-2xl
            border
            border-white/[0.07]
            bg-[#0a0e24]
          "
        >
          <div className="aspect-square animate-pulse bg-white/[0.045]" />

          <div className="space-y-3 p-3 sm:p-4">
            <div className="h-4 w-3/4 animate-pulse rounded bg-white/[0.07]" />
            <div className="h-3 w-full animate-pulse rounded bg-white/[0.045]" />

            <div className="mt-4 flex items-center justify-between">
              <div className="h-7 w-20 animate-pulse rounded-lg bg-fuchsia-500/[0.08]" />
              <div className="h-7 w-14 animate-pulse rounded-lg bg-white/[0.04]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function RewardsPage() {
  const [search, setSearch] = useState('')

  const {
    data: rewards,
    loading,
    error,
  } = useAsyncData(
    async () => {
      const body: any = await api('/rewards')

      return (body?.data || []).map(mapReward)
    },
    []
  )

  const filteredRewards = useMemo(() => {
    const list = rewards || []

    const value = search
      .trim()
      .toLowerCase()

    if (!value) {
      return list
    }

    return list.filter((reward: any) => {
      const title =
        reward?.title ||
        reward?.name ||
        ''

      const description =
        reward?.description ||
        reward?.shortDescription ||
        reward?.short_description ||
        ''

      const category =
        reward?.category ||
        reward?.type ||
        ''

      return (
        title
          .toLowerCase()
          .includes(value) ||
        description
          .toLowerCase()
          .includes(value) ||
        category
          .toLowerCase()
          .includes(value)
      )
    })
  }, [rewards, search])

  return (
    <main
      className="
        relative
        overflow-hidden
        bg-[#050818]
      "
    >
      {/* ======================================================
          BACKGROUND DECORATION
      ====================================================== */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="
            absolute
            -left-[170px]
            top-[100px]

            h-[380px]
            w-[380px]

            rounded-full

            bg-violet-700/[0.08]

            blur-[115px]
          "
        />

        <div
          className="
            absolute
            -right-[170px]
            top-[320px]

            h-[430px]
            w-[430px]

            rounded-full

            bg-fuchsia-700/[0.07]

            blur-[125px]
          "
        />

        <div
          className="
            absolute
            bottom-[5%]
            left-[35%]

            h-[280px]
            w-[380px]

            rounded-full

            bg-blue-700/[0.05]

            blur-[110px]
          "
        />
      </div>

      <div
        className="
          relative
          mx-auto
          w-full
          max-w-[1240px]

          px-3
          pb-8
          pt-7

          min-[380px]:px-4

          sm:px-6
          sm:pb-10
          sm:pt-10

          lg:px-8
          lg:pb-12
          lg:pt-12
        "
      >
        {/* ======================================================
            HEADER
        ====================================================== */}
        <div className="mb-5 sm:mb-7">
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

                bg-fuchsia-500/10

                text-fuchsia-400

                sm:h-8
                sm:w-8
              "
            >
              <Gift
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

                text-fuchsia-400

                sm:text-[11px]
              "
            >
              Rewards
            </span>
          </div>

          <h1
            className="
              mt-3

              max-w-[680px]

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
            Redeem points for{' '}

            <span
              className="
                bg-gradient-to-r
                from-fuchsia-400
                via-violet-400
                to-blue-400

                bg-clip-text
                text-transparent
              "
            >
              exciting rewards
            </span>
          </h1>

          <p
            className="
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
            Use your verified CHORD points to unlock rewards,
            perks and exclusive benefits available in the live
            rewards catalog.
          </p>
        </div>

        {/* ======================================================
            TOP SUMMARY
        ====================================================== */}
        <div
          className="
            mb-5

            grid
            grid-cols-2

            gap-2

            min-[380px]:gap-2.5

            sm:mb-7
            sm:gap-4

            md:grid-cols-3
          "
        >
          {/* AVAILABLE REWARDS */}
          <div
            className="
              relative
              overflow-hidden

              rounded-xl

              border
              border-white/[0.07]

              bg-[#0b0f25]

              p-3

              sm:rounded-2xl
              sm:p-4
            "
          >
            <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-fuchsia-500/10 blur-3xl" />

            <div className="relative">
              <div
                className="
                  grid
                  h-8
                  w-8
                  place-items-center

                  rounded-lg

                  bg-fuchsia-500/10

                  text-fuchsia-400

                  sm:h-10
                  sm:w-10
                "
              >
                <Gift
                  size={15}
                  className="sm:size-[18px]"
                />
              </div>

              <span
                className="
                  mt-2.5
                  block

                  text-[7px]
                  font-bold
                  uppercase
                  tracking-wider

                  text-slate-500

                  sm:text-[9px]
                "
              >
                Available rewards
              </span>

              <strong
                className="
                  mt-1
                  block

                  text-[17px]
                  font-black

                  text-white

                  sm:text-[22px]
                "
              >
                {(rewards || []).length}
              </strong>
            </div>
          </div>

          {/* CATALOG */}
          <div
            className="
              relative
              overflow-hidden

              rounded-xl

              border
              border-white/[0.07]

              bg-[#0b0f25]

              p-3

              sm:rounded-2xl
              sm:p-4
            "
          >
            <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-violet-500/10 blur-3xl" />

            <div className="relative">
              <div
                className="
                  grid
                  h-8
                  w-8
                  place-items-center

                  rounded-lg

                  bg-violet-500/10

                  text-violet-400

                  sm:h-10
                  sm:w-10
                "
              >
                <Trophy
                  size={15}
                  className="sm:size-[18px]"
                />
              </div>

              <span
                className="
                  mt-2.5
                  block

                  text-[7px]
                  font-bold
                  uppercase
                  tracking-wider

                  text-slate-500

                  sm:text-[9px]
                "
              >
                Redeem with
              </span>

              <strong
                className="
                  mt-1
                  block

                  text-[14px]
                  font-black

                  text-violet-300

                  min-[380px]:text-[15px]

                  sm:text-[18px]
                "
              >
                CHORD Points
              </strong>
            </div>
          </div>

          {/* LIVE CATALOG */}
          <div
            className="
              relative
              col-span-2
              overflow-hidden

              rounded-xl

              border
              border-white/[0.07]

              bg-[#0b0f25]

              p-3

              sm:rounded-2xl
              sm:p-4

              md:col-span-1
            "
          >
            <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-blue-500/10 blur-3xl" />

            <div className="relative">
              <div
                className="
                  grid
                  h-8
                  w-8
                  place-items-center

                  rounded-lg

                  bg-blue-500/10

                  text-blue-400

                  sm:h-10
                  sm:w-10
                "
              >
                <Sparkles
                  size={15}
                  className="sm:size-[18px]"
                />
              </div>

              <span
                className="
                  mt-2.5
                  block

                  text-[7px]
                  font-bold
                  uppercase
                  tracking-wider

                  text-slate-500

                  sm:text-[9px]
                "
              >
                Catalog status
              </span>

              <strong
                className="
                  mt-1
                  block

                  text-[14px]
                  font-black

                  text-blue-300

                  min-[380px]:text-[15px]

                  sm:text-[18px]
                "
              >
                Live & Updated
              </strong>
            </div>
          </div>
        </div>

        {/* ======================================================
            SEARCH
        ====================================================== */}
        <div
          className="
            relative
            mb-4

            sm:mb-6
          "
        >
          <Search
            size={15}
            className="
              absolute
              left-3
              top-1/2

              -translate-y-1/2

              text-slate-500

              sm:left-4
              sm:size-[18px]
            "
          />

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search rewards..."
            className="
              h-11
              w-full

              rounded-xl

              border
              border-white/[0.08]

              bg-[#0c1028]

              pl-10
              pr-4

              text-[11px]
              text-white

              outline-none

              transition
              duration-300

              placeholder:text-slate-600

              focus:border-fuchsia-500/35
              focus:bg-[#0e132d]

              sm:h-12
              sm:rounded-2xl
              sm:pl-12
              sm:text-sm
            "
          />
        </div>

        {/* ======================================================
            RESULT COUNT
        ====================================================== */}
        {!loading && !error && (
          <div
            className="
              mb-3

              flex
              items-center
              gap-1.5

              text-[9px]

              text-slate-500

              sm:mb-4
              sm:text-xs
            "
          >
            <Sparkles
              size={12}
              className="text-fuchsia-400"
            />

            <span>
              {filteredRewards.length}{' '}
              {filteredRewards.length === 1
                ? 'reward'
                : 'rewards'}
            </span>
          </div>
        )}

        {/* ======================================================
            STATES
        ====================================================== */}
        {loading && <RewardGridSkeleton />}

        {error && (
          <div className="py-8">
            <ApiError message={error} />
          </div>
        )}

        {!loading &&
          !error &&
          (rewards || []).length === 0 && (
            <EmptyState
              title="No rewards available"
              message="The administrator has not added any rewards yet."
            />
          )}

        {!loading &&
          !error &&
          (rewards || []).length > 0 &&
          filteredRewards.length === 0 && (
            <div
              className="
                rounded-2xl

                border
                border-dashed
                border-white/10

                bg-white/[0.025]

                px-5
                py-10

                text-center

                sm:py-12
              "
            >
              <Gift
                size={34}
                className="
                  mx-auto
                  text-fuchsia-500/45
                "
              />

              <h3
                className="
                  mt-3

                  text-sm
                  font-bold

                  text-white
                "
              >
                No matching rewards
              </h3>

              <p
                className="
                  mt-1

                  text-[11px]
                  text-slate-500
                "
              >
                Try searching with another keyword.
              </p>
            </div>
          )}

        {/* ======================================================
            REWARD GRID
        ====================================================== */}
        {!loading &&
          !error &&
          filteredRewards.length > 0 && (
            <div
              className="
                grid
                grid-cols-2

                gap-2

                min-[380px]:gap-2.5

                sm:gap-4

                lg:grid-cols-3

                xl:grid-cols-4
                xl:gap-5
              "
            >
              {filteredRewards.map(
                (reward: any) => (
                  <div
                    key={reward.id}
                    className="min-w-0"
                  >
                    <RewardCard reward={reward} />
                  </div>
                )
              )}
            </div>
          )}
      </div>
    </main>
  )
}
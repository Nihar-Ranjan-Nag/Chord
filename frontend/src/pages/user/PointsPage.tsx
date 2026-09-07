import {
  ArrowDownLeft,
  ArrowUpRight,
  Coins,
  Sparkles,
  WalletCards,
} from 'lucide-react'

import {
  ApiError,
  ApiLoading,
} from '@/components/common/ApiState'

import { useAsyncData } from '@/hooks/useAsyncData'

import { api } from '@/services/api'
import { mapPoint } from '@/services/mappers'

import { useAuth } from '@/features/auth/AuthContext'

export function PointsPage() {
  const {
    user,
  } = useAuth()

  const {
    data,
    loading,
    error,
  } = useAsyncData(
    async () => {
      const body: any =
        await api(
          '/users/points',
          {
            auth: true,
          }
        )

      return (
        body?.data || []
      ).map(mapPoint)
    },
    [user?.id]
  )

  const transactions =
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
            POINTS WALLET
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
          <div>
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
                points wallet
              </span>
            </h1>

            <p
              className="
                mt-2
                max-w-[680px]

                text-[10px]
                leading-5

                text-white/80

                min-[380px]:text-[11px]

                sm:mt-3
                sm:text-[13px]
                sm:leading-6
              "
            >
              Every transaction below comes directly from your point ledger.
            </p>
          </div>

          {/* BALANCE */}
          <div
            className="
              flex
              w-full
              items-center
              gap-3

              rounded-2xl

              border
              border-violet-400/20

              bg-gradient-to-br
              from-violet-600/[0.20]
              via-purple-600/[0.08]
              to-[#0b1024]

              px-4
              py-3

              sm:w-auto
              sm:min-w-[190px]
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

                bg-violet-500/15
                text-violet-200
              "
            >
              <Coins size={19} />
            </span>

            <div>
              <span
                className="
                  block
                  text-[8px]
                  font-bold
                  uppercase
                  tracking-[0.1em]

                  text-white/65
                "
              >
                Available balance
              </span>

              <strong
                className="
                  mt-0.5
                  block

                  text-xl
                  font-black

                  text-white
                "
              >
                {user?.points?.toLocaleString() || 0}{' '}
                <span className="text-xs text-violet-200">
                  pts
                </span>
              </strong>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          EMPTY
      ====================================================== */}
      {transactions.length === 0 && (
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
          <WalletCards
            size={34}
            className="
              mx-auto
              text-violet-300
            "
          />

          <h2
            className="
              mt-3
              text-[15px]
              font-black
              text-white
            "
          >
            No point activity
          </h2>

          <p
            className="
              mt-1
              text-[10px]
              text-white/70
            "
          >
            Your point ledger is currently empty.
          </p>
        </section>
      )}

      {/* ======================================================
          MOBILE TRANSACTION CARDS
      ====================================================== */}
      {transactions.length > 0 && (
        <div
          className="
            grid
            gap-3

            md:hidden
          "
        >
          {transactions.map(tx => {
            const isCredit =
              tx.type === 'credit'

            return (
              <article
                key={tx.id}
                className="
                  relative
                  overflow-hidden

                  rounded-2xl

                  border
                  border-white/[0.08]

                  bg-gradient-to-br
                  from-[#11152e]
                  via-[#0d1129]
                  to-[#080c1f]

                  p-4
                "
              >
                <div
                  className="
                    flex
                    items-start
                    gap-3
                  "
                >
                  <span
                    className={`
                      grid
                      h-10
                      w-10
                      shrink-0
                      place-items-center

                      rounded-xl

                      ${
                        isCredit
                          ? 'bg-emerald-500/12 text-emerald-300'
                          : 'bg-rose-500/12 text-rose-300'
                      }
                    `}
                  >
                    {isCredit ? (
                      <ArrowDownLeft
                        size={17}
                      />
                    ) : (
                      <ArrowUpRight
                        size={17}
                      />
                    )}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div
                      className="
                        flex
                        items-start
                        justify-between
                        gap-3
                      "
                    >
                      <strong
                        className="
                          min-w-0
                          break-words

                          text-[11px]
                          font-extrabold
                          leading-5

                          text-white
                        "
                      >
                        {tx.description}
                      </strong>

                      <strong
                        className={`
                          shrink-0
                          text-[12px]
                          font-black

                          ${
                            isCredit
                              ? 'text-emerald-300'
                              : 'text-rose-300'
                          }
                        `}
                      >
                        {isCredit
                          ? '+'
                          : '-'}
                        {tx.points}
                      </strong>
                    </div>

                    <div
                      className="
                        mt-3
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

                          p-2.5
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
                          Source
                        </span>

                        <strong
                          className="
                            mt-1
                            block
                            truncate

                            text-[9px]
                            font-bold
                            capitalize

                            text-white
                          "
                        >
                          {tx.source.toLowerCase()}
                        </strong>
                      </div>

                      <div
                        className="
                          rounded-xl

                          border
                          border-white/[0.06]

                          bg-white/[0.025]

                          p-2.5
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
                          Balance
                        </span>

                        <strong
                          className="
                            mt-1
                            block

                            text-[9px]
                            font-black

                            text-white
                          "
                        >
                          {tx.balanceAfter} pts
                        </strong>
                      </div>
                    </div>

                    <p
                      className="
                        mt-2.5

                        text-[8px]
                        leading-4

                        text-white/65
                      "
                    >
                      {new Date(
                        tx.date
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}

      {/* ======================================================
          DESKTOP TABLE
      ====================================================== */}
      {transactions.length > 0 && (
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
                    border-white/[0.08]

                    bg-white/[0.025]
                  "
                >
                  {[
                    'Description',
                    'Source',
                    'Date',
                    'Points',
                    'Balance',
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
                {transactions.map(tx => {
                  const isCredit =
                    tx.type ===
                    'credit'

                  return (
                    <tr
                      key={tx.id}
                      className="
                        border-b
                        border-white/[0.06]

                        transition

                        last:border-b-0

                        hover:bg-white/[0.025]
                      "
                    >
                      <td
                        className="
                          px-5
                          py-4
                        "
                      >
                        <strong
                          className="
                            text-[11px]
                            font-bold
                            text-white
                          "
                        >
                          {tx.description}
                        </strong>
                      </td>

                      <td
                        className="
                          px-5
                          py-4

                          text-[10px]
                          font-medium
                          capitalize

                          text-white/80
                        "
                      >
                        {tx.source.toLowerCase()}
                      </td>

                      <td
                        className="
                          px-5
                          py-4

                          text-[10px]
                          font-medium

                          text-white/70
                        "
                      >
                        {new Date(
                          tx.date
                        ).toLocaleString()}
                      </td>

                      <td
                        className="
                          px-5
                          py-4
                        "
                      >
                        <strong
                          className={`
                            text-[11px]
                            font-black

                            ${
                              isCredit
                                ? 'text-emerald-300'
                                : 'text-rose-300'
                            }
                          `}
                        >
                          {isCredit
                            ? '+'
                            : '-'}
                          {tx.points}
                        </strong>
                      </td>

                      <td
                        className="
                          px-5
                          py-4

                          text-[11px]
                          font-bold

                          text-white
                        "
                      >
                        {tx.balanceAfter}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <div className="h-5" />
    </div>
  )
}
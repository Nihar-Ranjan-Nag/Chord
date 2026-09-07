import {
  BookOpen,
  CheckCircle2,
  Clock3,
  Coins,
  RotateCcw,
  Sparkles,
} from 'lucide-react'

import {
  ApiError,
  ApiLoading,
} from '@/components/common/ApiState'

import { useAsyncData } from '@/hooks/useAsyncData'

import { api } from '@/services/api'

import { mapBookBorrow } from '@/services/mappers'

export function MyBooksPage() {
  const {
    data,
    loading,
    error,
    refresh,
  } = useAsyncData(
    async () => {
      const body: any = await api(
        '/books/mine',
        {
          auth: true,
        }
      )

      return (
        body?.data || []
      ).map(mapBookBorrow)
    },
    []
  )

  async function requestReturn(
    id: string
  ) {
    await api(
      `/books/borrows/${id}/request-return`,
      {
        method: 'PATCH',
        auth: true,
      }
    )

    await refresh()
  }

  const borrows =
    data || []

  function statusStyle(
    status?: string
  ) {
    switch (status) {
      case 'returned':
        return {
          text: 'text-emerald-200',
          bg: 'bg-emerald-500/10',
          border:
            'border-emerald-400/20',
        }

      case 'return_requested':
        return {
          text: 'text-blue-200',
          bg: 'bg-blue-500/10',
          border:
            'border-blue-400/20',
        }

      case 'borrowed':
        return {
          text: 'text-violet-200',
          bg: 'bg-violet-500/10',
          border:
            'border-violet-400/20',
        }

      default:
        return {
          text: 'text-white/80',
          bg: 'bg-white/[0.05]',
          border:
            'border-white/[0.08]',
        }
    }
  }

  function paymentStyle(
    status?: string
  ) {
    switch (
      status?.toLowerCase()
    ) {
      case 'paid':
      case 'success':
      case 'completed':
        return {
          text:
            'text-emerald-200',
          bg:
            'bg-emerald-500/10',
          border:
            'border-emerald-400/20',
        }

      case 'pending':
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
            'text-white/75',
          bg:
            'bg-white/[0.04]',
          border:
            'border-white/[0.08]',
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
            MY BOOKS
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
          Borrow{' '}
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
          Track deposit payments, return requests, refund status and your borrowed books.
        </p>
      </section>

      {/* ======================================================
          EMPTY STATE
      ====================================================== */}
      {borrows.length === 0 && (
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
            <BookOpen size={23} />
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
            No borrowed books
          </h2>

          <p
            className="
              mx-auto
              mt-2
              max-w-[380px]
              text-[10px]
              leading-5
              text-white/70
              sm:text-xs
            "
          >
            Borrow a book from the library and it will appear here.
          </p>
        </section>
      )}

      {/* ======================================================
          BORROW CARDS
      ====================================================== */}
      {borrows.length > 0 && (
        <div
          className="
            grid
            gap-3
            sm:gap-4
          "
        >
          {borrows.map(
            item => {
              const status =
                statusStyle(
                  item.status
                )

              const payment =
                paymentStyle(
                  item.paymentStatus
                )

              return (
                <article
                  key={item.id}
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

                    shadow-[0_12px_35px_rgba(0,0,0,0.24)]

                    sm:p-5
                  "
                >
                  {/* GLOW */}
                  <div
                    className="
                      pointer-events-none
                      absolute
                      -right-14
                      -top-14
                      h-36
                      w-36
                      rounded-full
                      bg-violet-500/[0.10]
                      blur-3xl
                    "
                  />

                  <div
                    className="
                      relative
                      flex
                      flex-col
                      gap-4

                      lg:flex-row
                      lg:items-center
                      lg:justify-between
                    "
                  >
                    {/* LEFT */}
                    <div className="min-w-0 flex-1">
                      <div
                        className="
                          flex
                          flex-wrap
                          items-center
                          gap-2
                        "
                      >
                        <h3
                          className="
                            min-w-0
                            break-words
                            text-[13px]
                            font-extrabold
                            text-white
                            sm:text-[16px]
                          "
                        >
                          {item.book?.title ||
                            'Book'}
                        </h3>

                        <span
                          className={`
                            rounded-full
                            border
                            px-2
                            py-1
                            text-[8px]
                            font-extrabold
                            uppercase
                            ${status.bg}
                            ${status.border}
                            ${status.text}
                            sm:px-2.5
                            sm:text-[9px]
                          `}
                        >
                          {item.status.replaceAll(
                            '_',
                            ' '
                          )}
                        </span>

                        <span
                          className={`
                            rounded-full
                            border
                            px-2
                            py-1
                            text-[8px]
                            font-extrabold
                            uppercase
                            ${payment.bg}
                            ${payment.border}
                            ${payment.text}
                            sm:px-2.5
                            sm:text-[9px]
                          `}
                        >
                          {
                            item.paymentStatus
                          }
                        </span>
                      </div>

                      {/* BORROW META */}
                      <div
                        className="
                          mt-3
                          grid
                          gap-2
                          sm:grid-cols-2
                          lg:max-w-[720px]
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
                          <div
                            className="
                              flex
                              items-center
                              gap-1.5
                              text-[8px]
                              font-bold
                              uppercase
                              tracking-[0.08em]
                              text-white/60
                            "
                          >
                            <Clock3
                              size={11}
                            />
                            Borrow details
                          </div>

                          <p
                            className="
                              mt-1.5
                              break-words
                              text-[9px]
                              leading-5
                              text-white/85
                              sm:text-[10px]
                            "
                          >
                            Code:{' '}
                            <strong className="text-white">
                              {
                                item.borrowCode
                              }
                            </strong>
                          </p>

                          <p
                            className="
                              text-[9px]
                              leading-5
                              text-white/70
                              sm:text-[10px]
                            "
                          >
                            {new Date(
                              item.borrowedAt
                            ).toLocaleString()}
                          </p>
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
                          <div
                            className="
                              flex
                              items-center
                              gap-1.5
                              text-[8px]
                              font-bold
                              uppercase
                              tracking-[0.08em]
                              text-white/60
                            "
                          >
                            <Coins
                              size={11}
                            />
                            Payment
                          </div>

                          <div
                            className="
                              mt-1.5
                              flex
                              flex-wrap
                              gap-x-4
                              gap-y-1
                            "
                          >
                            <p
                              className="
                                text-[9px]
                                font-semibold
                                text-white/80
                                sm:text-[10px]
                              "
                            >
                              Paid:{' '}
                              <strong className="text-white">
                                ₹
                                {item.paidAmount.toFixed(
                                  2
                                )}
                              </strong>
                            </p>

                            <p
                              className="
                                text-[9px]
                                font-semibold
                                text-white/80
                                sm:text-[10px]
                              "
                            >
                              Refund:{' '}
                              <strong className="text-emerald-300">
                                ₹
                                {item.refundAmount.toFixed(
                                  2
                                )}
                              </strong>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* RETURN BUTTON */}
                    {item.status ===
                      'borrowed' && (
                      <button
                        type="button"
                        onClick={() =>
                          requestReturn(
                            item.id
                          )
                        }
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

                          shadow-[0_8px_24px_rgba(124,58,237,0.20)]

                          transition

                          hover:-translate-y-0.5

                          sm:h-11
                          sm:text-xs

                          lg:w-auto
                        "
                      >
                        <RotateCcw
                          size={15}
                        />

                        Request return
                      </button>
                    )}
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
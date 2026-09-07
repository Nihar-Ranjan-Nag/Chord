import {
  CircleCheck,
  CircleX,
  Coins,
  RotateCcw,
  Sparkles,
  UserRound,
} from 'lucide-react'

import {
  ApiError,
  ApiLoading,
} from '@/components/common/ApiState'

import { useAsyncData } from '@/hooks/useAsyncData'

import { api } from '@/services/api'

import { mapBookBorrow } from '@/services/mappers'

export function BorrowManagementPage({
  base,
  title,
}: {
  base:
    | '/organizer/books'
    | '/admin/books'
  title: string
}) {
  const {
    data,
    loading,
    error,
    refresh,
  } = useAsyncData(
    async () => {
      const body: any =
        await api(
          `${base}/borrows/all`,
          {
            auth: true,
          }
        )

      return (
        body?.data || []
      ).map(mapBookBorrow)
    },
    [base]
  )

  async function setStatus(
    id: string,
    status:
      | 'RETURNED'
      | 'DID_NOT_RETURN'
      | 'CANCELLED'
  ) {
    await api(
      `${base}/borrows/${id}/status`,
      {
        method: 'PATCH',
        auth: true,
        body:
          JSON.stringify({
            status,
          }),
      }
    )

    await refresh()
  }

  const records =
    data || []

  function statusStyle(
    status?: string
  ) {
    switch (status) {
      case 'returned':
        return {
          text:
            'text-emerald-200',
          bg:
            'bg-emerald-500/10',
          border:
            'border-emerald-400/20',
        }

      case 'did_not_return':
        return {
          text:
            'text-rose-200',
          bg:
            'bg-rose-500/10',
          border:
            'border-rose-400/20',
        }

      case 'cancelled':
        return {
          text:
            'text-slate-200',
          bg:
            'bg-white/[0.05]',
          border:
            'border-white/[0.10]',
        }

      case 'return_requested':
        return {
          text:
            'text-blue-200',
          bg:
            'bg-blue-500/10',
          border:
            'border-blue-400/20',
        }

      default:
        return {
          text:
            'text-violet-200',
          bg:
            'bg-violet-500/10',
          border:
            'border-violet-400/20',
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

      case 'failed':
        return {
          text:
            'text-rose-200',
          bg:
            'bg-rose-500/10',
          border:
            'border-rose-400/20',
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
            BORROW TRACKING
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
          {title}
        </h1>

        <p
          className="
            mt-2
            max-w-[760px]

            text-[10px]
            leading-5

            text-white/80

            min-[380px]:text-[11px]

            sm:mt-3
            sm:text-[13px]
            sm:leading-6
          "
        >
          Track borrowed books, return requests, returned items, not-returned cases, payment status and refunds.
        </p>
      </section>

      {/* ======================================================
          EMPTY
      ====================================================== */}
      {records.length === 0 && (
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
            <RotateCcw size={22} />
          </span>

          <h2
            className="
              mt-3

              text-[14px]
              font-black

              text-white
            "
          >
            No borrow records
          </h2>

          <p
            className="
              mt-1

              text-[10px]

              text-white/70
            "
          >
            Borrow transactions will appear here.
          </p>
        </section>
      )}

      {/* ======================================================
          BORROW RECORDS
      ====================================================== */}
      {records.length > 0 && (
        <section
          className="
            grid
            gap-3

            sm:gap-4

            xl:grid-cols-2
          "
        >
          {records.map(item => {
            const status =
              statusStyle(
                item.status
              )

            const payment =
              paymentStyle(
                item.paymentStatus
              )

            const finalStatus =
              [
                'returned',
                'did_not_return',
                'cancelled',
              ].includes(
                item.status
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

                    bg-violet-500/[0.08]

                    blur-3xl
                  "
                />

                <div className="relative">
                  {/* ==================================================
                      BOOK + STATUS
                  ================================================== */}
                  <div
                    className="
                      flex
                      flex-col
                      gap-3

                      sm:flex-row
                      sm:items-start
                      sm:justify-between
                    "
                  >
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
                            leading-5

                            text-white

                            sm:text-[15px]
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

                            text-[7px]
                            font-extrabold
                            uppercase

                            ${status.bg}
                            ${status.border}
                            ${status.text}

                            sm:px-2.5
                            sm:text-[8px]
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

                            text-[7px]
                            font-extrabold
                            uppercase

                            ${payment.bg}
                            ${payment.border}
                            ${payment.text}

                            sm:px-2.5
                            sm:text-[8px]
                          `}
                        >
                          {item.paymentStatus}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ==================================================
                      USER INFO
                  ================================================== */}
                  <div
                    className="
                      mt-4

                      grid
                      gap-2

                      sm:grid-cols-2
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

                          text-[7px]
                          font-bold
                          uppercase
                          tracking-[0.08em]

                          text-white/55
                        "
                      >
                        <UserRound
                          size={10}
                        />

                        Borrower
                      </div>

                      <strong
                        className="
                          mt-1.5
                          block

                          break-words

                          text-[10px]
                          font-bold

                          text-white
                        "
                      >
                        {item.user?.name ||
                          'User'}
                      </strong>

                      <p
                        className="
                          mt-1

                          break-all

                          text-[8px]
                          leading-4

                          text-white/65
                        "
                      >
                        {item.user?.email}
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
                        Borrow code
                      </span>

                      <strong
                        className="
                          mt-1.5
                          block

                          break-all

                          text-[10px]
                          font-black

                          text-violet-200
                        "
                      >
                        {item.borrowCode}
                      </strong>
                    </div>
                  </div>

                  {/* ==================================================
                      PAYMENT SUMMARY
                  ================================================== */}
                  <div
                    className="
                      mt-2

                      grid
                      grid-cols-2
                      gap-2
                    "
                  >
                    <div
                      className="
                        rounded-xl

                        border
                        border-violet-400/10

                        bg-violet-500/[0.05]

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
                        <Coins
                          size={10}
                        />

                        Paid
                      </span>

                      <strong
                        className="
                          mt-1.5
                          block

                          text-[13px]
                          font-black

                          text-white

                          sm:text-[15px]
                        "
                      >
                        ₹
                        {item.paidAmount.toFixed(
                          2
                        )}
                      </strong>
                    </div>

                    <div
                      className="
                        rounded-xl

                        border
                        border-emerald-400/10

                        bg-emerald-500/[0.05]

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
                        Refund
                      </span>

                      <strong
                        className="
                          mt-1.5
                          block

                          text-[13px]
                          font-black

                          text-emerald-300

                          sm:text-[15px]
                        "
                      >
                        ₹
                        {item.refundAmount.toFixed(
                          2
                        )}
                      </strong>
                    </div>
                  </div>

                  {/* ==================================================
                      ACTIONS
                  ================================================== */}
                  {!finalStatus && (
                    <div
                      className="
                        mt-4

                        grid
                        grid-cols-2
                        gap-2

                        sm:flex
                        sm:flex-wrap
                      "
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setStatus(
                            item.id,
                            'RETURNED'
                          )
                        }
                        className="
                          inline-flex
                          min-h-[38px]
                          items-center
                          justify-center
                          gap-1.5

                          rounded-xl

                          border
                          border-emerald-400/20

                          bg-emerald-500/10

                          px-3

                          text-[8px]
                          font-extrabold

                          text-emerald-200

                          transition

                          hover:bg-emerald-500/20
                          hover:text-white

                          sm:min-h-[40px]
                          sm:text-[9px]
                        "
                      >
                        <CircleCheck
                          size={13}
                        />

                        <span className="sm:hidden">
                          Returned
                        </span>

                        <span className="hidden sm:inline">
                          Returned + refund
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setStatus(
                            item.id,
                            'DID_NOT_RETURN'
                          )
                        }
                        className="
                          inline-flex
                          min-h-[38px]
                          items-center
                          justify-center
                          gap-1.5

                          rounded-xl

                          border
                          border-rose-400/20

                          bg-rose-500/10

                          px-3

                          text-[8px]
                          font-extrabold

                          text-rose-200

                          transition

                          hover:bg-rose-500/20
                          hover:text-white

                          sm:min-h-[40px]
                          sm:text-[9px]
                        "
                      >
                        <CircleX
                          size={13}
                        />

                        Did not return
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setStatus(
                            item.id,
                            'CANCELLED'
                          )
                        }
                        className="
                          col-span-2

                          inline-flex
                          min-h-[38px]
                          items-center
                          justify-center
                          gap-1.5

                          rounded-xl

                          border
                          border-white/[0.10]

                          bg-white/[0.04]

                          px-3

                          text-[8px]
                          font-extrabold

                          text-white/75

                          transition

                          hover:bg-white/[0.08]
                          hover:text-white

                          sm:min-h-[40px]
                          sm:text-[9px]
                        "
                      >
                        <RotateCcw
                          size={13}
                        />

                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </article>
            )
          })}
        </section>
      )}

      <div className="h-5" />
    </div>
  )
}
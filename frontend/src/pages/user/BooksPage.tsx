import {
  BookOpen,
  Coins,
  Search,
  Sparkles,
} from 'lucide-react'

import { useState } from 'react'

import {
  ApiError,
  ApiLoading,
} from '@/components/common/ApiState'

import { useAsyncData } from '@/hooks/useAsyncData'

import { api } from '@/services/api'

import { mapBook } from '@/services/mappers'

export function BooksPage() {
  const [
    search,
    setSearch,
  ] = useState('')

  const [
    busy,
    setBusy,
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
      const body: any =
        await api(
          `/books${
            search
              ? `?search=${encodeURIComponent(
                  search
                )}`
              : ''
          }`
        )

      return (
        body?.data || []
      ).map(mapBook)
    },
    [search]
  )

  async function borrow(
    id: string
  ) {
    setBusy(id)

    try {
      await api(
        `/books/${id}/borrow`,
        {
          method: 'POST',
          auth: true,
          body:
            JSON.stringify({}),
        }
      )

      await refresh()
    } finally {
      setBusy(null)
    }
  }

  const books =
    data || []

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
            LIBRARY
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
            books
          </span>
        </h1>

        <p
          className="
            mt-2
            max-w-[700px]

            text-[10px]
            leading-5

            text-white/80

            min-[380px]:text-[11px]

            sm:mt-3
            sm:text-[13px]
            sm:leading-6
          "
        >
          Borrow available books by paying the refundable deposit. Return the book to receive the amount back.
        </p>
      </section>

      {/* ======================================================
          SEARCH
      ====================================================== */}
      <div
        className="
          relative
          mb-5
          max-w-[520px]

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

            text-violet-300
          "
        />

        <input
          value={search}
          onChange={e =>
            setSearch(
              e.target.value
            )
          }
          placeholder="Search books, author or ISBN..."
          className="
            h-10
            w-full

            rounded-xl

            border
            border-white/[0.08]

            bg-white/[0.035]

            pl-9
            pr-3

            text-[10px]
            font-medium

            text-white

            outline-none

            placeholder:text-white/45

            transition

            focus:border-violet-500/30
            focus:bg-white/[0.05]

            sm:h-11
            sm:text-xs
          "
        />
      </div>

      {/* LOADING */}
      {loading && (
        <div className="py-8">
          <ApiLoading />
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="py-8">
          <ApiError
            message={error}
          />
        </div>
      )}

      {/* ======================================================
          EMPTY
      ====================================================== */}
      {!loading &&
        !error &&
        books.length === 0 && (
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
              "
            >
              No books available
            </h2>

            <p
              className="
                mx-auto
                mt-2
                max-w-[400px]

                text-[10px]
                leading-5

                text-white/70

                sm:text-xs
              "
            >
              Books added by organizers and admin will appear here.
            </p>
          </section>
        )}

      {/* ======================================================
          BOOK GRID

          MOBILE = 2 PER ROW
      ====================================================== */}
      {!loading &&
        !error &&
        books.length > 0 && (
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
            {books.map(book => {
              const available =
                book.stock > 0

              const borrowing =
                busy === book.id

              return (
                <article
                  key={book.id}
                  className="
                    group

                    flex
                    min-w-0
                    flex-col

                    overflow-hidden

                    rounded-xl

                    border
                    border-white/[0.08]

                    bg-gradient-to-b
                    from-[#11152e]
                    via-[#0d1129]
                    to-[#080c1f]

                    shadow-[0_12px_35px_rgba(0,0,0,0.24)]

                    transition
                    duration-300

                    hover:-translate-y-1
                    hover:border-violet-500/30

                    sm:rounded-2xl
                  "
                >
                  {/* ==================================================
                      COVER
                  ================================================== */}
                  <div
                    className="
                      relative

                      h-[120px]
                      shrink-0

                      overflow-hidden

                      bg-gradient-to-br
                      from-violet-500/10
                      via-blue-500/[0.06]
                      to-fuchsia-500/[0.08]

                      min-[380px]:h-[135px]

                      sm:h-[190px]
                    "
                  >
                    {book.cover ? (
                      <img
                        src={book.cover}
                        alt={book.title}
                        className="
                          h-full
                          w-full
                          object-cover

                          transition
                          duration-500

                          group-hover:scale-105
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
                        <BookOpen
                          size={34}
                          className="sm:size-[50px]"
                        />
                      </div>
                    )}

                    <div
                      className="
                        pointer-events-none
                        absolute
                        inset-0

                        bg-gradient-to-t
                        from-[#080c1f]/50
                        via-transparent
                        to-transparent
                      "
                    />

                    {/* STOCK */}
                    <span
                      className={`
                        absolute
                        right-2
                        top-2

                        max-w-[75%]

                        truncate

                        rounded-full

                        border

                        px-2
                        py-1

                        text-[6.5px]
                        font-extrabold

                        backdrop-blur-md

                        min-[380px]:text-[7px]

                        sm:right-3
                        sm:top-3
                        sm:px-2.5
                        sm:text-[9px]

                        ${
                          available
                            ? 'border-emerald-400/20 bg-emerald-500/15 text-emerald-100'
                            : 'border-rose-400/20 bg-rose-500/15 text-rose-100'
                        }
                      `}
                    >
                      {available
                        ? `${book.stock} available`
                        : 'Out of stock'}
                    </span>
                  </div>

                  {/* ==================================================
                      CONTENT
                  ================================================== */}
                  <div
                    className="
                      flex
                      flex-1
                      flex-col

                      p-2.5

                      min-[380px]:p-3

                      sm:p-4
                    "
                  >
                    <h3
                      className="
                        line-clamp-2

                        min-h-[31px]

                        text-[10px]
                        font-extrabold
                        leading-[15px]

                        text-white

                        min-[380px]:text-[11px]
                        min-[380px]:leading-[16px]

                        sm:min-h-0
                        sm:text-[15px]
                        sm:leading-5
                      "
                    >
                      {book.title}
                    </h3>

                    <p
                      className="
                        mt-1

                        truncate

                        text-[7.5px]
                        font-medium

                        text-white/70

                        min-[380px]:text-[8.5px]

                        sm:text-[10px]
                      "
                    >
                      {book.author ||
                        'Author not specified'}
                    </p>

                    <p
                      className="
                        mt-2

                        line-clamp-2

                        text-[7px]
                        leading-[12px]

                        text-white/70

                        min-[380px]:text-[8px]
                        min-[380px]:leading-[13px]

                        sm:mt-3
                        sm:text-[10px]
                        sm:leading-5
                      "
                    >
                      {book.description ||
                        'Borrow this book from the CHORD library.'}
                    </p>

                    {/* ==================================================
                        BOTTOM
                    ================================================== */}
                    <div
                      className="
                        mt-auto

                        border-t
                        border-white/[0.07]

                        pt-3

                        sm:pt-4
                      "
                    >
                      {/* DEPOSIT */}
                      <div
                        className="
                          flex
                          items-end
                          justify-between
                          gap-2
                        "
                      >
                        <div className="min-w-0">
                          <span
                            className="
                              flex
                              items-center
                              gap-1

                              text-[6.5px]
                              font-bold
                              uppercase
                              tracking-[0.08em]

                              text-white/60

                              min-[380px]:text-[7px]

                              sm:text-[9px]
                            "
                          >
                            <Coins
                              size={9}
                            />

                            Deposit
                          </span>

                          <strong
                            className="
                              mt-1
                              block

                              text-[13px]
                              font-black

                              text-violet-200

                              min-[380px]:text-[15px]

                              sm:text-lg
                            "
                          >
                            ₹
                            {book.depositAmount.toFixed(
                              2
                            )}
                          </strong>
                        </div>
                      </div>

                      {/* BORROW BUTTON */}
                      <button
                        type="button"
                        disabled={
                          !available ||
                          borrowing
                        }
                        onClick={() =>
                          borrow(book.id)
                        }
                        className="
                          mt-2.5

                          h-8
                          w-full

                          rounded-lg

                          bg-gradient-to-r
                          from-violet-600
                          via-purple-600
                          to-blue-600

                          px-2

                          text-[8px]
                          font-extrabold

                          text-white

                          shadow-[0_8px_24px_rgba(124,58,237,0.20)]

                          transition

                          hover:-translate-y-0.5

                          disabled:cursor-not-allowed
                          disabled:bg-none
                          disabled:bg-white/[0.05]
                          disabled:text-white/45

                          min-[380px]:h-9
                          min-[380px]:text-[9px]

                          sm:mt-3
                          sm:h-10
                          sm:rounded-xl
                          sm:text-[11px]
                        "
                      >
                        {borrowing
                          ? 'Borrowing...'
                          : !available
                            ? 'Out of stock'
                            : 'Borrow book'}
                      </button>
                    </div>
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
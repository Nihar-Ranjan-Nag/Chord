import {
  Gift,
  PackageCheck,
  Sparkles,
} from 'lucide-react'

type RewardCardProps = {
  reward: any
}

export function RewardCard({
  reward,
}: RewardCardProps) {
  /* =========================================================
     SAFE REWARD VALUES
  ========================================================= */
  const title =
    reward?.title ||
    reward?.name ||
    'Reward'

  const description =
    reward?.description ||
    reward?.shortDescription ||
    reward?.short_description ||
    'Unlock this reward using your earned points.'

  const image =
    reward?.image ||
    reward?.imageUrl ||
    reward?.image_url ||
    reward?.thumbnail ||
    reward?.thumbnailUrl ||
    reward?.thumbnail_url ||
    ''

  const category =
    reward?.category ||
    reward?.type ||
    'Reward'

  const points =
    reward?.points ||
    reward?.pointsRequired ||
    reward?.points_required ||
    reward?.requiredPoints ||
    reward?.required_points ||
    0

  const stock =
    reward?.stock ??
    reward?.quantity ??
    reward?.availableStock ??
    reward?.available_stock ??
    reward?.stockQuantity ??
    reward?.stock_quantity ??
    null

  const hasStock =
    stock === null ||
    Number(stock) > 0

  return (
    <article
      className="
        group
        relative

        flex
        h-full
        min-w-0
        flex-col

        overflow-hidden

        rounded-xl

        border
        border-violet-500/[0.16]

        bg-gradient-to-b
        from-[#10142d]
        to-[#090d20]

        shadow-[0_8px_25px_rgba(0,0,0,0.26)]

        transition
        duration-300

        hover:-translate-y-1
        hover:border-fuchsia-500/35
        hover:shadow-[0_15px_40px_rgba(135,45,255,0.16)]

        sm:rounded-2xl
      "
    >
      {/* CARD GLOW */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0

          bg-[radial-gradient(circle_at_80%_10%,rgba(217,70,239,0.10),transparent_35%)]
        "
      />

      {/* =====================================================
          IMAGE
      ===================================================== */}
      <div
        className="
          relative

          h-[105px]

          shrink-0
          overflow-hidden

          border-b
          border-white/[0.05]

          bg-gradient-to-br
          from-[#161336]
          via-[#10132d]
          to-[#101a38]

          min-[380px]:h-[116px]

          sm:h-[165px]

          lg:h-48
        "
      >
        {image ? (
          <>
            <img
              src={image}
              alt={title}
              className="
                h-full
                w-full

                object-cover

                transition
                duration-500

                group-hover:scale-105
              "
            />

            <div
              className="
                absolute
                inset-0

                bg-gradient-to-t
                from-[#080b1d]/65
                via-transparent
                to-transparent
              "
            />
          </>
        ) : (
          <div
            className="
              relative
              grid
              h-full
              place-items-center
            "
          >
            <div
              className="
                absolute
                h-[60px]
                w-[60px]

                rounded-full

                bg-violet-600/15

                blur-2xl

                sm:h-[110px]
                sm:w-[110px]
              "
            />

            <div
              className="
                relative
                grid

                h-[44px]
                w-[44px]

                place-items-center

                rounded-xl

                border
                border-violet-400/15

                bg-gradient-to-br
                from-violet-500/15
                to-fuchsia-500/10

                shadow-[0_0_30px_rgba(139,92,246,0.15)]

                sm:h-[72px]
                sm:w-[72px]
                sm:rounded-2xl
              "
            >
              <Gift
                size={24}
                className="
                  text-violet-400

                  drop-shadow-[0_0_12px_rgba(139,92,246,0.55)]

                  sm:size-[40px]
                "
              />
            </div>
          </div>
        )}

        {/* =================================================
            STOCK BADGE
        ================================================= */}
        {stock !== null && (
          <div
            className="
              absolute
              left-1.5
              top-1.5

              max-w-[calc(100%-12px)]

              min-[380px]:left-2
              min-[380px]:top-2

              sm:left-3
              sm:top-3
            "
          >
            <span
              className={[
                'inline-flex',
                'max-w-full',
                'items-center',
                'gap-1',
                'truncate',
                'rounded-full',
                'border',
                'px-1.5',
                'py-0.5',
                'text-[6.5px]',
                'font-extrabold',
                'backdrop-blur-md',
                'min-[380px]:px-2',
                'min-[380px]:py-1',
                'min-[380px]:text-[7.5px]',
                'sm:px-3',
                'sm:text-[10px]',
                hasStock
                  ? 'border-emerald-400/20 bg-emerald-500/10 text-emerald-300'
                  : 'border-rose-400/20 bg-rose-500/10 text-rose-300',
              ].join(' ')}
            >
              <PackageCheck
                size={8}
                className="sm:size-[11px]"
              />

              {hasStock
                ? `${stock} In Stock`
                : 'Out of Stock'}
            </span>
          </div>
        )}

        {/* MOBILE POINT BADGE */}
        <div
          className="
            absolute
            bottom-1.5
            right-1.5

            flex
            items-center
            gap-0.5

            rounded-full

            border
            border-violet-400/20

            bg-[#080b1d]/85

            px-1.5
            py-0.5

            text-[6.5px]
            font-extrabold

            text-violet-300

            backdrop-blur-md

            sm:hidden
          "
        >
          <Sparkles
            size={7}
            className="text-fuchsia-400"
          />

          {points}
        </div>
      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}
      <div
        className="
          relative
          z-10

          flex
          min-w-0
          flex-1
          flex-col

          p-2

          min-[380px]:p-2.5

          sm:p-4

          lg:p-5
        "
      >
        {/* CATEGORY */}
        <p
          className="
            truncate

            text-[6.5px]
            font-extrabold
            uppercase
            tracking-[0.1em]

            text-fuchsia-400

            min-[380px]:text-[7.5px]

            sm:text-[10px]
          "
        >
          {category}
        </p>

        {/* TITLE */}
        <h3
          className="
            mt-1

            line-clamp-2

            min-h-[31px]

            text-[10px]
            font-extrabold
            leading-[14px]

            text-white

            min-[380px]:min-h-[34px]
            min-[380px]:text-[11px]
            min-[380px]:leading-[16px]

            sm:mt-1.5
            sm:min-h-0
            sm:text-base
            sm:leading-6

            lg:text-lg
          "
        >
          {title}
        </h3>

        {/* DESCRIPTION */}
        <p
          className="
            mt-1

            line-clamp-2

            text-[7.5px]
            leading-[12px]

            text-slate-400

            min-[380px]:text-[8.5px]
            min-[380px]:leading-[13px]

            sm:mt-2
            sm:text-xs
            sm:leading-5

            lg:text-sm
            lg:leading-6
          "
        >
          {description}
        </p>

        {/* =================================================
            FOOTER
        ================================================= */}
        <div
          className="
            mt-auto

            flex
            min-w-0
            items-center
            justify-between

            gap-1

            border-t
            border-white/[0.06]

            pt-2

            sm:gap-3
            sm:pt-4
          "
        >
          {/* POINTS */}
          <span
            className="
              hidden

              shrink-0
              items-center
              gap-1

              rounded-full

              border
              border-violet-500/20

              bg-violet-500/10

              px-2
              py-1

              text-[7px]
              font-extrabold

              text-violet-300

              shadow-[0_0_15px_rgba(124,58,237,0.08)]

              min-[380px]:inline-flex

              sm:gap-1.5
              sm:px-3
              sm:py-1.5
              sm:text-xs
            "
          >
            <Sparkles
              size={8}
              className="
                text-fuchsia-400

                sm:size-[13px]
              "
            />

            {points}

            <span
              className="
                hidden
                min-[420px]:inline
              "
            >
              pts
            </span>
          </span>

          {/* TYPE */}
          <span
            className="
              ml-auto

              truncate

              text-[7px]
              font-bold

              text-slate-500

              min-[380px]:text-[8px]

              sm:text-xs
            "
          >
            Reward
          </span>
        </div>
      </div>
    </article>
  )
}
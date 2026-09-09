import {
  Gift,
  PackageCheck,
  Sparkles,
} from "lucide-react";

type RewardCardProps = {
  reward: any;
};

export function RewardCard({
  reward,
}: RewardCardProps) {
  /* =========================================================
     SAFE REWARD VALUES
  ========================================================= */

  const title =
    reward?.title ||
    reward?.name ||
    "Reward";

  const description =
    reward?.description ||
    reward?.shortDescription ||
    reward?.short_description ||
    "Unlock this reward using your earned points.";

  const image =
    reward?.image ||
    reward?.imageUrl ||
    reward?.image_url ||
    reward?.thumbnail ||
    reward?.thumbnailUrl ||
    reward?.thumbnail_url ||
    "";

  const category =
    reward?.category?.name ||
    reward?.category ||
    reward?.type ||
    "Reward";

  const points =
    reward?.points ||
    reward?.pointsCost ||
    reward?.pointsRequired ||
    reward?.points_required ||
    reward?.requiredPoints ||
    reward?.required_points ||
    0;

  const stock =
    reward?.stock ??
    reward?.quantity ??
    reward?.availableStock ??
    reward?.available_stock ??
    reward?.stockQuantity ??
    reward?.stock_quantity ??
    null;

  const hasStock =
    stock === null ||
    Number(stock) > 0;

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

        rounded-[1.35rem]

        border
        border-violet-500/[0.16]

        bg-gradient-to-b
        from-[#10142d]
        to-[#090d20]

        shadow-[0_8px_25px_rgba(0,0,0,0.26)]

        transition-all
        duration-300

        hover:-translate-y-1
        hover:border-fuchsia-500/35
        hover:shadow-[0_15px_40px_rgba(135,45,255,0.16)]

        sm:rounded-[1.5rem]
      "
    >
      {/* =====================================================
          CARD GLOW
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0

          bg-[radial-gradient(circle_at_80%_10%,rgba(217,70,239,0.10),transparent_35%)]
        "
      />

      {/* =====================================================
          PRODUCT IMAGE
      ====================================================== */}

      <div
        className="
          relative

          h-[155px]
          shrink-0

          overflow-hidden

          border-b
          border-white/[0.06]

          bg-white

          min-[380px]:h-[175px]

          sm:h-[210px]

          md:h-[220px]

          lg:h-[230px]

          xl:h-[240px]
        "
      >
        {image ? (
          <>
            {/* subtle image background */}

            <div
              className="
                absolute
                inset-0

                bg-gradient-to-br
                from-white
                via-slate-50
                to-violet-50/60
              "
            />

            {/* PRODUCT */}

            <img
              src={image}
              alt={title}
              loading="lazy"
              className="
                relative
                z-[1]

                h-full
                w-full

                object-contain
                object-center

                p-2

                transition-transform
                duration-500

                group-hover:scale-[1.03]

                min-[380px]:p-2.5

                sm:p-3

                lg:p-4
              "
            />

            {/* soft bottom fade */}

            <div
              className="
                pointer-events-none

                absolute
                inset-x-0
                bottom-0
                z-[2]

                h-12

                bg-gradient-to-t
                from-[#080b1d]/10
                to-transparent
              "
            />
          </>
        ) : (
          /* =====================================================
              FALLBACK
          ====================================================== */

          <div
            className="
              relative

              grid
              h-full

              place-items-center

              bg-gradient-to-br
              from-[#161336]
              via-[#10132d]
              to-[#101a38]
            "
          >
            <div
              className="
                absolute

                h-[90px]
                w-[90px]

                rounded-full

                bg-violet-600/15

                blur-2xl

                sm:h-[120px]
                sm:w-[120px]
              "
            />

            <div
              className="
                relative

                grid

                h-[58px]
                w-[58px]

                place-items-center

                rounded-2xl

                border
                border-violet-400/15

                bg-gradient-to-br
                from-violet-500/15
                to-fuchsia-500/10

                shadow-[0_0_30px_rgba(139,92,246,0.15)]

                sm:h-[76px]
                sm:w-[76px]
              "
            >
              <Gift
                className="
                  size-7

                  text-violet-400

                  drop-shadow-[0_0_12px_rgba(139,92,246,0.55)]

                  sm:size-10
                "
              />
            </div>
          </div>
        )}

        {/* =================================================
            STOCK BADGE
        ================================================== */}

        {stock !== null && (
          <div
            className="
              absolute
              left-2
              top-2
              z-10

              max-w-[calc(100%-16px)]

              sm:left-3
              sm:top-3
            "
          >
            <span
              className={[
                "inline-flex",
                "max-w-full",
                "items-center",
                "gap-1.5",

                "rounded-full",
                "border",

                "px-2.5",
                "py-1",

                "text-[8px]",
                "font-extrabold",

                "shadow-sm",
                "backdrop-blur-md",

                "sm:px-3",
                "sm:py-1.5",
                "sm:text-[10px]",

                hasStock
                  ? "border-emerald-500/20 bg-white/90 text-emerald-600"
                  : "border-rose-500/20 bg-white/90 text-rose-600",
              ].join(" ")}
            >
              <PackageCheck
                className="
                  size-3
                  shrink-0
                "
              />

              <span className="truncate">
                {hasStock
                  ? `${stock} in stock`
                  : "Out of stock"}
              </span>
            </span>
          </div>
        )}

        {/* =================================================
            MOBILE POINT BADGE
        ================================================== */}

        <div
          className="
            absolute
            bottom-2
            right-2
            z-10

            flex
            items-center
            gap-1

            rounded-full

            border
            border-violet-400/20

            bg-[#080b1d]/90

            px-2.5
            py-1

            text-[8px]
            font-extrabold

            text-violet-200

            shadow-lg
            backdrop-blur-md

            sm:hidden
          "
        >
          <Sparkles
            className="
              size-2.5

              text-fuchsia-400
            "
          />

          {points} pts
        </div>
      </div>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div
        className="
          relative
          z-10

          flex
          min-w-0
          flex-1
          flex-col

          p-3

          min-[380px]:p-3.5

          sm:p-4

          lg:p-5
        "
      >
        {/* CATEGORY */}

        <p
          className="
            truncate

            text-[8px]
            font-extrabold
            uppercase
            tracking-[0.12em]

            text-fuchsia-400

            min-[380px]:text-[9px]

            sm:text-[10px]
          "
        >
          {category}
        </p>

        {/* TITLE */}

        <h3
          className="
            mt-1.5

            line-clamp-2

            min-h-[34px]

            text-[12px]
            font-extrabold
            leading-[17px]

            text-white

            min-[380px]:text-[13px]
            min-[380px]:leading-[18px]

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
            mt-1.5

            line-clamp-3

            text-[9px]
            leading-[14px]

            text-slate-400

            min-[380px]:text-[10px]
            min-[380px]:leading-[15px]

            sm:mt-2
            sm:text-xs
            sm:leading-5

            lg:text-sm
            lg:leading-6
          "
        >
          {description}
        </p>

        {/* spacer */}

        <div className="min-h-3 flex-1" />

        {/* =================================================
            FOOTER
        ================================================== */}

        <div
          className="
            mt-4

            flex
            min-w-0

            items-center
            justify-between

            gap-2

            border-t
            border-white/[0.06]

            pt-3

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

              px-2.5
              py-1

              text-[8px]
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
              className="
                size-2.5

                text-fuchsia-400

                sm:size-3.5
              "
            />

            {points}

            <span className="hidden min-[420px]:inline">
              pts
            </span>
          </span>

          {/* TYPE */}

          <span
            className="
              ml-auto

              truncate

              text-[8px]
              font-bold

              text-slate-500

              min-[380px]:text-[9px]

              sm:text-xs
            "
          >
            Reward
          </span>
        </div>
      </div>
    </article>
  );
}
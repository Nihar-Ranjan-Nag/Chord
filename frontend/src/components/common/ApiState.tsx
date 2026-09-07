export function ApiLoading({
  label = 'Loading data…',
}: {
  label?: string
}) {
  return (
    <div
      className="
        relative
        flex
        min-h-44
        items-center
        justify-center
        overflow-hidden

        rounded-2xl

        border
        border-white/[0.07]

        bg-[#0a0e24]

        shadow-[0_20px_60px_rgba(0,0,0,0.18)]
      "
    >
      {/* soft background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-[50px]" />
      </div>

      <div className="relative flex items-center gap-3 text-sm font-semibold text-slate-400">
        <span
          className="
            h-5
            w-5

            animate-spin

            rounded-full

            border-2
            border-violet-500/20
            border-t-violet-400
          "
        />

        {label}
      </div>
    </div>
  )
}

export function ApiError({
  message,
}: {
  message: string
}) {
  return (
    <div
      className="
        mb-5

        rounded-xl

        border
        border-red-500/20

        bg-red-500/[0.07]

        px-4
        py-3

        text-sm
        font-medium
        text-red-300
      "
    >
      {message}
    </div>
  )
}

export function EmptyState({
  title,
  message,
}: {
  title: string
  message: string
}) {
  return (
    <div
      className="
        rounded-2xl

        border
        border-dashed
        border-white/10

        bg-white/[0.025]

        px-6
        py-12

        text-center
      "
    >
      <h3 className="text-lg font-bold text-white">
        {title}
      </h3>

      <p
        className="
          mx-auto
          mt-2
          max-w-md

          text-sm
          leading-6
          text-slate-500
        "
      >
        {message}
      </p>
    </div>
  )
}
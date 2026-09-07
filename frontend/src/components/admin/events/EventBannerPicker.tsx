import { ImagePlus, Sparkles, Trash2, UploadCloud } from 'lucide-react'
import { ChangeEvent, useRef } from 'react'

type Props = {
  preview: string
  fileName: string
  onSelect: (file: File) => void
  onClear: () => void
  error?: string
}

export function EventBannerPicker({ preview, fileName, onSelect, onClear, error }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null)

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    onSelect(file)
    event.target.value = ''
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-blue-50 shadow-sm">
      <div className="grid gap-0 lg:grid-cols-[1.15fr_.85fr]">
        <div className="relative min-h-[300px] overflow-hidden bg-slate-100 lg:min-h-[360px]">
          {preview ? (
            <img src={preview} alt="Event banner preview" className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <div className="absolute inset-0 grid place-items-center overflow-hidden bg-gradient-to-br from-violet-100 via-blue-50 to-fuchsia-100">
              <div className="absolute -left-16 -top-16 h-48 w-48 rounded-full bg-violet-300/30 blur-3xl" />
              <div className="absolute -bottom-20 -right-16 h-56 w-56 rounded-full bg-blue-300/30 blur-3xl" />
              <div className="relative text-center">
                <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-white/85 text-violet-600 shadow-xl shadow-violet-200/60 backdrop-blur">
                  <ImagePlus size={34} />
                </div>
                <p className="mt-5 text-sm font-extrabold text-slate-700">Your event banner appears here</p>
                <p className="mt-1 text-xs text-slate-500">Recommended 1600 × 900</p>
              </div>
            </div>
          )}

          <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/85 px-3 py-1.5 text-[11px] font-extrabold text-violet-700 shadow-sm backdrop-blur">
            <Sparkles size={13} /> EVENT COVER
          </div>
        </div>

        <div className="flex flex-col justify-center p-6 sm:p-8">
          <p className="text-[11px] font-black tracking-[0.16em] text-violet-600">EVENT IMAGE</p>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900">Make the event stand out</h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">
            Add a clear event cover. It will be shown on event cards, event details and public discovery pages.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 text-sm font-bold text-white shadow-lg shadow-violet-200/60 transition hover:-translate-y-0.5"
            >
              <UploadCloud size={17} />
              {preview ? 'Change image' : 'Upload image'}
            </button>

            {preview && (
              <button
                type="button"
                onClick={onClear}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
              >
                <Trash2 size={16} /> Remove
              </button>
            )}
          </div>

          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleChange}
            className="hidden"
          />

          <div className="mt-5 rounded-2xl border border-slate-200/80 bg-white/80 p-4 text-xs leading-5 text-slate-500">
            <strong className="text-slate-700">JPG, PNG or WEBP</strong> • Maximum 4 MB
            {fileName && <div className="mt-1 truncate font-semibold text-violet-600">Selected: {fileName}</div>}
          </div>

          {error && <p className="mt-3 text-xs font-semibold text-red-600">{error}</p>}
        </div>
      </div>
    </section>
  )
}

import { ImagePlus, Trash2, UploadCloud } from 'lucide-react'
import { ChangeEvent, useRef } from 'react'

type Props = {
  label: string
  title: string
  description: string
  preview: string
  fileName?: string
  onSelect: (file: File) => void
  onClear: () => void
  error?: string
  compact?: boolean
}

export function ImageUploadPicker({
  label,
  title,
  description,
  preview,
  fileName,
  onSelect,
  onClear,
  error,
  compact = false,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null)

  function change(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (file) onSelect(file)
    event.target.value = ''
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-blue-50 shadow-sm">
      <div className={compact ? 'grid gap-0 md:grid-cols-[220px_1fr]' : 'grid gap-0 lg:grid-cols-[1.05fr_.95fr]'}>
        <div className={`relative overflow-hidden bg-slate-100 ${compact ? 'min-h-[220px]' : 'min-h-[300px]'}`}>
          {preview ? (
            <img src={preview} alt={`${label} preview`} className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-violet-100 via-blue-50 to-fuchsia-100">
              <div className="text-center">
                <span className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-white/90 text-violet-600 shadow-xl shadow-violet-200/50">
                  <ImagePlus size={29} />
                </span>
                <p className="mt-4 text-sm font-extrabold text-slate-700">No image selected</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center p-5 sm:p-6">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-violet-600">{label}</p>
          <h3 className="mt-2 text-xl font-black tracking-tight text-slate-900">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-4 text-xs font-extrabold text-white shadow-lg shadow-violet-200/50 transition hover:-translate-y-0.5"
            >
              <UploadCloud size={16} /> {preview ? 'Change image' : 'Choose image'}
            </button>
            {preview && (
              <button
                type="button"
                onClick={onClear}
                className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-extrabold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
              >
                <Trash2 size={15} /> Remove
              </button>
            )}
          </div>

          <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={change} className="hidden" />
          <p className="mt-4 text-xs text-slate-500">JPG, PNG or WEBP • Maximum 4 MB</p>
          {fileName && <p className="mt-1 truncate text-xs font-bold text-violet-600">Selected: {fileName}</p>}
          {error && <p className="mt-2 text-xs font-semibold text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  )
}

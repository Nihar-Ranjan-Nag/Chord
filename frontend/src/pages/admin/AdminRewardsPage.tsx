import { Edit3, Gift, Plus, Save, X } from 'lucide-react'
import { FormEvent, useEffect, useState } from 'react'
import { ApiError, ApiLoading, EmptyState } from '@/components/common/ApiState'
import { FieldLabel, SelectInput, TextArea, TextInput } from '@/components/common/FormField'
import { ImageUploadPicker } from '@/components/common/ImageUploadPicker'
import { PageHeading } from '@/components/common/PageHeading'
import { Button } from '@/components/ui/Button'
import { useAsyncData } from '@/hooks/useAsyncData'
import { api } from '@/services/api'
import { mapReward } from '@/services/mappers'
import { readFileAsDataUrl, validateImageFile } from '@/utils/imageFile'
import type { Category, Reward } from '@/types'

const emptyForm = {
  name: '',
  description: '',
  categoryId: '',
  pointsCost: '',
  stock: '',
  status: 'ACTIVE',
}

export function AdminRewardsPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [actionError, setActionError] = useState('')
  const [imageError, setImageError] = useState('')
  const [busy, setBusy] = useState(false)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Reward | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [preview, setPreview] = useState('')
  const [originalImage, setOriginalImage] = useState('')
  const [removeImage, setRemoveImage] = useState(false)

  const { data, loading, error, refresh } = useAsyncData(async () => {
    const body: any = await api('/admin/rewards', { auth: true })
    return (body.data || []).map(mapReward)
  }, [])

  useEffect(() => {
    api<any>('/meta')
      .then((body) => setCategories(body.data.rewardCategories || []))
      .catch(() => setCategories([]))
  }, [])

  useEffect(() => () => {
    if (preview.startsWith('blob:')) URL.revokeObjectURL(preview)
  }, [preview])

  function clearPreviewObject() {
    if (preview.startsWith('blob:')) URL.revokeObjectURL(preview)
  }

  function reset() {
    clearPreviewObject()
    setEditing(null)
    setForm(emptyForm)
    setSelectedImage(null)
    setPreview('')
    setOriginalImage('')
    setRemoveImage(false)
    setImageError('')
    setActionError('')
    setOpen(false)
  }

  function createNew() {
    reset()
    setOpen(true)
  }

  function editReward(reward: Reward) {
    clearPreviewObject()
    setEditing(reward)
    setForm({
      name: reward.name,
      description: reward.description || '',
      categoryId: reward.categoryId ? String(reward.categoryId) : '',
      pointsCost: String(reward.points),
      stock: String(reward.stock),
      status: reward.status || 'ACTIVE',
    })
    setSelectedImage(null)
    setPreview(reward.image || '')
    setOriginalImage(reward.image || '')
    setRemoveImage(false)
    setImageError('')
    setActionError('')
    setOpen(true)
  }

  function selectImage(file: File) {
    const message = validateImageFile(file, 'Reward image')
    if (message) {
      setImageError(message)
      return
    }
    clearPreviewObject()
    setImageError('')
    setSelectedImage(file)
    setPreview(URL.createObjectURL(file))
    setRemoveImage(false)
  }

  function clearImage() {
    clearPreviewObject()
    setSelectedImage(null)
    setPreview('')
    setRemoveImage(Boolean(originalImage))
    setImageError('')
  }

  async function submit(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    setActionError('')
    try {
      let imageData = ''
      let mimeType = ''
      if (selectedImage) {
        imageData = await readFileAsDataUrl(selectedImage)
        mimeType = selectedImage.type
      }

      const payload = {
        name: form.name,
        description: form.description || undefined,
        categoryId: form.categoryId ? Number(form.categoryId) : undefined,
        pointsCost: Number(form.pointsCost),
        stock: Number(form.stock),
        status: form.status,
        imageData: imageData || undefined,
        mimeType: mimeType || undefined,
        removeImage,
      }

      await api(editing ? `/admin/rewards/${editing.id}` : '/admin/rewards', {
        method: editing ? 'PUT' : 'POST',
        auth: true,
        body: JSON.stringify(payload),
      })
      reset()
      await refresh()
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Unable to save reward')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <PageHeading
        eyebrow="REWARD MANAGEMENT"
        title="Rewards catalog"
        description="Create rewards, upload clear product images, maintain points cost, availability and stock."
        action={<Button onClick={createNew}><Plus size={16} /> Add reward</Button>}
      />

      {actionError && <ApiError message={actionError} />}

      {open && (
        <form onSubmit={submit} className="mb-8 space-y-5">
          <ImageUploadPicker
            label="Reward image"
            title={editing ? 'Update reward image' : 'Upload a reward image'}
            description="Choose the image from your device. The uploaded file will be stored by the backend and displayed everywhere the reward appears."
            preview={preview}
            fileName={selectedImage?.name}
            onSelect={selectImage}
            onClear={clearImage}
            error={imageError}
            compact
          />

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-slate-900">{editing ? 'Edit reward' : 'Reward details'}</h2>
                <p className="mt-1 text-xs text-slate-500">All fields below can be changed later.</p>
              </div>
              <button type="button" onClick={reset} className="grid h-9 w-9 place-items-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X size={18} /></button>
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <FieldLabel label="Reward name"><TextInput required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></FieldLabel>
              <FieldLabel label="Category"><SelectInput value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}><option value="">No category</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</SelectInput></FieldLabel>
              <FieldLabel label="Status"><SelectInput value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option><option value="OUT_OF_STOCK">Out of stock</option></SelectInput></FieldLabel>
              <FieldLabel label="Points cost"><TextInput required type="number" min="1" value={form.pointsCost} onChange={(e) => setForm({ ...form, pointsCost: e.target.value })} /></FieldLabel>
              <FieldLabel label="Stock"><TextInput required type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} /></FieldLabel>
              <FieldLabel label="Description" className="sm:col-span-2 lg:col-span-3"><TextArea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></FieldLabel>
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-5">
              <Button type="button" variant="secondary" onClick={reset}>Cancel</Button>
              <Button disabled={busy || Boolean(imageError)}><Save size={16} /> {busy ? 'Saving…' : editing ? 'Save changes' : 'Create reward'}</Button>
            </div>
          </section>
        </form>
      )}

      {loading && <ApiLoading />}
      {error && <ApiError message={error} />}
      {!loading && !error && (data || []).length === 0 && <EmptyState title="No rewards" message="Create your first reward and upload its image." />}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {(data || []).map((reward) => (
          <article key={reward.id} className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
            <div className="relative h-52 overflow-hidden bg-gradient-to-br from-violet-50 to-blue-50">
              {reward.image ? <img src={reward.image} alt={reward.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /> : <div className="grid h-full place-items-center text-violet-300"><Gift size={56} /></div>}
              <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-black text-violet-700 shadow-sm backdrop-blur">{reward.stock} in stock</span>
            </div>
            <div className="p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-violet-600">{reward.category}</p>
              <h3 className="mt-1 text-lg font-black text-slate-900">{reward.name}</h3>
              <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-slate-500">{reward.description || 'No description.'}</p>
              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                <strong className="text-sm font-black text-violet-700">{reward.points.toLocaleString()} pts</strong>
                <button onClick={() => editReward(reward)} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-black text-slate-600 transition hover:bg-violet-50 hover:text-violet-700"><Edit3 size={14} /> Edit</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  )
}

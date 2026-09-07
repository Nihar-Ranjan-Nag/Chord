import {
  BookOpen,
  Edit3,
  Plus,
  Save,
  Sparkles,
  X,
} from 'lucide-react'

import {
  FormEvent,
  useEffect,
  useState,
} from 'react'

import {
  ApiError,
  ApiLoading,
} from '@/components/common/ApiState'

import { ImageUploadPicker } from '@/components/common/ImageUploadPicker'

import { useAsyncData } from '@/hooks/useAsyncData'

import { api } from '@/services/api'

import { mapBook } from '@/services/mappers'

import {
  readFileAsDataUrl,
  validateImageFile,
} from '@/utils/imageFile'

import type { Book } from '@/types'

const emptyForm = {
  title: '',
  author: '',
  isbn: '',
  description: '',
  depositAmount: '',
  stock: '1',
  status: 'ACTIVE',
}

export function BooksManagementPage({
  base,
  title,
}: {
  base:
    | '/organizer/books'
    | '/admin/books'
  title: string
}) {
  const [
    open,
    setOpen,
  ] = useState(false)

  const [
    busy,
    setBusy,
  ] = useState(false)

  const [
    editing,
    setEditing,
  ] = useState<Book | null>(
    null
  )

  const [
    form,
    setForm,
  ] = useState(emptyForm)

  const [
    actionError,
    setActionError,
  ] = useState('')

  const [
    imageError,
    setImageError,
  ] = useState('')

  const [
    selectedImage,
    setSelectedImage,
  ] = useState<File | null>(
    null
  )

  const [
    preview,
    setPreview,
  ] = useState('')

  const [
    originalImage,
    setOriginalImage,
  ] = useState('')

  const [
    removeImage,
    setRemoveImage,
  ] = useState(false)

  const {
    data,
    loading,
    error,
    refresh,
  } = useAsyncData(
    async () => {
      const body: any =
        await api(
          base,
          {
            auth: true,
          }
        )

      return (
        body?.data || []
      ).map(mapBook)
    },
    [base]
  )

  useEffect(
    () => () => {
      if (
        preview.startsWith(
          'blob:'
        )
      ) {
        URL.revokeObjectURL(
          preview
        )
      }
    },
    [preview]
  )

  function clearObjectUrl() {
    if (
      preview.startsWith(
        'blob:'
      )
    ) {
      URL.revokeObjectURL(
        preview
      )
    }
  }

  function reset() {
    clearObjectUrl()

    setForm(emptyForm)
    setEditing(null)
    setSelectedImage(null)
    setPreview('')
    setOriginalImage('')
    setRemoveImage(false)
    setImageError('')
    setActionError('')
    setOpen(false)
  }

  function addBook() {
    reset()
    setOpen(true)
  }

  function edit(
    book: Book
  ) {
    clearObjectUrl()

    setEditing(book)

    setForm({
      title:
        book.title,

      author:
        book.author ||
        '',

      isbn:
        book.isbn ||
        '',

      description:
        book.description ||
        '',

      depositAmount:
        String(
          book.depositAmount
        ),

      stock:
        String(
          book.stock
        ),

      status:
        book.status,
    })

    setSelectedImage(null)

    setPreview(
      book.cover || ''
    )

    setOriginalImage(
      book.cover || ''
    )

    setRemoveImage(false)
    setImageError('')
    setActionError('')
    setOpen(true)
  }

  function selectImage(
    file: File
  ) {
    const message =
      validateImageFile(
        file,
        'Book cover'
      )

    if (message) {
      setImageError(
        message
      )

      return
    }

    clearObjectUrl()

    setSelectedImage(
      file
    )

    setPreview(
      URL.createObjectURL(
        file
      )
    )

    setRemoveImage(false)
    setImageError('')
  }

  function clearImage() {
    clearObjectUrl()

    setSelectedImage(
      null
    )

    setPreview('')

    setRemoveImage(
      Boolean(
        originalImage
      )
    )

    setImageError('')
  }

  async function submit(
    event: FormEvent
  ) {
    event.preventDefault()

    setBusy(true)
    setActionError('')

    try {
      let imageData =
        ''

      let mimeType =
        ''

      if (
        selectedImage
      ) {
        imageData =
          await readFileAsDataUrl(
            selectedImage
          )

        mimeType =
          selectedImage.type
      }

      const payload = {
        ...form,

        depositAmount:
          Number(
            form.depositAmount
          ),

        stock:
          Number(
            form.stock
          ),

        imageData:
          imageData ||
          undefined,

        mimeType:
          mimeType ||
          undefined,

        removeImage,
      }

      await api(
        editing
          ? `${base}/${editing.id}`
          : base,
        {
          method:
            editing
              ? 'PUT'
              : 'POST',

          auth: true,

          body:
            JSON.stringify(
              payload
            ),
        }
      )

      reset()

      await refresh()
    } catch (err) {
      setActionError(
        err instanceof Error
          ? err.message
          : 'Unable to save book'
      )
    } finally {
      setBusy(false)
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
            BOOK MANAGEMENT
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
          <div className="min-w-0">
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
              {title}
            </h1>

            <p
              className="
                mt-2
                max-w-[720px]

                text-[10px]
                leading-5

                text-white/80

                min-[380px]:text-[11px]

                sm:mt-3
                sm:text-[13px]
                sm:leading-6
              "
            >
              Create and update books, upload book covers, maintain refundable deposits, availability and stock.
            </p>
          </div>

          <button
            type="button"
            onClick={addBook}
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

              shadow-[0_10px_30px_rgba(124,58,237,0.22)]

              transition

              hover:-translate-y-0.5

              sm:h-11
              sm:w-auto
              sm:px-5
              sm:text-xs
            "
          >
            <Plus size={15} />

            Add book
          </button>
        </div>
      </section>

      {/* ======================================================
          ACTION ERROR
      ====================================================== */}
      {actionError && (
        <div className="mb-4">
          <ApiError
            message={
              actionError
            }
          />
        </div>
      )}

      {/* ======================================================
          ADD / EDIT FORM
      ====================================================== */}
      {open && (
        <form
          onSubmit={
            submit
          }
          className="
            mb-7
            space-y-4

            sm:space-y-5
          "
        >
          {/* IMAGE PICKER WRAPPER */}
          <div
            className="
              overflow-hidden

              rounded-2xl

              border
              border-white/[0.08]

              bg-gradient-to-br
              from-[#11152e]
              to-[#080c1f]

              p-2

              sm:rounded-3xl
              sm:p-3
            "
          >
            <ImageUploadPicker
              label="Book cover"
              title={
                editing
                  ? 'Update book cover'
                  : 'Upload book cover'
              }
              description="Choose a cover from your device. No image URL is required."
              preview={
                preview
              }
              fileName={
                selectedImage
                  ?.name
              }
              onSelect={
                selectImage
              }
              onClear={
                clearImage
              }
              error={
                imageError
              }
              compact
            />
          </div>

          {/* FORM CARD */}
          <section
            className="
              overflow-hidden

              rounded-2xl

              border
              border-violet-500/[0.12]

              bg-gradient-to-br
              from-violet-600/[0.08]
              via-[#0d1129]
              to-[#080c1f]

              shadow-[0_14px_40px_rgba(0,0,0,0.22)]

              sm:rounded-3xl
            "
          >
            {/* HEADER */}
            <div
              className="
                flex
                items-start
                justify-between
                gap-3

                border-b
                border-white/[0.07]

                px-4
                py-4

                sm:px-6
                sm:py-5
              "
            >
              <div
                className="
                  flex
                  min-w-0
                  items-start
                  gap-3
                "
              >
                <span
                  className="
                    grid
                    h-9
                    w-9
                    shrink-0
                    place-items-center

                    rounded-xl

                    bg-violet-500/12

                    text-violet-300

                    sm:h-10
                    sm:w-10
                  "
                >
                  <BookOpen
                    size={17}
                  />
                </span>

                <div className="min-w-0">
                  <h2
                    className="
                      text-[14px]
                      font-black

                      text-white

                      sm:text-lg
                    "
                  >
                    {editing
                      ? 'Edit book'
                      : 'Add a new book'}
                  </h2>

                  <p
                    className="
                      mt-1

                      text-[9px]
                      leading-5

                      text-white/65

                      sm:text-[11px]
                    "
                  >
                    Deposit is refunded after a successful return.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={
                  reset
                }
                className="
                  grid
                  h-9
                  w-9
                  shrink-0
                  place-items-center

                  rounded-xl

                  border
                  border-white/[0.08]

                  bg-white/[0.035]

                  text-white/60

                  transition

                  hover:bg-rose-500/10
                  hover:text-rose-300
                "
              >
                <X size={16} />
              </button>
            </div>

            {/* FIELDS */}
            <div
              className="
                grid
                gap-4

                p-4

                sm:grid-cols-2
                sm:gap-5
                sm:p-6

                lg:grid-cols-3
              "
            >
              <BookField label="Book title">
                <input
                  required
                  value={
                    form.title
                  }
                  onChange={
                    e =>
                      setForm({
                        ...form,
                        title:
                          e
                            .target
                            .value,
                      })
                  }
                  className={
                    inputClass
                  }
                />
              </BookField>

              <BookField label="Author">
                <input
                  value={
                    form.author
                  }
                  onChange={
                    e =>
                      setForm({
                        ...form,
                        author:
                          e
                            .target
                            .value,
                      })
                  }
                  className={
                    inputClass
                  }
                />
              </BookField>

              <BookField label="ISBN">
                <input
                  value={
                    form.isbn
                  }
                  onChange={
                    e =>
                      setForm({
                        ...form,
                        isbn:
                          e
                            .target
                            .value,
                      })
                  }
                  className={
                    inputClass
                  }
                />
              </BookField>

              <BookField label="Refundable deposit (₹)">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={
                    form.depositAmount
                  }
                  onChange={
                    e =>
                      setForm({
                        ...form,
                        depositAmount:
                          e
                            .target
                            .value,
                      })
                  }
                  className={
                    inputClass
                  }
                />
              </BookField>

              <BookField label="Stock">
                <input
                  type="number"
                  min="0"
                  required
                  value={
                    form.stock
                  }
                  onChange={
                    e =>
                      setForm({
                        ...form,
                        stock:
                          e
                            .target
                            .value,
                      })
                  }
                  className={
                    inputClass
                  }
                />
              </BookField>

              <BookField label="Status">
                <select
                  value={
                    form.status
                  }
                  onChange={
                    e =>
                      setForm({
                        ...form,
                        status:
                          e
                            .target
                            .value,
                      })
                  }
                  className={
                    inputClass
                  }
                >
                  <option value="ACTIVE">
                    Active
                  </option>

                  <option value="INACTIVE">
                    Inactive
                  </option>
                </select>
              </BookField>

              <BookField
                label="Description"
                className="
                  sm:col-span-2
                  lg:col-span-3
                "
              >
                <textarea
                  rows={4}
                  value={
                    form.description
                  }
                  onChange={
                    e =>
                      setForm({
                        ...form,
                        description:
                          e
                            .target
                            .value,
                      })
                  }
                  className={
                    textareaClass
                  }
                />
              </BookField>
            </div>

            {/* FORM ACTIONS */}
            <div
              className="
                flex
                flex-col-reverse
                gap-2

                border-t
                border-white/[0.07]

                p-4

                sm:flex-row
                sm:justify-end
                sm:gap-3
                sm:px-6
                sm:py-5
              "
            >
              <button
                type="button"
                onClick={
                  reset
                }
                className="
                  inline-flex
                  h-10
                  w-full
                  items-center
                  justify-center

                  rounded-xl

                  border
                  border-white/[0.09]

                  bg-white/[0.04]

                  px-4

                  text-[10px]
                  font-extrabold

                  text-white/80

                  transition

                  hover:bg-white/[0.08]
                  hover:text-white

                  sm:h-11
                  sm:w-auto
                  sm:min-w-[100px]
                  sm:text-xs
                "
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={
                  busy ||
                  Boolean(
                    imageError
                  )
                }
                className="
                  inline-flex
                  h-10
                  w-full
                  items-center
                  justify-center
                  gap-2

                  rounded-xl

                  bg-gradient-to-r
                  from-violet-600
                  via-purple-600
                  to-blue-600

                  px-5

                  text-[10px]
                  font-extrabold

                  text-white

                  shadow-[0_10px_30px_rgba(124,58,237,0.22)]

                  transition

                  hover:-translate-y-0.5

                  disabled:cursor-not-allowed
                  disabled:opacity-50

                  sm:h-11
                  sm:w-auto
                  sm:min-w-[145px]
                  sm:text-xs
                "
              >
                <Save
                  size={15}
                />

                {busy
                  ? 'Saving...'
                  : editing
                    ? 'Save changes'
                    : 'Save book'}
              </button>
            </div>
          </section>
        </form>
      )}

      {/* ======================================================
          LOADING / ERROR
      ====================================================== */}
      {loading && (
        <div className="py-8">
          <ApiLoading />
        </div>
      )}

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
        books.length ===
          0 && (
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
              <BookOpen
                size={23}
              />
            </span>

            <h2
              className="
                mt-3

                text-[14px]
                font-black

                text-white
              "
            >
              No books yet
            </h2>

            <p
              className="
                mt-1

                text-[10px]

                text-white/70
              "
            >
              Add your first book to start the borrowing service.
            </p>
          </section>
        )}

      {/* ======================================================
          BOOK GRID
          MOBILE = 2 PER ROW
      ====================================================== */}
      {!loading &&
        !error &&
        books.length >
          0 && (
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
            {books.map(book => (
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
                {/* COVER */}
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
                      src={
                        book.cover
                      }
                      alt={
                        book.title
                      }
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

                  {/* STATUS */}
                  <span
                    className={`
                      absolute
                      left-2
                      top-2

                      rounded-full

                      border

                      px-2
                      py-1

                      text-[6.5px]
                      font-extrabold

                      backdrop-blur-md

                      min-[380px]:text-[7px]

                      sm:left-3
                      sm:top-3
                      sm:px-2.5
                      sm:text-[9px]

                      ${
                        book.status ===
                        'ACTIVE'
                          ? 'border-emerald-400/20 bg-emerald-500/15 text-emerald-100'
                          : 'border-slate-400/15 bg-white/[0.08] text-white/70'
                      }
                    `}
                  >
                    {book.status}
                  </span>

                  {/* DEPOSIT */}
                  <span
                    className="
                      absolute
                      bottom-2
                      right-2

                      rounded-full

                      border
                      border-violet-400/20

                      bg-[#090d20]/90

                      px-2
                      py-1

                      text-[7px]
                      font-extrabold

                      text-violet-100

                      backdrop-blur-md

                      sm:bottom-3
                      sm:right-3
                      sm:px-2.5
                      sm:text-[9px]
                    "
                  >
                    ₹
                    {book.depositAmount.toFixed(
                      2
                    )}
                  </span>
                </div>

                {/* CONTENT */}
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
                      'No author'}
                  </p>

                  <div
                    className="
                      mt-2

                      flex
                      flex-wrap
                      gap-1.5

                      text-[7px]
                      font-semibold

                      text-white/65

                      min-[380px]:text-[8px]

                      sm:text-[9px]
                    "
                  >
                    <span
                      className="
                        rounded-md

                        border
                        border-white/[0.06]

                        bg-white/[0.03]

                        px-1.5
                        py-1
                      "
                    >
                      Stock {book.stock}
                    </span>

                    <span
                      className="
                        rounded-md

                        border
                        border-white/[0.06]

                        bg-white/[0.03]

                        px-1.5
                        py-1
                      "
                    >
                      {book.borrowCount ||
                        0}{' '}
                      borrows
                    </span>
                  </div>

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
                      'No description.'}
                  </p>

                  {/* EDIT */}
                  <button
                    type="button"
                    onClick={() =>
                      edit(book)
                    }
                    className="
                      mt-auto
                      pt-3
                    "
                  >
                    <span
                      className="
                        flex
                        h-8
                        w-full
                        items-center
                        justify-center
                        gap-1.5

                        rounded-lg

                        border
                        border-violet-400/20

                        bg-violet-500/10

                        text-[8px]
                        font-extrabold

                        text-violet-200

                        transition

                        hover:bg-violet-500/20
                        hover:text-white

                        min-[380px]:h-9
                        min-[380px]:text-[9px]

                        sm:h-10
                        sm:rounded-xl
                        sm:text-[10px]
                      "
                    >
                      <Edit3
                        size={12}
                      />

                      Edit book
                    </span>
                  </button>
                </div>
              </article>
            ))}
          </section>
        )}

      <div className="h-5" />
    </div>
  )
}

const inputClass = `
  h-11
  w-full

  rounded-xl

  border
  border-white/[0.09]

  bg-white/[0.035]

  px-3

  text-[10px]
  font-medium

  text-white

  outline-none

  transition

  placeholder:text-white/40

  focus:border-violet-500/35
  focus:bg-white/[0.055]
  focus:ring-2
  focus:ring-violet-500/10

  sm:h-12
  sm:px-4
  sm:text-xs

  [color-scheme:dark]
`

const textareaClass = `
  w-full

  resize-y

  rounded-xl

  border
  border-white/[0.09]

  bg-white/[0.035]

  px-3
  py-3

  text-[10px]
  font-medium
  leading-5

  text-white

  outline-none

  transition

  placeholder:text-white/40

  focus:border-violet-500/35
  focus:bg-white/[0.055]
  focus:ring-2
  focus:ring-violet-500/10

  sm:px-4
  sm:text-xs
  sm:leading-6

  [color-scheme:dark]
`

function BookField({
  label,
  className = '',
  children,
}: {
  label: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <label
      className={`
        block
        min-w-0

        ${className}
      `}
    >
      <span
        className="
          mb-2
          block

          text-[8px]
          font-extrabold
          uppercase
          tracking-[0.08em]

          text-white/75

          sm:text-[9px]
        "
      >
        {label}
      </span>

      {children}
    </label>
  )
}
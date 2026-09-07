import {
  CalendarDays,
  CheckCircle2,
  MapPin,
  Sparkles,
} from 'lucide-react'

import {
  FormEvent,
  useEffect,
  useState,
} from 'react'

import { useNavigate } from 'react-router-dom'

import { EventBannerPicker } from '@/components/admin/events/EventBannerPicker'

import {
  ApiError,
  ApiLoading,
} from '@/components/common/ApiState'

import { api } from '@/services/api'

import { mapEvent } from '@/services/mappers'

import type { Category } from '@/types'

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
]

const MAX_IMAGE_SIZE =
  4 * 1024 * 1024

const readFileAsDataUrl = (
  file: File
) =>
  new Promise<string>(
    (
      resolve,
      reject
    ) => {
      const reader =
        new FileReader()

      reader.onload = () =>
        resolve(
          String(
            reader.result || ''
          )
        )

      reader.onerror = () =>
        reject(
          new Error(
            'Unable to read the selected image.'
          )
        )

      reader.readAsDataURL(
        file
      )
    }
  )

const toLocalInput = (
  value?: string
) => {
  if (!value) {
    return ''
  }

  const date =
    new Date(value)

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return ''
  }

  const pad = (
    value: number
  ) =>
    String(value).padStart(
      2,
      '0'
    )

  return `${date.getFullYear()}-${pad(
    date.getMonth() + 1
  )}-${pad(
    date.getDate()
  )}T${pad(
    date.getHours()
  )}:${pad(
    date.getMinutes()
  )}`
}

type Props = {
  mode: 'create' | 'edit'
  apiBase: string
  returnPath: string
  eventId?: string
  workspaceLabel: string
}

export function EventEditor({
  mode,
  apiBase,
  returnPath,
  eventId,
  workspaceLabel,
}: Props) {
  const navigate =
    useNavigate()

  const [
    categories,
    setCategories,
  ] = useState<Category[]>(
    []
  )

  const [
    error,
    setError,
  ] = useState('')

  const [
    imageError,
    setImageError,
  ] = useState('')

  const [
    busy,
    setBusy,
  ] = useState(false)

  const [
    loading,
    setLoading,
  ] = useState(
    mode === 'edit'
  )

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

  const [
    form,
    setForm,
  ] = useState({
    title: '',
    categoryId: '',
    description: '',
    shortDescription: '',
    organizer: '',
    location: '',
    isOnline: false,
    meetingUrl: '',
    startAt: '',
    endAt: '',
    registrationStartsAt:
      '',
    registrationEndsAt:
      '',
    capacity: '',
    participationPoints:
      '0',
    attendancePoints:
      '0',
    completionPoints:
      '0',
    status: 'PUBLISHED',
    terms: '',
  })

  const change = (
    key: string,
    value:
      | string
      | boolean
  ) =>
    setForm(
      current => ({
        ...current,
        [key]: value,
      })
    )

  useEffect(() => {
    api<any>('/meta')
      .then(body =>
        setCategories(
          body.data
            .eventCategories ||
            []
        )
      )
      .catch(() =>
        setCategories([])
      )
  }, [])

  useEffect(() => {
    if (
      mode !== 'edit' ||
      !eventId
    ) {
      return
    }

    setLoading(true)

    api<any>(
      `${apiBase}/${eventId}`,
      {
        auth: true,
      }
    )
      .then(body => {
        const raw =
          body.data

        const event =
          mapEvent(raw)

        setOriginalImage(
          event.image || ''
        )

        setPreview(
          event.image || ''
        )

        setForm({
          title:
            raw.title ||
            '',

          categoryId:
            raw.categoryId
              ? String(
                  raw.categoryId
                )
              : '',

          description:
            raw.description ||
            '',

          shortDescription:
            raw.shortDescription ||
            '',

          organizer:
            raw.organizer ||
            '',

          location:
            raw.location ||
            '',

          isOnline:
            Boolean(
              raw.isOnline
            ),

          meetingUrl:
            raw.meetingUrl ||
            '',

          startAt:
            toLocalInput(
              raw.startAt
            ),

          endAt:
            toLocalInput(
              raw.endAt
            ),

          registrationStartsAt:
            toLocalInput(
              raw.registrationStartsAt
            ),

          registrationEndsAt:
            toLocalInput(
              raw.registrationEndsAt
            ),

          capacity:
            raw.capacity
              ? String(
                  raw.capacity
                )
              : '',

          participationPoints:
            String(
              raw.participationPoints ||
                0
            ),

          attendancePoints:
            String(
              raw.attendancePoints ||
                0
            ),

          completionPoints:
            String(
              raw.completionPoints ||
                0
            ),

          status:
            raw.status ||
            'DRAFT',

          terms:
            raw.terms ||
            '',
        })
      })
      .catch(err =>
        setError(
          err instanceof Error
            ? err.message
            : 'Unable to load event'
        )
      )
      .finally(() =>
        setLoading(false)
      )
  }, [
    mode,
    eventId,
    apiBase,
  ])

  useEffect(
    () => () => {
      if (
        preview &&
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

  function selectImage(
    file: File
  ) {
    setImageError('')
    setError('')

    if (
      !ALLOWED_IMAGE_TYPES.includes(
        file.type
      )
    ) {
      setImageError(
        'Please choose a JPG, PNG or WEBP image.'
      )

      return
    }

    if (
      file.size >
      MAX_IMAGE_SIZE
    ) {
      setImageError(
        'Event image must be smaller than 4 MB.'
      )

      return
    }

    if (
      preview.startsWith(
        'blob:'
      )
    ) {
      URL.revokeObjectURL(
        preview
      )
    }

    setSelectedImage(
      file
    )

    setPreview(
      URL.createObjectURL(
        file
      )
    )

    setRemoveImage(false)
  }

  function clearImage() {
    if (
      preview.startsWith(
        'blob:'
      )
    ) {
      URL.revokeObjectURL(
        preview
      )
    }

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
    e: FormEvent
  ) {
    e.preventDefault()

    setBusy(true)
    setError('')

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
        title:
          form.title,

        categoryId:
          form.categoryId
            ? Number(
                form.categoryId
              )
            : undefined,

        description:
          form.description,

        shortDescription:
          form.shortDescription ||
          undefined,

        organizer:
          form.organizer ||
          undefined,

        location:
          form.location ||
          undefined,

        isOnline:
          form.isOnline,

        meetingUrl:
          form.isOnline &&
          form.meetingUrl
            ? form.meetingUrl
            : '',

        startAt:
          form.startAt,

        endAt:
          form.endAt,

        registrationStartsAt:
          form.registrationStartsAt ||
          undefined,

        registrationEndsAt:
          form.registrationEndsAt ||
          undefined,

        capacity:
          form.capacity
            ? Number(
                form.capacity
              )
            : undefined,

        participationPoints:
          Number(
            form.participationPoints ||
              0
          ),

        attendancePoints:
          Number(
            form.attendancePoints ||
              0
          ),

        completionPoints:
          Number(
            form.completionPoints ||
              0
          ),

        status:
          form.status,

        terms:
          form.terms ||
          undefined,

        imageData:
          imageData ||
          undefined,

        mimeType:
          mimeType ||
          undefined,

        removeImage,
      }

      await api(
        mode === 'create'
          ? apiBase
          : `${apiBase}/${eventId}`,
        {
          method:
            mode === 'create'
              ? 'POST'
              : 'PUT',

          auth: true,

          body:
            JSON.stringify(
              payload
            ),
        }
      )

      navigate(
        returnPath,
        {
          replace: true,
        }
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : `Unable to ${mode} event`
      )
    } finally {
      setBusy(false)
    }
  }

  if (loading) {
    return (
      <div className="py-10">
        <ApiLoading />
      </div>
    )
  }

  const editing =
    mode === 'edit'

  return (
    <div className="w-full">
      {/* ======================================================
          PAGE HEADING
      ====================================================== */}
      <section className="mb-5 sm:mb-7">
        <div
          className="
            flex
            items-center
            gap-2
          "
        >
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
            <Sparkles
              size={14}
            />
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
            {workspaceLabel}
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
          {editing
            ? 'Edit'
            : 'Create a new'}{' '}

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
            event
          </span>
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
          {editing
            ? 'Update the event anytime. Changes are saved to the same event and reflected on public pages.'
            : 'Add a premium cover, event information, schedule, points and publishing status.'}
        </p>
      </section>

      {/* ======================================================
          ERROR
      ====================================================== */}
      {error && (
        <div className="mb-4">
          <ApiError
            message={error}
          />
        </div>
      )}

      <form
        onSubmit={submit}
        className="
          space-y-4

          sm:space-y-5
        "
      >
        {/* ==================================================
            BANNER
        ================================================== */}
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
          <EventBannerPicker
            preview={preview}
            fileName={
              selectedImage
                ?.name || ''
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
          />
        </div>

        {/* ==================================================
            EVENT INFORMATION
        ================================================== */}
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
          <SectionHeader
            icon={
              Sparkles
            }
            iconClass="bg-violet-500/10 text-violet-300"
            title="Event information"
            description="Create a clear, attractive event listing."
          />

          <div
            className="
              grid
              gap-4

              p-4

              sm:grid-cols-2
              sm:gap-5
              sm:p-6

              lg:p-7
            "
          >
            <EditorField
              label="Event title"
              className="sm:col-span-2"
            >
              <input
                required
                value={
                  form.title
                }
                onChange={e =>
                  change(
                    'title',
                    e.target.value
                  )
                }
                placeholder="e.g. Future Innovators Hackathon"
                className={
                  inputClass
                }
              />
            </EditorField>

            <EditorField label="Category">
              <select
                value={
                  form.categoryId
                }
                onChange={e =>
                  change(
                    'categoryId',
                    e.target.value
                  )
                }
                className={
                  inputClass
                }
              >
                <option value="">
                  No category
                </option>

                {categories.map(
                  category => (
                    <option
                      key={
                        category.id
                      }
                      value={
                        category.id
                      }
                    >
                      {
                        category.name
                      }
                    </option>
                  )
                )}
              </select>
            </EditorField>

            <EditorField label="Organizer">
              <input
                value={
                  form.organizer
                }
                onChange={e =>
                  change(
                    'organizer',
                    e.target.value
                  )
                }
                placeholder="Organizer / club name"
                className={
                  inputClass
                }
              />
            </EditorField>

            <EditorField
              label="Short description"
              className="sm:col-span-2"
            >
              <input
                maxLength={300}
                value={
                  form.shortDescription
                }
                onChange={e =>
                  change(
                    'shortDescription',
                    e.target.value
                  )
                }
                placeholder="Short text shown on event cards"
                className={
                  inputClass
                }
              />
            </EditorField>

            <EditorField
              label="Description"
              className="sm:col-span-2"
            >
              <textarea
                required
                rows={6}
                value={
                  form.description
                }
                onChange={e =>
                  change(
                    'description',
                    e.target.value
                  )
                }
                placeholder="Describe the event, activities and goals..."
                className={
                  textareaClass
                }
              />
            </EditorField>
          </div>
        </section>

        {/* ==================================================
            SCHEDULE & VENUE
        ================================================== */}
        <section
          className="
            overflow-hidden

            rounded-2xl

            border
            border-blue-500/[0.12]

            bg-gradient-to-br
            from-blue-600/[0.08]
            via-[#0d1129]
            to-[#080c1f]

            shadow-[0_14px_40px_rgba(0,0,0,0.22)]

            sm:rounded-3xl
          "
        >
          <SectionHeader
            icon={
              CalendarDays
            }
            iconClass="bg-blue-500/10 text-blue-300"
            title="Schedule & venue"
            description="Control when and where users can join."
          />

          <div
            className="
              grid
              gap-4

              p-4

              sm:grid-cols-2
              sm:gap-5
              sm:p-6

              lg:p-7
            "
          >
            {/* LOCATION */}
            <EditorField label="Location">
              <div className="relative">
                <MapPin
                  size={15}
                  className="
                    pointer-events-none
                    absolute
                    left-3
                    top-1/2

                    -translate-y-1/2

                    text-blue-300
                  "
                />

                <input
                  value={
                    form.location
                  }
                  onChange={e =>
                    change(
                      'location',
                      e.target.value
                    )
                  }
                  placeholder="Auditorium, campus, city..."
                  className={`${inputClass} pl-9`}
                />
              </div>
            </EditorField>

            {/* ONLINE */}
            <label
              className="
                flex
                min-h-[44px]
                items-center
                gap-3
                self-end

                rounded-xl

                border
                border-blue-400/15

                bg-blue-500/[0.06]

                px-3
                py-3

                text-[10px]
                font-bold

                text-white

                transition

                hover:bg-blue-500/[0.10]

                sm:min-h-[48px]
                sm:px-4
                sm:text-xs
              "
            >
              <input
                type="checkbox"
                checked={
                  form.isOnline
                }
                onChange={e =>
                  change(
                    'isOnline',
                    e.target.checked
                  )
                }
                className="
                  h-4
                  w-4
                  shrink-0

                  accent-violet-600
                "
              />

              <span>
                This is an online event
              </span>
            </label>

            {form.isOnline && (
              <EditorField
                label="Meeting URL"
                className="sm:col-span-2"
              >
                <input
                  type="url"
                  value={
                    form.meetingUrl
                  }
                  onChange={e =>
                    change(
                      'meetingUrl',
                      e.target.value
                    )
                  }
                  placeholder="https://..."
                  className={
                    inputClass
                  }
                />
              </EditorField>
            )}

            <EditorField label="Start date & time">
              <input
                required
                type="datetime-local"
                value={
                  form.startAt
                }
                onChange={e =>
                  change(
                    'startAt',
                    e.target.value
                  )
                }
                className={
                  inputClass
                }
              />
            </EditorField>

            <EditorField label="End date & time">
              <input
                required
                type="datetime-local"
                value={
                  form.endAt
                }
                onChange={e =>
                  change(
                    'endAt',
                    e.target.value
                  )
                }
                className={
                  inputClass
                }
              />
            </EditorField>

            <EditorField label="Registration starts">
              <input
                type="datetime-local"
                value={
                  form.registrationStartsAt
                }
                onChange={e =>
                  change(
                    'registrationStartsAt',
                    e.target.value
                  )
                }
                className={
                  inputClass
                }
              />
            </EditorField>

            <EditorField label="Registration ends">
              <input
                type="datetime-local"
                value={
                  form.registrationEndsAt
                }
                onChange={e =>
                  change(
                    'registrationEndsAt',
                    e.target.value
                  )
                }
                className={
                  inputClass
                }
              />
            </EditorField>

            <EditorField label="Capacity">
              <input
                type="number"
                min="1"
                value={
                  form.capacity
                }
                onChange={e =>
                  change(
                    'capacity',
                    e.target.value
                  )
                }
                placeholder="Unlimited when empty"
                className={
                  inputClass
                }
              />
            </EditorField>

            <EditorField label="Publishing status">
              <select
                value={
                  form.status
                }
                onChange={e =>
                  change(
                    'status',
                    e.target.value
                  )
                }
                className={
                  inputClass
                }
              >
                <option value="DRAFT">
                  Draft
                </option>

                <option value="PUBLISHED">
                  Published
                </option>

                <option value="COMPLETED">
                  Completed
                </option>

                <option value="CANCELLED">
                  Cancelled
                </option>
              </select>
            </EditorField>
          </div>
        </section>

        {/* ==================================================
            POINTS
        ================================================== */}
        <section
          className="
            overflow-hidden

            rounded-2xl

            border
            border-emerald-500/[0.12]

            bg-gradient-to-br
            from-emerald-600/[0.07]
            via-[#0d1129]
            to-[#080c1f]

            shadow-[0_14px_40px_rgba(0,0,0,0.22)]

            sm:rounded-3xl
          "
        >
          <SectionHeader
            icon={
              CheckCircle2
            }
            iconClass="bg-emerald-500/10 text-emerald-300"
            title="Points & participation"
            description="Reward participation and define instructions."
          />

          <div
            className="
              grid
              gap-4

              p-4

              sm:grid-cols-2
              sm:gap-5
              sm:p-6

              lg:grid-cols-3
              lg:p-7
            "
          >
            <EditorField label="Registration points">
              <input
                type="number"
                min="0"
                value={
                  form.participationPoints
                }
                onChange={e =>
                  change(
                    'participationPoints',
                    e.target.value
                  )
                }
                className={
                  inputClass
                }
              />
            </EditorField>

            <EditorField label="Attendance points">
              <input
                type="number"
                min="0"
                value={
                  form.attendancePoints
                }
                onChange={e =>
                  change(
                    'attendancePoints',
                    e.target.value
                  )
                }
                className={
                  inputClass
                }
              />
            </EditorField>

            <EditorField label="Completion points">
              <input
                type="number"
                min="0"
                value={
                  form.completionPoints
                }
                onChange={e =>
                  change(
                    'completionPoints',
                    e.target.value
                  )
                }
                className={
                  inputClass
                }
              />
            </EditorField>

            <EditorField
              label="Terms / instructions"
              className="
                sm:col-span-2
                lg:col-span-3
              "
            >
              <textarea
                rows={4}
                value={
                  form.terms
                }
                onChange={e =>
                  change(
                    'terms',
                    e.target.value
                  )
                }
                placeholder="Optional participation rules or instructions..."
                className={
                  textareaClass
                }
              />
            </EditorField>
          </div>
        </section>

        {/* ==================================================
            ACTION BAR
        ================================================== */}
        <div
          className="
            sticky
            bottom-3
            z-20

            flex
            flex-col-reverse
            gap-2

            rounded-2xl

            border
            border-white/[0.10]

            bg-[#090d20]/95

            p-3

            shadow-[0_15px_45px_rgba(0,0,0,0.42)]

            backdrop-blur-xl

            sm:bottom-4
            sm:flex-row
            sm:justify-end
            sm:gap-3
            sm:p-4
          "
        >
          <button
            type="button"
            onClick={() =>
              navigate(
                returnPath
              )
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
              sm:min-w-[110px]
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

              rounded-xl

              bg-gradient-to-r
              from-violet-600
              via-purple-600
              to-blue-600

              px-5

              text-[10px]
              font-extrabold

              text-white

              shadow-[0_10px_30px_rgba(124,58,237,0.24)]

              transition

              hover:-translate-y-0.5

              disabled:cursor-not-allowed
              disabled:opacity-50

              sm:h-11
              sm:w-auto
              sm:min-w-[160px]
              sm:text-xs
            "
          >
            {busy
              ? editing
                ? 'Saving changes...'
                : 'Creating event...'
              : editing
                ? 'Save changes'
                : 'Create event'}
          </button>
        </div>
      </form>

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

function EditorField({
  label,
  className = '',
  children,
}: {
  label: string
  className?: string
  children:
    React.ReactNode
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

function SectionHeader({
  icon: Icon,
  iconClass,
  title,
  description,
}: {
  icon:
    typeof Sparkles
  iconClass: string
  title: string
  description: string
}) {
  return (
    <div
      className="
        border-b
        border-white/[0.07]

        px-4
        py-4

        sm:px-6
        sm:py-5

        lg:px-7
      "
    >
      <div
        className="
          flex
          items-start
          gap-3
        "
      >
        <span
          className={`
            grid
            h-9
            w-9
            shrink-0
            place-items-center

            rounded-xl

            ${iconClass}

            sm:h-10
            sm:w-10
          `}
        >
          <Icon size={17} />
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
            {title}
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
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}
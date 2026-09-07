import {
  Camera,
  ImagePlus,
  Save,
  Sparkles,
  UserRound,
} from 'lucide-react'

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from 'react'

import {
  ApiError,
  ApiLoading,
} from '@/components/common/ApiState'

import { UserAvatar } from '@/components/common/UserAvatar'

import { api } from '@/services/api'

import { mapUser } from '@/services/mappers'

import { useAuth } from '@/features/auth/AuthContext'

const MAX_IMAGE_SIZE =
  2 * 1024 * 1024

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
]

function fileToDataUrl(
  file: File
) {
  return new Promise<string>(
    (
      resolve,
      reject
    ) => {
      const reader =
        new FileReader()

      reader.onload = () =>
        typeof reader.result ===
        'string'
          ? resolve(
              reader.result
            )
          : reject(
              new Error(
                'Unable to read image'
              )
            )

      reader.onerror = () =>
        reject(
          new Error(
            'Unable to read image'
          )
        )

      reader.readAsDataURL(
        file
      )
    }
  )
}

export function ProfilePage() {
  const {
    user,
    refreshUser,
  } = useAuth()

  const fileInputRef =
    useRef<HTMLInputElement | null>(
      null
    )

  const [
    loading,
    setLoading,
  ] = useState(true)

  const [
    busy,
    setBusy,
  ] = useState(false)

  const [
    error,
    setError,
  ] = useState('')

  const [
    message,
    setMessage,
  ] = useState('')

  const [
    currentAvatar,
    setCurrentAvatar,
  ] = useState('')

  const [
    selectedFile,
    setSelectedFile,
  ] = useState<File | null>(
    null
  )

  const [
    previewImage,
    setPreviewImage,
  ] = useState('')

  const [
    form,
    setForm,
  ] = useState({
    name: '',
    phone: '',
    dateOfBirth: '',
    college: '',
    course: '',
    yearOfStudy: '',
  })

  useEffect(() => {
    api<any>(
      '/users/profile',
      {
        auth: true,
      }
    )
      .then(body => {
        const mapped =
          mapUser(
            body.data
          )

        setForm({
          name:
            mapped.name,

          phone:
            mapped.phone ||
            '',

          dateOfBirth:
            mapped.dateOfBirth
              ? mapped.dateOfBirth.slice(
                  0,
                  10
                )
              : '',

          college:
            mapped.college ||
            '',

          course:
            mapped.course ||
            '',

          yearOfStudy:
            mapped.yearOfStudy
              ? String(
                  mapped.yearOfStudy
                )
              : '',
        })

        setCurrentAvatar(
          mapped.avatar ||
            ''
        )
      })
      .catch(err =>
        setError(
          err instanceof Error
            ? err.message
            : 'Unable to load profile'
        )
      )
      .finally(() =>
        setLoading(false)
      )
  }, [])

  useEffect(
    () => () => {
      if (previewImage) {
        URL.revokeObjectURL(
          previewImage
        )
      }
    },
    [previewImage]
  )

  const isOrganizer =
    user?.role ===
    'organizer'

  const shownImage =
    previewImage ||
    currentAvatar ||
    user?.avatar ||
    ''

  function chooseImage() {
    fileInputRef.current?.click()
  }

  function handleImageChange(
    e: ChangeEvent<HTMLInputElement>
  ) {
    setError('')
    setMessage('')

    const file =
      e.target.files?.[0]

    if (!file) {
      return
    }

    if (
      !ALLOWED_IMAGE_TYPES.includes(
        file.type
      )
    ) {
      setError(
        'Please select a JPG, PNG or WEBP image.'
      )

      e.target.value =
        ''

      return
    }

    if (
      file.size >
      MAX_IMAGE_SIZE
    ) {
      setError(
        'Profile image must be smaller than 2 MB.'
      )

      e.target.value =
        ''

      return
    }

    if (previewImage) {
      URL.revokeObjectURL(
        previewImage
      )
    }

    setSelectedFile(
      file
    )

    setPreviewImage(
      URL.createObjectURL(
        file
      )
    )
  }

  async function submit(
    e: FormEvent
  ) {
    e.preventDefault()

    setBusy(true)
    setError('')
    setMessage('')

    try {
      await api(
        '/users/profile',
        {
          method: 'PUT',
          auth: true,

          body:
            JSON.stringify({
              name:
                form.name,

              phone:
                form.phone ||
                undefined,

              dateOfBirth:
                !isOrganizer &&
                form.dateOfBirth
                  ? form.dateOfBirth
                  : undefined,

              college:
                form.college ||
                undefined,

              course:
                form.course ||
                undefined,

              yearOfStudy:
                form.yearOfStudy
                  ? Number(
                      form.yearOfStudy
                    )
                  : undefined,
            }),
        }
      )

      if (
        selectedFile
      ) {
        const imageData =
          await fileToDataUrl(
            selectedFile
          )

        await api(
          '/users/profile/avatar',
          {
            method:
              'POST',

            auth: true,

            body:
              JSON.stringify({
                imageData,
                mimeType:
                  selectedFile.type,
              }),
          }
        )
      }

      const refreshed =
        await refreshUser()

      setCurrentAvatar(
        refreshed?.avatar ||
          currentAvatar
      )

      if (
        previewImage
      ) {
        URL.revokeObjectURL(
          previewImage
        )
      }

      setPreviewImage('')
      setSelectedFile(
        null
      )

      if (
        fileInputRef.current
      ) {
        fileInputRef.current.value =
          ''
      }

      setMessage(
        'Profile updated successfully.'
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to update profile.'
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
            PROFILE
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
          {isOrganizer
            ? 'Organizer'
            : 'User'}{' '}

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
            profile
          </span>
        </h1>

        <p
          className="
            mt-2

            max-w-[650px]

            text-[10px]
            leading-5

            text-white/80

            min-[380px]:text-[11px]

            sm:mt-3
            sm:text-[13px]
            sm:leading-6
          "
        >
          {isOrganizer
            ? 'Manage your organizer identity, contact details and profile photo.'
            : 'Manage your personal details, academic information and profile photo.'}
        </p>
      </section>

      {/* ======================================================
          ERROR / SUCCESS
      ====================================================== */}
      {error && (
        <div className="mb-4">
          <ApiError
            message={error}
          />
        </div>
      )}

      {message && (
        <div
          className="
            mb-4

            rounded-xl

            border
            border-emerald-400/20

            bg-emerald-500/10

            px-3
            py-3

            text-[10px]
            font-semibold

            text-emerald-100

            sm:mb-5
            sm:px-4
            sm:text-xs
          "
        >
          {message}
        </div>
      )}

      {/* ======================================================
          FORM
      ====================================================== */}
      <form
        onSubmit={submit}
        className="
          overflow-hidden

          rounded-2xl

          border
          border-white/[0.08]

          bg-gradient-to-br
          from-[#11152e]
          via-[#0d1129]
          to-[#080c1f]

          shadow-[0_16px_45px_rgba(0,0,0,0.28)]

          sm:rounded-3xl
        "
      >
        {/* ==================================================
            PROFILE HERO
        ================================================== */}
        <section
          className="
            relative
            overflow-hidden

            border-b
            border-white/[0.07]

            bg-gradient-to-r
            from-violet-600/[0.13]
            via-[#10142d]
            to-blue-600/[0.09]

            px-4
            py-6

            min-[380px]:px-5

            sm:px-7
            sm:py-8

            lg:px-8
          "
        >
          <div
            className="
              pointer-events-none
              absolute
              -right-20
              -top-20

              h-64
              w-64

              rounded-full

              bg-violet-500/[0.12]

              blur-3xl
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -bottom-24
              left-10

              h-52
              w-52

              rounded-full

              bg-blue-500/[0.08]

              blur-3xl
            "
          />

          <div
            className="
              relative

              flex
              flex-col
              items-center
              gap-4

              sm:flex-row
              sm:items-center
              sm:gap-6
            "
          >
            {/* AVATAR */}
            <div className="relative shrink-0">
              <div
                className="
                  rounded-full

                  border
                  border-violet-400/20

                  bg-violet-500/10

                  p-1.5

                  shadow-[0_10px_35px_rgba(124,58,237,0.18)]
                "
              >
                <UserAvatar
                  name={
                    form.name ||
                    user?.name
                  }
                  src={
                    shownImage
                  }
                  size="xl"
                  className="
                    border-[3px]
                    border-[#11152e]
                  "
                />
              </div>

              {/* CAMERA BUTTON */}
              <button
                type="button"
                onClick={
                  chooseImage
                }
                aria-label="Change profile photo"
                className="
                  absolute
                  bottom-0
                  right-0

                  grid
                  h-9
                  w-9
                  place-items-center

                  rounded-full

                  border-[3px]
                  border-[#11152e]

                  bg-gradient-to-br
                  from-violet-600
                  to-blue-600

                  text-white

                  shadow-lg

                  transition

                  hover:scale-105

                  sm:h-10
                  sm:w-10
                "
              >
                <Camera
                  size={16}
                />
              </button>

              <input
                ref={
                  fileInputRef
                }
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={
                  handleImageChange
                }
                className="hidden"
              />
            </div>

            {/* PROFILE INFO */}
            <div
              className="
                min-w-0
                text-center

                sm:text-left
              "
            >
              <h2
                className="
                  break-words

                  text-[20px]
                  font-black
                  tracking-tight

                  text-white

                  sm:text-2xl
                "
              >
                {form.name ||
                  user?.name}
              </h2>

              <p
                className="
                  mt-1

                  break-all

                  text-[10px]

                  text-white/70

                  sm:text-xs
                "
              >
                {user?.email}
              </p>

              <button
                type="button"
                onClick={
                  chooseImage
                }
                className="
                  mt-4

                  inline-flex
                  h-9
                  items-center
                  justify-center
                  gap-2

                  rounded-xl

                  border
                  border-violet-400/20

                  bg-violet-500/10

                  px-4

                  text-[9px]
                  font-extrabold

                  text-violet-200

                  transition

                  hover:bg-violet-500/20
                  hover:text-white

                  sm:text-[10px]
                "
              >
                <ImagePlus
                  size={14}
                />

                {shownImage
                  ? 'Change photo'
                  : 'Add photo'}
              </button>

              <p
                className="
                  mt-2

                  text-[8px]

                  text-white/55

                  sm:text-[9px]
                "
              >
                JPG, PNG or WEBP • Maximum 2 MB
              </p>

              {selectedFile && (
                <p
                  className="
                    mt-2
                    max-w-[320px]
                    truncate

                    text-[8px]
                    font-semibold

                    text-violet-200

                    sm:text-[9px]
                  "
                >
                  Selected:{' '}
                  {
                    selectedFile.name
                  }
                </p>
              )}
            </div>
          </div>
        </section>

        {/* ==================================================
            PERSONAL INFORMATION
        ================================================== */}
        <section
          className="
            p-4

            min-[380px]:p-5

            sm:p-7

            lg:p-8
          "
        >
          <div className="mb-5 sm:mb-6">
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
                  h-8
                  w-8
                  place-items-center

                  rounded-lg

                  bg-blue-500/10

                  text-blue-300
                "
              >
                <UserRound
                  size={15}
                />
              </span>

              <h3
                className="
                  text-[15px]
                  font-black

                  text-white

                  sm:text-lg
                "
              >
                Personal information
              </h3>
            </div>

            <p
              className="
                mt-2

                text-[9px]
                leading-5

                text-white/65

                sm:text-[11px]
              "
            >
              {isOrganizer
                ? 'Keep your organizer contact information up to date.'
                : 'Keep your user profile information up to date.'}
            </p>
          </div>

          {/* ==================================================
              FIELDS
          ================================================== */}
          <div
            className="
              grid
              gap-4

              sm:grid-cols-2

              sm:gap-5
            "
          >
            <ProfileField
              label={
                isOrganizer
                  ? 'Organizer name'
                  : 'Full name'
              }
            >
              <input
                required
                value={
                  form.name
                }
                onChange={e =>
                  setForm({
                    ...form,
                    name:
                      e.target
                        .value,
                  })
                }
                className={inputClass}
              />
            </ProfileField>

            <ProfileField label="Phone">
              <input
                value={
                  form.phone
                }
                onChange={e =>
                  setForm({
                    ...form,
                    phone:
                      e.target
                        .value,
                  })
                }
                className={inputClass}
              />
            </ProfileField>

            {!isOrganizer && (
              <>
                <ProfileField label="Date of birth">
                  <input
                    type="date"
                    max={new Date()
                      .toISOString()
                      .slice(
                        0,
                        10
                      )}
                    value={
                      form.dateOfBirth
                    }
                    onChange={e =>
                      setForm({
                        ...form,
                        dateOfBirth:
                          e.target
                            .value,
                      })
                    }
                    className={inputClass}
                  />
                </ProfileField>

                <ProfileField label="College">
                  <input
                    value={
                      form.college
                    }
                    onChange={e =>
                      setForm({
                        ...form,
                        college:
                          e.target
                            .value,
                      })
                    }
                    className={inputClass}
                  />
                </ProfileField>

                <ProfileField label="Course">
                  <input
                    value={
                      form.course
                    }
                    onChange={e =>
                      setForm({
                        ...form,
                        course:
                          e.target
                            .value,
                      })
                    }
                    className={inputClass}
                  />
                </ProfileField>

                <ProfileField label="Year of study">
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={
                      form.yearOfStudy
                    }
                    onChange={e =>
                      setForm({
                        ...form,
                        yearOfStudy:
                          e.target
                            .value,
                      })
                    }
                    className={inputClass}
                  />
                </ProfileField>
              </>
            )}
          </div>

          {/* ==================================================
              SAVE
          ================================================== */}
          <div
            className="
              mt-6

              border-t
              border-white/[0.07]

              pt-5

              sm:mt-7
              sm:flex
              sm:justify-end
              sm:pt-6
            "
          >
            <button
              type="submit"
              disabled={busy}
              className="
                inline-flex
                h-11
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
                disabled:opacity-55

                sm:w-auto
                sm:min-w-[170px]
                sm:text-xs
              "
            >
              <Save size={16} />

              {busy
                ? 'Saving...'
                : 'Save profile'}
            </button>
          </div>
        </section>
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
  border-white/[0.08]

  bg-white/[0.035]

  px-3

  text-[10px]
  font-medium

  text-white

  outline-none

  transition

  placeholder:text-white/35

  focus:border-violet-500/35
  focus:bg-white/[0.055]
  focus:ring-2
  focus:ring-violet-500/10

  sm:h-12
  sm:px-4
  sm:text-xs

  [color-scheme:dark]
`

function ProfileField({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="block min-w-0">
      <span
        className="
          mb-2
          block

          text-[8px]
          font-extrabold
          uppercase
          tracking-[0.08em]

          text-white/70

          sm:text-[9px]
        "
      >
        {label}
      </span>

      {children}
    </label>
  )
}
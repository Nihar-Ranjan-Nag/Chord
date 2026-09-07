import type {
  Book,
  BookBorrow,
  EventItem,
  EventRegistration,
  NotificationItem,
  PointTransaction,
  Redemption,
  Reward,
  User,
} from '@/types'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:4000/api/v1'

const BACKEND_ORIGIN = API_BASE_URL.replace(
  /\/api\/v1\/?$/,
  ''
)

/* ============================================================
   ASSET URL
============================================================ */
function assetUrl(
  value?: string | null
) {
  if (!value) {
    return undefined
  }

  if (
    /^https?:\/\//i.test(value) ||
    value.startsWith('data:')
  ) {
    return value
  }

  return `${BACKEND_ORIGIN}${
    value.startsWith('/')
      ? ''
      : '/'
  }${value}`
}

/* ============================================================
   EVENT STATUS MAP
============================================================ */
const es: Record<
  string,
  EventItem['status']
> = {
  PUBLISHED: 'open',
  DRAFT: 'draft',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
}

/* ============================================================
   USER
============================================================ */
export const mapUser = (
  r: any
): User => ({
  id: String(r.id),

  name:
    r.name ||
    r.fullName ||
    r.full_name ||
    'Student',

  email:
    r.email ||
    '',

  phone:
    r.phone ||
    undefined,

  dateOfBirth:
    r.dateOfBirth ||
    r.date_of_birth ||
    undefined,

  college:
    r.college ||
    undefined,

  course:
    r.course ||
    undefined,

  yearOfStudy:
    r.yearOfStudy ??
    r.year_of_study ??
    undefined,

  year:
    r.yearOfStudy ??
    r.year_of_study
      ? `Year ${
          r.yearOfStudy ??
          r.year_of_study
        }`
      : undefined,

  /* IMPORTANT:
     Backend avatarUrl is mapped to frontend avatar
  */
  avatar: assetUrl(
    r.avatarUrl ??
    r.avatarURL ??
    r.avatar_url ??
    r.profileImage ??
    r.profile_image ??
    null
  ),

  role:
    r.role === 'USER'
      ? 'user'
      : r.role === 'ORGANIZER'
        ? 'organizer'
        : 'admin',

  points: Number(
    r.pointsBalance ??
    r.points_balance ??
    r.points ??
    0
  ),

  active:
    r.status === 'ACTIVE',

  status:
    r.status,

  joinedAt:
    r.createdAt ||
    r.created_at ||
    '',

  registrationsCount:
    r._count?.registrations,

  redemptionsCount:
    r._count?.redemptions,

  eventsCount:
    r._count?.createdEvents,
})

/* ============================================================
   EVENT
============================================================ */
export const mapEvent = (
  r: any
): EventItem => ({
  id: String(r.id),

  slug:
    r.slug,

  title:
    r.title,

  category:
    r.category?.name ||
    'Uncategorized',

  categoryId:
    r.categoryId ||
    r.category?.id,

  description:
    r.description ||
    '',

  shortDescription:
    r.shortDescription ||
    r.description?.slice(0, 150) ||
    '',

  image:
    assetUrl(r.bannerUrl) ||
    '',

  location:
    r.location ||
    (
      r.isOnline
        ? 'Online'
        : 'To be announced'
    ),

  mode:
    r.isOnline
      ? 'Online'
      : 'Offline',

  organizer:
    r.organizer ||
    '',

  meetingUrl:
    r.meetingUrl ||
    undefined,

  startDate:
    r.startAt,

  endDate:
    r.endAt,

  registrationStartsAt:
    r.registrationStartsAt ||
    undefined,

  registrationDeadline:
    r.registrationEndsAt ||
    r.startAt,

  capacity:
    Number(
      r.capacity ||
      0
    ),

  registered:
    Number(
      r._count?.registrations ||
      0
    ),

  participationPoints:
    Number(
      r.participationPoints ||
      0
    ),

  attendancePoints:
    Number(
      r.attendancePoints ||
      0
    ),

  completionPoints:
    Number(
      r.completionPoints ||
      0
    ),

  status:
    es[r.status] ||
    'upcoming',

  terms:
    r.terms ||
    undefined,

  createdById:
    r.createdById,

  createdByName:
    r.createdBy?.name ||
    undefined,
})

/* ============================================================
   EVENT REGISTRATION
============================================================ */
export const mapRegistration = (
  r: any
): EventRegistration => ({
  id:
    String(r.id),

  userId:
    String(r.userId),

  eventId:
    String(r.eventId),

  status:
    String(
      r.status
    ).toLowerCase() as EventRegistration['status'],

  registeredAt:
    r.registeredAt,

  attendedAt:
    r.attendedAt ||
    undefined,

  completedAt:
    r.completedAt ||
    undefined,

  event:
    r.event
      ? mapEvent(r.event)
      : undefined,

  user:
    r.user
      ? mapUser(r.user)
      : undefined,
})

/* ============================================================
   REWARD
============================================================ */
export const mapReward = (
  r: any
): Reward => ({
  id:
    String(r.id),

  slug:
    r.slug,

  name:
    r.name,

  category:
    r.category?.name ||
    'Uncategorized',

  categoryId:
    r.categoryId ||
    r.category?.id,

  image:
    assetUrl(
      r.imageUrl
    ) || '',

  points:
    Number(
      r.pointsCost ||
      0
    ),

  stock:
    Number(
      r.stock ||
      0
    ),

  description:
    r.description ||
    '',

  status:
    r.status,
})

/* ============================================================
   REDEMPTION
============================================================ */
export const mapRedemption = (
  r: any
): Redemption => ({
  id:
    String(r.id),

  userId:
    String(r.userId),

  rewardId:
    String(r.rewardId),

  points:
    Number(
      r.pointsSpent ||
      0
    ),

  status:
    String(
      r.status
    ).toLowerCase() as Redemption['status'],

  requestedAt:
    r.requestedAt,

  reviewedAt:
    r.reviewedAt ||
    undefined,

  deliveredAt:
    r.deliveredAt ||
    undefined,

  rejectionNote:
    r.rejectionNote ||
    undefined,

  deliveryNote:
    r.deliveryNote ||
    undefined,

  user:
    r.user
      ? mapUser(r.user)
      : undefined,

  reward:
    r.reward
      ? mapReward(r.reward)
      : undefined,
})

/* ============================================================
   POINT TRANSACTION
============================================================ */
export const mapPoint = (
  r: any
): PointTransaction => ({
  id:
    String(r.id),

  type:
    String(
      r.type
    ).toLowerCase() as PointTransaction['type'],

  points:
    Number(
      r.points ||
      0
    ),

  description:
    r.description,

  date:
    r.createdAt,

  source:
    String(
      r.sourceType ||
      ''
    ).replaceAll(
      '_',
      ' '
    ),

  balanceAfter:
    Number(
      r.balanceAfter ||
      0
    ),
})

/* ============================================================
   NOTIFICATION
============================================================ */
export function mapNotification(
  r: any
): NotificationItem {
  const text = `${r.title} ${r.message}`.toLowerCase()

  const type: NotificationItem['type'] =
    text.includes('reward') ||
    text.includes('redemption')
      ? 'reward'
      : text.includes('point')
        ? 'points'
        : text.includes('event') ||
            text.includes('attendance')
          ? 'event'
          : 'system'

  return {
    id:
      String(r.id),

    title:
      r.title,

    message:
      r.message,

    date:
      r.createdAt,

    read:
      Boolean(
        r.isRead
      ),

    type,
  }
}

/* ============================================================
   BOOK
============================================================ */
export const mapBook = (
  r: any
): Book => ({
  id:
    String(r.id),

  title:
    r.title,

  author:
    r.author ||
    undefined,

  isbn:
    r.isbn ||
    undefined,

  description:
    r.description ||
    '',

  cover:
    assetUrl(
      r.coverUrl
    ),

  depositAmount:
    Number(
      r.depositAmount ||
      0
    ),

  stock:
    Number(
      r.stock ||
      0
    ),

  status:
    r.status,

  createdById:
    r.createdById,

  ownerName:
    r.createdBy?.name ||
    undefined,

  borrowCount:
    r._count?.borrows,
})

/* ============================================================
   BOOK BORROW
============================================================ */
export const mapBookBorrow = (
  r: any
): BookBorrow => ({
  id:
    String(r.id),

  borrowCode:
    r.borrowCode,

  status:
    String(
      r.status
    ).toLowerCase() as BookBorrow['status'],

  paymentStatus:
    String(
      r.paymentStatus
    ).toLowerCase() as BookBorrow['paymentStatus'],

  paidAmount:
    Number(
      r.paidAmount ||
      0
    ),

  refundAmount:
    Number(
      r.refundAmount ||
      0
    ),

  borrowedAt:
    r.borrowedAt,

  dueAt:
    r.dueAt ||
    undefined,

  returnRequestedAt:
    r.returnRequestedAt ||
    undefined,

  returnedAt:
    r.returnedAt ||
    undefined,

  note:
    r.note ||
    undefined,

  book:
    r.book
      ? mapBook(r.book)
      : undefined,

  user:
    r.user
      ? {
          id:
            String(
              r.user.id
            ),

          name:
            r.user.name,

          email:
            r.user.email,

          phone:
            r.user.phone ||
            undefined,

          avatar:
            assetUrl(
              r.user.avatarUrl ??
              r.user.avatar_url ??
              null
            ),
        }
      : undefined,
})
export type Role = 'user' | 'organizer' | 'admin'
export type EventStatus = 'upcoming' | 'open' | 'completed' | 'cancelled' | 'draft'
export type RegistrationStatus = 'registered' | 'attended' | 'completed' | 'cancelled'
export type RedemptionStatus = 'pending' | 'approved' | 'delivered' | 'rejected' | 'cancelled'
export type BorrowStatus = 'borrowed' | 'return_requested' | 'returned' | 'did_not_return' | 'cancelled'
export type BorrowPaymentStatus = 'paid' | 'refunded' | 'forfeited'

export interface User {
  id:string; name:string; email:string; phone?:string; dateOfBirth?:string; college?:string; course?:string; year?:string;
  yearOfStudy?:number; avatar?:string; role:Role; points:number; active:boolean; status?:string; joinedAt:string;
  registrationsCount?:number; redemptionsCount?:number; eventsCount?:number;
}
export interface EventItem {
  id:string; slug:string; title:string; category:string; categoryId?:number; description:string; shortDescription:string;
  image:string; location:string; mode:'Online'|'Offline'; organizer:string; meetingUrl?:string; startDate:string; endDate:string;
  registrationStartsAt?:string; registrationDeadline:string; capacity:number; registered:number; participationPoints:number;
  attendancePoints:number; completionPoints:number; status:EventStatus; terms?:string; createdById?:number; createdByName?:string;
}
export interface EventRegistration {
  id:string; userId:string; eventId:string; status:RegistrationStatus; registeredAt:string; attendedAt?:string;
  completedAt?:string; event?:EventItem; user?:User;
}
export interface Reward {
  id:string; name:string; slug?:string; category:string; categoryId?:number; image:string; points:number; stock:number;
  description:string; status?:string;
}
export interface Redemption {
  id:string; userId:string; rewardId:string; points:number; status:RedemptionStatus; requestedAt:string; reviewedAt?:string;
  deliveredAt?:string; rejectionNote?:string; deliveryNote?:string; user?:Pick<User,'id'|'name'|'email'|'phone'>; reward?:Reward;
}
export interface PointTransaction {
  id:string; type:'credit'|'debit'; points:number; description:string; date:string; source:string; balanceAfter?:number;
}
export interface NotificationItem {
  id:string; title:string; message:string; date:string; read:boolean; type:'event'|'reward'|'points'|'system';
}
export interface Category { id:number; name:string; slug:string }

export interface Book {
  id:string; title:string; author?:string; isbn?:string; description:string; cover?:string; depositAmount:number; stock:number;
  status:'ACTIVE'|'INACTIVE'; createdById?:number; ownerName?:string; borrowCount?:number;
}
export interface BookBorrow {
  id:string; borrowCode:string; status:BorrowStatus; paymentStatus:BorrowPaymentStatus; paidAmount:number; refundAmount:number;
  borrowedAt:string; dueAt?:string; returnRequestedAt?:string; returnedAt?:string; note?:string; book?:Book; user?:Pick<User,'id'|'name'|'email'|'phone'|'avatar'>;
}

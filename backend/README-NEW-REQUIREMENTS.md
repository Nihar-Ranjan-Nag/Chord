# CampusSpark – USER / ORGANIZER / ADMIN

## Roles
- USER: self-register, events, points, rewards, books and returns.
- ORGANIZER: self-register, manage own events and participants, manage own books and borrow/return workflow.
- ADMIN: global dashboard; edit, suspend, activate and delete users/organizers; manage all events, books, rewards and redemptions.

## Database update
Run `npx prisma migrate deploy` to rename existing ORGANIZATION accounts to ORGANIZER. Existing data is retained.

## Demo admin
`admin@gmail.com / Admin@123` after `npm run seed`.

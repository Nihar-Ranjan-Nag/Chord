# CampusSpark - Separate User and Organizer Registration

## Roles

The project keeps exactly three roles:

- `USER`
- `ORGANIZER`
- `ADMIN`

Admin accounts are not publicly registerable.

## Separate registration pages

### User registration

Frontend route:

`/register`

Fields:

- Full name
- Email
- Date of birth
- Password
- College (optional)

Backend endpoint:

`POST /api/v1/auth/register/user`

### Organizer registration

Frontend route:

`/organizer/register`

Fields:

- Organization name
- Email
- Password

Backend endpoint:

`POST /api/v1/auth/register/organizer`

## Existing functionality preserved

- User event registration and points
- User rewards and redemptions
- User book borrowing and return requests
- Organizer event create/edit/image management
- Organizer event participant management
- Organizer books and borrow/return management
- Admin user management
- Admin organizer management
- Admin suspension/activation/deletion
- Admin event/book/reward/redemption management
- Profile image, event image, book image and reward image uploads
- Forgot/reset password

## Database migration

This update adds `dateOfBirth` to the `User` table.

After copying your existing `.env` into the backend folder, run:

```bash
npm install
npx prisma generate
npx prisma migrate deploy
npm run dev
```

Do not create a new database and do not reset your existing database.

The included migration is:

`prisma/migrations/20260903174500_add_user_date_of_birth/migration.sql`

## Frontend

```bash
npm install
npm run dev
```

Recommended frontend `.env`:

```env
VITE_API_BASE_URL=http://localhost:4000/api/v1
```

## Mobile responsiveness

The public navigation, login, both registration pages, dashboard layouts, forms, tables and management views use responsive Tailwind breakpoints. Large data tables remain horizontally scrollable on narrow screens.

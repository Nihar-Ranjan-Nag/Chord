# Student Rewards Platform — Node.js + MySQL Backend

This backend matches the React frontend for the student event / points / rewards platform.

## Technology

- Node.js
- TypeScript
- Express
- MySQL
- Prisma ORM
- JWT access + refresh tokens
- bcrypt password hashing
- Zod validation
- Helmet
- CORS
- API rate limiting

## Production-style modules

```text
src/
├── config/
├── middleware/
├── modules/
│   ├── auth/
│   ├── dashboard/
│   ├── events/
│   ├── meta/
│   ├── rewards/
│   └── users/
├── routes/
├── services/
├── types/
├── utils/
├── app.ts
└── server.ts

prisma/
├── schema.prisma
└── seed.ts
```

## Database

Create a MySQL database:

```sql
CREATE DATABASE student_rewards
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

Then update `.env`:

```env
DATABASE_URL="mysql://root:password@localhost:3306/student_rewards"
```

## Installation

```bash
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate
npm run seed
npm run dev
```

API starts at:

```text
http://localhost:4000
```

Health endpoint:

```text
GET /health
```

## Demo accounts

Admin:

```text
admin@demo.com
Password@123
```

Student:

```text
student@demo.com
Password@123
```

## Main API routes

### Authentication

```text
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/refresh
POST /api/v1/auth/logout
GET  /api/v1/auth/me
```

### Public / student events

```text
GET  /api/v1/events
GET  /api/v1/events/:slug
GET  /api/v1/events/mine
POST /api/v1/events/:id/register
```

### Student dashboard

```text
GET /api/v1/dashboard/student
```

### Student profile / wallet

```text
GET   /api/v1/users/profile
PUT   /api/v1/users/profile
GET   /api/v1/users/points
GET   /api/v1/users/notifications
PATCH /api/v1/users/notifications/:id/read
GET   /api/v1/users/leaderboard
```

### Rewards

```text
GET  /api/v1/rewards
GET  /api/v1/rewards/mine
POST /api/v1/rewards/:id/redeem
```

### Admin dashboard

```text
GET /api/v1/dashboard/admin
```

### Admin students

```text
GET   /api/v1/admin/students
GET   /api/v1/admin/students/:id
PATCH /api/v1/admin/students/:id/status
POST  /api/v1/admin/students/:id/points
```

### Admin events

```text
GET   /api/v1/admin/events
POST  /api/v1/admin/events
PUT   /api/v1/admin/events/:id
GET   /api/v1/admin/events/:id/participants
PATCH /api/v1/admin/events/:id/participants/:userId/attendance
PATCH /api/v1/admin/events/:id/participants/:userId/complete
```

### Admin rewards / redemptions

```text
GET  /api/v1/admin/rewards
POST /api/v1/admin/rewards
PUT  /api/v1/admin/rewards/:id

GET   /api/v1/admin/redemptions
PATCH /api/v1/admin/redemptions/:id/status
```

## Important business protections already implemented

### Duplicate event registration

Database constraint:

```text
@@unique([userId, eventId])
```

A student cannot register twice for the same event.

### Points ledger

The platform does not rely only on `users.pointsBalance`.

Every credit/debit is recorded in:

```text
PointTransaction
```

with:

- transaction type
- points
- source type
- source reference
- description
- resulting balance
- admin who performed the adjustment

### Duplicate event point protection

Attendance and completion use source references such as:

```text
event:12:attendance
event:12:completion
```

so calling the same endpoint again does not credit points twice.

### Reward redemption transaction

Redeeming a reward runs inside one MySQL transaction:

1. Check student points
2. Check reward stock
3. Debit points
4. Reduce stock
5. Create redemption
6. Create notification

If a step fails, all operations roll back.

### Rejected redemption

When an admin rejects a pending redemption:

1. Points are returned
2. Stock is restored
3. A reversal ledger entry is created
4. Student receives a notification

## Connecting to the React frontend

Use:

```env
VITE_API_BASE_URL=http://localhost:4000/api/v1
VITE_USE_MOCK_AUTH=false
```

The frontend auth service can then use:

```text
/auth/login
/auth/register
/auth/me
```

and send:

```http
Authorization: Bearer <accessToken>
```


## Forgot password / reset password

After pulling this version:

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
```

Use migration name `add_password_reset_tokens` when prompted.

Endpoints:

```text
POST /api/v1/auth/forgot-password
POST /api/v1/auth/reset-password
```

Set SMTP values in `.env` to send real emails. In development, if SMTP is left empty, the reset URL is printed to the backend terminal instead so the flow can be tested locally.

## Forgot/reset password security

Password-reset tokens are random, stored only as SHA-256 hashes, have an expiry, are single-use, and resetting a password revokes active refresh tokens. In development with SMTP unset, the reset URL is printed to the Node.js terminal. In production, configure SMTP before enabling password reset.

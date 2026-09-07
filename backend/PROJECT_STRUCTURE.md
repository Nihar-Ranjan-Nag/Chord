# Backend structure

```text
campusspark-backend/
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
├── src/
│   ├── config/
│   ├── middleware/
│   ├── modules/
│   │   ├── auth/
│   │   ├── books/
│   │   ├── dashboard/
│   │   ├── events/
│   │   ├── meta/
│   │   ├── rewards/
│   │   └── users/
│   ├── routes/
│   ├── services/
│   ├── types/
│   └── utils/
├── uploads/
│   ├── books/
│   ├── events/
│   ├── profiles/
│   └── rewards/
├── package.json
└── .env.example
```

Registration endpoints:

- `POST /api/v1/auth/register/user`
- `POST /api/v1/auth/register/organizer`

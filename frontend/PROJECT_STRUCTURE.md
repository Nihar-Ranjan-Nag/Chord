# Frontend structure

```text
src/
├── app/
├── assets/
├── components/
│   ├── admin/
│   ├── books/
│   ├── cards/
│   ├── common/
│   ├── events/
│   ├── layout/
│   └── ui/
├── features/
│   └── auth/
├── hooks/
├── pages/
│   ├── admin/
│   ├── auth/
│   │   ├── UserRegisterPage.tsx
│   │   ├── OrganizerRegisterPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── ForgotPasswordPage.tsx
│   │   └── ResetPasswordPage.tsx
│   ├── organizer/
│   ├── public/
│   └── user/
├── services/
├── styles/
├── types/
└── utils/
```

User registration and organizer registration are intentionally separate pages.

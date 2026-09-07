# CampusSpark Tailwind Frontend

Complete React + TypeScript + Tailwind CSS v4 replacement frontend for the CampusSpark student events, points and rewards platform.

## Important
This version is Tailwind-first:
- No legacy page CSS system.
- `src/styles/index.css` only contains Tailwind import and tiny global defaults.
- Public/auth/student/admin pages are responsive Tailwind components.
- Business data still comes from the existing Node.js + MySQL backend.
- Forgot Password and Reset Password are included.

## Run
```bash
cp .env.example .env
npm install
npm run dev
```

Backend API:
```env
VITE_API_BASE_URL=http://localhost:4000/api/v1
```

## Hero image
Replace:
```text
src/assets/heroRight.png
```
with your existing image. Keep the same filename.

## Vite
Keep only:
```text
vite.config.ts
```
There is intentionally no `vite.config.js` or `vite.config.d.ts`.

## Mobile
- Public navbar becomes a mobile menu.
- Student/admin sidebar becomes a slide-out drawer.
- Forms collapse to one column.
- Wide tables scroll horizontally instead of breaking layout.

# Frontend (Next.js)

The web app of the Task Management project. See the [root README](../README.md) for the whole project.

## Start

```bash
npm install
cp .env.example .env.local
npm run dev        # http://localhost:3001
```

The API must be running (`php artisan serve` in `backend/`), and `API_URL` in `.env.local` must point to it.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server on port 3001 |
| `npm run build` | Make the production build |
| `npm run start` | Run the production build |
| `npm run lint` | Check the code with ESLint |
| `npm run format` | Format the code with Prettier |
| `npx tsc --noEmit` | Check the types |

## How it works

- The browser never calls Laravel. Only the Next.js **server** does (in Server Components and Server Actions).
- The login token is saved in an `httpOnly` cookie named `tm_token`.
- `API_URL` is a server-only variable. It is never sent to the browser.
- Access is checked in three places: `src/proxy.ts` (is there a cookie?), the layouts (`requireRole`), and Laravel (the real check on every request).

## Where things are

| Path | What it is |
|---|---|
| `src/app/` | Pages, layouts, and the files `loading.tsx`, `error.tsx`, `not-found.tsx` |
| `src/actions/` | Server Actions: login, members, tasks. Each one checks the role first |
| `src/lib/api.ts` | `apiFetch`: the one function that calls Laravel |
| `src/lib/services.ts` | One function for every API call (the service layer) |
| `src/lib/auth.ts`, `session.ts` | Current user, role guards, token cookie |
| `src/lib/validation.ts` | Zod schemas |
| `src/components/` | Reusable parts: `ui/`, `layout/`, `auth/`, `members/`, `tasks/` |
| `src/proxy.ts` | Fast cookie check for `/admin` and `/member` |

## Rules for new code

- Client files (with `'use client'`) must not import `lib/api`, `lib/session`, `lib/auth`, or `lib/services`. They are marked `server-only`.
- Every Server Action starts with a role check (`requireRole` or `requireUser`).
- All API calls go through `src/lib/services.ts`.
- Use the `@/` import alias.
- Run `npm run format`, `npx tsc --noEmit`, and `npm run lint` before each commit.

## Pages

| URL | Who |
|---|---|
| `/login`, `/register` | guest |
| `/admin`, `/admin/members`, `/admin/tasks` (and their add and edit pages) | admin |
| `/member`, `/member/tasks/[id]` | member |

# Task Management App: Architecture Plan

Stack: Laravel 12 (REST API) + Next.js (App Router, TypeScript, Tailwind CSS)
Style: one Git repo (monorepo), one database, simple data ownership, two roles.

---

## 0. Environment status

| Tool | Result | Status |
|---|---|---|
| PHP | 8.2.12 (XAMPP, ZTS build) | OK for Laravel 12 (needs PHP 8.2 or newer; confirm in `composer.json`) |
| Composer | 2.10.3 | OK |
| Laravel | 12.70.0 | OK |
| Git | 2.54.0 | OK |
| Git state | branch `main`, clean, remote `origin` set | OK |
| Node.js / npm | not checked yet | TO CHECK: run `node -v` and `npm -v` |
| PHP extension `pdo_sqlite` | not checked yet | TO CHECK: `php -m \| findstr /i sqlite` |

If Node.js is missing or old, install the LTS version from nodejs.org. Check the Next.js installation docs for the exact minimum version.

---

## 1. Words you will see

- **Role**: a label on a user (`admin` or `member`) that says what they may do.
- **Owner / ownership**: each member and task belongs to one admin. That admin is the owner.
- **Policy**: a PHP class that answers "may this user do this action on this row?"
- **Middleware**: code that runs before a controller. It can stop the request early.
- **Query scope**: a reusable `where` condition, for example "only rows of this admin".
- **Token**: a long secret string. The frontend sends it with every request to prove who the user is.
- **Migration**: a PHP file that creates or changes database tables.
- **Seeder / Factory**: code that fills the database with fake test data.
- **Form Request**: a class that validates the input of one request.
- **API Resource**: a class that decides which fields go into the JSON output.
- **Enum**: a fixed list of allowed values, for example `admin` and `member`.
- **Mass assignment**: filling a model from many request fields at once. It is dangerous if the client can send fields like `role`.
- **CORS**: a browser rule that says which website may call your API.
- **Monorepo**: one Git repository that holds more than one app.

---

## 2. Assumptions and simple choices

1. Only an admin can create members. A member cannot register. A new admin can only come from the register page.
2. The admin sets the member's first password. There is no email sending and no password reset in this version.
3. Email is unique in the whole system, so login is simple.
4. Members live in the same `users` table as admins. The `role` column tells them apart.
5. Each task is assigned to exactly one member.
6. When an admin deletes a member, that member's tasks are deleted too (database cascade). This is the simplest rule.
7. No soft deletes. Deleting is permanent. This keeps the code small.
8. Error codes:
   - Not logged in: **401**.
   - Logged in with the wrong role: **403**.
   - Row owned by another admin: **404** (we do not leak that it exists).
   - Task assigned to a different member, asked by a member: **404**.
9. An admin edits all task fields. A member can change only `status`.
10. **Token auth, not cookie auth.** Sanctum has two modes. Cookie mode needs the frontend and API on the same main domain. Token mode works on any domains, so deployment is easier (Vercel plus another host).
11. **Token storage trade-off.** The frontend keeps the token in `localStorage`. This is simple, but weaker against XSS attacks than an httpOnly cookie. We use a short token life (8 hours). We can improve this later.
12. **Database.** SQLite for local work and tests (one file, no server, easy to move to a new laptop). MySQL or PostgreSQL in production. Eloquent hides most differences, and we will run the tests on the production database type before release.
13. **Tests.** PHPUnit, because it is already installed. No extra package.
14. Sanctum is installed with `php artisan install:api`. Confirm this command in the current Laravel docs when we reach that phase.

---

## 3. Folder structure

```
TaskManagement-lrvl/
├── .gitignore            (root, small)
├── README.md             (setup, run, test, deploy, "Set up on a new laptop")
├── docs/
│   └── ARCHITECTURE.md   (this file)
├── backend/              (Laravel API)
│   ├── app/
│   │   ├── Enums/              Role.php, TaskStatus.php
│   │   ├── Http/
│   │   │   ├── Controllers/    AuthController, DashboardController,
│   │   │   │                   MemberController, TaskController,
│   │   │   │                   MemberTaskController
│   │   │   ├── Middleware/     EnsureRole.php
│   │   │   ├── Requests/       RegisterRequest, LoginRequest,
│   │   │   │                   StoreMemberRequest, UpdateMemberRequest,
│   │   │   │                   StoreTaskRequest, UpdateTaskRequest,
│   │   │   │                   UpdateTaskStatusRequest
│   │   │   └── Resources/      UserResource, TaskResource
│   │   ├── Models/             User.php, Task.php
│   │   └── Policies/           UserPolicy.php, TaskPolicy.php
│   ├── database/
│   │   ├── factories/          UserFactory, TaskFactory
│   │   ├── migrations/
│   │   └── seeders/            DatabaseSeeder.php
│   ├── routes/api.php
│   ├── tests/Feature/          AuthTest, MemberOwnershipTest,
│   │                           TaskOwnershipTest, RoleAccessTest
│   └── .env.example
└── frontend/             (Next.js)
    ├── src/
    │   ├── app/
    │   │   ├── layout.tsx, page.tsx (redirect by role)
    │   │   ├── login/page.tsx, register/page.tsx
    │   │   ├── admin/    layout.tsx (admin guard), dashboard/,
    │   │   │             members/ (list, new, [id]/edit),
    │   │   │             tasks/  (list, new, [id]/edit)
    │   │   └── member/   layout.tsx (member guard), tasks/, profile/
    │   ├── components/   ui/ (Button, Input, Select, Spinner,
    │   │                 EmptyState, ErrorMessage, Pagination, StatusBadge),
    │   │                 layout/ (Navbar), RoleGuard.tsx,
    │   │                 members/ (MemberForm, MemberTable),
    │   │                 tasks/ (TaskForm, TaskTable, TaskStatusSelect)
    │   ├── context/      AuthContext.tsx
    │   ├── services/     auth.ts, members.ts, tasks.ts
    │   ├── lib/          api.ts (one fetch wrapper), schemas.ts (Zod)
    │   └── types/        index.ts
    └── .env.example
```

---

## 4. Database design (ERD in text)

```
users
-----
id            PK
name          string
email         string, UNIQUE
password      string (hashed)
role          string: 'admin' | 'member'
admin_id      FK -> users.id, NULLABLE, ON DELETE CASCADE
              (NULL for admins. For members: the owner admin.)
created_at, updated_at
indexes: email (unique), admin_id

tasks
-----
id            PK
admin_id      FK -> users.id, ON DELETE CASCADE   (the owner admin)
assigned_to   FK -> users.id, ON DELETE CASCADE   (a member)
title         string
description   text, nullable
status        string: 'todo' | 'in_progress' | 'done', default 'todo'
due_date      date, nullable
created_at, updated_at
indexes: (admin_id, status), (assigned_to, status)

personal_access_tokens   (created by Sanctum, we do not edit it)
```

Relationships:

- An admin has many members (`users.admin_id`). A member belongs to one admin.
- An admin has many tasks (`tasks.admin_id`).
- A member has many tasks (`tasks.assigned_to`). A task belongs to one admin and one assignee.

---

## 5. Data ownership design (why `admin_id` is enough)

- Every member row and every task row points to exactly one owner admin.
- A helper on the User model gives the owner id: for an admin it is `id`, for a member it is `admin_id`.
- **Layer 1: query scope.** Every admin query starts with "only rows where `admin_id` = my id". We find rows with `findOrFail` on the scoped query, not with plain route-model binding. If the row belongs to another admin, the database does not return it, so Laravel answers **404**. The client cannot tell that the row exists.
- **Layer 2: policy.** Before view, update, or delete, the policy checks the role and the owner again. If someone forgets a scope in the future, the policy still protects the data.
- **Never trust the client.** `role` and `admin_id` are never in `$fillable`. We set them in code from the logged-in user. When an admin creates a task, `assigned_to` must be a member of the same admin. The Form Request checks this with a scoped `exists` rule.
- **Why `admin_id` is also on tasks:** filters are faster and simpler, and a mistake in one join cannot leak data.

This is enough because every row has one clear owner and every query is limited by it. We do not need separate databases or extra tables.

---

## 6. RBAC design and permission table

- A `role` column that uses a PHP backed enum (`Role::Admin`, `Role::Member`).
- Route middleware `role:admin` or `role:member` blocks the wrong role with 403.
- Policies check each row (ownership, assignment).
- No Spatie package: two fixed roles do not need it.

| Action | Guest | Member | Admin |
|---|---|---|---|
| Register (as admin) | Yes | No | No |
| Log in | Yes | Yes | Yes |
| Read own profile | No | Yes | Yes |
| Create / read / update / delete members | No | No | Own members only |
| Create / read / update / delete tasks | No | No | Tasks of own members only |
| Assign a task to a member | No | No | Own members only |
| Read tasks | No | Only tasks assigned to them | Own tasks only |
| Update task status | No | Own tasks only | Own tasks (through the full update) |
| See dashboard | No | No | Own data only |

Everything not in the table is forbidden (HTTP 403).

---

## 7. API endpoint list

All URLs start with `/api`. Lists use pagination (`?page=1`, 10 items per page).

| Method | URL | Allowed | Success | Purpose |
|---|---|---|---|---|
| POST | /register | Guest | 201 | Create an admin, return token |
| POST | /login | Guest (rate limited) | 200 | Return token and user |
| POST | /logout | Logged in | 204 | Delete the current token |
| GET | /me | Logged in | 200 | Own profile and role |
| GET | /admin/dashboard | Admin | 200 | Counts of own members and tasks by status |
| GET | /members | Admin | 200 | List own members |
| POST | /members | Admin | 201 | Create a member |
| GET | /members/{id} | Admin | 200 | Show own member |
| PUT | /members/{id} | Admin | 200 | Update own member |
| DELETE | /members/{id} | Admin | 204 | Delete own member |
| GET | /tasks | Admin | 200 | List own tasks (filter by status or member) |
| POST | /tasks | Admin | 201 | Create and assign a task |
| GET | /tasks/{id} | Admin | 200 | Show own task |
| PUT | /tasks/{id} | Admin | 200 | Update own task |
| DELETE | /tasks/{id} | Admin | 204 | Delete own task |
| GET | /my/tasks | Member | 200 | List tasks assigned to me |
| PATCH | /my/tasks/{id}/status | Member | 200 | Change status of my task |

Error codes: 401 not logged in, 403 wrong role, 404 not found or not yours, 422 bad input, 429 too many login tries.

Error body: `{ "message": "...", "errors": { "field": ["..."] } }`

---

## 8. Auth flow

1. **Admin register:** the frontend sends name, email, and password to `/register`. The server forces `role = admin`, saves the user, creates a token, and returns `{ token, user }`.
2. **Login (admin or member):** the frontend sends email and password to `/login`. The server checks the hash, creates a token (valid 8 hours), and returns `{ token, user }`.
3. The frontend saves the token and sends `Authorization: Bearer <token>` on every request.
4. On page load the frontend calls `/me`. If it fails with 401, it clears the token and goes to `/login`.
5. **Redirect by role:** admin goes to `/admin/dashboard`. Member goes to `/member/tasks`.
6. **Logout:** call `/logout`, delete the token, go to `/login`.

---

## 9. Frontend pages and route protection

| Page | Who |
|---|---|
| /login, /register | Guest (a logged-in user is redirected to their home) |
| /admin/dashboard | Admin |
| /admin/members, /admin/members/new, /admin/members/[id]/edit | Admin |
| /admin/tasks, /admin/tasks/new, /admin/tasks/[id]/edit | Admin |
| /member/tasks | Member (list, change status) |
| /member/profile | Member |

- A `RoleGuard` component wraps `admin/layout.tsx` and `member/layout.tsx`.
  - While loading, it shows a spinner.
  - With no user, it redirects to `/login`.
  - With the wrong role, it redirects to the user's own home.
- Buttons that a role cannot use are hidden. The backend is still the real security.
- Every list page handles three states: loading, error, and empty.
- Forms use Zod for validation.
- All API calls go through `services/` and one `lib/api.ts` wrapper. The base URL comes from `NEXT_PUBLIC_API_URL`.

---

## 10. Packages and the reason for each

| Package | Where | Reason |
|---|---|---|
| Laravel Sanctum | backend | Token auth for a separate frontend |
| zod | frontend | Form validation |
| prettier | frontend | Code formatting |
| PHPUnit, Tailwind, TypeScript, ESLint | already included | No extra install |

Not used: Spatie permission package, any multi-tenancy package, any UI library.

---

## 11. Deployment plan (overview)

Prices and free limits change often. We will check the official docs when we reach the deployment phase. Do not trust any number before that.

| Part | Options to compare |
|---|---|
| Next.js | Vercel (the simplest choice; check the free plan rules) |
| Laravel API | Cheap shared PHP hosting with SSH, a free container host (more steps, may sleep when idle), a small VPS (more work) |
| Database | MySQL from the host, or a free managed MySQL/PostgreSQL (check limits) |

Early recommendation: **Vercel + one cheap PHP host that gives MySQL**. It has the fewest moving parts for one week of work. The final choice comes after we check the facts.

Deploy steps (detail later):

1. Set production env vars: `APP_ENV=production`, `APP_DEBUG=false`, `APP_KEY`, `APP_URL`, `DB_*`, `FRONTEND_URL`.
2. Run `php artisan migrate --force`.
3. Cache config and routes.
4. Set CORS to the frontend URL only.
5. Set `NEXT_PUBLIC_API_URL` in Vercel.
6. Run the final test checklist.

---

## 12. Day-by-day schedule

| Day | Work | Phases |
|---|---|---|
| 1 | Environment check, monorepo fix, Laravel and Sanctum setup | 0, 1, 2 |
| 2 | Enums, migrations, models, factories, seeders, auth API, role middleware | 3, 4 |
| 3 | Members API (scope, policy, request, resource) and tasks API | 5, 6 |
| 4 | Member task endpoints, dashboard, rate limit, CORS, feature tests | 6, 7 |
| 5 | Next.js setup, auth, service layer, route guards, admin pages | 8, 9 |
| 6 | Member pages, loading, error and empty states, polish | 10 |
| 7 | Deployment, README, final test checklist (also a buffer day) | 11, 12 |

---

## 13. Monorepo fix plan

Right now Laravel is in the root folder. We want it in `backend/`.

Key ideas:

- Git tracks files, not folders. `git mv` moves tracked files and records a rename, so history stays. Use `git log --follow <file>` later to see the old history.
- Do the moves in **one commit that has only moves**, with no edits. Git then detects the renames well.
- `.git` stays in the root.

Plan:

1. Confirm the Git state is clean. Create the branch `chore/monorepo-structure`.
2. Create the `backend` folder.
3. Use `git mv` for every tracked file and folder (from `git ls-files`): `app`, `bootstrap`, `config`, `database`, `public`, `resources`, `routes`, `storage`, `tests`, `artisan`, `composer.json`, `composer.lock`, `package.json`, `vite.config.js`, `phpunit.xml`, `.editorconfig`, `.gitattributes`, `.gitignore`, `.env.example`. The Laravel `README.md` is replaced by our own root README, so we remove it with `git rm`.
4. Ignored files:
   - `vendor/`: not tracked, so `git mv` cannot move it. Delete it, then run `composer install` inside `backend/`.
   - `.env`: not tracked. Move it with the normal `move` command to `backend\.env`. Never commit it.
   - `node_modules/`: if it exists in the root, delete it. The API does not need it.
   - Ignored files inside tracked folders (such as `storage/logs`) move with their folder.
5. Commit: `chore: move laravel app into backend folder`.
6. Create `frontend/` with `create-next-app` (TypeScript, Tailwind, ESLint, App Router, npm). Make sure it does not create its own `.git` folder.
7. Add the root `.gitignore` (small) and the root `README.md` with the section "Set up on a new laptop". Commit them.
8. Test that `php artisan serve` works from `backend/`, then push the branch and merge to `main`.

---

## 14. Engineering rules for the whole project

Backend:

- PSR-12 and Laravel conventions. Thin controllers, Form Requests, API Resources, Policies.
- Migrations, factories, and seeders (2 admins, each with members and tasks).
- Two ownership layers (scope and policy). Roles with middleware and policies.
- Feature tests: admin A cannot read, update, or delete admin B's members or tasks. A member cannot open admin endpoints. A member cannot see another member's tasks. A member can change only the status of their own tasks.
- Pagination, login rate limit, CORS limited to the frontend URL.
- Security: hashed passwords, secrets only in `.env`, `APP_DEBUG=false` in production, no mass assignment of `role` or `admin_id`.

Frontend:

- TypeScript strict mode, ESLint, Prettier, small components, one service layer.
- Role-based redirects and guards. Loading, error, and empty states. Zod forms. Responsive and accessible UI.
- No hard-coded URLs: use `NEXT_PUBLIC_API_URL`.

Git:

- Feature branches, small commits, Conventional Commits (`feat:`, `fix:`, `chore:`).
- Merge to `main` only when the phase works.
- `.env.example` in both apps and a clear README.

# Task Management

A simple task management app for teams, with two roles: **admin** and **member**.

An admin manages their **own** team (members and tasks). A member sees only the tasks given to them and can change the status. **One admin can never see or change another admin's data.**

> Live demo: _will be added after deployment._

## Features

- Admins register and log in.
- Admin dashboard with the number of members and tasks (to do, in progress, done).
- Admin manages members: add, edit, delete.
- Admin manages tasks: add, edit, give to a member, delete, filter by status and by member.
- Members log in (the admin creates their account), see only their own tasks, and change the status.
- Loading screens, friendly error pages, 404 pages, and a menu that works on small screens.

## Who can do what

| Action | Guest | Member | Admin |
|---|---|---|---|
| Register (as admin) and log in | Yes | Log in only | Log in only |
| See the dashboard | No | No | Yes (own data) |
| Add, edit, delete members | No | No | Yes (own members only) |
| Add, edit, delete tasks | No | No | Yes (own tasks only) |
| See tasks | No | Only tasks given to them | All tasks of own members |
| Change the status of a task | No | Own tasks only | Own tasks |
| See another admin's data | No | No | No (answer: 404) |

## Technology

| Part | Technology |
|---|---|
| Backend (API) | Laravel 12, Laravel Sanctum (tokens), PHPUnit |
| Database | SQLite for development. MySQL or PostgreSQL on a live server |
| Frontend | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Zod |
| Code style | Laravel Pint (PHP), ESLint and Prettier (frontend) |

## How it works

```
Browser ──► Next.js server (port 3001) ──► Laravel API (port 8000) ──► Database
            keeps the login token in
            an httpOnly cookie
```

- **The browser never talks to Laravel.** Only the Next.js server does. The login token is saved in an `httpOnly` cookie, so JavaScript in the browser cannot read it.
- **Data ownership, not multi-tenancy.** One database. Every member and every task has an `admin_id`. Every query is limited to the logged-in user's data.
- **Three layers on the API:** role middleware (wrong role: 403), ownership scopes (not yours: 404), and policies (action not allowed: 403 or 404).
- **The server decides `role` and `admin_id`.** They are never taken from a request.
- **Laravel is the real security.** The frontend hides buttons and redirects, but every request is checked again by Laravel.

## Project structure

```
backend/     Laravel API
  app/Enums, Models, Policies, Http/ (Controllers, Requests, Resources, Middleware)
  database/  migrations, factories, seeders
  routes/api.php
  tests/Feature/
frontend/    Next.js app (code is in src/)
  src/app/        pages, layouts, loading/error/not-found files
  src/actions/    Server Actions
  src/lib/        api wrapper, services, auth, validation
  src/components/ reusable parts
docs/        documentation of every phase (start with docs/index.md)
```

## Quick start

**You need:** Git, PHP 8.2 or newer (see `backend/composer.json`), Composer, and Node.js 20.9 or newer.

```bash
# 1) Get the code
git clone <your-repo-url> TaskManagement
cd TaskManagement

# 2) Backend (Terminal 1)
cd backend
composer install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate --seed
php artisan serve              # http://127.0.0.1:8000

# 3) Frontend (Terminal 2)
cd frontend
npm install
cp .env.example .env.local
npm run dev                    # http://localhost:3001
```

Open http://localhost:3001 and log in with a demo account.

### Demo accounts

The password of every account is `password`.

| Role | Email | Belongs to |
|---|---|---|
| Admin | alice@example.com | |
| Member | ben@example.com, carla@example.com, dev@example.com | Alice |
| Admin | brian@example.com | |
| Member | emma@example.com, farid@example.com | Brian |

The demo data is created by `php artisan migrate:fresh --seed`. The seeder does nothing when `APP_ENV=production`.

## Set up on a new laptop (Windows, no Docker, no XAMPP)

1. **Git** from git-scm.com (it also gives you Git Bash).
2. **PHP:** download the "Non Thread Safe" x64 ZIP from windows.php.net/download and unzip it to `C:\php`.
   - Copy `php.ini-development` to `php.ini`.
   - In `php.ini`, remove the `;` in front of these lines: `extension_dir = "ext"`, `extension=curl`, `extension=fileinfo`, `extension=intl`, `extension=mbstring`, `extension=openssl`, `extension=pdo_sqlite`, `extension=sqlite3`, `extension=zip`.
   - Add `C:\php` to your user PATH. Open a new terminal and run `php -v`.
3. **Composer** from getcomposer.org (choose `C:\php\php.exe` when it asks).
4. **Node.js** (LTS) from nodejs.org.
5. Clone the project in a plain folder (not in OneDrive) and follow the **Quick start** above.

PHP, Composer, and Node only add a few folders to your PATH. They do not touch other tools like Java or Python.

## Useful commands

| Where | Command | What it does |
|---|---|---|
| `backend/` | `php artisan serve` | Start the API |
| `backend/` | `php artisan migrate:fresh --seed` | Reset the database with demo data (development only!) |
| `backend/` | `php artisan test` | Run all backend tests |
| `backend/` | `./vendor/bin/pint` | Fix the PHP code style |
| `backend/` | `php artisan route:list --path=api/v1` | Show all API routes |
| `frontend/` | `npm run dev` | Start the frontend on port 3001 |
| `frontend/` | `npm run format` | Format the code |
| `frontend/` | `npx tsc --noEmit` | Check the types |
| `frontend/` | `npm run lint` | Check the code with ESLint |
| `frontend/` | `npm run build` | Make the production build |

Before each commit, run Pint and the tests in `backend/`, and format, types, and lint in `frontend/`.

## Environment variables

**Backend** (`backend/.env`, from `backend/.env.example`)

| Name | Local value | On a live server |
|---|---|---|
| `APP_ENV` | `local` | `production` |
| `APP_DEBUG` | `true` | **`false`** |
| `APP_KEY` | made by `php artisan key:generate` | a new secret key |
| `APP_URL` | `http://127.0.0.1:8000` | the public HTTPS address of the API |
| `DB_CONNECTION` | `sqlite` | `mysql` or `pgsql`, with the `DB_*` values |

**Frontend** (`frontend/.env.local`, from `frontend/.env.example`)

| Name | Local value | On a live server |
|---|---|---|
| `API_URL` | `http://127.0.0.1:8000` | the public HTTPS address of the API |

`API_URL` is used only on the server and is never sent to the browser. Never commit `.env` or `.env.local`.

## Tests

The backend has **77 automatic tests**: login and tokens, roles, members, tasks, the dashboard, the demo data, and a full **isolation test** where two admins try to reach each other's data and fail.

```bash
cd backend
php artisan test
```

## Documentation

Each phase of the project has a document in [`docs/`](docs/index.md): what was built, why, how to test it, and common errors.

## Deployment

See the deployment document in `docs/` (added in the last phase).

## Troubleshooting

| Problem | Fix |
|---|---|
| `could not find driver` | Enable `pdo_sqlite` and `sqlite3` in `php.ini` |
| `The "database" does not exist` | Run `touch database/database.sqlite` in `backend/` |
| Frontend shows "Cannot reach the server" | Start the API (`php artisan serve`) and check `API_URL` in `frontend/.env.local` |
| `API_URL is not set` | Create `frontend/.env.local` and restart `npm run dev` |
| Port 8000 or 3001 is busy | Stop the other program, or use another port |
| Demo login does not work | Run `php artisan migrate:fresh --seed` in `backend/` |
| "Too Many Attempts." | Login allows 5 tries per minute. Wait one minute |

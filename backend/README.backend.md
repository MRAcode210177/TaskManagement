# Backend (Laravel API)

The REST API of the Task Management app. See the [root README](../README.md) for the whole project.

## Start

```bash
composer install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate --seed
php artisan serve        # http://127.0.0.1:8000
```

Demo accounts are listed in the root README (the password is `password`).

## Tests and code style

```bash
php artisan test
./vendor/bin/pint
```

## Important rules

- All routes are under `/api/v1`. Always send the header `Accept: application/json`.
- Login gives a Sanctum token. Send it as `Authorization: Bearer <token>`. Tokens last 7 days.
- Roles are `admin` and `member` (the enum `App\Enums\Role`).
- Every member and every task has an `admin_id`. Queries start from a scope: `User::membersOf($admin)` or `Task::visibleTo($user)`.
- Another admin's data gives **404**. A wrong role gives **403**.
- `role` and `admin_id` are set by the server. They are not mass assignable.

## Where things are

| Path | What it is |
|---|---|
| `app/Enums/` | `Role`, `TaskStatus` |
| `app/Models/` | `User`, `Task` (with the ownership scopes) |
| `app/Policies/` | `UserPolicy` (members), `TaskPolicy` |
| `app/Http/Controllers/Api/V1/` | `AuthController`, `MemberController`, `TaskController`, `DashboardController` |
| `app/Http/Requests/` | Input checks (Form Requests) |
| `app/Http/Resources/` | JSON output (`UserResource`, `TaskResource`) |
| `app/Http/Middleware/EnsureRole.php` | The `role:admin` middleware |
| `routes/api.php` | All API routes |
| `database/seeders/DatabaseSeeder.php` | Demo data (skipped in production) |
| `tests/Feature/` | Auth, roles, members, tasks, dashboard, ownership, isolation, seeder |

## API

| Method | URL | Who |
|---|---|---|
| POST | `/auth/register`, `/auth/login` | guest |
| POST | `/auth/logout` | logged in |
| GET | `/auth/me` | logged in |
| GET, POST | `/members` | admin |
| GET, PUT, DELETE | `/members/{id}` | admin |
| GET | `/tasks`, `/tasks/{id}` | admin, member |
| POST | `/tasks` | admin |
| PUT, DELETE | `/tasks/{id}` | admin |
| PATCH | `/tasks/{id}/status` | admin, assigned member |
| GET | `/dashboard` | admin |

Details for each endpoint are in the phase documents in [`../docs/`](../docs/index.md).

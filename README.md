# Task Management App

A simple task manager with two roles: `admin` and `member`.

- Backend: Laravel 12 (REST API, Sanctum tokens), folder `backend/`
- Frontend: Next.js (App Router, TypeScript, Tailwind CSS), folder `frontend/`
- Architecture plan: see `docs/ARCHITECTURE.md`

## Requirements

- PHP 8.2 or newer (XAMPP is fine)
- Composer 2
- Node.js LTS and npm
- Git

## Run the backend

```
cd backend
composer install
copy .env.example .env
php artisan key:generate
php artisan serve
```

The API runs at http://127.0.0.1:8000

## Run the frontend

```
cd frontend
npm install
npm run dev
```

The app runs at http://localhost:3000

## Run the tests

```
cd backend
php artisan test
```

## Deploy

To be added in the deployment phase.

## Set up on a new laptop

1. Install Git, PHP 8.2 or newer (XAMPP), Composer, and Node.js LTS.
2. Check PHP: `php -v`. Check that `pdo_sqlite` is on: `php -m | findstr sqlite`.
3. Clone the repository:
```
   git clone https://github.com/MRAcode210177/TaskManagement.git
   cd TaskManagement
```
4. Set up the backend:
```
   cd backend
   composer install
   copy .env.example .env
   php artisan key:generate
   type nul > database\database.sqlite
   php artisan migrate
```
5. Set up the frontend. The `.env.example` file for the frontend is added in a later phase.
```
   cd ..\frontend
   npm install
```
6. Start both apps as shown above.

Never copy `.env` files through Git. Create them again from `.env.example` on each computer.
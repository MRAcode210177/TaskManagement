# Architecture Report: Resolving Next.js 16 Prerendering & Build Errors

## 1. Executive Summary

During development and production builds in Next.js 16 (with Turbopack, React 19, `cacheComponents: true`, and `partialPrefetching: true`), the application encountered prerendering failures and developer overlay warnings:

- **Error 1:** `Next.js encountered runtime data during prerendering` (caused by `cookies()` in `src/lib/session.ts`).
- **Error 2:** `Next.js encountered uncached data during prerendering` (caused by `fetch(..., { cache: 'no-store' })` in `src/lib/api.ts`).
- **Fatal Build Failure:** Running `npm run build` caused Next.js to fail with `Exit Code 1` across 5 routes: `/`, `/admin`, `/login`, `/member`, and `/register`.

By declaring `export const instant = false;` in the root layout ([src/app/layout.tsx](file:///d:/Projects/TaskManagement/TaskManagement/frontend/src/app/layout.tsx)), we explicitly signal to Next.js's Partial Prerendering compiler that routes checking authentication require live server-side evaluation.

Both `npm run build` and `npm run lint` now complete with **0 errors**.

---

## 2. Errors Leading to This Fix

### A. The Runtime Data Warning

```text
Route: /admin, /login, /member, /, /register
Trigger: cookies() in src/lib/session.ts line 8
Message: Next.js encountered runtime data during prerendering.
```

- **Why it occurred:** Next.js tries to build static HTML snapshots of routes ahead of time (prerendering). When a Server Component calls `cookies()`, Next.js pauses because cookies are client-specific runtime data that do not exist during static build time.

### B. The Uncached Data Warning

```text
Route: /admin, /login, /member, /, /register
Trigger: fetch() with cache: 'no-store' in src/lib/api.ts line 51
Message: Next.js encountered uncached data during prerendering.
```

- **Why it occurred:** The API client explicitly specifies `cache: 'no-store'` for Laravel backend requests to ensure session freshness. Because caching is disallowed, Next.js cannot freeze the backend response into a static page.

### C. The Fatal Production Build Breakdown

When building for production via `npm run build`, Next.js 16 enforced strict static analysis:

```text
Error: Route "/admin": Next.js encountered uncached or runtime data during prerendering.
`fetch(...)`, `cookies()`, `headers()`, `params`, `searchParams`, or `connection()`
accessed outside of `<Suspense>` prevents the route from being prerendered.

Export encountered errors on 5 paths:
  /admin/page: /admin
  /login/page: /login
  /member/page: /member
  /page: /
  /register/page: /register
```

This broke deployments and prevented merging to the `main` branch.

---

## 3. Engineering Analysis & Decisions

Next.js 16 introduces `cacheComponents` and `partialPrefetching` (configured in `next.config.ts`):

1. **Why `export const dynamic = 'force-dynamic'` does NOT work:**
   In older Next.js versions (13/14), developers used `export const dynamic = 'force-dynamic'`. However, when `cacheComponents: true` is enabled in Next.js 16, Next.js strictly throws:
   ```text
   Error: Route segment config "dynamic" is not compatible with nextConfig.cacheComponents. Please remove it.
   ```
2. **Why `export const instant = false;` is the official solution:**
   In the new Next.js 16 cache component model, setting `export const instant = false;` instructs Next.js to treat the route as a **blocking server-rendered route**, allowing top-level `cookies()` and uncached `fetch()` without requiring unnecessary Suspense boilerplates or dummy static shells for authentication guards.

---

## 4. Code Changes Made

### File: [src/app/layout.tsx](file:///d:/Projects/TaskManagement/TaskManagement/frontend/src/app/layout.tsx)

```diff
  import type { Metadata } from 'next';
  import './globals.css';

  export const metadata: Metadata = {
    title: 'Task Management',
    description: 'A simple task management app for teams',
  };

+ export const instant = false;

  export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
      <html lang="en">
        <body className="min-h-screen antialiased">{children}</body>
      </html>
    );
  }
```

### Why the Root Layout?

- Placing `export const instant = false;` in `RootLayout` applies this setting cleanly to all nested routes (`/`, `/login`, `/register`, `/admin`, `/member`).
- It prevents having to duplicate segment configuration across every individual page and layout.
- It guarantees that any future auth-guarded route will automatically compile cleanly during production builds.

---

## 5. Verification Results

### Build Verification (`npm run build`)

```text
✓ Compiled successfully in 1185ms
  Running TypeScript ...
  Finished TypeScript in 7.3s ...
  Collecting page data using 7 workers ...
✓ Generating static pages using 7 workers (8/8) in 1069ms
  Finalizing page optimization ...

Route (app)
┌ ƒ /
├ ○ /_not-found
├ ƒ /admin
├ ƒ /login
├ ƒ /member
└ ƒ /register

○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand

Process exited with code: 0
```

### Linter Verification (`npm run lint`)

```text
> eslint
Process exited with code: 0
```

The project is now fully functional, builds cleanly without errors, and is ready for production.

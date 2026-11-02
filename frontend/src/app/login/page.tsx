import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { LoginForm } from '@/components/auth/LoginForm';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { getCurrentUser, homePathFor } from '@/lib/auth';

export const metadata: Metadata = { title: 'Sign In | TaskPilot' };

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect(homePathFor(user.role));

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center p-4">
      {/* Top right theme toggle */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/30">
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            Welcome to TaskPilot
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
            Sign in to access your team workspace, sprints, and tasks
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-800/90 dark:bg-slate-900/80">
          <LoginForm />
        </div>

        {/* Footer info */}
        <div className="text-center space-y-2 text-xs text-slate-500 dark:text-slate-400">
          <p>
            New organization admin?{' '}
            <Link
              href="/register"
              className="font-semibold text-blue-600 hover:underline dark:text-blue-400"
            >
              Create an account
            </Link>
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            Members are invited directly by their workspace administrator.
          </p>
        </div>
      </div>
    </div>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { LoginForm } from '@/components/auth/LoginForm';
import { getCurrentUser, homePathFor } from '@/lib/auth';

export const metadata: Metadata = { title: 'Sign in | Task Management' };

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect(homePathFor(user.role));

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4">
      <h1 className="mb-6 text-2xl font-semibold">Sign in</h1>
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <LoginForm />
      </div>
      <p className="mt-4 text-sm text-gray-600">
        New admin?{' '}
        <Link href="/register" className="text-blue-600 underline">
          Create an account
        </Link>
        . Members cannot register: your admin creates your account.
      </p>
    </main>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { getCurrentUser, homePathFor } from '@/lib/auth';

export const metadata: Metadata = { title: 'Create admin account | Task Management' };

export default async function RegisterPage() {
  const user = await getCurrentUser();
  if (user) redirect(homePathFor(user.role));

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4">
      <h1 className="mb-6 text-2xl font-semibold">Create an admin account</h1>
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <RegisterForm />
      </div>
      <p className="mt-4 text-sm text-gray-600">
        Already have an account?{' '}
        <Link href="/login" className="text-blue-600 underline">
          Sign in
        </Link>
      </p>
    </main>
  );
}

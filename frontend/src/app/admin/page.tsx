import { getCurrentUser } from '@/lib/auth';

export default async function AdminHomePage() {
  const user = await getCurrentUser();

  return (
    <div>
      <h1 className="text-2xl font-semibold">Admin dashboard</h1>
      <p className="mt-2 text-gray-600">
        Welcome, {user?.name}. The numbers, members, and tasks come in the next phase.
      </p>
    </div>
  );
}

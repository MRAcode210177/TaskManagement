import { getCurrentUser } from '@/lib/auth';

export default async function MemberHomePage() {
  const user = await getCurrentUser();

  return (
    <div>
      <h1 className="text-2xl font-semibold">My tasks</h1>
      <p className="mt-2 text-gray-600">
        Welcome, {user?.name}. Your task list comes in a later phase.
      </p>
    </div>
  );
}

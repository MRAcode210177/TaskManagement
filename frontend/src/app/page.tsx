import { redirect } from 'next/navigation';
import { getCurrentUser, homePathFor } from '@/lib/auth';

// The home page only decides where to send the person.
export default async function HomePage() {
  const user = await getCurrentUser();
  redirect(user ? homePathFor(user.role) : '/login');
}

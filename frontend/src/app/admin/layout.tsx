import { AppHeader } from '@/components/layout/AppHeader';
import { requireRole } from '@/lib/auth';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole('admin');

  return (
    <>
      <AppHeader user={user} links={[{ href: '/admin', label: 'Dashboard' }]} />
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </>
  );
}

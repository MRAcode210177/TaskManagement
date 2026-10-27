import { AppHeader } from '@/components/layout/AppHeader';
import { requireRole } from '@/lib/auth';

const links = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/members', label: 'Members' },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole('admin');

  return (
    <>
      <AppHeader user={user} links={links} />
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </>
  );
}

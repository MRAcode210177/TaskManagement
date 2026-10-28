import { AppHeader } from '@/components/layout/AppHeader';
import { requireRole } from '@/lib/auth';

const links = [
  { href: '/admin', label: 'Dashboard', exact: true },
  { href: '/admin/members', label: 'Members' },
  { href: '/admin/tasks', label: 'Tasks' },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole('admin');

  return (
    <>
      <AppHeader user={user} links={links} />
      <main id="main-content" className="mx-auto max-w-5xl px-4 py-8">
        {children}
      </main>
    </>
  );
}

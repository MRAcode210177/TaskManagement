import { AppHeader } from '@/components/layout/AppHeader';
import { requireRole } from '@/lib/auth';

export default async function MemberLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole('member');

  return (
    <>
      <AppHeader user={user} links={[{ href: '/member', label: 'My tasks' }]} />
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </>
  );
}

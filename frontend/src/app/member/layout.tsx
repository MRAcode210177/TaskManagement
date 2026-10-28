import { AppHeader } from '@/components/layout/AppHeader';
import { requireRole } from '@/lib/auth';

const links = [{ href: '/member', label: 'My tasks' }];

export default async function MemberLayout({ children }: { children: React.ReactNode }) {
  const user = await requireRole('member');

  return (
    <>
      <AppHeader user={user} links={links} />
      <main id="main-content" className="mx-auto max-w-5xl px-4 py-8">
        {children}
      </main>
    </>
  );
}

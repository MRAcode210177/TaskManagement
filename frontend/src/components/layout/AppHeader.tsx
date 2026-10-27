import Link from 'next/link';
import { logoutAction } from '@/actions/auth';
import { Button } from '@/components/ui/Button';
import type { User } from '@/lib/types';

type Props = {
  user: User;
  links: { href: string; label: string }[];
};

export function AppHeader({ user, links }: Props) {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <nav aria-label="Main" className="flex items-center gap-4 text-sm">
          <span className="font-semibold">Task Management</span>
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-gray-600 hover:text-gray-900">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-gray-600">
            {user.name} ({user.role})
          </span>
          <form action={logoutAction}>
            <Button type="submit" variant="secondary">
              Log out
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}

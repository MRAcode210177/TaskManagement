import { logoutAction } from '@/actions/auth';
import { NavLinks } from '@/components/layout/NavLinks';
import type { NavLink } from '@/components/layout/NavLinks';
import { Button } from '@/components/ui/Button';
import type { User } from '@/lib/types';

type Props = {
  user: User;
  links: NavLink[];
};

export function AppHeader({ user, links }: Props) {
  return (
    <header className="border-b border-gray-200 bg-white">
      {/* Only visible when a keyboard user presses Tab. */}
      <a
        href="#main-content"
        className="sr-only rounded bg-white px-3 py-2 text-sm focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-10 focus:ring-2 focus:ring-blue-500"
      >
        Skip to main content
      </a>

      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3">
        <nav aria-label="Main" className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
          <span className="mr-2 font-semibold">Task Management</span>
          <NavLinks links={links} />
        </nav>

        <div className="flex items-center gap-3 text-sm">
          <span className="max-w-[10rem] truncate text-gray-600">
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

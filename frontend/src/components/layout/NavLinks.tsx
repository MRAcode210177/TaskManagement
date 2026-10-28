'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export type NavLink = {
  href: string;
  label: string;
  exact?: boolean; // true = active only on this exact address
};

/** The menu links. The link of the current page is highlighted. */
export function NavLinks({ links }: { links: NavLink[] }) {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const active = link.exact
          ? pathname === link.href
          : pathname === link.href || pathname.startsWith(`${link.href}/`);

        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? 'page' : undefined}
            className={`rounded-md px-2 py-1 ${
              active ? 'bg-blue-50 font-medium text-blue-700' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </>
  );
}

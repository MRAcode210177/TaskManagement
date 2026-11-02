'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

export type NavLink = {
  href: string;
  label: string;
  exact?: boolean;
  count?: number;
  icon?: ReactNode;
  badge?: string;
  isMockTab?: boolean; // For UI preview tabs like "Activity Logs" or "Settings"
};

export function NavLinks({ links }: { links: NavLink[] }) {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 scrollbar-none">
      {links.map((link) => {
        const active = link.exact
          ? pathname === link.href
          : pathname === link.href ||
            (link.href !== '/admin' && pathname.startsWith(`${link.href}/`));

        if (link.isMockTab) {
          return (
            <button
              key={link.label}
              type="button"
              title="Roadmap feature preview"
              className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-200/50 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-slate-200 whitespace-nowrap cursor-default"
            >
              {link.icon && <span className="opacity-70">{link.icon}</span>}
              <span>{link.label}</span>
              {link.badge && (
                <span className="rounded-full bg-slate-200 px-1.5 py-0.2 text-[10px] text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                  {link.badge}
                </span>
              )}
            </button>
          );
        }

        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? 'page' : undefined}
            className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-150 whitespace-nowrap ${
              active
                ? 'bg-blue-50 text-blue-700 shadow-2xs ring-1 ring-blue-500/25 dark:bg-blue-600/20 dark:text-blue-300 dark:ring-blue-500/40'
                : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-slate-200'
            }`}
          >
            {link.icon && (
              <span className={active ? 'text-blue-600 dark:text-blue-400' : 'opacity-70'}>
                {link.icon}
              </span>
            )}
            <span>{link.label}</span>
            {link.count !== undefined && (
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold transition-colors ${
                  active
                    ? 'bg-blue-600 text-white dark:bg-blue-500 dark:text-white'
                    : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                {link.count}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}

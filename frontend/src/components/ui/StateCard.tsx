import Link from 'next/link';
import type { ReactNode } from 'react';

type Props = {
  label: string;
  value: number | string;
  href?: string;
  badge?: ReactNode;
  subtitle?: ReactNode;
  icon?: ReactNode;
  accentColor?: 'indigo' | 'blue' | 'amber' | 'emerald' | 'rose' | 'slate';
  progressPercent?: number;
};

const ACCENT_BAR: Record<string, string> = {
  indigo: 'bg-indigo-500 dark:bg-indigo-400',
  blue: 'bg-blue-500 dark:bg-blue-400',
  amber: 'bg-amber-500 dark:bg-amber-400',
  emerald: 'bg-emerald-500 dark:bg-emerald-400',
  rose: 'bg-rose-500 dark:bg-rose-400',
  slate: 'bg-slate-400 dark:bg-slate-600',
};

export function StatCard({
  label,
  value,
  href,
  badge,
  subtitle,
  icon,
  accentColor = 'blue',
  progressPercent,
}: Props) {
  const content = (
    <div className="relative flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200/90 bg-white p-4 shadow-xs transition-all duration-150 hover:shadow-md dark:border-slate-800/90 dark:bg-slate-900/80">
      {/* Top accent line */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 ${
          ACCENT_BAR[accentColor] ?? ACCENT_BAR.blue
        }`}
      />

      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold tracking-wide text-slate-500 uppercase dark:text-slate-400">
          {label}
        </span>
        {icon && (
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            {icon}
          </div>
        )}
      </div>

      <div className="my-2 flex items-baseline justify-between gap-2">
        <div className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {value}
        </div>
        {badge && <div className="shrink-0">{badge}</div>}
      </div>

      {progressPercent !== undefined && (
        <div className="mb-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              ACCENT_BAR[accentColor] ?? ACCENT_BAR.blue
            }`}
            style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
          />
        </div>
      )}

      {subtitle && (
        <div className="text-xs text-slate-500 truncate dark:text-slate-400">{subtitle}</div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="group block focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl"
      >
        {content}
      </Link>
    );
  }

  return content;
}

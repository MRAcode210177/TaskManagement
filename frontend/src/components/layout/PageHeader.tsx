import type { ReactNode } from 'react';

type Props = {
  title: string;
  subtitle?: string;
  badge?: ReactNode;
  children?: ReactNode;
};

export function PageHeader({ title, subtitle, badge, children }: Props) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/60 pb-5 dark:border-slate-800/60">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            {title}
          </h1>
          {badge && <div className="shrink-0">{badge}</div>}
        </div>
        {subtitle && (
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl sm:text-sm">
            {subtitle}
          </p>
        )}
      </div>

      {children && (
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0">{children}</div>
      )}
    </div>
  );
}

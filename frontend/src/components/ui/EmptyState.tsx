import type { ReactNode } from 'react';

type Props = {
  title: string;
  text?: string;
  icon?: ReactNode;
  children?: ReactNode;
};

/** Shown when a list has no items. */
export function EmptyState({ title, text, icon, children }: Props) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white/70 px-6 py-12 text-center transition-colors dark:border-slate-800 dark:bg-slate-900/50">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
        {icon ? (
          icon
        ) : (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        )}
      </div>
      <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">{title}</h3>
      {text && <p className="mt-1.5 max-w-sm text-sm text-slate-500 dark:text-slate-400">{text}</p>}
      {children && <div className="mt-5">{children}</div>}
    </div>
  );
}

import Link from 'next/link';
import type { ReactNode } from 'react';

type Props = {
  title: string;
  message: string;
  actionHref?: string;
  actionLabel?: string;
  icon?: ReactNode;
  variant?: 'danger' | 'warning' | 'info';
};

export function AlertBanner({
  title,
  message,
  actionHref,
  actionLabel = 'Resolve Task',
  variant = 'danger',
}: Props) {
  const styles = {
    danger: {
      wrapper:
        'border-rose-500/40 bg-rose-950/30 text-rose-100 shadow-lg shadow-rose-950/30 dark:border-rose-500/50 dark:bg-rose-950/50',
      button:
        'bg-rose-600 text-white hover:bg-rose-500 shadow-md shadow-rose-950/50 active:scale-95',
      iconBox: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
      subtitle: 'text-rose-200/90 dark:text-rose-200',
    },
    warning: {
      wrapper:
        'border-amber-500/40 bg-amber-950/30 text-amber-100 shadow-lg shadow-amber-950/30 dark:border-amber-500/50 dark:bg-amber-950/50',
      button:
        'bg-amber-600 text-white hover:bg-amber-500 shadow-md shadow-amber-950/50 active:scale-95',
      iconBox: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      subtitle: 'text-amber-200/90 dark:text-amber-200',
    },
    info: {
      wrapper:
        'border-blue-500/40 bg-blue-950/30 text-blue-100 shadow-lg shadow-blue-950/30 dark:border-blue-500/50 dark:bg-blue-950/50',
      button:
        'bg-blue-600 text-white hover:bg-blue-500 shadow-md shadow-blue-950/50 active:scale-95',
      iconBox: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      subtitle: 'text-blue-200/90 dark:text-blue-200',
    },
  }[variant];

  return (
    <div
      role="alert"
      className={`relative mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border p-4 sm:p-5 backdrop-blur-md transition-all ${styles.wrapper}`}
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${styles.iconBox}`}
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <div className="min-w-0">
          <h2 className="font-bold text-sm sm:text-base tracking-tight text-white">{title}</h2>
          <p
            className={`mt-0.5 text-xs sm:text-sm ${styles.subtitle} truncate sm:whitespace-normal`}
          >
            {message}
          </p>
        </div>
      </div>

      {actionHref && (
        <div className="shrink-0">
          <Link
            href={actionHref}
            className={`inline-flex items-center justify-center rounded-xl px-4 py-2 text-xs font-bold transition-all ${styles.button}`}
          >
            {actionLabel}
          </Link>
        </div>
      )}
    </div>
  );
}

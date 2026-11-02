import type { ReactNode } from 'react';

export type BadgeVariant =
  'default' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'outline';

type BadgeProps = {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
};

const VARIANT_STYLES: Record<BadgeVariant, { base: string; dot: string }> = {
  default: {
    base: 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700',
    dot: 'bg-slate-500',
  },
  secondary: {
    base: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800/80 dark:text-slate-400 dark:border-slate-750',
    dot: 'bg-slate-400',
  },
  success: {
    base: 'bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/60',
    dot: 'bg-emerald-500',
  },
  warning: {
    base: 'bg-amber-50 text-amber-800 border-amber-200/80 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800/60',
    dot: 'bg-amber-500',
  },
  danger: {
    base: 'bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800/60',
    dot: 'bg-rose-500 animate-pulse',
  },
  info: {
    base: 'bg-sky-50 text-sky-700 border-sky-200/80 dark:bg-sky-950/50 dark:text-sky-300 dark:border-sky-800/60',
    dot: 'bg-sky-500',
  },
  purple: {
    base: 'bg-purple-50 text-purple-700 border-purple-200/80 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800/60',
    dot: 'bg-purple-500',
  },
  outline: {
    base: 'bg-transparent text-slate-700 border-slate-300 dark:text-slate-300 dark:border-slate-700',
    dot: 'bg-slate-400',
  },
};

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className = '',
}: BadgeProps) {
  const styles = VARIANT_STYLES[variant];
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border tracking-wide transition-colors ${styles.base} ${sizeClass} ${className}`}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${styles.dot}`} />}
      {children}
    </span>
  );
}

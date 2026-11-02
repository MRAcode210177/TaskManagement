type AvatarProps = {
  name: string;
  id?: number | string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showStatus?: boolean;
  status?: 'online' | 'offline' | 'busy';
  className?: string;
};

const COLOR_VARIANTS = [
  'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-950/70 dark:text-indigo-300 dark:border-indigo-800',
  'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800',
  'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800',
  'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950/70 dark:text-purple-300 dark:border-purple-800',
  'bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-950/70 dark:text-sky-300 dark:border-sky-800',
  'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950/70 dark:text-rose-300 dark:border-rose-800',
];

function getInitials(name: string): string {
  if (!name) return '??';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export function Avatar({
  name,
  id,
  size = 'md',
  showStatus = false,
  status = 'online',
  className = '',
}: AvatarProps) {
  const initials = getInitials(name);

  // Deterministic palette pick
  const numericId =
    typeof id === 'number'
      ? id
      : (name.charCodeAt(0) || 0) + (name.charCodeAt(name.length - 1) || 0);
  const colorScheme = COLOR_VARIANTS[Math.abs(numericId) % COLOR_VARIANTS.length];

  const sizeClasses = {
    xs: 'h-6 w-6 text-[10px]',
    sm: 'h-8 w-8 text-xs',
    md: 'h-9 w-9 text-xs',
    lg: 'h-11 w-11 text-sm',
  }[size];

  const statusDotSizes = {
    xs: 'h-1.5 w-1.5',
    sm: 'h-2 w-2',
    md: 'h-2.5 w-2.5',
    lg: 'h-3 w-3',
  }[size];

  return (
    <div className={`relative inline-flex shrink-0 ${className}`}>
      <div
        className={`flex items-center justify-center rounded-full font-semibold border select-none transition-transform hover:scale-105 ${sizeClasses} ${colorScheme}`}
        title={name}
      >
        {initials}
      </div>
      {showStatus && (
        <span
          className={`absolute bottom-0 right-0 rounded-full ring-2 ring-white dark:ring-slate-900 ${statusDotSizes} ${
            status === 'online'
              ? 'bg-emerald-500'
              : status === 'busy'
                ? 'bg-amber-500'
                : 'bg-slate-400'
          }`}
        />
      )}
    </div>
  );
}

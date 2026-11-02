type Props = { label?: string };

export function LoadingState({ label = 'Loading workspace...' }: Props) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center gap-3 py-20 text-xs font-medium text-slate-500 dark:text-slate-400"
    >
      <div className="relative flex h-8 w-8 items-center justify-center">
        <div className="absolute h-8 w-8 animate-ping rounded-full bg-blue-500/20" />
        <span
          aria-hidden="true"
          className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600 dark:border-slate-800 dark:border-t-blue-500"
        />
      </div>
      <span>{label}</span>
    </div>
  );
}

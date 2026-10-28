type Props = { label?: string };

/** A spinner with a text. Screen readers read the text. */
export function LoadingState({ label = 'Loading...' }: Props) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center justify-center gap-3 py-16 text-sm text-gray-600"
    >
      <span
        aria-hidden="true"
        className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"
      />
      {label}
    </div>
  );
}

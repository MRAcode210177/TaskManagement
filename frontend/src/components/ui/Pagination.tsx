import Link from 'next/link';

type Props = {
  currentPage: number;
  lastPage: number;
  hrefFor: (page: number) => string;
};

export function Pagination({ currentPage, lastPage, hrefFor }: Props) {
  if (lastPage <= 1) return null;

  const linkClass =
    'inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900 active:scale-95 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white';
  const disabledClass =
    'inline-flex items-center justify-center rounded-lg border border-slate-100 bg-slate-50 px-3.5 py-1.5 text-xs font-medium text-slate-300 cursor-not-allowed dark:border-slate-850 dark:bg-slate-900/40 dark:text-slate-600';

  return (
    <nav
      aria-label="Pagination"
      className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 text-xs dark:border-slate-800/80"
    >
      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
        <span>
          Rows per page:{' '}
          <strong className="font-semibold text-slate-700 dark:text-slate-200">10</strong>
        </span>
        <span>•</span>
        <span>
          Page{' '}
          <strong className="font-semibold text-slate-700 dark:text-slate-200">
            {currentPage}
          </strong>{' '}
          of{' '}
          <strong className="font-semibold text-slate-700 dark:text-slate-200">{lastPage}</strong>
        </span>
      </div>

      <div className="flex items-center gap-2">
        {currentPage > 1 ? (
          <Link href={hrefFor(currentPage - 1)} className={linkClass}>
            ← Previous
          </Link>
        ) : (
          <span className={disabledClass}>← Previous</span>
        )}

        {currentPage < lastPage ? (
          <Link href={hrefFor(currentPage + 1)} className={linkClass}>
            Next →
          </Link>
        ) : (
          <span className={disabledClass}>Next →</span>
        )}
      </div>
    </nav>
  );
}

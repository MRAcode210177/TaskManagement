import Link from 'next/link';

type Props = {
  currentPage: number;
  lastPage: number;
  /** Gives the URL of a page. This keeps filters in the address. */
  hrefFor: (page: number) => string;
};

const linkClass = 'rounded-md border border-gray-300 bg-white px-3 py-1.5 hover:bg-gray-50';
const disabledClass = 'rounded-md border border-gray-200 px-3 py-1.5 text-gray-400';

export function Pagination({ currentPage, lastPage, hrefFor }: Props) {
  if (lastPage <= 1) return null;

  return (
    <nav aria-label="Pagination" className="mt-4 flex items-center justify-between text-sm">
      {currentPage > 1 ? (
        <Link href={hrefFor(currentPage - 1)} className={linkClass}>
          Previous
        </Link>
      ) : (
        <span className={disabledClass}>Previous</span>
      )}
      <span className="text-gray-600">
        Page {currentPage} of {lastPage}
      </span>
      {currentPage < lastPage ? (
        <Link href={hrefFor(currentPage + 1)} className={linkClass}>
          Next
        </Link>
      ) : (
        <span className={disabledClass}>Next</span>
      )}
    </nav>
  );
}

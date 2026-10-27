import Link from 'next/link';

type Props = {
  label: string;
  value: number;
  href?: string;
};

const cardClass = 'rounded-lg border border-gray-200 bg-white p-4 shadow-sm';

export function StatCard({ label, value, href }: Props) {
  const content = (
    <>
      <p className="text-sm text-gray-600">{label}</p>
      <p className="mt-1 text-3xl font-semibold">{value}</p>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={`${cardClass} block hover:border-blue-400`}>
        {content}
      </Link>
    );
  }

  return <div className={cardClass}>{content}</div>;
}

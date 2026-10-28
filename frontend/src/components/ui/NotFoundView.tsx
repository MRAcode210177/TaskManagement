import { LinkButton } from '@/components/ui/LinkButton';

type Props = {
  homeHref: string;
  homeLabel: string;
};

export function NotFoundView({ homeHref, homeLabel }: Props) {
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <p className="text-5xl font-semibold text-gray-300">404</p>
      <h1 className="mt-4 text-xl font-semibold">Page not found</h1>
      <p className="mt-2 text-sm text-gray-600">
        This page does not exist, or you do not have access to it.
      </p>
      <div className="mt-6">
        <LinkButton href={homeHref}>{homeLabel}</LinkButton>
      </div>
    </div>
  );
}

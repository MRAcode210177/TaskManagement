import { LinkButton } from '@/components/ui/LinkButton';

type Props = {
  homeHref: string;
  homeLabel: string;
};

export function NotFoundView({ homeHref, homeLabel }: Props) {
  return (
    <div className="mx-auto max-w-md py-20 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-3xl font-extrabold text-slate-400 dark:bg-slate-900 dark:text-slate-500">
        404
      </div>
      <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
        Page Not Found
      </h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        The workspace view or task item you requested does not exist or may have been deleted.
      </p>
      <div className="mt-6 flex justify-center">
        <LinkButton href={homeHref} variant="primary">
          {homeLabel}
        </LinkButton>
      </div>
    </div>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import { startTransition } from 'react';
import { Button } from '@/components/ui/Button';
import { LinkButton } from '@/components/ui/LinkButton';

type Props = {
  reset: () => void;
  homeHref: string;
};

export function ErrorView({ reset, homeHref }: Props) {
  const router = useRouter();

  function retry() {
    startTransition(() => {
      router.refresh();
      reset();
    });
  }

  return (
    <div role="alert" className="mx-auto max-w-md py-20 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-500 dark:bg-rose-950/50 dark:text-rose-400">
        <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
        Workspace Sync Issue
      </h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        An error occurred while communicating with the backend. Please verify your connection or try
        again.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Button type="button" onClick={retry} variant="primary">
          Try again
        </Button>
        <LinkButton href={homeHref} variant="secondary">
          Go back
        </LinkButton>
      </div>
    </div>
  );
}

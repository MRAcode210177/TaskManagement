'use client';

import { useRouter } from 'next/navigation';
import { startTransition } from 'react';
import { Button } from '@/components/ui/Button';
import { LinkButton } from '@/components/ui/LinkButton';

type Props = {
  reset: () => void; // given by Next.js
  homeHref: string; // where the "Go back" link goes
};

export function ErrorView({ reset, homeHref }: Props) {
  const router = useRouter();

  // 1) ask the server for fresh data, 2) try to draw the page again.
  function retry() {
    startTransition(() => {
      router.refresh();
      reset();
    });
  }

  return (
    <div role="alert" className="mx-auto max-w-md py-16 text-center">
      <h1 className="text-xl font-semibold">Something went wrong</h1>
      <p className="mt-2 text-sm text-gray-600">
        We could not load this page. Please try again. If the problem stays, tell your admin or
        developer.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Button type="button" onClick={retry}>
          Try again
        </Button>
        <LinkButton href={homeHref} variant="secondary">
          Go back
        </LinkButton>
      </div>
    </div>
  );
}

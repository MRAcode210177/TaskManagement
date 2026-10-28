'use client';

import { useEffect } from 'react';
import { ErrorView } from '@/components/ui/ErrorVeiw';

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto max-w-md px-4">
      <ErrorView reset={reset} homeHref="/" />
    </main>
  );
}

'use client';

import { useEffect } from 'react';
import { ErrorView } from '@/components/ui/ErrorVeiw';

export default function MemberError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return <ErrorView reset={reset} homeHref="/member" />;
}

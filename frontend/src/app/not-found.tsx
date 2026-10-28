import type { Metadata } from 'next';
import { NotFoundView } from '@/components/ui/NotFoundView';

export const metadata: Metadata = { title: 'Page not found | Task Management' };

export default function NotFound() {
  return (
    <main className="mx-auto max-w-md px-4">
      <NotFoundView homeHref="/" homeLabel="Go to the home page" />
    </main>
  );
}

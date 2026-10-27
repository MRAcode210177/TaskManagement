import 'server-only';
import { ApiError } from '@/lib/api';
import type { FormState } from '@/lib/types';

/** Turn an error from Laravel into something a form can show. */
export function toFormState(error: unknown, values: Record<string, string>): FormState {
  if (error instanceof ApiError) {
    return { error: error.message, fieldErrors: error.errors, values };
  }
  throw error; // an unknown problem: show the Next.js error page
}

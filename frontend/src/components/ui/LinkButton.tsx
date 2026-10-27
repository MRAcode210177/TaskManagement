import Link from 'next/link';
import type { ComponentProps } from 'react';
import { buttonClasses } from '@/components/ui/Button';
import type { ButtonVariant } from '@/components/ui/Button';

type Props = ComponentProps<typeof Link> & { variant?: ButtonVariant };

/** A link that looks like a button. */
export function LinkButton({ variant = 'primary', className = '', ...props }: Props) {
  return <Link className={buttonClasses(variant, className)} {...props} />;
}

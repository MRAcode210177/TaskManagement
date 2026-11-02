import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';
import { buttonClasses, type ButtonSize, type ButtonVariant } from '@/components/ui/Button';

type Props = ComponentProps<typeof Link> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
};

/** A link styled as a button. */
export function LinkButton({
  variant = 'primary',
  size = 'md',
  icon,
  className = '',
  children,
  ...props
}: Props) {
  return (
    <Link className={buttonClasses(variant, size, className)} {...props}>
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </Link>
  );
}

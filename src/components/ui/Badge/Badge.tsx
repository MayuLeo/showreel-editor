import { Slot } from '@radix-ui/react-slot';
import { type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';
import * as React from 'react';
import { badgeVariants } from './BadgeVariants';

export function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'span';

  return (
    <Comp
      data-slot="badge"
      className={clsx(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

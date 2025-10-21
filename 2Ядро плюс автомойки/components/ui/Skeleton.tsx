
import React from 'react';
import { cn } from '../../lib/utils';

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-[var(--tg-theme-secondary-bg-color)] opacity-50", className)}
      {...props}
    />
  );
}

export { Skeleton };

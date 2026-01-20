import * as React from 'react';

import { cn } from '@/lib/utils';

function Panel({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="panel"
      className={cn(
        'bg-card text-card-foreground flex flex-col min-h-0',
        className
      )}
      {...props}
    />
  );
}

function PanelHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="panel-header"
      className={cn(
        'flex items-center justify-between gap-4 px-4 py-3 border-b',
        className
      )}
      {...props}
    />
  );
}

function PanelTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="panel-title"
      className={cn('text-sm font-semibold leading-none', className)}
      {...props}
    />
  );
}

function PanelDescription({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="panel-description"
      className={cn('text-xs text-muted-foreground', className)}
      {...props}
    />
  );
}

function PanelToolbar({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="panel-toolbar"
      className={cn('flex items-center gap-2', className)}
      {...props}
    />
  );
}

function PanelContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="panel-content"
      className={cn('flex-1 min-h-0 overflow-hidden p-4', className)}
      {...props}
    />
  );
}

export {
  Panel,
  PanelHeader,
  PanelTitle,
  PanelDescription,
  PanelToolbar,
  PanelContent,
};

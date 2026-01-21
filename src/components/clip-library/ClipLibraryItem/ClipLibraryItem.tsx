import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useDraggable } from '@dnd-kit/core';
import { GripVertical } from 'lucide-react';
import type { ClipLibraryItemProps } from './type';

const formatTimecode = (value: {
  hours: number;
  minutes: number;
  seconds: number;
  frames: number;
}) => {
  const pad = (num: number) => num.toString().padStart(2, '0');
  return `${pad(value.hours)}:${pad(value.minutes)}:${pad(value.seconds)}:${pad(value.frames)}`;
};

export function ClipLibraryItem({
  clip,
  isAdded = false,
  disabled = false,
  disabledReason,
  onAdd,
}: ClipLibraryItemProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `library-${clip.id}`,
      data: { clipId: clip.id },
      disabled,
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'rounded-md border bg-background p-3 transition-colors',
        isDragging && 'opacity-0 pointer-events-none',
        disabled
          ? 'cursor-not-allowed opacity-50 bg-muted/30'
          : 'hover:bg-accent/50'
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <div className="flex items-center gap-2">
          {!disabled && (
            <button
              {...listeners}
              {...attributes}
              className="cursor-grab active:cursor-grabbing hover:bg-accent rounded p-0.5 -ml-1"
              type="button"
            >
              <GripVertical className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
          <span className="text-sm font-medium leading-tight">{clip.name}</span>
        </div>
        <div className="flex items-center gap-1">
          {(isAdded || disabledReason) && (
            <Badge
              variant="secondary"
              className={cn(
                'text-[10px] shrink-0',
                disabledReason &&
                  !isAdded &&
                  'bg-destructive/10 text-destructive'
              )}
            >
              {isAdded ? '追加済' : disabledReason || '非対応'}
            </Badge>
          )}
          {onAdd && !isAdded && (
            <Button
              size="sm"
              variant="ghost"
              className="h-6 px-2 text-xs"
              disabled={disabled}
              onClick={(event) => {
                event.stopPropagation();
                onAdd(clip.id);
              }}
            >
              追加
            </Button>
          )}
        </div>
      </div>
      <p className="line-clamp-2 text-xs text-muted-foreground mb-2">
        {clip.description}
      </p>
      <div className="flex items-center gap-2 mb-1">
        <Badge variant="outline" className="text-[10px]">
          {clip.standard}
        </Badge>
        <Badge variant="outline" className="text-[10px]">
          {clip.resolution}
        </Badge>
      </div>
      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
        <span className="font-mono">{formatTimecode(clip.startTimecode)}</span>
        <span>→</span>
        <span className="font-mono">{formatTimecode(clip.endTimecode)}</span>
      </div>
    </div>
  );
}

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import type { TimelineClipCardProps } from './type';

const formatTimecode = (value: {
  hours: number;
  minutes: number;
  seconds: number;
  frames: number;
}) => {
  const pad = (num: number) => num.toString().padStart(2, '0');
  return `${pad(value.hours)}:${pad(value.minutes)}:${pad(value.seconds)}:${pad(value.frames)}`;
};

export function TimelineClipCard({
  clip,
  isSelected = false,
  isDragging = false,
  onSelect,
  onRemove,
}: TimelineClipCardProps) {
  const handleSelect = () => {
    onSelect?.(clip.id);
  };

  return (
    <div
      className={cn(
        'rounded-md border bg-background p-3 transition-colors',
        isDragging
          ? 'opacity-50 border-primary'
          : 'cursor-pointer hover:bg-accent/50',
        isSelected && !isDragging && 'bg-accent/30 border-primary'
      )}
      onClick={onSelect && !isDragging ? handleSelect : undefined}
      role={onSelect ? 'button' : undefined}
      tabIndex={onSelect ? 0 : undefined}
      onKeyDown={(event) => {
        if (!onSelect || isDragging) return;
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onSelect(clip.id);
        }
      }}
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <span className="text-sm font-medium leading-tight">{clip.name}</span>
        <Button
          size="sm"
          variant="ghost"
          className="h-6 px-2 text-xs"
          onClick={(event) => {
            event.stopPropagation();
            onRemove?.(clip.id);
          }}
        >
          削除
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
        {clip.description}
      </p>
      <div className="text-[10px] text-muted-foreground mb-1">タイムコード</div>
      <div className="flex flex-wrap items-center gap-1">
        <Badge variant="outline" className="font-mono text-[10px]">
          {formatTimecode(clip.startTimecode)}
        </Badge>
        <span className="text-[10px] text-muted-foreground">→</span>
        <Badge variant="outline" className="font-mono text-[10px]">
          {formatTimecode(clip.endTimecode)}
        </Badge>
      </div>
    </div>
  );
}

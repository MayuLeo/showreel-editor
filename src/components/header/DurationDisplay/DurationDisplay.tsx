import { Badge } from '@/components/ui/Badge';
import { formatDuration } from '@/lib/timecode';
import type { DurationDisplayProps } from './type';

export function DurationDisplay({ duration }: DurationDisplayProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="text-sm font-medium text-muted-foreground">
        合計再生時間:
      </div>
      <Badge variant="outline" className="font-mono text-base px-3 py-1">
        {formatDuration(duration)}
      </Badge>
    </div>
  );
}

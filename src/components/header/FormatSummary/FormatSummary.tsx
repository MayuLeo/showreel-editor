import { Badge } from '@/components/ui/Badge';
import type { FormatSummaryProps } from './type';

export function FormatSummary({ format }: FormatSummaryProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="text-sm font-medium text-muted-foreground">
        フォーマット:
      </div>
      {format && (
        <>
          <Badge variant="secondary">{format.standard}</Badge>
          <Badge variant="outline">{format.resolution}</Badge>
        </>
      )}
    </div>
  );
}

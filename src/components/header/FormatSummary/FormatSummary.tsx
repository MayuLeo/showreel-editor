import { Badge } from '@/components/ui/Badge';
import type { FormatSummaryProps } from './type';

export function FormatSummary({ format }: FormatSummaryProps) {
  const getStandardVariant = (standard: string) => {
    return standard === 'PAL' ? 'default' : 'secondary';
  };

  const getResolutionVariant = (resolution: string) => {
    return resolution === 'HD' ? 'default' : 'outline';
  };

  return (
    <div className="flex items-center gap-2">
      <div className="text-sm font-medium text-muted-foreground">
        フォーマット:
      </div>
      {format && (
        <>
          <Badge variant={getStandardVariant(format.standard)}>
            {format.standard}
          </Badge>
          <Badge variant={getResolutionVariant(format.resolution)}>
            {format.resolution}
          </Badge>
        </>
      )}
    </div>
  );
}

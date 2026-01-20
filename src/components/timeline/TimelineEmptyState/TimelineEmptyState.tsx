import { useDroppable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';

export function TimelineEmptyState() {
  const { setNodeRef, isOver } = useDroppable({
    id: 'timeline',
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex flex-col items-center justify-center gap-3 py-8 text-center rounded border-2 border-dashed bg-muted/20 transition-colors',
        isOver && 'border-primary bg-primary/10'
      )}
    >
      <p className="text-xs text-muted-foreground">
        クリップが未追加です。ライブラリからドラッグしてタイムラインに追加してください。
      </p>
    </div>
  );
}

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TimelineClipCard } from '../TimelineClipCard';
import type { SortableClipItemProps } from './type';

export function SortableClipItem({
  clip,
  isSelected,
  onSelect,
  onRemove,
}: SortableClipItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: clip.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="w-64 shrink-0 touch-none"
      {...attributes}
      {...listeners}
    >
      <TimelineClipCard
        clip={clip}
        isSelected={isSelected}
        isDragging={isDragging}
        onSelect={onSelect}
        onRemove={onRemove}
      />
    </div>
  );
}

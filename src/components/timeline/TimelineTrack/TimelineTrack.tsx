import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  horizontalListSortingStrategy,
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { restrictToHorizontalAxis, restrictToParentElement } from '@dnd-kit/modifiers';
import { useDroppable } from '@dnd-kit/core';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { SortableClipItem } from '../SortableClipItem';
import type { TimelineTrackProps } from './type';

export function TimelineTrack({
  clips,
  selectedClipId,
  onSelectClip,
  onRemoveClip,
  onReorderClips,
}: TimelineTrackProps) {
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: 'timeline',
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = clips.findIndex((clip) => clip.id === active.id);
      const newIndex = clips.findIndex((clip) => clip.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newClips = arrayMove(clips, oldIndex, newIndex);
        onReorderClips?.(newClips);
      }
    }
  };

  const clipIds = clips.map((clip) => clip.id);

  return (
    <div
      ref={setDroppableRef}
      className={cn(
        'rounded border-2 border-dashed border-transparent transition-colors',
        isOver && 'border-primary bg-primary/5'
      )}
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToHorizontalAxis, restrictToParentElement]}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={clipIds} strategy={horizontalListSortingStrategy}>
          <ScrollArea className="w-full">
            <div className="flex flex-row flex-nowrap items-stretch justify-start gap-2 p-1 pb-3">
              {clips.map((clip) => (
                <SortableClipItem
                  key={clip.id}
                  clip={clip}
                  isSelected={clip.id === selectedClipId}
                  onSelect={onSelectClip}
                  onRemove={onRemoveClip}
                />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </SortableContext>
      </DndContext>
    </div>
  );
}

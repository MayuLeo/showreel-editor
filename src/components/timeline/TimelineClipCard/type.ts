import type { Clip } from '@/types/clip';

export type TimelineClipCardProps = {
  clip: Clip;
  isSelected?: boolean;
  isDragging?: boolean;
  onSelect?: (clipId: string) => void;
  onRemove?: (clipId: string) => void;
  dragHandleProps?: {
    attributes: Record<string, any>;
    listeners: Record<string, any> | undefined;
  };
};

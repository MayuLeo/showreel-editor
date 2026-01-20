import type { Clip } from '@/types/clip';

export type TimelineClipCardProps = {
  clip: Clip;
  isSelected?: boolean;
  isDragging?: boolean;
  onSelect?: (clipId: string) => void;
  onRemove?: (clipId: string) => void;
};

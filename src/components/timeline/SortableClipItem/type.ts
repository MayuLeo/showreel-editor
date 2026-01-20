import type { Clip } from '@/types/clip';

export type SortableClipItemProps = {
  clip: Clip;
  isSelected?: boolean;
  onSelect?: (clipId: string) => void;
  onRemove?: (clipId: string) => void;
};

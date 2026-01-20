import type { Clip } from '@/types/clip';

export type ClipLibraryItemProps = {
  clip: Clip;
  isAdded?: boolean;
  disabled?: boolean;
  disabledReason?: string;
  onAdd?: (clipId: string) => void;
};

import type { Clip } from '@/types/clip';
import type { VideoFormat } from '@/types/showreel';

export type ClipLibraryPanelProps = {
  clips: Clip[];
  addedClipIds: Set<string>;
  isFormatLocked?: boolean;
  lockedFormat?: VideoFormat;
  onAddClip?: (clipId: string) => void;
};

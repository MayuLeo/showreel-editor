import type { Clip } from '@/types/clip';

export type TimelineTrackProps = {
  clips: Clip[];
  selectedClipId?: string;
  onSelectClip?: (clipId: string) => void;
  onRemoveClip?: (clipId: string) => void;
  onReorderClips?: (clips: Clip[]) => void;
};

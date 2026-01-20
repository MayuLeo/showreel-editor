import {
  Panel,
  PanelContent,
  PanelDescription,
  PanelHeader,
  PanelTitle,
} from '@/components/ui/panel';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  formatCompatibilityReasons,
  getClipCompatibility,
} from '@/lib/compatibility';
import { ClipLibraryItem } from '../ClipLibraryItem';
import type { ClipLibraryPanelProps } from './type';

export function ClipLibraryPanel({
  clips,
  addedClipIds,
  isFormatLocked = false,
  lockedFormat,
  onAddClip,
}: ClipLibraryPanelProps) {
  return (
    <Panel className="h-full min-h-0">
      <PanelHeader>
        <div>
          <PanelTitle>クリップライブラリ</PanelTitle>
          <PanelDescription>
            クリップをタイムラインへドラッグして追加
          </PanelDescription>
        </div>
      </PanelHeader>
      <PanelContent className="p-0">
        <ScrollArea className="h-full">
          <div className="flex flex-col gap-2 p-4">
            {clips.map((clip) => {
              const isAdded = addedClipIds.has(clip.id);
              const compatibility = getClipCompatibility(clip, lockedFormat);
              const isCompatible = isFormatLocked ? compatibility.ok : true;

              return (
                <ClipLibraryItem
                  key={clip.id}
                  clip={clip}
                  isAdded={isAdded}
                  disabled={isAdded || (isFormatLocked && !isCompatible)}
                  disabledReason={
                    isAdded
                      ? '追加済'
                      : isFormatLocked && !isCompatible && lockedFormat
                        ? formatCompatibilityReasons(
                            compatibility,
                            clip,
                            lockedFormat
                          )
                        : undefined
                  }
                  onAdd={onAddClip}
                />
              );
            })}
          </div>
        </ScrollArea>
      </PanelContent>
    </Panel>
  );
}

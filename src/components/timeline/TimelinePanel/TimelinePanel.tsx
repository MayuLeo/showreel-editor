import { Badge } from '@/components/ui/Badge';
import {
  Panel,
  PanelContent,
  PanelDescription,
  PanelHeader,
  PanelTitle,
  PanelToolbar,
} from '@/components/ui/panel';
import { TimelineEmptyState } from '../TimelineEmptyState';
import { TimelineTrack } from '../TimelineTrack';
import type { TimelinePanelProps } from './type';

export function TimelinePanel({
  clips,
  selectedClipId,
  onSelectClip,
  onRemoveClip,
  onReorderClips,
  errorMessage,
}: TimelinePanelProps) {
  return (
    <Panel className="h-[260px] shrink-0">
      <PanelHeader>
        <div>
          <PanelTitle>タイムライン</PanelTitle>
          <PanelDescription>
            追加済みクリップの並びを確認・編集します
          </PanelDescription>
          {errorMessage && (
            <div className="mt-1 text-xs text-destructive">{errorMessage}</div>
          )}
        </div>
        <PanelToolbar>
          <span className="text-xs text-muted-foreground">クリップ数</span>
          <Badge variant="secondary" className="text-xs">
            {clips.length}
          </Badge>
        </PanelToolbar>
      </PanelHeader>
      <PanelContent>
        {clips.length > 0 ? (
          <TimelineTrack
            clips={clips}
            selectedClipId={selectedClipId}
            onSelectClip={onSelectClip}
            onRemoveClip={onRemoveClip}
            onReorderClips={onReorderClips}
          />
        ) : (
          <TimelineEmptyState />
        )}
      </PanelContent>
    </Panel>
  );
}

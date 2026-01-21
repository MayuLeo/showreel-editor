import { DndContext, DragOverlay, type DragEndEvent } from '@dnd-kit/core';
import { useMemo, useState } from 'react';
import { ClipLibraryItem, ClipLibraryPanel } from './components/clip-library';
import { Header } from './components/header';
import { TimelinePanel } from './components/timeline';
import {
  Panel,
  PanelContent,
  PanelDescription,
  PanelHeader,
  PanelTitle,
} from './components/ui/panel';
import { clips as libraryClips } from './data/clips';
import {
  formatCompatibilityReasons,
  getClipCompatibility,
} from './lib/compatibility';
import {
  framesToDuration,
  getFrameRate,
  sumDurationFrames,
} from './lib/timecode';
import type { Clip } from './types/clip';
import type { ShowreelInfo, VideoFormat } from './types/showreel';

function App() {
  // 入力（State）: name, format
  const [showreelName, setShowreelName] = useState('新規ファイル');
  const [showreelFormat, setShowreelFormat] = useState<VideoFormat | null>(
    null
  );

  const handleNameChange = (name: string) => {
    setShowreelName(name);
  };

  const [timelineClips, setTimelineClips] = useState<Clip[]>([]);
  const [selectedClipId, setSelectedClipId] = useState<string>();
  const [activeClipId, setActiveClipId] = useState<string | null>(null);
  const [lastAddError, setLastAddError] = useState<string | null>(null);

  // 派生（Derived）: totalDuration は timelineClips から算出
  const totalDuration = useMemo(() => {
    if (timelineClips.length === 0 || !showreelFormat) {
      return { hours: 0, minutes: 0, seconds: 0, frames: 0 };
    }
    const fps = getFrameRate(showreelFormat.standard);
    const totalFrames = sumDurationFrames(timelineClips, fps);
    return framesToDuration(totalFrames, fps);
  }, [timelineClips, showreelFormat]);

  // Header へ渡す showreelInfo を合成
  const showreelInfo: ShowreelInfo = useMemo(
    () => ({
      name: showreelName,
      format: showreelFormat,
      totalDuration,
    }),
    [showreelName, showreelFormat, totalDuration]
  );
  console.log(showreelInfo);

  const addedClipIds = useMemo(
    () => new Set(timelineClips.map((clip) => clip.id)),
    [timelineClips]
  );

  // クリップをタイムラインに追加（DNDとボタンで共通）
  const handleAddClip = (clipId: string) => {
    // 重複追加防止
    if (addedClipIds.has(clipId)) return;

    const clip = libraryClips.find((c) => c.id === clipId);
    if (!clip) return;

    // タイムラインが空（1本目）の場合: フォーマット確定
    if (timelineClips.length === 0) {
      setShowreelFormat({
        standard: clip.standard,
        resolution: clip.resolution,
      });
      setLastAddError(null); // エラーをクリア
      setTimelineClips((prev) => [...prev, clip]);
      setSelectedClipId(clip.id);
      return;
    }

    // タイムラインが空でない場合: フォーマット一致チェック
    const compatibility = getClipCompatibility(clip, showreelFormat);
    if (!compatibility.ok) {
      const errorMessage = `${formatCompatibilityReasons(compatibility, clip, showreelFormat)}のため追加できません`;
      setLastAddError(errorMessage);
      return;
    }

    // 追加成功時にエラーをクリア
    setLastAddError(null);
    setTimelineClips((prev) => [...prev, clip]);
    setSelectedClipId(clip.id);
  };

  const handleDragStart = (event: {
    active: { data: { current?: { clipId?: string } } };
  }) => {
    const clipId = event.active.data.current?.clipId;
    if (clipId) {
      setActiveClipId(clipId);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveClipId(null);

    const { active, over } = event;

    if (!over || over.id !== 'timeline') {
      return;
    }

    const clipId = active.data.current?.clipId as string | undefined;
    if (!clipId) return;

    handleAddClip(clipId);
  };

  const handleRemoveClip = (clipId: string) => {
    setTimelineClips((prev) => {
      const newClips = prev.filter((clip) => clip.id !== clipId);
      // タイムラインが空になったらフォーマットをリセット
      if (newClips.length === 0) {
        setShowreelFormat(null);
      }
      return newClips;
    });
    setSelectedClipId((prev) => (prev === clipId ? undefined : prev));
  };

  const handleSelectClip = (clipId: string) => {
    setSelectedClipId(clipId);
  };

  const handleReorderClips = (clips: Clip[]) => {
    setTimelineClips(clips);
  };

  const activeClip = activeClipId
    ? libraryClips.find((c) => c.id === activeClipId)
    : null;

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex h-screen flex-col bg-background overflow-hidden">
        <Header showreelInfo={showreelInfo} onNameChange={handleNameChange} />
        <main className="flex-1 min-h-0 bg-border">
          <div className="grid h-full gap-px lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <div className="grid grid-rows-[1fr_auto] gap-px">
              <Panel className="min-h-0">
                <PanelHeader>
                  <div>
                    <PanelTitle>再生プレビュー</PanelTitle>
                    <PanelDescription>
                      ショーリールの再生エリア（準備中）
                    </PanelDescription>
                  </div>
                </PanelHeader>
                <PanelContent className="flex items-center justify-center">
                  <div className="flex h-full w-full items-center justify-center rounded border border-dashed bg-muted/30 text-sm text-muted-foreground">
                    ここにプレビューが表示されます
                  </div>
                </PanelContent>
              </Panel>

              <TimelinePanel
                clips={timelineClips}
                selectedClipId={selectedClipId}
                onSelectClip={handleSelectClip}
                onRemoveClip={handleRemoveClip}
                onReorderClips={handleReorderClips}
                errorMessage={lastAddError ?? undefined}
              />
            </div>

            <ClipLibraryPanel
              clips={libraryClips}
              addedClipIds={addedClipIds}
              isFormatLocked={timelineClips.length > 0}
              lockedFormat={showreelFormat}
              onAddClip={handleAddClip}
            />
          </div>
        </main>
      </div>

      <DragOverlay>
        {activeClip ? <ClipLibraryItem clip={activeClip} /> : null}
      </DragOverlay>
    </DndContext>
  );
}

export default App;

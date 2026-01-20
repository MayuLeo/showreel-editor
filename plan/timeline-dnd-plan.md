# タイムラインD&D配置 実装計画

## 目的
- クリップライブラリからタイムラインへドラッグ&ドロップで追加できるようにする。
- タイムラインのクリップ表示を左詰め・横方向の並びに変更する。
- サンプル追加機能（ボタン/ロジック）を削除する。

## 前提/方針
- D&Dはライブラリ → タイムラインへの追加のみ（タイムライン内の並び替えは後続）。
- タイムラインに同一クリップの重複追加は不可（追加済みなら無視）。
- 既存の`Clip`型を維持し、タイムラインは`Clip[]`で保持する。

## 影響範囲（想定）
- `src/App.tsx`（状態管理、D&Dイベント、ClipLibraryPanel導入）
- `src/components/timeline/TimelinePanel/TimelinePanel.tsx`
- `src/components/timeline/TimelinePanel/type.ts`
- `src/components/timeline/TimelineTrack/TimelineTrack.tsx`
- `src/components/timeline/TimelineEmptyState/TimelineEmptyState.tsx`
- `src/components/timeline/TimelineEmptyState/type.ts`
- `src/components/clip-library/*`（新規作成）
- `package.json`（D&Dライブラリ追加）

## 実装タスク

### 1) D&D基盤の導入
- 依存追加: `@dnd-kit/core`（必要なら `@dnd-kit/sortable` も追加）。
- DnDの対象範囲は`App`のメインレイアウト（タイムラインとライブラリを包含）。

### 2) クリップライブラリのUI実装
- `ClipLibraryPanel`を新規作成し、現状のプレースホルダーを置き換える。
- ライブラリ一覧は`ScrollArea` + カード一覧で表示。
- `ClipLibraryItem`を`useDraggable`でドラッグ可能にする。
  - `data`に`clipId`を持たせて`onDragEnd`で参照。
  - 視覚的にドラッグ中の状態（opacityなど）を付ける。

### 3) タイムラインのドロップ領域化
- `TimelineTrack`（または`TimelinePanel`）に`useDroppable`を追加。
- `onDragEnd`で`over.id === 'timeline'`なら追加処理を実行。
- ドロップ可能時に境界線/背景を変えるなどの視覚的フィードバックを追加。

### 4) タイムライン表示の横並び化
- `TimelineTrack`のレイアウトを縦 → 横へ変更。
  - 例: `flex flex-row flex-nowrap items-stretch gap-3`
  - 左詰め維持のため`justify-start`を明示。
- `ScrollArea`を横スクロールに設定（`overflow-x-auto` / `pr-4`）。

### 5) サンプル追加機能の削除
- `TimelinePanelProps`から`onAddSample`を削除。
- `TimelinePanel`から`TimelineEmptyState`への`onAddSample`渡しを削除。
- `TimelineEmptyState`からボタンと`onAddSample`依存を削除。
- `App.tsx`の`handleAddSampleClips`関数と呼び出しを削除。

### 6) 追加ロジック（App）
- `onDragEnd`で`clipId`を取得し、未追加なら末尾に追加。
  - `setTimelineClips((prev) => [...prev, clip])`
  - `setSelectedClipId(clip.id)`で新規追加を選択状態に。
- 追加済みの場合は無視（将来的に「移動/並び替え」へ拡張）。

## 受け入れ条件
- クリップライブラリからドラッグしてタイムラインに追加できる。
- 追加されたクリップは左詰めで横方向に並ぶ。
- サンプル追加ボタン・ロジックがUI/コードから消える。
- 空状態でも「ドラッグして追加」案内が表示される。

## 確認手順（手動）
- ライブラリの任意のクリップをタイムラインへドロップして追加されること。
- 追加順が左→右に並び、横スクロールで閲覧できること。
- 既に追加済みのクリップをドロップしても重複しないこと。
- サンプル追加ボタンが表示されないこと。

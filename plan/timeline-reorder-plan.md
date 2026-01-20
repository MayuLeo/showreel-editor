# タイムライン並び替え 実装計画

## 目的
- タイムラインに追加済みのクリップをドラッグ&ドロップで並び替え可能にする。
- 既存の横並びレイアウト/選択/削除挙動を維持する。

## 前提/方針
- 既存のD&D基盤（`@dnd-kit/core`）を利用する想定。
- 並び替え対象はタイムライン内の`Clip[]`のみ。
- クリップの重複追加や削除は既存挙動を踏襲する。

## 影響範囲（想定）
- `src/components/timeline/TimelineTrack/TimelineTrack.tsx`
- `src/components/timeline/TimelineClipCard/TimelineClipCard.tsx`
- `src/components/timeline/TimelineTrack/type.ts`
- `src/App.tsx`（並び替え結果を反映する更新関数）
- `package.json`（必要に応じて`@dnd-kit/sortable`追加）

## 実装タスク

### 1) D&Dの並び替え拡張
- `@dnd-kit/sortable` を導入（未導入なら追加）。
- `TimelineTrack`で`SortableContext`と`arrayMove`を利用。
- `TimelineClipCard`を`useSortable`対応にする。

### 2) 並び替え用データとイベント
- `TimelineTrack`に`items`として`clips.map((clip) => clip.id)`を渡す。
- `onDragEnd`で`active.id`と`over.id`を比較し、順序が変わった場合のみ更新。
- 変更を`App.tsx`へ伝搬するため、`onReorderClips`（`(next: Clip[]) => void`）を追加。

### 3) 横並びでのソート設定
- `horizontalListSortingStrategy`を採用。
- `restrictToHorizontalAxis`、`restrictToParentElement`などのモディファイアを検討。
- ドラッグ中のクリップに視覚的フィードバック（shadow/opacity）を付与。

### 4) 既存機能の維持
- クリック選択、削除ボタンは引き続き動作。
- D&D中はクリック選択を誤発火させないようにイベント制御を調整。

## 受け入れ条件
- 追加済みクリップをドラッグすると、左右に並び替えできる。
- 並び替え後の順序が状態（`timelineClips`）に反映される。
- クリック選択/削除が引き続き動作する。

## 確認手順（手動）
- タイムライン内の任意のクリップを左右にドラッグして順序が変わること。
- 並び替え後に別クリップを選択してもUIが破綻しないこと。
- 削除ボタンがドラッグ中/通常時ともに動作すること。

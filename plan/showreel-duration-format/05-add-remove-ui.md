# 05) 追加/削除UIの仕上げ（D&D + 追加ボタン）

## 目的

- 要件「リストからの追加/削除」を D&D だけに依存せず、**ボタンでも追加**できるようにする
- D&D とボタン追加で **同じ追加ロジック**を使い、フォーマットロック/混在禁止/重複禁止が一貫するようにする

## 変更対象（想定）

- `src/App.tsx`
- `src/components/clip-library/ClipLibraryPanel/ClipLibraryPanel.tsx`
- `src/components/clip-library/ClipLibraryItem/ClipLibraryItem.tsx`
- `src/components/timeline/*`（削除は既存のままでOK）

## 実装方針

### 1) 追加ロジックの共通化

- `App.tsx` に `handleAddClip(clipId: string)` を新設
- `handleDragEnd` は「ドロップ検出 + clipId取得」までにし、実際の追加は `handleAddClip` を呼ぶ

### 2) 追加ボタンの導入

- `ClipLibraryItem` に「追加」ボタンを表示（右上など）
- 無効化条件はステップ04と同一
  - `isAdded === true` → disabled
  - `isFormatLocked === true` かつ `!isCompatible` → disabled
- 押下時は `onAdd(clip.id)` を呼ぶ

### 3) Propsの流れ（最小）

- `App.tsx` → `ClipLibraryPanel`
  - `clips`
  - `addedClipIds`
  - `isFormatLocked`
  - `lockedFormat?`
  - `onAddClip`

- `ClipLibraryPanel` → `ClipLibraryItem`
  - `clip`
  - `isAdded`
  - `disabled` / `disabledReason`（任意）
  - `onAdd`

## 実装上の注意（B案との整合）

- タイムライン空のとき
  - 追加ボタンは基本「有効」
  - 追加される1本目でフォーマットが確定することを、ライブラリパネルの説明文に出すと分かりやすい（任意）

- 最後の1本を削除したとき
  - 次の追加で再設定可能になる（= 追加ボタンが再び広く有効になる）

## このステップの完了条件

- D&D でも「追加」ボタンでも、追加/重複禁止/混在禁止/フォーマット確定（B案）が同じ挙動になる
- 削除ボタンでクリップを消すと合計再生時間が減る
- 最後の1本を削除して空にすると、次の1本目追加で別フォーマットを選べる（B案の再設定）


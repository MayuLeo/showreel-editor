# 04) 混在禁止のガードレール（UI無効化 + 追加前検証）

## 目的

- フォーマット確定後（`isFormatLocked === true`）に、
  - **UIで不一致クリップを追加できない状態にする**（一次防衛）
  - **追加処理でも必ず弾く**（二次防衛）
- 「なぜ追加できないか」がUIで分かるようにする（PoCは最小でOK）

## 変更対象（想定）

- `src/App.tsx`（追加前検証 + エラー表示状態）
- `src/components/clip-library/ClipLibraryPanel/ClipLibraryPanel.tsx`（互換性評価と表示）
- `src/components/clip-library/ClipLibraryItem/ClipLibraryItem.tsx`（ドラッグ/追加ボタン無効化、理由表示）
- 新規 `src/lib/compatibility.ts`（任意。小さければ `src/lib/timecode.ts` とは別に切る）

## 互換性判定（共通関数）

- `getClipCompatibility(clip: Clip, lockedFormat?: VideoFormat)`
  - `lockedFormat` が未指定（=タイムライン空）なら `ok: true`
  - 指定ありなら以下をチェック:
    - `clip.standard === lockedFormat.standard`
    - `clip.resolution === lockedFormat.resolution`
  - `reasons` は `['standard']` / `['resolution']` / `['standard','resolution']` を返す

## UI側（一次防衛）

- `ClipLibraryPanel` に以下を渡せるようにする
  - `isFormatLocked: boolean`
  - `lockedFormat?: VideoFormat`（`isFormatLocked` のときのみ）
  - `onAddClip?: (clipId: string) => void`（ステップ05で使用）

- 各 `ClipLibraryItem` へ渡す（例）
  - `isAdded`（既存）
  - `disabled = isAdded || (isFormatLocked && !isCompatible)`
  - `disabledReason`（任意）:
    - `追加済み`
    - `フォーマット不一致（ショーリール: PAL/HD）`

- 表示案（最小）
  - バッジ:
    - 追加済: `追加済`
    - 不一致: `非対応`
  - 1行説明（小さく）:
    - `ショーリール: PAL/HD` / `このクリップ: NTSC/SD`

## 追加処理側（二次防衛）

- `App.tsx` の共通追加関数（`handleAddClip`）内で必ずチェック
  - `timelineClips.length === 0` の場合はOK（B案）。追加直前に `format` を上書き。
  - `timelineClips.length > 0` の場合は `getClipCompatibility(clip, format)` を通す
    - `ok === false` の場合:
      - 追加せず `return`
      - `lastAddError` に短い文言を入れる（例: `フォーマットが一致しないため追加できません（ショーリール: PAL/HD）`）

## エラー表示（PoC最小）

- `lastAddError: string | null` を `App.tsx` に持つ
- 表示位置（どちらか）
  - **案A**: `TimelinePanel` の `PanelDescription` 直下に赤文字で表示
  - **案B**: `Header` 直下に簡易バナー（`div` + `border-destructive`）
- クリップ追加が成功したら `lastAddError` をクリアする（ユーザーの混乱を減らす）

## このステップの完了条件

- フォーマット確定後、不一致クリップはドラッグできない（カーソル/見た目も無効化）
- 何らかの経路で追加処理が呼ばれても、不一致はタイムラインに入らない
- 不一致時に「理由」が分かる（バッジ/文言のどちらか）

## 次のステップ

- `05-add-remove-ui.md`（「追加ボタン」導入と D&D との共通化）


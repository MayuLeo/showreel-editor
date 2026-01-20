# 03) フォーマット確定（B案）: 初回追加でロック、空で再設定可能

## 目的

- タイムラインが空のときは **任意のクリップを追加できる**
- 1本目の追加時に、そのクリップの `standard/resolution` で **ショーリールのフォーマットを確定（ロック）**
- 最後の1本を削除して空になったら、次の1本目追加で **再びフォーマットを再設定可能**

## 状態の考え方（B案）

- `isFormatLocked = timelineClips.length > 0`
  - `true`: 以後はフォーマット一致のみ追加可
  - `false`: 1本目なので何でも追加可（追加直前に format を上書きしてロック）

## 変更対象（想定）

- `src/App.tsx`
- `src/components/clip-library/ClipLibraryPanel/ClipLibraryPanel.tsx`（表示文言・互換性判定に影響）

## 実装ルール（追加処理の要点）

- 追加処理は D&D と「追加ボタン」で共通化する（`handleAddClip(clipId)` を作る）
- `handleAddClip` 内で以下を保証する:
  1. **重複追加防止**（既に追加済みならreturn）
  2. 対象クリップ取得（`libraryClips` から検索）
  3. `timelineClips.length === 0` の場合:
     - `setFormat({ standard: clip.standard, resolution: clip.resolution })` を先に実行（ロック開始）
     - 互換性チェックは不要（常にOK）
  4. `timelineClips.length > 0` の場合:
     - `format` と `clip` の `standard/resolution` が一致しないならreturn（この後のステップ04で理由をUI表示）
  5. `setTimelineClips((prev) => [...prev, clip])`

## 実装ルール（削除の要点）

- `handleRemoveClip` は現状通り `setTimelineClips(filter)` でOK
- **最後の1本を削除して空になったとき**
  - `isFormatLocked` は自動的に `false` へ（派生）
  - `format` の表示は「前回値のまま」でもPoCとして成立
  - 誤解回避のため、ライブラリ側に「空のときは1本目でフォーマットが確定します」を出すのが安全（任意）

## このステップの完了条件

- タイムライン空で NTSC/SD を追加すると、ヘッダーのフォーマット表示が NTSC/SD に更新される
- 空で PAL/HD を追加しても同様に更新される（“最初に追加したものが基準”）
- 最後の1本を削除して空にした後、別フォーマットの1本目を追加すると、フォーマットがその値へ更新される

## 次のステップ

- `04-compatibility-guardrails.md`（ロック時の不一致ブロックをUI/ロジックで二重化）


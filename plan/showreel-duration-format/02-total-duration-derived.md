# 02) 合計再生時間（totalDuration）を `timelineClips` から派生算出

## 目的

- 合計再生時間を `useState` で保持せず、`timelineClips` から **常に正しく再計算**される状態にする。
- 追加/削除/並び替えのすべてで「更新漏れ」が起きないようにする。

## 変更対象（想定）

- `src/App.tsx`
- `src/types/showreel.ts`（必要なら型整理）
- `src/components/header/*`（表示は現状のままでOK）

## 実装方針

- **Stateを分割する**
  - 入力（State）: `name`, `format`
  - 派生（Derived）: `totalDuration`（`timelineClips` から算出）

- **`Header` へ渡す `showreelInfo` は都度組み立てる**
  - `ShowreelInfo` 型は維持してよい（ただし `useState<ShowreelInfo>` はやめる）
  - 例: `const showreelInfo: ShowreelInfo = { name, format, totalDuration }`

## 算出ルール（B案前提）

- fpsは `format.standard` から決める
  - `fps = getFrameRate(format.standard)`
- タイムラインが空のとき
  - `totalDuration = 00:00:00:00`
  - fpsは実質影響しない（0固定）
- タイムラインが空でないとき
  - `sumDurationFrames(timelineClips, fps)` を合算し `framesToDuration` へ変換

## 実装ステップ（具体）

1. `timelineClips` から `totalDuration` を `useMemo` で導出する
2. `showreelInfo` を `useMemo` または単純なオブジェクト合成で作る
3. `Header` には `showreelInfo` を渡す（表示コンポーネントの変更は最小）

## このステップの完了条件

- クリップ追加/削除で、ヘッダーの「合計再生時間」が即時に変わる
- 並び替えでは「合計再生時間」が変わらない（内容の合算にのみ依存）

## 次のステップ

- `03-format-locking-b.md`（初回追加でフォーマット確定、空で再設定可能）

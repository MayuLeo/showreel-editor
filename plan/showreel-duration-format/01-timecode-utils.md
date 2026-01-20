# 01) タイムコード計算ユーティリティ（フレーム整数）

## 目的

- `HH:MM:ss:ff` を **fpsに基づくフレーム整数**へ変換して、差分・合算を正確に扱う。
- PAL(25fps) / NTSC(30fps) の違いを **計算で破綻させない**。

## 実装先

- 新規: `src/lib/timecode.ts`

## 実装内容（関数）

- **fps取得**
  - `getFrameRate(standard: VideoStandard): number`
  - 返り値: `PAL -> 25`, `NTSC -> 30`

- **タイムコード → 総フレーム**
  - `timecodeToFrames(timecode: Timecode, fps: number): number`
  - 計算: \((hours*3600 + minutes*60 + seconds) \* fps + frames\)

- **総フレーム → Duration**
  - `framesToDuration(totalFrames: number, fps: number): Duration`
  - 期待: `frames < fps` を満たすように `hours/minutes/seconds/frames` に正規化

- **クリップ長（フレーム）**
  - `clipDurationFrames(clip: Clip, fps: number): number`
  - `end < start` など不正データ対策として `max(0, end - start)` を基本にする

- **複数クリップ合算（フレーム）**
  - `sumDurationFrames(clips: Clip[], fps: number): number`
  - `reduce` で加算

## 入出力型

- 入力は既存型を使用
  - `Timecode`, `VideoStandard`, `Clip` は `src/types/clip.ts`
  - `Duration` は `src/types/showreel.ts`

## 端数/境界条件（必ず決める）

- **負数の扱い**: `framesToDuration` は `totalFrames` が負の場合でも破綻しないようにし、原則 `max(0, totalFrames)` で丸める（PoCではこれで十分）
- **オーバーフロー**: `Timecode.frames` が `fps` 以上のケースは入力不正だが、PoCでは「そのまま計算」でもよい（将来は正規化/バリデーションを追加）

## このステップの完了条件

- PAL/NTSC それぞれで、`timecodeToFrames` と `framesToDuration` が相互に矛盾しない（少なくともサンプルデータの範囲で）
- `clipDurationFrames` が常に 0 以上

## 次のステップ

- `02-total-duration-derived.md`（`timelineClips` から合計再生時間を派生算出）

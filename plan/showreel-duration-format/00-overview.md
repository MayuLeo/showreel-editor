# 合計再生時間の自動更新 + フォーマット混在禁止 実装計画

## 対象要件（`plan/product-detail.md`）

- **クリップの追加/削除をUIで行え、その結果として合計再生時間が更新されること**
- **1つのショーリール内で、ビデオ規格（PAL/NTSC）と解像度（SD/HD）を混在できないこと**

## 現状（実装の棚卸し）

- 追加/削除
  - ライブラリ → タイムライン追加: `src/App.tsx` の `handleDragEnd`（`@dnd-kit/core`）で実装済み
  - タイムライン削除: `src/App.tsx` の `handleRemoveClip` で実装済み
- 合計再生時間
  - `Header` は `showreelInfo.totalDuration` を表示するが、`timelineClips` の増減と連動していない（固定値のまま）
- 混在禁止（フォーマット制約）
  - 追加時のフォーマット一致チェックが未実装（現状はどのクリップでも追加可能）

## ゴール（UX/データ整合性）

- **追加/削除のたびに、ヘッダーの合計再生時間が即時に正しい値へ更新される**
- **タイムラインが空のときは、任意のクリップを追加でき、1本目追加時にショーリールのフォーマットがそのクリップで確定する（B案）**
- **フォーマット確定後は、不一致のクリップを追加できない（ドラッグ/追加ボタン無効 + 最終チェックで弾く）**
- **タイムライン上のクリップ配列は常に単一フォーマット（standard/resolution）に揃う**

## 方針（結論）

1. **合計再生時間は“状態”として保持せず、`timelineClips` から算出する派生値にする（stale防止）**
2. **フォーマット混在禁止は、UI層とドメイン層の二重で守る（入口で止めて、最後に検証）**
3. **計算は浮動小数ではなく“フレーム整数”で行い、PAL/NTSCのfps差を正確に扱う**
4. **ショーリールのフォーマットは「初回追加で確定」し、タイムラインが空に戻ったら再設定可能にする（B案採用）**

## 実装設計（詳細）

### 1) フレームレートとタイムコード計算ユーティリティ

#### 目的

- `HH:MM:ss:ff` を **fpsに基づくフレーム総数**へ変換し、差分と合算を正確に計算できるようにする。

#### 追加する関数（例）

- `getFrameRate(standard: VideoStandard): number`
  - `PAL -> 25`, `NTSC -> 30`
- `timecodeToFrames(timecode: Timecode, fps: number): number`
  - \((hours*3600 + minutes*60 + seconds) \* fps + frames\)
- `framesToDuration(totalFrames: number, fps: number): Duration`
  - `hours/minutes/seconds/frames` に正規化（繰り上がりを正しく処理）
- `clipDurationFrames(clip: Clip, fps: number): number`
  - `max(0, endFrames - startFrames)`（不正データ対策）
- `sumDurationFrames(clips: Clip[], fps: number): number`
  - `reduce` で合算

#### 実装場所（推奨）

- 新規: `src/lib/timecode.ts`（ドメイン計算を型定義ファイルから分離）
  - 既存: `src/types/showreel.ts` にある `createDuration` は、将来的に置き換え/非推奨化（浮動小数由来の誤差リスク）

### 2) 合計再生時間（totalDuration）の算出と表示連動

#### 現状の課題

- `showreelInfo.totalDuration` が `useState` にあり、`timelineClips` とは独立しているため **更新漏れが起きる構造**。

#### 推奨アプローチ（派生値化）

- `showreelInfo` を以下に分割（または合成）する:
  - **入力（State）**: `name`, `format`
  - **派生（Derived）**: `totalDuration`（`timelineClips` から計算）
- 例: `App.tsx` 内で `useMemo` により `totalDuration` を算出し、`Header` へ渡す `showreelInfo` を組み立てる
  - `timelineClips` が変われば必ず再計算される（追加/削除/並び替えに安全）

#### fpsの決め方

- **原則**: `showreelInfo.format.standard` から fps を決定する（PAL=25 / NTSC=30）
- 混在禁止を守るため、`timelineClips` 内の `clip.standard` は常に `showreelInfo.format.standard` と一致している状態を保つ
- B案では、タイムラインが空の間は `totalDuration = 0` のため fps は実質影響しない。1本目追加時に `showreelInfo.format` を上書きし、その fps で計算する。

### 3) フォーマットの決め方（採用: B案 = 初回追加で確定 / クリアで再設定可能）

#### 採用仕様（B案）

- **フォーマット確定状態**は派生で判定する:
  - `isFormatLocked = timelineClips.length > 0`
- **タイムラインが空（`isFormatLocked === false`）のとき**
  - 任意のクリップを追加可能（互換性チェックは常にOK）
  - 1本目を追加する直前に `showreelInfo.format` を追加対象クリップの `standard/resolution` に上書きして「確定」させる
- **タイムラインが空でない（`isFormatLocked === true`）のとき**
  - `showreelInfo.format` と一致するクリップのみ追加可能（不一致はブロック）
- **最後の1本を削除してタイムラインが空になったとき**
  - `isFormatLocked` は自動的に `false` になり、次の追加で再び1本目としてフォーマットが確定する
  - `showreelInfo.format` の表示は「前回確定値のまま」でもPoCとして成立（ただし“空＝再設定可能”は説明文などで補うのが安全）

### 4) フォーマット混在禁止（standard/resolution一致）の設計

#### ルール（不変条件）

- `timelineClips` に含まれるすべての `clip` について:
  - `clip.standard === showreelInfo.format.standard`
  - `clip.resolution === showreelInfo.format.resolution`
  - ※タイムラインが空のときは自明（違反が起こり得ない）

#### 検証関数（例）

- `getClipCompatibility(clip: Clip, lockedFormat?: VideoFormat)`
  - 返り値: `{ ok: boolean; reasons: ('standard'|'resolution')[] }`
  - `lockedFormat` が未指定（=タイムライン空）なら常に `ok: true`

#### “入口で止める” UI制御（一次防衛）

- `ClipLibraryPanel` 側で `isFormatLocked` と `lockedFormat`（`isFormatLocked` のときのみ）を受け取り、各クリップの互換性を評価して `ClipLibraryItem` に渡す:
  - `disabled: isAdded || (isFormatLocked && !isCompatible)`
  - 表示:
    - 追加済: `追加済`（既存）
    - 非互換: `非対応`（新規）
    - 理由表示（例）: `ショーリールは PAL/HD のため NTSC/SD は追加不可`
- `useDraggable({ disabled: ... })` を活用し、**そもそもドラッグ開始できない**ようにする
  - タイムラインが空のときは「この1本目でフォーマットが確定します」などの補助文があると誤解が減る（任意）

#### “最後に守る” 追加ハンドラ検証（二次防衛）

- `App.tsx` の追加処理（D&D/ボタン共通）で、追加前に必ず互換性チェック
  - タイムラインが空なら互換性はOK扱い + **追加直前に `showreelInfo.format` を上書きして確定**
  - タイムラインが空でない場合は不一致なら `return`（追加しない）
  - 可能なら **ユーザー向けのエラー表示**を行う（下記）

#### エラー/状態の見せ方（PoCでの最小案）

- `App.tsx` に `lastAddError`（string）を持たせ、以下のいずれかに表示:
  - `TimelinePanel` の `PanelDescription` 付近に小さく表示（赤系テキスト）
  - もしくは `Header` 直下にバナー（`div` + `border/destructive`）で表示
- トースト等のUI基盤が未導入のため、まずは **常時表示/数秒で消える簡易表示**から開始する

### 5) 追加/削除UIの整備（要件#25の満たし方）

#### 追加（ライブラリ → タイムライン）

- 現状: D&Dのみ
- 改善（推奨）:
  - `ClipLibraryItem` に **「追加」ボタン**を付ける（D&Dが難しい環境・アクセシビリティ対応）
  - ボタンも `isAdded` / `isCompatible` で無効化し、理由を表示
  - 実装は `App.tsx` に `handleAddClip(clipId)` を作ってD&Dと共有

#### 削除（タイムライン）

- 現状: `TimelineClipCard` の「削除」ボタンで対応済み
- 追加改善（任意）:
  - 選択中クリップに対する `Delete/Backspace` ショートカット（PoCでは優先度低）

## 変更対象ファイル（想定）

- **合計再生時間の派生/計算**
  - `src/App.tsx`（`totalDuration` 派生、Headerへ連動）
  - 新規 `src/lib/timecode.ts`（timecode/framesユーティリティ）
- **フォーマット混在禁止**
  - `src/App.tsx`（追加前の互換性チェック、エラーメッセージ状態）
  - `src/components/clip-library/ClipLibraryPanel/ClipLibraryPanel.tsx`（`isFormatLocked` / `lockedFormat` を受け取り、互換性評価）
  - `src/components/clip-library/ClipLibraryItem/ClipLibraryItem.tsx`（非互換の見た目/無効化/理由表示）
- **型/ユーティリティ**
  - `src/types/showreel.ts`（必要なら `createDuration` の置換/整理）

## 受け入れ条件（Definition of Done）

- クリップを追加すると、ヘッダーの **合計再生時間が増える**（正しい `hh:mm:ss:ff` 表記）
- クリップを削除すると、ヘッダーの **合計再生時間が減る**（0未満にならない）
- タイムラインが空のときは、任意のクリップを追加できる
  - 1本目追加時にヘッダーのフォーマット表示が **そのクリップの `standard/resolution` に更新される**
- フォーマット確定後（タイムラインが空でない）は、ショーリールのフォーマットと異なるクリップは:
  - ライブラリ上で **ドラッグ不可/追加不可**として明示される
  - 何らかの操作でドロップしても **タイムラインに追加されない**
- タイムラインに存在するクリップは常に **単一フォーマットに揃っている**
- 最後の1本を削除してタイムラインが空になったら、次の追加で再びフォーマットが確定できる（B案の“再設定可能”）

## 手動確認手順（最小チェック）

1. タイムライン空の状態で任意のクリップ（例: NTSC/SD）を追加 → 合計再生時間が加算され、フォーマット表示も NTSC/SD に確定する
2. 確定後に不一致フォーマット（例: PAL/HD）を追加しようとする → 追加されず、理由がUIで分かる
3. 追加済みクリップを削除 → 合計再生時間が減算される
4. 最後の1本を削除して空にする → 次の追加で再びフォーマットが確定できる（例: PAL/HD の1本目を追加すると表示が PAL/HD に更新）
5. 複数クリップを追加しても、合計再生時間が常に一致する（並び替えでは変わらない）

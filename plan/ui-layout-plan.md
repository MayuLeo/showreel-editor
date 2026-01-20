# ショーリール編集UI レイアウト設計プラン

## 目的

- ショーリール編集のPOC UIを構成する主要エリアとコンポーネント構成を明確化する。
- ビデオ規格/解像度の統一制約と、合計再生時間の提示をUIに反映する。

## 更新メモ（UIデザイン方針の変更）

- 主要エリア（再生/タイムライン/ライブラリ）の見た目は、当初案の `Card` から **パネル敷き詰め（Panel）** へ移行する。
- レイアウトは **`container` を撤廃してフル幅ワークスペース化**し、角丸は**基本なし**（敷き詰め優先）。
- デザイン更新の詳細（パネルの器・区切り線・余白・置換範囲）は `ui-panel-redesign-plan.md` を参照。

## 画面構成（トップレベル）

- `App`
  - `ShowreelEditorPage`
    - `HeaderBar`
    - `MainContent`
      - `PlaybackPanel`
      - `TimelinePanel`
      - `ClipLibraryPanel`

## 画面レイアウト（配置）

- **ヘッダー**: 画面上部に固定表示。
  - ショーリール名、ビデオ規格、ビデオ解像度、合計再生時間を表示。
- **メインエリア（ヘッダー下）**: 2カラム構成。
  - **左カラム**: 上に再生エリア、下に並び替え（タイムライン）エリア。
  - **右カラム**: クリップ一覧（ライブラリ）表示。D&Dでタイムラインに追加/並び替え。

## コンポーネント設計（責務）

### ページ構成

- `ShowreelEditorPage`
  - レイアウトの土台。ヘッダーと2カラムを配置。
  - 区画の器: `Panel`（新規） + `Separator` をエリア分割に利用（`Card` は情報カード用途に限定）。

### ヘッダー領域

- `HeaderBar`
  - 表示: ショーリール名、ビデオ規格、ビデオ解像度、合計再生時間。
  - 入力: ショーリール名の編集。
  - Shadcn: `Input`, `Badge`, `Label`, `Button`（名前の保存/リセットの想定）。
- `FormatSummary`
  - 表示: `PAL/NTSC` と `SD/HD` をコンパクト表示。
  - Shadcn: `Badge`（規格・解像度を色分け）。
- `DurationDisplay`
  - 表示: 合計再生時間（hh:mm:ss:ff）。
  - Shadcn: `Badge` または `Card` の右寄せ表示。

### 再生エリア

- `PlaybackPanel`
  - 表示: 現在のショーリールのプレビュー領域。
  - 役割: 将来的な再生UIのプレースホルダー。
  - Shadcn: `Card`, `AspectRatio`, `Skeleton`（未実装時の仮表示）。

### タイムライン領域

- `TimelinePanel`
  - 表示: 追加済みクリップの並び（タイムライン/ストリップ）。
  - 操作: D&Dによる並び替え、削除。
  - 表示: クリップ合計再生時間の更新に寄与。
  - Shadcn: `Card`, `ScrollArea`, `Button`, `Separator`。
- `TimelineTrack`
  - 表示: クリップの並びを水平/縦方向に表示。
  - 操作: 並び替えのドロップ領域。
- `TimelineClipCard`
  - 表示: クリップ名、説明、開始/終了タイムコード。
  - 操作: 削除ボタン、選択状態。
  - Shadcn: `Card`, `Button`, `Badge`。
- `TimelineEmptyState`
  - 表示: クリップ未追加時のガイダンス。
  - Shadcn: `Card`, `Button`（サンプル追加など）。

### クリップライブラリ領域

- `ClipLibraryPanel`
  - 表示: 利用可能なクリップ一覧。
  - 操作: D&Dでタイムラインへ追加。
  - Shadcn: `Card`, `ScrollArea`, `Input`（検索用）。
- `ClipLibraryHeader`
  - 表示: タイトル、検索入力、フィルタ（任意）。
  - Shadcn: `Input`, `Button`, `Badge`。
- `ClipLibraryList`
  - 表示: クリップのカード一覧。
  - Shadcn: `ScrollArea`, `Card`。
- `ClipLibraryItem`
  - 表示: クリップ名、規格/解像度、再生時間。
  - 操作: タイムラインへドラッグ。
  - Shadcn: `Card`, `Badge`。

### バリデーション/状態表示

- `RuleViolationBanner`
  - 表示: 規格/解像度不一致で追加不可の警告。
  - Shadcn: `Alert`。

## 状態設計（想定）

- `showreel`
  - `name`
  - `videoStandard` (PAL / NTSC)
  - `videoResolution` (SD / HD)
  - `clips` (タイムライン配列)
- `clipLibrary`
  - `clips` (ライブラリ配列)
- `derived`
  - `totalDuration` (clips から算出)

## 主要インタラクション

- クリップ追加: ライブラリ → タイムラインへD&D。
- クリップ削除: タイムライン内の削除操作。
- クリップ並び替え: タイムライン内でD&D。
- ルール制約: 規格/解像度が異なるクリップは追加不可（後続で検証UI/メッセージ）。

## レイアウト実装方針（簡易）

- レイアウト: CSS Grid もしくは Flexで2カラム。
- 余白/区切り: `HeaderBar` と `MainContent` を視覚的に区切る。
- D&D: POC段階ではプレースホルダー。後続でD&Dライブラリ導入を検討。

## 進行タスク（概要）

1. レイアウトの骨組み実装（ヘッダー/左カラム/右カラム）。
2. 各コンポーネントの表示プレースホルダー作成。
3. 状態の仮データ配置と合計再生時間の表示。
4. D&D操作の導入（後続フェーズ）。

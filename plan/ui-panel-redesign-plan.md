# パネル敷き詰めUI（Editor Shell）デザイン更新プラン

## 目的

- ショーリール編集PoCとして、**「編集ソフトらしい」パネル敷き詰めUI**へ寄せる。
- 現状の `Card` 前提の見た目（角丸・影・大きい余白）を減らし、主要エリア（再生/タイムライン/ライブラリ）を**区画（Panel）として一体化**して見せる。
- D&D・スクロールなど、編集作業で重要な「境界」「領域」を視認しやすくする。

## 背景

現状は以下が `Card` コンポーネントで表現されている。

- 再生プレビュー（`App.tsx`）
- タイムライン（`TimelinePanel` / `TimelineEmptyState` / `TimelineClipCard`）
- クリップライブラリ（`ClipLibraryPanel` / `ClipLibraryItem`）

`Card` は「情報カード」的な見せ方（角丸・影・余白）に寄り、NLE（ノンリニア編集）系UIが持つ「ワークスペースの区画」感とズレやすい。

## 更新方針（結論）

- **主要領域は `Card` ではなく Panel（区画）として表現**する。
- パネル間の区切りは「余白（gap）」ではなく、**1px境界（Separator/ボーダー）**で作る。
- 「敷き詰め」を成立させるため、レイアウトの単位を以下に分離する。
  - **App Shell（全体の骨格）**: 背景・余白・分割（グリッド）
  - **Panel（区画の器）**: 見た目のルール（角丸・影・ヘッダー/ボディ）
  - **Item（リスト/クリップ）**: 編集対象の見せ方（行/タイル、選択/ドラッグ状態）

## デザイン仕様（案）

### 1) 画面全体（App Shell）

- **メイン領域は `container` を撤廃し、フル幅のワークスペースにする（確定）**
  - 目的: 「アプリ」感（キャンバスの広さ）を優先
  - 実装: 幅の上限は設けず、左右余白は `px-4` 程度に抑える（必要なら `max-w-none` を明示）
- **パネルの敷き詰め表現**
  - 親を `bg-border` にし、`gap-px` で区切る（＝線が見える）
  - 各パネルは `bg-card`（または `bg-background`）で塗る

推奨パターン（概念）:

- `grid gap-px bg-border`（外枠）
- `bg-card`（各パネル面）
- 余白はパネル内に持たせる（`p-3`〜`p-4`）

### 2) Panel（新規UIプリミティブ）

`Card` の代替として `Panel` を用意し、**影なし/角丸なし/境界**に寄せる。

- `Panel`
  - 役割: 区画の外枠（背景・境界・レイアウト）
  - スタイル案: `bg-card text-card-foreground flex flex-col min-h-0`（影なし）
  - 角丸は「敷き詰め」優先で **基本 `rounded-none`（外周も丸めない）**（確定）
- `PanelHeader`
  - 役割: タイトル＋補助情報＋ツール（右寄せ）
  - 高さ目安: 44〜56px（説明文の有無で可変）
  - 下線: `border-b` or `Separator`（ヘッダーとボディの境界を明確に）
- `PanelContent`
  - 役割: 本文（スクロール領域を置く場所）
  - ポイント: `min-h-0` + `overflow-hidden` を徹底し、`ScrollArea` が伸びるようにする

### 3) 区切り線（Seam/Divider）

「敷き詰め」を成立させるため、**gapで余白を作らない**。

- パネル間: `gap-px bg-border`（推奨）
- パネル内: `Separator`（ヘッダー/コンテンツ、セクション間）

※ パネル自体に `border` を付けると、敷き詰め時に二重線になりやすい。
外枠（App Shell）側で線を作るか、パネル側で線を作るかをどちらかに寄せる（推奨は前者）。

### 4) 各エリアの見せ方（更新案）

#### 再生プレビュー（Playback）

- 現状: `Card` + 中に点線プレースホルダー
- 更新:
  - Panel化してヘッダーを薄くする（タイトルのみ or タイトル＋状態）
  - プレースホルダーは panel 内に `border-dashed` を残してOK（「未実装」を明確に）

#### タイムライン（Timeline）

- 現状: `Card` + `Separator` + Track（ドロップ時にハイライト）
- 更新:
  - Panel化、ヘッダー右側にメタ情報（クリップ数）を残す
  - Track（ドロップ領域）の「点線枠」は “中身の領域” だけに出す（Panel全体に点線は出さない）

#### クリップライブラリ（Library）

- 現状: `Card` + `ScrollArea h-[400px]`
- 更新:
  - Panel化し、**右カラムは `h-full` を基準**にスクロールを成立させる
  - `ScrollArea` の高さ固定は避ける（レイアウト側で高さを決め、PanelContent内で伸ばす）

### 5) クリップアイテム（Item）の見せ方

敷き詰めUIでは、Itemも「カード」より「行/タイル」寄りが相性が良い。

- `ClipLibraryItem`
  - 現状: `Card`（ドラッグ可能）
  - 更新案:
    - `rounded-md border bg-background/??` 程度の“タイル”へ（影なし）
    - 追加済みは `opacity` + バッジ、ドラッグ不可の状態を明確に
- `TimelineClipCard`
  - 現状: `Card` + 選択リング + hover shadow
  - 更新案:
    - hover shadow をやめ、背景/境界色で反応を出す
    - 選択は `ring` ではなく `bg-accent/??` + `border-primary/??` などに寄せる（敷き詰めと相性が良い）

## 実装方針（2案）

### A案: `Card` のスタイルをPanel寄りに変更（最小変更）

#### 内容

- `src/components/ui/card.tsx` のデフォルトクラスを「影なし/角丸控えめ/余白縮小」へ変更

#### メリット

- 置換作業が不要（見た目が一気に変わる）

#### デメリット / 注意

- `CardHeader`/`CardContent` の `px-6` など、密度が上がりづらい可能性
- 将来「本当のカード」を使いたい場合に戻しづらい
- “Card” という名前と意味がズレる

### B案: `Panel` を新設して主要領域から置換（推奨）

#### 1) UIプリミティブ追加

- `src/components/ui/panel.tsx` を追加
  - `Panel`, `PanelHeader`, `PanelTitle`, `PanelDescription`, `PanelContent`, `PanelToolbar`（必要なら）

#### 2) App Shellのレイアウト更新

- `src/App.tsx`
  - `main` の `container` を撤廃（フル幅/余白最小）
  - `grid gap-6` を `gap-px bg-border` に変更し、パネル敷き詰めを表現
  - 主要3領域（再生/タイムライン/ライブラリ）のコンテナを `Panel` 化
  - `Header` 側も `container` を撤廃し、左右余白を `px-4` 程度に統一（全体の端揃え）

#### 3) 各パネルの置換

- `src/components/timeline/TimelinePanel/TimelinePanel.tsx`
  - `Card` → `Panel`
  - 内部 `Separator` を継続（ヘッダー/本文の境界）
- `src/components/clip-library/ClipLibraryPanel/ClipLibraryPanel.tsx`
  - `Card` → `Panel`
  - `ScrollArea` 高さ固定（`h-[400px]`）を撤廃し、PanelContentが伸びる設計へ

#### 4) Itemの見た目調整

- `src/components/clip-library/ClipLibraryItem/ClipLibraryItem.tsx`
  - `Card` → “Tile”表現（`div` + border + padding 等）へ
- `src/components/timeline/TimelineClipCard/TimelineClipCard.tsx`
  - `Card` → “Tile”表現へ
  - 選択/hover/drag の見た目をパネルUIに合わせる

#### 5) 空状態とドロップ強調の整理

- `src/components/timeline/TimelineEmptyState/TimelineEmptyState.tsx`
  - Panel化した上で「内側だけ点線」など、敷き詰めに合う形へ
- `src/components/timeline/TimelineTrack/TimelineTrack.tsx`
  - ドロップ中ハイライトは維持しつつ、線の出方（二重線）を調整

## 影響範囲（想定）

- レイアウト:
  - `src/App.tsx`
  - `src/components/header/*`（必要なら余白/幅の調整）
- UIプリミティブ:
  - `src/components/ui/panel.tsx`（新規）
- 主要領域:
  - `src/components/timeline/TimelinePanel/TimelinePanel.tsx`
  - `src/components/timeline/TimelineEmptyState/TimelineEmptyState.tsx`
  - `src/components/clip-library/ClipLibraryPanel/ClipLibraryPanel.tsx`
- アイテム:
  - `src/components/timeline/TimelineClipCard/TimelineClipCard.tsx`
  - `src/components/clip-library/ClipLibraryItem/ClipLibraryItem.tsx`

## 受け入れ条件（Definition of Done）

- 再生/タイムライン/ライブラリが「カード」ではなく**区画（パネル）として見える**。
  - 影（shadow）が主要領域に残っていない
  - パネル間が余白ではなく線で区切られている
- スクロール領域が “区画の中” に閉じ、見切れや高さ固定で破綻しない。
- D&Dの視覚フィードバック（ドロップ可能状態/ドラッグ中）は維持される。

## 手動確認（チェックリスト）

- 主要3領域の境界が視認でき、隙間が「余白」ではなく「区切り」に見える
- 画面高さを変えてもライブラリが自然にスクロールする（固定 400px のような不自然さが消える）
- ドラッグ中/ドロップ中の強調が分かる（Timeline側）
- クリップが選択状態のとき、パネルUIと馴染む見た目になっている

## 未確定事項（後で最終化）

- ライト/ダークどちらを基準に詰めるか（両対応は前提だが、基準の決め方）
- 将来的にリサイズ可能パネル（Splitter）を導入するか（今回は基本スコープ外）


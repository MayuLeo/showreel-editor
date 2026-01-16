# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

クリエイティブエージェンシー向けのショーリール編集POC UIです。ビデオクリップのコレクションから新しいショーリールを作成し、広告主に提示することを目的としています。

### 制約事項

- ビデオ規格とビデオ解像度を1つのビデオリール内で混在させることはできない
  - NTSC クリップを PAL ビデオリールに追加不可
  - HD クリップを SD ビデオリールに追加不可
- タイムコード形式: `HH:MM:ss:ff` (時:分:秒:フレーム)
- PAL: 25 fps (1フレーム = 40ms)
- NTSC: 30 fps

## 開発コマンド

```bash
# 開発サーバー起動
bun dev

# TypeScriptコンパイル & ビルド
bun run build

# Lintチェック
bun run lint

# コード整形
bun run format

# コード整形チェック
bun run format:check

# ビルド済みアプリのプレビュー
bun run preview
```

## 技術スタック

- **フレームワーク**: React 19 + TypeScript + Vite
- **スタイリング**: Tailwind CSS v4 (Vite Plugin使用)
- **UIコンポーネント**: shadcn/ui (New York style)
- **アイコン**: lucide-react
- **コンパイラ**: React Compiler有効化 (babel-plugin-react-compiler)
- **Lint**: ESLint + Prettier

## アーキテクチャ

### ディレクトリ構造

```
src/
├── components/
│   ├── ui/              # shadcn/ui ベースコンポーネント
│   │   ├── Badge/
│   │   ├── Button/
│   │   ├── Input/
│   │   └── Label/
│   └── header/          # ヘッダー関連コンポーネント
│       ├── Header/
│       ├── HeaderBar/
│       ├── DurationDisplay/
│       └── FormatSummary/
├── types/               # 型定義
│   ├── clip.ts          # Clip, VideoStandard, VideoResolution, Timecode
│   └── showreel.ts      # ShowreelInfo, Duration, VideoFormat + ヘルパー関数
├── data/
│   └── clips.ts         # サンプルクリップデータ
├── App.tsx              # ルートコンポーネント
└── main.tsx             # エントリーポイント
```

### コンポーネント設計方針

各UIコンポーネントは責務単位でディレクトリ分割:

- **バレル exports**: 各ディレクトリに `index.ts` を配置
- **共通パターン**: ButtonVariants.ts のようにVariants定義を分離
- **パスエイリアス**: `@/` で `./src/` を参照 (tsconfig.json & vite.config.ts)

### 型システム

- `VideoStandard`: `'PAL' | 'NTSC'`
- `VideoResolution`: `'SD' | 'HD'`
- `Timecode`: `{ hours, minutes, seconds, frames }`
- `Clip`: クリップの完全な情報 (id, name, description, standard, resolution, startTimecode, endTimecode)
- `ShowreelInfo`: ショーリールのメタ情報 (name, format, totalDuration)

### ヘルパー関数 (src/types/showreel.ts)

- `formatDuration(duration: Duration): string` - タイムコードを `HH:MM:ss:ff` 形式に変換
- `createDuration(totalSeconds: number, frameRate: number): Duration` - 秒数からDurationオブジェクトを生成

## UI設計構成 (計画)

```
App
└── ShowreelEditorPage
    ├── HeaderBar (実装済み)
    ├── MainContent
    │   ├── PlaybackPanel (未実装 - プレビュー領域)
    │   ├── TimelinePanel (未実装 - クリップタイムライン/並び替え)
    │   └── ClipLibraryPanel (未実装 - クリップ一覧/D&D元)
    └── RuleViolationBanner (未実装 - 規格不一致時の警告)
```

詳細は `plan/ui-layout-plan.md` を参照。

## TypeScript設定

- パスエイリアス: `@/*` → `./src/*`
- プロジェクト参照: `tsconfig.app.json`, `tsconfig.node.json`
- 型チェックを厳密に実施

## コーディング規約

- **React Compiler** が有効なため、手動のメモ化 (useMemo/useCallback) は不要
- **Prettier** によるコード整形を実施
- **import順序**: prettier-plugin-organize-importsで自動整理
- **コンポーネント命名**: PascalCase
- **型定義**: 明示的に型を付与 (type/interface使用)

# vibe起業.md - フロントエンド

このプロジェクトは、起業家がAIとの壁打ちを通じて企画書をMarkdown形式で生成・発展させるチャットアプリケーションです。

## 技術スタック

- Next.js 15.3.3
- React 19
- TypeScript
- Tailwind CSS
- Bun (パッケージマネージャー)
- OpenRouter API (GPT-4o)

## セットアップ

### 1. 依存関係のインストール

```bash
bun install
```

### 2. 環境変数の設定

`.env.local.example`をコピーして`.env.local`ファイルを作成し、OpenRouter APIキーを設定してください：

```bash
cp .env.local.example .env.local
```

`.env.local`ファイルを編集して、あなたのAPIキーを設定：

```
OPENROUTER_API_KEY=your-openrouter-api-key-here
```

OpenRouterのAPIキーは[こちら](https://openrouter.ai/keys)から取得できます。

### 3. 開発サーバーの起動

```bash
bun run dev
```

[http://localhost:3000](http://localhost:3000)でアプリケーションが起動します。

## 主な機能

- **AIとの壁打ちチャット**: 自然言語でアイデアや要望を入力すると、AIが企画書のセクションを自動更新
- **Markdown形式の企画書**: 構造化されたMarkdown形式で企画書を管理
- **リアルタイム更新**: チャットの内容に応じて企画書が動的に更新
- **エクスポート機能**:
  - クリップボードへのコピー
  - Markdownファイルとしてダウンロード

## プロジェクト構造

```
frontend/
├── src/
│   └── app/
│       ├── api/
│       │   └── apply-instruction/  # OpenRouter APIとの通信
│       ├── page.tsx               # メインページ（チャット + Markdownビュー）
│       ├── layout.tsx             # アプリケーションレイアウト
│       └── globals.css            # グローバルスタイル
├── .env.local.example             # 環境変数のテンプレート
└── package.json                   # 依存関係とスクリプト
```

## 開発時の注意事項

- このプロジェクトはBunを使用しています。`npm`や`yarn`の代わりに`bun`コマンドを使用してください
- APIキーは必ず`.env.local`に保存し、絶対にコミットしないでください
- `.gitignore`に`.env.local`が含まれていることを確認してください

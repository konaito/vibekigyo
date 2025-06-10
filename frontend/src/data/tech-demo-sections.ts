import { Sections } from '../types/chat';

export const techDemoSections: Sections = {
  '📌 プロジェクト概要': `| 項目 | 内容 |
|------|------|
| プロジェクト名 | vibeアプリ.md |
| 概要 | AI対話型の技術仕様書生成プラットフォーム |
| 目的 | エンジニアが即座に開発着手できる詳細な技術設計書を生成 |
| プラットフォーム | Web (React/Next.js)、モバイル対応予定 |
| MVP版 | v0.1 - 基本的な対話と仕様書生成機能実装済み |`,

  '🛠 技術仕様': `### フロントエンド技術スタック
- **フレームワーク**: Next.js 15.3 (App Router)
- **言語**: TypeScript 5.x
- **スタイリング**: Tailwind CSS 3.4
- **状態管理**: React Hooks (useState, useEffect)
- **Markdownレンダリング**: react-markdown + remark-gfm

### バックエンド技術スタック
- **API**: Next.js API Routes
- **AI Integration**: OpenRouter API (gpt-4o-search-preview)
- **環境変数管理**: dotenv

### データベース設計
- **現在**: LocalStorage (MVP版)
- **将来**: Supabase or Firebase Firestore

### 認証・セキュリティ
- **現在**: 未実装 (MVP版)
- **将来**: NextAuth.js + OAuth2

### インフラ・デプロイ
- **ホスティング**: Vercel
- **CI/CD**: GitHub Actions
- **モニタリング**: Vercel Analytics`,

  '🎨 UI/UX設計': `### デザインシステム
- **カラーパレット**: 
  - Primary: Purple (技術的な印象)
  - Secondary: Blue (信頼性)
  - Background: Gray gradient
- **タイポグラフィ**: システムフォント優先
- **レスポンシブ**: モバイルファースト設計

### コンポーネント設計
- **ChatMessages**: メッセージ表示コンポーネント
- **ChatInput**: 入力フォームコンポーネント
- **MarkdownPanel**: 仕様書表示・編集パネル
- **Header**: ナビゲーションヘッダー

### 画面遷移設計
- **/** : ビジネス企画書作成 (vibe起業.md)
- **/code**: 技術仕様書作成 (vibeアプリ.md)
- **localStorage**: アプリ間データ連携`,

  '⚡ 機能仕様・API設計': `### コア機能の技術実装
1. **AI対話機能**
   - OpenRouter API経由でGPT-4oと通信
   - Structured Output (JSON Schema)で応答制御
   - 3つの応答タイプ: chat/update/chat+update

2. **仕様書リアルタイム更新**
   - セクション単位の独立更新
   - 空文字列による削除機能
   - インライン編集機能

### API設計
\`\`\`typescript
// POST /api/apply-instruction
{
  instruction: string;
  sections: Record<string, string>;
  messages: Message[];
}

// Response
{
  type: 'chat' | 'update' | 'chat+update';
  message: string;
  markdown?: Record<string, string>;
}
\`\`\`

### 状態管理設計
- **messages**: チャット履歴 (Message[])
- **sections**: 仕様書セクション (Sections)
- **isLoading**: ローディング状態
- **isFirstMessage**: 初回メッセージフラグ`,

  '📱 画面・コンポーネント設計': `### 主要画面の技術仕様
1. **チャットパネル (左側)**
   - 高さ: 100vh固定
   - スクロール: 自動最下部
   - 入力: Cmd+Enter送信対応

2. **仕様書パネル (右側)**
   - セクション: ホバーで編集UI表示
   - 編集: インライン編集 (Escape/Cmd+Enterショートカット)
   - エクスポート: ビジネス企画書連携機能

### 共通コンポーネント設計
- **エラーバウンダリ**: 未実装 (要追加)
- **ローディング**: スケルトンUI
- **トースト通知**: 編集完了通知`,

  '📅 開発スケジュール・実装計画': `### Phase 1: MVP完成 (完了)
- ✅ 基本的な対話機能
- ✅ 仕様書生成・更新
- ✅ セクション編集機能
- ✅ アプリ間連携

### Phase 2: 機能拡張 (1-2ヶ月)
- [ ] ユーザー認証実装
- [ ] データベース統合
- [ ] チーム共有機能
- [ ] バージョン管理

### Phase 3: 品質向上 (2-3ヶ月)
- [ ] テスト自動化 (Jest/Playwright)
- [ ] パフォーマンス最適化
- [ ] SEO対策
- [ ] アクセシビリティ改善`,

  '🔧 開発・運用戦略': `### 開発環境・ツール
- **エディタ**: VS Code推奨
- **パッケージマネージャー**: Bun
- **コード品質**: ESLint + Prettier
- **Git**: Feature branch戦略

### テスト戦略
- **単体テスト**: Jest + React Testing Library
- **E2Eテスト**: Playwright
- **API テスト**: Supertest
- **カバレッジ目標**: 80%以上

### CI/CD・デプロイ戦略
- **自動テスト**: PR時に実行
- **自動デプロイ**: main branch更新時
- **Preview環境**: PR毎に生成
- **ロールバック**: Vercel自動化`,

  '⚠️ 技術的リスク・課題': `### パフォーマンス課題
- **課題**: 大規模仕様書でのレンダリング遅延
- **対策**: 仮想スクロール実装検討

### セキュリティリスク
- **課題**: API Key露出リスク
- **対策**: 環境変数 + サーバーサイド処理

### スケーラビリティ課題
- **課題**: 同時接続数制限
- **対策**: Rate limiting + キャッシング

### 技術的制約・対策
- **AI応答遅延**: ストリーミング応答実装
- **モバイル対応**: レスポンシブ設計強化
- **オフライン対応**: Service Worker検討`
};

export const techTemplateSections: Sections = {
  '📌 プロジェクト概要': `| 項目 | 内容 |
|------|------|
| プロジェクト名 | 未定 |
| 概要 | 未定 |
| プラットフォーム | 未定 |`,
  '🛠 技術スタック': '- 未定',
  '⚡ 主な機能': '- 未定',
  '📱 画面設計': '- 未定',
  '📅 開発スケジュール': '- 未定',
};
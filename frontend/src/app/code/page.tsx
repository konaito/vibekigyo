'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Message, Sections } from '../../types/chat';
import ChatMessages from '../../components/chat/ChatMessages';
import ChatInput from '../../components/chat/ChatInput';
import MarkdownPanel from '../../components/markdown/MarkdownPanel';
import Header from '../../components/layout/Header';
import { useMarkdownPanel } from '../../hooks/useMarkdownPanel';

const demoSections: Sections = {
  '💡 はじめに': `右側にはデモアプリ技術仕様書が表示されています。最初のメッセージで新しいプロジェクト用にリセットされます。`,
  
  '📌 プロジェクト概要': `| 項目 | 内容 |
|------|------|
| アプリ名 | TaskMaster Pro |
| プラットフォーム | iOS/Android (React Native), Web (Next.js) |
| 技術スタック | TypeScript, React Native, Node.js, PostgreSQL |
| 開発期間 | 6ヶ月 |
| チーム構成 | フロントエンド2名、バックエンド2名、DevOps1名 |`,

  '🛠 技術仕様': `### フロントエンド技術スタック
- **React Native 0.72** + TypeScript
- **Expo SDK 49** (開発・ビルド効率化)
- **React Navigation 6** (画面遷移)
- **React Query** (データキャッシュ・同期)
- **Zustand** (状態管理)
- **React Hook Form** (フォーム管理)

### バックエンド技術スタック
- **Node.js 18** + Express.js + TypeScript
- **Prisma ORM** (型安全なDB操作)
- **PostgreSQL 15** (メインデータベース)
- **Redis** (セッション・キャッシュ)
- **Socket.io** (リアルタイム通信)
- **JWT** (認証トークン)

### データベース設計
- **PostgreSQL**: ユーザー、タスク、プロジェクトデータ
- **Redis**: セッション、リアルタイム同期、キャッシュ
- **Prisma Schema**: 型安全なDB操作とマイグレーション

### インフラ・デプロイ
- **Vercel** (フロントエンドWeb版)
- **Railway** (バックエンドAPI)
- **Supabase** (PostgreSQL + 認証)
- **GitHub Actions** (CI/CD)
- **Expo EAS** (モバイルアプリビルド・配信)`,

  '🎨 UI/UX設計': `### デザインシステム
- **Design Tokens**: 色、タイポグラフィ、スペーシングの統一
- **Component Library**: 再利用可能コンポーネント設計
- **React Native Elements**: クロスプラットフォーム対応UI
- **Tailwind CSS**: Web版スタイリング

### コンポーネント設計
- **Atomic Design**: Atoms > Molecules > Organisms
- **共通コンポーネント**: Button, Input, Card, Modal, Loading
- **画面固有コンポーネント**: TaskCard, ProjectHeader, TimerWidget
- **TypeScript Props**: 型安全なコンポーネントAPI

### 画面遷移設計
- **Stack Navigator**: 階層的な画面遷移
- **Tab Navigator**: メイン機能へのアクセス
- **Modal Navigator**: オーバーレイ画面
- **Deep Linking**: 外部からの直接アクセス

### レスポンシブ対応
- **Mobile First**: 320px〜の対応
- **Tablet**: 768px〜のレイアウト調整
- **Desktop**: 1024px〜のサイドバー表示
- **Dynamic Type**: アクセシビリティ対応`,

  '⚡ 機能仕様・API設計': `### コア機能の技術実装
- **タスクCRUD**: REST API + optimistic updates
- **リアルタイム同期**: Socket.io + Redis pub/sub
- **オフライン対応**: React Query + AsyncStorage
- **プッシュ通知**: Expo Notifications + FCM

### API設計（エンドポイント、データ形式）
\`\`\`typescript
// Task API
POST /api/tasks
GET /api/tasks?project_id=123
PUT /api/tasks/:id
DELETE /api/tasks/:id

// WebSocket Events
task:created, task:updated, task:deleted
project:updated, user:joined
\`\`\`

### 状態管理設計
- **Zustand Store**: Global state (user, projects)
- **React Query**: Server state + caching
- **AsyncStorage**: Local persistence
- **Context API**: Theme, language settings

### データフロー
1. **User Input** → Component State
2. **API Call** → React Query mutation
3. **Optimistic Update** → UI immediate feedback
4. **Server Response** → State sync + error handling
5. **WebSocket** → Real-time updates`,

  '📱 画面・コンポーネント設計': `### 主要画面の技術仕様
- **認証画面**: Auth0 + biometric authentication
- **ダッシュボード**: FlatList + pull-to-refresh
- **タスク詳細**: Modal + form validation
- **プロジェクト一覧**: SectionList + search filtering

### 共通コンポーネント設計
\`\`\`typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger'
  size: 'sm' | 'md' | 'lg'
  loading?: boolean
  onPress: () => void
}
\`\`\`

### パフォーマンス最適化
- **FlatList**: virtualization for large lists
- **Image Optimization**: lazy loading + caching
- **Bundle Splitting**: lazy imports for screens
- **Memory Management**: useCallback, useMemo
- **Network**: request deduplication + retry logic`,

  '📅 開発スケジュール・実装計画': `### 技術セットアップ期間 (Week 1-2)
- **Repository Setup**: monorepo + Turborepo
- **CI/CD Pipeline**: GitHub Actions + testing
- **Database**: PostgreSQL + Prisma setup
- **Authentication**: Supabase Auth integration

### 機能別実装スケジュール
**Phase 1: Core Features (Month 1-2)**
- Week 3-4: User authentication + profile
- Week 5-6: Task CRUD + basic UI
- Week 7-8: Project management
- Week 9-10: Real-time sync + WebSocket

**Phase 2: Advanced Features (Month 3-4)**
- Week 11-12: Time tracking + timers
- Week 13-14: Notifications + offline sync
- Week 15-16: Performance optimization

### テスト・デプロイ戦略
- **Unit Tests**: Jest + React Testing Library
- **E2E Tests**: Detox (React Native)
- **API Tests**: Supertest + test database
- **Staging Deploy**: automatic on PR merge

### 技術的マイルストーン
- **M1**: Authentication + basic CRUD
- **M2**: Real-time sync working
- **M3**: Mobile app store ready
- **M4**: Performance benchmarks met`,

  '🔧 開発・運用戦略': `### 開発環境・ツール
- **IDE**: VS Code + extensions (Prettier, ESLint)
- **Version Control**: Git + GitHub flow
- **Package Manager**: npm + workspaces
- **Local Development**: Docker Compose + hot reload

### コード品質管理
- **TypeScript**: strict mode + no-implicit-any
- **ESLint**: Airbnb config + custom rules
- **Prettier**: automatic formatting
- **Husky**: pre-commit hooks + lint-staged
- **SonarQube**: code quality metrics

### テスト戦略
- **Unit Tests**: 80%+ coverage target
- **Integration Tests**: API endpoint testing
- **E2E Tests**: critical user flows
- **Performance Tests**: load testing with k6
- **Security Tests**: OWASP ZAP + dependency scanning

### CI/CD・デプロイ戦略
- **GitHub Actions**: test → build → deploy
- **Staging**: auto-deploy on PR merge
- **Production**: manual approval + blue-green
- **Rollback**: automated on health check failure

### 監視・ログ・エラー対応
- **Application Monitoring**: Sentry for error tracking
- **Performance**: New Relic APM
- **Logs**: structured logging with Winston
- **Metrics**: Prometheus + Grafana dashboards
- **Alerts**: PagerDuty for critical issues`,

  '⚠️ 技術的リスク・課題': `### パフォーマンス課題
- **大量データ処理**: 10,000+ tasks per user
  - 対策: DB indexing + pagination + lazy loading
- **リアルタイム同期**: 100+ concurrent users
  - 対策: Redis cluster + WebSocket scaling
- **モバイルメモリ**: 低スペック端末対応
  - 対策: code splitting + image optimization

### セキュリティリスク
- **認証・認可**: JWT token management
  - 対策: refresh token rotation + secure storage
- **API Security**: rate limiting + CORS
  - 対策: express-rate-limit + helmet.js
- **データ暗号化**: PII protection
  - 対策: encryption at rest + in transit (TLS 1.3)

### スケーラビリティ課題
- **Database**: read/write load distribution
  - 対策: read replicas + connection pooling
- **API Gateway**: traffic spike handling
  - 対策: auto-scaling + circuit breaker pattern
- **File Storage**: media content scaling
  - 対策: CDN + compression + lazy loading

### 技術的制約・対策
- **React Native**: OS version compatibility
  - 対策: minimum iOS 13+ / Android 8+
- **Offline Support**: data sync complexity
  - 対策: conflict resolution + incremental sync
- **Cross-platform**: UI consistency
  - 対策: shared component library + design tokens`
};

const templateSections: Sections = {
  '📌 プロジェクト概要': `| 項目 | 内容 |
|------|------|
| アプリ名 | 未定 |
| プラットフォーム | 未定 |
| 技術スタック | 未定 |`,
  '🛠 技術仕様': '- 未定',
  '🎨 UI/UX設計': '- 未定',
  '⚡ 機能仕様・API設計': '- 未定',
  '📱 画面・コンポーネント設計': '- 未定',
  '📅 開発スケジュール・実装計画': '- 未定',
};


export default function CodePage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'system',
      content: 'あなたはシニア技術アーキテクト兼プロダクトエンジニアです。ユーザーのアプリアイデアを聞いて、技術実装に特化した詳細な開発仕様書を作成してください。技術スタック、API設計、データベース設計、UI/UX実装、開発工程に特化した実行可能な技術設計を生成します。'
    },
    {
      role: 'assistant',
      content: 'こんにちは！⚡ 私はアプリ技術仕様書を作成する技術アーキテクトAIです。\n\n右側にはTaskMaster Proのデモ技術仕様書が表示されていますが、あなたの新しいアプリアイデアを聞かせてください！\n\n• どんなアプリを作りたいですか？\n• 技術的な要件はありますか？\n• 対象プラットフォームは？\n• 使用したい技術スタックは？\n\n技術実装の観点から詳細な仕様書を作成します。最初のメッセージで新しい技術仕様書作成を開始します！🔧'
    }
  ]);
  const [sections, setSections] = useState<Sections>(demoSections);
  const [isFirstMessage, setIsFirstMessage] = useState(true);
  
  const {
    copySuccess,
    handleCopy,
    handleExport,
    handleSectionUpdate
  } = useMarkdownPanel(sections, setSections);

  // 自動送信用の関数
  const handleAutoSubmit = useCallback(async (instruction: string) => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instruction,
          sections: templateSections, // 空のテンプレートから開始
          messages: messages
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(errorData.details || errorData.error || 'Failed to get response');
      }

      const data = await response.json();
      console.log('Full API response:', data);
      
      // レスポンス形式に対応
      switch (data.type) {
        case 'chat':
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: data.message 
          }]);
          break;
          
        case 'update':
          if (data.markdown && data.markdown.trim() !== '') {
            try {
              console.log('Parsing markdown JSON string:', data.markdown);
              const parsedMarkdown = JSON.parse(data.markdown);
              console.log('Updating sections with:', parsedMarkdown);
              setSections(prev => ({ ...prev, ...parsedMarkdown }));
            } catch (error) {
              console.error('Error parsing markdown JSON:', error);
            }
          }
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: data.message 
          }]);
          break;
          
        case 'chat+update':
          if (data.markdown && data.markdown.trim() !== '') {
            try {
              console.log('Parsing markdown JSON string:', data.markdown);
              const parsedMarkdown = JSON.parse(data.markdown);
              console.log('Updating sections with:', parsedMarkdown);
              setSections(prev => ({ ...prev, ...parsedMarkdown }));
            } catch (error) {
              console.error('Error parsing markdown JSON:', error);
            }
          }
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: data.message 
          }]);
          break;
          
        default:
          if (data.updated) {
            setSections(prev => ({ ...prev, ...data.updated }));
            const updatedSections = Object.keys(data.updated);
            setMessages(prev => [...prev, { 
              role: 'assistant', 
              content: `更新しました: ${updatedSections.join(', ')}\n\n${updatedSections.map(section => `【${section}】\n${data.updated[section].split('\n').slice(0, 3).join('\n')}${data.updated[section].split('\n').length > 3 ? '\n...' : ''}`).join('\n\n')}` 
            }]);
          } else {
            setMessages(prev => [...prev, { 
              role: 'assistant', 
              content: '理解しました。何か具体的な更新が必要でしたらお知らせください。' 
            }]);
          }
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: error instanceof Error && error.message.includes('API') 
          ? 'APIキーが設定されていないか、無効です。.env.localファイルにOPENROUTER_API_KEYを設定してください。' 
          : 'エラーが発生しました。もう一度お試しください。' 
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  // URLパラメータから事業アイデアを受け取る
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const fromBusiness = urlParams.get('from') === 'business';
    
    if (fromBusiness) {
      try {
        // localStorageからデータを取得
        const businessDataStr = localStorage.getItem('vibeBusinessData');
        if (!businessDataStr) {
          console.error('No business data found in localStorage');
          return;
        }
        
        const parsedData = JSON.parse(businessDataStr);
        
        // データが古すぎる場合はスキップ (1時間以内)
        if (Date.now() - parsedData.timestamp > 60 * 60 * 1000) {
          console.warn('Business data is too old, skipping');
          localStorage.removeItem('vibeBusinessData');
          return;
        }
        
        // 事業企画書のMarkdown全体を生成
        const businessMarkdown = Object.entries(parsedData.sections)
          .map(([title, content]) => `## ${title}\n\n${content}`)
          .join('\n\n');
        
        // テンプレートセクションにリセット
        setSections(templateSections);
        
        // 事業アイデア全体を最初のメッセージとして自動送信
        const initialMessage = `以下はvibe起業.mdで作成した事業企画書です。この事業アイデアをアプリとして実現するための詳細な開発企画書を作成してください：\n\n${businessMarkdown}`;
        
        // メッセージにユーザーの要求として追加
        setMessages(prev => [
          ...prev,
          { role: 'user', content: initialMessage }
        ]);
        
        setIsFirstMessage(false);
        
        // 自動でAPI呼び出しを実行
        setTimeout(() => {
          handleAutoSubmit(initialMessage);
        }, 100);
        
        // URLをクリーンアップ
        window.history.replaceState({}, document.title, '/code');
        
        // 使用済みデータを削除
        localStorage.removeItem('vibeBusinessData');
      } catch (error) {
        console.error('Failed to parse business data:', error);
        localStorage.removeItem('vibeBusinessData');
      }
    }
  }, [handleAutoSubmit]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    // 最初のメッセージの場合、テンプレートにリセット
    if (isFirstMessage) {
      setSections(templateSections);
      setIsFirstMessage(false);
    }

    try {
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instruction: userMessage,
          sections,
          messages: [...messages, { role: 'user', content: userMessage }]
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(errorData.details || errorData.error || 'Failed to get response');
      }

      const data = await response.json();
      console.log('Full API response:', data);
      
      // レスポンス形式に対応
      switch (data.type) {
        case 'chat':
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: data.message 
          }]);
          break;
          
        case 'update':
          if (data.markdown && data.markdown.trim() !== '') {
            try {
              console.log('Parsing markdown JSON string:', data.markdown);
              const parsedMarkdown = JSON.parse(data.markdown);
              console.log('Updating sections with:', parsedMarkdown);
              setSections(prev => ({ ...prev, ...parsedMarkdown }));
            } catch (error) {
              console.error('Error parsing markdown JSON:', error);
            }
          }
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: data.message 
          }]);
          break;
          
        case 'chat+update':
          if (data.markdown && data.markdown.trim() !== '') {
            try {
              console.log('Parsing markdown JSON string:', data.markdown);
              const parsedMarkdown = JSON.parse(data.markdown);
              console.log('Updating sections with:', parsedMarkdown);
              setSections(prev => ({ ...prev, ...parsedMarkdown }));
            } catch (error) {
              console.error('Error parsing markdown JSON:', error);
            }
          }
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: data.message 
          }]);
          break;
          
        default:
          if (data.updated) {
            setSections(prev => ({ ...prev, ...data.updated }));
            const updatedSections = Object.keys(data.updated);
            setMessages(prev => [...prev, { 
              role: 'assistant', 
              content: `更新しました: ${updatedSections.join(', ')}\n\n${updatedSections.map(section => `【${section}】\n${data.updated[section].split('\n').slice(0, 3).join('\n')}${data.updated[section].split('\n').length > 3 ? '\n...' : ''}`).join('\n\n')}` 
            }]);
          } else {
            setMessages(prev => [...prev, { 
              role: 'assistant', 
              content: '理解しました。何か具体的な更新が必要でしたらお知らせください。' 
            }]);
          }
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: error instanceof Error && error.message.includes('API') 
          ? 'APIキーが設定されていないか、無効です。.env.localファイルにOPENROUTER_API_KEYを設定してください。' 
          : 'エラーが発生しました。もう一度お試しください。' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };


  const clearHistory = () => {
    if (confirm('チャット履歴をクリアしますか？技術仕様書の内容もリセットされます。')) {
      setMessages([
        {
          role: 'system',
          content: 'あなたはシニア技術アーキテクト兼プロダクトエンジニアです。ユーザーのアプリアイデアを聞いて、技術実装に特化した詳細な開発仕様書を作成してください。技術スタック、API設計、データベース設計、UI/UX実装、開発工程に特化した実行可能な技術設計を生成します。'
        },
        {
          role: 'assistant',
          content: 'こんにちは！⚡ 私はアプリ技術仕様書を作成する技術アーキテクトAIです。\n\n右側にはTaskMaster Proのデモ技術仕様書が表示されていますが、あなたの新しいアプリアイデアを聞かせてください！\n\n• どんなアプリを作りたいですか？\n• 技術的な要件はありますか？\n• 対象プラットフォームは？\n• 使用したい技術スタックは？\n\n技術実装の観点から詳細な仕様書を作成します。最初のメッセージで新しい技術仕様書作成を開始します！🔧'
        }
      ]);
      setSections(demoSections);
      setIsFirstMessage(true);
    }
  };

  return (
    <div className="h-screen grid grid-cols-2 bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Chat Panel */}
      <div className="border-r border-gray-200 flex flex-col bg-white h-screen shadow-sm">
        <Header
          title="vibeアプリ.md - 技術仕様書AI"
          appSwitchUrl="/"
          appSwitchLabel="💼 vibe起業"
          onClearHistory={clearHistory}
        />
        
        <ChatMessages
          messages={messages}
          isLoading={isLoading}
          chatEndRef={chatEndRef}
        />

        <ChatInput
          input={input}
          isLoading={isLoading}
          placeholder="アプリのアイデアや要望を入力してください...（⌘+Enter で送信）"
          onInputChange={setInput}
          onSubmit={handleSubmit}
        />
      </div>

      {/* Markdown Panel */}
      <MarkdownPanel
        title="技術仕様書 (Markdown)"
        copySuccess={copySuccess}
        sections={sections}
        onCopy={handleCopy}
        onExport={() => handleExport('技術仕様書')}
        onSectionUpdate={handleSectionUpdate}
        onEditNotification={(message) => {
          setMessages(prev => [...prev, { 
            role: 'user', 
            content: message 
          }]);
        }}
      />
    </div>
  );
}
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Message, Sections } from '../../types/chat';
import ChatMessages from '../../components/chat/ChatMessages';
import ChatInput from '../../components/chat/ChatInput';
import MarkdownPanel from '../../components/markdown/MarkdownPanel';
import Header from '../../components/layout/Header';
import { useMarkdownPanel } from '../../hooks/useMarkdownPanel';
import { formUrl } from '../../lib/form-url';

const demoSections: Sections = {
  '💡 はじめに': `右側にはデモアプリ技術仕様書が表示されています。最初のメッセージで新しいプロジェクト用にリセットされます。`,
  
  '📌 プロジェクト概要': `| 項目 | 内容 |
|------|------|
| アプリ名 | vibe起業.md / vibeアプリ.md |
| プラットフォーム | Web (Next.js) |
| 技術スタック | Next.js 15, TypeScript, Tailwind CSS, OpenRouter API |
| 開発期間 | 2ヶ月 |
| チーム構成 | フルスタック開発者1名 |`,

  '🛠 技術仕様': `### フロントエンド技術スタック
- **Next.js 15.3.3** + TypeScript (App Router)
- **React 19** (最新バージョン)
- **Tailwind CSS 4** + Typography Plugin (スタイリング)
- **React Markdown** + remark-gfm (マークダウンレンダリング)
- **Bun** (JavaScript runtime & package manager)

### API・外部サービス
- **OpenRouter API** (openai/gpt-4o-search-preview)
- **構造化出力** (JSON Schema validation)
- **Web検索機能** (GPT-4o search preview)
- **クライアントサイドAPI** (fetch + error handling)

### データ管理
- **React State** (useState, useEffect)
- **LocalStorage** (アプリ間データ連携)
- **Session Storage** (一時的なデータ保存)
- **URL Parameters** (アプリ間ナビゲーション)

### デプロイ・開発環境
- **Vercel** (本番環境デプロイ)
- **GitHub** (ソースコード管理)
- **VS Code** + TypeScript (開発環境)
- **ESLint** + Prettier (コード品質管理)`,

  '🎨 UI/UX設計': `### デザインシステム
- **Tailwind CSS**: ユーティリティファーストなCSS
- **Gradient背景**: モダンなビジュアルデザイン
- **Typography Plugin**: 読みやすいMarkdown表示
- **カラーパレット**: Blue系を基調とした統一感

### コンポーネント設計
- **再利用可能コンポーネント**: ChatMessages, ChatInput, MarkdownPanel, Header
- **カスタムHook**: useMarkdownPanel (状態管理)
- **TypeScript Interface**: 型安全なprops定義
- **共通レイアウト**: 2分割グリッドレイアウト

### レスポンシブ対応
- **Desktop First**: 1024px〜の2カラムレイアウト
- **Grid System**: CSS Grid による柔軟なレイアウト
- **チャット UI**: モバイルライクなメッセージ表示
- **マークダウンパネル**: エディタライクな右パネル

### アクセシビリティ対応
- **Semantic HTML**: 適切なHTMLタグ使用
- **Focus Management**: キーボードナビゲーション
- **Color Contrast**: 十分なコントラスト比
- **Screen Reader**: ARIA labels適用`,

  '⚡ 機能仕様・API設計': `### コア機能の技術実装
- **AI対話機能**: OpenRouter API + streaming responses
- **マークダウン生成**: 構造化出力 + JSON Schema
- **リアルタイム編集**: React state + 即座の UI 更新
- **アプリ間連携**: LocalStorage + URL parameters

### API設計（エンドポイント、データ形式）
\`\`\`typescript
// Business Planning API
POST /api/apply-instruction
{
  instruction: string,
  sections: Record<string, string>,
  messages: Message[]
}

// Technical Planning API  
POST /api/generate-plan
{
  instruction: string,
  sections: Record<string, string>,
  messages: Message[]
}

// Response Format
{
  type: 'chat' | 'update' | 'chat+update',
  message: string,
  markdown?: Record<string, string>
}
\`\`\`

### 状態管理設計
- **React State**: messages, sections, isLoading
- **Custom Hook**: useMarkdownPanel
- **LocalStorage**: アプリ間データ転送
- **URL State**: ナビゲーション状態管理

### データフロー
1. **User Input** → Component State
2. **API Call** → OpenRouter API
3. **JSON Response** → State update
4. **UI Update** → Chat + Markdown panel
5. **Export** → LocalStorage → App navigation`,

  '📱 画面・コンポーネント設計': `### 主要画面の技術仕様
- **ビジネス企画画面** (/): ChatMessages + MarkdownPanel
- **技術仕様画面** (/code): 同一構造で異なるプロンプト
- **共通ヘッダー**: アプリ切り替え + クリア機能
- **レスポンシブ**: CSS Grid による2カラムレイアウト

### 共通コンポーネント設計
\`\`\`typescript
interface ChatMessagesProps {
  messages: Message[]
  isLoading: boolean
  chatEndRef: React.RefObject<HTMLDivElement>
}

interface MarkdownPanelProps {
  title: string
  sections: Sections
  onCopy: () => void
  onExport: () => void
  extraActions?: React.ReactNode
}
\`\`\`

### パフォーマンス最適化
- **React.memo**: 不要な再レンダリング防止
- **useCallback**: 関数メモ化
- **Lazy Loading**: ReactMarkdown dynamic import
- **Code Splitting**: ページ単位での分割
- **Image Optimization**: Next.js built-in optimization`,

  '📅 開発スケジュール・実装計画': `### 技術セットアップ期間 (Week 1)
- **Repository Setup**: Next.js 15 + TypeScript setup
- **API Integration**: OpenRouter API + environment config
- **UI Framework**: Tailwind CSS + component library
- **Development Tools**: ESLint + Prettier + Git setup

### 機能別実装スケジュール
**Phase 1: Core Features (Week 2-4)**
- Week 2: Basic chat UI + markdown rendering
- Week 3: AI integration + structured outputs
- Week 4: Business planning prompts + UX polish

**Phase 2: Advanced Features (Week 5-6)**
- Week 5: Technical planning app + dual app architecture
- Week 6: App-to-app integration + export functionality

**Phase 3: Polish & Deploy (Week 7-8)**
- Week 7: Performance optimization + error handling
- Week 8: Final testing + production deployment

### テスト・デプロイ戦略
- **Manual Testing**: Browser compatibility + UX testing
- **TypeScript**: Type safety + compile-time error checking
- **Staging Deploy**: Vercel preview deployments
- **Production**: Vercel automatic deployments

### 技術的マイルストーン
- **M1**: Basic chat + markdown working
- **M2**: AI integration + structured responses
- **M3**: Dual app architecture complete
- **M4**: Production ready + performance optimized`,

  '🔧 開発・運用戦略': `### 開発環境・ツール
- **IDE**: VS Code + TypeScript + Tailwind CSS extensions
- **Version Control**: Git + GitHub (main branch workflow)
- **Package Manager**: Bun (fast JavaScript runtime)
- **Local Development**: Next.js dev server + hot reload

### コード品質管理
- **TypeScript**: strict mode + type safety
- **ESLint**: Next.js recommended config
- **Prettier**: automatic code formatting
- **Git Hooks**: 手動でのコード品質チェック
- **Manual Review**: 小規模プロジェクトのため手動レビュー

### テスト戦略
- **Manual Testing**: 機能テスト + ユーザビリティテスト
- **TypeScript**: コンパイル時の型チェック
- **Browser Testing**: Chrome, Firefox, Safari compatibility
- **API Testing**: Postman + manual endpoint testing
- **Performance**: Lighthouse + Core Web Vitals

### CI/CD・デプロイ戦略
- **GitHub Integration**: Vercel automatic deployments
- **Preview Deployments**: Pull request previews
- **Production**: main branch auto-deploy to Vercel
- **Rollback**: Git revert + automatic re-deploy

### 監視・ログ・エラー対応
- **Console Logging**: クライアントサイド error handling
- **Vercel Analytics**: 基本的なパフォーマンス監視
- **Manual Monitoring**: ユーザーフィードバック + issue tracking
- **Error Boundaries**: React error handling
- **API Error Handling**: try/catch + user-friendly messages`,

  '⚠️ 技術的リスク・課題': `### API依存リスク
- **OpenRouter API障害**: サービス停止リスク
  - 対策: error handling + fallback messages + retry logic
- **API料金**: 大量利用時のコスト増加
  - 対策: rate limiting + usage monitoring + cost alerts
- **レスポンス時間**: AI処理の遅延
  - 対策: loading states + user feedback + timeout handling

### セキュリティリスク
- **API Key漏洩**: 環境変数の不適切な管理
  - 対策: .env.local + .gitignore + Vercel環境変数
- **XSS攻撃**: マークダウンレンダリングの脆弱性
  - 対策: react-markdown sanitization + CSP headers
- **CSRF攻撃**: API endpoint への不正アクセス
  - 対策: SameSite cookies + origin validation

### パフォーマンス課題
- **大量チャット履歴**: メモリ使用量増加
  - 対策: message limit + pagination + cleanup
- **マークダウンレンダリング**: 複雑な文書の処理
  - 対策: lazy loading + debounced updates + memoization
- **Bundle Size**: JavaScript bundle の肥大化
  - 対策: code splitting + tree shaking + dynamic imports

### 技術的制約・対策
- **ブラウザ互換性**: 古いブラウザでの動作
  - 対策: modern browsers support + graceful degradation
- **LocalStorage制限**: データサイズ制限 (5-10MB)
  - 対策: data compression + cleanup + size monitoring
- **Single Point of Failure**: Vercel 依存リスク
  - 対策: backup deployment strategy + monitoring`
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
      content: `# こんにちは！⚡ 

私はアプリ技術仕様書を作成する**技術アーキテクトAI**です。

## 🔍 最新技術情報にアクセス可能
**web検索機能**で最新の技術動向、ライブラリ情報、ベストプラクティスを調査できます

## 💬 マークダウン対応チャット
チャットでも**見出し**、*コード*、リスト、テーブルなどのマークダウンが使えます！

右側にはTaskMaster Proのデモ技術仕様書が表示されていますが、あなたの新しいアプリアイデアを聞かせてください！

### 質問例：
- どんなアプリを作りたいですか？
- 技術的な要件はありますか？
- 対象プラットフォームは？
- 使用したい技術スタックは？

最新の技術動向を調査しながら、実装可能な技術仕様書を作成します。

> 最初のメッセージで新しい技術仕様書作成を開始します！🔧`
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
          if (data.markdown && Object.keys(data.markdown).length > 0) {
            console.log('Updating sections with markdown object:', data.markdown);
            setSections(prev => ({ ...prev, ...data.markdown }));
          }
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: data.message 
          }]);
          break;
          
        case 'chat+update':
          if (data.markdown && Object.keys(data.markdown).length > 0) {
            console.log('Updating sections with markdown object:', data.markdown);
            setSections(prev => ({ ...prev, ...data.markdown }));
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
          console.log('No business data found in localStorage - direct access to vibeアプリ');
          return;
        }
        
        const parsedData = JSON.parse(businessDataStr);
        
        // データが古すぎる場合はスキップ (1時間以内)
        if (Date.now() - parsedData.timestamp > 60 * 60 * 1000) {
          console.log('Business data is too old, skipping');
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
        console.log('Failed to parse business data:', error);
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
          if (data.markdown && Object.keys(data.markdown).length > 0) {
            console.log('Updating sections with markdown object:', data.markdown);
            setSections(prev => ({ ...prev, ...data.markdown }));
          }
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: data.message 
          }]);
          break;
          
        case 'chat+update':
          if (data.markdown && Object.keys(data.markdown).length > 0) {
            console.log('Updating sections with markdown object:', data.markdown);
            setSections(prev => ({ ...prev, ...data.markdown }));
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
          content: `# こんにちは！⚡ 

私はアプリ技術仕様書を作成する**技術アーキテクトAI**です。

## 🔍 最新技術情報にアクセス可能
**web検索機能**で最新の技術動向、ライブラリ情報、ベストプラクティスを調査できます

## 💬 マークダウン対応チャット
チャットでも**見出し**、*コード*、リスト、テーブルなどのマークダウンが使えます！

右側にはTaskMaster Proのデモ技術仕様書が表示されていますが、あなたの新しいアプリアイデアを聞かせてください！

### 質問例：
- どんなアプリを作りたいですか？
- 技術的な要件はありますか？
- 対象プラットフォームは？
- 使用したい技術スタックは？

最新の技術動向を調査しながら、実装可能な技術仕様書を作成します。

> 最初のメッセージで新しい技術仕様書作成を開始します！🔧`
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
        extraActions={
          <button
            onClick={() => {
              try {
                // Google Formに技術仕様書データを送信
                const url = formUrl(sections);
                console.log('Generated form URL:', url);
                console.log('URL length:', url.length);
                // if (url.length > 8000) {
                //   alert('技術仕様書の内容が長すぎます。内容を短縮してからお試しください。');
                //   return;
                // }
                window.open(url, '_blank');
              } catch (error) {
                console.error('Error generating form URL:', error);
                alert('フォームURLの生成でエラーが発生しました。');
              }
            }}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
          >
            アプリを作成する
          </button>
        }
      />
    </div>
  );
}
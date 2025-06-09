'use client';

import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface Sections {
  [key: string]: string;
}

const demoSections: Sections = {
  '💡 はじめに': `右側にはデモアプリ企画書が表示されています。最初のメッセージで新しいプロジェクト用にリセットされます。`,
  
  '📌 プロジェクト概要': `| 項目 | 内容 |
|------|------|
| アプリ名 | TaskMaster Pro |
| カテゴリ | タスク管理・生産性向上 |
| 対象プラットフォーム | Web (React), Mobile (React Native) |
| 開発期間 | 6ヶ月 |
| チーム規模 | フロントエンド2名、バックエンド2名、デザイナー1名 |`,

  '🎯 ターゲットユーザー': `### プライマリーユーザー
- **働くプロフェッショナル** (25-45歳)
  - 複数のプロジェクトを同時進行
  - デジタルツールに慣れ親しんでいる
  - 効率性と生産性を重視

### セカンダリーユーザー
- **フリーランサー・個人事業主**
  - クライアントワークの管理が必要
  - 時間追跡機能を重視
  - 収益管理との連携を求める

### ペルソナ例
**田中美咲 (32歳, プロジェクトマネージャー)**
- IT企業勤務、3つのプロジェクトを同時管理
- 現在Trello、Slack、Excelを併用し非効率を感じている
- チーム全体の進捗可視化が課題`,

  '💎 価値提案': `### メインバリュー
**「AIアシスタント搭載の次世代タスク管理で生産性を2倍に」**

### 提供価値
1. **統合管理**: タスク・時間・コミュニケーション・ファイルの一元管理
2. **AI支援**: 自動優先度設定、スケジュール最適化、進捗予測
3. **チーム協業**: リアルタイム同期、役割分担、進捗共有
4. **インサイト**: 生産性分析、ボトルネック発見、改善提案

### 既存ツールとの差別化
- **Notion**: より直感的なUI、専門特化
- **Asana**: AI機能の充実、日本語最適化
- **Monday.com**: コスト効率、中小企業向け`,

  '🛠 技術仕様': `### フロントエンド
- **React 18** + TypeScript
- **Next.js 14** (App Router)
- **Tailwind CSS** + Shadcn/ui
- **Zustand** (状態管理)
- **React Query** (データフェッチング)

### バックエンド
- **Node.js** + Express.js
- **PostgreSQL** (メインDB)
- **Redis** (キャッシュ・セッション)
- **Prisma ORM**
- **Socket.io** (リアルタイム通信)

### AI・機械学習
- **OpenAI GPT-4** (タスク分析・提案)
- **Python** + FastAPI (ML API)
- **scikit-learn** (生産性予測)

### インフラ
- **Vercel** (フロントエンド)
- **Railway** (バックエンド)
- **AWS S3** (ファイルストレージ)
- **GitHub Actions** (CI/CD)`,

  '🎨 UI/UX設計': `### デザインコンセプト
**「プロフェッショナルながら親しみやすい」**

### カラーパレット
- **プライマリー**: #2563eb (モダンブルー)
- **セカンダリー**: #10b981 (成功グリーン)
- **アクセント**: #f59e0b (アテンションオレンジ)
- **ニュートラル**: #6b7280系 (グレー)

### レスポンシブ設計
- **Desktop**: サイドバー + メインコンテンツ
- **Tablet**: 折りたたみ可能ナビゲーション
- **Mobile**: ボトムタブナビゲーション

### 主要画面構成
1. **ダッシュボード**: 今日のタスク・進捗・通知
2. **プロジェクト管理**: カンバン・ガント・リスト表示
3. **タイムトラッキング**: ポモドーロ・手動・自動記録
4. **分析レポート**: 個人・チーム生産性
5. **設定**: プロフィール・通知・連携`,

  '⚡ 主要機能一覧': `### Core機能
- **タスク管理**: 作成・編集・削除・優先度・期限
- **プロジェクト管理**: 階層構造・進捗追跡・マイルストーン
- **時間追跡**: 手動・自動・ポモドーロタイマー
- **コラボレーション**: コメント・ファイル共有・@メンション

### AI機能
- **自動優先度設定**: 期限・重要度から自動判定
- **スケジュール最適化**: カレンダー連携で最適配置
- **進捗予測**: 過去データから完了予測
- **作業提案**: 最適なタスク順序を提案

### 連携機能
- **カレンダー**: Google・Outlook・Apple Calendar
- **コミュニケーション**: Slack・Teams・Discord
- **ファイル**: Google Drive・Dropbox・OneDrive
- **開発ツール**: GitHub・GitLab・Jira

### Premium機能
- **高度な分析**: 詳細レポート・カスタムダッシュボード
- **チーム管理**: 役割・権限・リソース管理
- **API連携**: Webhook・REST API・Zapier
- **優先サポート**: 24時間以内対応・専任サポート`,

  '📅 開発スケジュール': `### Phase 1: MVP開発 (3ヶ月)
**Month 1:**
- プロジェクト設定・DB設計
- 基本認証・ユーザー管理
- タスクCRUD機能

**Month 2:**
- プロジェクト管理機能
- 基本UI/UXの実装
- レスポンシブ対応

**Month 3:**
- 時間追跡機能
- コラボレーション機能
- βテスト開始

### Phase 2: AI機能追加 (2ヶ月)
**Month 4:**
- AI優先度設定
- スケジュール最適化
- 進捗予測機能

**Month 5:**
- AI作業提案
- 分析レポート
- 性能最適化

### Phase 3: 統合・リリース (1ヶ月)
**Month 6:**
- 外部ツール連携
- 最終テスト・バグ修正
- 正式リリース

### 継続開発
- ユーザーフィードバック対応
- 新機能追加
- 性能改善`,

  '💰 収益モデル': `### サブスクリプション
**Free Plan (¥0/月)**
- 個人利用のみ
- プロジェクト3つまで
- 基本機能のみ

**Pro Plan (¥980/月)**
- 無制限プロジェクト
- AI機能フル利用
- 基本連携機能

**Team Plan (¥2,980/月・5ユーザー)**
- チーム機能
- 高度な分析
- 優先サポート

**Enterprise (要相談)**
- オンプレミス対応
- カスタム機能
- 専任サポート

### 収益予測 (1年目)
- Free: 1,000ユーザー (0円)
- Pro: 200ユーザー (235万円/年)
- Team: 20チーム (71万円/年)
- **合計**: 306万円/年

### マネタイゼーション戦略
1. **フリーミアム**: 無料で基本価値を体験
2. **段階的アップグレード**: 使用量に応じた自然な移行
3. **チーム導入**: 個人から組織への拡大
4. **エコシステム**: 連携ツールとの収益シェア`,

  '📊 マーケティング戦略': `### ターゲット市場
- **TAM**: 生産性ツール市場 $4.2B
- **SAM**: タスク管理ツール $800M
- **SOM**: 日本市場シェア 3% = $24M

### Go-to-Market戦略
**Phase 1: Product Hunt & Early Adopters**
- β版リリース・フィードバック収集
- Product Hunt掲載
- 技術ブログ・SNS発信

**Phase 2: Content Marketing**
- 生産性向上に関するブログ
- YouTube動画チュートリアル
- ウェビナー・オンラインイベント

**Phase 3: Partnership & B2B**
- スタートアップコミュニティ連携
- 企業向け直接営業
- 導入事例の作成・発信

### チャネル戦略
- **デジタル**: SEO・SEM・SNS広告
- **コンテンツ**: ブログ・動画・ポッドキャスト
- **コミュニティ**: Discord・Reddit・専門フォーラム
- **パートナー**: システム会社・コンサル会社`,

  '⚠️ リスク・課題': `### 技術リスク
- **スケーラビリティ**: ユーザー増加時の性能問題
- **データセキュリティ**: 機密情報の保護
- **AI依存**: 外部AI APIの変更・停止リスク

### 市場リスク
- **競合参入**: 大手企業による類似サービス
- **経済状況**: 不況時のSaaS予算削減
- **ユーザー行動変化**: リモートワーク減少

### 対策
- **技術**: マイクロサービス化・セキュリティ強化
- **事業**: 差別化機能の継続開発
- **財務**: 複数収益源・コスト構造最適化

### 成功指標
- **Month 3**: 100 MAU
- **Month 6**: 500 MAU・10%有料転換
- **Year 1**: 2,000 MAU・15%有料転換・¥500万ARR`
};

const templateSections: Sections = {
  '📌 プロジェクト概要': `| 項目 | 内容 |
|------|------|
| アプリ名 | 未定 |
| カテゴリ | 未定 |
| 対象プラットフォーム | 未定 |`,
  '🎯 ターゲットユーザー': '- 未定',
  '💎 価値提案': '- 未定',
  '🛠 技術仕様': '- 未定',
  '⚡ 主要機能': '- 未定',
  '📅 開発スケジュール': '- 未定',
};

// 事業アイデアをアプリ企画に変換する関数
function convertBusinessToApp(businessSections: Sections): Sections {
  const convertedSections: Sections = { ...templateSections };
  
  // プロジェクト概要の変換
  if (businessSections['📌 プロジェクト概要']) {
    const businessOverview = businessSections['📌 プロジェクト概要'];
    const projectName = extractTableValue(businessOverview, 'プロジェクト名') || '新規アプリ';
    const overview = extractTableValue(businessOverview, '概要') || '事業アイデアからのアプリ化';
    
    convertedSections['📌 プロジェクト概要'] = `| 項目 | 内容 |
|------|------|
| アプリ名 | ${projectName} App |
| カテゴリ | ビジネス・生産性 |
| 対象プラットフォーム | Web (React), Mobile (React Native) |
| 開発期間 | 6ヶ月 |
| 概要 | ${overview} |`;
  }
  
  // ターゲットユーザーの変換
  if (businessSections['🎯 顧客セグメント（ターゲット）'] || businessSections['🎯 ターゲットユーザー']) {
    const targetSection = businessSections['🎯 顧客セグメント（ターゲット）'] || businessSections['🎯 ターゲットユーザー'];
    convertedSections['🎯 ターゲットユーザー'] = `### アプリユーザー
${targetSection}

### 利用シーン
- 外出先での業務効率化
- リアルタイムでの情報確認・更新
- チームとのコラボレーション`;
  }
  
  // 価値提案の変換
  if (businessSections['💎 価値提案']) {
    const valueProposition = businessSections['💎 価値提案'];
    convertedSections['💎 価値提案'] = `### アプリの価値
${valueProposition}

### モバイル・Web最適化
- いつでもどこでもアクセス可能
- 直感的なUI/UX設計
- オフライン機能対応`;
  }
  
  // 主な機能の変換
  if (businessSections['🚀 主な機能・MVP'] || businessSections['⚡ 主要機能']) {
    const featuresSection = businessSections['🚀 主な機能・MVP'] || businessSections['⚡ 主要機能'];
    convertedSections['⚡ 主要機能'] = `### Core機能
${featuresSection}

### アプリ特有機能
- プッシュ通知
- オフライン同期
- 生体認証ログイン
- ダークモード対応`;
  }
  
  return convertedSections;
}

// テーブル形式から値を抽出するヘルパー関数
function extractTableValue(tableText: string, key: string): string | null {
  const lines = tableText.split('\n');
  for (const line of lines) {
    if (line.includes(key)) {
      const parts = line.split('|');
      if (parts.length >= 3) {
        return parts[2].trim();
      }
    }
  }
  return null;
}

export default function CodePage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'system',
      content: 'あなたはシニアプロダクトマネージャーです。ユーザーのアプリアイデアを聞いて、詳細な開発企画書を作成してください。技術仕様、UI/UX、開発工程、収益モデルなどを含む包括的な企画書を生成します。'
    },
    {
      role: 'assistant',
      content: 'こんにちは！📱 私はアプリ開発企画書を作成するAIアシスタントです。\n\n右側にはTaskMaster Proのデモ企画書が表示されていますが、あなたの新しいアプリアイデアを聞かせてください！\n\n• どんなアプリを作りたいですか？\n• 解決したい課題はありますか？\n• ターゲットユーザーは誰ですか？\n• 技術的な要望はありますか？\n\n何でも気軽に話しかけてください。最初のメッセージで新しい企画書作成を開始します！✨'
    }
  ]);
  const [sections, setSections] = useState<Sections>(demoSections);
  const [isFirstMessage, setIsFirstMessage] = useState(true);

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
          handleAutoSubmit(initialMessage, parsedData.sections);
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
  }, []);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 自動送信用の関数
  const handleAutoSubmit = async (instruction: string, originalSections: any) => {
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
  };

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

  const generateMarkdown = () => {
    const markdown = Object.entries(sections)
      .map(([title, content]) => `## ${title}\n\n${content}`)
      .join('\n\n');
    console.log('Generated markdown:', markdown);
    return markdown;
  };

  const clearHistory = () => {
    if (confirm('チャット履歴をクリアしますか？企画書の内容もリセットされます。')) {
      setMessages([
        {
          role: 'system',
          content: 'あなたはシニアプロダクトマネージャーです。ユーザーのアプリアイデアを聞いて、詳細な開発企画書を作成してください。技術仕様、UI/UX、開発工程、収益モデルなどを含む包括的な企画書を生成します。'
        },
        {
          role: 'assistant',
          content: 'こんにちは！📱 私はアプリ開発企画書を作成するAIアシスタントです。\n\n右側にはTaskMaster Proのデモ企画書が表示されていますが、あなたの新しいアプリアイデアを聞かせてください！\n\n• どんなアプリを作りたいですか？\n• 解決したい課題はありますか？\n• ターゲットユーザーは誰ですか？\n• 技術的な要望はありますか？\n\n何でも気軽に話しかけてください。最初のメッセージで新しい企画書作成を開始します！✨'
        }
      ]);
      setSections(demoSections);
      setIsFirstMessage(true);
    }
  };

  return (
    <div className="h-screen grid grid-cols-2 bg-gray-50">
      {/* Chat Panel */}
      <div className="border-r border-gray-300 flex flex-col bg-white h-screen">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800">vibeアプリ.md - アプリ企画書AI</h1>
            <div className="flex space-x-2">
              <button
                onClick={() => window.location.href = '/'}
                className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition-colors"
                title="vibe起業.mdに切り替え"
              >
                💼 vibe起業
              </button>
              <button
                onClick={clearHistory}
                className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
                title="チャット履歴をクリア"
              >
                履歴クリア
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
          {messages.filter(m => m.role !== 'system').map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-200 text-gray-800 p-3 rounded-lg">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="flex space-x-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="アプリのアイデアや要望を入力してください...（⌘+Enter で送信）"
              className="flex-1 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              送信
            </button>
          </div>
        </form>
      </div>

      {/* Markdown Panel */}
      <div className="flex flex-col bg-white h-screen">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-800">アプリ企画書 (Markdown)</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(generateMarkdown())
                  .then(() => {
                    setCopySuccess(true);
                    setTimeout(() => setCopySuccess(false), 2000);
                  })
                  .catch(() => {
                    alert('コピーに失敗しました。');
                  });
              }}
              className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-sm relative"
            >
              {copySuccess ? '✓ コピー完了' : 'コピー'}
            </button>
            <button
              onClick={() => {
                const markdown = generateMarkdown();
                const blob = new Blob([markdown], { type: 'text/markdown' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `アプリ企画書_${new Date().toISOString().split('T')[0]}.md`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
            >
              エクスポート(md)
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 min-h-0">
          <div className="prose prose-gray max-w-none prose-table:text-sm">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {generateMarkdown()}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
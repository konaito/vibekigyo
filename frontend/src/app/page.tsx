'use client';

import { useState, useRef, useEffect } from 'react';
import { Message, Sections } from '../types/chat';
import ChatMessages from '../components/chat/ChatMessages';
import ChatInput from '../components/chat/ChatInput';
import MarkdownPanel from '../components/markdown/MarkdownPanel';
import Header from '../components/layout/Header';
import { useMarkdownPanel } from '../hooks/useMarkdownPanel';

const demoSections: Sections = {
  '💡 はじめに': `右側にはデモ企画書が表示されています。最初のメッセージで新しいプロジェクト用にリセットされます。`,
  
  '📌 プロジェクト概要': `| 項目 | 内容 |
|------|------|
| プロジェクト名 | vibe起業.md |
| 概要 | AI×ビジネスフレームワーク融合型の企画書生成プラットフォーム |
| 目的 | 新規事業開発における「壁打ち相手不在」問題を解決し、構造化された思考支援を提供 |
| ビジョン | すべての起業家が最高品質の企画書を作成できる世界の実現 |
| MVP版 | v0.1 リリース完了・プロダクトマーケットフィット検証中 |`,

  '🎯 顧客セグメント（ターゲット）': `### プライマリー顧客
- **スタートアップ起業家** (30-40代, 年収500-1000万)
  - 課題: アイデアの言語化・構造化に時間がかかる
  - ニーズ: 投資家向け企画書の品質向上、時間短縮

### セカンダリー顧客  
- **企業内新規事業担当者** (25-35代, 大企業・中堅企業)
  - 課題: 社内承認用の論理的な企画書作成スキル不足
  - ニーズ: フレームワークに基づいた戦略的思考支援

### ターシャリー顧客
- **学生・研究者** (20-25代, 大学・大学院)
  - 課題: ビジネスプランコンテスト参加時の企画書品質
  - ニーズ: 実務レベルの企画書作成教育`,

  '💎 価値提案': `### ユニークバリュープロポジション
**「AIとビジネス理論が融合した、世界初の対話型企画書生成エンジン」**

### 提供価値
1. **時間価値**: 企画書作成時間を従来の1/5に短縮（3週間→3日）
2. **品質価値**: ビジネスフレームワーク自動適用による論理性向上
3. **学習価値**: 対話を通じた戦略思考スキルの向上
4. **機会価値**: 投資家・社内承認獲得確率の大幅向上

### 競合優位性
- **ChatGPT**: 汎用的だが企画書特化機能なし
- **従来コンサル**: 高コスト(月50-200万)・アクセス困難
- **テンプレート型ツール**: 静的で思考支援機能なし`,

  '📊 市場分析': `### TAM (Total Addressable Market)
- **グローバル企画書作成市場**: $2.5B (2024年)
- **日本国内スタートアップ市場**: ¥8,000億 (年間設立数約1.3万社)
- **企業内新規事業市場**: ¥15兆 (大企業の新規事業予算)

### SAM (Serviceable Addressable Market)  
- **デジタルツール利用層**: 約30% = $750M
- **日本市場シェア**: 約8% = $60M (約90億円)

### SOM (Serviceable Obtainable Market)
- **初期獲得可能市場**: 1% = $600K (約9,000万円/年)
- **5年後目標**: 5% = $3M (約4.5億円/年)

### 市場成長性
- **年成長率**: 12-15% (DX推進・リモートワーク普及)
- **成長ドライバー**: AI普及、起業ブーム、大企業の新規事業投資増加`,

  '🏢 競合分析': `### 直接競合
| 競合 | 強み | 弱み | 差別化ポイント |
|------|------|------|----------------|
| **ChatGPT** | 汎用性・認知度 | 企画書特化機能なし | ビジネスフレームワーク特化 |
| **Notion AI** | 既存顧客基盤 | 思考支援弱い | 対話型思考深掘り |
| **コンサルティング** | 専門性・実績 | 高コスト・アクセス困難 | 24/7アクセス・低コスト |

### 間接競合
- **PowerPoint/Keynote**: 作成ツールのみ、思考支援なし
- **ビジネス書籍・セミナー**: 学習コスト高、実践とのギャップ大

### 競合優位性の構築
1. **技術的参入障壁**: 独自のビジネスフレームワーク×AI融合アルゴリズム
2. **データ蓄積**: ユーザー企画書データによる継続的AI改善
3. **ネットワーク効果**: 企画書テンプレート共有コミュニティ`,

  '🚀 主な機能・MVP': `### コア機能 (現在)
- **AI対話による企画書生成**: 対話を通じた戦略的思考支援
- **ビジネスフレームワーク統合**: 構造化された企画書自動生成
- **リアルタイム更新**: セクション別の企画書リアルタイム構築
- **思考深掘り支援**: 5W1H・ビジネスモデルキャンバス活用

### MVP検証項目
- ✅ **価値検証**: 企画書作成時間の大幅短縮を実証
- ✅ **ユーザビリティ**: 直感的な操作性を確認
- 🔄 **顧客検証**: 初期ユーザー5名でのインタビュー実施中
- 📋 **市場検証**: 企画書品質向上効果の定量測定

### 次期機能 (v0.2)
- **業界特化テンプレート**: SaaS・EC・FinTech・HealthTech別最適化
- **競合分析自動化**: 市場データ統合による自動分析
- **投資家マッチング**: 企画書内容ベースのVC・エンジェル推薦`,

  '🏗 実装戦略': `### MVP開発アプローチ
- **リーンスタートアップ**: Build-Measure-Learn高速サイクル
- **段階的リリース**: コア機能→拡張機能→スケール機能
- **ユーザーフィードバック重視**: 週次ユーザーインタビュー

### 開発パートナーシップ
- **技術パートナー**: 開発会社・フリーランス開発者との協業
- **外部ベンダー**: AI API・インフラサービス活用
- **アウトソーシング**: 非コア機能の外部委託

### プロダクト戦略
- **技術的差別化**: 独自のビジネスフレームワーク統合
- **ユーザビリティ**: 直感的で使いやすいインターフェース
- **スケーラビリティ**: 将来の成長に対応できる設計`,

  '💰 収益モデル・事業計画': `### 収益ストリーム
1. **SaaSサブスクリプション** (メイン)
   - Free: 月5企画書まで
   - Pro: ¥2,980/月 (無制限・高度機能)
   - Team: ¥9,800/月 (チーム共有・管理機能)

2. **従量課金** (サブ)
   - AI処理: ¥50/企画書 (Free枠超過分)
   - エクスポート: ¥100/PDF・PowerPoint変換

3. **エンタープライズ** (将来)
   - カスタマイズ: ¥50万〜/年
   - 専用環境: ¥200万〜/年

### 収益予測 (5年)
| 年 | ユーザー数 | ARPU | 年間売上 |
|---|----------|------|----------|
| Y1 | 100 | ¥36K | ¥3.6M |
| Y2 | 500 | ¥40K | ¥20M |
| Y3 | 2,000 | ¥45K | ¥90M |
| Y4 | 5,000 | ¥50K | ¥250M |
| Y5 | 10,000 | ¥55K | ¥550M |

### 単位経済性
- **CAC**: ¥5,000 (SEO・コンテンツマーケティング主体)
- **LTV**: ¥150,000 (平均利用期間50ヶ月 × ARPU)
- **LTV/CAC**: 30倍 (健全性指標)`,

  '📈 マーケティング戦略': `### GTM戦略 (Go-To-Market)
1. **Phase 1: 認知獲得** (3ヶ月)
   - 起業家コミュニティでのβテスト
   - ビジネスフレームワーク解説コンテンツSEO
   - Product Hunt・TechCrunch掲載

2. **Phase 2: 初期牽引** (6ヶ月)  
   - 成功事例ケーススタディ公開
   - 起業家インフルエンサーとのパートナーシップ
   - ビジネスプランコンテスト協賛

3. **Phase 3: スケーリング** (12ヶ月)
   - 大企業新規事業部門への直接営業
   - アクセラレーター・インキュベーター提携
   - 海外展開 (英語版リリース)

### チャネル戦略
- **デジタルマーケティング**: SEO (60%) + SNS (20%) + 有料広告 (20%)
- **パートナーシップ**: 起業支援団体・VC・アクセラレーター
- **コミュニティ**: ユーザー生成コンテンツ・企画書テンプレート共有

### KPI設定
- **認知**: 月間検索ボリューム10,000回
- **獲得**: 月間新規登録100名
- **アクティベーション**: 初回企画書完成率70%
- **リテンション**: 3ヶ月継続率60%`,

  '⚠️ リスク分析・対策': `### 主要リスク要因
1. **技術リスク**
   - **OpenAI API依存**: 料金変更・サービス停止リスク
   - **対策**: 複数AI provider対応・独自モデル検討

2. **競合リスク**  
   - **Big Techの参入**: Google・Microsoft等の同様サービス
   - **対策**: 差別化強化・ニッチ市場深耕・特許出願

3. **市場リスク**
   - **AI ハイプ終了**: AI ブーム終了による需要減
   - **対策**: AI以外の価値提供・根本的課題解決重視

4. **法的リスク**
   - **AI生成コンテンツの著作権**: 法的グレーゾーン
   - **対策**: 利用規約明記・保険加入・法務体制強化

### リスク軽減策
- **技術**: マルチクラウド・API抽象化レイヤー
- **事業**: 複数収益源・顧客セグメント分散
- **財務**: 18ヶ月分運転資金確保・段階的投資`,

  '🎯 今後の戦略・ロードマップ': `### 短期戦略 (3-6ヶ月)
- **プロダクト**: ユーザーフィードバック基盤完成・改善サイクル確立
- **顧客**: 初期ユーザー100名獲得・Net Promoter Score 50+達成
- **資金**: シード資金調達 ¥30M (18ヶ月runway確保)

### 中期戦略 (6-18ヶ月)  
- **プロダクト**: 業界特化版リリース・競合分析自動化
- **市場**: 大企業新規事業部門開拓・B2B営業体制構築
- **組織**: エンジニア2名・営業1名・マーケ1名採用

### 長期戦略 (2-5年)
- **プロダクト**: AI エージェント化・自動実行機能
- **市場**: 海外展開 (北米・東南アジア)・M&A検討
- **組織**: IPO準備・50名体制構築

### Exit戦略
1. **IPO**: 売上¥10B・時価総額¥100B規模 (5-7年後)
2. **M&A**: Microsoft・Google等への売却 (3-5年後)
3. **MBO**: 創業者による買い戻し (長期運営)`
};

const templateSections: Sections = {
  '📌 プロジェクト概要': `| 項目 | 内容 |
|------|------|
| プロジェクト名 | 未定 |
| 概要 | 未定 |
| 目的 | 未定 |`,
  '🎯 ターゲットユーザー': '- 未定',
  '💡 主な機能': '- 未定',
  '👥 チーム・役割': '- 未定',
  '📅 スケジュール': '- 未定',
};


export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'system',
      content: 'あなたはプロダクトマネージャーの書記です。ユーザーの発言を受けて、適切なMarkdownセクションを更新してください。'
    },
    {
      role: 'assistant',
      content: `# こんにちは！👋 

私はあなたの事業アイデアを企画書に仕上げる**AIパートナー**です。

## 🔍 最新市場情報にアクセス可能
**web検索機能**で競合分析、市場規模、投資動向などをリアルタイム調査できます

右側にはvibe起業.mdのデモ企画書が表示されていますが、あなたの新しいアイデアを聞かせてください！

### 質問例：
- どんな事業を考えていますか？
- 解決したい課題はありますか？  
- 既に何かプロダクトのアイデアはありますか？

市場調査や競合分析もリアルタイムで行いながら、データに基づいた企画書を一緒に作成しましょう！

> 最初のメッセージで新しい企画書作成を開始します！✨`
    }
  ]);
  const [sections, setSections] = useState<Sections>(demoSections);
  const [isFirstMessage, setIsFirstMessage] = useState(true);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const {
    copySuccess,
    handleCopy,
    handleExport,
    handleSectionUpdate
  } = useMarkdownPanel(sections, setSections);

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
      const response = await fetch('/api/apply-instruction', {
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
      
      // 新しい3タイプのレスポンス形式に対応
      switch (data.type) {
        case 'chat':
          // 会話のみの場合
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: data.message 
          }]);
          break;
          
        case 'update':
          // Markdown更新のみの場合
          if (data.markdown && Object.keys(data.markdown).length > 0) {
            console.log('Updating sections with markdown object:', data.markdown);
            setSections(prev => {
              const updated = { ...prev };
              Object.entries(data.markdown as Record<string, string>).forEach(([key, value]) => {
                if (value === '') {
                  // 空文字列の場合はセクションを削除
                  delete updated[key];
                } else {
                  updated[key] = value;
                }
              });
              return updated;
            });
          }
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: data.message 
          }]);
          break;
          
        case 'chat+update':
          // 会話とMarkdown更新の両方の場合
          if (data.markdown && Object.keys(data.markdown).length > 0) {
            console.log('Updating sections with markdown object:', data.markdown);
            setSections(prev => {
              const updated = { ...prev };
              Object.entries(data.markdown as Record<string, string>).forEach(([key, value]) => {
                if (value === '') {
                  // 空文字列の場合はセクションを削除
                  delete updated[key];
                } else {
                  updated[key] = value;
                }
              });
              return updated;
            });
          }
          setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: data.message 
          }]);
          break;
          
        default:
          // 旧形式のレスポンスとの互換性維持
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
    if (confirm('チャット履歴をクリアしますか？企画書の内容もリセットされます。')) {
      // 状態をリセット
      setMessages([
        {
          role: 'system',
          content: 'あなたはプロダクトマネージャーの書記です。ユーザーの発言を受けて、適切なMarkdownセクションを更新してください。'
        },
        {
          role: 'assistant',
          content: `# こんにちは！👋 

私はあなたの事業アイデアを企画書に仕上げる**AIパートナー**です。

## 🔍 最新市場情報にアクセス可能
**web検索機能**で競合分析、市場規模、投資動向などをリアルタイム調査できます

右側にはvibe起業.mdのデモ企画書が表示されていますが、あなたの新しいアイデアを聞かせてください！

### 質問例：
- どんな事業を考えていますか？
- 解決したい課題はありますか？  
- 既に何かプロダクトのアイデアはありますか？

市場調査や競合分析もリアルタイムで行いながら、データに基づいた企画書を一緒に作成しましょう！

> 最初のメッセージで新しい企画書作成を開始します！✨`
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
          title="vibe起業.md - AIと壁打ち"
          appSwitchUrl="/code"
          appSwitchLabel="📱 vibeアプリ"
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
          placeholder="アイデアや要望を入力してください...（⌘+Enter で送信）"
          onInputChange={setInput}
          onSubmit={handleSubmit}
        />
      </div>

      {/* Markdown Panel */}
      <MarkdownPanel
        title="企画書 (Markdown)"
        copySuccess={copySuccess}
        sections={sections}
        onCopy={handleCopy}
        onExport={() => handleExport('企画書')}
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
              // 現在の企画書データをlocalStorageに保存
              const businessData = {
                sections: sections,
                timestamp: Date.now(),
                lastMessage: messages.filter(m => m.role !== 'system').slice(-1)[0]?.content || ''
              };
              localStorage.setItem('vibeBusinessData', JSON.stringify(businessData));
              
              // vibeアプリに繋ぎ込み
              window.location.href = '/code?from=business';
            }}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
          >
            エクスポート(vibeアプリ)
          </button>
        }
      />
    </div>
  );
}

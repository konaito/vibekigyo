'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Message, Sections } from '../../types/chat';
import ChatMessages from '../../components/chat/ChatMessages';
import ChatInput from '../../components/chat/ChatInput';
import MarkdownPanel from '../../components/markdown/MarkdownPanel';
import Header from '../../components/layout/Header';
import { useMarkdownPanel } from '../../hooks/useMarkdownPanel';
import { formUrl } from '../../lib/form-url';
import { techDemoSections, techTemplateSections } from '../../data/tech-demo-sections';


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

最新の技術動向を調査しながら、実装可能な技術仕様書を作成します。

**💡 推奨技術スタック**: Flutter + Supabase + Next.js (簡単で高品質なアプリ開発)

> 最初のメッセージで新しい技術仕様書作成を開始します！🔧`
    }
  ]);
  const [sections, setSections] = useState<Sections>(techDemoSections);
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
          sections: techTemplateSections, // 空のテンプレートから開始
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
        setSections(techTemplateSections);
        
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
      setSections(techTemplateSections);
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

最新の技術動向を調査しながら、実装可能な技術仕様書を作成します。

**💡 推奨技術スタック**: Flutter + Supabase + Next.js (簡単で高品質なアプリ開発)

> 最初のメッセージで新しい技術仕様書作成を開始します！🔧`
        }
      ]);
      setSections(techDemoSections);
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
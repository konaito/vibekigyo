'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Message, Sections } from '../../types/chat';
import ChatMessages from '../../components/chat/ChatMessages';
import ChatInput from '../../components/chat/ChatInput';
import MarkdownPanel from '../../components/markdown/MarkdownPanel';
import Header from '../../components/layout/Header';
import ChatSidebar from '../../components/chat/ChatSidebar';
import { useMarkdownPanel } from '../../hooks/useMarkdownPanel';
import { useUserLevel } from '../../hooks/useUserLevel';
import { techDemoSections, techTemplateSections } from '../../data/tech-demo-sections';
import { ChatSession } from '../../lib/chat-sessions';
import { SessionManager } from '../../lib/session-manager';


export default function CodePage() {
  const sessionManager = useMemo(() => new SessionManager('app'), []);
  
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

**💡 ヒント：**
- **事業プランから考えたい**場合は → [💼 vibe起業](/)で事業企画書を作成してからエクスポート
- **アプリアイデアが具体的**な場合は → このまま技術仕様書作成を進めましょう！

> 最初のメッセージで新しい技術仕様書作成を開始します！🔧`
    }
  ]);
  const [sections, setSections] = useState<Sections>(techDemoSections);
  const [isFirstMessage, setIsFirstMessage] = useState(true);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  
  const { userLevel, setUserLevel } = useUserLevel();
  
  const {
    copySuccess,
    handleCopy,
    handleExport,
    handleSectionUpdate
  } = useMarkdownPanel(sections, setSections);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // チャットセッションの自動保存
  const autoSaveSession = useCallback(async (newMessages?: Message[], forceSections?: Sections) => {
    try {
      const sessionId = await sessionManager.autoSave(
        messages,
        sections,
        newMessages,
        forceSections
      );

      if (!currentSessionId) {
        setCurrentSessionId(sessionId);
        sessionManager.setCurrentSessionId(sessionId);
      }
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  }, [messages, sections, currentSessionId, sessionManager]);

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
          messages: messages,
          userLevel
        }),
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
          throw new Error(`APIエラーが発生しました (ステータス: ${response.status})`);
        }
        console.error('API Error:', errorData);
        throw new Error(errorData.details || errorData.error || `APIエラーが発生しました (ステータス: ${response.status})`);
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
      
      // 自動生成後の保存処理
      await autoSaveSession();
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
  }, [messages, userLevel, autoSaveSession]);

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

  // セッション読み込み処理
  const handleLoadSession = (session: ChatSession) => {
    const systemMessage: Message = {
      role: 'system',
      content: 'あなたはシニア技術アーキテクト兼プロダクトエンジニアです。ユーザーのアプリアイデアを聞いて、技術実装に特化した詳細な開発仕様書を作成してください。技術スタック、API設計、データベース設計、UI/UX実装、開発工程に特化した実行可能な技術設計を生成します。'
    };
    
    sessionManager.loadSession(
      session,
      setCurrentSessionId,
      setMessages,
      setSections,
      systemMessage
    );
    
    setIsFirstMessage(false);
  };

  // 新しいチャットを開始
  const handleNewChat = () => {
    const defaultMessages: Message[] = [
      {
        role: 'system' as const,
        content: 'あなたはシニア技術アーキテクト兼プロダクトエンジニアです。ユーザーのアプリアイデアを聞いて、技術実装に特化した詳細な開発仕様書を作成してください。技術スタック、API設計、データベース設計、UI/UX実装、開発工程に特化した実行可能な技術設計を生成します。'
      },
      {
        role: 'assistant' as const,
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

**💡 ヒント：**
- **事業プランから考えたい**場合は → [💼 vibe起業](/)で事業企画書を作成してからエクスポート
- **アプリアイデアが具体的**な場合は → このまま技術仕様書作成を進めましょう！

> 最初のメッセージで新しい技術仕様書作成を開始します！🔧`
      }
    ];

    sessionManager.startNewChat(
      setCurrentSessionId,
      setIsFirstMessage,
      setSections,
      setMessages,
      techDemoSections,
      defaultMessages
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    const newMessages = [...messages, { role: 'user' as const, content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);
    
    // 2. チャットが送信されたタイミングで保存
    await autoSaveSession(newMessages);

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
          messages: newMessages,
          userLevel
        }),
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
          throw new Error(`APIエラーが発生しました (ステータス: ${response.status})`);
        }
        console.error('API Error:', errorData);
        throw new Error(errorData.details || errorData.error || `APIエラーが発生しました (ステータス: ${response.status})`);
      }

      const data = await response.json();
      console.log('Full API response:', data);
      
      // レスポンス形式に対応
      let finalMessages = newMessages;
      let finalSections = sections;
      
      switch (data.type) {
        case 'chat':
          finalMessages = [...newMessages, { 
            role: 'assistant', 
            content: data.message 
          }];
          setMessages(finalMessages);
          break;
          
        case 'update':
          if (data.markdown && Object.keys(data.markdown).length > 0) {
            console.log('Updating sections with markdown object:', data.markdown);
            finalSections = { ...sections };
            Object.entries(data.markdown as Record<string, string>).forEach(([key, value]) => {
              if (value === '') {
                // 空文字列の場合はセクションを削除
                delete finalSections[key];
              } else {
                finalSections[key] = value;
              }
            });
            setSections(finalSections);
          }
          finalMessages = [...newMessages, { 
            role: 'assistant', 
            content: data.message 
          }];
          setMessages(finalMessages);
          break;
          
        case 'chat+update':
          if (data.markdown && Object.keys(data.markdown).length > 0) {
            console.log('Updating sections with markdown object:', data.markdown);
            finalSections = { ...sections };
            Object.entries(data.markdown as Record<string, string>).forEach(([key, value]) => {
              if (value === '') {
                // 空文字列の場合はセクションを削除
                delete finalSections[key];
              } else {
                finalSections[key] = value;
              }
            });
            setSections(finalSections);
          }
          finalMessages = [...newMessages, { 
            role: 'assistant', 
            content: data.message 
          }];
          setMessages(finalMessages);
          break;
          
        default:
          if (data.updated) {
            finalSections = { ...sections, ...data.updated };
            setSections(finalSections);
            const updatedSections = Object.keys(data.updated);
            finalMessages = [...newMessages, { 
              role: 'assistant', 
              content: `更新しました: ${updatedSections.join(', ')}\n\n${updatedSections.map(section => `【${section}】\n${data.updated[section].split('\n').slice(0, 3).join('\n')}${data.updated[section].split('\n').length > 3 ? '\n...' : ''}`).join('\n\n')}` 
            }];
            setMessages(finalMessages);
          } else {
            finalMessages = [...newMessages, { 
              role: 'assistant', 
              content: '理解しました。何か具体的な更新が必要でしたらお知らせください。' 
            }];
            setMessages(finalMessages);
          }
      }
      
      // 3. AIからの返信が返ってきたタイミングで保存
      await autoSaveSession(finalMessages, finalSections);
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



  return (
    <div className="h-screen flex bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Chat Sidebar */}
      <ChatSidebar
        appType="app"
        currentSessionId={currentSessionId}
        onLoadSession={handleLoadSession}
        onNewChat={handleNewChat}
      />
      
      <div className="flex-1 grid grid-cols-2">
        {/* Chat Panel */}
        <div className="border-r border-gray-200 flex flex-col bg-white h-screen shadow-sm">
        <Header
          title="vibeアプリ.md - 技術仕様書AI"
          appSwitchUrl="/"
          appSwitchLabel="💼 vibe起業"
          userLevel={userLevel}
          onUserLevelChange={setUserLevel}
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
        copySuccess={copySuccess}
        sections={sections}
        onCopy={handleCopy}
        onExport={() => handleExport('技術仕様書')}
        onSectionUpdate={handleSectionUpdate}
        onEditNotification={async (message) => {
          const newMessages = [...messages, { 
            role: 'user' as const, 
            content: message 
          }];
          setMessages(newMessages);
          
          // 1. MDの変更がチャット欄に反映されたタイミングで保存
          // 少し遅延させて最新のsectionsを確実に取得
          setTimeout(async () => {
            await autoSaveSession(newMessages);
          }, 100);
        }}
        />
      </div>
    </div>
  );
}
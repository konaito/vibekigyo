'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { Message, Sections } from '../types/chat';
import ChatMessages from '../components/chat/ChatMessages';
import ChatInput from '../components/chat/ChatInput';
import MarkdownPanel from '../components/markdown/MarkdownPanel';
import Header from '../components/layout/Header';
import ChatSidebar from '../components/chat/ChatSidebar';
import { useMarkdownPanel } from '../hooks/useMarkdownPanel';
import { businessDemoSections, businessTemplateSections } from '../data/business-demo-sections';
import { ChatSession } from '../lib/chat-sessions';
import { SessionManager } from '../lib/session-manager';


export default function Home() {
  const sessionManager = useMemo(() => new SessionManager('business'), []);
  
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

**💡 ヒント：**
- **具体的な事業アイデア**が決まっている場合は → [📱 vibeアプリ](/code)でプロダクト設計を開始
- **事業アイデアから考えたい**場合は → このまま企画書作成を進めましょう！

> 最初のメッセージで新しい企画書作成を開始します！✨`
    }
  ]);
  const [sections, setSections] = useState<Sections>(businessDemoSections);
  const [isFirstMessage, setIsFirstMessage] = useState(true);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
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

  // チャットセッションの自動保存
  const autoSaveSession = async (newMessages?: Message[], forceSections?: Sections) => {
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
  };

  // セッション読み込み処理
  const handleLoadSession = (session: ChatSession) => {
    const systemMessage: Message = {
      role: 'system',
      content: 'あなたはプロダクトマネージャーの書記です。ユーザーの発言を受けて、適切なMarkdownセクションを更新してください。'
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
        content: 'あなたはプロダクトマネージャーの書記です。ユーザーの発言を受けて、適切なMarkdownセクションを更新してください。'
      },
      {
        role: 'assistant' as const,
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

**💡 ヒント：**
- **具体的な事業アイデア**が決まっている場合は → [📱 vibeアプリ](/code)でプロダクト設計を開始
- **事業アイデアから考えたい**場合は → このまま企画書作成を進めましょう！

> 最初のメッセージで新しい企画書作成を開始します！✨`
      }
    ];

    sessionManager.startNewChat(
      setCurrentSessionId,
      setIsFirstMessage,
      setSections,
      setMessages,
      businessDemoSections,
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
      setSections(businessTemplateSections);
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
      
      // 新しい3タイプのレスポンス形式に対応
      let finalMessages = newMessages;
      let finalSections = sections;
      
      switch (data.type) {
        case 'chat':
          // 会話のみの場合
          finalMessages = [...newMessages, { 
            role: 'assistant', 
            content: data.message 
          }];
          setMessages(finalMessages);
          break;
          
        case 'update':
          // Markdown更新のみの場合
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
          // 会話とMarkdown更新の両方の場合
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
          // 旧形式のレスポンスとの互換性維持
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
        content: error instanceof Error 
          ? error.message 
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
        appType="business"
        currentSessionId={currentSessionId}
        onLoadSession={handleLoadSession}
        onNewChat={handleNewChat}
      />
      
      <div className="flex-1 grid grid-cols-2">
        {/* Chat Panel */}
        <div className="border-r border-gray-200 flex flex-col bg-white h-screen shadow-sm">
        <Header
          title="vibe起業.md - AIと壁打ち"
          appSwitchUrl="/code"
          appSwitchLabel="📱 vibeアプリ"
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
        copySuccess={copySuccess}
        sections={sections}
        onCopy={handleCopy}
        onExport={() => handleExport('企画書')}
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
    </div>
  );
}
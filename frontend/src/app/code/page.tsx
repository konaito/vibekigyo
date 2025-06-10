'use client';

import { useState, useRef, useEffect } from 'react';
import ChatMessages from '../../components/chat/ChatMessages';
import ChatInput from '../../components/chat/ChatInput';
import MarkdownPanel from '../../components/markdown/MarkdownPanel';
import Header from '../../components/layout/Header';
import ChatSidebar from '../../components/chat/ChatSidebar';
import { useMarkdownPanel } from '../../hooks/useMarkdownPanel';
import { useUserLevel } from '../../hooks/useUserLevel';
import { useSessionManager } from '../../hooks/useSessionManager';
import { useChatHandler } from '../../hooks/useChatHandler';
import { techDemoSections, techTemplateSections } from '../../data/tech-demo-sections';
import { techDefaultMessages } from '../../data/default-messages';


export default function CodePage() {

  const {
    currentSessionId,
    messages,
    sections,
    isFirstMessage,
    setMessages,
    setSections,
    setIsFirstMessage,
    autoSaveSession,
    handleLoadSession,
    handleNewChat,
    handleSessionFromUrl,
    handleEditNotification
  } = useSessionManager({
    appType: 'app',
    defaultSections: techDemoSections,
    defaultMessages: techDefaultMessages
  });
  
  const { userLevel, setUserLevel } = useUserLevel();
  
  const {
    copySuccess,
    handleCopy,
    handleExport,
    handleSectionUpdate
  } = useMarkdownPanel(sections, setSections);

  // 統合されたチャット処理ハンドラー
  const { isLoading, handleChatSubmit } = useChatHandler({
    messages,
    sections,
    isFirstMessage,
    templateSections: techTemplateSections,
    setMessages,
    setSections,
    setIsFirstMessage,
    autoSaveSession,
    apiEndpoint: '/api/generate-plan',
    userLevel
  });

  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);


  // エクスポート(vibeアプリ)からの遷移処理
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
          .map(([title, content]) => `## ${title}\n\n${String(content)}`)
          .join('\n\n');
        
        // テンプレートセクションにリセット
        setSections(techTemplateSections);
        
        // 事業アイデア全体を最初のメッセージとして送信
        const initialMessage = `以下はvibe起業.mdで作成した事業企画書です。この事業アイデアをアプリとして実現するための詳細な開発企画書を作成してください：\n\n${businessMarkdown}`;
        
        // 一回目のchatを起動
        handleChatSubmit(initialMessage);
        
        // URLをクリーンアップ
        window.history.replaceState({}, document.title, '/code');
        
        // 使用済みデータを削除
        localStorage.removeItem('vibeBusinessData');
      } catch (error) {
        console.log('Failed to parse business data:', error);
        localStorage.removeItem('vibeBusinessData');
      }
    }
  }, [handleChatSubmit, setSections]);

  // URLパラメータからセッション読み込み
  useEffect(() => {
    const systemMessage = techDefaultMessages[0];
    handleSessionFromUrl(systemMessage);
  }, [handleSessionFromUrl]);

  // 統合されたチャット送信処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    await handleChatSubmit(userMessage);
  };



  return (
    <div className="h-screen flex bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Chat Sidebar */}
      <ChatSidebar
        appType="app"
        currentSessionId={currentSessionId}
        onLoadSession={(session) => {
          const systemMessage = techDefaultMessages[0];
          handleLoadSession(session, systemMessage);
        }}
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
        onEditNotification={handleEditNotification}
        />
      </div>
    </div>
  );
}
'use client';

import { useState, useRef, useEffect } from 'react';
import ChatMessages from '../components/chat/ChatMessages';
import ChatInput from '../components/chat/ChatInput';
import MarkdownPanel from '../components/markdown/MarkdownPanel';
import Header from '../components/layout/Header';
import ChatSidebar from '../components/chat/ChatSidebar';
import { useMarkdownPanel } from '../hooks/useMarkdownPanel';
import { useSessionManager } from '../hooks/useSessionManager';
import { useChatHandler } from '../hooks/useChatHandler';
import { businessDemoSections, businessTemplateSections } from '../data/business-demo-sections';
import { businessDefaultMessages } from '../data/default-messages';


export default function Home() {

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
    appType: 'business',
    defaultSections: businessDemoSections,
    defaultMessages: businessDefaultMessages
  });

  const {
    copySuccess,
    handleCopy,
    handleExport,
    handleSectionUpdate
  } = useMarkdownPanel(sections, setSections);

  // 統合されたチャット処理ハンドラー（business用）
  const { isLoading, handleChatSubmit } = useChatHandler({
    messages,
    sections,
    isFirstMessage,
    templateSections: businessTemplateSections,
    setMessages,
    setSections,
    setIsFirstMessage,
    autoSaveSession,
    apiEndpoint: '/api/apply-instruction'
    // userLevelはbusinessでは使用しない
  });

  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // URLパラメータからセッション読み込み
  useEffect(() => {
    const systemMessage = businessDefaultMessages[0];
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
        appType="business"
        currentSessionId={currentSessionId}
        onLoadSession={(session) => {
          const systemMessage = businessDefaultMessages[0];
          handleLoadSession(session, systemMessage);
        }}
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
        onEditNotification={handleEditNotification}
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
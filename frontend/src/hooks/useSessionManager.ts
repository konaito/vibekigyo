import { useState, useCallback, useMemo } from 'react';
import { Message, Sections } from '../types/chat';
import { ChatSession, ChatSessionManager } from '../lib/chat-sessions';
import { SessionManager } from '../lib/session-manager';

interface UseSessionManagerProps {
  appType: 'business' | 'app';
  defaultSections: Sections;
  defaultMessages: Message[];
}

export function useSessionManager({
  appType,
  defaultSections,
  defaultMessages
}: UseSessionManagerProps) {
  const sessionManager = useMemo(() => new SessionManager(appType), [appType]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>(defaultMessages);
  const [sections, setSections] = useState<Sections>(defaultSections);
  const [isFirstMessage, setIsFirstMessage] = useState(true);

  // 自動保存
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
  }, [sessionManager, messages, sections, currentSessionId]);

  // セッション読み込み
  const handleLoadSession = useCallback((session: ChatSession, systemMessage: Message) => {
    sessionManager.loadSession(
      session,
      setCurrentSessionId,
      setMessages,
      setSections,
      systemMessage
    );
    setIsFirstMessage(false);
  }, [sessionManager]);

  // 新しいチャット開始
  const handleNewChat = useCallback(() => {
    sessionManager.startNewChat(
      setCurrentSessionId,
      setIsFirstMessage,
      setSections,
      setMessages,
      defaultSections,
      defaultMessages
    );
  }, [sessionManager, defaultSections, defaultMessages]);

  // URLパラメータからセッション読み込み
  const handleSessionFromUrl = useCallback((systemMessage: Message) => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session');
    
    if (sessionId) {
      ChatSessionManager.getSession(sessionId).then(session => {
        if (session && session.app_type === appType) {
          handleLoadSession(session, systemMessage);
          // URLをクリーンアップ
          const targetUrl = appType === 'business' ? '/' : '/code';
          window.history.replaceState({}, document.title, targetUrl);
        }
      }).catch(error => {
        console.error('Failed to load session from URL:', error);
      });
    }
  }, [appType, handleLoadSession]);

  // MD編集通知の処理
  const handleEditNotification = useCallback(async (message: string) => {
    const newMessages = [...messages, { 
      role: 'user' as const, 
      content: message 
    }];
    setMessages(newMessages);
    
    // MDの変更がチャット欄に反映されたタイミングで保存
    setTimeout(async () => {
      await autoSaveSession(newMessages, sections);
    }, 100);
  }, [messages, sections, autoSaveSession]);


  return {
    // State
    currentSessionId,
    messages,
    sections,
    isFirstMessage,
    setMessages,
    setSections,
    setIsFirstMessage,
    
    // Functions
    autoSaveSession,
    handleLoadSession,
    handleNewChat,
    handleSessionFromUrl,
    handleEditNotification,
    
    // SessionManager instance
    sessionManager
  };
}
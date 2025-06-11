import { useState, useCallback, useMemo, useEffect } from 'react';
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

  // メッセージまたはセクションが変更されたときの自動保存
  useEffect(() => {
    // 初期状態や空の状態では保存しない
    if (messages.length <= 1 || Object.keys(sections).length === 0) return;
    
    const saveTimeout = setTimeout(async () => {
      try {
        await sessionManager.autoSave(messages, sections);
        if (!currentSessionId && sessionManager.getCurrentSessionId()) {
          setCurrentSessionId(sessionManager.getCurrentSessionId());
        }
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }, 500); // 500ms のデバウンス

    return () => clearTimeout(saveTimeout);
  }, [messages, sections, sessionManager, currentSessionId]);

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
    // sectionsはuseEffectで監視して自動保存される
  }, [messages]);


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
import { Message, Sections } from '../types/chat';
import { ChatSessionManager, ChatMessage, ChatSession } from './chat-sessions';

export class SessionManager {
  private currentSessionId: string | null = null;
  private appType: 'business' | 'app';

  constructor(appType: 'business' | 'app') {
    this.appType = appType;
  }

  setCurrentSessionId(sessionId: string | null) {
    this.currentSessionId = sessionId;
  }

  getCurrentSessionId(): string | null {
    return this.currentSessionId;
  }

  /**
   * チャットセッションの自動保存
   * @param messages 保存するメッセージ（未指定の場合は現在のmessagesを使用）
   * @param sections 保存するセクション（未指定の場合は現在のsectionsを使用）
   * @param currentMessages 現在のメッセージ状態
   * @param currentSections 現在のセクション状態
   */
  async autoSave(
    currentMessages: Message[],
    currentSections: Sections,
    newMessages?: Message[],
    forceSections?: Sections
  ): Promise<string> {
    try {
      const messagesToSave = newMessages || currentMessages;
      // 常に最新のsectionsを使用（forceSectionsが指定されていればそれを優先）
      const sectionsToSave = forceSections || currentSections;
      
      // systemメッセージを除いてChatMessage形式に変換
      const chatMessages: ChatMessage[] = messagesToSave
        .filter(msg => msg.role !== 'system')
        .map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content
        }));

      // セクションをMarkdown文字列に変換（全セクションを保存）
      const markdownContent = Object.entries(sectionsToSave)
        .map(([key, value]) => `## ${key}\n\n${value}`)
        .join('\n\n');

      console.log(`Saving ${this.appType} session with sections:`, Object.keys(sectionsToSave));

      const sessionId = await ChatSessionManager.autoSave(
        this.currentSessionId,
        this.appType,
        chatMessages,
        markdownContent
      );

      if (!this.currentSessionId) {
        this.currentSessionId = sessionId;
      }

      return sessionId;
    } catch (error) {
      console.error('Auto-save failed:', error);
      throw error;
    }
  }

  /**
   * セッション読み込み処理
   */
  loadSession(
    session: ChatSession,
    setCurrentSessionId: (id: string) => void,
    setMessages: (messages: Message[]) => void,
    setSections: (sections: Sections) => void,
    systemMessage: Message
  ) {
    try {
      // セッションIDを設定
      setCurrentSessionId(session.id);
      this.currentSessionId = session.id;
      
      // メッセージを復元（systemメッセージを先頭に追加）
      const restoredMessages: Message[] = [systemMessage, ...session.messages];
      setMessages(restoredMessages);
      
      // Markdownコンテンツを復元
      if (session.markdown_content) {
        // Markdownコンテンツをセクションに分割
        const sectionsFromMarkdown: Sections = {};
        const sections = session.markdown_content.split('## ').filter(Boolean);
        
        sections.forEach((section: string) => {
          const lines = section.split('\n');
          const title = lines[0];
          const content = lines.slice(2).join('\n'); // 最初の空行をスキップ
          if (title && content) {
            sectionsFromMarkdown[title] = content;
          }
        });
        
        setSections(sectionsFromMarkdown);
      }
      
    } catch (error) {
      console.error('Failed to load session:', error);
      alert('セッションの読み込みに失敗しました');
    }
  }

  /**
   * 新しいチャットを開始
   */
  startNewChat(
    setCurrentSessionId: (id: string | null) => void,
    setIsFirstMessage: (isFirst: boolean) => void,
    setSections: (sections: Sections) => void,
    setMessages: (messages: Message[]) => void,
    defaultSections: Sections,
    defaultMessages: Message[]
  ) {
    setCurrentSessionId(null);
    this.currentSessionId = null;
    setIsFirstMessage(true);
    setSections(defaultSections);
    setMessages(defaultMessages);
  }
}
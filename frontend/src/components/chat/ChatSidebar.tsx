'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChatSession, ChatSessionManager } from '../../lib/chat-sessions';

interface ChatSidebarProps {
  appType: 'business' | 'app';
  currentSessionId: string | null;
  onLoadSession: (session: ChatSession) => void;
  onNewChat: () => void;
}

export default function ChatSidebar({ appType, currentSessionId, onLoadSession, onNewChat }: ChatSidebarProps) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const loadSessions = useCallback(async () => {
    setIsLoading(true);
    try {
      // 両方のタイプのセッションを取得
      const [businessSessions, appSessions] = await Promise.all([
        ChatSessionManager.getSessions('business'),
        ChatSessionManager.getSessions('app')
      ]);
      
      // 統合して更新日時順にソート
      const allSessions = [...businessSessions, ...appSessions]
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
      
      setSessions(allSessions);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const handleDeleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('このチャットセッションを削除してもよろしいですか？')) {
      return;
    }

    try {
      await ChatSessionManager.deleteSession(sessionId);
      
      // セッションリストを再読み込み
      await loadSessions();
      
      // 現在のセッションが削除された場合は新しいチャットを開始
      if (sessionId === currentSessionId) {
        onNewChat();
      }
    } catch (error) {
      console.error('Failed to delete session:', error);
      alert('セッションの削除に失敗しました');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return '1時間以内';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}時間前`;
    } else if (diffInHours < 24 * 7) {
      return `${Math.floor(diffInHours / 24)}日前`;
    } else {
      return date.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' });
    }
  };

  const getPreviewText = (session: ChatSession) => {
    const userMessages = session.messages.filter(msg => msg.role === 'user');
    const firstUserMessage = userMessages[0]?.content || '';
    const lastUserMessage = userMessages[userMessages.length - 1]?.content || '';
    
    return {
      preview: firstUserMessage.substring(0, isCollapsed ? 5 : 20),
      fullText: lastUserMessage
    };
  };

  return (
    <div className={`bg-gray-50 border-r border-gray-200 flex flex-col transition-all duration-300 ${
      isCollapsed ? 'w-12' : 'w-64'
    }`}>
      {/* Header */}
      <div className={`border-b border-gray-200 bg-white ${isCollapsed ? 'p-1' : 'p-3'}`}>
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h3 className="font-medium text-gray-900 text-sm">
              vibe起業.md
            </h3>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`text-gray-400 hover:text-gray-600 transition-colors ${
              isCollapsed ? 'p-2 w-full flex justify-center' : 'p-1'
            }`}
            title={isCollapsed ? '展開' : '折りたたみ'}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d={isCollapsed ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"}
              />
            </svg>
          </button>
        </div>
      </div>

      {/* New Chat Button */}
      <div className={isCollapsed ? 'p-1' : 'p-3'}>
        <button
          onClick={onNewChat}
          className={`w-full bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium flex items-center justify-center ${
            isCollapsed ? 'p-2 text-lg' : 'py-2 px-3 text-sm'
          }`}
          title="新しいチャットを開始"
        >
          {isCollapsed ? '＋' : '＋ 新しいチャット'}
        </button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className={`text-center ${isCollapsed ? 'p-1' : 'p-3'}`}>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mx-auto"></div>
            {!isCollapsed && <span className="text-xs text-gray-500 mt-2 block">読み込み中...</span>}
          </div>
        ) : sessions.length === 0 ? (
          !isCollapsed && (
            <div className="p-3 text-center text-gray-500 text-xs">
              チャット履歴がありません
            </div>
          )
        ) : (
          <div className={`space-y-1 ${isCollapsed ? 'p-1' : 'p-2'}`}>
            {sessions.map((session) => {
              const { preview, fullText } = getPreviewText(session);
              const isActive = session.id === currentSessionId;
              
              return (
                <div
                  key={session.id}
                  onClick={() => {
                    // 現在のページと異なるタイプのセッションの場合、適切なページに遷移
                    if (session.app_type !== appType) {
                      const targetUrl = session.app_type === 'business' ? '/' : '/code';
                      // セッションIDをURLパラメータとして渡す
                      window.location.href = `${targetUrl}?session=${session.id}`;
                    } else {
                      // 同じタイプの場合は通常通りロード
                      onLoadSession(session);
                    }
                  }}
                  className={`group relative cursor-pointer rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-blue-100 border border-blue-200' 
                      : 'hover:bg-gray-100 border border-transparent'
                  } ${isCollapsed ? 'p-1' : 'p-3'}`}
                  title={isCollapsed ? fullText : ''}
                >
                  {isCollapsed ? (
                    // 折りたたみ時：アイコン表示
                    <div className="w-full flex justify-center">
                      <div className={`text-lg ${
                        isActive ? 'opacity-100' : 'opacity-60'
                      }`}>
                        {session.app_type === 'business' ? '💼' : '⚡'}
                      </div>
                    </div>
                  ) : (
                    // 展開時：通常表示
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm">
                            {session.app_type === 'business' ? '💼' : '⚡'}
                          </span>
                          <div className="text-xs text-gray-500">
                            {formatDate(session.updated_at)}
                          </div>
                        </div>
                        <div 
                          className="text-sm text-gray-900 font-medium truncate"
                          title={fullText}
                        >
                          {preview || '新しいチャット'}
                          {preview.length > 20 && '...'}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {session.messages.filter(m => m.role === 'user').length} メッセージ
                        </div>
                      </div>
                      <button
                        onClick={(e) => handleDeleteSession(session.id, e)}
                        className="ml-2 p-1 text-gray-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                        title="削除"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
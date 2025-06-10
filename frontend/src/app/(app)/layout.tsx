'use client';

import { usePathname } from 'next/navigation';
import ChatSidebar from '../../components/chat/ChatSidebar';
import { ChatSession } from '../../lib/chat-sessions';

interface AppGroupLayoutProps {
  children: React.ReactNode;
}

export default function AppGroupLayout({ children }: AppGroupLayoutProps) {
  const pathname = usePathname();
  const appType = pathname === '/code' ? 'app' : 'business';

  const handleSidebarLoadSession = (session: ChatSession) => {
    // 現在のページと異なるタイプのセッションの場合、適切なページに遷移
    if (session.app_type !== appType) {
      const targetUrl = session.app_type === 'business' ? '/' : '/code';
      window.location.href = `${targetUrl}?session=${session.id}`;
    } else {
      // 同じタイプの場合はページリロード（各ページでセッション管理するため）
      window.location.href = `${pathname}?session=${session.id}`;
    }
  };

  const handleNewChat = () => {
    // 新しいチャット開始時もページリロード
    window.location.href = pathname;
  };

  return (
    <div className="h-screen flex bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Chat Sidebar */}
      <ChatSidebar
        appType={appType}
        currentSessionId={null} // 各ページで管理するためnull
        onLoadSession={handleSidebarLoadSession}
        onNewChat={handleNewChat}
      />
      
      {/* Main Content */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
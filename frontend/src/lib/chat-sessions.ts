export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface ChatSession {
  id: string
  user_id: string
  app_type: 'business' | 'app'
  title: string
  messages: ChatMessage[]
  markdown_content?: string
  created_at: string
  updated_at: string
}

export class ChatSessionManager {
  private static async request(url: string, options?: RequestInit) {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Request failed')
    }

    return response.json()
  }

  // チャットセッション一覧を取得
  static async getSessions(appType?: 'business' | 'app'): Promise<ChatSession[]> {
    const url = new URL('/api/chat-sessions', window.location.origin)
    if (appType) {
      url.searchParams.set('app_type', appType)
    }

    const data = await this.request(url.toString())
    return data.sessions
  }


  // 新しいチャットセッションを作成
  static async createSession(
    appType: 'business' | 'app',
    messages: ChatMessage[],
    markdownContent?: string,
    title?: string
  ): Promise<ChatSession> {
    const data = await this.request('/api/chat-sessions', {
      method: 'POST',
      body: JSON.stringify({
        app_type: appType,
        title,
        messages,
        markdown_content: markdownContent,
      }),
    })
    return data.session
  }

  // チャットセッションを更新
  static async updateSession(
    id: string,
    updates: {
      title?: string
      messages?: ChatMessage[]
      markdown_content?: string
    }
  ): Promise<ChatSession> {
    const data = await this.request(`/api/chat-sessions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
    return data.session
  }

  // チャットセッションを削除
  static async deleteSession(id: string): Promise<void> {
    await this.request(`/api/chat-sessions/${id}`, {
      method: 'DELETE',
    })
  }

  // チャットセッションの自動保存
  static async autoSave(
    sessionId: string | null,
    appType: 'business' | 'app',
    messages: ChatMessage[],
    markdownContent?: string
  ): Promise<string> {
    if (sessionId) {
      // 既存セッションを更新
      await this.updateSession(sessionId, {
        messages,
        markdown_content: markdownContent,
      })
      return sessionId
    } else {
      // 新しいセッションを作成
      const session = await this.createSession(appType, messages, markdownContent)
      return session.id
    }
  }

  // 単一のセッションを取得
  static async getSession(sessionId: string): Promise<ChatSession | null> {
    const response = await fetch(`/api/chat-sessions/${sessionId}`)
    
    if (!response.ok) {
      console.error('Failed to get session')
      return null
    }

    return response.json()
  }
}
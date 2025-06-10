import { useState, useCallback, Dispatch, SetStateAction } from 'react';
import { Message, Sections } from '../types/chat';

interface ChatResponse {
  type: 'chat' | 'update' | 'chat+update';
  message: string;
  markdown?: Record<string, string>;
  updated?: Record<string, string>;
}

interface UseChatHandlerProps {
  messages: Message[];
  sections: Sections;
  isFirstMessage: boolean;
  templateSections: Sections;
  setMessages: Dispatch<SetStateAction<Message[]>>;
  setSections: Dispatch<SetStateAction<Sections>>;
  setIsFirstMessage: Dispatch<SetStateAction<boolean>>;
  autoSaveSession: (newMessages?: Message[], forceSections?: Sections) => Promise<void>;
  apiEndpoint: string;
  userLevel?: string;
}

export function useChatHandler({
  messages,
  sections,
  isFirstMessage,
  templateSections,
  setMessages,
  setSections,
  setIsFirstMessage,
  autoSaveSession,
  apiEndpoint,
  userLevel
}: UseChatHandlerProps) {
  const [isLoading, setIsLoading] = useState(false);

  /**
   * チャット送信・AI応答・保存を統合した処理
   */
  const handleChatSubmit = useCallback(async (userMessage: string) => {
    if (!userMessage.trim() || isLoading) return;

    setIsLoading(true);

    try {
      // 1. ユーザーメッセージを追加
      const newMessages = [...messages, { role: 'user' as const, content: userMessage }];
      setMessages(newMessages);

      // 2. チャット送信時の自動保存
      await autoSaveSession(newMessages);

      // 3. 最初のメッセージの場合、テンプレートにリセット
      if (isFirstMessage) {
        setSections(templateSections);
        setIsFirstMessage(false);
      }

      // 4. AI API呼び出し
      const requestBody: {
        instruction: string;
        sections: Sections;
        messages: Message[];
        userLevel?: string;
      } = {
        instruction: userMessage,
        sections,
        messages: newMessages
      };

      // userLevelがある場合は追加（app専用）
      if (userLevel !== undefined) {
        requestBody.userLevel = userLevel;
      }

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
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

      const data: ChatResponse = await response.json();
      console.log('Full API response:', data);

      // 5. レスポンス処理とUI更新
      let finalMessages = newMessages;
      let finalSections = sections;

      switch (data.type) {
        case 'chat':
          finalMessages = [...newMessages, { 
            role: 'assistant' as const, 
            content: data.message 
          }];
          setMessages(finalMessages);
          break;
          
        case 'update':
          if (data.markdown && Object.keys(data.markdown).length > 0) {
            console.log('Updating sections with markdown object:', data.markdown);
            finalSections = { ...sections };
            Object.entries(data.markdown).forEach(([key, value]) => {
              if (value === '') {
                delete finalSections[key];
              } else {
                finalSections[key] = value;
              }
            });
            setSections(finalSections);
          }
          finalMessages = [...newMessages, { 
            role: 'assistant' as const, 
            content: data.message 
          }];
          setMessages(finalMessages);
          break;
          
        case 'chat+update':
          if (data.markdown && Object.keys(data.markdown).length > 0) {
            console.log('Updating sections with markdown object:', data.markdown);
            finalSections = { ...sections };
            Object.entries(data.markdown).forEach(([key, value]) => {
              if (value === '') {
                delete finalSections[key];
              } else {
                finalSections[key] = value;
              }
            });
            setSections(finalSections);
          }
          finalMessages = [...newMessages, { 
            role: 'assistant' as const, 
            content: data.message 
          }];
          setMessages(finalMessages);
          break;
          
        default:
          // 旧形式との互換性
          if (data.updated) {
            finalSections = { ...sections, ...data.updated };
            setSections(finalSections);
            const updatedSections = Object.keys(data.updated);
            finalMessages = [...newMessages, { 
              role: 'assistant' as const, 
              content: `更新しました: ${updatedSections.join(', ')}\n\n${updatedSections.map(section => `【${section}】\n${data.updated![section].split('\n').slice(0, 3).join('\n')}${data.updated![section].split('\n').length > 3 ? '\n...' : ''}`).join('\n\n')}` 
            }];
            setMessages(finalMessages);
          } else {
            finalMessages = [...newMessages, { 
              role: 'assistant' as const, 
              content: '理解しました。何か具体的な更新が必要でしたらお知らせください。' 
            }];
            setMessages(finalMessages);
          }
      }

      // 6. AI応答受信時の自動保存
      await autoSaveSession(finalMessages, finalSections);

    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = error instanceof Error && error.message.includes('API') 
        ? 'APIキーが設定されていないか、無効です。.env.localファイルにOPENROUTER_API_KEYを設定してください。' 
        : 'エラーが発生しました。もう一度お試しください。';
      
      setMessages((prev: Message[]) => [...prev, { 
        role: 'assistant' as const, 
        content: errorMessage
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [
    messages, 
    sections, 
    isFirstMessage, 
    templateSections, 
    setMessages, 
    setSections, 
    setIsFirstMessage, 
    autoSaveSession, 
    apiEndpoint, 
    userLevel, 
    isLoading
  ]);

  /**
   * 自動送信用の処理（エクスポートなどで使用）
   */
  const handleAutoSubmit = useCallback(async (instruction: string) => {
    setIsLoading(true);

    try {
      const requestBody: {
        instruction: string;
        sections: Sections;
        messages: Message[];
        userLevel?: string;
      } = {
        instruction,
        sections: templateSections, // 空のテンプレートから開始
        messages: messages
      };

      if (userLevel !== undefined) {
        requestBody.userLevel = userLevel;
      }

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
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

      const data: ChatResponse = await response.json();
      console.log('Full API response:', data);

      // レスポンス処理
      let finalMessages = messages;
      let finalSections = sections;

      switch (data.type) {
        case 'chat':
          finalMessages = [...messages, { 
            role: 'assistant' as const, 
            content: data.message 
          }];
          setMessages(finalMessages);
          break;
          
        case 'update':
          if (data.markdown && Object.keys(data.markdown).length > 0) {
            console.log('Updating sections with markdown object:', data.markdown);
            finalSections = { ...sections };
            Object.entries(data.markdown).forEach(([key, value]) => {
              if (value === '') {
                delete finalSections[key];
              } else {
                finalSections[key] = value;
              }
            });
            setSections(finalSections);
          }
          finalMessages = [...messages, { 
            role: 'assistant' as const, 
            content: data.message 
          }];
          setMessages(finalMessages);
          break;
          
        case 'chat+update':
          if (data.markdown && Object.keys(data.markdown).length > 0) {
            console.log('Updating sections with markdown object:', data.markdown);
            finalSections = { ...sections };
            Object.entries(data.markdown).forEach(([key, value]) => {
              if (value === '') {
                delete finalSections[key];
              } else {
                finalSections[key] = value;
              }
            });
            setSections(finalSections);
          }
          finalMessages = [...messages, { 
            role: 'assistant' as const, 
            content: data.message 
          }];
          setMessages(finalMessages);
          break;
          
        default:
          if (data.updated) {
            finalSections = { ...sections, ...data.updated };
            setSections(finalSections);
            const updatedSections = Object.keys(data.updated);
            finalMessages = [...messages, { 
              role: 'assistant' as const, 
              content: `更新しました: ${updatedSections.join(', ')}\n\n${updatedSections.map(section => `【${section}】\n${data.updated![section].split('\n').slice(0, 3).join('\n')}${data.updated![section].split('\n').length > 3 ? '\n...' : ''}`).join('\n\n')}` 
            }];
            setMessages(finalMessages);
          } else {
            finalMessages = [...messages, { 
              role: 'assistant' as const, 
              content: '理解しました。何か具体的な更新が必要でしたらお知らせください。' 
            }];
            setMessages(finalMessages);
          }
      }

      // 自動生成後の保存処理
      await autoSaveSession(finalMessages, finalSections);

    } catch (error) {
      console.error('Auto submit error:', error);
      const errorMessage = error instanceof Error && error.message.includes('API') 
        ? 'APIキーが設定されていないか、無効です。.env.localファイルにOPENROUTER_API_KEYを設定してください。' 
        : 'エラーが発生しました。もう一度お試しください。';
      
      setMessages((prev: Message[]) => [...prev, { 
        role: 'assistant' as const, 
        content: errorMessage
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, sections, templateSections, userLevel, apiEndpoint, setMessages, setSections, autoSaveSession]);

  return {
    isLoading,
    handleChatSubmit,
    handleAutoSubmit
  };
}
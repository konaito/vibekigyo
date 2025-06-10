// OpenAI API呼び出しの共通ライブラリ

import { openrouterapikey } from "./config";

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface OpenAIResponse {
  type: 'chat' | 'update' | 'chat+update';
  message: string;
  markdown?: Record<string, string>;
}

export async function callOpenAI(
  messages: Message[],
  appName: string = 'vibe-app'
): Promise<OpenAIResponse> {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openrouterapikey}`,
      'Content-Type': 'application/json; charset=utf-8',
      'HTTP-Referer': process.env.NODE_ENV === 'production' 
        ? 'https://vibe-kigyo.vercel.app' 
        : 'http://localhost:3000',
      'X-Title': appName
    },
    body: JSON.stringify({
      model: 'openai/gpt-4o:online',
      messages,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "ai_response",
          strict: true,
          schema: {
            type: "object",
            properties: {
              type: {
                type: "string",
                enum: ["chat", "update", "chat+update"],
                description: "Response type indicating whether to chat, update markdown, or both"
              },
              message: {
                type: "string",
                description: "Message to display to the user"
              },
              markdown: {
                type: "object",
                description: "Sections to update in the markdown document",
                additionalProperties: {
                  type: "string"
                }
              }
            },
            required: ["type", "message"],
            additionalProperties: false
          }
        }
      },
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('OpenRouter API error:', response.status, error);
    
    if (response.status === 401 || response.status === 403) {
      throw new Error('API authentication failed. Please check your OPENROUTER_API_KEY.');
    }
    
    if (response.status === 502 || response.status === 503 || response.status === 504) {
      throw new Error('AIサーバーが一時的に利用できません。しばらく待ってから再度お試しください。');
    }
    
    if (response.status === 429) {
      throw new Error('APIの利用制限に達しました。しばらく待ってから再度お試しください。');
    }
    
    throw new Error(`OpenRouter API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;
  
  try {
    return JSON.parse(content);
  } catch (parseError) {
    console.error('Failed to parse OpenAI response as JSON:', parseError);
    console.error('Raw content:', content);
    
    // Return a fallback response
    return {
      type: 'chat',
      message: 'AIからの応答の解析でエラーが発生しました。もう一度お試しください。'
    };
  }
}

export function createSystemPrompt(promptContent: string, sections: Record<string, string>): Message {
  return {
    role: "system",
    content: promptContent.replace('${JSON.stringify(sections, null, 2)}', JSON.stringify(sections, null, 2))
  };
}

export function prepareMessages(
  systemPrompt: Message,
  messages: Message[],
  instruction: string
): Message[] {
  return [
    systemPrompt,
    ...messages.filter((msg) => msg.role !== 'system'),
    { role: "user", content: instruction }
  ];
}
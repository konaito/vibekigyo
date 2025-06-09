// OpenAI API呼び出しの共通ライブラリ

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface OpenAIResponse {
  type: 'chat' | 'update' | 'chat+update';
  message: string;
  markdown: string | object;
}

export async function callOpenAI(
  messages: Message[],
  appName: string = 'vibe-app'
): Promise<OpenAIResponse> {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY is not set in environment variables');
  }

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json; charset=utf-8',
      'HTTP-Referer': process.env.NODE_ENV === 'production' 
        ? 'https://vibe-kigyo.vercel.app' 
        : 'http://localhost:3000',
      'X-Title': appName
    },
    body: JSON.stringify({
      model: 'openai/gpt-4o',
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
                description: "レスポンスのタイプ"
              },
              message: {
                type: "string",
                description: "ユーザーへの返答メッセージ"
              },
              markdown: {
                type: "string",
                description: "更新するセクションのJSONオブジェクト文字列"
              }
            },
            required: ["type", "message", "markdown"],
            additionalProperties: false
          }
        }
      },
      temperature: 0.7,
      max_tokens: 2000
    })
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('OpenRouter API error:', response.status, error);
    if (response.status === 401 || response.status === 403) {
      throw new Error('API authentication failed. Please check your OPENROUTER_API_KEY.');
    }
    throw new Error(`OpenRouter API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;
  return JSON.parse(content);
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
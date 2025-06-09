import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { instruction, sections, messages } = body;

    // Debug logging
    console.log('API Key exists:', !!process.env.OPENROUTER_API_KEY);
    console.log('API Key length:', process.env.OPENROUTER_API_KEY?.length);

    const systemPrompt = {
      role: "system",
      content: `
# 人格 (Persona)
あなたは、単なる「AI書記」ではありません。数々の新規事業を成功に導いてきた、経験豊富な「伴走型AI戦略パートナー」です。あなたの役割は、ユーザーのアイデアをただ記録することではなく、対話を通じてそのアイデアを共に磨き上げ、事業の成功確率を最大化させることです。

# ミッション (Mission)
あなたの究極のミッションは、完成度の高いMarkdown企画書を「共創」することです。その過程で、ユーザーの思考を深め、アイデアの解像度を高め、潜在的なリスクや未開拓の機会を洗い出すことに全力を注いでください。完成した企画書は、あなたとユーザーの知性の結晶です。

# 行動指針 (Behavioral Principles)

1.  **【最優先】初期アイデアの即時反映と具体化**:
    - ユーザーが新しい事業アイデアを提示したら、即座にそれを解釈し、これがあなたの最初の行動として、企画書のドラフトをMarkdownに書き込んでください。
    - 必ず \`type: 'chat+update'\` を使用してください。
    - \`markdown\`部分には、「プロジェクト概要」や「主な機能」などの関連セクションを、与えられた情報から推測して埋めます。完璧である必要はありません。たたき台を作ることが重要です。
    - \`message\`部分では、「素晴らしいアイデアですね！早速、企画書の骨子を作成しました。ここから深掘りしていきましょう！」といった形で、あなたの行動を伝え、次の対話を促してください。

2.  **対話の主導権と深掘り**:
    - 一度に多くのことを聞かず、常に一つのテーマに絞って対話をリードしてください。
    - ユーザーの回答が表面的である場合、決して満足しないでください。常に「なぜ？」「具体的には？」「それによって誰がどう嬉しいのですか？」といった5W1Hの質問を投げかけ、思考の核心に迫ってください。

3.  **多角的な視点と健全な批判**:
    - ユーザーのアイデアを肯定し、モチベーションを高めることは重要です。しかし、それ以上に重要なのは、思考停止に陥らせないことです。
    - 時には敢えて「悪魔の代弁者」として、「その収益モデルだと、顧客獲得コストを回収できるまでに何年かかりますか？」「もし競合が同じことを半額で始めたら、どう対抗しますか？」といった厳しい問いを投げかけ、アイデアの脆弱性を炙り出してください。

4.  **フレームワークの動的な活用**:
    - 知識リスト（ビジネスモデルキャンバス等）を単に知っているだけでなく、対話の中で思考のツールとして自然に提示してください。
    - 例：「その顧客と価値の関係は、バリュープロポジションキャンバスで整理するとより明確になりそうですね。少し試してみませんか？」のように、フレームワークへの誘導を提案してください。

5.  **要約とMarkdown更新の主導**:
    - 対話の節目で「ここまでの議論を整理すると…」と要約し、ユーザーに新たな気づきを促してください。
    - ユーザーに言われる前に、あなたから「ここまでの内容を企画書に反映しましょうか？」と主体的に提案してください。 これが「書記」と「パートナー」の決定的な違いです。

# 出力形式 (Output Format)
応答は以下の3形式いずれかのJSONで厳密に出力してください。

1.  会話だけ（Markdown更新なし）
    {
      "type": "chat",
      "message": "ユーザーへの対話メッセージ（思考を促す問いかけや視点の提供）",
      "markdown": ""
    }

2.  Markdownだけ更新（会話なし）
    {
      "type": "update",
      "message": "企画書の更新内容を簡潔に示すメッセージ（例：ターゲット顧客の解像度を高め、反映しました。）",
      "markdown": "{\"更新するセクションタイトル1\": \"更新後のコンテンツ1\\n箇条書き1\\n箇条書き2\", \"更新するセクションタイトル2\": \"更新後のコンテンツ2\"}"
    }

3.  両方：確認と編集を同時に
    {
      "type": "chat+update",
      "message": "ユーザーへの対話メッセージ（例：素晴らしい視点ですね！その内容を反映しつつ、次は競合について考えてみませんか？）",
      "markdown": "{\"更新するセクションタイトル\": \"更新後のコンテンツ\"}"
    }

# 共有情報：現在の企画書
以下は、現時点でのMarkdown企画書の内容です。これを踏まえて対話を続けてください。
${JSON.stringify(sections, null, 2)}

# 最重要ルール
- あなたは「書記」ではなく「戦略パートナー」です。常に主体的・能動的に対話をリードしてください。
- 最初のアイデア提示には、必ず\`chat+update\`で即座に反応し、ユーザーに即時的な進捗を実感させてください。
- \`markdown\`プロパティは、更新がない場合は空文字列\`""\`を返してください。
- ユーザーの熱意を尊重しつつも、事業成功のために言うべきことはプロとして伝えてください。
- **JSON文字列のエスケープ**: \`markdown\`フィールドに記載するJSON文字列内では、改行は\\\\n、タブは\\\\t、引用符は\\\\\"にエスケープしてください。
`
    };

    const apiMessages = [
      systemPrompt,
      ...messages.filter((msg: { role: string }) => msg.role !== 'system'),
      { role: "user", content: instruction }
    ];

    if (!process.env.OPENROUTER_API_KEY) {
      throw new Error('OPENROUTER_API_KEY is not set in environment variables');
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json; charset=utf-8',
        'HTTP-Referer': process.env.NODE_ENV === 'production' ? 'https://vibe-kigyo.vercel.app' : 'http://localhost:3000',
        'X-Title': 'vibe-kigyo-md'
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o',
        messages: apiMessages,
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
                  description: "ユーザーへの返答メッセージ（typeがchatまたはchat+updateの場合は必須）"
                },
                markdown: {
                  type: "string",
                  description: "更新するセクションのJSONオブジェクト文字列（typeがupdateまたはchat+updateの場合）"
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
    const parsed = JSON.parse(content);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Error in apply-instruction:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to process instruction', details: errorMessage },
      { status: 500 }
    );
  }
}
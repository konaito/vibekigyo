import { NextRequest, NextResponse } from 'next/server';
import { callOpenAI, createSystemPrompt, prepareMessages } from '../../../lib/openai';
import { codingPrompt } from '../../../lib/prompts/coding-prompt';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { instruction, sections, messages } = body;

    // Debug logging
    console.log('API Key exists:', !!process.env.OPENROUTER_API_KEY);
    console.log('API Key length:', process.env.OPENROUTER_API_KEY?.length);

    const systemPrompt = createSystemPrompt(codingPrompt, sections);
    const apiMessages = prepareMessages(systemPrompt, messages, instruction);
    const result = await callOpenAI(apiMessages, 'vibe-app-md');
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in generate-plan:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // より詳細なエラー情報をログ出力
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error stack:', error.stack);
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to process instruction', 
        details: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
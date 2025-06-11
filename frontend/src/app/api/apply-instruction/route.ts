import { NextRequest, NextResponse } from 'next/server';
import { callOpenAI, createSystemPrompt, prepareMessages } from '../../../lib/openai';
import { businessPrompt } from '../../../lib/prompts/business-prompt';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { instruction, sections, messages } = body;

    // console.log({sections});

    const systemPrompt = createSystemPrompt(businessPrompt, sections);

    console.log({systemPrompt});

    const apiMessages = prepareMessages(systemPrompt, messages, instruction);
    const result = await callOpenAI(apiMessages, 'vibe-kigyo-md');
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in apply-instruction:', error);
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
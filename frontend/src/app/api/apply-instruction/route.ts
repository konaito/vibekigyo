import { NextRequest, NextResponse } from 'next/server';
import { callOpenAI, createSystemPrompt, prepareMessages } from '../../../lib/openai';
import { businessPrompt } from '../../../lib/prompts/business-prompt';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { instruction, sections, messages } = body;


    const systemPrompt = createSystemPrompt(businessPrompt, sections);

    const apiMessages = prepareMessages(systemPrompt, messages, instruction);
    const result = await callOpenAI(apiMessages, 'vibe-kigyo-md');
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in apply-instruction:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to process instruction', details: errorMessage },
      { status: 500 }
    );
  }
}
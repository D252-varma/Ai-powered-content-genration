import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { content } = await req.json();

    if (!process.env.NEXT_PUBLIC_GOOGLE_GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Google API key is not configured' },
        { status: 500 }
      );
    }

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-pro',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      }
    });

    // Generate two variations with different styles
    const variations = await Promise.all([
      // First variation - More formal and professional
      model.generateContent({
        contents: [{
          role: 'user',
          parts: [{
            text: `Create a more formal and professional version of this content:\n\n${content}`
          }]
        }]
      }),
      // Second variation - More engaging and conversational
      model.generateContent({
        contents: [{
          role: 'user',
          parts: [{
            text: `Create a more engaging and conversational version of this content:\n\n${content}`
          }]
        }]
      })
    ]);

    // Extract the text from each variation
    const variationTexts = await Promise.all(
      variations.map(async (result) => {
        const response = await result.response;
        return response.text();
      })
    );

    return NextResponse.json({ variations: variationTexts });
  } catch (error) {
    console.error('API Error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'Invalid API key. Please check your configuration.' },
          { status: 401 }
        );
      }
      if (error.message.includes('network')) {
        return NextResponse.json(
          { error: 'Network error. Please check your connection.' },
          { status: 503 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to generate variations. Please try again.' },
      { status: 500 }
    );
  }
} 
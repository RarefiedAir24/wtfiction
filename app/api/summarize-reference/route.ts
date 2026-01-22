import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs'; // Ensure this runs on Node.js runtime

export async function POST(request: NextRequest) {
  try {
    const { url, title, authors, type } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Check if OpenAI API key is configured
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'AI summarization is not available. Please contact support.' },
        { status: 503 }
      );
    }

    // Build context for the AI
    const context = [];
    if (title) context.push(`Title: ${title}`);
    if (authors && authors.length > 0) context.push(`Authors: ${authors.join(', ')}`);
    if (type) context.push(`Type: ${type}`);
    context.push(`URL: ${url}`);

    const prompt = `You are summarizing a reference for a "What If" scenario video series about future possibilities and societal changes.

${context.join('\n')}

Please provide a concise, informative description (2-4 sentences) that:
1. Summarizes the key content or findings
2. Explains why this reference is relevant
3. Is written in clear, accessible language
4. Avoids technical jargon when possible

Description:`;

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Cost-effective model
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that creates concise, informative summaries of academic papers, news articles, and research documents.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenAI API error:', errorData);
      return NextResponse.json(
        { error: `Unable to generate summary. Please try again later.` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const summary = data.choices?.[0]?.message?.content?.trim();

    if (!summary) {
      return NextResponse.json(
        { error: 'No summary generated' },
        { status: 500 }
      );
    }

    return NextResponse.json({ summary });
  } catch (error: any) {
    console.error('Error summarizing reference:', error);
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    );
  }
}

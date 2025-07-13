import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const { content, link } = await req.json()

  if (!content || !link) {
    return NextResponse.json({ error: 'Missing content or link' }, { status: 400 })
  }

  try {
    const aiRes = await fetch('https://web-production-6be3.up.railway.app/api/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: content,
        max_length: 150,
        style: 'professional',
        include_sentiment: true,
        include_keywords: false
      })
    })

    const raw = await aiRes.text()
    let aiData

    try {
      aiData = JSON.parse(raw)
      console.log("🧠 AI Agent response:", aiData)
    } catch (_err) {
      console.error("❌ Failed to parse AI response:")
      return NextResponse.json({ error: 'Invalid response from AI agent' }, { status: 502 })
    }

    if (!aiData.success) {
      return NextResponse.json({ error: aiData.error || 'AI summarization failed' }, { status: 500 })
    }

    const summary = aiData.summary
    const sentiment = aiData.sentiment_analysis?.sentiment || {
      sentiment: 'unknown',
      emoji: '',
      description: ''
    }

    const { error } = await supabase
      .from('summaries')
      .insert([{ link, summary, sentiment }])

    if (error) {
      console.error('❌ Supabase insert error:', error)
      return NextResponse.json({ error: 'Failed to save summary' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      summary,
      sentiment: sentiment.sentiment,
      sentiment_analysis: sentiment
    })

  } catch (_err) {
    console.error('❌ Unexpected summarization error:')
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 })
  }
}

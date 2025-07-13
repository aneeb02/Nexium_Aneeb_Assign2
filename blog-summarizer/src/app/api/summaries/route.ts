import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { content, link } = await req.json()

  if (!content || !link) {
    return NextResponse.json({ error: 'Missing content or link' }, { status: 400 })
  }

  const summary = content.slice(0, 150) + '...'

  const { error, data } = await supabase
    .from('summaries')
    .insert([{ link, summary }])

  if (error) {
    console.error('Supabase insert error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, summary })
}

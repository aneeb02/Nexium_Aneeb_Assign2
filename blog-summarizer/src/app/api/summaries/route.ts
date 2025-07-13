// /app/api/summaries/route.ts
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

  const summary = content.slice(0, 150) + '...'

  const { data, error } = await supabase
    .from('summaries')
    .insert([{ link, summary }])

  if (error) {
    console.error('Supabase Save Error:', error)
    return NextResponse.json({ error: 'Failed to save summary' }, { status: 500 })
  }

  return NextResponse.json({ success: true, summary })
}

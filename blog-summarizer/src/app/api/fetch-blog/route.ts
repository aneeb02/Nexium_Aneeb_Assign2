import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const url = searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'No URL provided' }, { status: 400 })
  }

  try {
    const res = await fetch(url)
    const html = await res.text()

    // Strip HTML tags for now (naive, we'll improve it later)
    const text = html.replace(/<[^>]+>/g, ' ')
    return NextResponse.json({ content: text.slice(0, 3000) }) // Limiting length for safety
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch blog' }, { status: 500 })
  }
}

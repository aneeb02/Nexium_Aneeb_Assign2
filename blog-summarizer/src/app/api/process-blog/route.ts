import { NextResponse } from 'next/server'
import * as cheerio from 'cheerio'
//process-blog

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const url = searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'No URL provided' }, { status: 400 })
  }

  try {
    // fetch raw HTML
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
    const html = await res.text()

    // load into cheerio
    const $ = cheerio.load(html)

    /* ---------- basic extraction strategy ----------
       1. Remove script & style tags
       2. Grab common article containers (<article>, .post-content, etc.)
       3. Fallback to all <p> tags joined together
    ------------------------------------------------ */
    $('script, style, noscript').remove()

    let text = ''

    // priority targets
    const articleSelectors = [
      'article',
      '[itemprop="articleBody"]',
      '.post-content',
      '.post-full-content',
      '.entry-content',
      '.article-content',
      '.blog-post',
    ]

    for (const sel of articleSelectors) {
      if ($(sel).length) {
        text = $(sel).text()
        break
      }
    }

    // fallback: all <p>
    if (!text) {
      text = $('p').text()
    }

    // tidy whitespace & limit size
    const clean = text.replace(/\s+/g, ' ').trim().slice(0, 10000)

    return NextResponse.json({ content: clean })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch blog' }, { status: 500 })
  }
}

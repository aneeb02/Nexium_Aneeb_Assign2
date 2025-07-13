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

    const rawTitle = $('title').first().text() || $('h1').first().text()
    const title = rawTitle.trim().replace(/\s*\|.*$/, '') // removes “| Blog Name”

    function cleanScrapedText(text: string): string {
      if (typeof text !== 'string') {
          console.error("Input must be a string.");
          return "";
      }

      // 1. Replace multiple whitespace characters (spaces, newlines, tabs) with a single space.
      let cleanedText = text.replace(/\s+/g, ' ');

      // 2. Trim leading and trailing whitespace that might have been left or introduced.
      cleanedText = cleanedText.trim();

      return cleanedText;
    }

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
      'content',
    ]

    let content = ''
    for (const selector of articleSelectors) {
      const text = $(selector).text()
      if (text.length > 300) {
        content = text
        break
      }
    }

    // fallback: all <p>
    if (!text) {
      text = $('p').text()
    }

    // tidy whitespace & limit size
    const clean = cleanScrapedText(content)

    return NextResponse.json({ content: clean, title })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch blog' }, { status: 500 })
  }
}
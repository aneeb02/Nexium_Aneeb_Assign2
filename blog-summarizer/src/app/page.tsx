'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function Home() {
  const [url, setUrl] = useState('')
  const [content, setContent] = useState('')
  const [summary, setSummary] = useState('')

  const fetchBlog = async () => {
    setContent('Fetching blog content...')
    setSummary('')

    try {
      // 1. Scrape blog
      const res = await fetch(`/api/process-blog?url=${encodeURIComponent(url)}`)
      const data = await res.json()
      const blogContent = data.content || 'No content found.'
      setContent(blogContent)

      // 2. Save full content to MongoDB
      await fetch('/api/save-blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ link: url, content: blogContent })
      })

      // 3. Simulate and save summary to Supabase
      const summaryRes = await fetch('/api/summaries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: blogContent, link: url })
      })

      const summaryData = await summaryRes.json()
      const blogSummary = summaryData.summary || ''
      setSummary(blogSummary)
    } catch (error) {
      console.error(error)
      setContent('Failed to fetch blog content.')
    }
  }

  return (
    <main className="max-w-2xl mx-auto mt-20 p-6">
      <h1 className="text-2xl font-bold mb-4">📝 Blog Summarizer</h1>
      <Input
        placeholder="Enter blog URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="mb-4"
      />
      <Button onClick={fetchBlog}>Fetch Blog</Button>

      <div className="mt-6">
        <h2 className="font-semibold">📌 Summary:</h2>
        <p className="mb-4">{summary}</p>

        <h2 className="font-semibold">📄 Full Content:</h2>
        <div className="whitespace-pre-wrap">{content}</div>
      </div>
    </main>
  )
}

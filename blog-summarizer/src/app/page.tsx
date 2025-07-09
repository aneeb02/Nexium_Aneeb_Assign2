'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function Home() {
  const [url, setUrl] = useState('')
  const [content, setContent] = useState('')

  const fetchBlog = async () => {
    setContent("Fetching blog content...")

    try {
      const res = await fetch(`/api/fetch-blog?url=${encodeURIComponent(url)}`)
      const data = await res.json()
      setContent(data.content || "No content found.")
    } catch (error) {
      setContent("Failed to fetch blog content.")
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

      <div className="mt-6 whitespace-pre-wrap">
        {content}
      </div>
    </main>
  )
}

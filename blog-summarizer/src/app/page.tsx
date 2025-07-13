'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

export default function Home() {
  const [url, setUrl] = useState('')
  const [customText, setCustomText] = useState('')
  const [content, setContent] = useState('')
  const [summary, setSummary] = useState('')
  const [sentiment, setSentiment] = useState('')

  const handleSubmit = async () => {
    setContent('Processing...')
    setSummary('')
    setSentiment('')

    try {
      let finalText = customText
      let source = 'manual'

      // If URL is provided, scrape it
      if (url.trim()) {
        const res = await fetch(`/api/process-blog?url=${encodeURIComponent(url)}`)
        const data = await res.json()
        finalText = data.content || 'No content found.'
        setContent(finalText)
        source = 'url'

        // Save full content to MongoDB
        await fetch('/api/save-blog', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ link: url, content: finalText })
        })
      } else {
        setContent(finalText)
      }

      // Send to AI agent
      const summaryRes = await fetch('/api/summaries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: finalText, link: source === 'url' ? url : 'manual-entry' })
      })

      const summaryData = await summaryRes.json()
      setSummary(summaryData.summary || '')
      setSentiment(summaryData.sentiment || '')
    } catch (error) {
      console.error(error)
      setContent('Failed to process content.')
    }
  }

  return (
    <main className="max-w-2xl mx-auto mt-20 p-6 space-y-6">
      <h1 className="text-2xl font-bold">🧠 AI Blog/Text Summarizer</h1>

      <div>
        <label className="font-medium">🔗 Blog URL</label>
        <Input
          placeholder="Enter blog URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="mb-2"
        />
      </div>

      <div>
        <label className="font-medium">✍️ Or Paste Your Text</label>
        <Textarea
          placeholder="Enter text manually..."
          value={customText}
          onChange={(e) => setCustomText(e.target.value)}
          rows={6}
          className="mb-2"
        />
      </div>

      <Button onClick={handleSubmit}>Summarize</Button>

      <div className="mt-6">
        <h2 className="font-semibold">📌 Summary:</h2>
        <p className="mb-1">{summary}</p>
        <p className="text-sm text-gray-500">🧠 Sentiment: {sentiment}</p>

        <h2 className="font-semibold mt-4">📄 Full Content:</h2>
        <div className="whitespace-pre-wrap">{content}</div>
      </div>
    </main>
  )
}

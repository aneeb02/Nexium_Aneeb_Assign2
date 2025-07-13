'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'

import { cn } from '@/lib/utils'

export default function Home() {
  const [mode, setMode] = useState<'url' | 'text'>('url')
  const [url, setUrl] = useState('')
  const [customText, setCustomText] = useState('')
  const [content, setContent] = useState('')
  const [summary, setSummary] = useState('')
  const [sentiment, setSentiment] = useState<{
    sentiment: string
    emoji: string
    description: string
  } | null>(null)
  const [preview, setPreview] = useState('')
  

  const handleSubmit = async () => {
    setSummary('')
    setSentiment('')
    setContent('Processing...')
    setPreview('')

    try {
      let finalText = customText
      let source = 'manual-entry'

      if (mode === 'url') {
        const res = await fetch(`/api/process-blog?url=${encodeURIComponent(url)}`)
        const data = await res.json()
        finalText = data.content || 'No content found.'
        setPreview(finalText.slice(0, 200))
        source = url

        await fetch('/api/save-blog', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ link: url, content: finalText })
        })
      } else {
        setPreview(customText.slice(0, 200))
      }

      setContent(finalText)

      const summaryRes = await fetch('/api/summaries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: finalText, link: source })
      })

      const summaryData = await summaryRes.json()
      setSummary(summaryData.summary || '')
      setSentiment(summaryData.sentiment_analysis || null)
    } catch (err) {
      console.error(err)
      setContent('Something went wrong.')
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">
        {/* Left: Input Card */}
        <div className="bg-white p-6 rounded-2xl shadow-md w-full lg:w-[45%] space-y-4">
          <div className="flex gap-2 mb-2">
            <Button variant={mode === 'url' ? 'default' : 'outline'} onClick={() => setMode('url')}>
              Enter URL
            </Button>
            <Button variant={mode === 'text' ? 'default' : 'outline'} onClick={() => setMode('text')}>
              Paste Text
            </Button>
          </div>

          <h2 className="text-xl font-semibold">📄 Blog Summarizer</h2>
          <p className="text-gray-600 text-sm">
            {mode === 'url' ? 'Enter a blog URL to summarize' : 'Paste your text to summarize'}
          </p>

          {mode === 'url' ? (
            <Input placeholder="https://example.com" value={url} onChange={(e) => setUrl(e.target.value)} />
          ) : (
            <Textarea
              rows={8}
              placeholder="Paste your text here..."
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
            />
          )}

          <Button onClick={handleSubmit} className="bg-yellow-500 hover:bg-yellow-600">
            Summarize
          </Button>
        </div>

        {/* Right: Result Panels */}
        <div className="flex flex-col w-full lg:w-[55%] space-y-4">
        {/* Summary Card */}
        <Card className="bg-blue-100">
          <CardHeader>
            <CardTitle>AI Summary</CardTitle>
            <CardDescription>Overview of the blog</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-gray-800">{summary}</p>
          </CardContent>
        </Card>

        {/* Dynamic Sentiment Card */}
        {sentiment && (
          <Card
            className={cn(
              sentiment.sentiment === 'positive' && "bg-green-50 border-green-300 text-green-900",
              sentiment.sentiment === 'neutral' && "bg-gray-100 border-gray-300 text-gray-800",
              sentiment.sentiment === 'negative' && "bg-red-50 border-red-300 text-red-900"
            )}
          >
            <CardHeader>
              <CardTitle>Sentiment</CardTitle>
              <CardDescription>Emotional tone analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-semibold text-base flex items-center gap-1">
                {sentiment.sentiment} {sentiment.emoji}
              </p>
              <p>{sentiment.description}</p>
            </CardContent>
          </Card>
        )}

        {/* Preview Card */}
        <Card className='bg-yellow-100'>
          <CardHeader>
            <CardTitle>Blog Preview</CardTitle>
            <CardDescription>First 200 characters</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-gray-700">{preview}...</p>
          </CardContent>
        </Card>
</div>
      </div>
    </main>
  )
}

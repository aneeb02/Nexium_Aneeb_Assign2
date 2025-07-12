"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, Globe, FileText } from 'lucide-react'
import { createSummary } from '@/helpers/utils'

export default function DemoComponent() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    title: string
    summary: string
    url: string
  } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) return

    setLoading(true)
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Demo data (in real app, this would come from scraping)
    const demoText = "This is a sample blog post about web development. It covers various topics including React, Next.js, and modern web technologies. The post discusses best practices for building scalable applications and provides insights into current trends in the industry."
    
    const summary = createSummary(demoText)
    
    setResult({
      title: "Sample Blog Post - Web Development Guide",
      summary,
      url
    })
    
    setLoading(false)
    setUrl('')
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Demo Mode - Enter Blog URL
          </CardTitle>
          <CardDescription>
            This is a demo version. Enter any URL to see the summarization in action.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              type="url"
              placeholder="https://example.com/blog-post"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1"
              required
            />
            <Button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-700">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                'Summarize'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">{result.title}</CardTitle>
            <CardDescription className="break-all">
              <a 
                href={result.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {result.url}
              </a>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-4 w-4" />
                <Badge variant="secondary">Summary (First 100 characters)</Badge>
              </div>
              <p className="text-gray-700 leading-relaxed">{result.summary}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

import DemoComponent from '@/components/DemoComponent'

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Blog Summarizer Demo</h1>
          <p className="text-gray-600">Test the summarization and translation functionality</p>
        </header>
        
        <DemoComponent />
        
        <footer className="mt-12 text-center text-gray-500">
          <p>This is a demo version. To use with real blog scraping, configure your databases and environment variables.</p>
        </footer>
      </div>
    </div>
  )
}

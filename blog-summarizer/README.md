# Blog Summarizer

A modern web application built with Next.js, TypeScript, and shadcn/ui that transforms blog posts into concise summaries.

## Features

- **Blog URL Processing**: Input any blog URL to scrape and analyze content
- **Smart Summarization**: Generate summaries using the first 100 characters of content
- **Dual Database Storage**: 
  - Summaries stored in Supabase
  - Full text content stored in MongoDB
- **Modern UI**: Clean, pastel-themed interface with shadcn/ui components
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Error Handling**: Graceful fallbacks when databases aren't configured

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Database**: Supabase (summaries) + MongoDB (full text)
- **Web Scraping**: Cheerio + Axios
- **Notifications**: Sonner (toast notifications)

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- MongoDB instance (local or cloud)
- Supabase account and project

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   Update `.env.local` with your actual values:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/blog-summarizer
   ```

3. **Set up Supabase table**
   Create a table named `blog_summaries` with the following structure:
   ```sql
   CREATE TABLE blog_summaries (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     url TEXT NOT NULL,
     title TEXT NOT NULL,
     summary TEXT NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open the application**
   Visit `http://localhost:3000` in your browser

## Usage

1. **Enter a blog URL** in the input field
2. **Click "Summarize"** to process the blog
3. **View the results** with:
   - Original blog title
   - Summary (first 100 characters)
4. **Browse recent summaries** in the history section

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── process-blog/     # Main blog processing endpoint
│   │   └── summaries/        # Fetch summaries endpoint
│   ├── globals.css           # Global styles with pastel theme
│   ├── layout.tsx            # Root layout with Sonner toaster
│   └── page.tsx              # Main application page
├── components/ui/            # shadcn/ui components
├── helpers/
│   └── utils.ts              # Web scraping and processing utilities
└── lib/
    ├── mongodb.ts            # MongoDB connection
    ├── supabase.ts           # Supabase client
    └── utils.ts              # Utility functions
```

## Key Features Explained

### Web Scraping
- Uses Cheerio to parse HTML content
- Extracts title from `<title>` tag
- Extracts text content from `<p>` tags
- Handles errors gracefully

### Smart Summarization
- Takes first 100 characters of extracted text
- Adds ellipsis for continuation indication
- Clean and efficient approach

### Database Architecture
- **Supabase**: Stores structured summary data
- **MongoDB**: Stores full text content for archival
- Both databases updated atomically

## Customization

### Improving the Summarization
Replace the `createSummary` function with more advanced logic:

```typescript
// Example with actual AI integration
async function advancedSummary(text: string): Promise<string> {
  // Implementation with actual AI service (OpenAI, etc.)
  // Or implement more sophisticated text processing
}
```

### Extending Character Limit
Modify the summary length in `src/helpers/utils.ts`:

```typescript
function createSummary(text: string): string {
  const cleanText = text.replace(/\s+/g, ' ').trim();
  const characterLimit = 200; // Change from 100 to desired length
  if (cleanText.length <= characterLimit) {
    return cleanText;
  }
  return cleanText.substring(0, characterLimit) + '...';
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

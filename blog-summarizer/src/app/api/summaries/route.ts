import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// Check if databases are properly configured
function isDatabaseConfigured() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  return (
    supabaseUrl && 
    supabaseKey && 
    !supabaseUrl.includes('placeholder') && 
    !supabaseKey.includes('placeholder')
  )
}
// a big comment added
export async function GET() {
  try {
    // If database not configured, return empty array
    if (!isDatabaseConfigured()) {
      return NextResponse.json({ 
        data: [],
        demo: true,
        message: 'Demo mode - database not configured'
      })
    }
    
    const { data, error } = await supabase
      .from('summaries')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ 
        data: [],
        error: 'Failed to fetch summaries - using demo mode'
      })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error fetching summaries:', error)
    return NextResponse.json({ 
      data: [],
      error: 'Failed to fetch summaries - using demo mode'
    })
  }
}

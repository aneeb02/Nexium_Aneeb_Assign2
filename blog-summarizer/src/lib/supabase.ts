import { createClient } from '@supabase/supabase-js'

// Check if Supabase is properly configured
function isSupabaseConfigured(): boolean {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  return !!
    supabaseUrl && 
    supabaseKey && 
    !supabaseUrl.includes('placeholder') && 
    !supabaseKey.includes('placeholder') &&
    supabaseUrl.includes('supabase.co')
}

// Only create client if properly configured
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = isSupabaseConfigured() ? createClient(supabaseUrl, supabaseAnonKey) : null

export { isSupabaseConfigured }

export interface BlogSummary {
  id?: string
  url: string
  title: string
  summary: string
  created_at?: string
}

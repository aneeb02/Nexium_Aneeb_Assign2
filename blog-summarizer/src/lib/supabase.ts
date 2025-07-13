import { createClient } from '@supabase/supabase-js'

// Check if Supabase is properly configured
function isSupabaseConfigured(): boolean {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  return !!(
  supabaseUrl &&
  supabaseKey &&
  !supabaseUrl.includes('placeholder')
)

}

// Only create client if properly configured
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = isSupabaseConfigured() ? createClient(supabaseUrl, supabaseAnonKey) : null

export { isSupabaseConfigured }

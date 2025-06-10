import { createBrowserClient } from '@supabase/ssr'
import { supabaseUrl, supabaseAnonKey } from '../../utils/public-config'

export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
import { createClient } from '../supabase/client'

export async function signInWithOTP(email: string) {
  const supabase = createClient()
  
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${location.origin}/auth/callback`
    }
  })
  
  return { error }
}

export async function signOut() {
  const supabase = createClient()
  await supabase.auth.signOut()
}
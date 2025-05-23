import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Function to check upload limit for an email
export async function checkUploadLimit(email: string): Promise<{ canUpload: boolean; remainingUploads: number }> {
  const { data: uploads, error } = await supabase
    .from('uploads')
    .select('*')
    .eq('email', email)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error checking upload limit:', error)
    throw error
  }

  const uploadCount = uploads?.length || 0
  const remainingUploads = Math.max(0, 3 - uploadCount)
  const canUpload = remainingUploads > 0

  return { canUpload, remainingUploads }
}

// Function to record a new upload
export async function recordUpload(email: string, fileName: string): Promise<void> {
  const { error } = await supabase
    .from('uploads')
    .insert([
      {
        email,
        file_name: fileName,
        created_at: new Date().toISOString()
      }
    ])

  if (error) {
    console.error('Error recording upload:', error)
    throw error
  }
}

// Function to generate and store verification code
export async function generateVerificationCode(email: string): Promise<string> {
  // Generate a 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString()
  
  // Store the code in the verification_codes table
  const { error } = await supabase
    .from('verification_codes')
    .insert([
      {
        email,
        code,
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 15 * 60000).toISOString() // 15 minutes expiry
      }
    ])

  if (error) {
    console.error('Error storing verification code:', error)
    throw error
  }

  return code
}

// Function to verify the code
export async function verifyCode(email: string, code: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('verification_codes')
    .select('*')
    .eq('email', email)
    .eq('code', code)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(1)

  if (error) {
    console.error('Error verifying code:', error)
    throw error
  }

  return data && data.length > 0
}

// Function to mark email as verified
export async function markEmailAsVerified(email: string): Promise<void> {
  const { error } = await supabase
    .from('verified_emails')
    .insert([
      {
        email,
        verified_at: new Date().toISOString()
      }
    ])

  if (error) {
    console.error('Error marking email as verified:', error)
    throw error
  }
}

// Function to check if email is verified
export async function isEmailVerified(email: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('verified_emails')
    .select('*')
    .eq('email', email)
    .limit(1)

  if (error) {
    console.error('Error checking email verification:', error)
    throw error
  }

  return data && data.length > 0
} 
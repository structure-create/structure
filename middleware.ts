import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// In a real application, this would be a persistent store (database, Redis, etc.)
// This in-memory map will reset whenever the server restarts.
const uploadCounts = new Map<string, number>()
const MAX_UPLOADS = 3

export async function middleware(request: NextRequest) {
  // Check if the request is for an upload endpoint (adjust the path as needed)
  if (request.nextUrl.pathname.startsWith('/api/anthropic') || request.nextUrl.pathname.startsWith('/api/gemini_outdated')) {
    const userEmail = request.headers.get('x-user-email')

    if (!userEmail) {
      // If no email is provided, deny the request or handle as needed
      // In this flow, the client-side should ideally show the email modal before sending the request if no email is stored locally.
      // Returning a response here would prevent the API call from reaching the handler.
      console.warn('Upload request blocked: No user email provided.')
      // You might return a specific status code to signal the client to ask for email, e.g., 401 or 403
      // return new NextResponse('Email required', { status: 401 });
      // For now, we'll allow it to proceed, assuming the client handles the prompt, but log the missing email.
      // If you want the middleware to strictly enforce email presence, uncomment the return statement above.
    } else {
      // Basic in-memory rate limiting (resets on server restart)
      const currentCount = uploadCounts.get(userEmail) || 0

      if (currentCount >= MAX_UPLOADS) {
        console.warn(`Upload request blocked for ${userEmail}: Limit of ${MAX_UPLOADS} reached.`)
        return new NextResponse('Upload limit reached for this email address.', { status: 429 })
      }

      // If allowed, increment the count (this needs to be atomic and persistent in a real app)
      uploadCounts.set(userEmail, currentCount + 1)
      console.log(`Upload request allowed for ${userEmail}. Count: ${currentCount + 1}`)
    }
  }

  // Continue to the next middleware or the requested route handler
  return NextResponse.next()
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: ['/api/anthropic', '/api/gemini_outdated']
} 
import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    await resend.emails.send({
      from: 'Structure <onboarding@resend.dev>',
      to: 'structure.create@gmail.com',
      subject: 'New Access Request',
      html: `
        <p>A new access request was submitted.</p>
        <p><strong>Email:</strong> ${email}</p>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Request access error:', error)
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}

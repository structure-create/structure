import type { Metadata } from 'next'
import './globals.css'
import Head from 'next/head'
import { CognitoProvider } from "@/contexts/AuthProvider";

export const metadata: Metadata = {
  title: 'Structure',
  description: 'Your Compliance Copilot',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body><CognitoProvider>{children}</CognitoProvider></body>
    </html>
  )
}
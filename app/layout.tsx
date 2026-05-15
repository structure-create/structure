import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Head from 'next/head'
import { CognitoProvider } from "@/contexts/AuthProvider";

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-sans',
  display: 'swap',
})

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
      <body className={`${inter.variable} ${inter.className} bg-[#FAF9F6]`}>
        <CognitoProvider>{children}</CognitoProvider>
      </body>
    </html>
  )
}
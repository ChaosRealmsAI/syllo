import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Vercel: Build and deploy the best web experiences with the AI Cloud',
  description: 'Vercel provides the developer tools and cloud infrastructure to build, scale, and secure a faster, more personalized web.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
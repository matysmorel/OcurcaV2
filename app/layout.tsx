import type { Metadata } from 'next'
import { Poppins, Jost } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { LanguageProvider } from '@/context/LanguageContext'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600'],
  variable: '--font-poppins',
})

const carme = Jost({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500'],
  variable: '--font-carme',
})

export const metadata: Metadata = {
  title: 'Ocurca - Ancient Wisdom meets Modern Science',
  description: 'Premium functional nutrition backed by evidence-based science. Join our community for smart, healthy snacking solutions.',
  generator: 'v0.app',
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-[#F5F3EE]">
      <body className={`${poppins.variable} ${carme.variable} font-sans antialiased`}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

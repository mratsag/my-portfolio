import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from 'next-themes'

export const metadata: Metadata = {
  title: 'Murat Sağ - Portfolio',
  description: 'Software Developer & Computer Engineering Student. Web development, mobile apps, and software solutions.',
  keywords: ['software developer', 'web development', 'portfolio', 'react', 'next.js', 'typescript'],
  authors: [{ name: 'Murat Sağ' }],
  creator: 'Murat Sağ',
  publisher: 'Murat Sağ',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.muratsag.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Murat Sağ - Portfolio',
    description: 'Software Developer & Computer Engineering Student',
    url: 'https://www.muratsag.com',
    siteName: 'Murat Sağ Portfolio',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Murat Sağ Portfolio',
      },
    ],
    locale: 'tr_TR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Murat Sağ - Portfolio',
    description: 'Software Developer & Computer Engineering Student',
    images: ['/og-image.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="google-site-verification" content="sNNJkE3FyNdWwuSYyPf7WfUlmLTjiftuHEgglM5yv_Q" />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
} 
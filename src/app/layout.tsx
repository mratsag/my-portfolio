import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from 'next-themes'
import CookieConsentWrapper from '../components/CookieConsentWrapper'
import PersonSchema from '../components/JsonLd'

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
  verification: {
    google: 'sNNJkE3FyNdWwuSYyPf7WfUlmLTjiftuHEgglM5yv_Q',
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
        <PersonSchema
          name="Murat Sağ"
          jobTitle="Software Developer & Computer Engineering Student"
          description="Yazılım geliştirici ve bilgisayar mühendisliği öğrencisi"
          url="https://www.muratsag.com"
          email="murat@muratsag.com"
          github="https://github.com/muratsag"
          linkedin="https://linkedin.com/in/muratsag"
        />
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-WH63DW5V');
            `,
          }}
        />
        {/* End Google Tag Manager */}
      </head>
      <body suppressHydrationWarning>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-WH63DW5V"
            height="0" 
            width="0" 
            style={{display:'none',visibility:'hidden'}}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <CookieConsentWrapper />
        </ThemeProvider>
      </body>
    </html>
  )
} 
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import PublicLayout from '@/app/components/public/layout/PublicLayout'
import ContactAurora from '@/app/components/public/sections/ContactAurora'

// Geist (Vercel) — anasayfayla aynı typography
const geist = Geist({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
})

// Cache for 5 minutes
export const revalidate = 300

export const metadata: Metadata = {
  title: 'İletişim - Murat Sağ',
  description: 'Murat Sağ ile iletişime geçin. Proje teklifleri, işbirliği fırsatları ve sorularınız için bana ulaşabilirsiniz.',
  keywords: 'iletişim, murat sağ, proje teklifi, işbirliği, yazılım geliştirici, portfolio',
  openGraph: {
    title: 'İletişim - Murat Sağ',
    description: 'Murat Sağ ile iletişime geçin. Proje teklifleri, işbirliği fırsatları ve sorularınız için bana ulaşabilirsiniz.',
    url: 'https://www.muratsag.com/contact',
    siteName: 'Murat Sağ - Portfolio',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'İletişim - Murat Sağ',
    description: 'Murat Sağ ile iletişime geçin. Proje teklifleri, işbirliği fırsatları ve sorularınız için bana ulaşabilirsiniz.',
  },
  alternates: {
    canonical: 'https://www.muratsag.com/contact',
  },
}

export default async function ContactPage() {
  const supabase = createSupabaseServerClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .limit(1)
    .single()

  return (
    <PublicLayout>
      <div className={`${geist.variable} ${geistMono.variable}`}>
        <ContactAurora profile={profile || undefined} />
      </div>
    </PublicLayout>
  )
}

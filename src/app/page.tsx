// src/app/page.tsx
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { Metadata } from 'next'
import PublicLayout from '@/app/components/public/layout/PublicLayout'
import HeroSection from '@/app/components/public/sections/HeroSection'

// Cache for 10 seconds to allow faster profile updates
export const revalidate = 10

export const metadata: Metadata = {
  title: 'Murat Sağ - Software Developer & Computer Engineering Student',
  description: 'Yazılım geliştirici ve bilgisayar mühendisliği öğrencisi. Web geliştirme, mobil uygulamalar ve yazılım çözümleri konularında deneyimli.',
  keywords: 'yazılım geliştirici, web geliştirme, mobil uygulama, react, next.js, typescript, javascript, portfolio, murat sağ',
  openGraph: {
    title: 'Murat Sağ - Software Developer & Computer Engineering Student',
    description: 'Yazılım geliştirici ve bilgisayar mühendisliği öğrencisi. Web geliştirme, mobil uygulamalar ve yazılım çözümleri.',
    url: 'https://www.muratsag.com',
    siteName: 'Murat Sağ - Portfolio',
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
    title: 'Murat Sağ - Software Developer & Computer Engineering Student',
    description: 'Yazılım geliştirici ve bilgisayar mühendisliği öğrencisi.',
    images: ['/og-image.svg'],
  },
  alternates: {
    canonical: 'https://www.muratsag.com',
  },
}

export default async function Home() {
  const supabase = createSupabaseServerClient()
  
  try {
    // Profil bilgilerini al
    const profileResult = await supabase
      .from('profiles')
      .select('*')
      .limit(1)
      .single()

    const profile = profileResult.data



    return (
      <PublicLayout>
        <HeroSection profile={profile} />
        
        {/* SEO için ek içerik */}
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                Yazılım Geliştirici & Bilgisayar Mühendisliği Öğrencisi
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Web Geliştirme
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    React, Next.js, TypeScript ve modern web teknolojileri ile kullanıcı dostu ve performanslı web uygulamaları geliştiriyorum.
                  </p>
                  <ul className="text-gray-600 dark:text-gray-400 space-y-2">
                    <li>• React.js & Next.js</li>
                    <li>• TypeScript & JavaScript</li>
                    <li>• Tailwind CSS & Styled Components</li>
                    <li>• Node.js & Express.js</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Mobil & Backend Geliştirme
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Java, Python, C# ve Dart ile mobil uygulamalar ve backend sistemleri geliştiriyorum.
                  </p>
                  <ul className="text-gray-600 dark:text-gray-400 space-y-2">
                    <li>• Java & Spring Boot</li>
                    <li>• Python & Django</li>
                    <li>• C# & .NET</li>
                    <li>• Flutter & Dart</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* İletişim CTA */}
        <section className="py-16 bg-indigo-600">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Projeleriniz İçin İletişime Geçin
            </h2>
            <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
              Web sitesi, mobil uygulama veya yazılım projeleriniz için profesyonel çözümler sunuyorum. 
              Karabük Üniversitesi Bilgisayar Mühendisliği öğrencisi olarak en güncel teknolojileri kullanarak 
              projelerinizi hayata geçiriyorum.
            </p>
            <a 
              href="/contact" 
              className="inline-flex items-center px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              İletişime Geç
            </a>
          </div>
        </section>
      </PublicLayout>
    )
  } catch (error) {
    console.error('Home page error:', error)
    return (
      <PublicLayout>
        <HeroSection profile={undefined} />
      </PublicLayout>
    )
  }
}

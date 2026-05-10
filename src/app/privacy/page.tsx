import type { Metadata } from 'next'
import Link from 'next/link'
import { Geist, Geist_Mono } from 'next/font/google'
import { ArrowRight, Calendar } from 'lucide-react'
import PublicLayout from '@/app/components/public/layout/PublicLayout'
import styles from '@/styles/components/PrivacyAurora.module.css'

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

export const metadata: Metadata = {
  title: 'Gizlilik Politikası - Murat Sağ',
  description: 'Gizlilik politikası ve çerez kullanımı hakkında bilgiler.',
  alternates: {
    canonical: 'https://www.muratsag.com/privacy',
  },
}

const lastUpdated = new Date().toLocaleDateString('tr-TR', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

export default function PrivacyPage() {
  return (
    <PublicLayout>
      <div className={`${geist.variable} ${geistMono.variable}`}>
        <main className={styles.page}>
          <div className={styles.glowBg} aria-hidden="true" />

          <div className={styles.content}>
            {/* HERO */}
            <section className={styles.hero}>
              <div className={styles.container}>
                <p className={styles.sectionLabel}>Yasal / Gizlilik</p>
                <h1 className={styles.heroTitle}>
                  Gizlilik <span className={styles.heroTitleAccent}>politikası.</span>
                </h1>
                <p className={styles.heroMeta}>
                  <Calendar size={13} />
                  Son güncelleme: {lastUpdated}
                </p>
                <p className={styles.heroSub}>
                  Siteyi nasıl kullandığını anlamak için minimum veriyi topluyoruz —
                  ve bunu sadece deneyimi geliştirmek için kullanıyoruz. Aşağıda her şey
                  açık şekilde yazılı.
                </p>
              </div>
            </section>

            {/* 01 — ÇEREZLER */}
            <section className={styles.section}>
              <div className={styles.container}>
                <p className={styles.sectionNum}>01 / Çerezler</p>
                <h2 className={styles.sectionTitle}>Çerez kullanımı</h2>
                <p className={styles.text}>
                  Bu site, kullanıcı deneyimini geliştirmek ve site performansını analiz etmek
                  için çerezler kullanır. Çerezler tarayıcında saklanan küçük metin
                  dosyalarıdır.
                </p>
                <h3 className={styles.subTitle}>Kullandığımız çerez türleri</h3>
                <ul className={styles.list}>
                  <li className={styles.listItem}>
                    <span>
                      <strong>Analitik çerezler:</strong> Google Tag Manager üzerinden Google
                      Analytics ile ziyaretçi istatistiklerini topluyoruz.
                    </span>
                  </li>
                  <li className={styles.listItem}>
                    <span>
                      <strong>Fonksiyonel çerezler:</strong> Site işlevselliği için gerekli
                      teknik çerezler.
                    </span>
                  </li>
                  <li className={styles.listItem}>
                    <span>
                      <strong>Tercih çerezleri:</strong> Tema seçimi (açık/koyu) gibi
                      kullanıcı tercihlerini hatırlamak için.
                    </span>
                  </li>
                </ul>
              </div>
            </section>

            {/* 02 — CONSENT MODE */}
            <section className={styles.section}>
              <div className={styles.container}>
                <p className={styles.sectionNum}>02 / Onay yönetimi</p>
                <h2 className={styles.sectionTitle}>Onay vermeden veri toplanmaz</h2>
                <p className={styles.text}>
                  Site açıldığında Google Consent Mode v2 standardına göre tüm analytics ve
                  reklam izinleri varsayılan olarak <strong>reddedilmiş</strong> durumdadır.
                  Aşağıdaki banner&apos;dan &quot;Kabul Et&quot;e basana kadar:
                </p>
                <ul className={styles.list}>
                  <li className={styles.listItem}>
                    <span>Google Analytics tag&apos;leri tetiklenmez.</span>
                  </li>
                  <li className={styles.listItem}>
                    <span>Reklam tag&apos;leri tetiklenmez.</span>
                  </li>
                  <li className={styles.listItem}>
                    <span>Hiçbir kişisel veri Google&apos;a iletilmez.</span>
                  </li>
                </ul>
                <p className={styles.text}>
                  &quot;Reddet&quot; dersen tercihin tarayıcına kaydedilir, bir daha sorulmaz.
                </p>
              </div>
            </section>

            {/* 03 — GOOGLE ANALYTICS */}
            <section className={styles.section}>
              <div className={styles.container}>
                <p className={styles.sectionNum}>03 / Google Analytics</p>
                <h2 className={styles.sectionTitle}>Toplanan veriler</h2>
                <p className={styles.text}>
                  Onay verirsen Google Analytics aşağıdaki anonim istatistikleri toplar:
                </p>
                <ul className={styles.list}>
                  <li className={styles.listItem}>
                    <span>Sayfa görüntüleme sayıları</span>
                  </li>
                  <li className={styles.listItem}>
                    <span>Ziyaretçi kaynakları (referrer)</span>
                  </li>
                  <li className={styles.listItem}>
                    <span>Cihaz ve tarayıcı bilgisi (model, sürüm)</span>
                  </li>
                  <li className={styles.listItem}>
                    <span>Coğrafi konum (yalnızca ülke / şehir)</span>
                  </li>
                </ul>
                <p className={styles.text}>
                  Bu veriler kişisel kimlik bilgisi içermez ve sadece site performansını
                  iyileştirmek için kullanılır.
                </p>
              </div>
            </section>

            {/* 04 — VERİ GÜVENLİĞİ */}
            <section className={styles.section}>
              <div className={styles.container}>
                <p className={styles.sectionNum}>04 / Güvenlik</p>
                <h2 className={styles.sectionTitle}>Veri güvenliği</h2>
                <p className={styles.text}>
                  Verilerinizin güvenliği önemli. Topladığımız veriler:
                </p>
                <ul className={styles.list}>
                  <li className={styles.listItem}>
                    <span>Güvenli sunucularda (Vercel + Supabase) saklanır.</span>
                  </li>
                  <li className={styles.listItem}>
                    <span>Üçüncü taraflarla paylaşılmaz.</span>
                  </li>
                  <li className={styles.listItem}>
                    <span>Sadece site iyileştirme amaçlı kullanılır.</span>
                  </li>
                  <li className={styles.listItem}>
                    <span>Talebin üzerine silinebilir.</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* 05 — TERCİHLERİ YÖNETME */}
            <section className={styles.section}>
              <div className={styles.container}>
                <p className={styles.sectionNum}>05 / Kontrol</p>
                <h2 className={styles.sectionTitle}>Tercihleri yönetme</h2>
                <p className={styles.text}>
                  Çerez kullanımını her zaman kontrol edebilirsin:
                </p>
                <ul className={styles.list}>
                  <li className={styles.listItem}>
                    <span>
                      Tarayıcı ayarlarından çerezleri devre dışı bırakabilirsin.
                    </span>
                  </li>
                  <li className={styles.listItem}>
                    <span>
                      Site üzerindeki banner&apos;daki &quot;Reddet&quot; butonunu
                      kullanabilirsin.
                    </span>
                  </li>
                  <li className={styles.listItem}>
                    <span>
                      Önceki onayını geri almak için tarayıcı verilerini (localStorage)
                      temizlemen yeterli — banner tekrar görünür.
                    </span>
                  </li>
                </ul>
              </div>
            </section>

            {/* CONTACT */}
            <section className={styles.container}>
              <div className={styles.contactCard}>
                <h3 className={styles.contactTitle}>Sorun mu var?</h3>
                <p className={styles.contactSub}>
                  Gizlilik politikası ile ilgili sorularını veya verilerinin silinmesi
                  talebini iletmek için yaz.
                </p>
                <Link href="/contact" className={styles.contactBtn}>
                  İletişime geç
                  <ArrowRight size={16} />
                </Link>
              </div>
            </section>

            <div className={styles.footerSpacer} aria-hidden="true" />
          </div>
        </main>
      </div>
    </PublicLayout>
  )
}

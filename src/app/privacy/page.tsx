import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gizlilik Politikası - Murat Sağ',
  description: 'Gizlilik politikası ve çerez kullanımı hakkında bilgiler.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Gizlilik Politikası
          </h1>
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Çerez Kullanımı
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Bu web sitesi, kullanıcı deneyimini geliştirmek ve site performansını analiz etmek için çerezler kullanır.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Kullandığımız Çerez Türleri:
              </h3>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-4 space-y-2">
                <li><strong>Analitik Çerezler:</strong> Google Analytics ile ziyaretçi istatistiklerini toplarız</li>
                <li><strong>Fonksiyonel Çerezler:</strong> Site işlevselliği için gerekli çerezler</li>
                <li><strong>Tercih Çerezleri:</strong> Kullanıcı tercihlerini hatırlamak için</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Google Analytics
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Bu site Google Analytics kullanır. Google Analytics, web sitesi trafiğini analiz etmek için kullanılır. 
                Toplanan veriler şunları içerir:
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-4 space-y-2">
                <li>Sayfa görüntüleme sayıları</li>
                <li>Ziyaretçi kaynakları</li>
                <li>Kullanıcı davranışları</li>
                <li>Coğrafi konum bilgileri (ülke/şehir seviyesinde)</li>
              </ul>
              <p className="text-gray-600 dark:text-gray-300">
                Bu veriler kişisel kimlik bilgilerinizi içermez ve sadece site performansını iyileştirmek için kullanılır.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Veri Güvenliği
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Verilerinizin güvenliği bizim için önemlidir. Topladığımız veriler:
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-4 space-y-2">
                <li>Güvenli sunucularda saklanır</li>
                <li>Üçüncü taraflarla paylaşılmaz</li>
                <li>Sadece site iyileştirme amaçlı kullanılır</li>
                <li>İstediğiniz zaman silinebilir</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Çerez Tercihlerinizi Yönetme
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Çerez kullanımını kontrol etmek için:
              </p>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 mb-4 space-y-2">
                <li>Tarayıcı ayarlarınızdan çerezleri devre dışı bırakabilirsiniz</li>
                <li>Site üzerindeki &quot;Reddet&quot; butonunu kullanabilirsiniz</li>
                <li>Daha önce verdiğiniz izni geri almak için tarayıcı verilerini temizleyebilirsiniz</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                İletişim
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Gizlilik politikamız hakkında sorularınız için{' '}
                <a 
                  href="/contact" 
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  iletişim sayfamızdan
                </a>
                {' '}bize ulaşabilirsiniz.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase URL ve Service Role Key gerekli!')
  console.log('')
  console.log('Lütfen .env.local dosyasında şu değişkenleri tanımlayın:')
  console.log('NEXT_PUBLIC_SUPABASE_URL=your_supabase_url')
  console.log('SUPABASE_SERVICE_ROLE_KEY=your_service_role_key')
  console.log('')
  console.log('Service Role Key\'i Supabase Dashboard > Settings > API > Project API keys > service_role')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function createStorageBucket() {
  try {
    console.log('🔍 Mevcut bucket\'ları kontrol ediliyor...')
    
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      console.error('❌ Bucket listesi alınamadı:', listError)
      return
    }
    
    console.log('📋 Mevcut bucket\'lar:')
    buckets.forEach(bucket => {
      console.log(`  - ${bucket.name} (${bucket.public ? 'public' : 'private'})`)
    })
    
    // images bucket'ını kontrol et
    const imagesBucket = buckets.find(b => b.name === 'images')
    if (imagesBucket) {
      console.log('\n✅ "images" bucket\'ı zaten mevcut!')
      return
    }
    
    console.log('\n🔄 "images" bucket\'ı oluşturuluyor...')
    
    const { data, error } = await supabase.storage.createBucket('images', {
      public: true,
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
      fileSizeLimit: 5242880 // 5MB
    })
    
    if (error) {
      console.error('❌ Bucket oluşturulamadı:', error)
      console.log('')
      console.log('Manuel olarak oluşturmak için:')
      console.log('1. Supabase Dashboard\'a gidin')
      console.log('2. Storage > New bucket')
      console.log('3. Bucket adı: "images"')
      console.log('4. Public seçeneğini işaretleyin')
      console.log('5. Create bucket')
      return
    }
    
    console.log('✅ "images" bucket\'ı başarıyla oluşturuldu!')
    console.log('📁 Bucket detayları:', data)
    
  } catch (error) {
    console.error('❌ Hata:', error)
  }
}

createStorageBucket() 
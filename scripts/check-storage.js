const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL ve Service Role Key gerekli!')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkStorage() {
  try {
    console.log('Storage bucket\'ları kontrol ediliyor...')
    
    const { data: buckets, error } = await supabase.storage.listBuckets()
    
    if (error) {
      console.error('Bucket listesi alınamadı:', error)
      return
    }
    
    console.log('Mevcut bucket\'lar:')
    buckets.forEach(bucket => {
      console.log(`- ${bucket.name} (${bucket.public ? 'public' : 'private'})`)
    })
    
    // images bucket'ını kontrol et
    const imagesBucket = buckets.find(b => b.name === 'images')
    if (!imagesBucket) {
      console.log('\n❌ "images" bucket\'ı bulunamadı!')
      console.log('Supabase Dashboard\'da Storage > New bucket > "images" adında public bucket oluşturun.')
    } else {
      console.log('\n✅ "images" bucket\'ı mevcut')
    }
    
  } catch (error) {
    console.error('Hata:', error)
  }
}

checkStorage() 
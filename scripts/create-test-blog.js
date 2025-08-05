const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://ruhoidsaxoaecjlwgxyv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1aG9pZHNheG9hZWNqbHdneHl2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mzk2NTg2OCwiZXhwIjoyMDY5NTQxODY4fQ.DBeyHwPU6KJZbTWV_ycFLwx-oTRH96EI1JbD0IfFmhk'

const supabase = createClient(supabaseUrl, supabaseKey)

async function createTestBlog() {
  try {
    // Önce mevcut kullanıcıyı al
    const { data: users, error: userError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)

    if (userError || !users || users.length === 0) {
      console.error('Kullanıcı bulunamadı:', userError)
      return
    }

    const userId = users[0].id
    console.log('Kullanıcı ID:', userId)

    const { data, error } = await supabase
      .from('blogs')
      .insert([
        {
          user_id: userId,
          title: 'MikroTik Nedir? Ne İşe Yarar?',
          content: `
            <h2>MikroTik Nedir?</h2>
            <p>Kısaca anlatmak gerekirse, MikroTik, hem donanım (RouterBOARD) hem de yazılım (RouterOS) sunan bir ağ teknolojileri markasıdır. Aslında bir yönlendirici (router) markası gibi görünse de, yetenekleri bununla sınırlı değil.</p>
            
            <h3>MikroTik'in Özellikleri</h3>
            <ul>
              <li>Firewall yönetimi</li>
              <li>VPN sunucusu</li>
              <li>Hotspot yönetimi</li>
              <li>Bant genişliği kontrolü</li>
              <li>İleri düzey ağ yönetimi</li>
            </ul>
            
            <h3>Neden MikroTik?</h3>
            <p>MikroTik, özellikle küçük ve orta ölçekli işletmeler için uygun maliyetli çözümler sunar. Güçlü özellikleri ve esnek yapılandırma seçenekleri ile tercih edilir.</p>
          `,
          excerpt: 'Kısaca anlatmak gerekirse, MikroTik, hem donanım (RouterBOARD) hem de yazılım (RouterOS) sunan bir ağ teknolojileri markasıdır. Aslında bir yönlendirici (router) markası gibi görünse de, yetenekleri bununla sınırlı değil. Firewall, VPN sunucusu, hotspot yönetimi, bant genişliği kontrolü gibi pek çok ileri düzey ağı yönetim özelliğini de bünyesinde barındırır.',
          author: 'Murat Sağ',
          published: true,
          tags: ['ağ', 'mikrotik', 'router', 'firewall']
        }
      ])
      .select()

    if (error) {
      console.error('Blog oluşturma hatası:', error)
    } else {
      console.log('Test blog başarıyla oluşturuldu:', data)
    }
  } catch (error) {
    console.error('Hata:', error)
  }
}

createTestBlog() 
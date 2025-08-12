// scripts/create-admin.js
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createAdminUser() {
  try {
    // Create the user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'admin@muratsag.com',
      password: 'admin123',
      email_confirm: true
    })

    if (authError) {
      console.error('Error creating user:', authError)
      return
    }

    console.log('User created:', authData.user)

    // Create profile record
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: 'admin@muratsag.com',
        full_name: 'Murat Sağ',
        title: 'Software Developer',
        bio: 'Java, Python, C, Dart ve C# gibi programlama dillerinde deneyim sahibi, React.js ve Spring Boot teknolojileriyle projeler geliştiren bir yazılım geliştirici.',
        location: 'Karabük, Türkiye',
        website: 'https://muratsag.com',
        github: 'https://github.com/muratsag',
        linkedin: 'https://linkedin.com/in/muratsag',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })

    if (profileError) {
      console.error('Error creating profile:', profileError)
      return
    }

    console.log('Profile created:', profileData)
    console.log('Admin user created successfully!')
    console.log('Email: admin@muratsag.com')
    console.log('Password: admin123')

  } catch (error) {
    console.error('Error:', error)
  }
}

createAdminUser() 
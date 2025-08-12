const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables manually
function loadEnvFile(filePath) {
  try {
    const envContent = fs.readFileSync(filePath, 'utf8')
    const envVars = {}
    
    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=')
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').trim()
        if (!value.startsWith('#')) {
          envVars[key.trim()] = value.replace(/^["']|["']$/g, '')
        }
      }
    })
    
    return envVars
  } catch (error) {
    console.error('Error loading .env.local file:', error.message)
    return {}
  }
}

const envVars = loadEnvFile('.env.local')
Object.keys(envVars).forEach(key => {
  process.env[key] = envVars[key]
})

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function testExperiencesTable() {
  try {
    console.log('Testing experiences table...')
    
    // Try to fetch from experiences table to check if it exists
    const { data: tableCheck, error: tableError } = await supabase
      .from('experiences')
      .select('count')
      .limit(1)
    
    if (tableError) {
      console.log('❌ Experiences table does not exist!')
      console.log('Please run the following SQL in your Supabase Dashboard:')
      console.log('')
      console.log(fs.readFileSync(path.join(__dirname, 'create-experiences-table.sql'), 'utf8'))
      return
    }
    
    console.log('✅ Experiences table exists!')
    
    // Get a real user ID from profiles table
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)
    
    if (profilesError || !profiles || profiles.length === 0) {
      console.log('❌ No users found in profiles table!')
      console.log('Please create a user first.')
      return
    }
    
    const userId = profiles[0].id
    console.log('Using user ID:', userId)
    
    // Test inserting a sample experience
    console.log('Testing insert...')
    
    const { data: testExperience, error: insertError } = await supabase
      .from('experiences')
      .insert({
        user_id: userId,
        title: 'Software Developer',
        company: 'Test Company',
        location: 'Test Location',
        start_date: '2023-01-01',
        current: true,
        description: 'Test experience for table creation'
      })
      .select()
      .single()
    
    if (insertError) {
      console.error('Error inserting test experience:', insertError)
      return
    }
    
    console.log('✅ Sample experience inserted successfully!')
    console.log('Sample experience:', testExperience)
    
    // Test fetching experiences
    console.log('Testing fetch...')
    
    const { data: experiences, error: fetchError } = await supabase
      .from('experiences')
      .select('*')
      .eq('user_id', userId)
    
    if (fetchError) {
      console.error('Error fetching experiences:', fetchError)
      return
    }
    
    console.log('✅ Experiences fetched successfully!')
    console.log('Found experiences:', experiences.length)
    
    // Clean up test data
    console.log('Cleaning up test data...')
    
    const { error: cleanupError } = await supabase
      .from('experiences')
      .delete()
      .eq('user_id', userId)
    
    if (cleanupError) {
      console.error('Error cleaning up test data:', cleanupError)
    } else {
      console.log('✅ Test data cleaned up')
    }
    
    console.log('🎉 Experiences table is working correctly!')
    
  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

testExperiencesTable() 
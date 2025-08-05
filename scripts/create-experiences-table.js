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

async function createExperiencesTable() {
  try {
    console.log('Creating experiences table...')
    
    // Read SQL file
    const sqlPath = path.join(__dirname, 'create-experiences-table.sql')
    const sql = fs.readFileSync(sqlPath, 'utf8')
    
    // Execute SQL
    const { error } = await supabase.rpc('exec_sql', { sql })
    
    if (error) {
      console.error('Error creating experiences table:', error)
      return
    }
    
    console.log('✅ Experiences table created successfully!')
    
    // Test the table by inserting a sample experience
    console.log('Testing table with sample data...')
    
    const { data: testExperience, error: testError } = await supabase
      .from('experiences')
      .insert({
        user_id: '00000000-0000-0000-0000-000000000000', // Test user ID
        title: 'Software Developer',
        company: 'Test Company',
        location: 'Test Location',
        start_date: '2023-01-01',
        current: true,
        description: 'Test experience for table creation'
      })
      .select()
      .single()
    
    if (testError) {
      console.error('Error testing experiences table:', testError)
      return
    }
    
    console.log('✅ Sample experience inserted successfully!')
    console.log('Sample experience:', testExperience)
    
    // Clean up test data
    const { error: cleanupError } = await supabase
      .from('experiences')
      .delete()
      .eq('user_id', '00000000-0000-0000-0000-000000000000')
    
    if (cleanupError) {
      console.error('Error cleaning up test data:', cleanupError)
    } else {
      console.log('✅ Test data cleaned up')
    }
    
  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

createExperiencesTable() 
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

async function testBlogsTable() {
  try {
    console.log('Testing blogs table...')
    
    // Try to fetch from blogs table to check if it exists
    const { data: tableCheck, error: tableError } = await supabase
      .from('blogs')
      .select('count')
      .limit(1)
    
    if (tableError) {
      console.log('❌ Blogs table does not exist!')
      console.log('Please run the following SQL in your Supabase Dashboard:')
      console.log('')
      console.log(fs.readFileSync(path.join(__dirname, 'create-blogs-table.sql'), 'utf8'))
      return
    }
    
    console.log('✅ Blogs table exists!')
    
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
    
    // Test inserting a sample blog
    console.log('Testing insert...')
    
    const { data: testBlog, error: insertError } = await supabase
      .from('blogs')
      .insert({
        user_id: userId,
        title: 'Test Blog Post',
        excerpt: 'This is a test blog post excerpt',
        content: '<p>This is a test blog post content with <strong>rich text</strong> formatting.</p>',
        author: 'Test Author',
        tags: ['test', 'blog', 'demo'],
        published: true,
        views: 0
      })
      .select()
      .single()
    
    if (insertError) {
      console.error('Error inserting test blog:', insertError)
      return
    }
    
    console.log('✅ Sample blog inserted successfully!')
    console.log('Sample blog:', testBlog)
    
    // Test fetching blogs
    console.log('Testing fetch...')
    
    const { data: blogs, error: fetchError } = await supabase
      .from('blogs')
      .select('*')
      .eq('user_id', userId)
    
    if (fetchError) {
      console.error('Error fetching blogs:', fetchError)
      return
    }
    
    console.log('✅ Blogs fetched successfully!')
    console.log('Found blogs:', blogs.length)
    
    // Clean up test data
    console.log('Cleaning up test data...')
    
    const { error: cleanupError } = await supabase
      .from('blogs')
      .delete()
      .eq('user_id', userId)
    
    if (cleanupError) {
      console.error('Error cleaning up test data:', cleanupError)
    } else {
      console.log('✅ Test data cleaned up')
    }
    
    console.log('🎉 Blogs table is working correctly!')
    
  } catch (error) {
    console.error('Unexpected error:', error)
  }
}

testBlogsTable() 
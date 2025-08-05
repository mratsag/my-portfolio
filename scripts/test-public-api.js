const BASE_URL = 'http://localhost:3000/api/public'

async function testAPI() {
  console.log('🧪 Testing Public API Endpoints...\n')

  const endpoints = [
    { name: 'Profile', url: `${BASE_URL}/profile`, method: 'GET' },
    { name: 'Projects', url: `${BASE_URL}/projects`, method: 'GET' },
    { name: 'Experiences', url: `${BASE_URL}/experiences`, method: 'GET' },
    { name: 'Skills', url: `${BASE_URL}/skills`, method: 'GET' },
    { name: 'Blogs', url: `${BASE_URL}/blogs`, method: 'GET' },
  ]

  for (const endpoint of endpoints) {
    try {
      console.log(`📡 Testing ${endpoint.name}...`)
      
      const response = await fetch(endpoint.url, {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (response.ok) {
        console.log(`✅ ${endpoint.name}: Success`)
        console.log(`   Status: ${response.status}`)
        console.log(`   Data: ${Array.isArray(data) ? data.length : 1} items`)
      } else {
        console.log(`❌ ${endpoint.name}: Failed`)
        console.log(`   Status: ${response.status}`)
        console.log(`   Error: ${data.error}`)
      }
    } catch (error) {
      console.log(`❌ ${endpoint.name}: Error`)
      console.log(`   Error: ${error.message}`)
    }
    console.log('')
  }

  // Test contact form
  console.log('📡 Testing Contact Form...')
  try {
    const contactData = {
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Test Message',
      message: 'This is a test message from the API test script.'
    }

    const response = await fetch(`${BASE_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactData)
    })

    const data = await response.json()

    if (response.ok) {
      console.log('✅ Contact Form: Success')
      console.log(`   Status: ${response.status}`)
      console.log(`   Message: ${data.message}`)
    } else {
      console.log('❌ Contact Form: Failed')
      console.log(`   Status: ${response.status}`)
      console.log(`   Error: ${data.error}`)
    }
  } catch (error) {
    console.log('❌ Contact Form: Error')
    console.log(`   Error: ${error.message}`)
  }

  console.log('\n🎉 API Testing Complete!')
}

// Run the test
testAPI().catch(console.error) 
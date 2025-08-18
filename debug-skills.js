// debug-skills.js
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function debugSkills() {
  console.log('=== SKILLS DEBUG ===')
  
  try {
    // Skills tablosundan tüm verileri çek
    const { data: skills, error } = await supabase
      .from('skills')
      .select('*')
      .order('order_index', { ascending: true })

    if (error) {
      console.error('Skills fetch error:', error)
      return
    }

    console.log('Skills count:', skills?.length || 0)
    console.log('Skills data:', skills)

    if (skills && skills.length > 0) {
      console.log('\n=== SKILLS BY CATEGORY ===')
      const categories = {}
      skills.forEach(skill => {
        const category = skill.category || 'Diğer'
        if (!categories[category]) {
          categories[category] = []
        }
        categories[category].push(skill)
      })
      
      Object.entries(categories).forEach(([category, categorySkills]) => {
        console.log(`${category}: ${categorySkills.length} skills`)
        categorySkills.forEach(skill => {
          console.log(`  - ${skill.name} (${skill.level})`)
        })
      })
    } else {
      console.log('No skills found in database')
    }

  } catch (error) {
    console.error('Debug error:', error)
  }
}

debugSkills()

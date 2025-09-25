// Simple script to seed projects
async function seedProjects() {
  try {
    console.log('Seeding projects...')
    
    const response = await fetch('http://localhost:4000/api/seed-projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    if (response.ok) {
      const result = await response.json()
      console.log('✅ Success:', result.message)
      console.log('Projects created:', result.projects.length)
      
      result.projects.forEach((project, index) => {
        console.log(`${index + 1}. ${project.title}`)
        console.log(`   Image: ${project.imageUrl}`)
        console.log(`   Technologies: ${project.technologies.join(', ')}`)
      })
    } else {
      console.log('❌ Failed to seed projects')
      const errorText = await response.text()
      console.log('Error:', errorText)
    }
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

seedProjects()


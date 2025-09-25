// Simple script to update project images via API calls
const projects = [
  {
    title: 'Food Munch',
    description: 'Responsive food browsing website with product videos. Built using HTML, CSS, and Bootstrap.',
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?q=80&w=1200&auto=format&fit=crop',
    liveUrl: 'http://narsimulu79.ccbp.tech',
    githubUrl: 'https://github.com/Narsimulu-G/food-munch',
    technologies: ['HTML', 'CSS', 'Bootstrap'],
    featured: true
  },
  {
    title: 'Weather App',
    description: 'Real-time weather application with location-based forecasts. Built with React and OpenWeather API.',
    imageUrl: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?q=80&w=1200&auto=format&fit=crop',
    liveUrl: 'https://weather-app-demo.com',
    githubUrl: 'https://github.com/Narsimulu-G/weather-app',
    technologies: ['React', 'JavaScript', 'API'],
    featured: true
  },
  {
    title: 'Task Manager',
    description: 'Full-stack task management application with user authentication and real-time updates.',
    imageUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?q=80&w=1200&auto=format&fit=crop',
    liveUrl: 'https://task-manager-demo.com',
    githubUrl: 'https://github.com/Narsimulu-G/task-manager',
    technologies: ['React', 'Node.js', 'MongoDB'],
    featured: false
  },
  {
    title: 'E-commerce Store',
    description: 'Complete e-commerce solution with payment integration, inventory management, and admin dashboard.',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1200&auto=format&fit=crop',
    liveUrl: 'https://ecommerce-demo.com',
    githubUrl: 'https://github.com/Narsimulu-G/ecommerce-store',
    technologies: ['React', 'Express', 'Stripe', 'PostgreSQL'],
    featured: true
  }
]

async function updateProjects() {
  try {
    // First, get existing projects
    console.log('Fetching existing projects...')
    const response = await fetch('http://localhost:4000/api/projects')
    const existingProjects = await response.json()
    
    console.log(`Found ${existingProjects.length} existing projects:`)
    existingProjects.forEach((project, index) => {
      console.log(`${index + 1}. ${project.title} (ID: ${project._id})`)
    })
    
    // Clear existing projects
    console.log('\nClearing existing projects...')
    for (const project of existingProjects) {
      try {
        await fetch(`http://localhost:4000/api/admin/projects/${project._id}`, {
          method: 'DELETE'
        })
        console.log(`Deleted: ${project.title}`)
      } catch (error) {
        console.log(`Failed to delete ${project.title}:`, error.message)
      }
    }
    
    // Add new projects with images
    console.log('\nAdding new projects with images...')
    for (const project of projects) {
      try {
        const response = await fetch('http://localhost:4000/api/admin/projects', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(project)
        })
        
        if (response.ok) {
          const created = await response.json()
          console.log(`✅ Created: ${created.title}`)
          console.log(`   Image: ${created.imageUrl}`)
        } else {
          console.log(`❌ Failed to create: ${project.title}`)
        }
      } catch (error) {
        console.log(`❌ Error creating ${project.title}:`, error.message)
      }
    }
    
    console.log('\n✅ Project update completed!')
    
    // Verify the results
    console.log('\nVerifying results...')
    const verifyResponse = await fetch('http://localhost:4000/api/projects')
    const finalProjects = await verifyResponse.json()
    
    console.log(`\nFinal projects in database (${finalProjects.length}):`)
    finalProjects.forEach((project, index) => {
      console.log(`${index + 1}. ${project.title}`)
      console.log(`   Image: ${project.imageUrl || project.image || 'NO IMAGE'}`)
      console.log(`   Technologies: ${project.technologies?.join(', ') || project.tags?.join(', ') || 'NONE'}`)
      console.log('')
    })
    
  } catch (error) {
    console.error('❌ Error updating projects:', error)
  }
}

updateProjects()


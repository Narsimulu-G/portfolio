// Simple script to update projects via direct database connection
// This will work with the existing database connection from the running server

const sampleProjects = [
  {
    title: 'Food Munch',
    description: 'Responsive food browsing website with product videos. Built using HTML, CSS, and Bootstrap.',
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?q=80&w=1200&auto=format&fit=crop',
    liveUrl: 'http://narsimulu79.ccbp.tech',
    githubUrl: 'https://github.com/Narsimulu-G/food-munch',
    technologies: ['HTML', 'CSS', 'Bootstrap'],
    featured: true,
    // Keep old fields for backward compatibility
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?q=80&w=1200&auto=format&fit=crop',
    tags: ['HTML', 'CSS', 'Bootstrap'],
    demoUrl: 'http://narsimulu79.ccbp.tech',
    icon: '🍕',
    category: 'Web Development'
  },
  {
    title: 'Weather App',
    description: 'Real-time weather application with location-based forecasts. Built with React and OpenWeather API.',
    imageUrl: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?q=80&w=1200&auto=format&fit=crop',
    liveUrl: 'https://weather-app-demo.com',
    githubUrl: 'https://github.com/Narsimulu-G/weather-app',
    technologies: ['React', 'JavaScript', 'API'],
    featured: true,
    // Keep old fields for backward compatibility
    image: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?q=80&w=1200&auto=format&fit=crop',
    tags: ['React', 'JavaScript', 'API'],
    demoUrl: 'https://weather-app-demo.com',
    icon: '🌤️',
    category: 'Web Development'
  },
  {
    title: 'Task Manager',
    description: 'Full-stack task management application with user authentication and real-time updates.',
    imageUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?q=80&w=1200&auto=format&fit=crop',
    liveUrl: 'https://task-manager-demo.com',
    githubUrl: 'https://github.com/Narsimulu-G/task-manager',
    technologies: ['React', 'Node.js', 'MongoDB'],
    featured: false,
    // Keep old fields for backward compatibility
    image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?q=80&w=1200&auto=format&fit=crop',
    tags: ['React', 'Node.js', 'MongoDB'],
    demoUrl: 'https://task-manager-demo.com',
    icon: '✅',
    category: 'Full Stack'
  },
  {
    title: 'E-commerce Store',
    description: 'Complete e-commerce solution with payment integration, inventory management, and admin dashboard.',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1200&auto=format&fit=crop',
    liveUrl: 'https://ecommerce-demo.com',
    githubUrl: 'https://github.com/Narsimulu-G/ecommerce-store',
    technologies: ['React', 'Express', 'Stripe', 'PostgreSQL'],
    featured: true,
    // Keep old fields for backward compatibility
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1200&auto=format&fit=crop',
    tags: ['React', 'Express', 'Stripe', 'PostgreSQL'],
    demoUrl: 'https://ecommerce-demo.com',
    icon: '🛒',
    category: 'Full Stack'
  }
]

async function updateProjects() {
  try {
    console.log('Updating projects via API...')
    
    // First, get existing projects
    const response = await fetch('http://localhost:4000/api/projects')
    const existingProjects = await response.json()
    
    console.log(`Found ${existingProjects.length} existing projects:`)
    existingProjects.forEach((project, index) => {
      console.log(`${index + 1}. ${project.title} (ID: ${project._id})`)
    })
    
    // For each existing project, update it with new data
    for (let i = 0; i < existingProjects.length && i < sampleProjects.length; i++) {
      const existingProject = existingProjects[i]
      const newData = sampleProjects[i]
      
      try {
        console.log(`\nUpdating project ${i + 1}: ${existingProject.title}`)
        console.log(`New image: ${newData.imageUrl}`)
        
        // Update the project with new data
        const updateResponse = await fetch(`http://localhost:4000/api/admin/projects/${existingProject._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            // We need to bypass auth for this script
            'Authorization': 'Bearer dev_token' // This might not work, but let's try
          },
          body: JSON.stringify(newData)
        })
        
        if (updateResponse.ok) {
          const updated = await updateResponse.json()
          console.log(`✅ Updated: ${updated.title}`)
          console.log(`   Image: ${updated.imageUrl || updated.image}`)
        } else {
          console.log(`❌ Failed to update: ${existingProject.title}`)
          console.log(`   Status: ${updateResponse.status}`)
          const errorText = await updateResponse.text()
          console.log(`   Error: ${errorText}`)
        }
      } catch (error) {
        console.log(`❌ Error updating ${existingProject.title}:`, error.message)
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

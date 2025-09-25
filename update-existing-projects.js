// Script to update existing projects with images
async function updateExistingProjects() {
  try {
    console.log('Fetching existing projects...')
    
    // Get existing projects
    const response = await fetch('http://localhost:4000/api/projects')
    const projects = await response.json()
    
    console.log(`Found ${projects.length} existing projects:`)
    projects.forEach((project, index) => {
      console.log(`${index + 1}. ${project.title} (ID: ${project._id})`)
      console.log(`   Current image: ${project.image || project.imageUrl || 'NO IMAGE'}`)
    })
    
    // Since we can't use the admin API without auth, let's try a different approach
    // Let's check if we can access the admin panel directly
    console.log('\nTo update project images:')
    console.log('1. Go to http://localhost:5173/admin')
    console.log('2. Log in to the admin panel')
    console.log('3. Go to Project Management')
    console.log('4. Edit each project and add images using the drag and drop feature')
    
    console.log('\nAlternatively, you can manually update the database:')
    console.log('1. Connect to your MongoDB database')
    console.log('2. Update the projects collection with image URLs')
    
    // Let's also show what the projects should look like
    console.log('\nHere are the sample projects with images that should be added:')
    const sampleProjects = [
      {
        title: 'Food Munch',
        imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?q=80&w=1200&auto=format&fit=crop',
        technologies: ['HTML', 'CSS', 'Bootstrap']
      },
      {
        title: 'Weather App', 
        imageUrl: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?q=80&w=1200&auto=format&fit=crop',
        technologies: ['React', 'JavaScript', 'API']
      },
      {
        title: 'Task Manager',
        imageUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?q=80&w=1200&auto=format&fit=crop',
        technologies: ['React', 'Node.js', 'MongoDB']
      },
      {
        title: 'E-commerce Store',
        imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1200&auto=format&fit=crop',
        technologies: ['React', 'Express', 'Stripe', 'PostgreSQL']
      }
    ]
    
    sampleProjects.forEach((project, index) => {
      console.log(`${index + 1}. ${project.title}`)
      console.log(`   Image: ${project.imageUrl}`)
      console.log(`   Technologies: ${project.technologies.join(', ')}`)
    })
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

updateExistingProjects()


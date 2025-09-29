import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { connectToDatabase } from '../src/config/db.js'
import Profile from '../src/models/Profile.js'
import Skill from '../src/models/Skill.js'
import Certificate from '../src/models/Certificate.js'
import Project from '../src/models/Project.js'
import About from '../src/models/About.js'
import Contact from '../src/models/Contact.js'
import Resume from '../src/models/Resume.js'
import Credentials from '../src/models/Credentials.js'
import { profile as seedProfile, skills, certificates } from '../src/data/seed.js'

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://badri_portfolio:badri_portfolio@portfolio.gxuxs4v.mongodb.net/portfolio?retryWrites=true&w=majority'

async function clearDatabase() {
  console.log('🗑️  Clearing existing data...')
  
  try {
    await Profile.deleteMany({})
    await Skill.deleteMany({})
    await Certificate.deleteMany({})
    await Project.deleteMany({})
    await About.deleteMany({})
    await Contact.deleteMany({})
    await Resume.deleteMany({})
    await Credentials.deleteMany({})
    
    console.log('✅ Database cleared successfully')
  } catch (error) {
    console.error('❌ Error clearing database:', error)
    throw error
  }
}

async function seedProfileData() {
  console.log('👤 Seeding profile data...')
  
  try {
    const profileData = {
      name: 'Narsimulu G',
      headline: 'Full-stack developer',
      bio: 'Passionate full-stack developer with expertise in React.js, Node.js, and modern web technologies. I love building responsive web applications and solving complex problems through code.',
      email: 'narasimha.2003g@gmail.com',
      phone: '+91 9876543210',
      location: 'Hyderabad, India',
      avatarUrl: 'https://res.cloudinary.com/dovmtmu7y/image/upload/v1758257912/badri_ekxgwe.jpg',
      social: {
        linkedin: 'https://www.linkedin.com/in/g-narsimulu',
        github: 'https://github.com/Narsimulu-G',
        twitter: '',
        instagram: '',
        facebook: ''
      },
      resumeUrl: '#',
      isActive: true
    }
    
    const profile = await Profile.create(profileData)
    console.log('✅ Profile created:', profile.name)
    return profile
  } catch (error) {
    console.error('❌ Error seeding profile:', error)
    throw error
  }
}

async function seedSkills() {
  console.log('🛠️  Seeding skills data...')
  
  try {
    const skillsData = [
      { 
        name: 'React.js', 
        level: 'Advanced', 
        icon: '⚛️', 
        category: 'Frameworks',
        description: 'Modern JavaScript library for building user interfaces',
        isFeatured: true,
        order: 1
      },
      { 
        name: 'JavaScript', 
        level: 'Expert', 
        icon: '🟨', 
        category: 'Programming Languages',
        description: 'Core programming language for web development',
        isFeatured: true,
        order: 2
      },
      { 
        name: 'Node.js', 
        level: 'Intermediate', 
        icon: '🟢', 
        category: 'Technical',
        description: 'JavaScript runtime for server-side development',
        isFeatured: true,
        order: 3
      },
      { 
        name: 'MongoDB', 
        level: 'Intermediate', 
        icon: '🍃', 
        category: 'Technical',
        description: 'NoSQL database for modern applications',
        isFeatured: false,
        order: 4
      },
      { 
        name: 'Express.js', 
        level: 'Intermediate', 
        icon: '🚀', 
        category: 'Frameworks',
        description: 'Web application framework for Node.js',
        isFeatured: false,
        order: 5
      },
      { 
        name: 'HTML/CSS', 
        level: 'Expert', 
        icon: '🎨', 
        category: 'Technical',
        description: 'Fundamental web technologies for structure and styling',
        isFeatured: true,
        order: 6
      },
      { 
        name: 'Git', 
        level: 'Advanced', 
        icon: '📦', 
        category: 'Tools',
        description: 'Version control system for tracking code changes',
        isFeatured: false,
        order: 7
      },
      { 
        name: 'Bootstrap', 
        level: 'Advanced', 
        icon: '💜', 
        category: 'Frameworks',
        description: 'CSS framework for responsive web design',
        isFeatured: false,
        order: 8
      },
      { 
        name: 'Python', 
        level: 'Intermediate', 
        icon: '🐍', 
        category: 'Programming Languages',
        description: 'Versatile programming language for various applications',
        isFeatured: false,
        order: 9
      },
      { 
        name: 'SQL', 
        level: 'Intermediate', 
        icon: '🗄️', 
        category: 'Technical',
        description: 'Structured Query Language for database management',
        isFeatured: false,
        order: 10
      }
    ]
    
    const skills = await Skill.insertMany(skillsData)
    console.log(`✅ Created ${skills.length} skills`)
    return skills
  } catch (error) {
    console.error('❌ Error seeding skills:', error)
    throw error
  }
}

async function seedCertificates() {
  console.log('🏆 Seeding certificates data...')
  
  try {
    const certificatesData = [
      {
        title: 'CERTIFICATE OF ACHIEVEMENT',
        issuer: 'NXT WAVE',
        date: 'January 2024',
        image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=400&h=300&auto=format&fit=crop',
        description: 'Full Stack Development Certificate',
        isActive: true,
        order: 1
      },
      {
        title: 'CERTIFICATE OF COMPLETION',
        issuer: 'FreeCodeCamp',
        date: 'November 2023',
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=400&h=300&auto=format&fit=crop',
        description: 'React.js Fundamentals Certificate',
        isActive: true,
        order: 2
      },
      {
        title: 'CERTIFICATE OF EXCELLENCE',
        issuer: 'FreeCodeCamp',
        date: 'October 2023',
        image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?q=80&w=400&h=300&auto=format&fit=crop',
        description: 'JavaScript Algorithms and Data Structures Certificate',
        isActive: true,
        order: 3
      }
    ]
    
    const certificates = await Certificate.insertMany(certificatesData)
    console.log(`✅ Created ${certificates.length} certificates`)
    return certificates
  } catch (error) {
    console.error('❌ Error seeding certificates:', error)
    throw error
  }
}

async function seedProjects() {
  console.log('🚀 Seeding projects data...')
  
  try {
    const projectsData = [
      {
        title: 'Food Munch',
        description: 'Responsive food browsing website with product videos. Built using HTML, CSS, and Bootstrap. Features include product filtering, search functionality, and mobile-responsive design.',
        imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?q=80&w=600&h=400&auto=format&fit=crop',
        liveUrl: 'http://narsimulu79.ccbp.tech',
        githubUrl: 'https://github.com/Narsimulu-G/food-munch',
        technologies: ['HTML', 'CSS', 'Bootstrap', 'JavaScript'],
        featured: true,
        // Keep old fields for backward compatibility
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?q=80&w=600&h=400&auto=format&fit=crop',
        tags: ['HTML', 'CSS', 'Bootstrap', 'JavaScript'],
        demoUrl: 'http://narsimulu79.ccbp.tech',
        icon: '🍕',
        category: 'Web Development'
      },
      {
        title: 'Weather App',
        description: 'Real-time weather application with location-based forecasts. Built with React and OpenWeather API. Features include current weather, 5-day forecast, and location search.',
        imageUrl: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?q=80&w=600&h=400&auto=format&fit=crop',
        liveUrl: 'https://weather-app-demo.com',
        githubUrl: 'https://github.com/Narsimulu-G/weather-app',
        technologies: ['React', 'JavaScript', 'API', 'CSS'],
        featured: true,
        image: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?q=80&w=600&h=400&auto=format&fit=crop',
        tags: ['React', 'JavaScript', 'API', 'CSS'],
        demoUrl: 'https://weather-app-demo.com',
        icon: '🌤️',
        category: 'Web Development'
      },
      {
        title: 'Task Manager',
        description: 'Full-stack task management application with user authentication and real-time updates. Features include task creation, editing, deletion, and user management.',
        imageUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?q=80&w=600&h=400&auto=format&fit=crop',
        liveUrl: 'https://task-manager-demo.com',
        githubUrl: 'https://github.com/Narsimulu-G/task-manager',
        technologies: ['React', 'Node.js', 'MongoDB', 'Express'],
        featured: false,
        image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?q=80&w=600&h=400&auto=format&fit=crop',
        tags: ['React', 'Node.js', 'MongoDB', 'Express'],
        demoUrl: 'https://task-manager-demo.com',
        icon: '✅',
        category: 'Full Stack'
      },
      {
        title: 'E-commerce Store',
        description: 'Complete e-commerce solution with payment integration, inventory management, and admin dashboard. Features include product catalog, shopping cart, and order management.',
        imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=600&h=400&auto=format&fit=crop',
        liveUrl: 'https://ecommerce-demo.com',
        githubUrl: 'https://github.com/Narsimulu-G/ecommerce-store',
        technologies: ['React', 'Express', 'Stripe', 'PostgreSQL'],
        featured: true,
        image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=600&h=400&auto=format&fit=crop',
        tags: ['React', 'Express', 'Stripe', 'PostgreSQL'],
        demoUrl: 'https://ecommerce-demo.com',
        icon: '🛒',
        category: 'Full Stack'
      },
      {
        title: 'Portfolio Website',
        description: 'Personal portfolio website showcasing projects, skills, and experience. Built with React and modern web technologies. Features include responsive design and admin panel.',
        imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&h=400&auto=format&fit=crop',
        liveUrl: 'https://portfolio-demo.com',
        githubUrl: 'https://github.com/Narsimulu-G/portfolio',
        technologies: ['React', 'Node.js', 'MongoDB', 'Express'],
        featured: true,
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&h=400&auto=format&fit=crop',
        tags: ['React', 'Node.js', 'MongoDB', 'Express'],
        demoUrl: 'https://portfolio-demo.com',
        icon: '💼',
        category: 'Full Stack'
      }
    ]
    
    const projects = await Project.insertMany(projectsData)
    console.log(`✅ Created ${projects.length} projects`)
    return projects
  } catch (error) {
    console.error('❌ Error seeding projects:', error)
    throw error
  }
}

async function seedAbout() {
  console.log('ℹ️  Seeding about data...')
  
  try {
    const aboutData = {
      title: 'About Me',
      bio: 'I am a passionate full-stack developer with expertise in React.js, Node.js, and modern web technologies. I love building responsive web applications and solving complex problems through code. With a strong foundation in both frontend and backend development, I create seamless user experiences and robust server-side solutions.',
      imageUrl: 'https://res.cloudinary.com/dovmtmu7y/image/upload/v1758257912/badri_ekxgwe.jpg',
      whatIDo: [
        'Build responsive web applications using React.js and modern frameworks',
        'Develop backend APIs and services with Node.js and Express',
        'Create user-friendly interfaces with HTML, CSS, and Bootstrap',
        'Work with databases and implement CRUD operations',
        'Implement authentication and security features',
        'Optimize applications for performance and scalability'
      ],
      techStacks: [
        'React.js', 'JavaScript', 'Node.js', 'Express.js', 
        'MongoDB', 'HTML', 'CSS', 'Bootstrap', 'Git', 'Python'
      ],
      stats: {
        education: 'MCA',
        projects: '10+',
        cgpa: '7.32',
        experience: '2+ years'
      },
      isActive: true
    }
    
    const about = await About.create(aboutData)
    console.log('✅ About section created')
    return about
  } catch (error) {
    console.error('❌ Error seeding about:', error)
    throw error
  }
}

async function seedContact() {
  console.log('📞 Seeding contact data...')
  
  try {
    const contactData = {
      title: "Get In Touch",
      subtitle: "Let's work together",
      description: "I'm always interested in new opportunities and exciting projects. Feel free to reach out!",
      email: "narasimha.2003g@gmail.com",
      phone: "+91 9876543210",
      address: "Hyderabad, India",
      socialLinks: {
        linkedin: "https://www.linkedin.com/in/g-narsimulu",
        github: "https://github.com/Narsimulu-G",
        twitter: "",
        instagram: "",
        facebook: ""
      },
      isActive: true
    }
    
    const contact = await Contact.create(contactData)
    console.log('✅ Contact information created')
    return contact
  } catch (error) {
    console.error('❌ Error seeding contact:', error)
    throw error
  }
}

async function seedResume() {
  console.log('📄 Seeding resume data...')
  
  try {
    const resumeData = {
      title: 'Narsimulu G - Resume',
      fileName: 'Narsimulu_G_Resume.pdf',
      fileUrl: 'https://res.cloudinary.com/dovmtmu7y/image/upload/v1758257912/badri_ekxgwe.jpg',
      fileSize: 1024000, // 1MB
      mimeType: 'application/pdf',
      isActive: true,
      downloadCount: 0
    }
    
    const resume = await Resume.create(resumeData)
    console.log('✅ Resume created')
    return resume
  } catch (error) {
    console.error('❌ Error seeding resume:', error)
    throw error
  }
}

async function seedCredentials() {
  console.log('🔐 Seeding credentials data...')
  
  try {
    const credentialsData = {
      email: 'admin123@gmail.com',
      password: 'admin123',
      isActive: true
    }
    
    const credentials = await Credentials.create(credentialsData)
    console.log('✅ Admin credentials created')
    return credentials
  } catch (error) {
    console.error('❌ Error seeding credentials:', error)
    throw error
  }
}

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...')
    console.log('MongoDB URI:', MONGODB_URI.replace(/\/\/.*@/, '//***:***@')) // Hide credentials in logs
    
    // Connect to database
    await connectToDatabase(MONGODB_URI)
    console.log('✅ Connected to MongoDB')
    
    // Clear existing data
    await clearDatabase()
    
    // Seed all collections
    await seedProfileData()
    await seedSkills()
    await seedCertificates()
    await seedProjects()
    await seedAbout()
    await seedContact()
    await seedResume()
    await seedCredentials()
    
    console.log('\n🎉 Database seeding completed successfully!')
    console.log('\n📊 Summary:')
    console.log('   - Profile: 1 record')
    console.log('   - Skills: 10 records')
    console.log('   - Certificates: 3 records')
    console.log('   - Projects: 5 records')
    console.log('   - About: 1 record')
    console.log('   - Contact: 1 record')
    console.log('   - Resume: 1 record')
    console.log('   - Credentials: 1 record')
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error)
    process.exit(1)
  } finally {
    // Close database connection
    await mongoose.connection.close()
    console.log('🔌 Database connection closed')
    process.exit(0)
  }
}

// Run the seeding process
seedDatabase()

import { Router } from 'express'
import mongoose from 'mongoose'
import Project from '../models/Project.js'
import Message from '../models/Message.js'
import Certificate from '../models/Certificate.js'
import Resume from '../models/Resume.js'
import Contact from '../models/Contact.js'
import Skill from '../models/Skill.js'
import { profile as seedProfile, skills, certificates } from '../data/seed.js'
import About from '../models/About.js'
import Profile from '../models/Profile.js'

const router = Router()

router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Temporary seeding route (remove in production)
router.post('/seed-projects', async (req, res, next) => {
  try {
    console.log('=== SEEDING PROJECTS ===')
    
    // Clear existing projects
    await Project.deleteMany({})
    console.log('Cleared existing projects')
    
    // Sample projects with images
    const sampleProjects = [
      {
        title: 'Food Munch',
        description: 'Responsive food browsing website with product videos. Built using HTML, CSS, and Bootstrap.',
        imageUrl: 'https://via.placeholder.com/600x400/4F46E5/FFFFFF?text=Food+Munch',
        liveUrl: 'http://narsimulu79.ccbp.tech',
        githubUrl: 'https://github.com/Narsimulu-G/food-munch',
        technologies: ['HTML', 'CSS', 'Bootstrap'],
        featured: true,
        // Keep old fields for backward compatibility
        image: 'https://via.placeholder.com/600x400/4F46E5/FFFFFF?text=Food+Munch',
        tags: ['HTML', 'CSS', 'Bootstrap'],
        demoUrl: 'http://narsimulu79.ccbp.tech',
        icon: '🍕',
        category: 'Web Development'
      },
      {
        title: 'Weather App',
        description: 'Real-time weather application with location-based forecasts. Built with React and OpenWeather API.',
        imageUrl: 'https://via.placeholder.com/600x400/10B981/FFFFFF?text=Weather+App',
        liveUrl: 'https://weather-app-demo.com',
        githubUrl: 'https://github.com/Narsimulu-G/weather-app',
        technologies: ['React', 'JavaScript', 'API'],
        featured: true,
        // Keep old fields for backward compatibility
        image: 'https://via.placeholder.com/600x400/10B981/FFFFFF?text=Weather+App',
        tags: ['React', 'JavaScript', 'API'],
        demoUrl: 'https://weather-app-demo.com',
        icon: '🌤️',
        category: 'Web Development'
      },
      {
        title: 'Task Manager',
        description: 'Full-stack task management application with user authentication and real-time updates.',
        imageUrl: 'https://via.placeholder.com/600x400/F59E0B/FFFFFF?text=Task+Manager',
        liveUrl: 'https://task-manager-demo.com',
        githubUrl: 'https://github.com/Narsimulu-G/task-manager',
        technologies: ['React', 'Node.js', 'MongoDB'],
        featured: false,
        // Keep old fields for backward compatibility
        image: 'https://via.placeholder.com/600x400/F59E0B/FFFFFF?text=Task+Manager',
        tags: ['React', 'Node.js', 'MongoDB'],
        demoUrl: 'https://task-manager-demo.com',
        icon: '✅',
        category: 'Full Stack'
      },
      {
        title: 'E-commerce Store',
        description: 'Complete e-commerce solution with payment integration, inventory management, and admin dashboard.',
        imageUrl: 'https://via.placeholder.com/600x400/EF4444/FFFFFF?text=E-commerce',
        liveUrl: 'https://ecommerce-demo.com',
        githubUrl: 'https://github.com/Narsimulu-G/ecommerce-store',
        technologies: ['React', 'Express', 'Stripe', 'PostgreSQL'],
        featured: true,
        // Keep old fields for backward compatibility
        image: 'https://via.placeholder.com/600x400/EF4444/FFFFFF?text=E-commerce',
        tags: ['React', 'Express', 'Stripe', 'PostgreSQL'],
        demoUrl: 'https://ecommerce-demo.com',
        icon: '🛒',
        category: 'Full Stack'
      }
    ]
    
    // Insert sample projects
    const createdProjects = await Project.insertMany(sampleProjects)
    console.log(`Created ${createdProjects.length} projects:`)
    
    createdProjects.forEach((project, index) => {
      console.log(`${index + 1}. ${project.title}`)
      console.log(`   Image: ${project.imageUrl}`)
      console.log(`   Technologies: ${project.technologies.join(', ')}`)
      console.log(`   Featured: ${project.featured}`)
    })
    
    res.json({ 
      success: true, 
      message: `Successfully seeded ${createdProjects.length} projects`,
      projects: createdProjects
    })
  } catch (error) {
    console.error('Error seeding projects:', error)
    next(error)
  }
})

router.get('/projects', async (req, res, next) => {
  try {
    console.log('=== PUBLIC PROJECTS API ===')
    if (mongoose.connection.readyState !== 1) {
      throw new Error('Database is offline')
    }
    const projects = await Project.find().sort({ createdAt: -1 })
    console.log('Found projects in DB:', projects.length)
    console.log('Projects data:', projects)
    
    if (!projects || projects.length === 0) {
      console.log('No projects in DB, returning demo data')
      throw new Error('No projects found')
    }
    console.log('Returning projects from DB:', projects)
    res.json(projects)
  } catch (err) { 
    console.warn('Error or empty DB in public projects API, using fallback:', err.message)
    return res.json([
      {
        title: 'Food Munch',
        description: 'Responsive food browsing website with product videos. Built using HTML, CSS, and Bootstrap.',
        image: 'https://via.placeholder.com/600x400/4F46E5/FFFFFF?text=Food+Munch',
        tags: ['HTML', 'CSS', 'Bootstrap'],
        demoUrl: 'http://narsimulu79.ccbp.tech',
        githubUrl: 'https://github.com/Narsimulu-G/food-munch',
        icon: '🍕',
        category: 'Web Development'
      }
    ])
  }
})

router.post('/contact', async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'name, email and message are required' })
    }
    try {
      if (mongoose.connection.readyState !== 1) {
        throw new Error('Database is offline')
      }
      const saved = await Message.create({ name, email, subject, message })
      return res.status(201).json({ success: true, id: saved._id })
    } catch (dbErr) {
      console.warn('DB disconnected, logging contact to console:', { name, email, subject, message })
      return res.status(201).json({ success: true, id: 'offline-' + Date.now() })
    }
  } catch (err) { next(err) }
})

// Profile, Skills, Certificates endpoints
router.get('/profile', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      throw new Error('Database is offline')
    }
    const doc = await Profile.findOne().sort({ updatedAt: -1 })
    if (doc) return res.json(doc)
    return res.json(seedProfile)
  } catch (e) {
    console.warn('Error in public profile API, using seedProfile:', e.message)
    return res.json(seedProfile)
  }
})

router.get('/skills', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      throw new Error('Database is offline')
    }
    const skillsList = await Skill.find().sort({ order: 1, createdAt: -1 })
    if (!skillsList || skillsList.length === 0) {
      return res.json(skills)
    }
    res.json(skillsList)
  } catch (e) {
    console.warn('Error in public skills API, using seed skills:', e.message)
    return res.json(skills)
  }
})

router.get('/certificates', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      throw new Error('Database is offline')
    }
    const certificatesList = await Certificate.find({ isActive: true }).sort({ order: 1, createdAt: -1 })
    if (!certificatesList || certificatesList.length === 0) {
      return res.json(certificates)
    }
    res.json(certificatesList)
  } catch (e) {
    console.warn('Error in public certificates API, using seed certificates:', e.message)
    return res.json(certificates)
  }
})

// Public About endpoint
router.get('/about', async (req, res, next) => {
  const defaultAbout = { title: seedProfile.name, bio: seedProfile.bio, imageUrl: seedProfile.avatarUrl, whatIDo: [
    'Build responsive web applications using React.js and modern frameworks',
    'Develop backend APIs and services with Python and Node.js',
    'Create user-friendly interfaces with HTML, CSS, and Bootstrap',
    'Work with databases and implement CRUD operations'
  ], techStacks: ['React.js','JavaScript','HTML','CSS','Bootstrap','Node.js','Express','SQLite'] }
  try {
    if (mongoose.connection.readyState !== 1) {
      throw new Error('Database is offline')
    }
    const doc = await About.findOne().sort({ updatedAt: -1 })
    if (doc) return res.json(doc)
    return res.json(defaultAbout)
  } catch (e) {
    console.warn('Error in public about API, using defaultAbout:', e.message)
    return res.json(defaultAbout)
  }
})

// Public Resume endpoint
router.get('/resume', async (req, res, next) => {
  const defaultResume = {
    title: 'Resume',
    fileName: 'resume.pdf',
    fileUrl: '#',
    fileSize: 0,
    mimeType: 'application/pdf',
    isActive: true,
    downloadCount: 0,
    message: 'Resume not yet uploaded'
  }
  try {
    if (mongoose.connection.readyState !== 1) {
      throw new Error('Database is offline')
    }
    const resume = await Resume.findOne({ isActive: true }).sort({ createdAt: -1 })
    if (!resume) {
      return res.json(defaultResume)
    }
    res.json(resume)
  } catch (e) {
    console.warn('Error in public resume API, using defaultResume:', e.message)
    return res.json(defaultResume)
  }
})

// Public Contact endpoint
router.get('/contact', async (req, res, next) => {
  const defaultContact = {
    title: "Get In Touch",
    subtitle: "Let's work together",
    description: "I'm always interested in new opportunities and exciting projects. Feel free to reach out!",
    email: "contact@example.com",
    phone: "+1 (555) 123-4567",
    address: "Your City, Country",
    socialLinks: {
      linkedin: "https://linkedin.com/in/yourprofile",
      github: "https://github.com/yourusername",
      twitter: "https://twitter.com/yourusername",
      instagram: "",
      facebook: ""
    }
  }
  try {
    if (mongoose.connection.readyState !== 1) {
      throw new Error('Database is offline')
    }
    const contact = await Contact.findOne({ isActive: true }).sort({ createdAt: -1 })
    if (!contact) {
      return res.json(defaultContact)
    }
    res.json(contact)
  } catch (e) {
    console.warn('Error in public contact API, using defaultContact:', e.message)
    return res.json(defaultContact)
  }
})

// Public Messages endpoint
router.post('/messages', async (req, res, next) => {
  try {
    const { name, email, message } = req.body
    
    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' })
    }
    
    try {
      if (mongoose.connection.readyState !== 1) {
        throw new Error('Database is offline')
      }
      // Create new message
      const newMessage = await Message.create({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        isRead: false
      })
      
      res.status(201).json({ 
        success: true, 
        message: 'Message sent successfully',
        id: newMessage._id 
      })
    } catch (dbErr) {
      console.warn('DB disconnected, logging message to console:', { name, email, message })
      res.status(201).json({
        success: true,
        message: 'Message logged successfully (offline fallback)',
        id: 'offline-' + Date.now()
      })
    }
  } catch (e) { next(e) }
})

export default router


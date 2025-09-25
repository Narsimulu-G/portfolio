import { Router } from 'express'
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
    const projects = await Project.find().sort({ createdAt: -1 })
    console.log('Found projects in DB:', projects.length)
    console.log('Projects data:', projects)
    
    if (!projects || projects.length === 0) {
      console.log('No projects in DB, returning demo data')
      // Fallback to demoProjects-like data if DB empty
      return res.json([
        {
          title: 'Food Munch',
          description: 'Responsive food browsing website with product videos. Built using HTML, CSS, and Bootstrap.',
          image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?q=80&w=1200&auto=format&fit=crop',
          tags: ['HTML', 'CSS', 'Bootstrap'],
          demoUrl: 'http://narsimulu79.ccbp.tech',
          githubUrl: 'https://github.com/yourusername/food-munch',
          icon: '🍕',
          category: 'Web Development'
        }
      ])
    }
    console.log('Returning projects from DB:', projects)
    res.json(projects)
  } catch (err) { 
    console.error('Error in public projects API:', err)
    next(err) 
  }
})

router.post('/contact', async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'name, email and message are required' })
    }
    const saved = await Message.create({ name, email, subject, message })
    res.status(201).json({ success: true, id: saved._id })
  } catch (err) { next(err) }
})

// Profile, Skills, Certificates endpoints
router.get('/profile', async (req, res, next) => {
  try {
    const doc = await Profile.findOne().sort({ updatedAt: -1 })
    if (doc) return res.json(doc)
    return res.json(seedProfile)
  } catch (e) { next(e) }
})

router.get('/skills', async (req, res, next) => {
  try {
    const skillsList = await Skill.find().sort({ order: 1, createdAt: -1 })
    if (!skillsList || skillsList.length === 0) {
      // Fallback to seed data if no skills in database
      return res.json(skills)
    }
    res.json(skillsList)
  } catch (e) { next(e) }
})

router.get('/certificates', async (req, res, next) => {
  try {
    const certificatesList = await Certificate.find({ isActive: true }).sort({ order: 1, createdAt: -1 })
    if (!certificatesList || certificatesList.length === 0) {
      // Fallback to seed data if no certificates in database
      return res.json(certificates)
    }
    res.json(certificatesList)
  } catch (e) { next(e) }
})

// Public About endpoint
router.get('/about', async (req, res, next) => {
  try {
    const doc = await About.findOne().sort({ updatedAt: -1 })
    if (doc) return res.json(doc)
    // fallback from profile seed
    return res.json({ title: seedProfile.name, bio: seedProfile.bio, imageUrl: seedProfile.avatarUrl, whatIDo: [
      'Build responsive web applications using React.js and modern frameworks',
      'Develop backend APIs and services with Python and Node.js',
      'Create user-friendly interfaces with HTML, CSS, and Bootstrap',
      'Work with databases and implement CRUD operations'
    ], techStacks: ['React.js','JavaScript','HTML','CSS','Bootstrap','Node.js','Express','SQLite'] })
  } catch (e) { next(e) }
})

// Public Resume endpoint
router.get('/resume', async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ isActive: true }).sort({ createdAt: -1 })
    if (!resume) {
      return res.status(404).json({ error: 'No resume available' })
    }
    res.json(resume)
  } catch (e) { next(e) }
})

// Public Contact endpoint
router.get('/contact', async (req, res, next) => {
  try {
    const contact = await Contact.findOne({ isActive: true }).sort({ createdAt: -1 })
    if (!contact) {
      // Fallback to default contact data
      return res.json({
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
      })
    }
    res.json(contact)
  } catch (e) { next(e) }
})

// Public Messages endpoint
router.post('/messages', async (req, res, next) => {
  try {
    const { name, email, message } = req.body
    
    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' })
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
  } catch (e) { next(e) }
})

export default router


import { Router } from 'express'
import mongoose from 'mongoose'
import { requireAuth } from '../middleware/auth.js'
import Message from '../models/Message.js'
import Project from '../models/Project.js'
import Profile from '../models/Profile.js'
import About from '../models/About.js'
import Certificate from '../models/Certificate.js'
import Resume from '../models/Resume.js'
import Contact from '../models/Contact.js'
import Skill from '../models/Skill.js'
import { profile as seedProfile, skills, certificates } from '../data/seed.js'

const router = Router()

// Handle CORS preflight requests for admin routes
router.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  res.header('Access-Control-Allow-Credentials', 'true')
  res.status(200).end()
})

router.use(requireAuth)

// Check DB connection for all data-modifying requests
router.use((req, res, next) => {
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database is offline. Saving changes is disabled in offline mode.' })
    }
  }
  next()
})

router.get('/summary', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      throw new Error('Database is offline')
    }
    const [messagesCount, projectsCount, certificatesCount, resumesCount, contactsCount, skillsCount] = await Promise.all([
      Message.countDocuments(),
      Project.countDocuments(),
      Certificate.countDocuments(),
      Resume.countDocuments(),
      Contact.countDocuments(),
      Skill.countDocuments()
    ])
    res.json({ messagesCount, projectsCount, certificatesCount, resumesCount, contactsCount, skillsCount })
  } catch (e) {
    console.warn('Error in admin summary API, using offline summary:', e.message)
    res.json({
      messagesCount: 0,
      projectsCount: 1,
      certificatesCount: certificates.length,
      resumesCount: 1,
      contactsCount: 1,
      skillsCount: skills.length
    })
  }
})

router.get('/messages', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      throw new Error('Database is offline')
    }
    const list = await Message.find().sort({ createdAt: -1 })
    res.json(list)
  } catch (e) {
    console.warn('Error in admin messages API, returning empty list:', e.message)
    res.json([])
  }
})

router.put('/messages/:id', async (req, res, next) => {
  try {
    const updated = await Message.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!updated) return res.status(404).json({ error: 'Message not found' })
    res.json(updated)
  } catch (e) { next(e) }
})

router.delete('/messages/:id', async (req, res, next) => {
  try {
    const deleted = await Message.findByIdAndDelete(req.params.id)
    if (!deleted) return res.status(404).json({ error: 'Message not found' })
    res.json({ success: true })
  } catch (e) { next(e) }
})

router.get('/projects', async (req, res, next) => {
  const fallbackProjects = [
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
  ]
  try {
    console.log('=== ADMIN PROJECTS API ===')
    if (mongoose.connection.readyState !== 1) {
      throw new Error('Database is offline')
    }
    const list = await Project.find().sort({ createdAt: -1 })
    console.log('Found projects in DB (admin):', list.length)
    if (!list || list.length === 0) {
      console.log('No projects in DB (admin), returning demo data')
      return res.json(fallbackProjects)
    }
    res.json(list)
  } catch (e) {
    console.warn('Error in admin projects API, using fallback:', e.message)
    res.json(fallbackProjects)
  }
})

router.post('/projects', async (req, res, next) => {
  try {
    const created = await Project.create(req.body)
    res.status(201).json(created)
  } catch (e) { next(e) }
})

router.put('/projects/:id', async (req, res, next) => {
  try {
    const updated = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!updated) return res.status(404).json({ error: 'Not found' })
    res.json(updated)
  } catch (e) { next(e) }
})

router.delete('/projects/:id', async (req, res, next) => {
  try {
    const deleted = await Project.findByIdAndDelete(req.params.id)
    if (!deleted) return res.status(404).json({ error: 'Not found' })
    res.json({ success: true })
  } catch (e) { next(e) }
})

// Profile (Hero) admin CRUD
router.get('/profile', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      throw new Error('Database is offline')
    }
    const doc = await Profile.findOne().sort({ updatedAt: -1 })
    if (doc) return res.json(doc)
    return res.json(seedProfile)
  } catch (e) {
    console.warn('Error in admin profile API, using seedProfile:', e.message)
    return res.json(seedProfile)
  }
})

router.post('/profile', async (req, res, next) => {
  try {
    const created = await Profile.create(req.body)
    res.status(201).json(created)
  } catch (e) { next(e) }
})

router.put('/profile', async (req, res, next) => {
  try {
    const existing = await Profile.findOne().sort({ updatedAt: -1 })
    if (!existing) {
      const created = await Profile.create(req.body)
      return res.status(201).json(created)
    }
    const updated = await Profile.findByIdAndUpdate(existing._id, req.body, { new: true })
    res.json(updated)
  } catch (e) { next(e) }
})

// About admin CRUD
router.get('/about', async (req, res, next) => {
  const fallbackData = { 
    title: seedProfile.name, 
    bio: seedProfile.bio || seedProfile.headline || '', 
    imageUrl: seedProfile.avatarUrl || '', 
    whatIDo: [
      'Build responsive web applications using React.js and modern frameworks',
      'Develop backend APIs and services with Python and Node.js',
      'Create user-friendly interfaces with HTML, CSS, and Bootstrap',
      'Work with databases and implement CRUD operations'
    ], 
    techStacks: ['React.js','JavaScript','HTML','CSS','Bootstrap','Node.js','Express','SQLite'] 
  }
  try {
    if (mongoose.connection.readyState !== 1) {
      throw new Error('Database is offline')
    }
    const doc = await About.findOne().sort({ updatedAt: -1 })
    if (doc) return res.json(doc)
    return res.json(fallbackData)
  } catch (e) {
    console.warn('Error in admin about API, using fallbackData:', e.message)
    return res.json(fallbackData)
  }
})

router.post('/about', async (req, res, next) => {
  try {
    const created = await About.create(req.body)
    res.status(201).json(created)
  } catch (e) { next(e) }
})

router.put('/about', async (req, res, next) => {
  try {
    const existing = await About.findOne().sort({ updatedAt: -1 })
    if (!existing) {
      const created = await About.create(req.body)
      return res.status(201).json(created)
    }
    const updated = await About.findByIdAndUpdate(existing._id, req.body, { new: true })
    res.json(updated)
  } catch (e) { next(e) }
})

// Certificate admin CRUD
router.get('/certificates', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      throw new Error('Database is offline')
    }
    const list = await Certificate.find().sort({ order: 1, createdAt: -1 })
    res.json(list)
  } catch (e) {
    console.warn('Error in admin certificates API, using seed certificates:', e.message)
    res.json(certificates)
  }
})

router.post('/certificates', async (req, res, next) => {
  try {
    const created = await Certificate.create(req.body)
    res.status(201).json(created)
  } catch (e) { next(e) }
})

router.put('/certificates/:id', async (req, res, next) => {
  try {
    const updated = await Certificate.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!updated) return res.status(404).json({ error: 'Certificate not found' })
    res.json(updated)
  } catch (e) { next(e) }
})

router.delete('/certificates/:id', async (req, res, next) => {
  try {
    const deleted = await Certificate.findByIdAndDelete(req.params.id)
    if (!deleted) return res.status(404).json({ error: 'Certificate not found' })
    res.json({ success: true })
  } catch (e) { next(e) }
})

// Resume admin CRUD
router.get('/resumes', async (req, res, next) => {
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
    const list = await Resume.find().sort({ createdAt: -1 })
    res.json(list)
  } catch (e) {
    console.warn('Error in admin resumes API, using defaultResume:', e.message)
    res.json([defaultResume])
  }
})

router.post('/resumes', async (req, res, next) => {
  try {
    const created = await Resume.create(req.body)
    res.status(201).json(created)
  } catch (e) { next(e) }
})

router.put('/resumes/:id', async (req, res, next) => {
  try {
    const updated = await Resume.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!updated) return res.status(404).json({ error: 'Resume not found' })
    res.json(updated)
  } catch (e) { next(e) }
})

router.delete('/resumes/:id', async (req, res, next) => {
  try {
    const deleted = await Resume.findByIdAndDelete(req.params.id)
    if (!deleted) return res.status(404).json({ error: 'Resume not found' })
    res.json({ success: true })
  } catch (e) { next(e) }
})

// Contact admin CRUD
router.get('/contacts', async (req, res, next) => {
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
    const list = await Contact.find().sort({ createdAt: -1 })
    res.json(list)
  } catch (e) {
    console.warn('Error in admin contacts API, using defaultContact:', e.message)
    res.json([defaultContact])
  }
})

router.post('/contacts', async (req, res, next) => {
  try {
    const created = await Contact.create(req.body)
    res.status(201).json(created)
  } catch (e) { next(e) }
})

router.put('/contacts/:id', async (req, res, next) => {
  try {
    const updated = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!updated) return res.status(404).json({ error: 'Contact not found' })
    res.json(updated)
  } catch (e) { next(e) }
})

router.delete('/contacts/:id', async (req, res, next) => {
  try {
    const deleted = await Contact.findByIdAndDelete(req.params.id)
    if (!deleted) return res.status(404).json({ error: 'Contact not found' })
    res.json({ success: true })
  } catch (e) { next(e) }
})

// Skills admin CRUD
router.get('/skills', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      throw new Error('Database is offline')
    }
    const list = await Skill.find().sort({ order: 1, createdAt: -1 })
    res.json(list)
  } catch (e) {
    console.warn('Error in admin skills API, using seed skills:', e.message)
    res.json(skills)
  }
})

router.post('/skills', async (req, res, next) => {
  try {
    const created = await Skill.create(req.body)
    res.status(201).json(created)
  } catch (e) { next(e) }
})

router.put('/skills/:id', async (req, res, next) => {
  try {
    const updated = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!updated) return res.status(404).json({ error: 'Skill not found' })
    res.json(updated)
  } catch (e) { next(e) }
})

router.delete('/skills/:id', async (req, res, next) => {
  try {
    const deleted = await Skill.findByIdAndDelete(req.params.id)
    if (!deleted) return res.status(404).json({ error: 'Skill not found' })
    res.json({ success: true })
  } catch (e) { next(e) }
})

router.put('/skills/:id/reorder', async (req, res, next) => {
  try {
    const { targetOrder } = req.body
    const updated = await Skill.findByIdAndUpdate(req.params.id, { order: targetOrder }, { new: true })
    if (!updated) return res.status(404).json({ error: 'Skill not found' })
    res.json(updated)
  } catch (e) { next(e) }
})

export default router

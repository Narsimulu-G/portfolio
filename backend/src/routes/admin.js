import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import Message from '../models/Message.js'
import Project from '../models/Project.js'
import Profile from '../models/Profile.js'
import About from '../models/About.js'
import Certificate from '../models/Certificate.js'
import Resume from '../models/Resume.js'
import Contact from '../models/Contact.js'
import Skill from '../models/Skill.js'
import { profile as seedProfile } from '../data/seed.js'

const router = Router()

router.use(requireAuth)

router.get('/summary', async (req, res, next) => {
  try {
    const [messagesCount, projectsCount, certificatesCount, resumesCount, contactsCount, skillsCount] = await Promise.all([
      Message.countDocuments(),
      Project.countDocuments(),
      Certificate.countDocuments(),
      Resume.countDocuments(),
      Contact.countDocuments(),
      Skill.countDocuments()
    ])
    res.json({ messagesCount, projectsCount, certificatesCount, resumesCount, contactsCount, skillsCount })
  } catch (e) { next(e) }
})

router.get('/messages', async (req, res, next) => {
  try {
    const list = await Message.find().sort({ createdAt: -1 })
    res.json(list)
  } catch (e) { next(e) }
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
  try {
    console.log('=== ADMIN PROJECTS API ===')
    const list = await Project.find().sort({ createdAt: -1 })
    console.log('Found projects in DB (admin):', list.length)
    console.log('Projects data (admin):', list)
    
    if (!list || list.length === 0) {
      console.log('No projects in DB (admin), returning demo data')
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
    console.log('Returning projects from DB (admin):', list)
    res.json(list)
  } catch (e) { 
    console.error('Error in admin projects API:', e)
    next(e) 
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

export default router

// Profile (Hero) admin CRUD (upsert single record)
router.get('/profile', async (req, res, next) => {
  try {
    const doc = await Profile.findOne().sort({ updatedAt: -1 })
    if (doc) return res.json(doc)
    // Fallback to seed profile for admin UI defaults
    return res.json(seedProfile)
  } catch (e) { next(e) }
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

// About admin CRUD (separate from profile/hero)
router.get('/about', async (req, res, next) => {
  try {
    const doc = await About.findOne().sort({ updatedAt: -1 })
    if (doc) return res.json(doc)
    // Fallback from seed profile mapping with defaults for lists
    return res.json({ title: seedProfile.name, bio: seedProfile.bio || seedProfile.headline || '', imageUrl: seedProfile.avatarUrl || '', whatIDo: [
      'Build responsive web applications using React.js and modern frameworks',
      'Develop backend APIs and services with Python and Node.js',
      'Create user-friendly interfaces with HTML, CSS, and Bootstrap',
      'Work with databases and implement CRUD operations'
    ], techStacks: ['React.js','JavaScript','HTML','CSS','Bootstrap','Node.js','Express','SQLite'] })
  } catch (e) { next(e) }
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
    const list = await Certificate.find().sort({ order: 1, createdAt: -1 })
    res.json(list)
  } catch (e) { next(e) }
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
  try {
    const list = await Resume.find().sort({ createdAt: -1 })
    res.json(list)
  } catch (e) { next(e) }
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
  try {
    const list = await Contact.find().sort({ createdAt: -1 })
    res.json(list)
  } catch (e) { next(e) }
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
    const list = await Skill.find().sort({ order: 1, createdAt: -1 })
    res.json(list)
  } catch (e) { next(e) }
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

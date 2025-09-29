import { Router } from 'express'
import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import path from 'path'
import fs from 'fs'

const router = Router()

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dovmtmu7y',
  api_key: process.env.CLOUDINARY_API_KEY || 'your_api_key',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'your_api_secret'
})

// Create uploads directory if it doesn't exist (fallback)
const uploadsDir = path.join(process.cwd(), 'uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Configure multer for Cloudinary uploads
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'portfolio-uploads',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 1200, height: 800, crop: 'limit' }]
  }
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check if file is an image
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed!'), false)
    }
  }
})

// Upload endpoint
router.post('/', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    // Cloudinary returns the secure URL directly
    const fileUrl = req.file.path
    const filename = req.file.filename
    const originalName = req.file.originalname
    const size = req.file.size
    
    console.log('File uploaded successfully to Cloudinary:', {
      filename: filename,
      originalName: originalName,
      size: size,
      url: fileUrl,
      cloudinaryId: req.file.public_id
    })
    
    res.json({ 
      success: true, 
      url: fileUrl,
      relativeUrl: fileUrl, // Cloudinary URLs are already full URLs
      filename: filename,
      originalName: originalName,
      size: size,
      cloudinaryId: req.file.public_id
    })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ error: 'Failed to upload file' })
  }
})

// Serve uploaded files (fallback for local files)
router.get('/:filename', (req, res) => {
  const filename = req.params.filename
  const filePath = path.join(uploadsDir, filename)
  
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' })
  }
  
  // Set appropriate headers
  res.setHeader('Content-Type', 'image/jpeg') // Default to JPEG, could be improved
  res.sendFile(filePath)
})

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    cloudinary: cloudinary.config().cloud_name ? 'configured' : 'not configured',
    uploads: fs.existsSync(uploadsDir) ? 'available' : 'not available'
  })
})

export default router

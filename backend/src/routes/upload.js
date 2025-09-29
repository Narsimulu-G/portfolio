import { Router } from 'express'
import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import path from 'path'
import fs from 'fs'

const router = Router()

// Test route
router.get('/', (req, res) => {
  res.json({ 
    message: 'Upload service is running',
    cloudinary: cloudinary.config().cloud_name ? 'configured' : 'not configured'
  })
})

// Test POST route
router.post('/test', (req, res) => {
  res.json({ 
    message: 'POST test successful',
    method: req.method,
    body: req.body
  })
})

// Debug all requests
router.use((req, res, next) => {
  console.log(`Upload router: ${req.method} ${req.path}`)
  console.log('Headers:', req.headers)
  next()
})

// Configure Cloudinary
try {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dovmtmu7y',
    api_key: process.env.CLOUDINARY_API_KEY || 'your_api_key',
    api_secret: process.env.CLOUDINARY_API_SECRET || 'your_api_secret'
  })
  console.log('Cloudinary configured successfully')
} catch (error) {
  console.error('Cloudinary configuration error:', error)
}

// Create uploads directory if it doesn't exist (fallback)
const uploadsDir = path.join(process.cwd(), 'uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Configure multer storage (Cloudinary or local fallback)
let storage

try {
  // Try Cloudinary first
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'portfolio-uploads',
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      transformation: [{ width: 1200, height: 800, crop: 'limit' }]
    }
  })
  console.log('Using Cloudinary storage')
} catch (error) {
  console.error('Cloudinary storage failed, using local storage:', error)
  // Fallback to local storage
  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadsDir)
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
  })
  console.log('Using local storage fallback')
}

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
    console.log('Upload endpoint called')
    console.log('Request method:', req.method)
    console.log('Request headers:', req.headers)
    console.log('Request body:', req.body)
    console.log('Request file:', req.file)
    
    if (!req.file) {
      console.log('No file uploaded')
      return res.status(400).json({ error: 'No file uploaded' })
    }

    // Handle both Cloudinary and local storage
    const fileUrl = req.file.path
    const filename = req.file.filename
    const originalName = req.file.originalname
    const size = req.file.size
    
    // Check if it's a Cloudinary upload (has public_id) or local upload
    const isCloudinary = req.file.public_id
    
    if (isCloudinary) {
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
    } else {
      // Local storage upload
      const baseUrl = process.env.API_BASE_URL || (process.env.NODE_ENV === 'production' 
        ? 'https://portfolio-j9s6.onrender.com' 
        : `http://localhost:${process.env.PORT || 4000}`)
      const fullUrl = `${baseUrl}/uploads/${filename}`
      
      console.log('File uploaded successfully to local storage:', {
        filename: filename,
        originalName: originalName,
        size: size,
        url: fullUrl
      })
      
      res.json({ 
        success: true, 
        url: fullUrl,
        relativeUrl: `/uploads/${filename}`,
        filename: filename,
        originalName: originalName,
        size: size
      })
    }
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

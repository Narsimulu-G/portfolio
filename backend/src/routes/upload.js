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

// Simple POST route without multer
router.post('/simple', (req, res) => {
  res.json({ 
    message: 'Simple POST successful',
    method: req.method,
    headers: req.headers
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
    api_secret: process.env.CLOUDINARY_API_SECRET || 'your_api_secret',
    secure: true, // Use HTTPS
    cdn_subdomain: true // Use CDN subdomain for better performance
  })
  console.log('Cloudinary configured successfully')
  console.log('Cloud name:', process.env.CLOUDINARY_CLOUD_NAME || 'dovmtmu7y')
} catch (error) {
  console.error('Cloudinary configuration error:', error)
}

// Note: Local uploads directory removed - using Cloudinary for all image storage

// Configure multer storage (Cloudinary only)
let storage

// Check if Cloudinary is properly configured
const isCloudinaryConfigured = process.env.CLOUDINARY_CLOUD_NAME && 
                               process.env.CLOUDINARY_API_KEY && 
                               process.env.CLOUDINARY_API_SECRET

if (isCloudinaryConfigured) {
  try {
    // Use Cloudinary with optimized settings
    storage = new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: 'portfolio-uploads',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
        transformation: [
          { width: 1200, height: 800, crop: 'limit', quality: 'auto:good' },
          { fetch_format: 'auto' } // Auto-optimize format (WebP when supported)
        ],
        resource_type: 'auto', // Auto-detect resource type
        use_filename: true, // Use original filename
        unique_filename: true, // Add unique suffix if filename exists
        overwrite: false // Don't overwrite existing files
      }
    })
    console.log('Using Cloudinary storage with optimizations')
  } catch (error) {
    console.error('Cloudinary storage configuration failed:', error)
    throw new Error('Cloudinary configuration failed. Please check your environment variables.')
  }
} else {
  console.error('Cloudinary not configured! Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET environment variables.')
  throw new Error('Cloudinary is required but not configured. Please set the required environment variables.')
}

let upload

try {
  upload = multer({
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
  console.log('Multer configured successfully')
} catch (error) {
  console.error('Multer configuration error:', error)
  // Create a basic multer instance as fallback
  upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024
    }
  })
  console.log('Using fallback multer configuration')
}

// Utility function to get transformation based on upload type
const getTransformationForType = (uploadType = 'general') => {
  const transformations = {
    avatar: [
      { width: 300, height: 300, crop: 'fill', gravity: 'face', quality: 'auto:good' },
      { fetch_format: 'auto' }
    ],
    project: [
      { width: 1200, height: 800, crop: 'limit', quality: 'auto:good' },
      { fetch_format: 'auto' }
    ],
    about: [
      { width: 600, height: 600, crop: 'limit', quality: 'auto:good' },
      { fetch_format: 'auto' }
    ],
    general: [
      { width: 1200, height: 800, crop: 'limit', quality: 'auto:good' },
      { fetch_format: 'auto' }
    ]
  }
  return transformations[uploadType] || transformations.general
}

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

    // Handle Cloudinary upload only
    const fileUrl = req.file.path
    const filename = req.file.filename
    const originalName = req.file.originalname
    const size = req.file.size
    
    // All uploads are now Cloudinary uploads
    console.log('File uploaded successfully to Cloudinary:', {
      filename: filename,
      originalName: originalName,
      size: size,
      url: fileUrl,
      cloudinaryId: req.file.public_id,
      format: req.file.format,
      width: req.file.width,
      height: req.file.height
    })
    
    res.json({ 
      success: true, 
      url: fileUrl,
      relativeUrl: fileUrl, // Cloudinary URLs are already full URLs
      filename: filename,
      originalName: originalName,
      size: size,
      cloudinaryId: req.file.public_id,
      format: req.file.format,
      width: req.file.width,
      height: req.file.height,
      provider: 'cloudinary'
    })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ error: 'Failed to upload file' })
  }
})

// Note: Local file serving removed - all files are served via Cloudinary CDN

// Upload with specific type endpoint
router.post('/:type', upload.single('file'), (req, res) => {
  try {
    console.log(`Upload endpoint called for type: ${req.params.type}`)
    console.log('Request method:', req.method)
    console.log('Request headers:', req.headers)
    console.log('Request body:', req.body)
    console.log('Request file:', req.file)
    
    if (!req.file) {
      console.log('No file uploaded')
      return res.status(400).json({ error: 'No file uploaded' })
    }

    // Handle Cloudinary upload only
    const fileUrl = req.file.path
    const filename = req.file.filename
    const originalName = req.file.originalname
    const size = req.file.size
    const uploadType = req.params.type || 'general'
    
    // All uploads are now Cloudinary uploads
    console.log(`File uploaded successfully to Cloudinary (${uploadType}):`, {
      filename: filename,
      originalName: originalName,
      size: size,
      url: fileUrl,
      cloudinaryId: req.file.public_id,
      format: req.file.format,
      width: req.file.width,
      height: req.file.height,
      uploadType: uploadType
    })
    
    res.json({ 
      success: true, 
      url: fileUrl,
      relativeUrl: fileUrl, // Cloudinary URLs are already full URLs
      filename: filename,
      originalName: originalName,
      size: size,
      cloudinaryId: req.file.public_id,
      format: req.file.format,
      width: req.file.width,
      height: req.file.height,
      provider: 'cloudinary',
      uploadType: uploadType
    })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ error: 'Failed to upload file' })
  }
})

// Health check endpoint
router.get('/health', async (req, res) => {
  try {
    const cloudinaryStatus = cloudinary.config().cloud_name ? 'configured' : 'not configured'
    let cloudinaryTest = 'not tested'
    
    // Test Cloudinary connectivity if configured
    if (cloudinaryStatus === 'configured') {
      try {
        await cloudinary.api.ping()
        cloudinaryTest = 'connected'
      } catch (error) {
        cloudinaryTest = 'connection failed'
        console.error('Cloudinary ping failed:', error.message)
      }
    }
    
    res.json({ 
      status: 'ok', 
      cloudinary: cloudinaryStatus,
      cloudinaryTest: cloudinaryTest,
      storage: 'cloudinary-only',
      localUploads: 'disabled',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      error: error.message,
      cloudinary: 'error',
      storage: 'cloudinary-only',
      localUploads: 'disabled'
    })
  }
})

export default router

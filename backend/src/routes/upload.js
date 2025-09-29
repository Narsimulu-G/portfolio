import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'

const router = Router()

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
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

    // Return the file URL - use full URL for better compatibility
    let baseUrl = process.env.API_BASE_URL || `http://localhost:${process.env.PORT || 4000}`
    
    // In production, use the Render URL if API_BASE_URL is not set
    if (process.env.NODE_ENV === 'production' && !process.env.API_BASE_URL) {
      baseUrl = 'https://portfolio-j9s6.onrender.com'
    }
    
    const fileUrl = `${baseUrl}/uploads/${req.file.filename}`
    
    // Also return relative URL for frontend compatibility
    const relativeUrl = `/uploads/${req.file.filename}`
    
    console.log('File uploaded successfully:', {
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      url: fileUrl
    })
    
    res.json({ 
      success: true, 
      url: fileUrl,
      relativeUrl: relativeUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size
    })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ error: 'Failed to upload file' })
  }
})

// Serve uploaded files
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

export default router

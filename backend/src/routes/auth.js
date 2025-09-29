import { Router } from 'express'
import jwt from 'jsonwebtoken'
import ms from 'ms'
import Credentials from '../models/Credentials.js'
import { initCredentials } from '../data/init-credentials.js'

const router = Router()

// Initialize credentials on startup
let fallbackCredentials = {
  email: 'admin123@gmail.com',
  password: 'admin123'
}

initCredentials().then(creds => {
  if (creds) {
    fallbackCredentials = creds
    console.log('Credentials initialized:', creds.email)
  }
}).catch(err => {
  console.log('Using fallback credentials due to database error')
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    // Try to get credentials from database, fallback to in-memory
    let credentials = fallbackCredentials
    
    try {
      const dbCredentials = await Credentials.findOne({ isActive: true })
      if (dbCredentials) {
        credentials = dbCredentials
      }
    } catch (error) {
      console.log('Using fallback credentials due to database error')
    }

    // Check credentials
    if (email !== credentials.email || password !== credentials.password) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Generate JWT token
    const token = jwt.sign(
      { sub: 'admin', email: credentials.email },
      process.env.JWT_SECRET || 'dev_secret',
      { expiresIn: '2h' }
    )
    
    const isProd = process.env.NODE_ENV === 'production'
    const isCrossOrigin = req.headers.origin && !req.headers.origin.includes('localhost')
    const isHttps = req.secure || req.headers['x-forwarded-proto'] === 'https'
    
    console.log('Setting cookie for production:', isProd)
    console.log('NODE_ENV:', process.env.NODE_ENV)
    console.log('Request origin:', req.headers.origin)
    console.log('Is cross-origin:', isCrossOrigin)
    console.log('Is HTTPS:', isHttps)
    
    // For cross-origin requests, always use SameSite=None and Secure=true
    const cookieOptions = {
      httpOnly: true,
      maxAge: 2 * 60 * 60 * 1000, // 2 hours
      path: '/'
    }
    
    if (isCrossOrigin || isProd) {
      cookieOptions.sameSite = 'none'
      cookieOptions.secure = true
    } else {
      cookieOptions.sameSite = 'lax'
      cookieOptions.secure = false
    }
    
    console.log('Cookie options:', cookieOptions)
    res.cookie('token', token, cookieOptions)
    
    console.log('Cookie set successfully')
    
    res.json({ success: true })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.post('/logout', (req, res) => {
  const isProd = process.env.NODE_ENV === 'production'
  const isCrossOrigin = req.headers.origin && !req.headers.origin.includes('localhost')
  
  const cookieOptions = {
    httpOnly: true,
    path: '/'
  }
  
  if (isCrossOrigin || isProd) {
    cookieOptions.sameSite = 'none'
    cookieOptions.secure = true
  } else {
    cookieOptions.sameSite = 'lax'
    cookieOptions.secure = false
  }
  
  res.clearCookie('token', cookieOptions)
  res.json({ success: true })
})

router.get('/me', (req, res) => {
  try {
    console.log('Auth /me endpoint called')
    console.log('Request origin:', req.headers.origin)
    console.log('Request cookies:', req.cookies)
    console.log('Request headers:', req.headers)
    console.log('Cookie header:', req.headers.cookie)
    
    const token = req.cookies?.token
    console.log('Token from cookies:', token ? 'Present' : 'Missing')
    
    if (!token) {
      console.log('No token found, returning 401')
      console.log('Available cookies:', Object.keys(req.cookies || {}))
      return res.status(401).json({ error: 'Unauthorized' })
    }
    
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret')
    console.log('Token verified successfully for user:', payload.email)
    res.json({ user: { sub: payload.sub, email: payload.email } })
  } catch (e) {
    console.error('Auth check error:', e.message)
    console.error('Error details:', e)
    // For development, allow requests without proper auth
    if (process.env.NODE_ENV !== 'production') {
      console.log('Development mode: allowing request without auth')
      return res.json({ user: { sub: 'dev', email: 'dev@localhost' } })
    }
    return res.status(401).json({ error: 'Unauthorized' })
  }
})

router.put('/update-credentials', async (req, res) => {
  try {
    const { newEmail, newPassword, currentPassword } = req.body
    
    // Validate required fields
    if (!currentPassword) {
      return res.status(400).json({ error: 'Current password is required' })
    }
    
    if (!newPassword) {
      return res.status(400).json({ error: 'New password is required' })
    }
    
    // Validate password strength
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long' })
    }
    
    // Validate email format if provided
    if (newEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      return res.status(400).json({ error: 'Invalid email format' })
    }
    
    // Get current credentials (try database first, fallback to in-memory)
    let currentCredentials = fallbackCredentials
    
    try {
      const dbCredentials = await Credentials.findOne({ isActive: true })
      if (dbCredentials) {
        currentCredentials = dbCredentials
      }
    } catch (error) {
      console.log('Using fallback credentials for verification')
    }
    
    // Verify current password
    if (currentPassword !== currentCredentials.password) {
      return res.status(401).json({ error: 'Current password is incorrect' })
    }
    
    // Check if new email is different from current
    const emailToUpdate = newEmail || currentCredentials.email
    const passwordToUpdate = newPassword
    
    // Try to update credentials in database
    try {
      const updatedCredentials = await Credentials.findOneAndUpdate(
        { isActive: true },
        { 
          email: emailToUpdate,
          password: passwordToUpdate,
          updatedAt: new Date()
        },
        { new: true, upsert: true }
      )
      
      if (updatedCredentials) {
        console.log('Credentials updated in database:', updatedCredentials.email)
      }
    } catch (error) {
      console.log('Failed to update database, updating in-memory fallback')
    }
    
    // Update fallback credentials
    fallbackCredentials = {
      email: emailToUpdate,
      password: passwordToUpdate
    }
    
    console.log('Credentials updated successfully:', {
      email: emailToUpdate,
      timestamp: new Date().toISOString()
    })
    
    res.json({ 
      success: true, 
      message: 'Credentials updated successfully. You will need to log in again with your new credentials.' 
    })
  } catch (error) {
    console.error('Error updating credentials:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

export default router


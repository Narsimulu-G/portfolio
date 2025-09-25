import mongoose from 'mongoose'
import Credentials from '../models/Credentials.js'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/portfolio'

async function initCredentials() {
  try {
    // Check if already connected
    if (mongoose.connection.readyState === 1) {
      console.log('Database already connected, checking credentials...')
    } else {
      await mongoose.connect(MONGODB_URI)
      console.log('Connected to database')
    }

    // Check if credentials already exist
    const existingCredentials = await Credentials.findOne({ isActive: true })
    
    if (existingCredentials) {
      console.log('Credentials already exist:', existingCredentials.email)
      return existingCredentials
    }

    // Create default credentials
    const defaultCredentials = await Credentials.create({
      email: 'admin123@gmail.com',
      password: 'admin123',
      isActive: true
    })

    console.log('Default credentials created:', defaultCredentials.email)
    return defaultCredentials

  } catch (error) {
    console.error('Error initializing credentials:', error)
    // Return default credentials for fallback
    return {
      email: 'admin123@gmail.com',
      password: 'admin123',
      isActive: true
    }
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  initCredentials()
}

export { initCredentials }
export default initCredentials

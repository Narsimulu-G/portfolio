import mongoose from 'mongoose'

export async function connectToDatabase(mongoUri) {
  if (!mongoUri) throw new Error('Missing MONGODB_URI')
  
  // Check if already connected
  if (mongoose.connection.readyState === 1) {
    console.log('[DB] Already connected to MongoDB')
    return mongoose.connection
  }
  
  // Check if connection is in progress
  if (mongoose.connection.readyState === 2) {
    console.log('[DB] Connection already in progress, waiting...')
    return new Promise((resolve, reject) => {
      mongoose.connection.once('connected', () => {
        console.log('[DB] Connected successfully to MongoDB')
        resolve(mongoose.connection)
      })
      mongoose.connection.once('error', reject)
    })
  }
  
  mongoose.set('strictQuery', true)
  
  // Configure connection options for better reliability
  const options = {
    serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
    connectTimeoutMS: 30000,
    socketTimeoutMS: 30000,
    maxPoolSize: 10,
    minPoolSize: 1,
    maxIdleTimeMS: 30000,
    bufferCommands: false // Disable mongoose buffering
  }
  
  try {
    await mongoose.connect(mongoUri, options)
    console.log('[DB] Connected successfully to MongoDB')
    return mongoose.connection
  } catch (error) {
    console.error('[DB] Connection failed:', error.message)
    throw error
  }
}


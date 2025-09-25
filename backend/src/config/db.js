import mongoose from 'mongoose'

export async function connectToDatabase(mongoUri) {
  if (!mongoUri) throw new Error('Missing MONGODB_URI')
  mongoose.set('strictQuery', true)
  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 10000
  })
  return mongoose.connection
}


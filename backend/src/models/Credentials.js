import mongoose from 'mongoose'

const credentialsSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

// Ensure only one credentials document exists
credentialsSchema.index({ isActive: 1 }, { unique: true, partialFilterExpression: { isActive: true } })

export default mongoose.model('Credentials', credentialsSchema)

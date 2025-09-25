import mongoose from 'mongoose'

const contactSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  subtitle: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: false,
    trim: true
  },
  address: {
    type: String,
    required: false,
    trim: true
  },
  socialLinks: {
    linkedin: {
      type: String,
      required: false,
      trim: true
    },
    github: {
      type: String,
      required: false,
      trim: true
    },
    twitter: {
      type: String,
      required: false,
      trim: true
    },
    instagram: {
      type: String,
      required: false,
      trim: true
    },
    facebook: {
      type: String,
      required: false,
      trim: true
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

export default mongoose.model('Contact', contactSchema)

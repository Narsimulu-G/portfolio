import mongoose from 'mongoose'

const certificateSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  issuer: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return v && v.trim().length > 0
      },
      message: 'Image URL is required and cannot be empty'
    }
  },
  description: {
    type: String,
    required: false,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

export default mongoose.model('Certificate', certificateSchema)

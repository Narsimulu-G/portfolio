import mongoose from 'mongoose'

const profileSchema = new mongoose.Schema(
  {
    name: String,
    headline: String,
    bio: String,
    avatarUrl: String,
    social: {
      linkedin: String,
      github: String,
      twitter: String,
      email: String
    }
  },
  { timestamps: true }
)

export default mongoose.model('Profile', profileSchema)


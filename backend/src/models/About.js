import mongoose from 'mongoose'

const aboutSchema = new mongoose.Schema(
  {
    title: String, // Display name/title for About header
    bio: String,   // Main about description
    imageUrl: String, // Optional image shown in About section
    whatIDo: [{ type: String }], // Bullet points for what I do
    techStacks: [{ type: String }] // List of tech chips
  },
  { timestamps: true }
)

export default mongoose.model('About', aboutSchema)



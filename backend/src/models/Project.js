import mongoose from 'mongoose'

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String },
    liveUrl: { type: String },
    githubUrl: { type: String },
    technologies: [{ type: String }],
    featured: { type: Boolean, default: false },
    // Keep old fields for backward compatibility
    image: { type: String },
    tags: [{ type: String }],
    demoUrl: { type: String },
    icon: { type: String },
    category: { type: String }
  },
  { timestamps: true }
)

export default mongoose.model('Project', projectSchema)


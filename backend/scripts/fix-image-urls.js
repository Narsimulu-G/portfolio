import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Get current file directory
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables
dotenv.config()

// Import models
import Profile from '../src/models/Profile.js'
import Project from '../src/models/Project.js'
import About from '../src/models/About.js'

// Available images in uploads directory
const availableImages = [
  'file-1758633701962-326786458.jpg',
  'file-1758633718870-305068625.jpg', 
  'file-1758634062465-996498690.jpg',
  'file-1758634191359-270532722.jpg',
  'file-1758634248168-732642413.jpg',
  'file-1758634504855-466785853.png',
  'file-1758634525909-879799626.png',
  'file-1758634543543-478354564.png',
  'file-1758640259710-161558941.jpg',
  'file-1758640309398-244138843.jpg',
  'file-1758640458767-817889306.jpg',
  'file-1758640487192-225589495.jpg',
  'file-1758640593044-785076872.png',
  'file-1758640691387-27254816.jpg',
  'file-1758801662115-575339768.jpg',
  'file-1758801705523-138415089.jpg',
  'file-1758802239795-539883521.jpg',
  'file-1758803040138-532567755.png',
  'file-1758804677698-294753466.webp',
  'file-1758804710608-100494963.webp',
  'file-1758805723888-505678275.webp',
  'file-1758805991763-557327281.webp',
  'file-1758806636509-447159110.webp',
  'file-1758810292244-467657831.jpg',
  'file-1758810364860-104346307.webp',
  'file-1758810415846-255731842.jpeg',
  'file-1758810457250-238848734.jpg',
  'file-1758810648067-665220718.webp',
  'file-1758965541336-61614780.jpg'
]

// Fallback images for different types
const fallbackImages = {
  profile: 'https://res.cloudinary.com/dovmtmu7y/image/upload/v1758257912/badri_ekxgwe.jpg',
  project: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=600&h=400&auto=format&fit=crop'
}

// Working project images - mix of Cloudinary (working) and Unsplash
const projectImages = [
  'https://res.cloudinary.com/dovmtmu7y/image/upload/v1758257912/badri_ekxgwe.jpg', // Use working Cloudinary image
  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=600&h=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&h=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?q=80&w=600&h=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?q=80&w=600&h=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1611224923853-80b023f02d71?q=80&w=600&h=400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?q=80&w=600&h=400&auto=format&fit=crop'
]

async function fixImageUrls() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio')
    console.log('Connected to MongoDB')

    // Fix profile images
    console.log('\n=== Fixing Profile Images ===')
    const profiles = await Profile.find({})
    console.log(`Found ${profiles.length} profiles`)
    
    for (const profile of profiles) {
      console.log(`\nProfile: ${profile.name}`)
      console.log(`Current avatarUrl: ${profile.avatarUrl}`)
      
      // Check if current URL is broken
      const isBroken = profile.avatarUrl && (
        profile.avatarUrl.includes('localhost:4000') ||
        profile.avatarUrl.includes('file-1759158756482-690077475.jpeg') ||
        profile.avatarUrl.includes('portfolio-j9s6.onrender.com/uploads/') ||
        !profile.avatarUrl.startsWith('http')
      )
      
      if (isBroken) {
        // Use Cloudinary fallback for profile
        profile.avatarUrl = fallbackImages.profile
        await profile.save()
        console.log(`✅ Updated to: ${fallbackImages.profile}`)
      } else {
        console.log('✅ No update needed')
      }
    }

    // Fix project images
    console.log('\n=== Fixing Project Images ===')
    const projects = await Project.find({})
    console.log(`Found ${projects.length} projects`)
    
    for (const project of projects) {
      console.log(`\nProject: ${project.title}`)
      console.log(`Current imageUrl: ${project.imageUrl}`)
      console.log(`Current image: ${project.image}`)
      
      // Check if current URLs are broken or need update
      const isImageUrlBroken = project.imageUrl && (
        project.imageUrl.includes('localhost:4000') ||
        project.imageUrl.includes('file-1759158253719-752310476.png') ||
        project.imageUrl.includes('portfolio-j9s6.onrender.com/uploads/') ||
        project.imageUrl.includes('weather_demo.jpg') || // Force update non-existent Cloudinary images
        project.imageUrl.includes('ecommerce_demo.jpg') ||
        project.imageUrl.includes('task_demo.jpg') ||
        project.imageUrl.includes('mobile_demo.jpg') ||
        project.imageUrl.includes('portfolio_demo.jpg') ||
        project.imageUrl.includes('webapp_demo.jpg') ||
        !project.imageUrl.startsWith('http')
      )
      
      const isImageBroken = project.image && (
        project.image.includes('localhost:4000') ||
        project.image.includes('file-1759158253719-752310476.png') ||
        project.image.includes('portfolio-j9s6.onrender.com/uploads/') ||
        project.image.includes('weather_demo.jpg') || // Force update non-existent Cloudinary images
        project.image.includes('ecommerce_demo.jpg') ||
        project.image.includes('task_demo.jpg') ||
        project.image.includes('mobile_demo.jpg') ||
        project.image.includes('portfolio_demo.jpg') ||
        project.image.includes('webapp_demo.jpg') ||
        !project.image.startsWith('http')
      )
      
      if (isImageUrlBroken || isImageBroken) {
        // Use a random Cloudinary image for projects, fallback to Unsplash
        const randomImage = projectImages[Math.floor(Math.random() * projectImages.length)]
        
        project.imageUrl = randomImage
        project.image = randomImage
        await project.save()
        console.log(`✅ Updated to: ${randomImage}`)
      } else {
        console.log('✅ No update needed')
      }
    }

    // Fix about section images
    console.log('\n=== Fixing About Section Images ===')
    const aboutSections = await About.find({})
    console.log(`Found ${aboutSections.length} about sections`)
    
    for (const about of aboutSections) {
      console.log(`\nAbout: ${about.title}`)
      console.log(`Current imageUrl: ${about.imageUrl}`)
      
      // Check if current URL is broken
      const isBroken = about.imageUrl && (
        about.imageUrl.includes('localhost:4000') ||
        about.imageUrl.includes('file-1759159261469-42238919.jpg') ||
        about.imageUrl.includes('portfolio-j9s6.onrender.com/uploads/') ||
        !about.imageUrl.startsWith('http')
      )
      
      if (isBroken) {
        // Use Cloudinary fallback for about section
        about.imageUrl = fallbackImages.profile
        await about.save()
        console.log(`✅ Updated to: ${fallbackImages.profile}`)
      } else {
        console.log('✅ No update needed')
      }
    }

    console.log('\n=== Image URL Fix Complete ===')
    
  } catch (error) {
    console.error('Error fixing image URLs:', error)
  } finally {
    await mongoose.disconnect()
    console.log('Disconnected from MongoDB')
  }
}

// Run the script
fixImageUrls()

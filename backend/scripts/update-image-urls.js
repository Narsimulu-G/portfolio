import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const OLD_BASE_URL = 'http://localhost:4000'
const NEW_BASE_URL = 'https://portfolio-g2wj.onrender.com'

async function updateImageUrls() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to database')

    const db = mongoose.connection.db

    // Update Projects collection
    const projectsResult = await db.collection('projects').updateMany(
      { 
        $or: [
          { imageUrl: { $regex: OLD_BASE_URL } },
          { image: { $regex: OLD_BASE_URL } }
        ]
      },
      [
        {
          $set: {
            imageUrl: {
              $cond: {
                if: { $ne: ["$imageUrl", null] },
                then: { $replaceAll: { input: "$imageUrl", find: OLD_BASE_URL, replacement: NEW_BASE_URL } },
                else: "$imageUrl"
              }
            },
            image: {
              $cond: {
                if: { $ne: ["$image", null] },
                then: { $replaceAll: { input: "$image", find: OLD_BASE_URL, replacement: NEW_BASE_URL } },
                else: "$image"
              }
            }
          }
        }
      ]
    )
    console.log(`Updated ${projectsResult.modifiedCount} projects`)

    // Update Profiles collection
    const profilesResult = await db.collection('profiles').updateMany(
      { avatarUrl: { $regex: OLD_BASE_URL } },
      [
        {
          $set: {
            avatarUrl: { $replaceAll: { input: "$avatarUrl", find: OLD_BASE_URL, replacement: NEW_BASE_URL } }
          }
        }
      ]
    )
    console.log(`Updated ${profilesResult.modifiedCount} profiles`)

    // Update Certificates collection
    const certificatesResult = await db.collection('certificates').updateMany(
      { imageUrl: { $regex: OLD_BASE_URL } },
      [
        {
          $set: {
            imageUrl: { $replaceAll: { input: "$imageUrl", find: OLD_BASE_URL, replacement: NEW_BASE_URL } }
          }
        }
      ]
    )
    console.log(`Updated ${certificatesResult.modifiedCount} certificates`)

    // Update About collection
    const aboutResult = await db.collection('abouts').updateMany(
      { imageUrl: { $regex: OLD_BASE_URL } },
      [
        {
          $set: {
            imageUrl: { $replaceAll: { input: "$imageUrl", find: OLD_BASE_URL, replacement: NEW_BASE_URL } }
          }
        }
      ]
    )
    console.log(`Updated ${aboutResult.modifiedCount} about records`)

    console.log('Image URL update completed successfully!')
  } catch (error) {
    console.error('Error updating image URLs:', error)
  } finally {
    await mongoose.disconnect()
  }
}

updateImageUrls()

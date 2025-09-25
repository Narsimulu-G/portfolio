// Script to check and fix existing skills data
import mongoose from 'mongoose';
import Skill from './src/models/Skill.js';

// Connect to database
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/portfolio';

async function checkAndFixSkills() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to database');

    // Find skills with invalid categories
    const invalidSkills = await Skill.find({
      category: { $nin: ['Technical', 'Programming Languages', 'Frameworks', 'Tools', 'Soft Skills', 'Certifications', 'Languages'] }
    });

    console.log(`Found ${invalidSkills.length} skills with invalid categories:`);
    invalidSkills.forEach(skill => {
      console.log(`- ${skill.name}: category="${skill.category}", level="${skill.level}"`);
    });

    // Find skills with invalid levels
    const invalidLevelSkills = await Skill.find({
      level: { $nin: ['Beginner', 'Intermediate', 'Advanced', 'Expert'] }
    });

    console.log(`\nFound ${invalidLevelSkills.length} skills with invalid levels:`);
    invalidLevelSkills.forEach(skill => {
      console.log(`- ${skill.name}: category="${skill.category}", level="${skill.level}"`);
    });

    // Fix invalid categories
    const categoryMapping = {
      'Core Technologies': 'Technical',
      'Tools & Libraries': 'Tools',
      'Frontend': 'Frameworks',
      'Backend': 'Technical',
      'Language': 'Programming Languages',
      'Styling': 'Tools',
      'Framework': 'Frameworks',
      'Runtime': 'Technical'
    };

    for (const skill of invalidSkills) {
      if (categoryMapping[skill.category]) {
        console.log(`Updating ${skill.name}: ${skill.category} -> ${categoryMapping[skill.category]}`);
        await Skill.findByIdAndUpdate(skill._id, { category: categoryMapping[skill.category] });
      }
    }

    // Fix invalid levels
    const levelMapping = {
      'Beginer': 'Beginner',
      'beginner': 'Beginner',
      'intermediate': 'Intermediate',
      'advanced': 'Advanced',
      'expert': 'Expert'
    };

    for (const skill of invalidLevelSkills) {
      if (levelMapping[skill.level]) {
        console.log(`Updating ${skill.name}: level ${skill.level} -> ${levelMapping[skill.level]}`);
        await Skill.findByIdAndUpdate(skill._id, { level: levelMapping[skill.level] });
      }
    }

    console.log('\nData check and fix completed!');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkAndFixSkills();

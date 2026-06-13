import express from 'express'
import Profile from '../models/Profile.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', protect, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id })
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' })
    }
    res.json(profile)
  } catch (err) {
    console.log('Error fetching profile:', err.message)
    res.status(500).json({ message: 'Server Error' })
  }
})

router.post('/', protect, async (req, res) => {
  const { summary, skills, experience, education, linkedin, github } = req.body

  const formattedSkills = (skills || []).map(skillGroup => ({
    domain: skillGroup.domain,
    items: typeof skillGroup.items === 'string' 
      ? skillGroup.items.split(',').map(s => s.trim()).filter(s => s !== '')
      : skillGroup.items
  }))

  const profileFields = {
    user: req.user.id,
    summary,
    linkedin: linkedin || '',
    github: github || '',
    skills: formattedSkills,
    experience: experience || [],
    education: education || []
  }

  try {
    let profile = await Profile.findOne({ user: req.user.id })

    if (profile) {
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { returnDocument: 'after' }
      )
      return res.json(profile)
    }

    profile = new Profile(profileFields)
    await profile.save()
    res.json(profile)
  } catch (err) {
    console.log('Error saving profile:', err.message)
    res.status(500).json({ message: 'Server Error' })
  }
})

router.delete('/', protect, async (req, res) => {
  try {
    await Profile.findOneAndDelete({ user: req.user.id })
    res.json({ message: 'Profile deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: 'Server Error' })
  }
})

export default router
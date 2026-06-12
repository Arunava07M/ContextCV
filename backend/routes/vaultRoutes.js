import express from 'express'
import mongoose from 'mongoose'
import VaultEntry from '../models/VaultEntry.js'
import Profile from '../models/Profile.js' 
import { protect } from '../middleware/authMiddleware.js'
import { generateEmbedding } from '../utils/gemini.js'

const router = express.Router()

router.post('/search', protect, async (req, res) => {
  try {
    const { jobDescription } = req.body
    if (!jobDescription) return res.status(400).json({ message: 'Job description is required' })

    const profile = await Profile.findOne({ user: req.user.id })
    if (!profile) return res.status(404).json({ message: 'Profile not found. Please create one first.' })

    const jdEmbedding = await generateEmbedding(jobDescription)
    if (!jdEmbedding) return res.status(500).json({ message: 'Failed to analyze Job Description' })

    const matches = await VaultEntry.aggregate([
      {
        "$vectorSearch": {
          "index": "vector_index", 
          "path": "embedding",
          "queryVector": jdEmbedding,
          "numCandidates": 100,
          "limit": 10 
        }
      },
      {
        "$match": {
          "user": new mongoose.Types.ObjectId(req.user.id)
        }
      },
      {
        "$limit": 3 
      },
      {
        "$project": {
          "embedding": 0, 
          "score": { "$meta": "vectorSearchScore" } 
        }
      }
    ])

    res.json({ profile, matches })
  } catch (err) {
    console.log('Search error:', err.message)
    res.status(500).json({ message: 'Search failed' })
  }
})

router.get('/', protect, async (req, res) => {
  try {
    const entries = await VaultEntry.find({ user: req.user.id }).select('-embedding').sort({ createdAt: -1 })
    res.json(entries)
  } catch (err) {
    res.status(500).json({ message: 'Server Error' })
  }
})

router.post('/', protect, async (req, res) => {
  try {
    const { title, type, techStack, dateOrDuration, bullets } = req.body
    const formattedTech = Array.isArray(techStack) ? techStack : techStack.split(',').map(s => s.trim()).filter(s => s !== '')
    const formattedBullets = Array.isArray(bullets) ? bullets : []

    const textToEmbed = `Type: ${type}. Title: ${title}. Tech Stack: ${formattedTech.join(', ')}. Details: ${formattedBullets.join(' ')}`
    const embedding = await generateEmbedding(textToEmbed)

    const newEntry = new VaultEntry({
      user: req.user.id, title, type, techStack: formattedTech, bullets: formattedBullets, embedding: embedding || []
    })
    if (dateOrDuration) newEntry.dateOrDuration = dateOrDuration

    const savedEntry = await newEntry.save()
    const entryObj = savedEntry.toObject()
    delete entryObj.embedding
    res.status(201).json(entryObj)
  } catch (err) {
    res.status(500).json({ message: 'Server Error' })
  }
})

router.put('/:id', protect, async (req, res) => {
  try {
    const { title, type, techStack, dateOrDuration, bullets } = req.body
    let entry = await VaultEntry.findById(req.params.id)
    if (!entry) return res.status(404).json({ message: 'Entry not found' })
    if (entry.user.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' })

    const formattedTech = Array.isArray(techStack) ? techStack : (techStack ? techStack.split(',').map(s => s.trim()).filter(s => s !== '') : [])
    const formattedBullets = Array.isArray(bullets) ? bullets : []

    const textToEmbed = `Type: ${type}. Title: ${title}. Tech Stack: ${formattedTech.join(', ')}. Details: ${formattedBullets.join(' ')}`
    const embedding = await generateEmbedding(textToEmbed)

    entry = await VaultEntry.findByIdAndUpdate(
      req.params.id,
      { $set: { title, type, techStack: formattedTech, dateOrDuration, bullets: formattedBullets, embedding: embedding || entry.embedding } },
      { returnDocument: 'after' }
    )
    const entryObj = entry.toObject()
    delete entryObj.embedding
    res.json(entryObj)
  } catch (err) {
    res.status(500).json({ message: 'Server Error' })
  }
})

router.delete('/:id', protect, async (req, res) => {
  try {
    const entry = await VaultEntry.findById(req.params.id)
    if (!entry) return res.status(404).json({ message: 'Entry not found' })
    if (entry.user.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' })
    await entry.deleteOne()
    res.json({ message: 'Entry removed' })
  } catch (err) {
    res.status(500).json({ message: 'Server Error' })
  }
})

export default router
import express from 'express'
import { protect } from '../middleware/authMiddleware.js'
import { generateTailoredResume } from '../utils/gemini.js'
import { resumeSchema } from '../utils/resumeSchema.js'
import { compileResume } from '../utils/compiler.js'

const router = express.Router()

router.post('/rewrite', protect, async (req, res) => {
  try {
    const { jobDescription, profile, matches } = req.body
    
    if (!jobDescription || !profile || !matches) {
      return res.status(400).json({ message: 'Missing required context (JD, profile, matches)' })
    }

    const rawAiJson = await generateTailoredResume(jobDescription, profile, matches)
    const validatedData = resumeSchema.parse(rawAiJson)
    res.json(validatedData)

  } catch (err) {
    console.log('AI Pipeline Error:', err)
    if (err.name === 'ZodError') {
      return res.status(422).json({ 
        message: 'AI generated invalid data structure', 
        issues: err.errors 
      })
    }
    res.status(500).json({ message: 'AI processing failed' })
  }
})

router.post('/compile', protect, async (req, res) => {
  try {
    const { templateId, resumeJson, profile } = req.body
    
    if (!templateId || !resumeJson || !profile) {
      return res.status(400).json({ message: 'Missing data required for compilation.' })
    }

    const { pdfBuffer, latexSource } = await compileResume(templateId, resumeJson, profile);
    res.json({
      pdf: pdfBuffer.toString('base64'), 
      tex: rawTex                        
    })

  } catch (err) {
    console.error('Compile Route Error:', err)
    res.status(500).json({ message: 'Failed to compile the final PDF. Check server logs.' })
  }
})

export default router
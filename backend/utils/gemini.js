import { GoogleGenerativeAI } from '@google/generative-ai'
import Groq from 'groq-sdk'

// --- EXISTING EMBEDDING FUNCTION (MUST STAY GEMINI) ---
// We keep this as Gemini because your database already has Gemini vectors.
export const generateEmbedding = async (text) => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: 'gemini-embedding-001' })
    const result = await model.embedContent(text)
    return result.embedding.values
  } catch (err) {
    console.log('Error generating embedding:', err.message)
    return null 
  }
}

// --- NEW AI REWRITE FUNCTION (NOW POWERED BY GROQ) ---
export const generateTailoredResume = async (jobDescription, profile, matches) => {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

  // Groq prefers a strict separation of System and User instructions
  const systemPrompt = `
  You are an elite ATS-aware resume writer.
  Your job is to take the provided Job Description, Core Profile, and Top Projects, and rewrite the user's data to perfectly match the role while remaining 100% truthful.
  Highlight the skills and achievements that align with the JD. Remove irrelevant technical jargon. Do NOT invent new experiences.

  Return EXACTLY a JSON object matching this schema:
  {
    "summary": "String (Tailored professional summary)",
    "skills": [
      { "domain": "String (e.g. Frontend)", "items": ["String", "String"] }
    ],
    "projects": [
      {
        "originalId": "String (The _id from the raw project)",
        "title": "String (Project Title)",
        "techStack": ["String", "String"],
        "bullets": ["String (Tailored bullet 1)", "String (Tailored bullet 2)"]
      }
    ]
  }`

  const userPrompt = `
  Target Job Description:
  ${jobDescription}

  Core Profile:
  ${JSON.stringify(profile)}

  Top Projects (Raw):
  ${JSON.stringify(matches)}
  `

  const maxRetries = 3
  let delay = 2000 

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Calling Groq's high-end Llama 3.3 model natively in JSON mode
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        model: 'llama-3.3-70b-versatile', 
        response_format: { type: 'json_object' }
      })

      return JSON.parse(chatCompletion.choices[0].message.content)
      
    } catch (err) {
      console.log(`[Groq API] Error on attempt ${attempt}:`, err.message)
      
      // Handle rate limits or service unavailable errors from Groq
      if (err.status === 429 || err.status === 503 || err.message?.includes('429') || err.message?.includes('503')) {
        if (attempt < maxRetries) {
          console.log(`[Groq API] Network busy. Retrying in ${delay / 1000} seconds...`)
          await new Promise(resolve => setTimeout(resolve, delay))
          delay *= 2 
          continue
        }
      }
      throw new Error('Failed to generate AI rewrite after multiple attempts.')
    }
  }
}
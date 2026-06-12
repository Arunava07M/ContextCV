import { z } from 'zod'

export const resumeSchema = z.object({
  summary: z.string().min(10, "Summary must be at least 10 characters"),
  skills: z.array(
    z.object({
      domain: z.string(),
      items: z.array(z.string())
    })
  ),
  projects: z.array(
    z.object({
      originalId: z.string().optional(),
      title: z.string(),
      techStack: z.array(z.string()),
      bullets: z.array(z.string())
    })
  )
})
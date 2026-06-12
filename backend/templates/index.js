import { executiveTemplate } from './executive.js'
import { minimalistTemplate } from './minimalist.js'
import { creativeTemplate } from './creative.js'
import { techTemplate } from './tech.js' // Added the import

const templateRegistry = {
  executive: executiveTemplate,
  minimalist: minimalistTemplate,
  modern: minimalistTemplate, // Final fallback
  tech: techTemplate,         // Registered the new template!
  creative: creativeTemplate 
}

export const getTemplate = (id) => {
  return templateRegistry[id] || templateRegistry['minimalist']
}
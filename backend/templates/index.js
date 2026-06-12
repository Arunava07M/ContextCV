import { executiveTemplate } from './executive.js'
import { minimalistTemplate } from './minimalist.js'
import { creativeTemplate } from './creative.js'
import { techTemplate } from './tech.js' 

const templateRegistry = {
  executive: executiveTemplate,
  minimalist: minimalistTemplate,
  modern: minimalistTemplate, 
  tech: techTemplate,         
  creative: creativeTemplate 
}

export const getTemplate = (id) => {
  return templateRegistry[id] || templateRegistry['minimalist']
}
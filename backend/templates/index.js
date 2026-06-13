import { executiveTemplate } from './executive.js'
import { minimalistTemplate } from './minimalist.js'
import { modernTemplate } from './modern.js'

const templateRegistry = {
  executive: executiveTemplate,
  minimalist: minimalistTemplate,
  modern: modernTemplate
}

export const getTemplate = (id) => {
  return templateRegistry[id] || templateRegistry['minimalist']
}
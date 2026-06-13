import axios from 'axios'
import path from 'path'
import fs from 'fs'
import { getTemplate } from '../templates/index.js'

// adding a compiler field per template now
// deedy based templates (creative/tech) use fontspec which needs xelatex, not pdflatex
const TEMPLATE_REGISTRY = {
  'minimalist': { files: [], compiler: 'pdflatex' },
  'executive': { files: ['resume.cls'], compiler: 'pdflatex' },
  'creative': { files: ['deedy-resume-openfont.cls'], compiler: 'xelatex' },
  'tech': { files: ['deedy-resume-openfont.cls'], compiler: 'xelatex' }
}

const escapeLatex = (str) => {
  if (!str) return ''
  return String(str)
    .replace(/\\/g, '\\textbackslash ')
    .replace(/&/g, '\\&')
    .replace(/%/g, '\\%')
    .replace(/\$/g, '\\$')
    .replace(/#/g, '\\#')
    .replace(/_/g, '\\_')
    .replace(/{/g, '\\{')
    .replace(/}/g, '\\}')
    .replace(/\^/g, '\\textasciicircum ')
    .replace(/~/g, '\\textasciitilde ')
}

const buildLatexBlocks = (templateId, resumeJson, profile) => {
  let skillsBlock = ''
  let projectsBlock = ''
  let educationBlock = ''

  const safeName = escapeLatex(profile?.name || 'Your Name')
  const firstName = safeName.split(' ')[0]
  const lastName = safeName.split(' ').slice(1).join(' ')

  const contactInfo = escapeLatex(profile?.email || 'your.email@example.com')

  const educationEntries = (profile?.education && profile.education.length > 0)
    ? profile.education
    : [{ institution: 'University', degree: 'Degree', fieldOfStudy: '', yearOfPassing: '' }]

  if (templateId === 'minimalist') {
    resumeJson.skills.forEach(skill => {
      const escapedItems = skill.items.map(item => escapeLatex(item))
      skillsBlock += `\\textbf{${escapeLatex(skill.domain)}}: ${escapedItems.join(', ')} \\\\\n`
    })
    resumeJson.projects.forEach(proj => {
      projectsBlock += `\\resumeSubheading{${escapeLatex(proj.title)}}{}{}{}\n\\resumeItemListStart\n`
      proj.bullets.forEach(b => { projectsBlock += `\\resumeItem{${escapeLatex(b)}}\n` })
      projectsBlock += `\\resumeItemListEnd\n`
    })

    educationEntries.forEach(edu => {
      const degreeLine = edu.fieldOfStudy
        ? `${escapeLatex(edu.degree || 'Degree')}, ${escapeLatex(edu.fieldOfStudy)}`
        : escapeLatex(edu.degree || 'Degree')
      educationBlock += `\\resumeSubheading{${escapeLatex(edu.institution || 'University')}}{${escapeLatex(String(edu.yearOfPassing || ''))}}{${degreeLine}}{}\n`
    })

  } else if (templateId === 'executive') {
    resumeJson.skills.forEach(skill => {
      const escapedItems = skill.items.map(item => escapeLatex(item))
      skillsBlock += `\\textbf{${escapeLatex(skill.domain)}}: ${escapedItems.join(', ')} \\\\\n`
    })
    resumeJson.projects.forEach(proj => {
      projectsBlock += `\\begin{rSubsection}{${escapeLatex(proj.title)}}{}{}{}\n`
      proj.bullets.forEach(b => { projectsBlock += `\\item ${escapeLatex(b)}\n` })
      projectsBlock += `\\end{rSubsection}\n`
    })

    educationEntries.forEach(edu => {
      const degreeLine = edu.fieldOfStudy
        ? `${escapeLatex(edu.degree || 'Degree')}, ${escapeLatex(edu.fieldOfStudy)}`
        : escapeLatex(edu.degree || 'Degree')
      educationBlock += `{\\bf ${escapeLatex(edu.institution || 'University')}} \\hfill {${escapeLatex(String(edu.yearOfPassing || ''))}}\\\\\n{${degreeLine}}\\\\[4pt]\n`
    })

  } else {
    // creative and tech templates (deedy class)
    resumeJson.skills.forEach(skill => {
      const escapedItems = skill.items.map(item => escapeLatex(item))
      skillsBlock += `\\textbf{${escapeLatex(skill.domain)}}: \\textbullet{} ${escapedItems.join(' \\textbullet{} ')} \\\\\n`
    })
    resumeJson.projects.forEach(proj => {
      const escapedTech = (proj.techStack || []).map(t => escapeLatex(t)).join(', ') || 'Tech'
      projectsBlock += `\\runsubsection{${escapeLatex(proj.title)}}\n\\descript{| ${escapedTech}}\n\\location{}\n\\begin{tightemize}\n`
      proj.bullets.forEach(b => { projectsBlock += `\\item ${escapeLatex(b)}\n` })
      projectsBlock += `\\end{tightemize}\\sectionsep\n`
    })

    educationEntries.forEach(edu => {
      const degreeLine = edu.fieldOfStudy
        ? `${escapeLatex(edu.degree || 'Degree')}, ${escapeLatex(edu.fieldOfStudy)}`
        : escapeLatex(edu.degree || 'Degree')
      educationBlock += `\\runsubsection{${escapeLatex(edu.institution || 'University')}}\n\\descript{| ${degreeLine}}\n\\location{${escapeLatex(String(edu.yearOfPassing || ''))}}\n\\sectionsep\n`
    })
  }

  return { firstName, lastName, safeName, contactInfo, skillsBlock, projectsBlock, educationBlock }
}

export const compileResume = async (templateId, resumeJson, profile) => {
  const templatesDir = path.join(process.cwd(), 'templates')

  const rawTemplate = getTemplate(templateId)
  const blocks = buildLatexBlocks(templateId, resumeJson, profile)

  const finalTex = rawTemplate
    .replace('{{FIRST_NAME}}', blocks.firstName)
    .replace('{{LAST_NAME}}', blocks.lastName)
    .replace(/{{NAME}}/g, blocks.safeName)
    .replace('{{CONTACT_INFO}}', blocks.contactInfo)
    .replace('{{SUMMARY}}', escapeLatex(resumeJson.summary))
    .replace('{{SKILLS_BLOCK}}', blocks.skillsBlock)
    .replace('{{PROJECTS_BLOCK}}', blocks.projectsBlock)
    .replace('{{EDUCATION_BLOCK}}', blocks.educationBlock)

  const resources = [
    {
      main: true,
      content: finalTex
    }
  ]

  // falling back to pdflatex + no extra files if templateId is somehow unknown
  const config = TEMPLATE_REGISTRY[templateId] || { files: [], compiler: 'pdflatex' }

  if (config.files && config.files.length > 0) {
    config.files.forEach(file => {
      const filePath = path.join(templatesDir, file)
      const fileContent = fs.readFileSync(filePath, 'utf8')
      resources.push({
        path: file,
        content: fileContent
      })
    })
  }

  try {
    const response = await axios.post('https://latex.ytotech.com/builds/sync', {
      compiler: config.compiler, // pdflatex for minimalist/executive, xelatex for creative/tech
      resources: resources
    }, {
      responseType: 'arraybuffer', 
      headers: { 'Content-Type': 'application/json' },
      validateStatus: () => true 
    })

    if (response.status < 200 || response.status >= 300) {
      const errorText = Buffer.from(response.data).toString('utf8')
      console.log('latex compile error response:', errorText)
      throw new Error('LaTeX compilation failed, check the template syntax')
    }

    const pdfBuffer = Buffer.from(response.data)

    return { pdfBuffer, latexSource: finalTex }

  } catch (err) {
    console.log('Compile Error:', err.message)
    throw new Error('PDF Generation failed: ' + err.message)
  }
}
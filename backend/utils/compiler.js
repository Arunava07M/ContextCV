import fs from 'fs/promises'
import path from 'path'
import os from 'os'
import { exec } from 'child_process'
import util from 'util'
import { getTemplate } from '../templates/index.js'

const execPromise = util.promisify(exec)

// 1. Safety Filter: Escapes characters that break LaTeX
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

// 2. Formatting Engine
const buildLatexBlocks = (templateId, resumeJson, profile) => {
  let skillsBlock = ''
  let projectsBlock = ''
  let educationBlock = ''

  const safeName = escapeLatex(profile?.name || 'Your Name')
  const firstName = safeName.split(' ')[0]
  const lastName = safeName.split(' ').slice(1).join(' ')
  const contactInfo = escapeLatex('email@example.com | github.com/user | linkedin.com/in/user')

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
    educationBlock = `\\resumeSubheading{${escapeLatex(profile?.education?.institution || 'University')}}{}{${escapeLatex(profile?.education?.degree || 'Degree')}}{${escapeLatex(profile?.education?.year || '2027')}}`
  
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
    educationBlock = `{\\bf ${escapeLatex(profile?.education?.institution || 'University')}} \\hfill {${escapeLatex(profile?.education?.year || '2027')}}\\\\\n{${escapeLatex(profile?.education?.degree || 'Degree')}}\n`
  
  } else {
    // Creative & Tech (Deedy) Syntax
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
    educationBlock = `\\runsubsection{${escapeLatex(profile?.education?.institution || 'University')}}\n\\descript{| ${escapeLatex(profile?.education?.degree || 'Degree')}}\n\\location{Expected: ${escapeLatex(profile?.education?.year || '2027')}}\n`
  }

  return { firstName, lastName, safeName, contactInfo, skillsBlock, projectsBlock, educationBlock }
}

// 3. The Core Execution Engine
export const compileResume = async (templateId, resumeJson, profile) => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'contextcv-'))
  
  try {
    let rawTemplate = getTemplate(templateId)
    const blocks = buildLatexBlocks(templateId, resumeJson, profile)

    rawTemplate = rawTemplate
      .replace('{{FIRST_NAME}}', blocks.firstName)
      .replace('{{LAST_NAME}}', blocks.lastName)
      .replace(/{{NAME}}/g, blocks.safeName)
      .replace('{{CONTACT_INFO}}', blocks.contactInfo)
      .replace('{{SUMMARY}}', escapeLatex(resumeJson.summary))
      .replace('{{SKILLS_BLOCK}}', blocks.skillsBlock)
      .replace('{{PROJECTS_BLOCK}}', blocks.projectsBlock)
      .replace('{{EDUCATION_BLOCK}}', blocks.educationBlock)

    await fs.writeFile(path.join(tempDir, 'resume.tex'), rawTemplate)

    const templatesDir = path.join(process.cwd(), 'templates')
    const filesToCopy = ['resume.cls', 'deedy-resume-openfont.cls']
    for (const file of filesToCopy) {
      const src = path.join(templatesDir, file)
      try {
        await fs.copyFile(src, path.join(tempDir, file))
      } catch (e) {
        // Skip silently if file doesn't exist
      }
    }

    // --- RENDER DEPLOYMENT LOGIC ---
    const backendDir = process.cwd()
    // If running on Render (production), use the downloaded Linux binary. Otherwise, use global.
    const tectonicCmd = process.env.NODE_ENV === 'production' 
      ? path.join(backendDir, 'tectonic') 
      : 'tectonic'

    console.log(`[Tectonic] Executing: ${tectonicCmd} in ${tempDir}...`)
    await execPromise(`${tectonicCmd} resume.tex`, { cwd: tempDir })

    const pdfBuffer = await fs.readFile(path.join(tempDir, 'resume.pdf'))
    return { pdfBuffer, rawTex: rawTemplate }

  } catch (error) {
    console.error('Compilation Engine Error:', error)
    throw new Error('Failed to compile LaTeX to PDF. Tectonic logs: ' + error.message)
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true })
  }
}
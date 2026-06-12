import convertapi from 'convertapi';
import AdmZip from 'adm-zip';
import path from 'path';
import fs from 'fs';
import { getTemplate } from '../templates/index.js';

// Initialize with your new ConvertAPI secret
const convertApi = convertapi(process.env.CONVERTAPI_SECRET);

const TEMPLATE_REGISTRY = {
  'minimalist': { files: [] },
  'executive': { files: ['resume.cls'] },
  'creative': { files: ['deedy-resume-openfont.cls'] },
  'tech': { files: ['deedy-resume-openfont.cls'] }
};

const escapeLatex = (str) => {
  if (!str) return '';
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
    .replace(/~/g, '\\textasciitilde ');
};

const buildLatexBlocks = (templateId, resumeJson, profile) => {
  let skillsBlock = '';
  let projectsBlock = '';
  let educationBlock = '';

  const safeName = escapeLatex(profile?.name || 'Your Name');
  const firstName = safeName.split(' ')[0];
  const lastName = safeName.split(' ').slice(1).join(' ');
  const contactInfo = escapeLatex('email@example.com | github.com/user | linkedin.com/in/user');

  if (templateId === 'minimalist') {
    resumeJson.skills.forEach(skill => {
      const escapedItems = skill.items.map(item => escapeLatex(item));
      skillsBlock += `\\textbf{${escapeLatex(skill.domain)}}: ${escapedItems.join(', ')} \\\\\n`;
    });
    resumeJson.projects.forEach(proj => {
      projectsBlock += `\\resumeSubheading{${escapeLatex(proj.title)}}{}{}{}\n\\resumeItemListStart\n`;
      proj.bullets.forEach(b => { projectsBlock += `\\resumeItem{${escapeLatex(b)}}\n`; });
      projectsBlock += `\\resumeItemListEnd\n`;
    });
    educationBlock = `\\resumeSubheading{${escapeLatex(profile?.education?.institution || 'University')}}{}{${escapeLatex(profile?.education?.degree || 'Degree')}}{${escapeLatex(profile?.education?.year || '2027')}}`;
  
  } else if (templateId === 'executive') {
    resumeJson.skills.forEach(skill => {
      const escapedItems = skill.items.map(item => escapeLatex(item));
      skillsBlock += `\\textbf{${escapeLatex(skill.domain)}}: ${escapedItems.join(', ')} \\\\\n`;
    });
    resumeJson.projects.forEach(proj => {
      projectsBlock += `\\begin{rSubsection}{${escapeLatex(proj.title)}}{}{}{}\n`;
      proj.bullets.forEach(b => { projectsBlock += `\\item ${escapeLatex(b)}\n`; });
      projectsBlock += `\\end{rSubsection}\n`;
    });
    educationBlock = `{\\bf ${escapeLatex(profile?.education?.institution || 'University')}} \\hfill {${escapeLatex(profile?.education?.year || '2027')}}\\\\\n{${escapeLatex(profile?.education?.degree || 'Degree')}}\n`;
  
  } else {
    resumeJson.skills.forEach(skill => {
      const escapedItems = skill.items.map(item => escapeLatex(item));
      skillsBlock += `\\textbf{${escapeLatex(skill.domain)}}: \\textbullet{} ${escapedItems.join(' \\textbullet{} ')} \\\\\n`;
    });
    resumeJson.projects.forEach(proj => {
      const escapedTech = (proj.techStack || []).map(t => escapeLatex(t)).join(', ') || 'Tech';
      projectsBlock += `\\runsubsection{${escapeLatex(proj.title)}}\n\\descript{| ${escapedTech}}\n\\location{}\n\\begin{tightemize}\n`;
      proj.bullets.forEach(b => { projectsBlock += `\\item ${escapeLatex(b)}\n`; });
      projectsBlock += `\\end{tightemize}\\sectionsep\n`;
    });
    educationBlock = `\\runsubsection{${escapeLatex(profile?.education?.institution || 'University')}}\n\\descript{| ${escapeLatex(profile?.education?.degree || 'Degree')}}\n\\location{Expected: ${escapeLatex(profile?.education?.year || '2027')}}\n`;
  }

  return { firstName, lastName, safeName, contactInfo, skillsBlock, projectsBlock, educationBlock };
};

export const compileResume = async (templateId, resumeJson, profile) => {
  const templatesDir = path.join(process.cwd(), 'templates');
  const zip = new AdmZip();

  const rawTemplate = getTemplate(templateId);
  const blocks = buildLatexBlocks(templateId, resumeJson, profile);

  const finalTex = rawTemplate
    .replace('{{FIRST_NAME}}', blocks.firstName)
    .replace('{{LAST_NAME}}', blocks.lastName)
    .replace(/{{NAME}}/g, blocks.safeName)
    .replace('{{CONTACT_INFO}}', blocks.contactInfo)
    .replace('{{SUMMARY}}', escapeLatex(resumeJson.summary))
    .replace('{{SKILLS_BLOCK}}', blocks.skillsBlock)
    .replace('{{PROJECTS_BLOCK}}', blocks.projectsBlock)
    .replace('{{EDUCATION_BLOCK}}', blocks.educationBlock);

  zip.addFile("resume.tex", Buffer.from(finalTex, "utf8"));

  const config = TEMPLATE_REGISTRY[templateId];
  if (config && config.files) {
    config.files.forEach(file => {
      zip.addLocalFile(path.join(templatesDir, file));
    });
  }

  // Create a temporary path on the Render server
  const tempZipPath = `/tmp/resume-${Date.now()}.zip`;

  try {
    // 1. Write the buffer to a temp file
    fs.writeFileSync(tempZipPath, zip.toBuffer());

    // 2. Pass the file path (string) to ConvertAPI
    const result = await convertApi.convert('pdf', {
      File: tempZipPath
    }, 'zip');

    // 3. Get the result file buffer
    const file = result.getFile();
    const pdfBuffer = await file.getContent();

    return { pdfBuffer };
  } catch (error) {
    console.error('ConvertAPI Error:', error);
    throw new Error('PDF Generation failed: ' + error.message);
  } finally {
    // 4. Always clean up the temp file
    if (fs.existsSync(tempZipPath)) {
      fs.unlinkSync(tempZipPath);
    }
  }
};
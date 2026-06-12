export const techTemplate = `
\\documentclass[]{deedy-resume-openfont}
\\usepackage{fancyhdr}

% Overriding the default Deedy section spacing to reduce gaps globally
\\renewcommand{\\sectionsep}{\\vspace{1mm}}

% Custom command to draw a line. 
\\definecolor{sectionlinecolor}{HTML}{B0B0B0}
\\newcommand{\\sectionline}{
  \\vspace{0.5mm} 
  \\noindent\\textcolor{sectionlinecolor}{\\rule{\\textwidth}{0.5pt}}
  \\vspace{-2.5mm} 
}
 
\\pagestyle{fancy}
\\fancyhf{}
 
\\begin{document}

\\lastupdated

%----------------------------------------------------------------------------------------
%     TITLE NAME
%----------------------------------------------------------------------------------------
\\namesection{{{FIRST_NAME}}}{{{LAST_NAME}}}{ 
{{CONTACT_INFO}}
}

%----------------------------------------------------------------------------------------
%     EDUCATION
%----------------------------------------------------------------------------------------
\\section{Education} 
{{EDUCATION_BLOCK}}

\\sectionline

%----------------------------------------------------------------------------------------
%     SKILLS
%----------------------------------------------------------------------------------------
\\section{Skills}
{{SKILLS_BLOCK}}

\\sectionline

%----------------------------------------------------------------------------------------
%     PROJECTS & ACHIEVEMENTS
%----------------------------------------------------------------------------------------
\\section{Experience \\& Projects}
{{PROJECTS_BLOCK}}

\\end{document}
`
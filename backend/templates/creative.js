export const creativeTemplate = `
\\documentclass[]{deedy-resume-openfont}
\\usepackage{fancyhdr}
 
\\pagestyle{fancy}
\\fancyhf{}
 
\\begin{document}

%----------------------------------------------------------------------------------------
%     TITLE NAME
%----------------------------------------------------------------------------------------
\\namesection{{{FIRST_NAME}}}{{{LAST_NAME}}}{ 
  {{CONTACT_INFO}}
}

%----------------------------------------------------------------------------------------
%     COLUMN ONE (Left Side - 33% Width)
%----------------------------------------------------------------------------------------
\\begin{minipage}[t]{0.33\\textwidth} 

\\section{Education} 
{{EDUCATION_BLOCK}}
\\sectionsep

\\section{Skills}
{{SKILLS_BLOCK}}
\\sectionsep

\\end{minipage} 
\\hfill
%----------------------------------------------------------------------------------------
%     COLUMN TWO (Right Side - 66% Width)
%----------------------------------------------------------------------------------------
\\begin{minipage}[t]{0.66\\textwidth} 

\\section{Experience \\& Projects}
{{PROJECTS_BLOCK}}
\\sectionsep

\\end{minipage} 
\\end{document}
`
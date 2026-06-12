export const executiveTemplate = `
\\documentclass[11pt]{resume} % Requires resume.cls in the compile directory

\\usepackage[left=0.5in,top=0.5in,right=0.5in,bottom=0.5in]{geometry}
\\newcommand{\\tab}[1]{\\hspace{.2667\\textwidth}\\rlap{#1}} 
\\newcommand{\\itab}[1]{\\hspace{0em}\\rlap{#1}}

\\name{{{NAME}}}

% Contact Information Block
{{CONTACT_INFO}}

\\begin{document}

%----------------------------------------------------------------------------------------
% PROFESSIONAL SUMMARY
%----------------------------------------------------------------------------------------
\\begin{rSection}{SUMMARY}
{{SUMMARY}}
\\end{rSection}

%----------------------------------------------------------------------------------------
% TECHNICAL STRENGTHS	
%----------------------------------------------------------------------------------------
\\begin{rSection}{CORE COMPETENCIES}
{{SKILLS_BLOCK}}
\\end{rSection}

%----------------------------------------------------------------------------------------
%	MASTERWORKS / PROJECTS SECTION
%----------------------------------------------------------------------------------------
\\begin{rSection}{ENGINEERING MASTERWORKS \\& EXPERIENCE}
{{PROJECTS_BLOCK}}
\\end{rSection} 

%----------------------------------------------------------------------------------------
%	EDUCATION SECTION
%----------------------------------------------------------------------------------------
\\begin{rSection}{EDUCATION}
{{EDUCATION_BLOCK}}
\\end{rSection}

\\end{document}
`
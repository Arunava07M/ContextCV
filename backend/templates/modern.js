export const modernTemplate = `
\\documentclass[a4paper,11pt]{article}

\\usepackage{url}
\\usepackage{parskip} 	

\\RequirePackage{color}
\\RequirePackage{graphicx}
\\usepackage[usenames,dvipsnames]{xcolor}
\\usepackage[scale=0.9]{geometry}

\\usepackage{tabularx}

\\usepackage{enumitem}

\\newcolumntype{C}{>{\\centering\\arraybackslash}X} 

\\usepackage{supertabular}
\\usepackage{tabularx}
\\newlength{\\fullcollw}
\\setlength{\\fullcollw}{0.47\\textwidth}

\\usepackage{titlesec}				
\\usepackage{multicol}
\\usepackage{multirow}

\\titleformat{\\section}{\\Large\\scshape\\raggedright}{}{0em}{}[\\titlerule]
\\titlespacing{\\section}{0pt}{8pt}{8pt}

\\usepackage[unicode, draft=false]{hyperref}
\\definecolor{linkcolour}{rgb}{0,0.2,0.6}
\\hypersetup{colorlinks,breaklinks,urlcolor=linkcolour,linkcolor=linkcolour}

\\usepackage{fontawesome5}

\\newenvironment{jobshort}[2]
    {
    \\begin{tabularx}{\\linewidth}{@{}l X r@{}}
    \\textbf{#1} & \\hfill &  #2 \\\\[3.75pt]
    \\end{tabularx}
    }
    {
    }

\\newenvironment{joblong}[2]
    {
    \\begin{tabularx}{\\linewidth}{@{}l X r@{}}
    \\textbf{#1} & \\hfill &  #2 \\\\[3.75pt]
    \\end{tabularx}
    \\begin{minipage}[t]{\\linewidth}
    \\begin{itemize}[nosep,after=\\strut, leftmargin=1em, itemsep=3pt,label=--]
    }
    {
    \\end{itemize}
    \\end{minipage}    
    }

\\begin{document}

\\pagestyle{empty} 

%----------------------------------------------------------------------------------------
%	TITLE
%----------------------------------------------------------------------------------------
\\begin{tabularx}{\\linewidth}{@{} C @{}}
\\Huge{{{NAME}}} \\\\[7.5pt]
\\small {{CONTACT_INFO}} \\\\
\\end{tabularx}

%----------------------------------------------------------------------------------------
%	PROFILE / SUMMARY
%----------------------------------------------------------------------------------------
\\section{Profile}
{{SUMMARY}}

%----------------------------------------------------------------------------------------
%	SKILLS
%----------------------------------------------------------------------------------------
\\section{Core Competencies}
\\begin{tabularx}{\\linewidth}{@{}l X@{}}
{{SKILLS_BLOCK}}
\\end{tabularx}

%----------------------------------------------------------------------------------------
%	EXPERIENCE / PROJECTS
%----------------------------------------------------------------------------------------
\\section{Experience \\& Projects}
{{PROJECTS_BLOCK}}

%----------------------------------------------------------------------------------------
%	EDUCATION
%----------------------------------------------------------------------------------------
\\section{Education}
\\begin{tabularx}{\\linewidth}{@{}l X@{}}	
{{EDUCATION_BLOCK}}
\\end{tabularx}

\\end{document}
`
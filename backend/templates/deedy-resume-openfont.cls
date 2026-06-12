\ProvidesClass{deedy-resume-openfont}[2014/04/30 CV class]
\NeedsTeXFormat{LaTeX2e}
\DeclareOption{print}{\def\@cv@print{}}
\DeclareOption*{%
  \PassOptionsToClass{\CurrentOption}{article}
}
\ProcessOptions\relax
\LoadClass{article}

\usepackage[hmargin=1.25cm, vmargin=0.75cm]{geometry}
\usepackage[hidelinks]{hyperref}

\usepackage{cite}
\renewcommand\refname{\vskip -1.5cm}

\usepackage[usenames,dvipsnames]{xcolor} 
\definecolor{date}{HTML}{666666} 
\definecolor{primary}{HTML}{2b2b2b} 
\definecolor{headings}{HTML}{6A6A6A}
\definecolor{subheadings}{HTML}{333333}

\usepackage{fontspec}

\setmainfont[Color=primary, BoldFont=Helvetica-Bold, ItalicFont=Helvetica-Oblique]{Helvetica}
\setsansfont[Scale=MatchLowercase,Mapping=tex-text]{Arial}

\usepackage[absolute]{textpos}
\usepackage[UKenglish]{isodate}
\setlength{\TPHorizModule}{1mm}
\setlength{\TPVertModule}{1mm}
\newcommand{\lastupdated}{\begin{textblock}{60}(155,5)
\color{date}\fontsize{8pt}{10pt}\selectfont 
Last Updated on \today
\end{textblock}}

\newcommand{\namesection}[3]{
\centering{
\fontsize{40pt}{60pt}\selectfont #1 #2
} \\[5pt]
\centering{
\color{headings}
\fontsize{11pt}{14pt}\selectfont #3}
\noindent\makebox[\linewidth]{\color{headings}\rule{\paperwidth}{0.4pt}}
\vspace{-15pt}
}

\usepackage{titlesec}
\titlespacing{\section}{0pt}{0pt}{0pt} 
\titlespacing{\subsection}{0pt}{0pt}{0pt}
\newcommand{\sectionsep}{\vspace{8pt}}

\titleformat{\section}{\color{headings}
\scshape\fontsize{16pt}{24pt}\selectfont \raggedright\uppercase}{}{0em}{}

\titleformat{\subsection}{
\color{subheadings}\fontsize{12pt}{12pt}\selectfont\bfseries\uppercase}{}{0em}{}

\newcommand{\runsubsection}[1]{
\color{subheadings}\fontsize{12pt}{12pt}\selectfont\bfseries\uppercase {#1} \normalfont}

\newcommand{\runsubsectionmixed}[1]{
\color{subheadings}\fontsize{12pt}{12pt}\selectfont\bfseries {#1} \normalfont}

\newcommand{\descript}[1]{
\color{subheadings}\raggedright\scshape\fontsize{11pt}{13pt}\selectfont {#1 \\} \normalfont}

\newcommand{\location}[1]{
\color{headings}\raggedright\fontsize{10pt}{12pt}\selectfont {#1\\} \normalfont}

\newenvironment{tightemize}{
\vspace{-\topsep}\begin{itemize}\itemsep1pt \parskip0pt \parsep0pt}
{\end{itemize}\vspace{-\topsep}}
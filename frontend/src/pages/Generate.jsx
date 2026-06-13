import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

const templates = [
  { id: 'minimalist', name: 'Minimalist', desc: 'Clean lines, standard ATS format' },
  { id: 'modern', name: 'Modern', desc: 'Bold, visually balanced, and contemporary design' },
  { id: 'executive', name: 'Executive', desc: 'Traditional, impact driven layout' }
]

const Generate = () => {
  const [jobDescription, setJobDescription] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('minimalist')
  
  const [matches, setMatches] = useState([])
  const [profileData, setProfileData] = useState(null)
  const [loadingSearch, setLoadingSearch] = useState(false)
  
  const [generatedResume, setGeneratedResume] = useState(null)
  const [loadingAi, setLoadingAi] = useState(false)
  const [error, setError] = useState('')

  const [isCompiling, setIsCompiling] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!jobDescription.trim()) return
    
    setLoadingSearch(true)
    setError('')
    setMatches([])
    setProfileData(null)
    setGeneratedResume(null)
    
    try {
      const res = await api.post('/vault/search', { jobDescription })
      setMatches(res.data.matches)
      setProfileData(res.data.profile)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to search vault.')
    } finally {
      setLoadingSearch(false)
    }
  }

  const handleGenerate = async () => {
    setLoadingAi(true)
    setError('')
    
    try {
      const res = await api.post('/generate/rewrite', {
        jobDescription,
        profile: profileData,
        matches
      })
      setGeneratedResume(res.data) 
    } catch (err) {
      setError(err.response?.data?.message || 'AI Failed to generate resume.')
    } finally {
      setLoadingAi(false)
    }
  }

  const handleDownload = async () => {
    setIsCompiling(true)
    setError('')

    try {
      const res = await api.post('/generate/compile', {
        templateId: selectedTemplate,
        resumeJson: generatedResume,
        profile: profileData
      })

      const pdfBytes = Uint8Array.from(atob(res.data.pdf), c => c.charCodeAt(0))
      const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' })
      const pdfUrl = window.URL.createObjectURL(pdfBlob)
      
      const pdfLink = document.createElement('a')
      pdfLink.href = pdfUrl
      pdfLink.setAttribute('download', `ContextCV_${selectedTemplate}_Resume.pdf`)
      document.body.appendChild(pdfLink)
      pdfLink.click()
      pdfLink.parentNode.removeChild(pdfLink)
      window.URL.revokeObjectURL(pdfUrl)

      const texBlob = new Blob([res.data.tex], { type: 'text/plain' })
      const texUrl = window.URL.createObjectURL(texBlob)
      
      const texLink = document.createElement('a')
      texLink.href = texUrl
      texLink.setAttribute('download', `ContextCV_${selectedTemplate}_Source.tex`)
      document.body.appendChild(texLink)
      texLink.click()
      texLink.parentNode.removeChild(texLink)
      window.URL.revokeObjectURL(texUrl)

    } catch (err) {
      console.log(err)
      setError('Failed to compile PDF. Ensure your backend LaTeX compiler is installed.')
    } finally {
      setIsCompiling(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-[#444444] font-sans pb-20">
      <nav className="bg-white border-b border-[#eeeeee] px-8 py-3 flex items-center gap-4">
        <Link to="/dashboard" className="text-sm font-medium text-[#387ed1] hover:text-blue-700 transition-colors">&larr; Back</Link>
        <span className="text-[#eeeeee]">|</span>
        <div className="text-md font-medium tracking-wide text-[#444444]">Resume Generator</div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">
        
        <div className="flex flex-col gap-8">
          
          <section>
            <h1 className="text-lg font-medium text-[#444444] mb-1">1. Select Template</h1>
            <p className="text-xs text-[#9b9b9b] mb-4">Choose the structure for the final PDF.</p>
            <div className="grid grid-cols-2 gap-3">
              {templates.map((tpl) => (
                <div 
                  key={tpl.id}
                  onClick={() => setSelectedTemplate(tpl.id)}
                  className={`p-3 border rounded-sm cursor-pointer transition-all duration-200 ${
                    selectedTemplate === tpl.id 
                      ? 'border-[#387ed1] bg-[#f0f6ff]' 
                      : 'border-[#eeeeee] bg-white hover:border-[#cccccc]'
                  }`}
                >
                  <div className={`text-sm font-medium ${selectedTemplate === tpl.id ? 'text-[#387ed1]' : 'text-[#444444]'}`}>
                    {tpl.name}
                  </div>
                  <div className="text-[10px] text-[#9b9b9b] mt-1 truncate">{tpl.desc}</div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h1 className="text-lg font-medium text-[#444444] mb-1">2. Target Job Description</h1>
            <p className="text-xs text-[#9b9b9b] mb-4">Paste the JD to pull your best projects.</p>
            
            <form onSubmit={handleSearch}>
              <textarea 
                rows="8" 
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste job description here..."
                className="w-full text-sm px-4 py-3 border border-[#eeeeee] rounded-sm bg-white focus:outline-none focus:border-[#387ed1] transition-colors resize-none text-[#444444]"
              />
              <button 
                type="submit" 
                disabled={loadingSearch || !jobDescription.trim()}
                className="mt-4 w-full border border-[#387ed1] text-[#387ed1] py-2.5 rounded-sm text-sm font-medium hover:bg-[#f0f6ff] transition-colors disabled:opacity-50"
              >
                {loadingSearch ? 'Searching Vault...' : 'Retrieve Context'}
              </button>
            </form>
            {error && <p className="text-xs text-red-500 mt-3">{error}</p>}
          </section>
        </div>

        <div className="bg-white border border-[#eeeeee] rounded-sm p-6 flex flex-col" style={{ height: 'calc(100vh - 150px)' }}>
          <h2 className="text-lg font-medium text-[#444444] mb-4 flex items-center justify-between border-b border-[#eeeeee] pb-3">
            Context & Generation
          </h2>

          <div className="flex-grow overflow-y-auto pr-2">
            {!profileData && !loadingSearch && (
              <p className="text-sm text-[#9b9b9b] mt-4">Waiting for context retrieval...</p>
            )}

            {profileData && !generatedResume && !loadingAi && (
              <div className="animate-fade-in">
                <div className="mb-4 p-3 border border-[#eeeeee] bg-[#fdfdfd] rounded-sm flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#387ed1]"></div>
                  <div>
                    <div className="text-sm font-medium text-[#444444]">Context Ready</div>
                    <div className="text-xs text-[#9b9b9b]">Profile & Top {matches.length} matches retrieved.</div>
                  </div>
                </div>
                
                <p className="text-xs text-[#666666] mb-6">
                  The RAG pipeline has isolated your most relevant experiences. Click below to let Gemini rewrite your bullets specifically for this JD.
                </p>

                <button 
                  onClick={handleGenerate}
                  className="w-full bg-[#387ed1] text-white py-3 rounded-sm text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Apply AI Polish & Rewrite (Gemini 3.5 Flash)
                </button>
              </div>
            )}

            {loadingAi && (
              <div className="mt-8 flex flex-col items-center justify-center text-center">
                <div className="w-6 h-6 border-2 border-[#387ed1] border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-sm text-[#444444] font-medium">AI is rewriting your resume...</p>
                <p className="text-xs text-[#9b9b9b] mt-2">Validating JSON structure via Zod.</p>
              </div>
            )}

            {generatedResume && (
              <div className="animate-fade-in">
                <div className="mb-4 flex items-center gap-2">
                  <span className="bg-[#e8f5e9] text-[#2e7d32] border border-[#c8e6c9] text-[10px] px-2 py-0.5 rounded-sm font-medium">
                    Strict JSON Validated
                  </span>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-xs font-bold text-[#444444] uppercase tracking-wide mb-2">Tailored Summary</h3>
                  <p className="text-sm text-[#666666] leading-relaxed">{generatedResume.summary}</p>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-[#444444] uppercase tracking-wide mb-2">Rewritten Projects</h3>
                  <div className="space-y-4">
                    {generatedResume.projects.map((proj, idx) => (
                      <div key={idx} className="border-l-2 border-[#387ed1] pl-3">
                        <div className="text-sm font-medium text-[#444444]">{proj.title}</div>
                        <ul className="list-disc pl-4 mt-2 space-y-1">
                          {proj.bullets.map((bullet, bIdx) => (
                            <li key={bIdx} className="text-xs text-[#666666]">{bullet}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-[#eeeeee]">
                  <button 
                    onClick={handleDownload}
                    disabled={isCompiling}
                    className="w-full bg-[#2e7d32] text-white py-3.5 rounded-sm text-sm font-medium hover:bg-green-700 transition-colors flex justify-center items-center gap-2 disabled:opacity-70"
                  >
                    {isCompiling ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Compiling PDF Engine...
                      </>
                    ) : (
                      'Download Final PDF & Source Code'
                    )}
                  </button>
                  <p className="text-[10px] text-center text-[#9b9b9b] mt-3">
                    Injects the validated JSON into the {templates.find(t => t.id === selectedTemplate)?.name} LaTeX template and compiles instantly.
                  </p>
                </div>

              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

export default Generate
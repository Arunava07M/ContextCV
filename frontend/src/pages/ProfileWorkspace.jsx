import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import ContextLogo from '../components/ContextLogo';

const ProfileWorkspace = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    summary: '',
    skills: [], 
    linkedin: '',
    github: '',
    experience: [],
    education: []
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/profile');
        if (res.data) {
          let safeSkills = [];
          if (res.data.skills && Array.isArray(res.data.skills)) {
            safeSkills = res.data.skills.map(s => {
              if (typeof s === 'string') return { domain: 'Other', items: s };
              return {
                domain: s.domain,
                items: Array.isArray(s.items) ? s.items.join(', ') : s.items
              };
            });
          }

          setProfile({
            ...res.data,
            skills: safeSkills
          });
        }
      } catch (err) {
        console.log('No profile found, ready for creation.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    try {
      const res = await api.post('/profile', profile);
      setProfile({
        ...res.data,
        skills: res.data.skills.map(s => ({
          domain: s.domain,
          items: s.items.join(', ')
        }))
      });
      setMessage({ type: 'success', text: 'Profile updated successfully.' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update profile.' });
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to clear your entire profile?')) return;
    try {
      await api.delete('/profile');
      setProfile({ summary: '', skills: [], experience: [], education: [] });
      setMessage({ type: 'success', text: 'Profile data cleared.' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to clear data.' });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleAddSkillDomain = () => {
    setProfile({
      ...profile,
      skills: [...profile.skills, { domain: '', items: '' }]
    });
  };

  const handleSkillChange = (index, field, value) => {
    const newSkills = [...profile.skills];
    newSkills[index][field] = value;
    setProfile({ ...profile, skills: newSkills });
  };

  const handleRemoveSkillDomain = (index) => {
    const newSkills = profile.skills.filter((_, i) => i !== index);
    setProfile({ ...profile, skills: newSkills });
  };

  const handleAddExperience = () => {
    setProfile({
      ...profile,
      experience: [...profile.experience, { company: '', role: '', startDate: '', endDate: '', current: false, description: '' }]
    });
  };

  const handleExperienceChange = (index, field, value) => {
    const newExp = [...profile.experience];
    newExp[index][field] = value;
    setProfile({ ...profile, experience: newExp });
  };

  const handleRemoveExperience = (index) => {
    const newExp = profile.experience.filter((_, i) => i !== index);
    setProfile({ ...profile, experience: newExp });
  };

  const handleAddEducation = () => {
    setProfile({
      ...profile,
      education: [...profile.education, { institution: '', degree: '', fieldOfStudy: '', yearOfPassing: '' }]
    });
  };

  const handleEducationChange = (index, field, value) => {
    const newEdu = [...profile.education];
    newEdu[index][field] = value;
    setProfile({ ...profile, education: newEdu });
  };

  const handleRemoveEducation = (index) => {
    const newEdu = profile.education.filter((_, i) => i !== index);
    setProfile({ ...profile, education: newEdu });
  };

  if (loading) return <div className="p-6 text-sm text-gray-500">Loading workspace...</div>;

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-gray-800 font-sans pb-20">
      <nav className="bg-white border-b border-gray-200 px-8 py-3 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="text-sm font-medium text-[#387ed1] hover:underline">
            &larr; Back to Dashboard
          </Link>
          <span className="text-gray-300">|</span>
          <div className="flex items-center gap-2 cursor-default">
            <ContextLogo size={18} />
            <span className="text-md font-bold tracking-tight text-gray-800">ContextCV Workspace</span>
          </div>
        </div>
        <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-gray-800 transition-colors">
          Logout
        </button>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-8">
          <div>
            <h1 className="text-xl font-medium text-gray-900">Core Profile</h1>
            <p className="text-xs text-gray-400 mt-1">Configure your indexing metadata and base vectors.</p>
          </div>
          <button
            onClick={handleDelete}
            type="button"
            className="border border-red-200 text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-sm text-xs font-medium transition-colors"
          >
            Clear Data
          </button>
        </div>

        {message.text && (
          <div className={`text-xs p-3 rounded-sm mb-6 border ${
            message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-8">
          
          <div className="bg-white border border-gray-200 rounded-sm p-6">
            <h2 className="text-sm font-medium text-gray-700 uppercase tracking-wider mb-4">Professional Summary</h2>
            <textarea
              rows="4"
              value={profile.summary}
              onChange={(e) => setProfile({ ...profile, summary: e.target.value })}
              placeholder="Brief professional timeline or context blueprint..."
              className="w-full text-sm px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-[#387ed1] focus:ring-1 focus:ring-[#387ed1] transition-colors resize-none"
            />
          </div>
          <div className="bg-white border border-gray-200 rounded-sm p-6">
            <h2 className="text-sm font-medium text-gray-700 uppercase tracking-wider mb-4">Links</h2>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs text-gray-500 mb-1 block">LinkedIn URL</label>
                    <input
                        type="text"
                        value={profile.linkedin}
                        onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                        placeholder="https://linkedin.com/in/yourname"
                        className="w-full text-sm px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-[#387ed1]"
                    />
                </div>
                <div>
                    <label className="text-xs text-gray-500 mb-1 block">GitHub URL</label>
                    <input
                        type="text"
                        value={profile.github}
                        onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                        placeholder="https://github.com/yourname"
                        className="w-full text-sm px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-[#387ed1]"
                    />
                </div>
             </div>
           </div>

          <div className="bg-white border border-gray-200 rounded-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-sm font-medium text-gray-700 uppercase tracking-wider">Core Skills</h2>
                <p className="text-xs text-gray-400 mt-1">Group your skills by domain (e.g. Frontend, Backend, Tools)</p>
              </div>
              <button 
                type="button" 
                onClick={handleAddSkillDomain}
                className="text-xs text-[#387ed1] hover:underline font-medium"
              >
                + Add Domain
              </button>
            </div>
            
            <div className="space-y-4">
              {profile.skills.map((skillGroup, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-1/3">
                    <input
                      type="text"
                      value={skillGroup.domain}
                      onChange={(e) => handleSkillChange(index, 'domain', e.target.value)}
                      placeholder="Domain (e.g. Backend)"
                      className="w-full text-sm px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-[#387ed1]"
                      required
                    />
                  </div>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={skillGroup.items}
                      onChange={(e) => handleSkillChange(index, 'items', e.target.value)}
                      placeholder="Skills (comma separated: Node.js, Express, MongoDB)"
                      className="w-full text-sm px-3 py-2 pr-16 border border-gray-300 rounded-sm focus:outline-none focus:border-[#387ed1]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveSkillDomain(index)}
                      className="absolute right-3 top-2 text-xs text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              {profile.skills.length === 0 && <p className="text-xs text-gray-400 italic">No skill domains added.</p>}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-medium text-gray-700 uppercase tracking-wider">Experience</h2>
              <button type="button" onClick={handleAddExperience} className="text-xs text-[#387ed1] hover:underline font-medium">
                + Add Experience
              </button>
            </div>
            
            <div className="space-y-6">
              {profile.experience.map((exp, index) => (
                <div key={index} className="border border-gray-100 bg-gray-50 p-4 rounded-sm relative">
                  <button type="button" onClick={() => handleRemoveExperience(index)} className="absolute top-4 right-4 text-xs text-red-500 hover:text-red-700">
                    Remove
                  </button>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Company</label>
                      <input type="text" value={exp.company} onChange={(e) => handleExperienceChange(index, 'company', e.target.value)} className="w-full text-sm px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-[#387ed1]" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Role</label>
                      <input type="text" value={exp.role} onChange={(e) => handleExperienceChange(index, 'role', e.target.value)} className="w-full text-sm px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-[#387ed1]" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Start Date</label>
                      <input type="date" value={exp.startDate ? exp.startDate.split('T')[0] : ''} onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)} className="w-full text-sm px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-[#387ed1]" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">End Date</label>
                      <input type="date" value={exp.endDate ? exp.endDate.split('T')[0] : ''} onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)} disabled={exp.current} className="w-full text-sm px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-[#387ed1] disabled:bg-gray-100" />
                      <div className="mt-2 flex items-center">
                        <input type="checkbox" checked={exp.current} onChange={(e) => handleExperienceChange(index, 'current', e.target.checked)} className="mr-2" />
                        <span className="text-xs text-gray-500">I currently work here</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Description</label>
                    <textarea rows="2" value={exp.description} onChange={(e) => handleExperienceChange(index, 'description', e.target.value)} className="w-full text-sm px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-[#387ed1] resize-none" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-medium text-gray-700 uppercase tracking-wider">Education</h2>
              <button type="button" onClick={handleAddEducation} className="text-xs text-[#387ed1] hover:underline font-medium">
                + Add Education
              </button>
            </div>
            
            <div className="space-y-6">
              {profile.education.map((edu, index) => (
                <div key={index} className="border border-gray-100 bg-gray-50 p-4 rounded-sm relative">
                  <button type="button" onClick={() => handleRemoveEducation(index)} className="absolute top-4 right-4 text-xs text-red-500 hover:text-red-700">
                    Remove
                  </button>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Institution</label>
                      <input type="text" value={edu.institution} onChange={(e) => handleEducationChange(index, 'institution', e.target.value)} className="w-full text-sm px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-[#387ed1]" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Degree</label>
                      <input type="text" value={edu.degree} onChange={(e) => handleEducationChange(index, 'degree', e.target.value)} className="w-full text-sm px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-[#387ed1]" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Field of Study</label>
                      <input type="text" value={edu.fieldOfStudy} onChange={(e) => handleEducationChange(index, 'fieldOfStudy', e.target.value)} className="w-full text-sm px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-[#387ed1]" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Graduation Year</label>
                      <input type="number" value={edu.yearOfPassing} onChange={(e) => handleEducationChange(index, 'yearOfPassing', e.target.value)} className="w-full text-sm px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-[#387ed1]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4 flex justify-end">
            <button type="submit" className="bg-[#387ed1] hover:bg-blue-700 text-white px-8 py-2.5 rounded-sm text-sm font-medium tracking-wide shadow-sm transition-colors">
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileWorkspace;
import React, { useState, useEffect, useRef } from 'react';
import { User, Mail, Phone, MapPin, Link2, Award, Plus, Trash2, FileText, ArrowLeft, Image as ImageIcon, Download, GripVertical, Eye, EyeOff, AlertTriangle, Undo2, Redo2, X } from 'lucide-react';

export default function ResumeEditor({ template, userFullName, userEmail, onBack }) {
  const [pageSelection, setPageSelection] = useState('1'); 
  const pageCount = parseInt(pageSelection) || 1;

  const [fontSizeNum, setFontSizeNum] = useState(10); 
  const [fontFamily, setFontFamily] = useState("'Times New Roman', serif");
  const [themeColor, setThemeColor] = useState(template === '2-column' ? '#31414e' : '#f8fafc'); 
  const [themeTextColor, setThemeTextColor] = useState(template === '2-column' ? 'white' : 'black'); 
  const [headSizeSelection, setHeadSizeSelection] = useState('32'); 
  const [headerAlignment, setHeaderAlignment] = useState('left');
  const [photoAlignment, setPhotoAlignment] = useState('left');
  const [activeSection, setActiveSection] = useState('basic-info');
  const [isOverflowing, setIsOverflowing] = useState(false);

  const [personalInfo, setPersonalInfo] = useState({
    name: userFullName || 'Your Name',
    email: userEmail || 'your.email@example.com',
    phone: '+1 (555) 123-4567',
    location: 'City, State',
  });

  const [links, setLinks] = useState([{ id: 1, label: 'LinkedIn', url: '' }]);
  const [showPhoto, setShowPhoto] = useState(true);
  const [photoUrl, setPhotoUrl] = useState('');
  const [summaryContent, setSummaryContent] = useState('Professional Summary goes here...');

  const [sections, setSections] = useState([
    { id: 'summary', title: 'Summary', visible: true, column: 'right', timeline: false },
    { id: 'experience', title: 'Experience', visible: true, column: 'right', timeline: true },
    { id: 'education', title: 'Education', visible: true, column: 'left', timeline: true },
    { id: 'skills', title: 'Skills', visible: true, column: 'left', timeline: false },
  ]);

  const [education, setEducation] = useState([{ id: 1, school: '', degree: '', from: '', to: '' }]);
  const [experience, setExperience] = useState([{ id: 1, role: '', company: '', from: '', to: '', description: '', isBullet: true }]);
  const [skillsData, setSkillsData] = useState([{ id: 1, category: 'Tech', skills: 'React, Node' }]);

  const previewContainerRef = useRef(null);
  const innerContentRef = useRef(null);

  // Persistence Logic
  useEffect(() => {
    const saved = localStorage.getItem('ResumeMaker_Shared_Data');
    if (saved) {
      const s = JSON.parse(saved);
      setPersonalInfo(s.personalInfo);
      setSummaryContent(s.summaryContent);
      // Add other setters as needed...
    }
  }, []);

  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayUpdate = (setter, id, field, value) => {
    setter(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const renderEditorSection = (id) => {
    switch(id) {
      case 'summary':
        return <textarea className="w-full p-2 border rounded" value={summaryContent} onChange={e => setSummaryContent(e.target.value)} rows={4} />;
      case 'experience':
        return experience.map(exp => (
          <div key={exp.id} className="mb-4 p-2 border-b">
            <input className="w-full mb-1 p-1 border rounded" value={exp.role} onChange={e => handleArrayUpdate(setExperience, exp.id, 'role', e.target.value)} placeholder="Job Role" />
            <textarea className="w-full p-1 border rounded" value={exp.description} onChange={e => handleArrayUpdate(setExperience, exp.id, 'description', e.target.value)} placeholder="Description" />
          </div>
        ));
      case 'education':
        return education.map(edu => (
          <div key={edu.id} className="mb-2">
            <input className="w-full p-1 border rounded" value={edu.school} onChange={e => handleArrayUpdate(setEducation, edu.id, 'school', e.target.value)} placeholder="School" />
          </div>
        ));
      case 'skills':
        return skillsData.map(sk => (
          <div key={sk.id} className="mb-2">
            <input className="w-full p-1 border rounded" value={sk.skills} onChange={e => handleArrayUpdate(setSkillsData, sk.id, 'skills', e.target.value)} placeholder="Skills" />
          </div>
        ));
      default: return <p className="text-xs text-gray-400">Section content editor coming soon...</p>;
    }
  };

  const picSize = `${template === '2-column' ? 120 : 100}px`;

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-100 overflow-hidden">
      {/* LEFT PANEL */}
      <div className="w-full lg:w-[40%] h-full overflow-y-auto bg-white border-r p-6">
        <button onClick={onBack} className="flex items-center gap-2 text-blue-600 font-bold mb-6"><ArrowLeft size={18}/> Back</button>
        <h1 className="text-2xl font-bold mb-8">Edit Resume</h1>
        
        <section className="mb-10">
          <h2 className="font-bold text-lg mb-4 border-b pb-2">Personal Details</h2>
          <input className="w-full mb-3 p-2 border rounded" name="name" value={personalInfo.name} onChange={handlePersonalInfoChange} placeholder="Full Name" />
          <input className="w-full mb-3 p-2 border rounded" name="email" value={personalInfo.email} onChange={handlePersonalInfoChange} placeholder="Email" />
        </section>

        {sections.map(s => (
          <div key={s.id} className="mb-6 p-4 bg-slate-50 rounded-lg border">
            <h3 className="font-bold mb-3">{s.title}</h3>
            {renderEditorSection(s.id)}
          </div>
        ))}
      </div>

      {/* RIGHT PREVIEW */}
      <div className="flex-1 h-full bg-gray-200 p-8 overflow-y-auto flex flex-col items-center">
        <div 
          ref={previewContainerRef}
          className="bg-white shadow-2xl overflow-hidden"
          style={{ width: '816px', minHeight: '1056px', height: `${pageCount * 1056}px` }}
        >
          <div id="resume-preview-content" ref={innerContentRef} className="p-12 h-full flex flex-col" style={{ fontFamily }}>
            <div className="flex items-center gap-8 mb-10 pb-8 border-b" style={{ backgroundColor: template === '2-column' ? themeColor : 'transparent', color: template === '2-column' ? 'white' : 'black', padding: '40px' }}>
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-2">{personalInfo.name}</h1>
                <p>{personalInfo.email} | {personalInfo.phone}</p>
              </div>
            </div>
            
            <div className="flex-1">
              {sections.filter(s => s.visible).map(s => (
                <div key={s.id} className="mb-6">
                  <h2 className="text-xl font-bold border-b-2 mb-2 uppercase tracking-wide">{s.title}</h2>
                  {s.id === 'summary' && <p>{summaryContent}</p>}
                  {s.id === 'experience' && experience.map(exp => <div key={exp.id} className="mb-4"><strong>{exp.role}</strong><p>{exp.description}</p></div>)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

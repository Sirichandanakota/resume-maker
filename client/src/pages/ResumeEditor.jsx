import React, { useState, useEffect, useRef } from 'react';
import { User, Mail, Phone, MapPin, Link2, Award, Plus, Trash2, FileText, ArrowLeft, Image as ImageIcon, Download, GripVertical, Eye, EyeOff, AlertTriangle, Undo2, Redo2, X } from 'lucide-react';

export default function ResumeEditor({ template, userFullName, userEmail, onBack }) {
  // --- STATE MANAGEMENT ---
  const [pageSelection, setPageSelection] = useState('1'); 
  const [customPageCount, setCustomPageCount] = useState(5);
  const pageCount = pageSelection === 'custom' ? customPageCount : parseInt(pageSelection);

  const [fontSizeNum, setFontSizeNum] = useState(10); 
  const [fontFamily, setFontFamily] = useState("'Times New Roman', serif");
  const [themeColor, setThemeColor] = useState(template === '2-column' ? '#31414e' : '#f8fafc'); 
  const [themeTextColor, setThemeTextColor] = useState(template === '2-column' ? 'white' : 'black'); 
  
  const [headSizeSelection, setHeadSizeSelection] = useState('32'); 
  const [customHeadSize, setCustomHeadSize] = useState(32);
  const [headerAlignment, setHeaderAlignment] = useState('left');
  const [photoAlignment, setPhotoAlignment] = useState('left');
  const [activeSection, setActiveSection] = useState('basic-info');
  
  const activeHeadSize = headSizeSelection === 'custom' ? customHeadSize : Number(headSizeSelection);
  const [isOverflowing, setIsOverflowing] = useState(false);

  // --- DEFAULT DATA (As per your Mixed Code) ---
  const [personalInfo, setPersonalInfo] = useState({
    name: userFullName || 'Rahul Sharma',
    email: userEmail || 'rahul.sharma@example.com',
    phone: '+91 98765 43210',
    location: 'Bangalore, India',
  });

  const [links, setLinks] = useState([{ id: 1, label: 'LinkedIn', url: 'linkedin.com/in/rahulsharma' }]);
  const [showPhoto, setShowPhoto] = useState(true);
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoFileName, setPhotoFileName] = useState('');
  const [summaryContent, setSummaryContent] = useState('Passionate software engineer with 5+ years of experience building scalable web applications and intuitive user interfaces. Highly adept at independent project management, collaborating with cross-functional teams, and driving business growth through technical innovation.');

  const [sections, setSections] = useState([
    { id: 'education', title: 'Education', visible: true, column: 'left', timeline: true },
    { id: 'summary', title: 'Professional Summary', visible: true, column: 'right', timeline: false },
    { id: 'experience', title: 'Experience', visible: true, column: 'right', timeline: true },
    { id: 'projects', title: 'Projects', visible: true, column: 'right', timeline: false },
    { id: 'skills', title: 'Skills', visible: true, column: 'left', timeline: false },
    { id: 'certifications', title: 'Certifications', visible: true, column: 'left', timeline: false },
    { id: 'achievements', title: 'Achievements', visible: true, column: 'left', timeline: false },
    { id: 'custom-default', title: 'Languages / Interests', visible: false, column: 'left', timeline: false }
  ]);

  const [customSectionsData, setCustomSectionsData] = useState({
    'custom-default': { title: 'Languages / Interests', items: [{ id: 1, title: '', subtitle: '', description: '' }] }
  });

  const [education, setEducation] = useState([{ id: 1, degree: 'B.Tech in Computer Science', school: 'National Institute of Technology', from: 'Aug 2023', to: 'May 2027', cgpa: '8.5 / 10' }]);
  const [skillsFormat, setSkillsFormat] = useState('categorized');
  const [skillsContent, setSkillsContent] = useState('JavaScript, TypeScript, React, Node.js, Python, SQL, Git');
  const [skillsData, setSkillsData] = useState([
    { id: 1, category: 'Programming', skills: 'JavaScript, TypeScript, Python, Java' },
    { id: 2, category: 'Frameworks', skills: 'React, Next.js, Node.js, Django' }
  ]);

  const [experience, setExperience] = useState([{
    id: 1, role: 'Senior Software Engineer', company: 'Tech Solutions Inc.', from: 'Jan 2022', to: 'Present', isBullet: true,
    description: 'Lead a team of 4 developers to build a modern e-commerce platform using React and Next.js, scaling to over 1 million users.\nImproved overall site performance by 40% through advanced code splitting and intelligent lazy loading.\nMentored junior engineers and established comprehensive code review guidelines.'
  }]);

  const [projects, setProjects] = useState(() => {
    const p1 = { id: 1, title: 'E-commerce Platform Refactor', tech: 'React, Node.js, MongoDB, Tailwind CSS', isBullet: true, description: 'Overhauled the legacy frontend architecture, resulting in a verifiable 25% increase in overall user retention.' };
    const p2 = { id: 2, title: 'Task Management Application', tech: 'TypeScript, React, Firebase', isBullet: true, description: 'Built a real-time, scalable task management tool currently utilized by over 500+ active daily enterprise users.' };
    return template === '1-column' ? [p1, p2] : [p1, p2, { id: 3, title: 'Portfolio Generator', tech: 'React, Tailwind CSS', isBullet: true, description: 'Created a popular open-source portfolio generator that empowers developers to beautifully showcase their personal work.' }];
  });

  const [certifications, setCertifications] = useState([{ id: 1, text: 'AWS Certified Solutions Architect' }, { id: 2, text: 'React Native Specialist Certification' }]);
  const [achievements, setAchievements] = useState([{ id: 1, text: 'Best Developer Award 2022' }, { id: 2, text: 'Winner - Global Hackathon 2021' }]);

  const [isDownloading, setIsDownloading] = useState(false);
  const previewContainerRef = useRef(null);
  const innerContentRef = useRef(null);

  // --- HISTORY & PERSISTENCE ---
  const historyRef = useRef([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const isRestoring = useRef(false);
  const isReadyForHistory = useRef(false);

  useEffect(() => {
    const saved = localStorage.getItem('ResumeMaker_Shared_Data');
    if (saved) {
      restoreState(saved);
    } else {
      if (template === '1-column') { setFontSizeNum(10); setHeadSizeSelection('0'); setThemeColor('#f8fafc'); setThemeTextColor('black'); }
      else { setFontSizeNum(11); setHeadSizeSelection('32'); setThemeColor('#31414e'); setThemeTextColor('white'); }
    }
    setTimeout(() => { isReadyForHistory.current = true; }, 800);
  }, [template]);

  useEffect(() => {
    if (!isReadyForHistory.current) return;
    if (isRestoring.current) { isRestoring.current = false; return; }
    const currentState = JSON.stringify({ personalInfo, links, showPhoto, photoUrl, photoFileName, sections, customSectionsData, education, experience, projects, skillsContent, skillsData, skillsFormat, certifications, achievements, summaryContent, pageSelection, customPageCount, fontSizeNum, fontFamily, themeColor, themeTextColor, headSizeSelection, customHeadSize, headerAlignment, photoAlignment });
    localStorage.setItem('ResumeMaker_Shared_Data', currentState);
    if (historyIndex >= 0 && historyRef.current[historyIndex] === currentState) return;
    const newHistory = historyRef.current.slice(0, historyIndex + 1);
    newHistory.push(currentState);
    historyRef.current = newHistory;
    setHistoryIndex(newHistory.length - 1);
  }, [personalInfo, links, showPhoto, photoUrl, photoFileName, sections, customSectionsData, education, experience, projects, skillsContent, skillsData, skillsFormat, certifications, achievements, summaryContent, pageSelection, customPageCount, fontSizeNum, fontFamily, themeColor, themeTextColor, headSizeSelection, customHeadSize, headerAlignment, photoAlignment]);

  const undo = () => { if (historyIndex > 0) { isRestoring.current = true; setHistoryIndex(historyIndex - 1); restoreState(historyRef.current[historyIndex - 1]); } };
  const redo = () => { if (historyIndex < historyRef.current.length - 1) { isRestoring.current = true; setHistoryIndex(historyIndex + 1); restoreState(historyRef.current[historyIndex + 1]); } };

  const restoreState = (stateStr) => {
    const s = JSON.parse(stateStr);
    setPersonalInfo(s.personalInfo); setLinks(s.links); setShowPhoto(s.showPhoto); setPhotoUrl(s.photoUrl); setPhotoFileName(s.photoFileName || '');
    setSections(s.sections); setCustomSectionsData(s.customSectionsData); setEducation(s.education); setExperience(s.experience); setProjects(s.projects);
    setSkillsContent(s.skillsContent); if(s.skillsData) setSkillsData(s.skillsData); if(s.skillsFormat) setSkillsFormat(s.skillsFormat);
    setCertifications(s.certifications); setAchievements(s.achievements); setSummaryContent(s.summaryContent);
    if (s.fontSizeNum !== undefined) setFontSizeNum(s.fontSizeNum); if (s.themeColor !== undefined) setThemeColor(s.themeColor); if (s.themeTextColor !== undefined) setThemeTextColor(s.themeTextColor);
    if (s.headSizeSelection !== undefined) setHeadSizeSelection(s.headSizeSelection); if (s.headerAlignment !== undefined) setHeaderAlignment(s.headerAlignment);
  };

  // --- HANDLERS ---
  const handlePersonalInfoChange = (e) => { const { name, value } = e.target; setPersonalInfo(p => ({ ...p, [name]: value })); };
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };
  const handleArrayUpdate = (setter, id, field, value) => { setter(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item)); };
  const handleArrayAdd = (setter, defaultObj) => { setter(prev => [...prev, { id: Date.now(), ...defaultObj }]); };
  const handleArrayRemove = (setter, id) => { setter(prev => prev.filter(item => item.id !== id)); };

  const handleAddCustomSection = () => {
    const id = `custom-${Date.now()}`;
    setCustomSectionsData(p => ({ ...p, [id]: { title: 'New Custom Section', items: [{ id: Date.now(), title: '', subtitle: '', description: '' }] } }));
    setSections(p => [...p, { id, title: 'New Custom Section', visible: true, column: 'left', timeline: false }]);
  };
  const updateCustomSectionTitle = (id, val) => {
    setCustomSectionsData(p => ({ ...p, [id]: { ...p[id], title: val } }));
    setSections(p => p.map(s => s.id === id ? { ...s, title: val || 'Custom Section' } : s));
  };
  const updateCustomItem = (sid, iid, f, v) => { setCustomSectionsData(p => ({ ...p, [sid]: { ...p[sid], items: p[sid].items.map(i => i.id === iid ? { ...i, [f]: v } : i) } })); };
  const deleteCustomSection = (id) => { setSections(p => p.filter(s => s.id !== id)); setCustomSectionsData(p => { const n = { ...p }; delete n[id]; return n; }); };

  const [draggedIdx, setDraggedIdx] = useState(null);
  const handleDragStart = (e, i) => { setDraggedIdx(i); e.dataTransfer.effectAllowed = 'move'; };
  const handleDrop = (e, i) => {
    e.preventDefault(); if (draggedIdx === null || draggedIdx === i) return;
    const n = [...sections]; const d = n[draggedIdx]; n.splice(draggedIdx, 1); n.splice(i, 0, d);
    setSections(n); setDraggedIdx(null);
  };
  const toggleSectionVisibility = (id) => { setSections(p => p.map(s => s.id === id ? { ...s, visible: !s.visible } : s)); };
  const toggleSectionColumn = (id, col) => { setSections(p => p.map(s => s.id === id ? { ...s, column: col } : s)); };
  const toggleSectionTimeline = (id) => { setSections(p => p.map(s => s.id === id ? { ...s, timeline: !s.timeline } : s)); };

  // --- PDF & OVERFLOW (Standard Logic) ---
  const generateExactPDF = async () => {
    setIsDownloading(true);
    if (!window.html2pdf) {
      const script = document.createElement('script'); script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      await new Promise(r => { script.onload = r; document.body.appendChild(script); });
    }
    const element = document.getElementById('resume-preview-content');
    const opt = { margin: 0, filename: 'Resume.pdf', image: { type: 'jpeg', quality: 1 }, html2canvas: { scale: 2, useCORS: true }, jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' } };
    await window.html2pdf().set(opt).from(element).save();
    setIsDownloading(false);
  };

  // --- RENDER HELPERS ---
  const sSm = { fontSize: `${Math.max(8, fontSizeNum - 2)}px` };
  const sBase = { fontSize: `${fontSizeNum}px` };
  const sLg = { fontSize: `${fontSizeNum + 2}px` };
  const sXl = { fontSize: `${fontSizeNum + 6}px` };
  const sTitle = { fontSize: `${fontSizeNum + 20}px` };
  const picSizeStr = `${template === '2-column' ? Math.max(50, Math.min(180, (activeHeadSize / 32) * 125)) : Math.max(50, Math.min(180, 125 + (activeHeadSize * 1.3)))}px`;

  const renderDescription = (desc, isBullet, color, size) => {
    if (!desc) return null;
    if (isBullet !== false) return <ul className="list-disc pl-5 mt-1" style={{...size, color}}>{desc.split('\n').filter(l => l.trim()).map((l, i) => <li key={i} className="mb-0.5 leading-relaxed">{l}</li>)}</ul>;
    return <p style={{...size, color}} className="whitespace-pre-wrap leading-relaxed mt-1">{desc}</p>;
  };

  const renderTimelineItem = (content, id, timeline, mode) => {
    const bColor = mode === 'themed' && themeTextColor === 'white' ? 'rgba(255,255,255,0.3)' : '#e2e8f0';
    const dColor = mode === 'themed' && themeTextColor === 'white' ? 'white' : '#0f172a';
    if (timeline) return <div key={id} className="relative pl-4 border-l pb-3 last:pb-0" style={{ borderLeftColor: bColor }}><div className="absolute w-2 h-2 rounded-full -left-[4.5px] top-1.5" style={{ backgroundColor: dColor }}></div>{content}</div>;
    return <div key={id} className="mb-3 last:mb-0">{content}</div>;
  };

  const renderPreviewSection = (id, mode = 'standard') => {
    const section = sections.find(s => s.id === id);
    if (!section) return null;
    const h = mode === 'themed' && themeTextColor === 'white' ? '#ffffff' : '#0f172a';
    const p = mode === 'themed' && themeTextColor === 'white' ? '#f1f5f9' : '#334155';
    const m = mode === 'themed' && themeTextColor === 'white' ? '#cbd5e1' : '#64748b';
    const b = mode === 'themed' && themeTextColor === 'white' ? 'rgba(255,255,255,0.3)' : '#e2e8f0';
    const style = activeSection === id ? { outline: '3px solid #0f172a', outlineOffset: '-3px' } : {};

    if (id.startsWith('custom')) {
      const d = customSectionsData[id]; if (!d || !d.items.some(i => i.title || i.description)) return null;
      return <section key={id} className="mb-4" style={style}><h2 style={{...sXl, color: h, borderBottomColor: b}} className="font-bold mb-2 uppercase border-b pb-1">{d.title}</h2>{d.items.map(i => (i.title || i.description) && renderTimelineItem(<div className="block">{i.title && <h3 style={{...sLg, color: h}} className="font-bold">{i.title}</h3>}{i.subtitle && <div style={{...sSm, color: p}}>{i.subtitle}</div>}{i.description && renderDescription(i.description, i.isBullet, p, sBase)}</div>, i.id, section.timeline, mode))}</section>;
    }

    switch(id) {
      case 'summary': return summaryContent && <section key="summary" className="mb-4" style={style}><h2 style={{...sXl, color: h, borderBottomColor: b}} className="font-bold mb-2 uppercase border-b pb-1">Professional Summary</h2>{renderTimelineItem(<p style={{...sBase, color: p}} className="whitespace-pre-wrap leading-relaxed">{summaryContent}</p>, 'sum', section.timeline, mode)}</section>;
      case 'education': return education.length > 0 && <section key="edu" className="mb-4" style={style}><h2 style={{...sXl, color: h, borderBottomColor: b}} className="font-bold mb-2 uppercase border-b pb-1">Education</h2>{education.map(e => renderTimelineItem(<div><div className="flex justify-between items-baseline"><h3 style={{...sLg, color: h}} className="font-bold">{e.school}</h3>{template==='1-column'&&<span style={{...sSm, color: m}} className="font-bold">{e.from}-{e.to}</span>}</div><div style={{...sSm, color: p}} className="uppercase">{e.degree} | {template==='2-column'&&<span className="font-bold">{e.from}-{e.to}</span>}</div>{e.cgpa && <div style={{...sSm, color: p}}>CGPA: {e.cgpa}</div>}</div>, e.id, section.timeline, mode))}</section>;
      case 'experience': return experience.length > 0 && <section key="exp" className="mb-4" style={style}><h2 style={{...sXl, color: h, borderBottomColor: b}} className="font-bold mb-2 uppercase border-b pb-1">Experience</h2>{experience.map(e => renderTimelineItem(<div><div className="flex justify-between items-baseline"><h3 style={{...sLg, color: h}} className="font-bold">{e.role}</h3>{template==='1-column'&&<span style={{...sSm, color: m}} className="font-bold">{e.from}-{e.to}</span>}</div><div style={{...sSm, color: p}} className="uppercase">{e.company} | {template==='2-column'&&<span className="font-bold">{e.from}-{e.to}</span>}</div>{renderDescription(e.description, e.isBullet, p, sBase)}</div>, e.id, section.timeline, mode))}</section>;
      case 'projects': return projects.length > 0 && <section key="proj" className="mb-4" style={style}><h2 style={{...sXl, color: h, borderBottomColor: b}} className="font-bold mb-2 uppercase border-b pb-1">Projects</h2>{projects.map(e => renderTimelineItem(<div><h3 style={{...sLg, color: h}} className="font-bold">{e.title}</h3><div style={{...sSm, color: m}} className="italic">{e.tech}</div>{renderDescription(e.description, e.isBullet, p, sBase)}</div>, e.id, section.timeline, mode))}</section>;
      case 'skills': return <div key="skills" className="mb-4" style={style}><h2 style={{...sXl, color: h, borderBottomColor: b}} className="font-bold mb-2 uppercase border-b pb-1">Skills</h2>{renderTimelineItem(skillsFormat === 'categorized' ? <div className="space-y-1">{skillsData.map(i => i.category && <div key={i.id} style={{...sBase, color: p}}><span style={{color: h}} className="mr-1 font-bold">{i.category}:</span>{i.skills}</div>)}</div> : <div style={{...sBase, color: p}}>{skillsContent}</div>, 'sk', section.timeline, mode)}</div>;
      case 'certifications': return certifications.length > 0 && <div key="cert" className="mb-4" style={style}><h2 style={{...sXl, color: h, borderBottomColor: b}} className="font-bold uppercase border-b pb-1">Certifications</h2>{certifications.map(c => renderTimelineItem(<div style={{...sBase, color: p}}>{c.text}</div>, c.id, section.timeline, mode))}</div>;
      case 'achievements': return achievements.length > 0 && <div key="ach" className="mb-4" style={style}><h2 style={{...sXl, color: h, borderBottomColor: b}} className="font-bold uppercase border-b pb-1">Achievements</h2>{achievements.map(c => renderTimelineItem(<div style={{...sBase, color: p}}>{c.text}</div>, c.id, section.timeline, mode))}</div>;
      default: return null;
    }
  };

  const renderEditorSection = (id) => {
    if (id.startsWith('custom')) {
      const d = customSectionsData[id];
      return <div className="space-y-3"><input type="text" value={d.title} onChange={e=>updateCustomSectionTitle(id, e.target.value)} className="w-full p-2 border rounded mb-2 font-bold" />{d.items.map(i=><div key={i.id} className="p-3 bg-white border rounded"><input value={i.title} onChange={e=>updateCustomItem(id, i.id, 'title', e.target.value)} className="w-full p-1 border-b mb-2" placeholder="Title"/><textarea value={i.description} onChange={e=>updateCustomItem(id, i.id, 'description', e.target.value)} className="w-full p-1 text-sm" placeholder="Description"/></div>)}<button onClick={()=>addCustomItem(id)} className="text-blue-600 text-xs">+ Add Item</button></div>;
    }
    switch(id) {
      case 'summary': return <textarea value={summaryContent} onChange={e=>setSummaryContent(e.target.value)} className="w-full p-2 border rounded" rows={4} />;
      case 'education': return education.map(e=><div key={e.id} className="p-2 border rounded mb-2"><input value={e.school} onChange={v=>handleArrayUpdate(setEducation, e.id, 'school', v.target.value)} className="w-full mb-1 p-1 border-b" placeholder="School"/><input value={e.degree} onChange={v=>handleArrayUpdate(setEducation, e.id, 'degree', v.target.value)} className="w-full p-1 text-sm" placeholder="Degree"/></div>);
      case 'experience': return experience.map(e=><div key={e.id} className="p-2 border rounded mb-2"><input value={e.role} onChange={v=>handleArrayUpdate(setExperience, e.id, 'role', v.target.value)} className="w-full mb-1 p-1 border-b" placeholder="Role"/><textarea value={e.description} onChange={v=>handleArrayUpdate(setExperience, e.id, 'description', v.target.value)} className="w-full p-1 text-sm" placeholder="Description"/></div>);
      case 'projects': return projects.map(e=><div key={e.id} className="p-2 border rounded mb-2"><input value={e.title} onChange={v=>handleArrayUpdate(setProjects, e.id, 'title', v.target.value)} className="w-full mb-1 p-1 border-b" placeholder="Project"/><input value={e.tech} onChange={v=>handleArrayUpdate(setProjects, e.id, 'tech', v.target.value)} className="w-full p-1 text-sm" placeholder="Tech"/></div>);
      case 'skills': return <div className="space-y-2">{skillsFormat==='categorized'&&skillsData.map(s=><div key={s.id} className="flex gap-2"><input value={s.category} onChange={v=>handleArrayUpdate(setSkillsData, s.id, 'category', v.target.value)} className="w-1/3 p-1 border rounded"/><input value={s.skills} onChange={v=>handleArrayUpdate(setSkillsData, s.id, 'skills', v.target.value)} className="w-2/3 p-1 border rounded"/></div>)}</div>;
      case 'certifications': return certifications.map(c=><input key={c.id} value={c.text} onChange={v=>handleArrayUpdate(setCertifications, c.id, 'text', v.target.value)} className="w-full p-1 border rounded mb-1"/>);
      case 'achievements': return achievements.map(c=><input key={c.id} value={c.text} onChange={v=>handleArrayUpdate(setAchievements, c.id, 'text', v.target.value)} className="w-full p-1 border rounded mb-1"/>);
      default: return null;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-100 overflow-hidden font-sans">
      <div className="w-full lg:w-[45%] h-full overflow-y-auto bg-slate-50 border-r border-gray-200 shadow-lg z-10 p-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="flex items-center gap-1 text-blue-600 font-bold hover:text-blue-800"><ArrowLeft size={18}/> Back</button>
          <h1 className="text-xl font-bold text-slate-800">Editor</h1>
        </div>

        <section className={`bg-white p-5 rounded-lg border mb-6 ${activeSection === 'basic-info' ? 'border-slate-800 ring-1' : 'border-gray-200'}`} onClickCapture={()=>setActiveSection('basic-info')}>
          <h2 className="font-bold border-b pb-2 mb-4">Basic Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="name" value={personalInfo.name} onChange={handlePersonalInfoChange} className="md:col-span-2 p-2 border rounded" placeholder="Full Name"/>
            <input name="email" value={personalInfo.email} onChange={handlePersonalInfoChange} className="p-2 border rounded" placeholder="Email"/>
            <input name="phone" value={personalInfo.phone} onChange={handlePersonalInfoChange} className="p-2 border rounded" placeholder="Phone"/>
            <input name="location" value={personalInfo.location} onChange={handlePersonalInfoChange} className="md:col-span-2 p-2 border rounded" placeholder="Location"/>
          </div>
        </section>

        <div className="space-y-4">
          {sections.map((s,i)=>(
            <div key={s.id} className={`bg-white rounded-lg border ${activeSection===s.id?'border-slate-800 ring-1':'border-gray-200'}`} onClickCapture={()=>setActiveSection(s.id)}>
              <div draggable onDragStart={e=>handleDragStart(e,i)} onDrop={e=>handleDrop(e,i)} onDragOver={e=>e.preventDefault()} className="p-3 border-b flex justify-between bg-slate-50 cursor-grab">
                <span className="font-bold flex items-center gap-2"><GripVertical size={16}/>{s.title}</span>
                <div className="flex gap-1">
                  {template==='2-column'&&<button onClick={()=>toggleSectionColumn(s.id, s.column==='left'?'right':'left')} className="text-[10px] px-2 bg-slate-200 rounded">{s.column==='left'?'L':'R'}</button>}
                  <button onClick={()=>toggleSectionTimeline(s.id)} className={`text-[10px] px-2 rounded ${s.timeline?'bg-blue-600 text-white':'bg-slate-200'}`}>Line</button>
                  <button onClick={()=>toggleSectionVisibility(s.id)} className="p-1">{s.visible?<Eye size={16}/>:<EyeOff size={16}/>}</button>
                </div>
              </div>
              {s.visible && <div className="p-4 bg-slate-50">{renderEditorSection(s.id)}</div>}
            </div>
          ))}
          <button onClick={handleAddCustomSection} className="w-full py-3 border-2 border-dashed border-blue-300 text-blue-600 rounded-lg font-medium">+ Add Custom Section</button>
        </div>
      </div>

      <div className="flex-1 h-full bg-gray-200 p-8 overflow-y-auto flex flex-col items-center">
        <div className="w-full max-w-[816px] bg-white p-4 rounded-xl shadow mb-4 flex items-center justify-between">
          <div className="flex gap-2">
            <button onClick={undo} disabled={historyIndex<=0} className="p-2 bg-slate-100 rounded disabled:opacity-50"><Undo2 size={18}/></button>
            <button onClick={redo} disabled={historyIndex>=historyRef.current.length-1} className="p-2 bg-slate-100 rounded disabled:opacity-50"><Redo2 size={18}/></button>
          </div>
          <div className="flex gap-4 items-center">
            <input type="number" value={fontSizeNum} onChange={e=>setFontSizeNum(Number(e.target.value))} className="w-12 border rounded p-1 text-center" />
            <input type="color" value={themeColor} onChange={e=>setThemeColor(e.target.value)} className="w-8 h-8 cursor-pointer" />
            <button onClick={generateExactPDF} disabled={isDownloading} className="bg-yellow-400 text-yellow-900 px-6 py-2 rounded-lg font-bold shadow hover:bg-yellow-500">{isDownloading?'...':'Download PDF'}</button>
          </div>
        </div>

        <div ref={previewContainerRef} className="bg-white shadow-2xl overflow-hidden" style={{ width: '816px', height: `${pageCount * 1056}px` }}>
          <div id="resume-preview-content" ref={innerContentRef} className="w-full h-full flex flex-col" style={{ fontFamily }}>
            {template === '1-column' ? (
              <div className="flex-1 px-10">
                <div className="text-center py-10" style={{ backgroundColor: themeColor, paddingTop: `${activeHeadSize}px`, color: headHColor }}>
                   {showPhoto && photoUrl && <img src={photoUrl} style={{width:picSizeStr, height:picSizeStr}} className="mx-auto rounded-full object-cover mb-4"/>}
                   <h1 style={sTitle} className="font-bold">{personalInfo.name}</h1>
                   <p style={sSm}>{personalInfo.email} | {personalInfo.phone} | {personalInfo.location}</p>
                </div>
                {sections.filter(s=>s.visible).map(s=>renderPreviewSection(s.id))}
              </div>
            ) : (
              <div className="flex flex-row flex-1 items-stretch h-full">
                <div className="p-8 h-full" style={{ backgroundColor: themeColor, width: `${activeHeadSize}%`, color: headTextColor }}>
                  {showPhoto && photoUrl && <img src={photoUrl} style={{width:picSizeStr, height:picSizeStr}} className="rounded-full object-cover mb-5"/>}
                  <h1 style={sTitle} className="font-bold leading-tight mb-4">{personalInfo.name}</h1>
                  <p style={sSm} className="mb-6">{personalInfo.email}<br/>{personalInfo.phone}</p>
                  {sections.filter(s=>s.visible && s.column==='left').map(s=>renderPreviewSection(s.id, 'themed'))}
                </div>
                <div className="p-8 flex-1 bg-white">
                  {sections.filter(s=>s.visible && s.column==='right').map(s=>renderPreviewSection(s.id))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

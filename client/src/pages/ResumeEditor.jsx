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

  const [personalInfo, setPersonalInfo] = useState({
    name: userFullName || 'Rahul Sharma',
    email: userEmail || 'rahul.sharma@example.com',
    phone: '+91 98765 43210',
    location: 'Bangalore, India',
  });

  const [links, setLinks] = useState([
    { id: 1, label: 'LinkedIn', url: 'linkedin.com/in/rahulsharma' }
  ]);

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
    'custom-default': {
      title: 'Languages / Interests',
      items: [{ id: 1, title: '', subtitle: '', description: '' }]
    }
  });

  const [education, setEducation] = useState([
    { id: 1, degree: 'B.Tech in Computer Science', school: 'National Institute of Technology', from: 'Aug 2023', to: 'May 2027', cgpa: '8.5 / 10' }
  ]);

  const [skillsFormat, setSkillsFormat] = useState('categorized');
  const [skillsContent, setSkillsContent] = useState('JavaScript, TypeScript, React, Node.js, Python, SQL, Git');
  const [skillsData, setSkillsData] = useState([
    { id: 1, category: 'Programming', skills: 'JavaScript, TypeScript, Python, Java' },
    { id: 2, category: 'Frameworks', skills: 'React, Next.js, Node.js, Django' }
  ]);

  const [experience, setExperience] = useState([
    {
      id: 1, role: 'Senior Software Engineer', company: 'Tech Solutions Inc.', from: 'Jan 2022', to: 'Present', isBullet: true,
      description: 'Lead a team of 4 developers to build a modern e-commerce platform using React and Next.js, scaling to over 1 million users.\nImproved overall site performance by 40% through advanced code splitting and intelligent lazy loading.\nMentored junior engineers and established comprehensive code review guidelines.'
    }
  ]);

  const [projects, setProjects] = useState(() => {
    const p1 = { id: 1, title: 'E-commerce Platform Refactor', tech: 'React, Node.js, MongoDB', isBullet: true, description: 'Overhauled legacy architecture resulting in 25% increase in retention.\nImplemented secure payment gateway.' };
    const p2 = { id: 2, title: 'Task Management App', tech: 'TypeScript, React, Firebase', isBullet: true, description: 'Built real-time Kanban board for enterprise users.\nSet up automated CI/CD pipelines.' };
    return template === '1-column' ? [p1, p2] : [p1, p2, { id: 3, title: 'Portfolio Generator', tech: 'React, Tailwind', isBullet: true, description: 'Open-source tool with markdown support.\nAchieved 1k stars on GitHub.' }];
  });

  const [certifications, setCertifications] = useState([{ id: 1, text: 'AWS Certified Solutions Architect' }]);
  const [achievements, setAchievements] = useState([{ id: 1, text: 'Best Developer Award 2022' }]);

  const [isDownloading, setIsDownloading] = useState(false);
  const previewContainerRef = useRef(null);
  const innerContentRef = useRef(null);

  // --- UNDO / REDO HISTORY ---
  const historyRef = useRef([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const isRestoring = useRef(false);
  const isReadyForHistory = useRef(false);

  useEffect(() => {
    let saved = localStorage.getItem('ResumeMaker_Shared_Data');
    if (saved) {
       const state = JSON.parse(saved);
       restoreState(saved);
       if (template === '1-column') {
         setFontSizeNum(10); setHeadSizeSelection('0'); setThemeColor('#f8fafc'); setThemeTextColor('black');
       } else {
         setFontSizeNum(11); setHeadSizeSelection('32'); setThemeColor('#31414e'); setThemeTextColor('white');
       }
    }
    const timer = setTimeout(() => { isReadyForHistory.current = true; }, 800);
    return () => clearTimeout(timer);
  }, [template]);

  useEffect(() => {
    if (!isReadyForHistory.current || isRestoring.current) { isRestoring.current = false; return; }
    const currentState = JSON.stringify({
      personalInfo, links, showPhoto, photoUrl, photoFileName, sections, customSectionsData,
      education, experience, projects, skillsContent, skillsData, skillsFormat, certifications, achievements, summaryContent,
      pageSelection, customPageCount, fontSizeNum, fontFamily, themeColor, themeTextColor, headSizeSelection, customHeadSize, headerAlignment, photoAlignment
    });
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

  // --- OVERFLOW DETECTION ---
  useEffect(() => {
    const check = () => {
      if (previewContainerRef.current && innerContentRef.current) {
        setIsOverflowing(innerContentRef.current.scrollHeight > (previewContainerRef.current.clientHeight + 2));
      }
    };
    check();
    const obs = new ResizeObserver(check);
    if (innerContentRef.current) obs.observe(innerContentRef.current);
    return () => obs.disconnect();
  }, [personalInfo, links, education, experience, projects, skillsContent, skillsData, skillsFormat, certifications, achievements, customSectionsData, summaryContent, template, sections, fontSizeNum, fontFamily, pageCount, showPhoto, themeColor, themeTextColor, activeHeadSize, headerAlignment, photoAlignment]);

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

  // Reorder / Toggles
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

  // --- PDF GENERATION ---
  const processPDF = () => {
    return new Promise((resolve, reject) => {
      const element = document.getElementById('resume-preview-content');
      const clone = element.cloneNode(true);
      const wrapper = document.createElement('div');
      wrapper.style.cssText = `position:absolute;top:0;left:0;width:816px;height:${pageCount * 1056}px;z-index:-9999;background:white;`;
      clone.style.width = '100%'; clone.style.height = '100%'; clone.style.margin = '0';
      wrapper.appendChild(clone); document.body.appendChild(wrapper);
      const base = personalInfo.name ? personalInfo.name.trim().replace(/\s+/g, '_') : 'User';
      const opt = { margin: 0, filename: `${base}_Resume.pdf`, image: { type: 'jpeg', quality: 1 }, html2canvas: { scale: 2, useCORS: true, logging: false, width: 816, height: pageCount * 1056 }, jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' } };
      window.html2pdf().set(opt).from(wrapper).save().then(() => { document.body.removeChild(wrapper); resolve(); }).catch(e => { document.body.removeChild(wrapper); reject(e); });
    });
  };

  const generateExactPDF = async () => {
    setIsDownloading(true);
    if (!window.html2pdf) {
      const script = document.createElement('script'); script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      await new Promise(r => { script.onload = r; document.body.appendChild(script); });
    }
    await processPDF();
    setIsDownloading(false);
  };

  // --- PREVIEW HELPERS ---
  const sSm = { fontSize: `${Math.max(8, fontSizeNum - 2)}px` };
  const sBase = { fontSize: `${fontSizeNum}px` };
  const sLg = { fontSize: `${fontSizeNum + 2}px` };
  const sXl = { fontSize: `${fontSizeNum + 6}px` };
  const sTitle = { fontSize: `${fontSizeNum + 20}px` };
  const picSizeStr = `${template === '2-column' ? Math.max(50, Math.min(180, (activeHeadSize / 32) * 125)) : Math.max(50, Math.min(180, 125 + (activeHeadSize * 1.3)))}px`;
  const sectionMb = template === '1-column' ? 'mb-2' : 'mb-4';
  const titleMb = template === '1-column' ? 'mb-1.5' : 'mb-3';

  const renderDescription = (desc, isBullet, color, size) => {
    if (!desc) return null;
    if (isBullet !== false) return <ul className="list-disc pl-5 mt-1" style={{...size, color}}>{desc.split('\n').filter(l => l.trim()).map((l, i) => <li key={i} className="mb-0.5 leading-relaxed">{l}</li>)}</ul>;
    return <p style={{...size, color}} className="whitespace-pre-wrap leading-relaxed mt-1">{desc}</p>;
  };

  const renderTimelineItem = (content, id, timeline, mode, gapMb = 'mb-3', gapPb = 'pb-3') => {
    const bColor = mode === 'themed' && themeTextColor === 'white' ? 'rgba(255,255,255,0.3)' : '#e2e8f0';
    const dColor = mode === 'themed' && themeTextColor === 'white' ? 'white' : '#0f172a';
    if (timeline) return <div key={id} className={`relative pl-4 border-l ${gapPb} last:pb-0`} style={{ borderLeftColor: bColor }}><div className="absolute w-2 h-2 rounded-full -left-[4.5px] top-1.5" style={{ backgroundColor: dColor }}></div>{content}</div>;
    return <div key={id} className={`${gapMb} last:mb-0`}>{content}</div>;
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
      return <section key={id} className={`${sectionMb}`} style={style}><h2 style={{...sXl, color: h, borderBottomColor: b}} className={`font-bold ${titleMb} uppercase tracking-wider border-b pb-1`}>{d.title}</h2>{d.items.map(i => (i.title || i.description) && renderTimelineItem(<div className="block">{i.title && <h3 style={{...sLg, color: h}} className="font-bold">{i.title}</h3>}{i.subtitle && <div style={{...sSm, color: p}}>{i.subtitle}</div>}{i.description && renderDescription(i.description, i.isBullet, p, sBase)}</div>, i.id, section.timeline, mode))}</section>;
    }

    switch(id) {
      case 'summary': return summaryContent && <section key="summary" className={sectionMb} style={style}><h2 style={{...sXl, color: h, borderBottomColor: b}} className={`font-bold ${titleMb} uppercase border-b pb-1`}>Summary</h2>{renderTimelineItem(<p style={{...sBase, color: p}} className="whitespace-pre-wrap leading-relaxed">{summaryContent}</p>, 'sum', section.timeline, mode, 'mb-0', 'pb-0')}</section>;
      case 'education': return education.length > 0 && <section key="edu" className={sectionMb} style={style}><h2 style={{...sXl, color: h, borderBottomColor: b}} className={`font-bold ${titleMb} uppercase border-b pb-1`}>Education</h2>{education.map(e => renderTimelineItem(<div><div className="flex justify-between items-baseline"><h3 style={{...sLg, color: h}} className="font-bold">{e.school}</h3>{template==='1-column'&&<span style={{...sSm, color: m}} className="font-bold">{e.from}-{e.to}</span>}</div><div style={{...sSm, color: p}} className="uppercase">{e.degree} | {template==='2-column'&&<span className="font-bold">{e.from}-{e.to}</span>}</div>{e.cgpa && <div style={{...sSm, color: p}}>CGPA: {e.cgpa}</div>}</div>, e.id, section.timeline, mode))}</section>;
      case 'experience': return experience.length > 0 && <section key="exp" className={sectionMb} style={style}><h2 style={{...sXl, color: h, borderBottomColor: b}} className={`font-bold ${titleMb} uppercase border-b pb-1`}>Experience</h2>{experience.map(e => renderTimelineItem(<div><div className="flex justify-between items-baseline"><h3 style={{...sLg, color: h}} className="font-bold">{e.role}</h3>{template==='1-column'&&<span style={{...sSm, color: m}} className="font-bold">{e.from}-{e.to}</span>}</div><div style={{...sSm, color: p}} className="uppercase">{e.company} | {template==='2-column'&&<span className="font-bold">{e.from}-{e.to}</span>}</div>{renderDescription(e.description, e.isBullet, p, sBase)}</div>, e.id, section.timeline, mode))}</section>;
      case 'projects': return projects.length > 0 && <section key="proj" className={sectionMb} style={style}><h2 style={{...sXl, color: h, borderBottomColor: b}} className={`font-bold ${titleMb} uppercase border-b pb-1`}>Projects</h2>{projects.map(e => renderTimelineItem(<div><h3 style={{...sLg, color: h}} className="font-bold">{e.title}</h3><div style={{...sSm, color: m}} className="italic">{e.tech}</div>{renderDescription(e.description, e.isBullet, p, sBase)}</div>, e.id, section.timeline, mode))}</section>;
      case 'skills': return <div key="skills" className={sectionMb} style={style}><h2 style={{...sXl, color: h, borderBottomColor: b}} className={`font-bold ${titleMb} uppercase border-b pb-1`}>Skills</h2>{renderTimelineItem(skillsFormat === 'categorized' ? <div className="space-y-1">{skillsData.map(i => i.category && <div key={i.id} style={{...sBase, color: p}}><span style={{color: h}} className="mr-1 font-bold">{i.category}:</span>{i.skills.split(',').join(' | ')}</div>)}</div> : <div style={{...sBase, color: p}}>{skillsContent.split(',').join(' | ')}</div>, 'sk', section.timeline, mode)}</div>;
      case 'certifications': return certifications.length > 0 && <div key="cert" className={sectionMb} style={style}><h2 style={{...sXl, color: h, borderBottomColor: b}} className="font-bold uppercase border-b pb-1">Certifications</h2>{certifications.map(c => renderTimelineItem(<div style={{...sBase, color: p}}>{c.text}</div>, c.id, section.timeline, mode, 'mb-1', 'pb-2'))}</div>;
      case 'achievements': return achievements.length > 0 && <div key="ach" className={sectionMb} style={style}><h2 style={{...sXl, color: h, borderBottomColor: b}} className="font-bold uppercase border-b pb-1">Achievements</h2>{achievements.map(c => renderTimelineItem(<div style={{...sBase, color: p}}>{c.text}</div>, c.id, section.timeline, mode, 'mb-1', 'pb-2'))}</div>;
      default: return null;
    }
  };

  const headHColor = themeTextColor === 'white' ? '#ffffff' : '#0f172a';
  const headPColor = themeTextColor === 'white' ? '#f1f5f9' : '#334155';

  return (
    <div className="flex flex-col lg:flex-row min-h-screen lg:h-screen bg-gray-100 font-sans overflow-auto lg:overflow-hidden">
      {/* LEFT EDITOR PANEL */}
      <div className="w-full lg:w-[45%] h-auto lg:h-screen overflow-y-auto bg-slate-50 border-r border-gray-200 shadow-lg z-10 flex-shrink-0">
        <div className="p-6 bg-slate-800 text-white sticky top-0 z-20 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <FileText size={24} className="text-blue-400" />
            <h1 className="text-xl font-bold">ResumeMaker</h1>
          </div>
          <button onClick={onBack} className="flex items-center gap-1 text-sm text-slate-300 hover:text-white transition-colors"><ArrowLeft size={16} /> Back</button>
        </div>
        
        <div className="p-4 sm:p-6 space-y-6">
          <section className={`bg-white p-5 rounded-lg border transition-all ${activeSection === 'basic-info' ? 'border-slate-800 ring-1 shadow-md' : 'border-gray-200'}`} onClickCapture={() => setActiveSection('basic-info')}>
            <h2 className="text-lg font-bold text-slate-800 border-b pb-3 mb-4">Basic Information</h2>
            <div className="bg-slate-50 p-4 border rounded-lg mb-4">
              <label className="flex items-center gap-2 font-medium text-slate-700 cursor-pointer"><input type="checkbox" checked={showPhoto} onChange={(e) => setShowPhoto(e.target.checked)} className="w-4 h-4" /> Include Profile Photo</label>
              {showPhoto && <div className="mt-3 pl-4 border-l-2 border-slate-200"><input type="file" accept="image/*" onChange={handlePhotoUpload} className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded file:bg-blue-50 file:text-blue-700" /></div>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="md:col-span-2 flex justify-between"><label className="block text-sm font-medium text-gray-600">Full Name</label>{template==='1-column'&&<select value={headerAlignment} onChange={e=>setHeaderAlignment(e.target.value)} className="text-xs p-1 border rounded"><option value="left">Align Left</option><option value="center">Align Center</option></select>}</div>
               <input type="text" name="name" value={personalInfo.name} onChange={handlePersonalInfoChange} className="md:col-span-2 w-full p-2 border rounded" />
               <input type="email" name="email" value={personalInfo.email} onChange={handlePersonalInfoChange} className="w-full p-2 border rounded" placeholder="Email" />
               <input type="text" name="phone" value={personalInfo.phone} onChange={handlePersonalInfoChange} className="w-full p-2 border rounded" placeholder="Phone" />
               <input type="text" name="location" value={personalInfo.location} onChange={handlePersonalInfoChange} className="md:col-span-2 w-full p-2 border rounded" placeholder="Location" />
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
               <label className="block text-sm font-medium text-gray-600 mb-2">Social Links</label>
               {links.map(l => (
                 <div key={l.id} className="flex gap-2 mb-2 p-2 border rounded bg-slate-50">
                    <input type="text" value={l.label} onChange={e=>handleArrayUpdate(setLinks, l.id, 'label', e.target.value)} placeholder="Label" className="flex-1 p-1 text-sm border rounded" />
                    <input type="text" value={l.url} onChange={e=>handleArrayUpdate(setLinks, l.id, 'url', e.target.value)} placeholder="URL" className="flex-1 p-1 text-sm border rounded" />
                    <button onClick={()=>handleArrayRemove(setLinks, l.id)} className="text-red-400"><Trash2 size={16}/></button>
                 </div>
               ))}
               <button onClick={()=>handleArrayAdd(setLinks, {label:'', url:''})} className="text-blue-600 text-sm font-medium"><Plus size={14}/> Add Link</button>
            </div>
          </section>

          <div className="space-y-4">
            {sections.map((s, i) => (
              <div key={s.id} className={`bg-white rounded-lg border transition-all ${activeSection === s.id ? 'border-slate-800 ring-1 shadow-md' : 'border-gray-200'}`} onClickCapture={() => setActiveSection(s.id)}>
                <div draggable onDragStart={e=>handleDragStart(e,i)} onDrop={e=>handleDrop(e,i)} onDragOver={e=>e.preventDefault()} className={`p-3 flex items-center justify-between cursor-grab active:cursor-grabbing border-b ${s.visible?'bg-blue-50':'bg-gray-50'}`}>
                  <div className="flex items-center gap-2"><GripVertical size={18} className="text-slate-400" /><h2 className="font-bold text-slate-800">{s.title}</h2></div>
                  <div className="flex items-center gap-1">
                    {template==='2-column'&&<div className="flex bg-slate-200 rounded p-0.5 mr-1"><button onClick={()=>toggleSectionColumn(s.id,'left')} className={`text-[10px] px-2 py-1 rounded-sm ${s.column==='left'?'bg-white text-blue-600':'text-slate-500'}`}>L</button><button onClick={()=>toggleSectionColumn(s.id,'right')} className={`text-[10px] px-2 py-1 rounded-sm ${s.column==='right'?'bg-white text-blue-600':'text-slate-500'}`}>R</button></div>}
                    <button onClick={()=>toggleSectionTimeline(s.id)} className={`text-[10px] px-2 py-1 rounded ${s.timeline?'bg-blue-600 text-white shadow-sm':'text-slate-500'}`}>Line</button>
                    <button onClick={()=>toggleSectionVisibility(s.id)} className={`p-1.5 ${s.visible?'text-blue-600':'text-gray-400'}`}>{s.visible?<Eye size={18}/>:<EyeOff size={18}/>}</button>
                  </div>
                </div>
                {s.visible && <div className="p-4 bg-slate-50">{renderEditorSection(s.id)}</div>}
              </div>
            ))}
            <button onClick={handleAddCustomSection} className="w-full py-3 border-2 border-dashed border-blue-300 text-blue-600 rounded-lg font-medium flex justify-center items-center gap-2"><Plus size={18} /> Add Custom Section</button>
          </div>
        </div>
      </div>

      {/* RIGHT PREVIEW PANEL */}
      <div className="w-full lg:w-[55%] h-auto lg:h-screen overflow-y-auto bg-gray-200 p-4 lg:p-8 flex flex-col items-center">
        <div className="w-full max-w-[816px] flex flex-col gap-4 pb-12">
          {isOverflowing && <div className="w-full bg-red-50 border-l-4 border-red-500 p-4 rounded flex items-start gap-3"><AlertTriangle className="text-red-500 mt-0.5" size={20} /><p className="text-red-700 text-sm font-bold">Content spillage! Reduce font size or remove text.</p></div>}
          
          <div className="w-full bg-white rounded-xl shadow border border-gray-200 p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-4 border-b pb-4">
               <button onClick={undo} disabled={historyIndex<=0} className="p-2 bg-slate-100 rounded disabled:opacity-50"><Undo2 size={18}/></button>
               <button onClick={redo} disabled={historyIndex>=historyRef.current.length-1} className="p-2 bg-slate-100 rounded disabled:opacity-50"><Redo2 size={18}/></button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div className="bg-slate-50 p-3 rounded border">
                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Head Size</span>
                <select value={headSizeSelection} onChange={e=>setHeadSizeSelection(e.target.value)} className="w-full text-xs p-1 border rounded"><option value="0">None</option><option value="32">Normal</option><option value="40">Large</option><option value="custom">Custom...</option></select>
                {headSizeSelection==='custom' && <input type="number" value={customHeadSize} onChange={e=>setCustomHeadSize(Number(e.target.value))} className="w-full mt-1 text-xs border rounded p-1" />}
              </div>
              <div className="bg-slate-50 p-3 rounded border">
                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Theme</span>
                <div className="flex gap-2 items-center"><input type="color" value={themeColor} onChange={e=>setThemeColor(e.target.value)} className="w-6 h-6 border-0 cursor-pointer" /><select value={themeTextColor} onChange={e=>setThemeTextColor(e.target.value)} className="text-xs p-1 border rounded"><option value="black">Dark Text</option><option value="white">Light Text</option></select></div>
              </div>
              <div className="bg-slate-50 p-3 rounded border">
                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Font Size</span>
                <input type="number" min="8" max="16" value={fontSizeNum} onChange={e=>setFontSizeNum(Number(e.target.value))} className="w-full text-xs border rounded p-1" />
              </div>
              <div className="bg-slate-50 p-3 rounded border">
                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Pages</span>
                <select value={pageSelection} onChange={e=>setPageSelection(e.target.value)} className="w-full text-xs p-1 border rounded"><option value="1">1 Page</option><option value="2">2 Pages</option><option value="custom">Custom...</option></select>
              </div>
            </div>
            <button onClick={generateExactPDF} disabled={isDownloading} className="w-full flex items-center justify-center gap-2 py-3 bg-yellow-400 text-yellow-900 rounded-lg font-extrabold hover:bg-yellow-500 shadow-md">
              <Download size={20} /> {isDownloading ? 'Generating PDF...' : 'Download PDF'}
            </button>
          </div>

          <div className="w-full overflow-x-auto text-center pb-12">
            <div ref={previewContainerRef} className="inline-block text-left shadow-2xl bg-white" style={{ width: '816px', height: `${pageCount * 1056}px` }}>
              <div id="resume-preview-content" ref={innerContentRef} className="w-full bg-white flex flex-col" style={{ minHeight: '100%', fontFamily, color: '#0f172a' }}>
                {template === '1-column' && (
                  <div className="flex flex-col flex-1 h-full">
                    <div className={`flex ${photoAlignment==='center'?'flex-col':'flex-row'} items-center gap-6 px-10 mb-4`} style={{ backgroundColor: themeColor, paddingTop: `${activeHeadSize}px`, paddingBottom: `${activeHeadSize}px`, ...(activeSection==='basic-info'?{outline:'3px solid #0f172a',outlineOffset:'-3px'}:{}) }}>
                      {showPhoto && <div style={{width:picSizeStr,height:picSizeStr}} className="shrink-0">{photoUrl?<img src={photoUrl} className="w-full h-full rounded-full object-cover border-4 border-white shadow-sm"/>:<div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center border-4 border-white shadow-sm"><User size={40} className="text-slate-400"/></div>}</div>}
                      <div className={`flex-1 ${headerAlignment==='center'?'text-center':'text-left'}`}><h1 style={{...sTitle, color: headHColor}} className="font-bold mb-1 break-words">{personalInfo.name}</h1><div style={{...sSm, color: headPColor}} className={`flex flex-wrap ${headerAlignment==='center'?'justify-center':'justify-start'} gap-x-4`}><span>{personalInfo.email}</span><span>{personalInfo.phone}</span><span>{personalInfo.location}</span>{links.map(l=>l.url&&<span key={l.id}>{l.label||l.url}</span>)}</div></div>
                    </div>
                    <div className="px-10 pb-10">{sections.filter(s=>s.visible).map(s=>renderPreviewSection(s.id))}</div>
                  </div>
                )}
                {template === '2-column' && (
                  <div className="flex flex-row flex-1 items-stretch w-full h-full min-h-full">
                    <div className="p-8 flex flex-col border-r border-slate-200 h-full" style={{ backgroundColor: themeColor, width: `${activeHeadSize}%`, minHeight: '100%' }}>
                      {showPhoto && <div style={{width:picSizeStr,height:picSizeStr}} className="mb-5">{photoUrl?<img src={photoUrl} className="w-full h-full rounded-full object-cover border-4 border-white shadow-sm"/>:<div className="w-full h-full rounded-full bg-white flex items-center justify-center border-4 border-gray-100 shadow-sm"><User size={40} className="text-slate-400"/></div>}</div>}
                      <h1 style={{...sTitle, color: headHColor}} className="font-bold mb-4 break-words leading-tight">{personalInfo.name}</h1>
                      <div className="space-y-2 mb-6" style={{color: headPColor}}>
                        {personalInfo.email && <div className="flex items-center gap-2 break-all" style={sSm}><Mail size={12}/>{personalInfo.email}</div>}
                        {personalInfo.phone && <div className="flex items-center gap-2" style={sSm}><Phone size={12}/>{personalInfo.phone}</div>}
                        {personalInfo.location && <div className="flex items-center gap-2" style={sSm}><MapPin size={12}/>{personalInfo.location}</div>}
                      </div>
                      {sections.filter(s=>s.visible && s.column==='left').map(s=>renderPreviewSection(s.id, 'themed'))}
                    </div>
                    <div className="p-8 flex flex-col bg-white h-full" style={{ width: `${100 - activeHeadSize}%` }}>
                      {sections.filter(s=>s.visible && s.column==='right').map(s=>renderPreviewSection(s.id))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

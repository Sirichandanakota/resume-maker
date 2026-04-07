import React, { useState, useEffect, useRef } from 'react';
import { User, Mail, Phone, MapPin, Link2, Plus, Trash2, FileText, ArrowLeft, Image as ImageIcon, Download, GripVertical, Eye, EyeOff, AlertTriangle, Undo2, Redo2, X } from 'lucide-react';

// --- EXACT DEFAULTS ---
const DEFAULT_SHARED_CONTENT = {
  personalInfo: { name: 'Rahul Sharma', email: 'rahul.sharma@example.com', phone: '+91 98765 43210', location: 'Bangalore, India' },
  links: [{ id: 1, label: 'LinkedIn', url: 'linkedin.com/in/rahulsharma' }],
  showPhoto: false, photoUrl: '', photoFileName: '',
  summaryContent: 'Passionate software engineer with 5+ years of experience building scalable web applications and intuitive user interfaces. Highly adept at independent project management, collaborating with cross-functional teams, and driving business growth through technical innovation. Proven track record of delivering high-quality software solutions on time and under budget.',
  education: [{ id: 1, degree: 'B.Tech in Computer Science', school: 'National Institute of Technology', from: 'Aug 2023', to: 'May 2027', cgpa: '8.5 / 10' }],
  skillsFormat: 'categorized', 
  skillsContent: 'JavaScript, TypeScript, React, Node.js, Python, SQL, Git',
  skillsData: [
    { id: 1, category: 'Programming', skills: 'JavaScript | TypeScript | Python | Java' },
    { id: 2, category: 'Frameworks', skills: 'React | Next.js | Node.js | Django' }
  ],
  experience: [{
    id: 1, role: 'Senior Software Engineer', company: 'Tech Solutions Inc.', from: 'Jan 2022', to: 'Present', isBullet: true,
    description: 'Lead a team of 4 developers to build a modern e-commerce platform using React and Next.js, scaling to over 1 million users.\nImproved overall site performance by 40% through advanced code splitting and intelligent lazy loading.\nMentored junior engineers and established comprehensive code review guidelines to ensure maximum maintainability.'
  }],
  projects: [
    { id: 1, title: 'E-commerce Platform Refactor', tech: 'React, Node.js, MongoDB, Tailwind CSS', isBullet: true, description: 'Overhauled the legacy frontend architecture, resulting in a verifiable 25% increase in overall user retention.\nImplemented a highly secure payment gateway and comprehensive user authentication system using industry standards.\nDrastically reduced average page load time from 4s to 1.5s by transitioning to advanced server-side rendering.' },
    { id: 2, title: 'Task Management Application', tech: 'TypeScript, React, Firebase', isBullet: true, description: 'Built a real-time, scalable task management tool currently utilized by over 500+ active daily enterprise users.\nEngineered a highly intuitive drag-and-drop Kanban board interface for seamless daily task organization and tracking.\nSuccessfully set up automated CI/CD deployment pipelines using GitHub Actions to guarantee zero-downtime feature releases.' },
    { id: 3, title: 'Portfolio Generator', tech: 'React, Tailwind CSS', isBullet: true, description: 'Created a popular open-source portfolio generator that empowers developers to beautifully showcase their personal work.\nIntegrated robust markdown support allowing for incredibly easy and flexible content formatting by the end users.\nAchieved over 1k stars on GitHub within the very first month of its highly anticipated initial public repository release.' }
  ],
  certifications: [{ id: 1, text: 'AWS Certified Solutions Architect' }, { id: 2, text: 'React Native Specialist Certification' }],
  achievements: [{ id: 1, text: 'Best Developer Award 2022' }, { id: 2, text: 'Winner - Global Hackathon 2021' }],
  customSectionsData: { 'custom-default': { title: 'Languages / Interests', items: [{ id: 1, title: '', subtitle: '', description: '' }] } }
};

// 1-COLUMN ISOLATED DEFAULTS (Font 9, Head 0, Dark Text)
const DEFAULT_SETTINGS_1_COL = {
  themeColor: '#31414e', themeTextColor: 'black', fontSizeNum: 9, fontFamily: "'Times New Roman', serif", headSizeSelection: '0', customHeadSize: 0, headerAlignment: 'left', photoAlignment: 'left', pageSelection: '1', customPageCount: 5,
  sections: [
    { id: 'education', title: 'Education', visible: true, column: 'left', timeline: false },
    { id: 'summary', title: 'Professional Summary', visible: true, column: 'left', timeline: false },
    { id: 'experience', title: 'Experience', visible: true, column: 'left', timeline: false },
    { id: 'projects', title: 'Projects', visible: true, column: 'left', timeline: false },
    { id: 'skills', title: 'Skills', visible: true, column: 'left', timeline: false },
    { id: 'certifications', title: 'Certifications', visible: true, column: 'left', timeline: false },
    { id: 'achievements', title: 'Achievements', visible: true, column: 'left', timeline: false },
    { id: 'custom-default', title: 'Languages / Interests', visible: false, column: 'left', timeline: false }
  ]
};

// 2-COLUMN ISOLATED DEFAULTS (Font 12, Head 32, Light Text)
const DEFAULT_SETTINGS_2_COL = {
  themeColor: '#31414e', themeTextColor: 'white', fontSizeNum: 12, fontFamily: "'Times New Roman', serif", headSizeSelection: '32', customHeadSize: 32, headerAlignment: 'left', photoAlignment: 'left', pageSelection: '1', customPageCount: 5,
  sections: [
    { id: 'education', title: 'Education', visible: true, column: 'left', timeline: false },
    { id: 'skills', title: 'Skills', visible: true, column: 'left', timeline: false },
    { id: 'certifications', title: 'Certifications', visible: true, column: 'left', timeline: false },
    { id: 'achievements', title: 'Achievements', visible: true, column: 'left', timeline: false },
    { id: 'summary', title: 'Professional Summary', visible: true, column: 'right', timeline: false },
    { id: 'experience', title: 'Experience', visible: true, column: 'right', timeline: false },
    { id: 'projects', title: 'Projects', visible: true, column: 'right', timeline: false },
    { id: 'custom-default', title: 'Languages / Interests', visible: false, column: 'left', timeline: false }
  ]
};

// --- CRASH-PROOF SAFE PARSER ---
const safeParse = (key, defaultObj) => {
  try {
    const data = localStorage.getItem(key);
    if (!data) return defaultObj;
    const parsed = JSON.parse(data);
    if (typeof parsed !== 'object' || parsed === null) return defaultObj;
    return parsed;
  } catch (e) {
    return defaultObj;
  }
};

export default function ResumeEditor({ template, userFullName, userEmail, onBack }) {
  // --- LOAD DATA SAFELY ---
  const initShared = safeParse('ResumeMaker_Shared_Content', DEFAULT_SHARED_CONTENT);
  const initSettings = safeParse(`ResumeMaker_Settings_${template}`, template === '1-column' ? DEFAULT_SETTINGS_1_COL : DEFAULT_SETTINGS_2_COL);

  // --- ISOLATED SETTINGS (Saved per template) ---
  const [pageSelection, setPageSelection] = useState(() => initSettings.pageSelection || '1'); 
  const [customPageCount, setCustomPageCount] = useState(() => initSettings.customPageCount || 5);
  const pageCount = pageSelection === 'custom' ? customPageCount : parseInt(pageSelection);

  const [fontSizeNum, setFontSizeNum] = useState(() => initSettings.fontSizeNum || (template === '1-column' ? 9 : 12)); 
  const [fontFamily, setFontFamily] = useState(() => initSettings.fontFamily || "'Times New Roman', serif");
  const [themeColor, setThemeColor] = useState(() => initSettings.themeColor || '#31414e'); 
  const [themeTextColor, setThemeTextColor] = useState(() => initSettings.themeTextColor || (template === '1-column' ? 'black' : 'white')); 
  
  const [headSizeSelection, setHeadSizeSelection] = useState(() => initSettings.headSizeSelection || (template === '1-column' ? '0' : '32')); 
  const [customHeadSize, setCustomHeadSize] = useState(() => initSettings.customHeadSize || 32);
  const [headerAlignment, setHeaderAlignment] = useState(() => initSettings.headerAlignment || 'left');
  const [photoAlignment, setPhotoAlignment] = useState(() => initSettings.photoAlignment || 'left');
  const [sections, setSections] = useState(() => initSettings.sections || (template === '1-column' ? DEFAULT_SETTINGS_1_COL.sections : DEFAULT_SETTINGS_2_COL.sections));

  // --- SHARED DATA (Transfers across templates seamlessly) ---
  const [personalInfo, setPersonalInfo] = useState(() => {
    const info = { ...DEFAULT_SHARED_CONTENT.personalInfo, ...(initShared.personalInfo || {}) };
    if (userFullName && info.name === 'Rahul Sharma') info.name = userFullName;
    if (userEmail && info.email === 'rahul.sharma@example.com') info.email = userEmail;
    return info;
  });

  const [links, setLinks] = useState(() => initShared.links || DEFAULT_SHARED_CONTENT.links);
  const [showPhoto, setShowPhoto] = useState(() => initShared.showPhoto ?? false);
  const [photoUrl, setPhotoUrl] = useState(() => initShared.photoUrl || '');
  const [photoFileName, setPhotoFileName] = useState(() => initShared.photoFileName || '');
  const [summaryContent, setSummaryContent] = useState(() => initShared.summaryContent || DEFAULT_SHARED_CONTENT.summaryContent);
  const [education, setEducation] = useState(() => initShared.education || DEFAULT_SHARED_CONTENT.education);
  const [experience, setExperience] = useState(() => initShared.experience || DEFAULT_SHARED_CONTENT.experience);
  const [projects, setProjects] = useState(() => initShared.projects || DEFAULT_SHARED_CONTENT.projects);
  const [skillsFormat, setSkillsFormat] = useState(() => initShared.skillsFormat || 'categorized');
  const [skillsContent, setSkillsContent] = useState(() => initShared.skillsContent || DEFAULT_SHARED_CONTENT.skillsContent);
  const [skillsData, setSkillsData] = useState(() => initShared.skillsData || DEFAULT_SHARED_CONTENT.skillsData);
  const [certifications, setCertifications] = useState(() => initShared.certifications || DEFAULT_SHARED_CONTENT.certifications);
  const [achievements, setAchievements] = useState(() => initShared.achievements || DEFAULT_SHARED_CONTENT.achievements);
  const [customSectionsData, setCustomSectionsData] = useState(() => initShared.customSectionsData || DEFAULT_SHARED_CONTENT.customSectionsData);

  // App State
  const [activeSection, setActiveSection] = useState('basic-info');
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const previewContainerRef = useRef(null);
  const innerContentRef = useRef(null);

  // --- HISTORY & AUTO-SAVE ---
  const getCurrentStateStr = () => JSON.stringify({
    content: { personalInfo, links, showPhoto, photoUrl, photoFileName, education, experience, projects, skillsContent, skillsData, skillsFormat, certifications, achievements, summaryContent, customSectionsData },
    settings: { sections, pageSelection, customPageCount, fontSizeNum, fontFamily, themeColor, themeTextColor, headSizeSelection, customHeadSize, headerAlignment, photoAlignment }
  });

  const historyRef = useRef([getCurrentStateStr()]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const isRestoring = useRef(false);

  useEffect(() => {
    if (isRestoring.current) { isRestoring.current = false; return; }
    
    const currentState = getCurrentStateStr();
    const stateObj = JSON.parse(currentState);
    
    localStorage.setItem('ResumeMaker_Shared_Content', JSON.stringify(stateObj.content));
    localStorage.setItem(`ResumeMaker_Settings_${template}`, JSON.stringify(stateObj.settings));
    
    if (historyRef.current[historyIndex] === currentState) return;
    const newHistory = historyRef.current.slice(0, historyIndex + 1);
    newHistory.push(currentState);
    historyRef.current = newHistory;
    setHistoryIndex(newHistory.length - 1);
  }, [personalInfo, links, showPhoto, photoUrl, photoFileName, education, experience, projects, skillsContent, skillsData, skillsFormat, certifications, achievements, summaryContent, customSectionsData, sections, pageSelection, customPageCount, fontSizeNum, fontFamily, themeColor, themeTextColor, headSizeSelection, customHeadSize, headerAlignment, photoAlignment, template]);

  const undo = () => { if (historyIndex > 0) { isRestoring.current = true; setHistoryIndex(historyIndex - 1); restoreState(historyRef.current[historyIndex - 1]); } };
  const redo = () => { if (historyIndex < historyRef.current.length - 1) { isRestoring.current = true; setHistoryIndex(historyIndex + 1); restoreState(historyRef.current[historyIndex + 1]); } };

  const restoreState = (stateStr) => {
    if (!stateStr) return;
    try {
      const s = JSON.parse(stateStr);
      if (!s || !s.content || !s.settings) return;

      setPersonalInfo(s.content.personalInfo || DEFAULT_SHARED_CONTENT.personalInfo); 
      setLinks(s.content.links || []); 
      setShowPhoto(s.content.showPhoto ?? false); 
      setPhotoUrl(s.content.photoUrl || ''); 
      setPhotoFileName(s.content.photoFileName || '');
      setEducation(s.content.education || []); 
      setExperience(s.content.experience || []); 
      setProjects(s.content.projects || []); 
      setSkillsContent(s.content.skillsContent || ''); 
      setSkillsData(s.content.skillsData || []); 
      setSkillsFormat(s.content.skillsFormat || 'categorized');
      setCertifications(s.content.certifications || []); 
      setAchievements(s.content.achievements || []); 
      setSummaryContent(s.content.summaryContent || ''); 
      setCustomSectionsData(s.content.customSectionsData || {});
      
      setSections(s.settings.sections || []); 
      setPageSelection(s.settings.pageSelection || '1'); 
      setCustomPageCount(s.settings.customPageCount || 5); 
      setFontSizeNum(s.settings.fontSizeNum || 10); 
      setFontFamily(s.settings.fontFamily || "'Times New Roman', serif");
      setThemeColor(s.settings.themeColor || '#31414e'); 
      setThemeTextColor(s.settings.themeTextColor || 'black'); 
      setHeadSizeSelection(s.settings.headSizeSelection || '0'); 
      setCustomHeadSize(s.settings.customHeadSize || 0);
      setHeaderAlignment(s.settings.headerAlignment || 'left'); 
      setPhotoAlignment(s.settings.photoAlignment || 'left');
    } catch(e) { console.error("Error restoring state"); }
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
  const handleArrayUpdate = (setter, id, field, value) => { setter(prev => (prev || []).map(item => item.id === id ? { ...item, [field]: value } : item)); };
  const handleArrayAdd = (setter, defaultObj) => { setter(prev => [...(prev || []), { id: Date.now(), ...defaultObj }]); };
  const handleArrayRemove = (setter, id) => { setter(prev => (prev || []).filter(item => item.id !== id)); };

  const handleAddCustomSection = () => {
    const id = `custom-${Date.now()}`;
    setCustomSectionsData(p => ({ ...p, [id]: { title: 'New Custom Section', items: [{ id: Date.now(), title: '', subtitle: '', description: '' }] } }));
    setSections(p => [...(p || []), { id, title: 'New Custom Section', visible: true, column: 'left', timeline: false }]);
  };
  const updateCustomSectionTitle = (id, val) => {
    setCustomSectionsData(p => ({ ...p, [id]: { ...p[id], title: val } }));
    setSections(p => (p || []).map(s => s.id === id ? { ...s, title: val || 'Custom Section' } : s));
  };
  const updateCustomItem = (sid, iid, f, v) => { setCustomSectionsData(p => ({ ...p, [sid]: { ...p[sid], items: (p[sid].items || []).map(i => i.id === iid ? { ...i, [f]: v } : i) } })); };
  const deleteCustomSection = (id) => { setSections(p => (p || []).filter(s => s.id !== id)); setCustomSectionsData(p => { const n = { ...p }; delete n[id]; return n; }); };
  const addCustomItem = (sid) => { setCustomSectionsData(p => ({ ...p, [sid]: { ...p[sid], items: [...(p[sid].items || []), { id: Date.now(), title: '', subtitle: '', description: '' }] } })); };
  const removeCustomItem = (sid, iid) => { setCustomSectionsData(p => ({ ...p, [sid]: { ...p[sid], items: (p[sid].items || []).filter(i => i.id !== iid) } })); };

  // Reorder / Toggles
  const [draggedIdx, setDraggedIdx] = useState(null);
  const handleDragStart = (e, i) => { setDraggedIdx(i); e.dataTransfer.effectAllowed = 'move'; };
  const handleDrop = (e, i) => {
    e.preventDefault(); if (draggedIdx === null || draggedIdx === i) return;
    const n = [...(sections || [])]; const d = n[draggedIdx]; n.splice(draggedIdx, 1); n.splice(i, 0, d);
    setSections(n); setDraggedIdx(null);
  };
  const toggleSectionVisibility = (id) => { setSections(p => (p || []).map(s => s.id === id ? { ...s, visible: !s.visible } : s)); };
  const toggleSectionColumn = (id, col) => { setSections(p => (p || []).map(s => s.id === id ? { ...s, column: col } : s)); };
  const toggleSectionTimeline = (id) => { setSections(p => (p || []).map(s => s.id === id ? { ...s, timeline: !s.timeline } : s)); };

  // --- WHITE-LINE FIX: PERFECT PDF GENERATION ---
  const processPDF = () => {
    return new Promise((resolve, reject) => {
      const element = document.getElementById('resume-preview-content');
      const clone = element.cloneNode(true);
      
      // THIS REMOVES THE WHITE LINE/BORDER: Strip shadows, borders, scaling, etc.
      clone.style.margin = '0px';
      clone.style.padding = '0px';
      clone.style.boxShadow = 'none';
      clone.style.border = 'none';
      clone.style.outline = 'none';
      clone.style.borderRadius = '0px';
      clone.style.transform = 'none';
      clone.style.width = '816px';
      clone.style.height = `${pageCount * 1056}px`;

      const wrapper = document.createElement('div');
      wrapper.style.cssText = `position:absolute;top:0;left:0;width:816px;height:${pageCount * 1056}px;z-index:-9999;background:white;margin:0;padding:0;border:none;overflow:hidden;`;
      wrapper.appendChild(clone); 
      document.body.appendChild(wrapper);

      const base = personalInfo?.name ? personalInfo.name.trim().replace(/\s+/g, '_') : 'Resume';
      
      const opt = { 
        margin: 0, 
        filename: `${base}.pdf`, 
        image: { type: 'jpeg', quality: 1 }, 
        html2canvas: { 
          scale: 2, 
          useCORS: true, 
          logging: false, 
          width: 816, 
          height: pageCount * 1056,
          windowWidth: 816,
          x: 0, // This is crucial for removing the left white line
          y: 0, 
          scrollX: 0, 
          scrollY: 0 
        }, 
        jsPDF: { unit: 'px', format: [816, pageCount * 1056], orientation: 'portrait' } 
      };
      
      window.html2pdf().set(opt).from(wrapper).save().then(() => { 
        document.body.removeChild(wrapper); resolve(); 
      }).catch(e => { 
        document.body.removeChild(wrapper); reject(e); 
      });
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

  // --- PREVIEW STYLES ---
  const activeHeadSizeNum = Number(activeHeadSize);
  const sSm = { fontSize: `${Math.max(8, fontSizeNum - 2)}px` };
  const sBase = { fontSize: `${fontSizeNum}px` };
  const sLg = { fontSize: `${fontSizeNum + 2}px` };
  const sXl = { fontSize: `${fontSizeNum + 6}px` };
  const sTitle = { fontSize: `${fontSizeNum + 20}px` };
  const picSizeStr = `${template === '2-column' ? Math.max(50, Math.min(180, (activeHeadSizeNum / 32) * 125)) : Math.max(50, Math.min(180, 125 + (activeHeadSizeNum * 1.3)))}px`;
  const sectionMb = template === '1-column' ? 'mb-2' : 'mb-4';
  const titleMb = template === '1-column' ? 'mb-1.5' : 'mb-3';

  const renderDescription = (desc, isBullet, color, size) => {
    if (!desc) return null;
    if (isBullet !== false) {
      return (
        <ul className="list-disc pl-5 mt-1" style={{...size, color}}>
          {(desc || '').split('\n').filter(l => l.trim()).map((l, i) => <li key={i} className="mb-0.5 leading-relaxed">{l}</li>)}
        </ul>
      );
    }
    return <p style={{...size, color}} className="whitespace-pre-wrap leading-relaxed mt-1">{desc}</p>;
  };

  const renderTimelineItem = (content, id, timeline, mode, gapMb = 'mb-3', gapPb = 'pb-3') => {
    const bColor = mode === 'themed' && themeTextColor === 'white' ? 'rgba(255,255,255,0.3)' : '#e2e8f0';
    const dColor = mode === 'themed' && themeTextColor === 'white' ? 'white' : '#0f172a';
    if (timeline) {
      return (
        <div key={id} className={`relative pl-4 border-l ${gapPb} last:pb-0`} style={{ borderLeftColor: bColor }}>
          <div className="absolute w-2 h-2 rounded-full -left-[4.5px] top-1.5" style={{ backgroundColor: dColor }}></div>
          {content}
        </div>
      );
    }
    return <div key={id} className={`${gapMb} last:mb-0`}>{content}</div>;
  };

  const renderPreviewSection = (id, mode = 'standard') => {
    const section = (sections || []).find(s => s.id === id);
    if (!section) return null;
    const hColor = mode === 'themed' && themeTextColor === 'white' ? '#ffffff' : '#0f172a';
    const pColor = mode === 'themed' && themeTextColor === 'white' ? '#f1f5f9' : '#334155';
    const mColor = mode === 'themed' && themeTextColor === 'white' ? '#cbd5e1' : '#64748b';
    const borderColor = mode === 'themed' && themeTextColor === 'white' ? 'rgba(255,255,255,0.3)' : '#e2e8f0';
    const style = activeSection === id ? { outline: '3px solid #0f172a', outlineOffset: '-3px' } : {};

    if (id.startsWith('custom')) {
      const d = customSectionsData[id]; 
      if (!d || !(d.items || []).some(i => i.title || i.subtitle || i.description)) return null;
      return (
        <section key={id} className={`${sectionMb}`} style={style}>
          <h2 style={{...sXl, color: hColor, borderBottomColor: borderColor}} className={`font-bold ${titleMb} uppercase tracking-wider border-b pb-1`}>{d.title}</h2>
          <div className="space-y-0">
            {(d.items || []).map(i => (i.title || i.subtitle || i.description) && renderTimelineItem(
              <div className="block">
                {i.title && <h3 style={{...sLg, color: hColor}} className="font-bold">{i.title}</h3>}
                {i.subtitle && <div style={{...sSm, color: pColor}}>{i.subtitle}</div>}
                {i.description && renderDescription(i.description, i.isBullet, pColor, sBase)}
              </div>, i.id, section.timeline, mode
            ))}
          </div>
        </section>
      );
    }

    switch(id) {
      case 'summary': return summaryContent && <section key="summary" className={sectionMb} style={style}><h2 style={{...sXl, color: hColor, borderBottomColor: borderColor}} className={`font-bold ${titleMb} uppercase border-b pb-1`}>Professional Summary</h2>{renderTimelineItem(<p style={{...sBase, color: pColor}} className="whitespace-pre-wrap leading-relaxed">{summaryContent}</p>, 'sum', section.timeline, mode, 'mb-0', 'pb-0')}</section>;
      case 'education': return (education || []).length > 0 && <section key="edu" className={sectionMb} style={style}><h2 style={{...sXl, color: hColor, borderBottomColor: borderColor}} className={`font-bold ${titleMb} uppercase border-b pb-1`}>Education</h2><div className="space-y-0">{(education || []).map(e => renderTimelineItem(<div className="block"><div className="flex justify-between items-baseline"><h3 style={{...sLg, color: hColor}} className="font-bold">{e.school}</h3>{template==='1-column'&&<span style={{...sSm, color: mColor}} className="font-bold whitespace-nowrap ml-auto">{e.from} - {e.to}</span>}</div><div style={{...sSm, color: pColor}} className="uppercase">{e.degree} {template==='2-column'&&<span className="font-bold">| {e.from} - {e.to}</span>}</div>{e.cgpa && <div style={{...sSm, color: pColor}}>Current CGPA: {e.cgpa}</div>}</div>, e.id, section.timeline, mode))}</div></section>;
      case 'experience': return (experience || []).length > 0 && <section key="exp" className={sectionMb} style={style}><h2 style={{...sXl, color: hColor, borderBottomColor: borderColor}} className={`font-bold ${titleMb} uppercase border-b pb-1`}>Experience</h2><div className="space-y-0">{(experience || []).map(e => renderTimelineItem(<div className="block"><div className="flex justify-between items-baseline"><h3 style={{...sLg, color: hColor}} className="font-bold">{e.role}</h3>{template==='1-column'&&<span style={{...sSm, color: mColor}} className="font-bold whitespace-nowrap ml-auto">{e.from} - {e.to}</span>}</div><div style={{...sSm, color: pColor}} className="uppercase">{e.company} {template==='2-column'&&<span className="font-bold">| {e.from} - {e.to}</span>}</div>{renderDescription(e.description, e.isBullet, pColor, sBase)}</div>, e.id, section.timeline, mode))}</div></section>;
      case 'projects': return (projects || []).length > 0 && <section key="proj" className={sectionMb} style={style}><h2 style={{...sXl, color: hColor, borderBottomColor: borderColor}} className={`font-bold ${titleMb} uppercase border-b pb-1`}>Projects</h2><div className="space-y-0">{(projects || []).map(e => renderTimelineItem(<div className="block"><h3 style={{...sLg, color: hColor}} className="font-bold">{e.title}</h3><div style={{...sSm, color: mColor}} className="italic">{e.tech}</div>{renderDescription(e.description, e.isBullet, pColor, sBase)}</div>, e.id, section.timeline, mode))}</div></section>;
      case 'skills': return (skillsFormat === 'categorized' ? (skillsData || []).length > 0 : skillsContent) && <div key="skills" className={sectionMb} style={style}><h2 style={{...sXl, color: hColor, borderBottomColor: borderColor}} className={`font-bold ${titleMb} uppercase border-b pb-1`}>Skills</h2>{renderTimelineItem(skillsFormat === 'categorized' ? <div className="space-y-1">{(skillsData || []).map(i => i.category && i.skills && <div key={`sk-${i.id}`} style={{...sBase, color: pColor}}><span style={{color: hColor}} className="mr-1 font-bold">{i.category}:</span>{(i.skills || '').split(',').join(' | ')}</div>)}</div> : <div style={{...sBase, color: pColor}}>{(skillsContent || '').split(',').join(' | ')}</div>, 'sk', section.timeline, mode)}</div>;
      case 'certifications': return (certifications || []).length > 0 && <div key="cert" className={sectionMb} style={style}><h2 style={{...sXl, color: hColor, borderBottomColor: borderColor}} className="font-bold uppercase border-b pb-1">Certifications</h2><div className="space-y-0">{(certifications || []).map(c => c.text && renderTimelineItem(<div style={{...sBase, color: pColor}}>{!section.timeline && <span style={{color: hColor}} className="mr-2">•</span>}{c.text}</div>, c.id, section.timeline, mode, 'mb-1', 'pb-2'))}</div></div>;
      case 'achievements': return (achievements || []).length > 0 && <div key="ach" className={sectionMb} style={style}><h2 style={{...sXl, color: hColor, borderBottomColor: borderColor}} className="font-bold uppercase border-b pb-1">Achievements</h2><div className="space-y-0">{(achievements || []).map(c => c.text && renderTimelineItem(<div style={{...sBase, color: pColor}}>{!section.timeline && <span style={{color: hColor}} className="mr-2">•</span>}{c.text}</div>, c.id, section.timeline, mode, 'mb-1', 'pb-2'))}</div></div>;
      default: return null;
    }
  };

  const renderEditorSection = (id) => {
    if (id.startsWith('custom')) {
      const d = customSectionsData[id];
      if (!d) return null;
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <div className="flex-1 mr-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">Custom Section Title</label>
              <input type="text" value={d.title} onChange={e=>updateCustomSectionTitle(id, e.target.value)} className="w-full p-2 border rounded outline-none" />
            </div>
            <button onClick={()=>deleteCustomSection(id)} className="p-2 text-red-500 rounded"><Trash2 size={20}/></button>
          </div>
          {(d.items || []).map(i => (
            <div key={i.id} className="p-4 bg-white border rounded relative group">
              <button onClick={()=>removeCustomItem(id, i.id)} className="absolute top-4 right-4 text-red-400 opacity-0 group-hover:opacity-100"><Trash2 size={18}/></button>
              <div className="grid gap-4">
                <div><label className="block text-sm font-medium text-gray-600 mb-1">Title</label><input value={i.title} onChange={e=>updateCustomItem(id, i.id, 'title', e.target.value)} className="w-full p-2 border rounded outline-none"/></div>
                <div><label className="block text-sm font-medium text-gray-600 mb-1">Subtitle</label><input value={i.subtitle} onChange={e=>updateCustomItem(id, i.id, 'subtitle', e.target.value)} className="w-full p-2 border rounded outline-none"/></div>
                <div>
                  <div className="flex items-center justify-between mb-1"><label className="text-sm font-medium text-gray-600">Description</label><label className="flex items-center gap-1.5"><input type="checkbox" checked={i.isBullet!==false} onChange={e=>updateCustomItem(id, i.id, 'isBullet', e.target.checked)} className="w-3.5 h-3.5"/><span className="text-xs">Bullets</span></label></div>
                  <textarea value={i.description} onChange={e=>updateCustomItem(id, i.id, 'description', e.target.value)} rows={2} className="w-full p-2 border rounded outline-none"/>
                </div>
              </div>
            </div>
          ))}
          <button onClick={()=>addCustomItem(id)} className="text-blue-600 text-sm font-medium flex items-center gap-1"><Plus size={16}/> Add Item</button>
        </div>
      );
    }
    switch(id) {
      case 'summary': return <div><label className="block text-sm font-medium text-gray-600 mb-1">Professional Summary</label><textarea value={summaryContent} onChange={e=>setSummaryContent(e.target.value)} rows={4} className="w-full p-2 border rounded outline-none" /></div>;
      case 'education': return <div className="space-y-4">{(education || []).map(e=><div key={e.id} className="p-4 bg-white border rounded relative group"><button onClick={()=>handleArrayRemove(setEducation, e.id)} className="absolute top-4 right-4 text-red-400 opacity-0 group-hover:opacity-100"><Trash2 size={18}/></button><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div className="md:col-span-2"><label className="block text-sm font-medium text-gray-600 mb-1">School</label><input value={e.school} onChange={v=>handleArrayUpdate(setEducation, e.id, 'school', v.target.value)} className="w-full p-2 border rounded outline-none"/></div><div className="md:col-span-2"><label className="block text-sm font-medium text-gray-600 mb-1">Degree</label><input value={e.degree} onChange={v=>handleArrayUpdate(setEducation, e.id, 'degree', v.target.value)} className="w-full p-2 border rounded outline-none"/></div><div><label className="block text-sm font-medium text-gray-600 mb-1">From</label><input value={e.from} onChange={v=>handleArrayUpdate(setEducation, e.id, 'from', v.target.value)} className="w-full p-2 border rounded outline-none"/></div><div><label className="block text-sm font-medium text-gray-600 mb-1">To</label><input value={e.to} onChange={v=>handleArrayUpdate(setEducation, e.id, 'to', v.target.value)} className="w-full p-2 border rounded outline-none"/></div><div className="md:col-span-2"><label className="block text-sm font-medium text-gray-600 mb-1">CGPA</label><input value={e.cgpa} onChange={v=>handleArrayUpdate(setEducation, e.id, 'cgpa', v.target.value)} className="w-full p-2 border rounded outline-none"/></div></div></div>)}<button onClick={()=>handleArrayAdd(setEducation, {degree:'', school:'', from:'', to:'', cgpa:''})} className="text-blue-600 text-sm font-medium flex items-center gap-1"><Plus size={16}/> Add Education</button></div>;
      case 'experience': return <div className="space-y-4">{(experience || []).map(e=><div key={e.id} className="p-4 bg-white border rounded relative group"><button onClick={()=>handleArrayRemove(setExperience, e.id)} className="absolute top-4 right-4 text-red-400 opacity-0 group-hover:opacity-100"><Trash2 size={18}/></button><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div className="md:col-span-2"><label className="block text-sm font-medium text-gray-600 mb-1">Role</label><input value={e.role} onChange={v=>handleArrayUpdate(setExperience, e.id, 'role', v.target.value)} className="w-full p-2 border rounded outline-none"/></div><div className="md:col-span-2"><label className="block text-sm font-medium text-gray-600 mb-1">Company</label><input value={e.company} onChange={v=>handleArrayUpdate(setExperience, e.id, 'company', v.target.value)} className="w-full p-2 border rounded outline-none"/></div><div><label className="block text-sm font-medium text-gray-600 mb-1">From</label><input value={e.from} onChange={v=>handleArrayUpdate(setExperience, e.id, 'from', v.target.value)} className="w-full p-2 border rounded outline-none"/></div><div><label className="block text-sm font-medium text-gray-600 mb-1">To</label><input value={e.to} onChange={v=>handleArrayUpdate(setExperience, e.id, 'to', v.target.value)} className="w-full p-2 border rounded outline-none"/></div><div className="md:col-span-2"><div className="flex items-center justify-between mb-1"><label className="text-sm font-medium text-gray-600">Description</label><label className="flex items-center gap-1.5"><input type="checkbox" checked={e.isBullet!==false} onChange={c=>handleArrayUpdate(setExperience, e.id, 'isBullet', c.target.checked)} className="w-3.5 h-3.5"/><span className="text-xs">Bullets</span></label></div><textarea value={e.description} onChange={v=>handleArrayUpdate(setExperience, e.id, 'description', v.target.value)} rows={3} className="w-full p-2 border rounded outline-none"/></div></div></div>)}<button onClick={()=>handleArrayAdd(setExperience, {role:'', company:'', from:'', to:'', description:'', isBullet:true})} className="text-blue-600 text-sm font-medium flex items-center gap-1"><Plus size={16}/> Add Experience</button></div>;
      case 'projects': return <div className="space-y-4">{(projects || []).map(e=><div key={e.id} className="p-4 bg-white border rounded relative group"><button onClick={()=>handleArrayRemove(setProjects, e.id)} className="absolute top-4 right-4 text-red-400 opacity-0 group-hover:opacity-100"><Trash2 size={18}/></button><div className="grid gap-4"><div><label className="block text-sm font-medium text-gray-600 mb-1">Title</label><input value={e.title} onChange={v=>handleArrayUpdate(setProjects, e.id, 'title', v.target.value)} className="w-full p-2 border rounded outline-none"/></div><div><label className="block text-sm font-medium text-gray-600 mb-1">Tech</label><input value={e.tech} onChange={v=>handleArrayUpdate(setProjects, e.id, 'tech', v.target.value)} className="w-full p-2 border rounded outline-none"/></div><div><div className="flex items-center justify-between mb-1"><label className="text-sm font-medium text-gray-600">Description</label><label className="flex items-center gap-1.5"><input type="checkbox" checked={e.isBullet!==false} onChange={c=>handleArrayUpdate(setProjects, e.id, 'isBullet', c.target.checked)} className="w-3.5 h-3.5"/><span className="text-xs">Bullets</span></label></div><textarea value={e.description} onChange={v=>handleArrayUpdate(setProjects, e.id, 'description', v.target.value)} rows={2} className="w-full p-2 border rounded outline-none"/></div></div></div>)}<button onClick={()=>handleArrayAdd(setProjects, {title:'', tech:'', description:'', isBullet:true})} className="text-blue-600 text-sm font-medium flex items-center gap-1"><Plus size={16}/> Add Project</button></div>;
      case 'skills': return <div className="space-y-4"><div className="flex justify-between border-b pb-2"><label className="text-sm font-medium text-gray-600">Format</label><select value={skillsFormat} onChange={e=>setSkillsFormat(e.target.value)} className="p-1 border rounded text-xs outline-none"><option value="categorized">Categorized</option><option value="simple">Simple</option></select></div>{skillsFormat==='categorized'?<div className="space-y-3">{(skillsData || []).map(s=><div key={s.id} className="flex flex-col sm:flex-row gap-3 bg-white p-3 border rounded relative group"><button onClick={()=>handleArrayRemove(setSkillsData, s.id)} className="absolute top-2 right-2 text-red-400 opacity-0 group-hover:opacity-100"><Trash2 size={16}/></button><div className="sm:w-1/3"><label className="block text-xs font-medium text-gray-500 mb-1">Category</label><input value={s.category} onChange={e=>handleArrayUpdate(setSkillsData, s.id, 'category', e.target.value)} className="w-full p-2 text-sm border rounded outline-none"/></div><div className="sm:w-2/3 pr-6"><label className="block text-xs font-medium text-gray-500 mb-1">Skills</label><input value={s.skills} onChange={e=>handleArrayUpdate(setSkillsData, s.id, 'skills', e.target.value)} className="w-full p-2 text-sm border rounded outline-none"/></div></div>)}<button onClick={()=>handleArrayAdd(setSkillsData, {category:'', skills:''})} className="text-blue-600 text-sm font-medium flex items-center gap-1"><Plus size={16}/> Add Category</button></div>:<div><label className="block text-xs font-medium text-gray-500 mb-1">Skills Content</label><textarea value={skillsContent} onChange={e=>setSkillsContent(e.target.value)} rows={3} className="w-full p-2 border rounded outline-none"/></div>}</div>;
      case 'certifications': return <div className="space-y-2">{(certifications || []).map(c=><div key={c.id} className="flex gap-2 items-center bg-white p-2 border rounded"><input value={c.text} onChange={e=>handleArrayUpdate(setCertifications, c.id, 'text', e.target.value)} className="flex-1 p-1 outline-none" placeholder="Certification"/><button onClick={()=>handleArrayRemove(setCertifications, c.id)} className="text-red-400"><Trash2 size={18}/></button></div>)}<button onClick={()=>handleArrayAdd(setCertifications, {text:''})} className="text-blue-600 text-sm font-medium flex items-center gap-1"><Plus size={16}/> Add Cert</button></div>;
      case 'achievements': return <div className="space-y-2">{(achievements || []).map(a=><div key={a.id} className="flex gap-2 items-center bg-white p-2 border rounded"><input value={a.text} onChange={e=>handleArrayUpdate(setAchievements, a.id, 'text', e.target.value)} className="flex-1 p-1 outline-none" placeholder="Achievement"/><button onClick={()=>handleArrayRemove(setAchievements, a.id)} className="text-red-400"><Trash2 size={18}/></button></div>)}<button onClick={()=>handleArrayAdd(setAchievements, {text:''})} className="text-blue-600 text-sm font-medium flex items-center gap-1"><Plus size={16}/> Add Achievement</button></div>;
      default: return null;
    }
  };

  const headHColor = themeTextColor === 'white' ? '#ffffff' : '#0f172a';
  const headPColor = themeTextColor === 'white' ? '#f1f5f9' : '#334155';

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-100 overflow-hidden font-sans">
      {/* LEFT EDITOR PANEL */}
      <div className="w-full lg:w-[45%] h-full overflow-y-auto bg-slate-50 border-r border-gray-200 shadow-lg z-10 p-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="flex items-center gap-1 text-blue-600 font-bold hover:text-blue-800"><ArrowLeft size={18}/> Back</button>
          <h1 className="text-xl font-bold text-slate-800">Editor</h1>
        </div>

        <section className={`bg-white p-5 rounded-lg border mb-6 ${activeSection === 'basic-info' ? 'border-slate-800 ring-1' : 'border-gray-200'}`} onClickCapture={()=>setActiveSection('basic-info')}>
          <h2 className="font-bold border-b pb-2 mb-4 text-lg">Basic Info</h2>
          <div className="bg-slate-50 p-4 border rounded-lg mb-4">
            <label className="flex items-center gap-2 font-medium cursor-pointer"><input type="checkbox" checked={showPhoto} onChange={e=>setShowPhoto(e.target.checked)} className="w-4 h-4"/> Include Photo</label>
            {showPhoto && <div className="mt-3 pl-4 border-l-2 border-slate-200"><input type="file" accept="image/*" onChange={handlePhotoUpload} className="w-full text-xs text-slate-500 file:bg-blue-50 file:text-blue-700 file:rounded file:px-3 file:py-1 file:border-0"/>{template==='1-column'&&<div className="mt-2 flex items-center gap-2"><span className="text-xs text-gray-500">Align:</span><select value={photoAlignment} onChange={e=>setPhotoAlignment(e.target.value)} className="p-1 text-xs border rounded"><option value="left">Left</option><option value="center">Center</option><option value="right">Right</option></select></div>}</div>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 flex justify-between"><label className="text-sm font-medium text-gray-600">Name</label>{template==='1-column'&&<select value={headerAlignment} onChange={e=>setHeaderAlignment(e.target.value)} className="p-1 text-xs border rounded"><option value="left">Left Align</option><option value="center">Center Align</option></select>}</div>
            <input name="name" value={personalInfo?.name || ''} onChange={handlePersonalInfoChange} className="md:col-span-2 w-full p-2 border rounded -mt-2 outline-none"/>
            <input name="email" value={personalInfo?.email || ''} onChange={handlePersonalInfoChange} className="w-full p-2 border rounded outline-none" placeholder="Email"/>
            <input name="phone" value={personalInfo?.phone || ''} onChange={handlePersonalInfoChange} className="w-full p-2 border rounded outline-none" placeholder="Phone"/>
            <input name="location" value={personalInfo?.location || ''} onChange={handlePersonalInfoChange} className="md:col-span-2 w-full p-2 border rounded outline-none" placeholder="Location"/>
          </div>
          <div className="mt-4 pt-4 border-t">
            <label className="block text-sm font-medium text-gray-600 mb-2">Social Links</label>
            {(links || []).map(l => <div key={l.id} className="flex gap-2 mb-2 bg-slate-50 p-2 border rounded"><input value={l.label} onChange={e=>handleArrayUpdate(setLinks, l.id, 'label', e.target.value)} className="flex-1 p-1 text-sm border rounded" placeholder="Label"/><input value={l.url} onChange={e=>handleArrayUpdate(setLinks, l.id, 'url', e.target.value)} className="flex-1 p-1 text-sm border rounded" placeholder="URL"/><button onClick={()=>handleArrayRemove(setLinks, l.id)} className="text-red-400"><Trash2 size={16}/></button></div>)}
            <button onClick={()=>handleArrayAdd(setLinks, {label:'', url:''})} className="text-blue-600 text-sm font-medium flex items-center gap-1"><Plus size={16}/> Add Link</button>
          </div>
        </section>

        <div className="space-y-4">
          <p className="text-sm text-gray-500 font-medium flex items-center gap-2"><GripVertical size={16}/> Drag headers to reorder.</p>
          {(sections || []).map((s, i) => (
            <div key={s.id} className={`bg-white rounded-lg border overflow-hidden ${activeSection===s.id?'border-slate-800 ring-1':(s.visible?'border-blue-200':'border-gray-200 opacity-60')}`} onClickCapture={()=>setActiveSection(s.id)}>
              <div draggable onDragStart={e=>handleDragStart(e,i)} onDrop={e=>handleDrop(e,i)} onDragOver={e=>e.preventDefault()} className={`p-3 flex items-center justify-between cursor-grab border-b ${s.visible?'bg-blue-50':'bg-gray-50'}`}>
                <div className="flex items-center gap-2"><GripVertical size={18} className="text-slate-400"/><h2 className="font-bold text-slate-800">{s.title}</h2></div>
                <div className="flex items-center gap-1">
                  {template==='2-column'&&<div className="flex bg-slate-200 rounded p-0.5 mr-2"><button onClick={()=>toggleSectionColumn(s.id,'left')} className={`text-[10px] px-2 py-1 rounded-sm ${s.column==='left'?'bg-white text-blue-600 font-bold':'text-slate-500'}`}>L</button><button onClick={()=>toggleSectionColumn(s.id,'right')} className={`text-[10px] px-2 py-1 rounded-sm ${s.column==='right'?'bg-white text-blue-600 font-bold':'text-slate-500'}`}>R</button></div>}
                  <button onClick={()=>toggleSectionTimeline(s.id)} className={`text-[10px] px-2 py-1 rounded-sm mr-2 ${s.timeline?'bg-white text-blue-600 font-bold shadow-sm':'text-slate-500'}`}>Line</button>
                  <button onClick={()=>toggleSectionVisibility(s.id)} className={`p-1.5 rounded ${s.visible?'text-blue-600':'text-gray-400'}`}>{s.visible?<Eye size={18}/>:<EyeOff size={18}/>}</button>
                </div>
              </div>
              {s.visible && <div className="p-4 bg-slate-50">{renderEditorSection(s.id)}</div>}
            </div>
          ))}
          <button onClick={handleAddCustomSection} className="w-full py-3 border-2 border-dashed border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 font-medium flex items-center justify-center gap-2"><Plus size={18}/> Add Custom Section</button>
        </div>
      </div>

      {/* RIGHT PREVIEW PANEL */}
      <div className="flex-1 h-full bg-gray-200 p-4 lg:p-8 overflow-y-auto flex flex-col items-center">
        <div className="w-full max-w-[816px] flex flex-col gap-4 pb-12">
          
          {isOverflowing && <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded flex items-start gap-3"><AlertTriangle className="text-red-500 mt-0.5" size={20}/><p className="text-red-700 text-sm">Content exceeds {pageCount}-page limit. Adjust font or layout.</p></div>}
          
          <div className="bg-white rounded-xl shadow p-4 border border-gray-200 shrink-0">
            {historyRef.current.length > 1 && (
              <div className="flex items-center gap-2 mb-4 border-b pb-4">
                <button onClick={undo} disabled={historyIndex<=0} className="p-2 bg-slate-100 rounded disabled:opacity-50"><Undo2 size={18}/></button>
                <button onClick={redo} disabled={historyIndex>=historyRef.current.length-1} className="p-2 bg-slate-100 rounded disabled:opacity-50"><Redo2 size={18}/></button>
              </div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div className="bg-slate-50 p-2 rounded border">
                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Head Size</span>
                <select value={headSizeSelection} onChange={e=>setHeadSizeSelection(e.target.value)} className="w-full text-xs p-1 border rounded outline-none bg-white"><option value="0">None</option><option value="32">Normal</option><option value="custom">Custom...</option></select>
                {headSizeSelection==='custom'&&<input type="number" value={customHeadSize} onChange={e=>setCustomHeadSize(Number(e.target.value))} className="w-full mt-1 text-xs border rounded p-1"/>}
              </div>
              <div className="bg-slate-50 p-2 rounded border">
                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Theme</span>
                <div className="flex gap-2 items-center"><input type="color" value={themeColor} onChange={e=>setThemeColor(e.target.value)} className="w-6 h-6 border-0 cursor-pointer p-0 bg-transparent"/><select value={themeTextColor} onChange={e=>setThemeTextColor(e.target.value)} className="text-[10px] p-1 border rounded outline-none bg-white"><option value="black">Dark Txt</option><option value="white">Light Txt</option></select></div>
              </div>
              <div className="bg-slate-50 p-2 rounded border">
                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Font</span>
                <div className="flex gap-1 items-center">
                  <input type="number" min="8" max="16" value={fontSizeNum} onChange={e=>setFontSizeNum(Number(e.target.value))} className="w-10 text-xs border rounded p-1 text-center" />
                  <select value={fontFamily} onChange={e=>setFontFamily(e.target.value)} className="w-full text-[10px] p-1 border rounded outline-none bg-white">
                    <option value="'Garamond', serif">Garamond</option>
                    <option value="'Times New Roman', serif">Times New Roman</option>
                    <option value="'Arial', sans-serif">Arial</option>
                    <option value="'Calibri', sans-serif">Calibri</option>
                    <option value="'Georgia', serif">Georgia</option>
                  </select>
                </div>
              </div>
              <div className="bg-slate-50 p-2 rounded border">
                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Pages</span>
                <select value={pageSelection} onChange={e=>setPageSelection(e.target.value)} className="w-full text-xs p-1 border rounded outline-none bg-white"><option value="1">1</option><option value="2">2</option><option value="custom">Custom</option></select>
                {pageSelection==='custom'&&<input type="number" value={customPageCount} onChange={e=>setCustomPageCount(Number(e.target.value))} className="w-full mt-1 text-xs border rounded p-1"/>}
              </div>
            </div>
            <button onClick={generateExactPDF} disabled={isDownloading} className="w-full py-3 bg-yellow-400 text-yellow-900 rounded font-extrabold flex items-center justify-center gap-2 shadow hover:bg-yellow-500"><Download size={20}/>{isDownloading?'Generating...':'Download PDF'}</button>
          </div>

          <div className="w-full overflow-x-auto text-center pb-12">
            {/* NO BORDERS, MARGINS, OR PADDING ON THE RENDER TARGET */}
            <div ref={previewContainerRef} className="inline-block text-left shadow-2xl bg-white" style={{ width: '816px', height: `${pageCount * 1056}px` }}>
              <div id="resume-preview-content" ref={innerContentRef} className="w-full h-full flex flex-col bg-white overflow-hidden" style={{ fontFamily, color: '#0f172a' }}>
                {template === '1-column' ? (
                  <div className="flex-1">
                    <div className={`flex ${photoAlignment==='center'?'flex-col':photoAlignment==='right'?'flex-row-reverse':'flex-row'} items-center gap-6 px-10 mb-4`} style={{ backgroundColor: themeColor, paddingTop: `${activeHeadSizeNum}px`, paddingBottom: `${activeHeadSizeNum}px` }}>
                      {showPhoto && <div style={{width:picSizeStr,height:picSizeStr,minWidth:picSizeStr}} className="shrink-0">{photoUrl?<img src={photoUrl} className="w-full h-full rounded-full object-cover border-4 border-slate-100 shadow-sm"/>:<div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center border-4 border-slate-50"><User size={60} className="text-slate-400"/></div>}</div>}
                      <div className={`flex-1 w-full ${headerAlignment==='center'?'text-center':'text-left'}`}><h1 style={{...sTitle, color: headHColor}} className="font-bold mb-1 break-words">{personalInfo?.name}</h1><div style={{...sSm, color: headPColor}} className={`flex flex-wrap ${headerAlignment==='center'?'justify-center':'justify-start'} gap-x-5 gap-y-1`}>{personalInfo?.email&&<span className="flex items-center gap-1.5"><Mail size={12}/>{personalInfo.email}</span>}{personalInfo?.phone&&<span className="flex items-center gap-1.5"><Phone size={12}/>{personalInfo.phone}</span>}{personalInfo?.location&&<span className="flex items-center gap-1.5"><MapPin size={12}/>{personalInfo.location}</span>}{(links || []).map(l=>l.url&&<span key={l.id} className="flex items-center gap-1.5"><Link2 size={12}/>{l.label||l.url}</span>)}</div></div>
                    </div>
                    <div className="flex flex-col px-10 pb-10">{(sections || []).filter(s=>s.visible).map(s=>renderPreviewSection(s.id))}</div>
                  </div>
                ) : (
                  <div className="flex flex-row flex-1 items-stretch h-full">
                    <div className="p-8 flex flex-col border-r" style={{ backgroundColor: themeColor, width: `${activeHeadSizeNum}%`, minHeight: '100%' }}>
                      {showPhoto && <div style={{width:picSizeStr,height:picSizeStr,minWidth:picSizeStr}} className="mb-5">{photoUrl?<img src={photoUrl} className="w-full h-full rounded-full object-cover border-4 border-white"/>:<div className="w-full h-full rounded-full bg-white flex items-center justify-center border-4 border-gray-200"><User size={60} className="text-gray-400"/></div>}</div>}
                      <h1 style={{...sTitle, color: headHColor}} className="font-bold mb-4 leading-tight break-words">{personalInfo?.name}</h1>
                      <div className="space-y-2 mb-6" style={{color: headPColor}}>{personalInfo?.email&&<div className="flex gap-3"><Mail size={12} className="mt-0.5"/><span style={sSm} className="break-all">{personalInfo.email}</span></div>}{personalInfo?.phone&&<div className="flex gap-3"><Phone size={12} className="mt-0.5"/><span style={sSm}>{personalInfo.phone}</span></div>}{personalInfo?.location&&<div className="flex gap-3"><MapPin size={12} className="mt-0.5"/><span style={sSm}>{personalInfo.location}</span></div>}</div>
                      {(links || []).some(l=>l.url)&&<div className="grid grid-cols-2 gap-2 mb-6" style={{color: headPColor}}>{links.map(l=>l.url&&<div key={l.id} className="flex gap-2"><Link2 size={12} className="mt-1"/><span style={sSm} className="break-all">{l.label||l.url}</span></div>)}</div>}
                      {(sections || []).filter(s=>s.visible && s.column==='left').map(s=>renderPreviewSection(s.id, 'themed'))}
                    </div>
                    <div className="p-8 flex flex-col bg-white" style={{ width: `${100 - activeHeadSizeNum}%` }}>
                      {(sections || []).filter(s=>s.visible && s.column==='right').map(s=>renderPreviewSection(s.id))}
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

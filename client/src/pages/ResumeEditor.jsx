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



// 1-COLUMN ISOLATED DEFAULTS

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



// 2-COLUMN ISOLATED DEFAULTS

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

      

      // Strip everything that could cause a white line/border artifact

      clone.style.margin = '0px';

      clone.style.padding = '0px';

      clone.style.boxShadow = 'none';

      clone.style.border = 'none';

      clone.style.outline = 'none';

      clone.style.borderRadius = '0px';

      clone.style.width = '816px';

      clone.style.height = `${pageCount * 1056}px`;



      const wrapper = document.createElement('div');

      wrapper.style.cssText = `position:absolute;top:0;left:0;width:816px;height:${pageCount * 1056}px;z-index:-9999;background:white;margin:0;padding:0;border:none;overflow:hidden;`;

      wrapper.appendChild(clone); 

      document.body.appendChild(wrapper);



      const base = personalInfo?.name ? personalInfo.name.trim().replace(/\s+/g, '_') : 'Resume';

      

      // Exact pixel formatting + forced zero coordinates to fix left-alignment gap

      const opt = { 

        margin: 0, 

        filename: `${base}.pdf`, 

        image: { type: 'jpeg', quality: 1 }, 

        html2canvas: { 

          scale: 2, 

          useCORS: true, 

          logging: false, 

          width: 816, 

          windowWidth: 816,

          x: 0, 

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


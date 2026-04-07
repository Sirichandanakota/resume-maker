import React, { useState, useEffect, useRef } from 'react';
import { User, Mail, Phone, MapPin, Link2, Plus, Trash2, FileText, ArrowLeft, Image as ImageIcon, Download, GripVertical, Eye, EyeOff, AlertTriangle, Undo2, Redo2, X, Award, CheckCircle, LogOut, ChevronRight, Lock } from 'lucide-react';

// ==========================================
// 1. CONSTANTS & DEFAULTS
// ==========================================
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

// ==========================================
// 2. MOCKUPS & UI COMPONENTS (Hoisted)
// ==========================================
function Mockup1Column() {
  return (
    <div className="absolute inset-0 w-[80%] mx-auto aspect-[1/1.4] bg-white rounded-lg shadow-xl overflow-hidden flex flex-col transform -rotate-6 -translate-x-10 border border-gray-200 hover:rotate-0 hover:z-20 transition-all duration-500 ease-in-out cursor-default">
       <div className="w-full bg-slate-800 p-4 text-center">
          <div className="w-1/2 h-2.5 bg-white rounded mx-auto mb-2"></div>
          <div className="w-3/4 flex justify-center gap-2 mx-auto">
             <div className="w-1/4 h-1.5 bg-slate-500 rounded"></div>
             <div className="w-1/4 h-1.5 bg-slate-500 rounded"></div>
             <div className="w-1/4 h-1.5 bg-slate-500 rounded"></div>
           </div>
       </div>
       <div className="p-5 space-y-5">
          <div>
             <div className="w-1/4 h-2 bg-slate-800 rounded mb-3 border-b border-slate-200 pb-1"></div>
             <div className="space-y-2">
               <div className="flex justify-between">
                 <div className="w-1/3 h-1.5 bg-slate-600 rounded"></div>
                 <div className="w-1/6 h-1.5 bg-slate-400 rounded"></div>
               </div>
               <div className="w-full h-1 bg-slate-300 rounded"></div>
               <div className="w-5/6 h-1 bg-slate-300 rounded"></div>
             </div>
          </div>
          <div>
             <div className="w-1/4 h-2 bg-slate-800 rounded mb-3 border-b border-slate-200 pb-1"></div>
             <div className="space-y-2">
               <div className="w-full h-1 bg-slate-300 rounded"></div>
               <div className="w-full h-1 bg-slate-300 rounded"></div>
               <div className="w-3/4 h-1 bg-slate-300 rounded"></div>
             </div>
          </div>
       </div>
    </div>
  );
}

function Mockup2Column() {
  return (
    <div className="absolute inset-0 w-[80%] mx-auto aspect-[1/1.4] bg-white rounded-lg shadow-2xl overflow-hidden flex transform rotate-3 translate-x-10 translate-y-4 border border-gray-200 hover:rotate-0 hover:z-20 transition-all duration-500 ease-in-out cursor-default">
       <div className="w-[35%] bg-slate-800 p-4 flex flex-col gap-4">
          <div className="w-12 h-12 rounded-full bg-slate-400 border-2 border-white mx-auto overflow-hidden shadow-sm">
             <img src="https://i.pravatar.cc/150?img=44" className="w-full h-full object-cover" alt="" />
          </div>
          <div className="text-center">
            <div className="w-full h-2 bg-white/90 rounded mb-2"></div>
            <div className="w-2/3 h-1.5 bg-white/60 rounded mx-auto"></div>
          </div>
          <div className="mt-2 space-y-2">
             <div className="w-full h-1 bg-white/40 rounded"></div>
             <div className="w-5/6 h-1 bg-white/40 rounded"></div>
             <div className="w-4/6 h-1 bg-white/40 rounded"></div>
          </div>
       </div>
       <div className="w-[65%] bg-white p-5 space-y-5">
          <div>
             <div className="w-1/3 h-2 bg-slate-800 rounded mb-3"></div>
             <div className="space-y-2">
               <div className="flex justify-between">
                 <div className="w-1/2 h-1.5 bg-slate-600 rounded"></div>
               </div>
               <div className="w-full h-1 bg-slate-300 rounded"></div>
               <div className="w-5/6 h-1 bg-slate-300 rounded"></div>
             </div>
          </div>
          <div>
             <div className="w-1/3 h-2 bg-slate-800 rounded mb-3"></div>
             <div className="space-y-4">
               <div className="space-y-2">
                 <div className="w-1/2 h-1.5 bg-slate-600 rounded mb-1"></div>
                 <div className="w-full h-1 bg-slate-300 rounded"></div>
                 <div className="w-5/6 h-1 bg-slate-300 rounded"></div>
               </div>
               <div className="space-y-2">
                 <div className="w-1/2 h-1.5 bg-slate-600 rounded mb-1"></div>
                 <div className="w-full h-1 bg-slate-300 rounded"></div>
                 <div className="w-4/6 h-1 bg-slate-300 rounded"></div>
               </div>
             </div>
          </div>
       </div>
    </div>
  );
}

function TemplateCard1Column() {
  return (
    <div className="h-56 bg-slate-100 flex items-center justify-center p-6 border-b border-slate-100">
      <div className="w-full h-full bg-white shadow-sm p-4 space-y-4 flex flex-col border border-gray-300 items-center justify-center rounded-sm overflow-hidden relative">
          <div className="w-full bg-slate-800 p-3 flex flex-col items-center justify-center absolute top-0 left-0 right-0 h-16">
             <div className="w-10 h-10 rounded-full bg-white mb-1 shadow-sm absolute -bottom-5 border-2 border-slate-200"></div>
          </div>
          <div className="w-1/2 h-2 bg-slate-600 rounded mt-8"></div>
          <div className="w-3/4 h-1.5 bg-slate-300 rounded mb-2"></div>
          <div className="w-full border-t border-slate-200 pt-2 space-y-2">
             <div className="w-full h-1.5 bg-slate-200 rounded"></div>
             <div className="w-5/6 h-1.5 bg-slate-200 rounded"></div>
          </div>
      </div>
    </div>
  );
}

function TemplateCard2Column() {
  return (
    <div className="h-56 bg-slate-100 flex items-center justify-center p-6 border-b border-slate-100">
      <div className="w-full h-full bg-white shadow-sm flex border border-gray-300 rounded-sm overflow-hidden">
        <div className="w-1/3 border-r border-gray-200 bg-slate-800 p-3 space-y-3">
          <div className="w-8 h-8 rounded-full bg-slate-400 mb-2 mx-auto"></div>
          <div className="w-full h-2 bg-slate-200 rounded"></div>
          <div className="w-full h-1.5 bg-slate-400 rounded mt-4"></div>
          <div className="w-5/6 h-1.5 bg-slate-400 rounded"></div>
        </div>
        <div className="w-2/3 p-3 space-y-4">
          <div className="w-1/2 h-3 bg-slate-600 rounded"></div>
          <div className="w-full h-1.5 bg-slate-200 rounded"></div>
          <div className="w-full h-1.5 bg-slate-200 rounded"></div>
          <div className="w-3/4 h-1.5 bg-slate-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-300 py-12 mt-auto relative z-20 w-full">
      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start">
            <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center mb-4">
              <Award size={24} />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Professional Templates</h3>
            <p className="text-sm leading-relaxed text-slate-400">Stand out with modern, customized layouts designed to highlight your strengths.</p>
          </div>
          <div className="flex flex-col items-center md:items-start">
            <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center mb-4">
              <CheckCircle size={24} />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Fast & Intuitive</h3>
            <p className="text-sm leading-relaxed text-slate-400">Build and customize your resume in minutes with our simple, real-time interactive editor.</p>
          </div>
          <div className="flex flex-col items-center md:items-start">
            <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center mb-4">
              <Download size={24} />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Instant PDF Export</h3>
            <p className="text-sm leading-relaxed text-slate-400">Download your perfectly formatted resume instantly in high-quality PDF format.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ==========================================
// 3. PAGE COMPONENTS
// ==========================================
function LoginPage({ onLogin, onSwitchToSignUp, onBack }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password && name) onLogin(email, name);
  };

  return (
    <div className="min-h-screen flex font-sans bg-white relative">
      <button onClick={onBack} className="absolute top-6 left-6 flex items-center gap-2 text-slate-700 hover:text-blue-600 font-bold z-20 bg-white/80 px-4 py-2 rounded-full shadow-sm backdrop-blur transition-all">
         <ArrowLeft size={18} /> Back to Home
      </button>

      <div className="hidden lg:flex w-1/2 bg-blue-600 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        <div className="z-10 text-white text-center px-12">
          <FileText size={80} className="mx-auto mb-6 text-blue-200" />
          <h2 className="text-4xl font-extrabold mb-4">ResumeMaker</h2>
          <p className="text-blue-100 text-lg leading-relaxed">Log in to access your saved templates, continue editing your professional resume, and download the latest versions.</p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-slate-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-100">
              <Lock size={28} className="text-blue-600" />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Welcome Back</h1>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Full Name</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3.5 border border-slate-300 rounded-xl outline-none" placeholder="Enter your full name" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Email Address</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3.5 border border-slate-300 rounded-xl outline-none" placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Password</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3.5 border border-slate-300 rounded-xl outline-none" placeholder="••••••••" />
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-4 px-4 rounded-xl flex items-center justify-center gap-2 transition-all mt-4 shadow-lg">
              Sign In <ChevronRight size={20} />
            </button>
          </form>
          
          <div className="mt-8 text-center text-sm font-medium text-slate-600">
            Don't have an account? <button onClick={onSwitchToSignUp} className="text-blue-600 font-extrabold hover:text-blue-800 ml-1">Sign Up</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SignUpPage({ onSignUp, onSwitchToLogin, onBack }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password && name) onSignUp(email, name);
  };

  return (
    <div className="min-h-screen flex font-sans bg-white relative">
      <button onClick={onBack} className="absolute top-6 left-6 flex items-center gap-2 text-slate-700 hover:text-blue-600 font-bold z-20 bg-white/80 px-4 py-2 rounded-full shadow-sm backdrop-blur transition-all">
         <ArrowLeft size={18} /> Back to Home
      </button>

      <div className="hidden lg:flex w-1/2 bg-blue-600 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
        <div className="z-10 text-white text-center px-12">
          <Award size={80} className="mx-auto mb-6 text-blue-200" />
          <h2 className="text-4xl font-extrabold mb-4">Start Your Journey</h2>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-slate-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-100">
              <User size={28} className="text-blue-600" />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Create an Account</h1>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Full Name</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3.5 border border-slate-300 rounded-xl outline-none" placeholder="Enter your full name" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Email Address</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3.5 border border-slate-300 rounded-xl outline-none" placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Password</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3.5 border border-slate-300 rounded-xl outline-none" placeholder="••••••••" />
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-4 px-4 rounded-xl flex items-center justify-center gap-2 transition-all mt-6 shadow-lg">
              Sign Up <ChevronRight size={20} />
            </button>
          </form>
          
          <div className="mt-8 text-center text-sm font-medium text-slate-600">
            Already have an account? <button onClick={onSwitchToLogin} className="text-blue-600 font-extrabold hover:text-blue-800 ml-1">Sign In</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function HomePage({ userEmail, onLogout, onNavigate }) {
  const handleCreateCV = () => {
    if (userEmail) onNavigate('templates');
    else onNavigate('login');
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      <header className="flex justify-between items-center p-4 sm:p-6 bg-white border-b border-gray-100 z-20">
        <div className="flex items-center gap-2 text-blue-800 font-bold text-2xl tracking-tight cursor-pointer" onClick={() => onNavigate('home')}>
          <FileText size={28} className="text-blue-500" /> ResumeMaker
        </div>
        <div className="flex items-center gap-4">
          {userEmail ? (
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="hidden md:flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200">
                  <User size={16} className="text-blue-600" />
                </div>
                <span className="text-sm font-bold text-gray-700">{userEmail}</span>
              </div>
              <button onClick={onLogout} className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm shadow-md">
                <LogOut size={16} /> <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <button onClick={() => onNavigate('signup')} className="font-bold text-gray-700 hover:text-blue-600 transition-colors">Sign Up</button>
              <button onClick={() => onNavigate('login')} className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-700 transition-colors shadow-md">Sign In</button>
            </div>
          )}
        </div>
      </header>
      
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center max-w-7xl mx-auto px-6 py-12 gap-16 overflow-hidden">
        <div className="lg:w-1/2 space-y-6 z-10 text-center lg:text-left">
          <h2 className="text-blue-700 font-bold text-xl tracking-wide uppercase">Fast. Easy. Effective.</h2>
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight">
            ResumeMaker. The Best CV Maker Online.
          </h1>
          <p className="text-gray-600 text-lg md:text-xl leading-relaxed">
            Build a professional, eye-catching resume from scratch in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-6 justify-center lg:justify-start">
            <button onClick={handleCreateCV} className="bg-yellow-400 text-yellow-900 font-extrabold px-10 py-4 rounded-full hover:bg-yellow-500 shadow-lg text-lg transition-transform hover:scale-105 active:scale-95 text-center">
              Create new CV
            </button>
          </div>
        </div>
        
        <div className="lg:w-1/2 relative w-full max-w-lg mt-12 lg:mt-0 h-[500px]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-pink-100 rounded-full -z-10 blur-3xl opacity-60 translate-x-20 -translate-y-10"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-100 rounded-full -z-10 blur-3xl opacity-60 -translate-x-10 translate-y-20"></div>
          <Mockup1Column />
          <Mockup2Column />
        </div>
      </main>
      <Footer />
    </div>
  );
}

function TemplatesPage({ onSelect, userEmail, userName, onLogout, onBack }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans relative overflow-x-hidden">
      <div className="absolute inset-0 z-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #cbd5e1 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
      
      <header className="bg-white/80 backdrop-blur-md text-slate-800 p-4 sm:p-6 shadow-sm border-b border-gray-200 flex items-center justify-between z-10">
        <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={onBack}>
          <ArrowLeft size={20} className="text-blue-600 hidden sm:block" />
          <FileText size={24} className="text-blue-600 sm:w-7 sm:h-7" />
          <h1 className="text-xl sm:text-2xl font-bold text-blue-900">ResumeMaker</h1>
        </div>
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="hidden md:flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center border border-blue-200">
              <User size={16} className="text-blue-600" />
            </div>
            <span className="text-sm font-medium text-slate-700 truncate max-w-[150px]">{userEmail || 'Guest'}</span>
          </div>
          <button onClick={onLogout} className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm shadow-md">
            <LogOut size={16} /> <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>
      
      <main className="flex-grow flex flex-col items-center p-4 sm:p-8 z-10 relative">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-900 mb-4 text-center">Choose a Template</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          <div onClick={() => onSelect('2-column')} className="bg-white rounded-2xl shadow-lg border-4 border-blue-300 overflow-hidden cursor-pointer hover:-translate-y-1 transition-all duration-300 group">
            <TemplateCard2Column />
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">Professional 2-Column</h3>
            </div>
          </div>
          <div onClick={() => onSelect('1-column')} className="bg-white rounded-2xl shadow-lg border-4 border-blue-300 overflow-hidden cursor-pointer hover:-translate-y-1 transition-all duration-300 group">
            <TemplateCard1Column />
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">Creative 1-Column</h3>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// ==========================================
// 4. RESUME EDITOR (Core Editor Component)
// ==========================================
function ResumeEditor({ template, userFullName, userEmail, onBack }) {
  const initShared = safeParse('ResumeMaker_Shared_Content', DEFAULT_SHARED_CONTENT);
  const initSettings = safeParse(`ResumeMaker_Settings_${template}`, template === '1-column' ? DEFAULT_SETTINGS_1_COL : DEFAULT_SETTINGS_2_COL);

  // ISOLATED SETTINGS
  const [pageSelection, setPageSelection] = useState(() => initSettings.pageSelection || '1'); 
  const [customPageCount, setCustomPageCount] = useState(() => initSettings.customPageCount || 5);
  const pageCount = pageSelection === 'custom' ? customPageCount : parseInt(pageSelection) || 1;

  const [fontSizeNum, setFontSizeNum] = useState(() => initSettings.fontSizeNum || (template === '1-column' ? 9 : 12)); 
  const [fontFamily, setFontFamily] = useState(() => initSettings.fontFamily || "'Times New Roman', serif");
  const [themeColor, setThemeColor] = useState(() => initSettings.themeColor || '#31414e'); 
  const [themeTextColor, setThemeTextColor] = useState(() => initSettings.themeTextColor || (template === '1-column' ? 'black' : 'white')); 
  
  const [headSizeSelection, setHeadSizeSelection] = useState(() => initSettings.headSizeSelection || (template === '1-column' ? '0' : '32')); 
  const [customHeadSize, setCustomHeadSize] = useState(() => initSettings.customHeadSize || 32);
  const [headerAlignment, setHeaderAlignment] = useState(() => initSettings.headerAlignment || 'left');
  const [photoAlignment, setPhotoAlignment] = useState(() => initSettings.photoAlignment || 'left');
  const [sections, setSections] = useState(() => initSettings.sections || (template === '1-column' ? DEFAULT_SETTINGS_1_COL.sections : DEFAULT_SETTINGS_2_COL.sections));

  // SHARED CONTENT
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

  const [activeSection, setActiveSection] = useState('basic-info');
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const previewContainerRef = useRef(null);
  const innerContentRef = useRef(null);

  // HISTORY / UNDO
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
    } catch(e) { }
  };

  const activeHeadSize =
  headSizeSelection === 'custom'
    ? customHeadSize
    : headSizeSelection;


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
    setCustomSectionsData(p => ({ ...p, [id]: { ...(p[id] || {}), title: val } }));
    setSections(p => (p || []).map(s => s.id === id ? { ...s, title: val || 'Custom Section' } : s));
  };
  const updateCustomItem = (sid, iid, f, v) => { setCustomSectionsData(p => ({ ...p, [sid]: { ...(p[sid] || {}), items: ((p[sid] || {}).items || []).map(i => i.id === iid ? { ...i, [f]: v } : i) } })); };
  const deleteCustomSection = (id) => { setSections(p => (p || []).filter(s => s.id !== id)); setCustomSectionsData(p => { const n = { ...p }; delete n[id]; return n; }); };
  const addCustomItem = (sid) => { setCustomSectionsData(p => ({ ...p, [sid]: { ...(p[sid] || {}), items: [...((p[sid] || {}).items || []), { id: Date.now(), title: '', subtitle: '', description: '' }] } })); };
  const removeCustomItem = (sid, iid) => { setCustomSectionsData(p => ({ ...p, [sid]: { ...(p[sid] || {}), items: ((p[sid] || {}).items || []).filter(i => i.id !== iid) } })); };

  const activeHeadSizeNum = Number(activeHeadSize);
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

  // --- WHITE-LINE FIX: PIXEL-PERFECT PDF ---
  const processPDF = () => {
    return new Promise((resolve, reject) => {
      const element = document.getElementById('resume-preview-content');
      const clone = element.cloneNode(true);
      
      // Strip everything that causes white lines or rendering artifacts
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
          x: 0, // Forces absolute left alignment to remove white line
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
      case 'skills': return (skillsFormat === 'categorized' ? (skillsData || []).length > 0 : skillsContent) && <div key="skills" className={sectionMb} style={style}><h2 style={{...sXl, color: hColor, borderBottomColor: borderColor}} className={`font-bold ${titleMb} uppercase border-b pb-1`}>Skills</h2>{renderTimelineItem(skillsFormat === 'categorized' ? <div className="space-y-1">{(skillsData || []).map(i => i.category && i.skills && <div key={`sk-${i.id}`} style={{...sBase, color: pColor}}><span style={{color: hColor}} className="mr-1 font-bold">{i.category}:</span>{(i.skills || '').split('|').map(s=>s.trim()).join(' | ')}</div>)}</div> : <div style={{...sBase, color: pColor}}>{(skillsContent || '').split(',').join(' | ')}</div>, 'sk', section.timeline, mode)}</div>;
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
      case 'skills': return <div className="space-y-4"><div className="flex justify-between border-b pb-2"><label className="text-sm font-medium text-gray-600">Format</label><select value={skillsFormat} onChange={e=>setSkillsFormat(e.target.value)} className="p-1 border rounded text-xs outline-none"><option value="categorized">Categorized</option><option value="simple">Simple</option></select></div>{skillsFormat==='categorized'?<div className="space-y-3">{(skillsData || []).map(s=><div key={s.id} className="flex flex-col sm:flex-row gap-3 bg-white p-3 border rounded relative group"><button onClick={()=>handleArrayRemove(setSkillsData, s.id)} className="absolute top-2 right-2 text-red-400 opacity-0 group-hover:opacity-100"><Trash2 size={16}/></button><div className="sm:w-1/3"><label className="block text-xs font-medium text-gray-500 mb-1">Category</label><input value={s.category} onChange={e=>handleArrayUpdate(setSkillsData, s.id, 'category', e.target.value)} className="w-full p-2 text-sm border rounded outline-none"/></div><div className="sm:w-2/3 pr-6"><label className="block text-xs font-medium text-gray-500 mb-1">Skills (Use | to separate)</label><input value={s.skills} onChange={e=>handleArrayUpdate(setSkillsData, s.id, 'skills', e.target.value)} className="w-full p-2 text-sm border rounded outline-none"/></div></div>)}<button onClick={()=>handleArrayAdd(setSkillsData, {category:'', skills:''})} className="text-blue-600 text-sm font-medium flex items-center gap-1"><Plus size={16}/> Add Category</button></div>:<div><label className="block text-xs font-medium text-gray-500 mb-1">Skills Content</label><textarea value={skillsContent} onChange={e=>

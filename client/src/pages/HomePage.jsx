import React from 'react';
import { FileText, LogOut, User } from 'lucide-react';

// --- RESPONSIVE ANIMATED MOCKUP COMPONENTS ---
const Mockup1Column = () => (
  <div className="absolute inset-0 w-[85%] sm:w-[80%] mx-auto aspect-[1/1.4] bg-white rounded-lg shadow-xl overflow-hidden flex flex-col transform -rotate-3 -translate-x-4 sm:-rotate-6 sm:-translate-x-10 border border-gray-200 hover:rotate-0 hover:z-20 transition-all duration-500 ease-in-out cursor-default">
     <div className="w-full bg-slate-800 p-2 sm:p-4 text-center">
        <div className="w-1/2 h-1.5 sm:h-2.5 bg-white rounded mx-auto mb-1.5 sm:mb-2"></div>
        <div className="w-3/4 flex justify-center gap-1.5 sm:gap-2 mx-auto">
           <div className="w-1/4 h-1 sm:h-1.5 bg-slate-500 rounded"></div>
           <div className="w-1/4 h-1 sm:h-1.5 bg-slate-500 rounded"></div>
           <div className="w-1/4 h-1 sm:h-1.5 bg-slate-500 rounded"></div>
         </div>
     </div>
     <div className="p-3 sm:p-5 space-y-3 sm:space-y-5">
        <div>
           <div className="w-1/4 h-1.5 sm:h-2 bg-slate-800 rounded mb-2 sm:mb-3 border-b border-slate-200 pb-1"></div>
           <div className="space-y-1.5 sm:space-y-2">
             <div className="flex justify-between">
               <div className="w-1/3 h-1 sm:h-1.5 bg-slate-600 rounded"></div>
               <div className="w-1/6 h-1 sm:h-1.5 bg-slate-400 rounded"></div>
             </div>
             <div className="w-full h-1 bg-slate-300 rounded"></div>
             <div className="w-5/6 h-1 bg-slate-300 rounded"></div>
           </div>
        </div>
        <div>
           <div className="w-1/4 h-1.5 sm:h-2 bg-slate-800 rounded mb-2 sm:mb-3 border-b border-slate-200 pb-1"></div>
           <div className="space-y-1.5 sm:space-y-2">
             <div className="w-full h-1 bg-slate-300 rounded"></div>
             <div className="w-full h-1 bg-slate-300 rounded"></div>
             <div className="w-3/4 h-1 bg-slate-300 rounded"></div>
           </div>
        </div>
     </div>
  </div>
);

const Mockup2Column = () => (
  <div className="absolute inset-0 w-[85%] sm:w-[80%] mx-auto aspect-[1/1.4] bg-white rounded-lg shadow-2xl overflow-hidden flex transform rotate-2 translate-x-4 translate-y-4 sm:rotate-3 sm:translate-x-10 sm:translate-y-8 border border-gray-200 hover:rotate-0 hover:z-20 transition-all duration-500 ease-in-out cursor-default">
     <div className="w-[35%] bg-slate-800 p-2 sm:p-4 flex flex-col gap-2 sm:gap-4">
        <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-slate-400 border-2 border-white mx-auto overflow-hidden shadow-sm">
           <img src="https://i.pravatar.cc/150?img=44" className="w-full h-full object-cover" alt="Profile Mockup" />
        </div>
        <div className="text-center">
          <div className="w-full h-1.5 sm:h-2 bg-white/90 rounded mb-1 sm:mb-2"></div>
          <div className="w-2/3 h-1 sm:h-1.5 bg-white/60 rounded mx-auto"></div>
        </div>
        <div className="mt-1 sm:mt-2 space-y-1 sm:space-y-2">
           <div className="w-full h-1 bg-white/40 rounded"></div>
           <div className="w-5/6 h-1 bg-white/40 rounded"></div>
           <div className="w-4/6 h-1 bg-white/40 rounded"></div>
        </div>
     </div>
     <div className="w-[65%] bg-white p-3 sm:p-5 space-y-3 sm:space-y-5">
        <div>
           <div className="w-1/3 h-1.5 sm:h-2 bg-slate-800 rounded mb-2 sm:mb-3"></div>
           <div className="space-y-1.5 sm:space-y-2">
             <div className="flex justify-between">
               <div className="w-1/2 h-1 sm:h-1.5 bg-slate-600 rounded"></div>
             </div>
             <div className="w-full h-1 bg-slate-300 rounded"></div>
             <div className="w-5/6 h-1 bg-slate-300 rounded"></div>
           </div>
        </div>
        <div>
           <div className="w-1/3 h-1.5 sm:h-2 bg-slate-800 rounded mb-2 sm:mb-3"></div>
           <div className="space-y-2 sm:space-y-4">
             <div className="space-y-1 sm:space-y-2">
               <div className="w-1/2 h-1 sm:h-1.5 bg-slate-600 rounded mb-1"></div>
               <div className="w-full h-1 bg-slate-300 rounded"></div>
               <div className="w-5/6 h-1 bg-slate-300 rounded"></div>
             </div>
             <div className="space-y-1 sm:space-y-2">
               <div className="w-1/2 h-1 sm:h-1.5 bg-slate-600 rounded mb-1"></div>
               <div className="w-full h-1 bg-slate-300 rounded"></div>
               <div className="w-4/6 h-1 bg-slate-300 rounded"></div>
             </div>
           </div>
        </div>
     </div>
  </div>
);

// --- HOME PAGE MAIN COMPONENT ---
export default function HomePage({ userEmail, onLogout, onNavigate }) {
  const handleCreateCV = () => {
    if (userEmail) {
      onNavigate('templates');
    } else {
      onNavigate('login');
    }
  };

  return (
    // Changed to h-screen and overflow-hidden to completely stop scrolling
    <div className="h-screen w-full bg-white font-sans flex flex-col overflow-hidden">
      
      {/* HEADER - Kept compact so it doesn't take up too much vertical space */}
      <header className="flex-none flex justify-between items-center px-4 py-3 sm:px-6 sm:py-4 bg-white border-b border-gray-100 z-20">
        <div className="flex items-center gap-1.5 sm:gap-2 text-blue-800 font-bold text-xl sm:text-2xl tracking-tight cursor-pointer" onClick={() => onNavigate('home')}>
          <FileText className="text-blue-500 w-6 h-6 sm:w-7 sm:h-7" /> 
          <span className="hidden xs:inline">ResumeMaker</span>
          <span className="xs:hidden">RM</span>
        </div>
        
        <div className="flex items-center gap-3 sm:gap-4">
          {userEmail ? (
            <div className="flex items-center gap-3 sm:gap-6">
              <div className="hidden md:flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200">
                  <User size={16} className="text-blue-600" />
                </div>
                <span className="text-sm font-bold text-gray-700 truncate max-w-[120px]">{userEmail}</span>
              </div>
              <button onClick={onLogout} className="bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-full font-bold hover:bg-blue-700 transition-colors flex items-center gap-2 text-xs sm:text-sm shadow-md">
                <LogOut size={14} sm={16} /> <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-4">
              <button onClick={() => onNavigate('signup')} className="font-bold text-gray-700 hover:text-blue-600 transition-colors text-sm sm:text-base px-2">Sign Up</button>
              <button onClick={() => onNavigate('login')} className="bg-blue-600 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-full font-bold hover:bg-blue-700 transition-colors shadow-md text-sm sm:text-base">Sign In</button>
            </div>
          )}
        </div>
      </header>
      
      {/* MAIN CONTENT - Uses flex-1 to fill exact remaining space without pushing off-screen */}
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center max-w-7xl mx-auto px-4 sm:px-6 w-full gap-4 lg:gap-16">
        
        {/* TEXT SECTION - Shrinks on mobile to save space */}
        <div className="w-full lg:w-1/2 space-y-2 sm:space-y-4 lg:space-y-6 z-10 text-center lg:text-left flex-shrink-0 pt-4 lg:pt-0">
          <h2 className="text-blue-700 font-bold text-xs sm:text-sm lg:text-xl tracking-wide uppercase">Fast. Easy. Effective.</h2>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight">
            ResumeMaker.<br className="hidden lg:block"/> The Best CV Maker.
          </h1>
          <p className="text-gray-600 text-sm sm:text-base md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 px-2 sm:px-0">
            Create a professional resume in minutes. Stand out to recruiters and land your dream job with ease.
          </p>
          <div className="pt-2 sm:pt-4">
            <button 
              onClick={handleCreateCV} 
              className="w-[90%] sm:w-auto bg-yellow-400 text-yellow-900 font-extrabold px-8 py-3 lg:px-10 lg:py-4 rounded-full hover:bg-yellow-500 shadow-lg text-sm sm:text-lg transition-transform hover:scale-105 active:scale-95 text-center mx-auto lg:mx-0 block"
            >
              Create new CV
            </button>
          </div>
        </div>
        
        {/* MOCKUPS SECTION - Dynamically scales down based on screen height */}
        <div className="w-full lg:w-1/2 flex items-center justify-center flex-1 min-h-0 pb-4 lg:pb-0">
          {/* This wrapper keeps the aspect ratio correct but squishes it to fit */}
          <div className="relative w-full max-w-[240px] sm:max-w-[320px] lg:max-w-[420px] aspect-[1/1.1]">
            <div className="absolute top-0 right-0 w-32 h-32 lg:w-64 lg:h-64 bg-pink-100 rounded-full -z-10 blur-2xl opacity-60 translate-x-10 -translate-y-5"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 lg:w-72 lg:h-72 bg-blue-100 rounded-full -z-10 blur-2xl opacity-60 -translate-x-10 translate-y-10"></div>
            
            <Mockup1Column />
            <Mockup2Column />
          </div>
        </div>
        
      </main>
    </div>
  );
}

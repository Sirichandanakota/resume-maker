import React from 'react';
import { FileText, LogOut, User } from 'lucide-react';

// --- RESPONSIVE ANIMATED MOCKUP COMPONENTS ---
const Mockup1Column = () => (
  <div className="absolute inset-0 w-[80%] mx-auto aspect-[1/1.4] bg-white rounded-lg shadow-xl overflow-hidden flex flex-col transform -rotate-3 -translate-x-4 md:-rotate-6 md:-translate-x-10 border border-gray-200 hover:rotate-0 hover:z-20 transition-all duration-500 ease-in-out cursor-default">
     <div className="w-full bg-slate-800 p-2 md:p-4 text-center">
        <div className="w-1/2 h-1.5 md:h-2.5 bg-white rounded mx-auto mb-1.5 md:mb-2"></div>
        <div className="w-3/4 flex justify-center gap-1.5 md:gap-2 mx-auto">
           <div className="w-1/4 h-1 md:h-1.5 bg-slate-500 rounded"></div>
           <div className="w-1/4 h-1 md:h-1.5 bg-slate-500 rounded"></div>
           <div className="w-1/4 h-1 md:h-1.5 bg-slate-500 rounded"></div>
         </div>
     </div>
     <div className="p-3 md:p-5 space-y-3 md:space-y-5">
        <div>
           <div className="w-1/4 h-1.5 md:h-2 bg-slate-800 rounded mb-2 md:mb-3 border-b border-slate-200 pb-1"></div>
           <div className="space-y-1.5 md:space-y-2">
             <div className="flex justify-between">
               <div className="w-1/3 h-1 md:h-1.5 bg-slate-600 rounded"></div>
               <div className="w-1/6 h-1 md:h-1.5 bg-slate-400 rounded"></div>
             </div>
             <div className="w-full h-1 bg-slate-300 rounded"></div>
             <div className="w-5/6 h-1 bg-slate-300 rounded"></div>
           </div>
        </div>
        <div>
           <div className="w-1/4 h-1.5 md:h-2 bg-slate-800 rounded mb-2 md:mb-3 border-b border-slate-200 pb-1"></div>
           <div className="space-y-1.5 md:space-y-2">
             <div className="w-full h-1 bg-slate-300 rounded"></div>
             <div className="w-full h-1 bg-slate-300 rounded"></div>
             <div className="w-3/4 h-1 bg-slate-300 rounded"></div>
           </div>
        </div>
     </div>
  </div>
);

const Mockup2Column = () => (
  <div className="absolute inset-0 w-[80%] mx-auto aspect-[1/1.4] bg-white rounded-lg shadow-2xl overflow-hidden flex transform rotate-3 translate-x-4 translate-y-4 md:rotate-3 md:translate-x-10 md:translate-y-8 border border-gray-200 hover:rotate-0 hover:z-20 transition-all duration-500 ease-in-out cursor-default">
     <div className="w-[35%] bg-slate-800 p-2 md:p-4 flex flex-col gap-2 md:gap-4">
        <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-slate-400 border-2 border-white mx-auto overflow-hidden shadow-sm">
           <img src="https://i.pravatar.cc/150?img=44" className="w-full h-full object-cover" alt="Profile Mockup" />
        </div>
        <div className="text-center">
          <div className="w-full h-1.5 md:h-2 bg-white/90 rounded mb-1 md:mb-2"></div>
          <div className="w-2/3 h-1 md:h-1.5 bg-white/60 rounded mx-auto"></div>
        </div>
        <div className="mt-1 md:mt-2 space-y-1 md:space-y-2">
           <div className="w-full h-1 bg-white/40 rounded"></div>
           <div className="w-5/6 h-1 bg-white/40 rounded"></div>
           <div className="w-4/6 h-1 bg-white/40 rounded"></div>
        </div>
     </div>
     <div className="w-[65%] bg-white p-3 md:p-5 space-y-3 md:space-y-5">
        <div>
           <div className="w-1/3 h-1.5 md:h-2 bg-slate-800 rounded mb-2 md:mb-3"></div>
           <div className="space-y-1.5 md:space-y-2">
             <div className="flex justify-between">
               <div className="w-1/2 h-1 md:h-1.5 bg-slate-600 rounded"></div>
             </div>
             <div className="w-full h-1 bg-slate-300 rounded"></div>
             <div className="w-5/6 h-1 bg-slate-300 rounded"></div>
           </div>
        </div>
        <div>
           <div className="w-1/3 h-1.5 md:h-2 bg-slate-800 rounded mb-2 md:mb-3"></div>
           <div className="space-y-2 md:space-y-4">
             <div className="space-y-1 md:space-y-2">
               <div className="w-1/2 h-1 md:h-1.5 bg-slate-600 rounded mb-1"></div>
               <div className="w-full h-1 bg-slate-300 rounded"></div>
               <div className="w-5/6 h-1 bg-slate-300 rounded"></div>
             </div>
             <div className="space-y-1 md:space-y-2">
               <div className="w-1/2 h-1 md:h-1.5 bg-slate-600 rounded mb-1"></div>
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
  
  // LOGIC: If logged in, go to templates; otherwise, go to login.
  const handleAction = () => {
    if (userEmail) {
      onNavigate('templates');
    } else {
      onNavigate('login');
    }
  };

  return (
    // STOPS SCROLLING: Exactly 100vh viewport height, overflow completely hidden
    <div className="h-[100dvh] w-full bg-white font-sans flex flex-col overflow-hidden">
      
      {/* HEADER */}
      <header className="flex-none flex justify-between items-center px-4 py-3 md:px-6 md:py-4 bg-white border-b border-gray-100 z-20">
        <div className="flex items-center gap-1.5 md:gap-2 text-blue-800 font-bold text-xl md:text-2xl tracking-tight cursor-pointer" onClick={() => onNavigate('home')}>
          <FileText className="text-blue-500 w-6 h-6 md:w-7 md:h-7" /> 
          <span>ResumeMaker</span>
        </div>
        
        <div className="flex items-center gap-3 md:gap-4">
          {userEmail ? (
            <div className="flex items-center gap-3 md:gap-6">
              <div className="hidden md:flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center border border-blue-200">
                  <User size={16} className="text-blue-600" />
                </div>
                <span className="text-sm font-bold text-gray-700 truncate max-w-[120px]">{userEmail}</span>
              </div>
              <button onClick={onLogout} className="bg-blue-600 text-white px-4 md:px-6 py-1.5 md:py-2 rounded-full font-bold hover:bg-blue-700 transition-colors flex items-center gap-2 text-xs md:text-sm shadow-md">
                <LogOut size={14} className="md:w-4 md:h-4" /> <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 md:gap-4">
              <button onClick={() => onNavigate('signup')} className="font-bold text-gray-700 hover:text-blue-600 transition-colors text-sm md:text-base px-2">Sign Up</button>
              <button onClick={() => onNavigate('login')} className="bg-blue-600 text-white px-4 md:px-6 py-1.5 md:py-2 rounded-full font-bold hover:bg-blue-700 transition-colors shadow-md text-sm md:text-base">Sign In</button>
            </div>
          )}
        </div>
      </header>
      
      {/* MAIN CONTENT: Side-by-side perfectly triggers at md: for desktop site views */}
      <main className="flex-1 flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto w-full px-5 md:px-8 py-6 md:py-0 min-h-0">
        
        {/* LEFT TEXT SECTION */}
        <div className="flex-none md:flex-1 w-full md:w-1/2 flex flex-col justify-center text-center md:text-left mb-4 md:mb-0">
          <h2 className="text-blue-700 font-bold text-xs sm:text-sm md:text-xl tracking-wide uppercase mb-2 md:mb-4">Fast. Easy. Effective.</h2>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-2 md:mb-6">
            ResumeMaker.<br className="hidden md:block"/> The Best CV Maker.
          </h1>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed max-w-md mx-auto md:mx-0">
            Create a professional resume in minutes. Stand out to recruiters and land your dream job with ease.
          </p>
          
          {/* DESKTOP BUTTON - Changes text based on userEmail */}
          <div className="hidden md:block mt-8">
            <button 
              onClick={handleAction} 
              className="bg-yellow-400 text-yellow-900 font-extrabold px-10 py-4 rounded-full hover:bg-yellow-500 shadow-lg text-lg transition-transform hover:scale-105 active:scale-95 text-center"
            >
              {userEmail ? "Continue Editing" : "Create new CV"}
            </button>
          </div>
        </div>
        
        {/* RIGHT IMAGES & MOBILE BUTTON SECTION */}
        <div className="flex-1 md:flex-1 w-full md:w-1/2 flex flex-col items-center justify-end md:justify-center min-h-0">
          
          {/* MOCKUP IMAGES CONTAINER */}
          <div className="flex-1 w-full flex items-center justify-center min-h-0">
            <div className="relative w-full max-h-full aspect-[1/1.1] max-w-[280px] sm:max-w-[340px] md:max-w-[450px]">
              <div className="absolute top-0 right-0 w-32 h-32 md:w-64 md:h-64 bg-pink-100 rounded-full -z-10 blur-2xl opacity-60 translate-x-8 -translate-y-5"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 md:w-72 md:h-72 bg-blue-100 rounded-full -z-10 blur-2xl opacity-60 -translate-x-8 translate-y-8"></div>
              <Mockup1Column />
              <Mockup2Column />
            </div>
          </div>

          {/* MOBILE BUTTON - Changes text based on userEmail */}
          <div className="flex-none md:hidden w-full max-w-[300px] mt-4 mb-2">
            <button 
              onClick={handleAction} 
              className="w-full bg-yellow-400 text-yellow-900 font-extrabold px-8 py-3.5 rounded-full hover:bg-yellow-500 shadow-lg text-base transition-transform active:scale-95 text-center"
            >
              {userEmail ? "Continue Editing" : "Create new CV"}
            </button>
          </div>

        </div>
        
      </main>
    </div>
  );
}

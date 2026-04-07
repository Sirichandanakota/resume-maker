import React from 'react';
import { FileText, LogOut, User, ArrowLeft } from 'lucide-react';

export default function TemplatesPage({ onSelect, userEmail, userName, onLogout, onBack }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #cbd5e1 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-300 rounded-full -z-10 blur-[120px] opacity-30 pointer-events-none"></div>
      
      <header className="bg-white/80 backdrop-blur-md text-slate-800 p-4 sm:p-6 shadow-sm border-b border-gray-200 flex items-center justify-between z-20">
        <div 
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" 
          onClick={onBack}
        >
          <ArrowLeft size={20} className="text-blue-600" />
          <FileText size={24} className="text-blue-600" />
          <h1 className="text-xl sm:text-2xl font-bold text-blue-900 tracking-tight">ResumeMaker</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 mr-2">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center border border-blue-200">
              <User size={16} className="text-blue-600" />
            </div>
            <span className="text-sm font-medium text-slate-700 truncate max-w-[150px]">{userEmail || 'Guest'}</span>
          </div>
          
          {/* Back to Home Button */}
          <button 
            onClick={onBack}
            className="text-slate-600 hover:text-blue-600 font-bold text-sm transition-colors px-3"
          >
            Home
          </button>

          <button 
            onClick={onLogout} 
            className="bg-blue-600 text-white px-5 py-2 rounded-full font-bold hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm shadow-md"
          >
            <LogOut size={16} /> <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>
      
      <main className="flex-grow flex flex-col items-center p-4 sm:p-8 z-10 relative">
        <div className="w-full max-w-4xl mt-6 mb-4 flex justify-center md:justify-start">
          {userName && <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Hey, {userName}</h2>}
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-900 mb-4 text-center">Choose a Template</h2>
        <p className="text-slate-600 mb-8 sm:mb-12 text-center max-w-2xl text-base sm:text-lg">Select a resume layout that best fits your experience and style.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          {/* 2-Column Card */}
          <div 
            onClick={() => onSelect('2-column')} 
            className="bg-white rounded-2xl shadow-lg border-4 border-blue-300 overflow-hidden cursor-pointer hover:shadow-[0_0_35px_rgba(37,99,235,0.5)] hover:-translate-y-1 transition-all duration-300 group"
          >
            <div className="h-56 bg-slate-100 flex items-center justify-center p-6 border-b border-slate-100">
               {/* Mockup SVG/Div here */}
               <div className="w-full h-full bg-white shadow-sm flex border border-gray-300 rounded-sm overflow-hidden">
                 <div className="w-1/3 border-r border-gray-200 bg-slate-800 p-3">
                    <div className="w-8 h-8 rounded-full bg-slate-400 mb-2 mx-auto"></div>
                    <div className="w-full h-2 bg-slate-200 rounded"></div>
                 </div>
                 <div className="w-2/3 p-3 space-y-4">
                    <div className="w-1/2 h-3 bg-slate-600 rounded"></div>
                    <div className="w-full h-1.5 bg-slate-200 rounded"></div>
                 </div>
               </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">Professional 2-Column</h3>
              <p className="text-slate-600 text-sm">Clean, modern layout perfect for highlighting skills.</p>
            </div>
          </div>
          
          {/* 1-Column Card */}
          <div 
            onClick={() => onSelect('1-column')} 
            className="bg-white rounded-2xl shadow-lg border-4 border-blue-300 overflow-hidden cursor-pointer hover:shadow-[0_0_35px_rgba(37,99,235,0.5)] hover:-translate-y-1 transition-all duration-300 group"
          >
            <div className="h-56 bg-slate-50 flex items-center justify-center p-6 border-b border-slate-100">
               <div className="w-full max-w-[240px] bg-white shadow-md border border-gray-200 rounded-sm overflow-hidden flex flex-col relative">
                 <div className="w-full bg-slate-800 h-14 relative flex justify-center shrink-0">
                    <div className="w-9 h-9 rounded-full bg-white absolute -bottom-4.5 shadow-sm border border-gray-100"></div>
                 </div>
                 <div className="flex-1 flex flex-col items-center justify-center px-4 pt-7 pb-4 w-full">
                    <div className="w-2/3 h-1.5 bg-slate-300 rounded-full mb-3"></div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full"></div>
                 </div>
               </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">Creative 1-Column</h3>
              <p className="text-slate-600 text-sm">Classic layout great for narrative-driven resumes.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

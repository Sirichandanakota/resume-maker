import React from 'react';
import { Award, CheckCircle, Download, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12 mt-auto relative z-20 w-full">
      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          
          {/* Section 1 */}
          <div className="flex flex-col items-center md:items-start">
            <div className="w-12 h-12 bg-white/10 border border-white/20 text-white rounded-xl flex items-center justify-center mb-4 shadow-sm">
              <Award size={24} />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Professional Templates</h3>
            <p className="text-sm leading-relaxed text-blue-100">
              Stand out with modern, customized layouts designed to highlight your strengths.
            </p>
          </div>
          
          {/* Section 2 */}
          <div className="flex flex-col items-center md:items-start">
            <div className="w-12 h-12 bg-white/10 border border-white/20 text-white rounded-xl flex items-center justify-center mb-4 shadow-sm">
              <CheckCircle size={24} />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Fast & Intuitive</h3>
            <p className="text-sm leading-relaxed text-blue-100">
              Build and customize your resume in minutes with our simple, real-time interactive editor.
            </p>
          </div>
          
          {/* Section 3 */}
          <div className="flex flex-col items-center md:items-start">
            <div className="w-12 h-12 bg-white/10 border border-white/20 text-white rounded-xl flex items-center justify-center mb-4 shadow-sm">
              <Download size={24} />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Instant PDF Export</h3>
            <p className="text-sm leading-relaxed text-blue-100">
              Download your perfectly formatted resume instantly in high-quality PDF format.
            </p>
          </div>
          
        </div>
        
        {/* Bottom Bar / Divider */}
        <div className="mt-12 pt-8 border-t border-blue-400/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-blue-100">
            © {currentYear} ResumeMaker. All rights reserved.
          </p>
          <p className="text-sm text-blue-100 flex items-center gap-1.5 font-medium">
            Made with <Heart size={16} className="text-red-400 fill-red-400" /> by Resume Maker Team
          </p>
        </div>
      </div>
    </footer>
  );
}

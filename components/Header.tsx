
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
            B
          </div>
          <span className="font-bold text-xl tracking-tight text-white">Backend <span className="text-indigo-400">Architect</span></span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-400">
          <button className="hover:text-white transition-colors flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            How it Works
          </button>
          <a href="https://docs.python.org/3/" target="_blank" className="hover:text-white transition-colors">Python Docs</a>
          <div className="h-4 w-px bg-slate-800"></div>
          <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded uppercase font-bold tracking-tighter">Live Engine</span>
        </nav>
      </div>
    </header>
  );
};

export default Header;

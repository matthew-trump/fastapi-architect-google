
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">
            F
          </div>
          <span className="font-bold text-xl tracking-tight">FastAPI <span className="text-blue-500">Architect</span></span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-400">
          <a href="#" className="hover:text-white transition-colors">Documentation</a>
          <a href="#" className="hover:text-white transition-colors">Examples</a>
          <div className="h-4 w-px bg-slate-800"></div>
          <span className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded">Beta v1.0</span>
        </nav>
      </div>
    </header>
  );
};

export default Header;

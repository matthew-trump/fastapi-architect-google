
import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import CodeBlock from './components/CodeBlock';
import { generateBackendCode } from './services/geminiService';
import { AppState, Framework } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    prompt: "Create a simple API with a GET /time route and a PostgreSQL database to log timestamps.",
    framework: 'FastAPI',
    isGenerating: false,
    result: null,
    error: null,
  });

  const handleGenerate = useCallback(async () => {
    if (!state.prompt.trim()) return;

    setState(prev => ({ ...prev, isGenerating: true, error: null }));
    try {
      const result = await generateBackendCode(state.prompt, state.framework);
      setState(prev => ({ ...prev, result, isGenerating: false }));
    } catch (err) {
      console.error(err);
      setState(prev => ({ 
        ...prev, 
        isGenerating: false, 
        error: "Failed to generate architecture. Please verify your specifications." 
      }));
    }
  }, [state.prompt, state.framework]);

  // Re-generate when framework changes (optional, but good for UX)
  useEffect(() => {
    handleGenerate();
  }, [state.framework]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-200">
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl sticky top-24">
            
            <div className="mb-6">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 block">1. Select Framework</label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 border border-slate-800 rounded-xl">
                {(['FastAPI', 'Django'] as Framework[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setState(prev => ({ ...prev, framework: f }))}
                    className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                      state.framework === f 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40' 
                      : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 block">2. Define Requirements</label>
              <h2 className="text-sm font-semibold mb-3 flex items-center gap-2 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Logic & Data Models
              </h2>
              <textarea
                className="w-full h-32 bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-300 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none placeholder:text-slate-700 font-sans"
                placeholder="What should the backend do?"
                value={state.prompt}
                onChange={(e) => setState(prev => ({ ...prev, prompt: e.target.value }))}
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={state.isGenerating}
              className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                state.isGenerating 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-900/40 active:scale-[0.98]'
              }`}
            >
              {state.isGenerating ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Architecting...
                </>
              ) : (
                'Build Backend Blueprint'
              )}
            </button>

            {state.error && (
              <div className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-xs text-red-400 animate-in slide-in-from-top-2">
                {state.error}
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-slate-800/50">
              <div className="flex items-center justify-between text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-4">
                <span>Production Standard</span>
              </div>
              <ul className="space-y-3">
                {[
                  { label: 'Containerized (Docker)', icon: '🐳' },
                  { label: 'Cloud-Ready CI/CD', icon: '🚀' },
                  { label: 'Secure Env Management', icon: '🔑' },
                  { label: 'PostgreSQL Persistence', icon: '🗄️' },
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="text-sm opacity-70">{feature.icon}</span>
                    {feature.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Results Area */}
        <div className="lg:col-span-8 space-y-8">
          {state.isGenerating && !state.result ? (
            <div className="space-y-6">
              <div className="h-12 w-64 bg-slate-900/50 rounded-lg animate-pulse"></div>
              <div className="h-[400px] bg-slate-900/50 animate-pulse rounded-2xl border border-slate-800"></div>
              <div className="h-32 bg-slate-900/50 animate-pulse rounded-2xl border border-slate-800"></div>
            </div>
          ) : state.result ? (
            <div className="animate-in fade-in duration-700 slide-in-from-bottom-4 pb-12">
              <div className="mb-8 p-6 bg-slate-900/50 border border-slate-800 rounded-2xl">
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded text-[10px] font-bold uppercase tracking-wider">
                    {state.framework}
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Docker Ready
                  </span>
                  <div className="h-4 w-px bg-slate-800"></div>
                  <h1 className="text-xl font-bold text-white tracking-tight">System Architecture Generated</h1>
                </div>

                {/* Pipeline visualizer */}
                <div className="grid grid-cols-4 gap-4 mb-2">
                  {[
                    { label: 'Design', status: 'done', icon: '🎨' },
                    { label: 'Code', status: 'done', icon: '📝' },
                    { label: 'Container', status: 'done', icon: '🐳' },
                    { label: 'Deploy', status: 'pending', icon: '🚀' }
                  ].map((step, i) => (
                    <div key={i} className="text-center">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 text-lg border transition-all ${
                        step.status === 'done' ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400' : 'bg-slate-950 border-slate-800 text-slate-700'
                      }`}>
                        {step.icon}
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-tighter ${
                        step.status === 'done' ? 'text-indigo-400' : 'text-slate-600'
                      }`}>{step.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-12">
                {/* Project Files */}
                <div className="space-y-6">
                  <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                    File Manifest
                  </h2>
                  <div className="space-y-8">
                    {state.result.files.map((file, idx) => (
                      <CodeBlock key={idx} code={file.content} filename={file.path} />
                    ))}
                  </div>
                </div>

                {/* Insight Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
                    <h3 className="text-xs font-bold text-slate-500 uppercase mb-4 tracking-wider flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Architectural Intent
                    </h3>
                    <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-light italic">
                      {state.result.explanation}
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
                    <h3 className="text-xs font-bold text-slate-500 uppercase mb-4 tracking-wider flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      Project Dependencies
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {state.result.dependencies.map((dep, idx) => (
                        <span key={idx} className="bg-slate-950 text-indigo-300 border border-slate-800 px-3 py-1 rounded-md text-[10px] font-mono">
                          {dep}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Setup & Deployment */}
                <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-32 h-32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase mb-8 tracking-widest flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Execution Sequence
                  </h3>
                  <div className="space-y-6 relative">
                    {state.result.setupSteps.map((step, idx) => (
                      <div key={idx} className="flex gap-6 group">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-900 border border-indigo-500/30 flex items-center justify-center text-xs text-indigo-400 font-bold group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-500 transition-all duration-300">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <code className="block bg-black/50 backdrop-blur px-5 py-3 rounded-xl text-indigo-300 font-mono text-xs overflow-x-auto border border-slate-800 group-hover:border-slate-700 transition-colors">
                            {step}
                          </code>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center py-12">
              <div className="max-w-2xl w-full text-center space-y-12">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-indigo-600/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-indigo-500/20">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.183.393l-1.023.682a2 2 0 00-.768 2.304l.418 1.254a2 2 0 001.622 1.41l2.454.409a2 2 0 001.083-.188l1.302-.651a2 2 0 011.789 0l1.302.651a2 2 0 001.083.188l2.454-.409a2 2 0 001.622-1.41l.418-1.254a2 2 0 00-.768-2.304l-1.023-.682zM12 11V3m0 0L9 6m3-3l3 3" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-white tracking-tight">How to "do" a Backend</h2>
                  <p className="text-slate-400">A backend is a program that runs on your server. Secure environment management is handled automatically.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                  {[
                    { title: "Define Requirements", desc: "Select FastAPI or Django and describe your logic. We'll automatically handle secure .env generation.", icon: "🎯" },
                    { title: "Generate Blueprint", desc: "Build a modular structure with integrated Docker, PostgreSQL, and secure configuration files.", icon: "⚡" },
                    { title: "Save Locally", desc: "Copy files to your machine and create your .env file from the provided .env.example template.", icon: "💾" },
                    { title: "Secure Launch", desc: "Run Docker commands. Your app will securely connect to the database using the variables you defined.", icon: "🌐" }
                  ].map((step, i) => (
                    <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-indigo-500/50 transition-colors group">
                      <div className="text-2xl mb-4 group-hover:scale-110 transition-transform inline-block">{step.icon}</div>
                      <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                        <span className="text-indigo-400 text-xs font-mono">{i + 1}.</span> {step.title}
                      </h3>
                      <p className="text-slate-500 text-xs leading-relaxed">{step.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-8 animate-bounce">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-slate-700 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="py-8 border-t border-slate-900 text-center text-slate-500 text-[10px] mt-auto uppercase tracking-widest font-medium bg-slate-950">
        Backend Architect &bull; Design for Production &bull; Secure Env Management
      </footer>
    </div>
  );
};

export default App;

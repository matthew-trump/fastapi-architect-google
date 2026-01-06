
import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import CodeBlock from './components/CodeBlock';
import { generateFastAPICode } from './services/geminiService';
import { AppState } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    prompt: "Create a FastAPI app with SQLAlchemy and Alembic. Include a User model with 'id', 'email', and 'hashed_password', and an endpoint to list users. Also add a GET /time route.",
    isGenerating: false,
    result: null,
    error: null,
  });

  const handleGenerate = useCallback(async () => {
    if (!state.prompt.trim()) return;

    setState(prev => ({ ...prev, isGenerating: true, error: null }));
    try {
      const result = await generateFastAPICode(state.prompt);
      setState(prev => ({ ...prev, result, isGenerating: false }));
    } catch (err) {
      console.error(err);
      setState(prev => ({ 
        ...prev, 
        isGenerating: false, 
        error: "Failed to generate architecture. Please verify your specifications and API connection." 
      }));
    }
  }, [state.prompt]);

  // Initial generation on load
  useEffect(() => {
    handleGenerate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl sticky top-24">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Architectural Specs
            </h2>
            <textarea
              className="w-full h-40 bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-300 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
              placeholder="e.g., Build a user management system with SQLite, Alembic migrations, and CI/CD..."
              value={state.prompt}
              onChange={(e) => setState(prev => ({ ...prev, prompt: e.target.value }))}
            />
            <button
              onClick={handleGenerate}
              disabled={state.isGenerating}
              className={`w-full mt-4 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                state.isGenerating 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/20 active:scale-95'
              }`}
            >
              {state.isGenerating ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Synthesizing...
                </>
              ) : (
                'Generate Architecture'
              )}
            </button>

            {state.error && (
              <div className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-xs text-red-400">
                {state.error}
              </div>
            )}

            <div className="mt-8">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Enterprise Stack</h3>
              <div className="space-y-3 text-xs text-slate-400">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                  <span>SQLAlchemy 2.0 ORM</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                  <span>Alembic Migrations</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]"></div>
                  <span>GitHub Actions CI/CD</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]"></div>
                  <span>Pytest & Linting Suite</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Area */}
        <div className="lg:col-span-8 space-y-8">
          {state.isGenerating && !state.result ? (
            <div className="space-y-6">
              <div className="h-12 w-48 bg-slate-900/50 rounded-lg animate-pulse"></div>
              <div className="h-64 bg-slate-900/50 animate-pulse rounded-2xl border border-slate-800"></div>
              <div className="h-64 bg-slate-900/50 animate-pulse rounded-2xl border border-slate-800"></div>
              <div className="h-32 bg-slate-900/50 animate-pulse rounded-2xl border border-slate-800"></div>
            </div>
          ) : state.result ? (
            <div className="animate-in fade-in duration-700 slide-in-from-bottom-4 pb-12">
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">Project Architecture</h1>
                <p className="text-slate-400 text-sm">Review the modular project structure, database models, and delivery pipelines.</p>
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
                  <div className="space-y-6">
                    {state.result.files.map((file, idx) => (
                      <CodeBlock key={idx} code={file.content} filename={file.path} />
                    ))}
                  </div>
                </div>

                {/* Insight Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-lg shadow-black/20">
                    <h3 className="text-xs font-bold text-slate-500 uppercase mb-4 tracking-wider flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Architectural Intent
                    </h3>
                    <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-light">
                      {state.result.explanation}
                    </div>
                  </div>

                  <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 shadow-lg shadow-black/20">
                    <h3 className="text-xs font-bold text-slate-500 uppercase mb-4 tracking-wider flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      Environment dependencies
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {state.result.dependencies.map((dep, idx) => (
                        <span key={idx} className="bg-slate-800 text-slate-300 border border-slate-700 px-3 py-1 rounded-md text-[10px] font-mono hover:bg-slate-700 transition-colors cursor-default">
                          {dep}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Setup & Deployment */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-32 h-32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                  
                  <h3 className="text-xs font-bold text-slate-500 uppercase mb-8 tracking-widest flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Initial Deployment & Migrations
                  </h3>
                  <div className="space-y-6">
                    {state.result.setupSteps.map((step, idx) => (
                      <div key={idx} className="flex gap-6 group">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs text-slate-400 font-bold group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 border border-slate-700 group-hover:border-blue-500">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <code className="block bg-slate-950 px-5 py-3 rounded-xl text-blue-300 font-mono text-xs overflow-x-auto border border-slate-800 group-hover:border-slate-700 transition-colors">
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
            <div className="flex flex-col items-center justify-center h-full text-center p-12 opacity-50 space-y-4">
              <div className="w-24 h-24 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
              </div>
              <h2 className="text-xl font-medium text-slate-400 tracking-tight">Design System Offline</h2>
              <p className="text-slate-500 max-w-sm text-sm">Input your application requirements to generate a complete, database-backed architectural blueprint.</p>
            </div>
          )}
        </div>
      </main>

      <footer className="py-8 border-t border-slate-800/50 text-center text-slate-500 text-[10px] mt-auto uppercase tracking-widest font-medium">
        FastAPI Architect &bull; Design by Gemini &bull; Engineering by AI
      </footer>
    </div>
  );
};

export default App;

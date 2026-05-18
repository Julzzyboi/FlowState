import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0b0f14] text-white px-4 relative overflow-hidden font-sans">
      
      {/* Decorative Blur Backdrops */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[50%] bg-[#46a4fe]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-2xl text-center z-10 flex flex-col items-center gap-6 px-4">
        
        {/* Micro Tech Badge */}
        <div className="inline-flex items-center gap-2 bg-[#46a4fe]/10 border border-[#46a4fe]/20 px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-widest text-[#46a4fe]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#46a4fe] animate-pulse" /> Platform V2.0 Operational
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none text-white max-w-xl">
          Enter the Ultimate <span className="text-transparent bg-clip-text bg-linear-to-r"><span className= "text-blue-400">Flow</span><span className="italic text-green-300">State</span></span> Experience.
        </h1>

        {/* Supporting Hook Text */}
        <p className="text-slate-400 text-sm sm:text-base font-medium max-w-lg leading-relaxed">
          The centralized environment to manage tracking metrics, build high-fidelity community spaces, and sync real-time communications instantly.
        </p>

        {/* Main Interface Interactivity Action Call Trigger */}
        <div className="mt-4 flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="w-full sm:w-auto bg-[#46a4fe] hover:bg-[#3491eb] text-white font-extrabold px-8 h-14 rounded-2xl text-xs uppercase tracking-widest shadow-lg shadow-[#46a4fe]/10 hover:shadow-[#46a4fe]/20 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            Launch Core Console <span className="text-sm">→</span>
          </button>
        </div>

        {/* Footer Subtext */}
        <p className="text-[11px] text-slate-600 font-medium mt-12 border-t border-white/3 pt-6 w-full max-w-sm">
          Built for distributed creators. Zero administrative setup files required to initiate workflow.
        </p>

      </div>
    </div>
  );
}
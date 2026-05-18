import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();
  
  // Interactive Water Tracker Preview States
  const [waterIntake, setWaterIntake] = useState(0);
  const dailyGoal = 2000;
  const [reminderInterval, setReminderInterval] = useState(60);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(reminderInterval * 60);

  // Timer Simulation Logic for Preview
  useEffect(() => {
    let timer;
    if (isTimerActive && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && isTimerActive) {
      setTimeLeft(reminderInterval * 60);
    }
    return () => clearInterval(timer);
  }, [isTimerActive, timeLeft, reminderInterval]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased selection:bg-blue-500 selection:text-white">
      
      {/* 🧭 NAVIGATION BAR */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/60 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🌊</span>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              FlowState
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition hidden sm:inline-block">Features</a>
            <a href="#developers" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition hidden sm:inline-block">Team</a>
            <button 
              onClick={() => navigate('/auth')}
              className="text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full transition shadow-xs active:scale-95 cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* 🚀 HERO SECTION WITH LIVE PREVIEW */}
      <header className="max-w-7xl mx-auto px-6 pt-12 pb-20 grid lg:grid-cols-12 gap-12 items-center">
        
        {/* Value Proposition */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            ⚡ Optimize Your Workflow
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            Stay Hydrated. <br className="hidden sm:inline" />
            Stay in the <span className="text-blue-600 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Zone.</span>
          </h1>
          <p className="text-slate-500 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
            FlowState bridges health and productivity. Track your daily hydration dynamically, configure browser notifications, and analyze your lifestyle metrics through deep dashboard analytics.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
            <button 
              onClick={() => navigate('/auth')}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold py-3.5 px-8 rounded-full shadow-lg shadow-blue-500/20 active:scale-95 transition text-sm tracking-wide uppercase cursor-pointer"
            >
              Get Started Instantly
            </button>
            <a 
              href="#features"
              className="w-full sm:w-auto border border-slate-300 hover:border-slate-400 bg-white font-bold py-3.5 px-8 rounded-full active:scale-95 transition text-sm tracking-wide text-slate-600 text-center"
            >
              Explore Features
            </a>
          </div>
        </div>

        {/* Live Interactive Widget Demo */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl border border-slate-200/60 p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">Interactive Preview</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            </div>
            
            <div className="bg-gradient-to-b from-blue-50/50 to-transparent rounded-2xl p-4 text-center border border-blue-100/50">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Daily Progress</h3>
              <div className="text-3xl font-black text-blue-600 my-1">
                {waterIntake} <span className="text-sm font-normal text-slate-400">/ {dailyGoal} ml</span>
              </div>
              <div className="w-full bg-blue-100 h-2.5 rounded-full overflow-hidden mt-2 p-0.5">
                <div 
                  className="bg-blue-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((waterIntake / dailyGoal) * 100, 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button 
                onClick={() => setWaterIntake(prev => prev + 250)}
                className="bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-600 py-2.5 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center cursor-pointer"
              >
                <span>+250ml</span>
                <span className="text-[10px] text-slate-400 font-normal">Glass</span>
              </button>
              <button 
                onClick={() => setWaterIntake(prev => setWaterIntake(0))}
                className="bg-slate-100 hover:bg-slate-200 text-slate-500 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center cursor-pointer"
              >
                Reset
              </button>
            </div>

            <div className="bg-slate-900 text-white rounded-xl p-3.5 flex items-center justify-between">
              <div>
                <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-bold">Reminder Interval</span>
                <span className="text-xl font-mono font-bold text-blue-400">{formatTime(timeLeft)}</span>
              </div>
              <button
                onClick={() => setIsTimerActive(!isTimerActive)}
                className={`px-4 py-1.5 rounded-lg font-bold text-xs uppercase tracking-wide transition text-slate-950 ${
                  isTimerActive ? 'bg-amber-400 hover:bg-amber-300' : 'bg-emerald-400 hover:bg-emerald-300'
                }`}
              >
                {isTimerActive ? 'Pause' : 'Test'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 🛠️ CORE FEATURES SECTION */}
      <section id="features" className="bg-white border-y border-slate-200/60 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest">Built For High Performers</h2>
            <p className="text-3xl font-black text-slate-900 tracking-tight sm:text-4xl">Everything you need to sustain concentration</p>
            <p className="text-slate-500 text-sm sm:text-base">A complete feature set customized for creators, developers, and knowledge specialists operating behind digital interfaces.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-lg shadow-xs">🔔</div>
              <h3 className="text-lg font-bold text-slate-900">Custom System Alerts</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Integrated operating-system native web notifications loop gently based on your customized preference metrics to safely keep you away from severe dehydration states.</p>
            </div>
            {/* Feature 2 */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
              <div className="w-10 h-10 bg-cyan-100 text-cyan-600 rounded-xl flex items-center justify-center text-lg shadow-xs">📊</div>
              <h3 className="text-lg font-bold text-slate-900">Historical Tracking</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Log entries tie perfectly to unified Firebase document systems, automatically archiving intake quantities to safely review progression behaviors over structured time-steps.</p>
            </div>
            {/* Feature 3 */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
              <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center text-lg shadow-xs">👥</div>
              <h3 className="text-lg font-bold text-slate-900">Community Spaces</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Engage smoothly with structured communication hubs. Join distinct chat portal modules and securely broadcast metrics with complementary teammates across open grids.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 👥 THE DEVELOPERS SECTION */}
      <section id="developers" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold text-blue-600 uppercase tracking-widest">The Creators</h2>
            <p className="text-3xl font-black text-slate-900 tracking-tight sm:text-4xl">Meet the Engineering Team</p>
            <p className="text-slate-500 text-sm sm:text-base">Designing custom technical structures that foster systemic lifestyle stability across fast-paced environments.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            {/* Developer Card 1 */}
            <div className="w-full max-w-[280px] bg-white border border-slate-200/80 rounded-2xl p-6 text-center shadow-xs hover:shadow-md transition duration-200 group">
              <div className="w-24 h-24 mx-auto rounded-full bg-slate-100 border-2 border-slate-200/60 overflow-hidden mb-4 relative flex items-center justify-center">
                {/* Fallback Initial Icon if Profile Image isn't specified */}
                <span className="text-3xl group-hover:scale-110 transition duration-200">👨‍💻</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">Kobe Jacob Marinduque</h3>
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-3">Lead Full-Stack Systems Architect</p>
              <p className="text-slate-500 text-xs leading-relaxed mb-4">
                Managing Firebase routing integration frameworks, architecture trees, and end-to-end security parameters.
              </p>
              <div className="flex justify-center gap-3 text-slate-400">
                <span className="text-xs font-mono bg-slate-50 px-2 py-1 border border-slate-100 rounded-md">University of Santo Tomas</span>
              </div>
            </div>

            {/* Developer Card 2 (Placeholder: Duplicate or update details as your team grows) */}
            <div className="w-full max-w-[280px] bg-white border border-slate-200/80 rounded-2xl p-6 text-center shadow-xs hover:shadow-md transition duration-200 group">
              <div className="w-24 h-24 mx-auto rounded-full bg-slate-100 border-2 border-slate-200/60 overflow-hidden mb-4 relative flex items-center justify-center">
                <span className="text-3xl group-hover:scale-110 transition duration-200">🚀</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">Join the Framework</h3>
              <p className="text-xs font-semibold text-cyan-600 uppercase tracking-wider mb-3">Open Source Contributor</p>
              <p className="text-slate-500 text-xs leading-relaxed mb-4">
                Want to expand functionality layers, analytics routines, or component styles inside FlowState?
              </p>
              <div className="flex justify-center">
                <a href="https://github.com" target="_blank" rel="noreferrer" className="text-xs font-bold text-slate-600 hover:text-blue-600 transition">View Repository →</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 📋 MINIMALIST FOOTER */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span>🌊</span>
            <span className="font-bold text-white tracking-tight">FlowState App</span>
          </div>
          <p>© 2026 FlowState Engineering Ecosystem. All Rights Reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-white cursor-pointer transition">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition">Terms</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
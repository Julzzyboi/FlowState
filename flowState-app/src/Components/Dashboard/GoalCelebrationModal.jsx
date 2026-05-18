import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faTrophy } from '@fortawesome/free-solid-svg-icons';
import confetti from 'canvas-confetti'; // Imported canvas-confetti for the victory effect

export default function GoalCelebrationModal({ isOpen, onClose, dailyGoal }) {
  
  // Fire a satisfying multi-angle confetti blast when the modal mounts open
  useEffect(() => {
    if (isOpen) {
      const duration = 2 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 25, spread: 360, ticks: 50, zIndex: 60 };

      const randomInRange = (min, max) => Math.random() * (max - min) + min;

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 40 * (timeLeft / duration);
        
        // Left side screen cannon
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        
        // Right side screen cannon
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-all duration-300">
      <div 
        className="w-full max-w-md bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(15,23,42,0.08)] p-8 relative border border-slate-100 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-300"
        style={{ fontFamily: "'Comfortaa', sans-serif" }}
      >
        {/* CLOSE BUTTON */}
        <button 
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
        >
          <FontAwesomeIcon icon={faTimes} className="text-xs" />
        </button>

        {/* ENLARGED CELEBRATION TROPHY EMBLEM CONTAINER */}
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-4xl bg-amber-50 border border-amber-100/50 flex items-center justify-center mb-6 mt-2 shadow-sm shadow-amber-500/5 animate-bounce duration-2000">
          <FontAwesomeIcon 
            icon={faTrophy} 
            className="text-3xl sm:text-4xl text-amber-500" 
          />
        </div>

        {/* CELEBRATION TYPOGRAPHY HEADER */}
        <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight mb-3">
          Congratulations!
        </h2>

        {/* STATUS CONTEXT TEXT DESCRIPTION */}
        <p className="text-xs sm:text-sm font-medium text-slate-500 leading-relaxed max-w-70 sm:max-w-xs mb-8">
          You've reached your dynamic daily goal of{' '}
          <span className="text-blue-500 font-bold">{dailyGoal} mL</span>{' '}
          today. Keep up the amazing work!
        </p>

        {/* CLOSING CONFIRMATION ACTION BUTTON */}
        <button
          type="button"
          onClick={onClose}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs sm:text-sm py-4 rounded-2xl shadow-md shadow-blue-500/10 active:scale-[0.98] transition-all cursor-pointer"
        >
          Awesome!
        </button>
      </div>
    </div>
  );
}
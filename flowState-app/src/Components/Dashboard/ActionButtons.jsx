import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons';

export default function ActionButtons({ onDrink, isDrinking, currentAmount, iconDefinition }) {
  return (
    <div className="flex items-center gap-3 w-full">
      {/* Primary Logging Target trigger action */}
      <button
        onClick={onDrink}
        disabled={isDrinking}
        className={`flex-1 h-14 rounded-2xl font-bold tracking-wide transition-all duration-300 shadow-sm flex items-center justify-center border text-sm ${
          isDrinking
            ? 'bg-white border-blue-400 text-blue-500 shadow-inner'
            : 'bg-blue-500 hover:bg-blue-600 active:scale-[0.98] text-white border-transparent shadow-blue-500/10'
        }`}
      >
        {isDrinking ? (
          <span className="flex items-center gap-2 tracking-widest animate-pulse font-semibold">
            Drinking...
          </span>
        ) : (
          `Drink (${currentAmount} mL)`
        )}
      </button>

      {/* Modern Vessel Selection Switch button containing crisp Font Awesome structures */}
      <button className="w-14 h-14 bg-white hover:bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-500 shadow-sm transition active:scale-95 relative group">
        <FontAwesomeIcon icon={iconDefinition} className="text-lg transition-transform duration-200 group-hover:scale-105" />
        <span className="absolute bottom-1 right-1 text-[7px] text-slate-300 group-hover:text-blue-500 transition-colors">
          <FontAwesomeIcon icon={faSyncAlt} />
        </span>
      </button>
    </div>
  );
}
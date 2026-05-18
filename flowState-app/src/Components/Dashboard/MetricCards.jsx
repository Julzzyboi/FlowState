import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlassWater, faAward, faFire } from '@fortawesome/free-solid-svg-icons';

export default function MetricCards({ totalServings, mostDrankType, percentage }) {
  return (
    <div className="grid grid-cols-3 gap-4 w-full">
      {/* Card 1: Servings */}
      <div className="bg-white p-4 rounded-[1.5rem] border border-slate-100/80 shadow-[0_4px_25px_rgba(15,23,42,0.015)] flex flex-col items-center justify-between text-center min-h-[100px]">
        <div className="w-8 h-8 rounded-xl bg-blue-50/80 flex items-center justify-center text-blue-500">
          <FontAwesomeIcon icon={faGlassWater} className="text-sm" />
        </div>
        <div className="flex flex-col items-center justify-center mt-1">
          <span className="text-[10px] font-bold text-slate-400 tracking-tight block">Drinks</span>
          <span className="text-base font-black text-slate-800 mt-0.5 leading-none">{totalServings}</span>
        </div>
      </div>

      {/* Card 2: Preference */}
      <div className="bg-white p-4 rounded-[1.5rem] border border-slate-100/80 shadow-[0_4px_25px_rgba(15,23,42,0.015)] flex flex-col items-center justify-between text-center min-h-[100px]">
        <div className="w-8 h-8 rounded-xl bg-emerald-50/80 flex items-center justify-center text-emerald-500">
          <FontAwesomeIcon icon={faAward} className="text-sm" />
        </div>
        <div className="flex flex-col items-center justify-center mt-1 w-full">
          <span className="text-[10px] font-bold text-slate-400 tracking-tight block">Favorite</span>
          <span className="text-xs font-black text-slate-800 mt-1 truncate w-full px-0.5 leading-none">{mostDrankType}</span>
        </div>
      </div>

      {/* Card 3: Completion */}
      <div className="bg-white p-4 rounded-[1.5rem] border border-slate-100/80 shadow-[0_4px_25px_rgba(15,23,42,0.015)] flex flex-col items-center justify-between text-center min-h-[100px]">
        <div className="w-8 h-8 rounded-xl bg-amber-50/80 flex items-center justify-center text-amber-500">
          <FontAwesomeIcon icon={faFire} className="text-sm" />
        </div>
        <div className="flex flex-col items-center justify-center mt-1">
          <span className="text-[10px] font-bold text-slate-400 tracking-tight block">Progress</span>
          <span className="text-base font-black text-slate-800 mt-0.5 leading-none">{Math.round(percentage)}%</span>
        </div>
      </div>
    </div>
  );
}
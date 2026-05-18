import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlassWater } from '@fortawesome/free-solid-svg-icons';

export default function CompleteIntakeArchiveCard({ logs, hasHydrationData }) {
  return (
    <div className="w-full bg-white rounded-4xl shadow-[0_10px_35px_rgba(0,132,255,0.015)] p-6 sm:p-8 border border-slate-100/50">
      <div className="flex items-center justify-between mb-5 border-b border-slate-50 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 text-xs shadow-sm">
            <FontAwesomeIcon icon={faGlassWater} />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-800 tracking-tight">Complete Intake Records</h2>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Historical breakdown of your logged beverages</p>
          </div>
        </div>
        <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-3 py-1 rounded-full uppercase tracking-wider">
          Total items: {logs.length}
        </span>
      </div>

      {!hasHydrationData ? (
        <div className="w-full py-12 flex flex-col items-center justify-center text-center border border-dashed border-slate-100 rounded-2xl bg-slate-50/30">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Archive Empty</span>
          <p className="text-[9px] font-medium text-slate-400 mt-1">Log drinks on the dashboard to populate full metrics.</p>
        </div>
      ) : (
        <div className="w-full max-h-80 overflow-y-auto clean-history-box pr-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {logs.map((log) => (
            <div 
              key={log.id} 
              className="bg-slate-50/50 border border-slate-100/70 p-4 rounded-2xl flex items-center justify-between transition-all duration-200 hover:bg-slate-50 hover:scale-[1.01]"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm shrink-0"
                  style={{ backgroundColor: log.bgLight || '#eff6ff', color: log.color || '#3b82f6' }}
                >
                  {log.icon ? (
                    <FontAwesomeIcon icon={log.icon} className="text-base" />
                  ) : (
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: log.color }} />
                  )}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-black text-slate-700 leading-tight truncate">{log.type}</h4>
                  <span className="text-[9px] font-bold text-slate-400 mt-1 block">{log.time}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-black text-slate-600 bg-white border border-slate-100 px-2.5 py-1 rounded-xl shadow-2xs">
                  {log.amount} mL
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
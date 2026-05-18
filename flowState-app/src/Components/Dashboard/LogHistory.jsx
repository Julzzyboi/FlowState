import React from 'react';
// 1. IMPORT: Bring in the router navigation hook
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';

export default function LogHistory({ logs }) {
  // 2. INITIALIZE: Call the navigate tool inside your component function
  const navigate = useNavigate();

  if (!logs || logs.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-dashed border-slate-200 flex items-center justify-center text-slate-300 mb-3">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">No history recorded today</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col h-full">
      {/* HEADER ROW */}
      <div className="flex justify-between items-center mb-4 sticky top-0 bg-white pb-2 z-10">
        <h3 className="text-xs font-black text-slate-800 tracking-tight">History</h3>
        
        {/* 3. ATTACH THE EVENT: Changed to redirect directly to the full analytics view */}
        <button 
          onClick={() => navigate('/history')}
          className="text-[10px] font-black text-blue-500 hover:text-blue-600 transition-all cursor-pointer"
        >
          View All &rarr;
        </button>
      </div>

      {/* SINGLE VERTICAL SCROLL VIEWPORT: Utilizes the clean custom CSS scroll rules seamlessly */}
      <div className="w-full flex-1 overflow-y-auto clean-history-box pr-1 space-y-3">
        {logs.map((log) => (
          <div 
            key={log.id} 
            className="w-full bg-slate-50/50 border border-slate-100/70 p-3 rounded-2xl flex items-center justify-between transition-all duration-200 hover:bg-slate-50"
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm"
                style={{ backgroundColor: log.bgLight || '#eff6ff', color: log.color || '#3b82f6' }}
              >
                {log.icon ? (
                  <FontAwesomeIcon icon={log.icon} className="text-sm" />
                ) : (
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: log.color }} />
                )}
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-700 leading-tight">{log.type}</h4>
                <span className="text-[9px] font-bold text-slate-400 mt-0.5 block">{log.time}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="text-xs font-black text-slate-600">{log.amount} mL</span>
              <button className="text-slate-300 hover:text-slate-500 p-1 cursor-pointer transition-colors text-xs">
                <FontAwesomeIcon icon={faEllipsisV} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
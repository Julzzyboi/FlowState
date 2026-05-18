import React, { useEffect, useRef } from 'react';

export default function WeeklyTracker({ currentDayPercentage, historyLogs }) {
  const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const activeDayRef = useRef(null);

  const getPhilippinesDayIndex = () => {
    try {
      const dayNameShort = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Manila', weekday: 'short' }).format(new Date());
      return DAYS_SHORT.indexOf(dayNameShort);
    } catch (e) {
      return new Date().getDay();
    }
  };

  const currentPhDayIndex = getPhilippinesDayIndex();

  const scrollToToday = () => {
    if (activeDayRef.current) {
      activeDayRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  };

  useEffect(() => {
    const timer = setTimeout(scrollToToday, 500);
    return () => clearTimeout(timer);
  }, [currentPhDayIndex]);

  return (
    <div className="w-full bg-white rounded-[2rem] shadow-[0_10px_35px_rgba(0,132,255,0.015)] p-6 border border-slate-100/50 flex flex-col gap-5">
      <div className="flex justify-between items-center w-full">
        <div>
          <h3 className="text-xs font-black text-slate-800 tracking-tight">Weekly Activity</h3>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Real-time PH Tracker</p>
        </div>
        <button 
          onClick={scrollToToday}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100/70 text-blue-600 transition-all rounded-xl text-[10px] font-black tracking-tight border border-blue-100/30 cursor-pointer"
        >
          Today
        </button>
      </div>

      <div className="w-full flex items-end justify-between overflow-x-auto gap-2 py-1 scrollbar-none snap-x">
        {DAYS_SHORT.map((dayName, idx) => {
          const isToday = idx === currentPhDayIndex;
          const isFutureDay = idx > currentPhDayIndex;
          
          // Determine the display height cleanly based on chronology
          let barHeight = 0;
          if (isToday) {
            barHeight = Math.round(currentDayPercentage);
          } else if (isFutureDay) {
            // Keep future slots perfectly clear since they haven't happened yet
            barHeight = 0;
          } else {
            // Mock static historical values for past days only if logs exist
            barHeight = historyLogs.length > 0 ? (idx % 2 === 0 ? 60 : 35) : 0;
          }

          return (
            <div 
              key={dayName}
              ref={isToday ? activeDayRef : null}
              className={`flex flex-col items-center gap-2.5 flex-1 min-w-[44px] py-2 rounded-2xl transition-all duration-300 snap-center ${
                isToday ? 'bg-blue-50/60 border border-blue-200/50 shadow-sm' : 'border border-transparent'
              }`}
            >
              <div className="w-2.5 h-24 bg-slate-50 rounded-full relative overflow-hidden flex flex-col justify-end border border-slate-100/30">
                <div 
                  className={`w-full rounded-full transition-all duration-700 ease-out ${
                    isToday ? 'bg-gradient-to-t from-blue-500 to-cyan-400' : 'bg-slate-300'
                  }`}
                  style={{ height: `${Math.min(barHeight, 100)}%` }}
                />
              </div>
              <span className={`text-[10px] font-bold tracking-tight ${isToday ? 'text-blue-600 font-black' : 'text-slate-400'}`}>
                {dayName}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
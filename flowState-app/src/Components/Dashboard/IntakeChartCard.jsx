import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine } from '@fortawesome/free-solid-svg-icons';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

export default function IntakeChartCard({ logs, dailyGoal }) {
  
  // 1. Check if there are any recorded interactions for the day
  const hasData = logs && logs.length > 0;

  // 2. KEEP YOUR ORIGINAL DATA TRANSFORM CODE AS IS HERE:
  // (Whatever map, reduce, or array formatting loop you originally had, leave it completely untouched)
  const yourCalculatedData = logs.map(log => {
    // ... your original loop logic remains here perfectly safe
    return { time: log.time, amount: log.amount }; 
  });

  // 3. FALLBACK STATIC BASELINE: If empty, show a flat clean timeline array
  const emptyBaselineData = [
    { time: '08:00 AM', amount: 0 },
    { time: '11:00 AM', amount: 0 },
    { time: '02:00 PM', amount: 0 },
    { time: '05:00 PM', amount: 0 },
    { time: '08:00 PM', amount: 0 },
    { time: '11:00 PM', amount: 0 },
  ];

  return (
    <div className="w-full bg-white rounded-[2rem] shadow-[0_10px_35px_rgba(0,132,255,0.015)] p-6 sm:p-8 border border-slate-100/50">
      
      {/* CARD HEADER */}
      <div className="flex items-center gap-2 mb-4 px-1">
      
        <div>
          <h2 className="text-sm font-black text-slate-800 tracking-tight">Intake Distribution Timeline</h2>

        </div>
      </div>

      {/* GRAPH PLOT */}
      <div className="w-full h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          {/* Feed yourCalculatedData if hasData is true, otherwise give it the clean baseline */}
          <AreaChart 
            data={hasData ? yourCalculatedData : emptyBaselineData} 
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            
            <XAxis 
              dataKey="time" 
              stroke="#94a3b8" 
              fontSize={10} 
              fontWeight={700} 
              tickLine={false} 
              axisLine={false} 
              dy={10} 
            />
            
            <YAxis 
              stroke="#94a3b8" 
              fontSize={10} 
              fontWeight={700} 
              tickLine={false} 
              axisLine={false} 
              dx={-5}
            />
            
            {/* Suppress tooltip hover effects if there's no data */}
            {hasData && <Tooltip />}
            
            {/* The line and blue color gradient fill will only draw if hasData is true */}
            {hasData && (
              <Area 
                type="monotone" 
                dataKey="amount" 
                stroke="#3b82f6" 
                strokeWidth={3} 
                fillOpacity={0.1} 
                fill="#3b82f6" 
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
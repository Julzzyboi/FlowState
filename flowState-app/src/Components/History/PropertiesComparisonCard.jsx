import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlassWater } from '@fortawesome/free-solid-svg-icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function PropertiesComparisonCard({ logs }) {
  const DRINK_TYPES_SCHEMA = [
    { name: 'Water', hydrationScore: 100, additiveScore: 0 },
    { name: 'Tea', hydrationScore: 90, additiveScore: 15 },
    { name: 'Coffee', hydrationScore: 80, additiveScore: 25 },
    { name: 'Energy Drink', hydrationScore: 55, additiveScore: 75 },
    { name: 'Wine', hydrationScore: 45, additiveScore: 85 },
  ];

  const beverageBarData = DRINK_TYPES_SCHEMA.map((drink) => {
    const isDrinkLogged = logs.some((log) => {
      const logType = (log.type || '').toLowerCase();
      const targetName = drink.name.toLowerCase();
      return logType === targetName || targetName.includes(logType) || logType.includes(targetName);
    });

    return {
      name: drink.name,
      'Hydration Score': isDrinkLogged ? drink.hydrationScore : 0,
      'Additive Score': isDrinkLogged ? drink.additiveScore : 0,
    };
  });

  return (
    <div className="lg:col-span-6 bg-white rounded-[2rem] shadow-[0_10px_35px_rgba(0,132,255,0.015)] p-6 sm:p-8 border border-slate-100/50 flex flex-col justify-between">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 text-xs shadow-sm">
          <FontAwesomeIcon icon={faGlassWater} />
        </div>
        <div>
          <h2 className="text-sm font-black text-slate-800 tracking-tight">Beverage Properties Comparison</h2>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Hydration vs Additives index for logged choices</p>
        </div>
      </div>
      <div className="w-full" style={{ height: '300px', minHeight: '300px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={beverageBarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barGap={0} barSize={35}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="name" stroke="#64748b" fontSize={11} fontWeight={700} axisLine={false} tickLine={false} dy={10} padding={{ left: 15, right: 15 }} />
            <YAxis stroke="#94a3b8" fontSize={10} fontWeight={700} domain={[0, 100]} axisLine={false} tickLine={false} dx={-5} />
            <Tooltip cursor={{ fill: '#f8fafc', opacity: 0.4 }} content={({ active, payload }) => active && payload && payload.length ? (
               <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-800 text-[11px] font-medium">
                 <p className="font-black text-blue-400 mb-1 uppercase tracking-wider">{payload[0].payload.name}</p>
                 <p className="mb-0.5 text-slate-300">💧 Hydration Score: <span className="text-white font-bold">{payload[0].value}</span></p>
                 <p className="text-slate-300">🧪 Additive Score: <span className="text-white font-bold">{payload[1].value}</span></p>
               </div>
            ) : null} />
            <Legend verticalAlign="top" height={36} iconType="circle" />
            <Bar dataKey="Hydration Score" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Additive Score" fill="#f59e0b" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
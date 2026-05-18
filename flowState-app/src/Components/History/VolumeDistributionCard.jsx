import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar } from '@fortawesome/free-solid-svg-icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function VolumeDistributionCard({ logs, hasHydrationData }) {
  const totalDrinks = logs.reduce((acc, log) => {
    const type = (log.amount && log.type) ? log.type.toLowerCase() : '';
    if (type.includes('water')) acc.water += log.amount;
    else if (type.includes('coffee')) acc.coffee += log.amount;
    else if (type.includes('tea')) acc.tea += log.amount;
    else if (type.includes('wine')) acc.wine += log.amount;
    else if (type.includes('energy')) acc.energy += log.amount;
    return acc;
  }, { water: 0, coffee: 0, tea: 0, wine: 0, energy: 0 });

  const intakeVolumeData = [
    { name: 'Water', Volume: totalDrinks.water, fill: '#3b82f6' },
    { name: 'Tea', Volume: totalDrinks.tea, fill: '#10b981' },
    { name: 'Coffee', Volume: totalDrinks.coffee, fill: '#b45309' },
    { name: 'Energy Drink', Volume: totalDrinks.energy, fill: '#d97706' },
    { name: 'Wine', Volume: totalDrinks.wine, fill: '#9d174d' },
  ].filter(item => item.Volume > 0);

  return (
    <div className="lg:col-span-6 bg-white rounded-4xl shadow-[0_10px_35px_rgba(0,132,255,0.015)] p-6 sm:p-8 border border-slate-100/50 flex flex-col justify-between">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500 text-xs shadow-sm">
          <FontAwesomeIcon icon={faChartBar} />
        </div>
        <div>
          <h2 className="text-sm font-black text-slate-800 tracking-tight">Beverage Distribution</h2>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Volume allocation by category (mL)</p>
        </div>
      </div>
      <div className="w-full flex items-center justify-center" style={{ height: '260px', minHeight: '260px' }}>
        {hasHydrationData ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={intakeVolumeData} layout="vertical" margin={{ top: 10, right: 20, left: 10, bottom: 5 }} barSize={16}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" stroke="#94a3b8" fontSize={10} fontWeight={700} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={11} fontWeight={700} axisLine={false} tickLine={false} width={85} />
              <Tooltip cursor={{ fill: '#f8fafc', opacity: 0.4 }} content={({ active, payload }) => active && payload && payload.length ? (
                <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-xl border border-slate-800 text-[11px] font-medium">
                  <p className="font-bold">{payload[0].payload.name}: <span className="text-blue-400">{payload[0].value.toLocaleString()} mL</span></p>
                </div>
              ) : null} />
              <Bar dataKey="Volume" radius={[0, 4, 4, 0]}>
                {intakeVolumeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-44 h-44 rounded-full border-4 border-dashed border-slate-200/60 flex items-center justify-center text-center p-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">No Intake Tracked</span>
          </div>
        )}
      </div>
    </div>
  );
}
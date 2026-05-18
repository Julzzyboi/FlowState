import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function TaskCompletionPieCard({ sanitationLogs, hasTodoData }) {
  const getTodoStats = () => {
    if (!hasTodoData) return [];
    const completedCount = sanitationLogs.filter(task => task.completed === true).length;
    const pendingCount = sanitationLogs.length - completedCount;

    return [
      { name: 'Completed Tasks', value: completedCount, color: '#10b981' },
      { name: 'Pending Tasks', value: pendingCount, color: '#cbd5e1' }
    ].filter(item => item.value > 0); 
  };

  const todoPieData = getTodoStats();

  return (
    <div className="lg:col-span-6 bg-white rounded-4xl shadow-[0_10px_35px_rgba(16,185,129,0.015)] p-6 sm:p-8 border border-slate-100/50 flex flex-col justify-between">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500 text-xs shadow-sm">
          <FontAwesomeIcon icon={faCheckCircle} />
        </div>
        <div>
          <h2 className="text-sm font-black text-slate-800 tracking-tight">Dashboard Tasks Completion</h2>
        </div>
      </div>
      <div className="w-full flex items-center justify-center relative" style={{ height: '260px', minHeight: '260px' }}>
        {todoPieData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={todoPieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={todoPieData.length > 1 ? 4 : 0}
                dataKey="value"
                stroke="none"
              >
                {todoPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={({ active, payload }) => active && payload && payload.length ? (
                <div className="bg-white p-3 rounded-xl shadow-xl border border-slate-100 text-[11px] font-medium text-slate-700">
                  <p className="font-black text-slate-800 mb-1">{payload[0].name}</p>
                  <p>Count: <span className="font-bold text-emerald-600">{payload[0].value} Items</span></p>
                </div>
              ) : null} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-44 h-44 rounded-full border-4 border-dashed border-slate-200/60 flex items-center justify-center text-center p-4">
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">No Dashboard Tasks Found</span>
          </div>
        )}
      </div>
    </div>
  );
}
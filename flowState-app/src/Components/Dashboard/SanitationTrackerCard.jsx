import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSeedling, faCheckCircle, faDotCircle, faTrash, faPlus, faEdit, faCheck } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

export default function SanitationTrackerCard() {
  const [activities, setActivities] = useState(() => {
    try {
      const saved = localStorage.getItem('sanitationActivities');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [newInputText, setNewInputText] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');

  useEffect(() => {
    localStorage.setItem('sanitationActivities', JSON.stringify(activities));
  }, [activities]);

  const handleCreateActivity = (e) => {
    e.preventDefault();
    if (!newInputText.trim()) return;
    setActivities(prev => [...prev, { id: Date.now(), text: newInputText.trim(), completed: false }]);
    setNewInputText('');
  };

  const handleToggleComplete = (id) => {
    setActivities(prev => prev.map(act => act.id === id ? { ...act, completed: !act.completed } : act));
  };

  const startInlineEdit = (e, act) => {
    e.stopPropagation();
    setEditingId(act.id);
    setEditingText(act.text);
  };

  const saveInlineEdit = (e, id) => {
    e.stopPropagation();
    if (!editingText.trim()) return;
    setActivities(prev => prev.map(act => act.id === id ? { ...act, text: editingText.trim() } : act));
    setEditingId(null);
  };

  // DELETE: Handled with sweetalert popup modal matching dashboard theme style rules
  const handleDeleteActivity = (e, id) => {
    e.stopPropagation(); // Avoid triggering completion toggles
    
    Swal.fire({
      title: 'Remove Item?',
    
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      background: '#ffffff',
      color: '#1e293b',
      customClass: {
        popup: 'rounded-[2rem] font-sans text-xs',
        title: 'text-base font-black tracking-tight text-slate-800',
        htmlContainer: 'text-xs font-medium text-slate-500 leading-relaxed',
        confirmButton: 'rounded-xl text-xs font-bold px-4 py-2.5 cursor-pointer',
        cancelButton: 'rounded-xl text-xs font-bold px-4 py-2.5 cursor-pointer'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        setActivities(prev => prev.filter(act => act.id !== id));
        Swal.fire({
          title: 'Deleted',
          text: 'Task removed successfully.',
          icon: 'success',
          timer: 1200,
          showConfirmButton: false,
          customClass: { popup: 'rounded-[2rem]', title: 'text-sm font-bold text-slate-800' }
        });
      }
    });
  };

  const totalTasks = activities.length;
  const completedTasks = activities.filter(a => a.completed).length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // DIAL PARAMETERS: Amplified sizing footprint definitions
  const radius = 90;
  const strokeWidth = 14;
  const totalArcLength = 2 * Math.PI * radius; // ~565.48
  
  const openArcLength = totalArcLength * 0.75; 
  const strokeDashoffset = openArcLength - (completionPercentage / 100) * openArcLength;

  return (
    <div className="w-full bg-white rounded-[2rem] shadow-[0_10px_35px_rgba(16,185,129,0.015)] p-8 border border-emerald-100/40 flex flex-col md:flex-row gap-10 items-center justify-between min-h-[340px]">
      
      {/* 1. EMBOLDENED UP-SIZED GAUGE CONTROLLER (LEFT SIDE) */}
      <div className="w-full md:w-5/12 flex flex-col items-center justify-center self-stretch py-4">
        <div className="relative w-64 h-64 flex items-center justify-center">
          
          <svg className="w-full h-full transform rotate-[135deg]" viewBox="0 0 220 220">
            {/* SOLID BACKGROUND TRACK */}
            <circle
              cx="110"
              cy="110"
              r={radius}
              stroke="#e2e8f0"
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={`${openArcLength} ${totalArcLength}`}
              strokeLinecap="round"
            />

            {/* LIVE DYNAMIC GREEN FILLER ARC */}
            <circle
              cx="110"
              cy="110"
              r={radius}
              stroke="#10b981"
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={`${openArcLength} ${totalArcLength}`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />
          </svg>

          {/* INTERNAL VALUE NODES: Raw scaled plant upsized along with the layout frame */}
          <div className="absolute top-[28%] flex flex-col items-center justify-center text-center">
            <FontAwesomeIcon icon={faSeedling} className="text-emerald-500 text-5xl mb-3" />
            <span className="text-5xl font-black text-slate-800 tracking-tight block leading-none">
              {completionPercentage}%
            </span>
            <span className="text-xs font-bold text-slate-400 tracking-widest uppercase block mt-2">
              {completedTasks} / {totalTasks} Done
            </span>
          </div>
        </div>

        {/* BOTTOM METRIC BADGE TAG */}
        <div className="text-center mt-1">
          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">
            Sanitation Goal
          </span>
        </div>
      </div>

      {/* 2. THE CHECKLIST BOARD WORKSPACE (RIGHT SIDE) */}
      <div className="w-full md:w-7/12 flex flex-col gap-5 self-stretch justify-start">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
     
            <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
              Sanitation Action Board
            </span>
          </div>
        </div>

        {/* INPUT SUBMISSION FIELD */}
        <form onSubmit={handleCreateActivity} className="flex gap-2 w-full">
          <input
            type="text"
            value={newInputText}
            onChange={(e) => setNewInputText(e.target.value)}
            placeholder="Type your own custom sanitation activity..."
            className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-medium text-slate-700 outline-none focus:border-emerald-300 focus:bg-white transition-all placeholder:text-slate-400"
          />
          <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl px-5 py-3 flex items-center justify-center cursor-pointer shadow-sm transition-colors text-xs">
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </form>

        {/* RENDER GRID LOG LISTING ITEMS */}
        <div className="flex flex-col gap-2.5 max-h-[220px] overflow-y-auto pr-1 clean-history-box flex-1 min-h-[140px]">
          {activities.length === 0 ? (
            <div className="w-full h-full flex flex-col items-center justify-center py-12 text-center border border-dashed border-slate-100 rounded-2xl bg-slate-50/20">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Workspace Blank</span>
              <p className="text-[9px] font-medium text-slate-400 mt-1">Input tasks using the bar above to start tracking performance.</p>
            </div>
          ) : (
            activities.map((activity) => (
              <div 
                key={activity.id}
                onClick={() => handleToggleComplete(activity.id)}
                className={`flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl border transition-all cursor-pointer group select-none
                  ${activity.completed ? 'bg-emerald-50/40 border-emerald-100/60 text-slate-400' : 'bg-slate-50/40 border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/10 text-slate-700'}`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <FontAwesomeIcon 
                    icon={activity.completed ? faCheckCircle : faDotCircle} 
                    className={`text-sm shrink-0 transition-transform group-hover:scale-110 ${activity.completed ? 'text-emerald-500' : 'text-slate-300 group-hover:text-emerald-400'}`}
                  />
                  {editingId === activity.id ? (
                    <input
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      onClick={(e) => e.stopPropagation()} 
                      className="flex-1 bg-white border border-emerald-300 rounded-md px-2 py-1 text-[11px] font-medium text-slate-700 outline-none"
                    />
                  ) : (
                    <span className={`text-[11px] font-medium leading-tight truncate ${activity.completed ? 'line-through decoration-emerald-300' : ''}`}>
                      {activity.text}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {editingId === activity.id ? (
                    <button onClick={(e) => saveInlineEdit(e, activity.id)} className="w-7 h-7 flex items-center justify-center bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-[10px] transition-colors cursor-pointer">
                      <FontAwesomeIcon icon={faCheck} />
                    </button>
                  ) : (
                    <button onClick={(e) => startInlineEdit(e, activity)} className="w-7 h-7 flex items-center justify-center border border-slate-100 bg-white hover:border-emerald-200 hover:text-emerald-500 text-slate-400 rounded-lg text-[10px] opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                  )}
                  <button onClick={(e) => handleDeleteActivity(e, activity.id)} className="w-7 h-7 flex items-center justify-center border border-slate-100 bg-white hover:border-red-100 hover:text-red-500 text-slate-400 rounded-lg text-[10px] opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
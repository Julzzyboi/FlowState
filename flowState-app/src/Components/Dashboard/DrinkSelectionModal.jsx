import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPlus } from '@fortawesome/free-solid-svg-icons';
import { LIQUID_TYPES } from '../../pages/01-Dashboard'; 
import Swal from 'sweetalert2'; 

// Created a global Toast Mixin configuration matching the layout style
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  background: '#ffffff',
  color: '#1e293b',
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  }
});

export default function DrinkSelectionModal({ 
  isOpen, 
  onClose, 
  selectedLiquid, 
  onSelectLiquid, 
  currentVolume, 
  onSelectVolume,
  dailyGoal,
  onUpdateDailyGoal
}) {
  const PRESET_VOLUMES = [100, 125, 150, 200, 250, 300, 350, 400, 500, 600];
  
  const [isCustomVolumeActive, setIsCustomVolumeActive] = useState(false);
  const [customVolumeValue, setCustomVolumeValue] = useState('');
  const [customGoalValue, setCustomGoalValue] = useState(dailyGoal || 2500);

  useEffect(() => {
    if (isOpen) {
      setCustomGoalValue(dailyGoal);
      if (!PRESET_VOLUMES.includes(currentVolume)) {
        setIsCustomVolumeActive(true);
        setCustomVolumeValue(currentVolume.toString());
      } else {
        setIsCustomVolumeActive(false);
        setCustomVolumeValue('');
      }
    }
  }, [isOpen, currentVolume, dailyGoal]);

  if (!isOpen) return null;

  const handlePresetVolumeSelect = (vol) => {
    setIsCustomVolumeActive(false);
    onSelectVolume(vol);
  };

  const handleCustomVolumeTrigger = () => {
    setIsCustomVolumeActive(true);
    if (!customVolumeValue) {
      setCustomVolumeValue(currentVolume.toString());
    }
  };

  const handleSaveAndConfirm = (e) => {
    e.preventDefault();

    let finalVolume = currentVolume;
    
    // 1. Validate Custom Volume input if active using Toast Mixin
    if (isCustomVolumeActive) {
      const parsedVol = parseInt(customVolumeValue, 10);
      
      if (isNaN(parsedVol) || parsedVol <= 0) {
        Toast.fire({
          icon: 'error',
          title: 'Please enter an amount greater than 0 mL'
        });
        return;
      }
      
      if (parsedVol > 10000) {
        Toast.fire({
          icon: 'warning',
          title: 'Value must be less than or equal to 10000 mL'
        });
        return;
      }
      
      finalVolume = parsedVol;
    }

    // 2. Validate Target Daily Goal input using Toast Mixin
    const parsedGoal = parseInt(customGoalValue, 10);
    if (isNaN(parsedGoal) || parsedGoal < 500 || parsedGoal > 20000) {
      Toast.fire({
        icon: 'warning',
        title: 'Set target between 500 mL and 20000 mL'
      });
      return;
    }

    // Apply valid updates and close modal smoothly
    onSelectVolume(finalVolume);
    onUpdateDailyGoal(parsedGoal);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-all duration-300">
      <style>
        {`
          .no-spin-buttons::-webkit-outer-spin-button,
          .no-spin-buttons::-webkit-inner-spin-button {
            -webkit-appearance: none !important;
            margin: 0 !important;
          }
          .no-spin-buttons {
            -moz-appearance: textfield !important;
          }
          /* Custom Toast styles matching Comfortaa theme */
          .swal2-toast {
            font-family: 'Comfortaa', sans-serif !important;
            border-radius: 1.25rem !important;
            box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08) !important;
            border: 1px solid #f1f5f9 !important;
            padding: 0.75rem 1rem !important;
          }
          .swal2-toast .swal2-title {
            font-size: 11px !important;
            font-weight: 700 !important;
            color: #334155 !important;
          }
        `}
      </style>

      <div 
        className="w-full max-w-md bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(15,23,42,0.08)] p-6 sm:p-8 relative border border-slate-100 animate-in fade-in zoom-in-95 duration-200"
        style={{ fontFamily: "'Comfortaa', sans-serif" }}
      >
        <button 
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
        >
          <FontAwesomeIcon icon={faTimes} className="text-xs" />
        </button>

        <h2 className="text-base font-black text-slate-800 tracking-tight mb-5">Switch Cup Size</h2>

        <form onSubmit={handleSaveAndConfirm} className="flex flex-col gap-5" noValidate>
          
          {/* LIQUID SELECTOR BLOCK */}
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-2.5">Select Liquid Type</label>
            <div className="grid grid-cols-5 gap-2">
              {LIQUID_TYPES.map((liquid) => {
                const isSelected = selectedLiquid.label === liquid.label;
                return (
                  <button
                    type="button"
                    key={liquid.label}
                    onClick={() => onSelectLiquid(liquid)}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all cursor-pointer aspect-square ${
                      isSelected 
                        ? 'border-blue-500 bg-blue-50/50 text-blue-600 shadow-sm shadow-blue-500/5 font-bold' 
                        : 'border-slate-100 bg-white text-slate-400 hover:bg-slate-50/80'
                    }`}
                  >
                    <FontAwesomeIcon icon={liquid.icon} className="text-sm sm:text-base mb-1" />
                    <span className="text-[8px] sm:text-[9px] font-bold tracking-tight truncate w-full text-center">{liquid.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* VESSEL PRESET VOLUME GRID */}
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-2.5">Volume Size</label>
            <div className="grid grid-cols-4 gap-2">
              {PRESET_VOLUMES.map((vol) => {
                const isSelected = !isCustomVolumeActive && currentVolume === vol;
                return (
                  <button
                    type="button"
                    key={vol}
                    onClick={() => handlePresetVolumeSelect(vol)}
                    className={`py-2 rounded-xl text-[10px] font-bold border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-500 border-blue-500 text-white shadow-sm'
                        : 'bg-white border-slate-100 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {vol} mL
                  </button>
                );
              })}

              <button
                type="button"
                onClick={handleCustomVolumeTrigger}
                className={`py-2 rounded-xl text-[10px] font-bold border border-dashed transition-all flex items-center justify-center gap-1 cursor-pointer ${
                  isCustomVolumeActive
                    ? 'bg-blue-500 border-blue-500 text-white shadow-sm'
                    : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'
                }`}
              >
                <FontAwesomeIcon icon={faPlus} className="text-[8px]" />
                Custom
              </button>
            </div>

            {/* Custom mL Input Field */}
            {isCustomVolumeActive && (
              <div className="mt-2.5 p-3 bg-blue-50/30 border border-blue-100 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-2 duration-200">
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-wider shrink-0">Custom mL:</span>
                <input 
                  type="number"
                  value={customVolumeValue}
                  onChange={(e) => setCustomVolumeValue(e.target.value)}
                  placeholder="e.g. 450"
                  className="no-spin-buttons flex-1 min-w-0 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
            )}
          </div>

          {/* TARGET DAILY GOAL INPUT SECTION */}
          <div className="border-t border-slate-100 pt-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-2">Target Daily Goal</label>
            <div className="w-full relative flex items-center">
              <input 
                type="number"
                value={customGoalValue}
                onChange={(e) => setCustomGoalValue(e.target.value)}
                placeholder="Target Intake e.g. 2500"
                className="no-spin-buttons w-full bg-slate-50/80 border border-slate-100 rounded-xl pl-4 pr-16 py-3 text-xs font-bold text-slate-800 focus:outline-none focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
              />
              <span className="absolute right-4 text-[10px] font-black text-slate-400/80 pointer-events-none select-none">mL Goal</span>
            </div>
          </div>

          {/* COMMIT FORM SELECTION BUTTON */}
          <button
            type="submit"
            className="w-full bg-[#1e293b] hover:bg-slate-800 text-white font-bold text-xs py-4 rounded-xl shadow-md transition-all mt-2 cursor-pointer active:scale-[0.99]"
          >
            Confirm Selection
          </button>

        </form>
      </div>
    </div>
  );
}
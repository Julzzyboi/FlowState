import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlassWater, faUndo, faSliders, faBolt, faCoffee, faUtensils, faWineGlass } from '@fortawesome/free-solid-svg-icons';

// SweetAlert2
import Swal from 'sweetalert2';

// Isolated Sub-Components
import GaugeRing from '../Components/Dashboard/GaugeRing';
import WaterDropFill from '../Components/Dashboard/WaterDropFill';
import MetricCards from '../Components/Dashboard/MetricCards';
import WeeklyTracker from '../Components/Dashboard/WeeklyTracker';
import LogHistory from '../Components/Dashboard/LogHistory';
import DrinkSelectionModal from '../Components/Dashboard/DrinkSelectionModal';
import GoalCelebrationModal from '../Components/Dashboard/GoalCelebrationModal';
import IntakeChartCard from '../Components/Dashboard/IntakeChartCard';
import SanitationTrackerCard from '../Components/Dashboard/SanitationTrackerCard'; 

// LIQUID TYPES WITH HIDDEN ANALYTICS SCORE METADATA CONFIGURED
export const LIQUID_TYPES = [
  { label: 'Water', icon: faGlassWater, color: '#3b82f6', bgLight: '#eff6ff', hydrationScore: 100, additiveScore: 0 },
  { label: 'Coffee', icon: faCoffee, color: '#b45309', bgLight: '#fef3c7', hydrationScore: 80, additiveScore: 25 },
  { label: 'Tea', icon: faUtensils, color: '#10b981', bgLight: '#ecfdf5', hydrationScore: 90, additiveScore: 15 },
  { label: 'Wine', icon: faWineGlass, color: '#9d174d', bgLight: '#fce7f3', hydrationScore: 45, additiveScore: 85 },
  { label: 'Energy Drink', icon: faBolt, color: '#d97706', bgLight: '#fffbeb', hydrationScore: 55, additiveScore: 75 }
];

// ================= COMPREHENSIVE COMPONENT SKELETON WIREFRAME =================
function FullDashboardSkeleton() {
  return (
    <div className="w-full min-h-screen bg-Body px-4 sm:px-8 lg:px-10 pt-6 pb-32 flex flex-col justify-start items-center animate-pulse">
      <div className="w-full max-w-[98%] flex flex-col gap-6">
        
        {/* Header Title Row */}
        <div className="w-full px-1">
          <div className="h-6 w-36 bg-slate-200/80 rounded-lg mb-2" />
          <div className="h-3 w-24 bg-slate-200/40 rounded-md" />
        </div>

        {/* Primary Upper Layout Block */}
        <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          
          {/* Main Dial Container Skeleton */}
          <div className="md:col-span-7 w-full bg-white rounded-4xl p-6 sm:p-8 flex flex-col items-center justify-between border border-slate-100/50 min-h-115">
            <div className="w-full flex-1 flex flex-col items-center justify-center py-6">
              <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full border-12 border-slate-100 flex flex-col items-center justify-center">
                <div className="h-10 w-16 bg-slate-200 rounded-xl mb-3" />
                <div className="h-3 w-28 bg-slate-100 rounded-md" />
              </div>
            </div>
            
            {/* Button Array Rows */}
            <div className="w-full grid grid-cols-12 gap-3 mt-2">
              <div className="col-span-6 h-13 sm:h-14 bg-slate-200 rounded-2xl" />
              <div className="col-span-3 h-13 sm:h-14 bg-slate-100 rounded-2xl" />
              <div className="col-span-3 h-13 sm:h-14 bg-slate-100 rounded-2xl" />
            </div>
          </div>

          {/* Right Metrics Stack Skeleton */}
          <div className="md:col-span-5 w-full flex flex-col gap-5 justify-between">
            {/* Metric Cards Mock Row */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl p-4 border border-slate-100/50 h-22" />
              <div className="bg-white rounded-2xl p-4 border border-slate-100/50 h-22" />
              <div className="bg-white rounded-2xl p-4 border border-slate-100/50 h-22" />
            </div>
            {/* Weekly Strip Mock */}
            <div className="bg-white rounded-4xl p-6 border border-slate-100/50 flex-1 min-h-27.5" />
            {/* Log History Window Mock */}
            <div className="w-full h-55 bg-white rounded-4xl border border-slate-100/50" />
          </div>
        </div>

        {/* Row 2 Matrix: Charts Shimmer Frame */}
        <div className="w-full mt-2 bg-white rounded-4xl border border-slate-100/50 h-85" />

        {/* Row 3 Matrix: Sanitation Actions Workspace Shimmer Frame */}
        <div className="w-full mt-2 bg-white rounded-4xl border border-slate-100/50 h-60" />

      </div>
    </div>
  );
}

// ================= MAIN IMPLEMENTATION WORKFLOW =================
export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);

  const [waterIntake, setWaterIntake] = useState(() => {
    const savedIntake = localStorage.getItem('waterIntake');
    return savedIntake ? parseInt(savedIntake, 10) : 0;
  });

  const [logs, setLogs] = useState(() => {
    const savedLogs = localStorage.getItem('hydrationLogs');
    return savedLogs ? JSON.parse(savedLogs) : [];
  });

  const [dailyGoal, setDailyGoal] = useState(() => {
    const savedGoal = localStorage.getItem('dailyGoal');
    return savedGoal ? parseInt(savedGoal, 10) : 2500;
  });

  const [hasCelebratedToday, setHasCelebratedToday] = useState(() => {
    const savedCelebrated = localStorage.getItem('hasCelebratedToday');
    return savedCelebrated ? JSON.parse(savedCelebrated) : false;
  });

  const [isDrinking, setIsDrinking] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCelebrationOpen, setIsCelebrationOpen] = useState(false); 
  
  const [selectedLiquid, setSelectedLiquid] = useState(LIQUID_TYPES[0]);
  const [currentVesselVolume, setCurrentVesselVolume] = useState(300);
  
  const percentage = Math.min((waterIntake / dailyGoal) * 100, 100) || 0;
  const isGoalAchieved = waterIntake >= dailyGoal;
  const totalServings = logs?.length || 0;

  // Manage dashboard skeleton loader presentation on initial page layout execution
  useEffect(() => {
    const timeoutTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1200); // Snappy, clean loading state duration
    return () => clearTimeout(timeoutTimer);
  }, []);

  useEffect(() => {
    localStorage.setItem('waterIntake', waterIntake);
  }, [waterIntake]);

  useEffect(() => {
    localStorage.setItem('hydrationLogs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('dailyGoal', dailyGoal);
  }, [dailyGoal]);

  useEffect(() => {
    localStorage.setItem('hasCelebratedToday', JSON.stringify(hasCelebratedToday));
  }, [hasCelebratedToday]);
  
  const getMostDrankType = () => {
    if (!logs || logs.length === 0) return 'None';
    try {
      const totals = logs.reduce((acc, log) => {
        if (log?.type) acc[log.type] = (acc[log.type] || 0) + (log.amount || 0);
        return acc;
      }, {});
      const keys = Object.keys(totals);
      if (keys.length === 0) return 'None';
      return keys.reduce((a, b) => totals[a] > totals[b] ? a : b);
    } catch (err) {
      return 'None';
    }
  };
  const mostDrankType = getMostDrankType();

  const handleDrinkExecution = () => {
    if (isDrinking) return;
    setIsDrinking(true);

    setTimeout(() => {
      const formattedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const nextIntake = Math.min(waterIntake + currentVesselVolume, dailyGoal * 2);
      
      setWaterIntake(nextIntake);
      setLogs((prev) => [
        {
          id: Date.now(),
          type: selectedLiquid.label,
          amount: currentVesselVolume,
          time: formattedTime,
          icon: selectedLiquid.icon,
          color: selectedLiquid.color,      
          bgLight: selectedLiquid.bgLight,
          // HIDDEN QUALITY VARIABLES INTEGRATED DOWNSTREAM TO STORAGE
          hydrationScore: selectedLiquid.hydrationScore,
          additiveScore: selectedLiquid.additiveScore   
        },
        ...prev
      ]);

      if (nextIntake >= dailyGoal && !hasCelebratedToday) {
        setIsCelebrationOpen(true);
        setHasCelebratedToday(true);
      }

      setIsDrinking(false);
    }, 800);
  };

  const handleResetProgress = () => {
    Swal.fire({
      title: 'Reset Today Progress?',
    
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Reset',
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
        setWaterIntake(0);
        setLogs([]);
        setHasCelebratedToday(false); 
        Swal.fire({
          title: 'Cleared!',
          text: 'Your intake has been reset.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          customClass: { popup: 'rounded-[2rem]', title: 'text-sm font-bold text-slate-800' }
        });
      }
    });
  };

  const handleGoalUpdateOverride = (newGoal) => {
    setDailyGoal(newGoal);
    if (waterIntake >= newGoal && !hasCelebratedToday) {
      setIsCelebrationOpen(true);
      setHasCelebratedToday(true);
    } else if (waterIntake < newGoal) {
      setHasCelebratedToday(false); 
    }
  };

  // 1. LOADING SCREEN ENFORCEMENT: Renders high-fidelity wireframes
  if (isLoading) {
    return <FullDashboardSkeleton />;
  }

  // 2. LIVE APP MODULES: Mounts system tracking utilities
  return (
    <div 
      className="w-full min-h-screen bg-Body px-4 sm:px-8 lg:px-10 pt-6 pb-32 flex flex-col justify-start items-center"
      style={{ fontFamily: "'Comfortaa', sans-serif" }}
    >
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Comfortaa:wght@400;500;600;700&display=swap');
          .swal2-popup { font-family: 'Comfortaa', sans-serif !important; }
          
          .scrollbar-none::-webkit-scrollbar { display: none !important; }
          .scrollbar-none { -ms-overflow-style: none !important; scrollbar-width: none !important; }
          
          .clean-history-box::-webkit-scrollbar { width: 5px !important; }
          .clean-history-box::-webkit-scrollbar-track { background: transparent !important; }
          .clean-history-box::-webkit-scrollbar-thumb { background: #cbd5e1 !important; border-radius: 99px !important; }

          .booster-dial-frame {
            transform: scale(1.1);
            transform-origin: center center;
            transition: transform 0.3s ease;
          }
          @media (max-width: 640px) {
            .booster-dial-frame { transform: scale(1.0); }
          }
        `}
      </style>

      <div className="w-full max-w-[98%] flex flex-col gap-6 text-slate-800">
        
        {/* HEADER AREA */}
        <div className="w-full px-1">
          <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">Hydration</h1>
        </div>

        {/* PRIMARY UPPER GRID SECTION */}
        <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          
          {/* Main Dial Card */}
          <div className="md:col-span-7 w-full bg-white rounded-4xl shadow-[0_10px_35px_rgba(0,132,255,0.015)] p-6 sm:p-8 flex flex-col items-center justify-between border border-slate-100/50">
            <div className="w-full flex-1 flex flex-col items-center justify-center py-6">
              <div className="booster-dial-frame flex items-center justify-center">
                <GaugeRing percentage={percentage}>
                  <WaterDropFill percentage={percentage} />
                </GaugeRing>
              </div>

              <div className="text-center mt-5 z-10 flex flex-col items-center justify-start">
                <span className="text-4xl sm:text-5xl font-black text-slate-800 tracking-tight block leading-none">
                  {waterIntake}
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-slate-400 tracking-widest uppercase block mt-1.5">
                  / {dailyGoal} mL Target
                </span>
                {isGoalAchieved && (
                  <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest mt-2 bg-blue-50 px-2.5 py-0.5 rounded-full">
                    Completed 🎉
                  </span>
                )}
              </div>
            </div>

            {/* ACTION FOOTER LAYOUT ROW */}
            <div className="w-full grid grid-cols-12 gap-3 mt-2">
              <button 
                onClick={handleDrinkExecution}
                disabled={isDrinking}
                className="col-span-6 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 text-white font-bold text-xs sm:text-sm py-4 px-2 rounded-2xl shadow-md cursor-pointer"
              >
                {isDrinking ? 'Drinking...' : `Drink (${currentVesselVolume}mL)`}
              </button>

              <button 
                onClick={() => setIsModalOpen(true)}
                className="col-span-3 h-13 sm:h-14 border border-slate-100 flex items-center justify-center rounded-2xl shadow-sm hover:bg-slate-50/80 cursor-pointer bg-slate-50/40 text-slate-500"
              >
                <FontAwesomeIcon icon={faSliders} />
              </button>

              <button 
                onClick={handleResetProgress}
                className="col-span-3 h-13 sm:h-14 bg-white hover:bg-red-50/40 border border-slate-100 text-slate-400 hover:text-red-500 flex flex-col items-center justify-center rounded-2xl shadow-sm cursor-pointer"
              >
                <FontAwesomeIcon icon={faUndo} className="text-[10px] mb-0.5" />
                <span className="text-[8px] sm:text-[9px] font-black tracking-tight uppercase">Reset</span>
              </button>
            </div>
          </div>

          {/* Right Control Stack */}
          <div className="md:col-span-5 w-full flex flex-col gap-5 justify-between">
            <MetricCards totalServings={totalServings} mostDrankType={mostDrankType} percentage={percentage} />
            <WeeklyTracker currentDayPercentage={percentage} historyLogs={logs} />
            <div className="w-full h-55 bg-white rounded-4xl shadow-[0_10px_35px_rgba(0,132,255,0.015)] p-6 border border-slate-100/50 flex flex-col overflow-hidden">
              <LogHistory logs={logs} />
            </div>
          </div>

        </div>

        {/* ROW 2: FULL-WIDTH DATA GRAPH */}
        <div className="w-full mt-2">
          <IntakeChartCard logs={logs} dailyGoal={dailyGoal} />
        </div>

        {/* ROW 3: NEW GREEN SANITATION ACTIVITIES WORKSPACE */}
        <div className="w-full mt-2">
          <SanitationTrackerCard />
        </div>

      </div>

      <DrinkSelectionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedLiquid={selectedLiquid}
        onSelectLiquid={setSelectedLiquid}
        currentVolume={currentVesselVolume}
        onSelectVolume={setCurrentVesselVolume}
        dailyGoal={dailyGoal}
        onUpdateDailyGoal={handleGoalUpdateOverride}
      />

      <GoalCelebrationModal 
        isOpen={isCelebrationOpen}
        onClose={() => setIsCelebrationOpen(false)}
        dailyGoal={dailyGoal}
      />

    </div>
  );
}

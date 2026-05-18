import React, { useState, useEffect } from 'react';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// IMPORT CLEAN SEGREGATED SUB-COMPONENTS
import IntakeChartCard from '../Components/Dashboard/IntakeChartCard'; 
import CompleteIntakeArchiveCard from '../Components/History/CompleteIntakeArchiveCard';
import PropertiesComparisonCard from '../Components/History/PropertiesComparisonCard';
import VolumeDistributionCard from '../Components/History/VolumeDistributionCard';
import TaskCompletionPieCard from '../Components/History/TaskCompletionPieCard';

export default function History() {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [dashboardLogs, setDashboardLogs] = useState([]);
  const [sanitationLogs, setSanitationLogs] = useState([]); 
  const [dailyGoal, setDailyGoal] = useState(2500); 

  useEffect(() => {
    // Read state entries safely from storage buckets
    const savedHydration = localStorage.getItem('hydrationLogs');
    if (savedHydration) setDashboardLogs(JSON.parse(savedHydration));

    const savedSanitation = localStorage.getItem('sanitationActivities');
    if (savedSanitation) setSanitationLogs(JSON.parse(savedSanitation));

    const savedGoal = localStorage.getItem('dailyGoal');
    if (savedGoal) setDailyGoal(parseInt(savedGoal, 10));

    // Simulated snappy loading layout duration to demonstrate skeleton frame assembly
    const loadTimer = setTimeout(() => {
      setIsPageLoading(false);
    }, 1100);

    return () => clearTimeout(loadTimer);
  }, []);

  const hasHydrationData = dashboardLogs && dashboardLogs.length > 0;
  const hasTodoData = sanitationLogs && sanitationLogs.length > 0;

  // MASTER CLICK EXPORT FUNCTION: Triggers client-side browser PDF engine compiling cleanly
  const handleDownloadReport = () => {
    window.print();
  };

  return (
    <div className="w-full min-h-screen bg-[#EEF5FD] px-4 sm:px-8 lg:px-10 pt-6 pb-32 flex flex-col justify-start items-center" style={{ fontFamily: "'Comfortaa', sans-serif" }}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Comfortaa:wght@400;500;600;700&display=swap');
          .recharts-legend-item-text { font-size: 10px !important; font-weight: 700 !important; color: #64748b !important; text-transform: uppercase; letter-spacing: 0.5px; }
          
          /* PRINT MEDIA OPTIMIZATION RULES FOR PERFECT PDF RENDERING */
          @media print {
            /* Hide application elements not meant for the report (like navbars or sidebar wrappers) */
            nav, sidebar, .mobile-nav, button, .no-print {
              display: none !important;
            }
            body, #root, .w-full {
              background: #ffffff !important;
              color: #000000 !important;
              padding: 0 !important;
              margin: 0 !important;
              width: 100% !important;
            }
            /* Eliminate outer screen scrolling layout boundaries on compilation export */
            .clean-history-box {
              max-height: none !important;
              overflow: visible !important;
            }
            /* Enforce clean spacing grid blocks inside printed canvas document sheets */
            .grid {
              display: grid !important;
              grid-template-columns: repeat(12, minmax(0, 1fr)) !important;
              gap: 1.5rem !important;
            }
            .lg\\:col-span-6 {
              grid-span: 6 !important;
              grid-column: span 6 / span 6 !important;
            }
            /* Prevent breaking layout containers right in half across printed pages */
            .bg-white {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              box-shadow: none !important;
              border: 1px solid #e2e8f0 !important;
            }
          }
        `}
      </style>

      <div className="w-full max-w-[98%] flex flex-col gap-6 text-slate-800">
        
        {/* HEADER */}
        <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-1">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">History</h1>
          </div>
          <div className="flex items-center gap-2">
            {/* Download Action Handler Attached */}
        
          </div>
        </div>

        {/* 1. COMPLETE UNRESTRICTED INTAKE LIST COMPONENT OR SKELETON */}
        {isPageLoading ? (
          <div className="w-full bg-white rounded-[2rem] p-8 border border-slate-100/50 animate-pulse h-[200px] flex flex-col gap-4">
            <div className="flex justify-between items-center w-full">
              <div className="h-5 bg-slate-200 rounded-md w-1/4" />
              <div className="h-6 bg-slate-100 rounded-full w-20" />
            </div>
            <div className="w-full border-b border-slate-50" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 flex-1">
              <div className="h-14 bg-slate-50 rounded-xl" />
              <div className="h-14 bg-slate-50 rounded-xl" />
              <div className="h-14 bg-slate-50 rounded-xl" />
            </div>
          </div>
        ) : (
          <CompleteIntakeArchiveCard logs={dashboardLogs} hasHydrationData={hasHydrationData} />
        )}

        {/* 2. TOP MATRIX CHART GRID */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-6 h-[400px] w-full flex flex-col">
            {isPageLoading ? (
              <div className="w-full h-full bg-white rounded-[2rem] p-8 border border-slate-100/50 animate-pulse flex flex-col justify-between">
                <div className="flex flex-col gap-2">
                  <div className="h-4 bg-slate-200 rounded w-1/3" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                </div>
                <div className="w-full flex items-end justify-around h-[220px] pt-4">
                  <div className="w-12 bg-slate-200 rounded-t h-[60%]" />
                  <div className="w-12 bg-slate-100 rounded-t h-[40%]" />
                  <div className="w-12 bg-slate-200 rounded-t h-[85%]" />
                  <div className="w-12 bg-slate-100 rounded-t h-[20%]" />
                </div>
              </div>
            ) : (
              <PropertiesComparisonCard logs={dashboardLogs} />
            )}
          </div>
          
          <div className="lg:col-span-6 h-[400px] w-full flex flex-col">
            {isPageLoading ? (
              <div className="w-full h-full bg-white rounded-[2rem] p-8 border border-slate-100/50 animate-pulse flex flex-col justify-between">
                <div className="flex flex-col gap-2">
                  <div className="h-4 bg-slate-200 rounded w-1/3" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                </div>
                <div className="w-full bg-slate-50 rounded-2xl flex-1 mt-6" />
              </div>
            ) : (
              <IntakeChartCard logs={dashboardLogs} dailyGoal={dailyGoal} />
            )}
          </div>
        </div>

        {/* 3. BOTTOM SPLIT CHART GRID */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-6 h-[380px] w-full flex flex-col">
            {isPageLoading ? (
              <div className="w-full h-full bg-white rounded-[2rem] p-8 border border-slate-100/50 animate-pulse flex flex-col justify-between">
                <div className="flex flex-col gap-2">
                  <div className="h-4 bg-slate-200 rounded w-1/4" />
                  <div className="h-3 bg-slate-100 rounded w-1/3" />
                </div>
                <div className="w-full flex flex-col gap-3 justify-center mt-6 flex-1">
                  <div className="h-4 bg-slate-100 rounded w-full" />
                  <div className="h-4 bg-slate-100 rounded w-4/5" />
                  <div className="h-4 bg-slate-100 rounded w-3/4" />
                </div>
              </div>
            ) : (
              <VolumeDistributionCard logs={dashboardLogs} hasHydrationData={hasHydrationData} />
            )}
          </div>
          
          <div className="lg:col-span-6 h-[380px] w-full flex flex-col">
            {isPageLoading ? (
              <div className="w-full h-full bg-white rounded-[2rem] p-8 border border-slate-100/50 animate-pulse flex flex-col items-center justify-between">
                <div className="flex flex-col gap-2 w-full items-start">
                  <div className="h-4 bg-slate-200 rounded w-1/3" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                </div>
                <div className="w-40 h-40 rounded-full border-[12px] border-slate-100/70 flex items-center justify-center my-auto" />
                <div className="h-3 bg-slate-100 rounded w-24 mb-2" />
              </div>
            ) : (
              <TaskCompletionPieCard sanitationLogs={sanitationLogs} hasTodoData={hasTodoData} />
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
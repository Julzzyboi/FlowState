import React from 'react';
import { useEffect, useRef, useState } from 'react';
import {DashboardIcon, EducationIcon, CommunityIcon, HistoryIcon, AccountIcon} from './Icons';


//* --- ICONS --- */
const tabs = [
  { id: 'dashboard', label: 'Dashboard', Icon: DashboardIcon },
  { id: 'education', label: 'Education', Icon: EducationIcon },
  { id: 'community', label: 'Community', Icon: CommunityIcon }, 
  { id: 'history', label: 'History', Icon: HistoryIcon },
  { id: 'account', label: 'Account', Icon: AccountIcon },
];


const PCNav = ({ activeTab, setActiveTab }) => {
  const tabsPC = [
    { id: 'dashboard', label: 'Dashboard', Icon: DashboardIcon },
    { id: 'education', label: 'Education', Icon: EducationIcon },
    { id: 'community', label: 'Community', Icon: CommunityIcon }, 
    { id: 'history', label: 'History', Icon: HistoryIcon },
  ];

  // 1. Create a "Map" of Refs to locate each ID
  const itemRefs = useRef({});
  const containerRef = useRef(null);
  const [coords, setCoords] = useState({ top: 0, height: 0 });

  // 2. Update indicator position whenever the activeTab changes
  useEffect(() => {
    const target = itemRefs.current[activeTab];
    if (target && containerRef.current) {
      const containerTop = containerRef.current.getBoundingClientRect().top;
      const targetRect = target.getBoundingClientRect();

      setCoords({
        top: targetRect.top - containerTop,
        height: targetRect.height
      });
    }
  }, [activeTab]);

  return (
    <nav className="hidden lg:flex w-80 bg-MobileNav h-screen sticky top-0 shadow-xl flex-col py-8 overflow-hidden">
      
      {/* Logo */}
      <div className="flex items-center gap-4 px-10 mb-16">
        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg transform -rotate-12">
           <span className="text-2xl text-MobileNav">💧</span>
        </div>
        <h1 className="text-white text-4xl font-bold tracking-tight">FlowState</h1>
      </div>

      {/* Main Wrapper - This is our coordinate "Home" */}
      <div ref={containerRef} className="flex flex-col flex-1 ml-10 relative">
        
        {/* THE INDICATOR: Locates based on 'coords' state */}
        <div 
          className="absolute right-0 w-full bg-Body rounded-l-full transition-all duration-500 cubic-bezier(0.6, -0.28, 0.735, 0.045) z-0"
          style={{ 
            height: `${coords.height}px`,
            transform: `translateY(${coords.top}px)` 
          }}
        />

        {/* Top Links */}
        <div className="flex flex-col gap-2">
          {tabsPC.map(({ id, label, Icon }) => (
            <button
              key={id}
              ref={el => itemRefs.current[id] = el} // Register ID locator
              onClick={() => setActiveTab(id)}
              className={`relative z-10 flex items-center gap-6 py-5 pl-5 w-full transition-all duration-500
                ${activeTab === id ? 'text-MobileNav' : 'text-white/80 hover:text-cyan-400'}`}
            >
              <Icon className={`w-8 h-8 shrink-0 transition-colors duration-500 ${activeTab === id ? 'text-MobileNav' : 'text-white'}`} />
              <span className="font-bold text-2xl tracking-wide">{label}</span>
            </button>
          ))}
        </div>

        {/* Account Link - Pushed to bottom with mt-auto */}
        <div className="mt-auto pb-8">
          <button
            ref={el => itemRefs.current['account'] = el} // Register ID locator
            onClick={() => setActiveTab('account')}
            className={`relative z-10 flex items-center gap-6 py-5 pl-5 w-full transition-all duration-500
              ${activeTab === 'account' ? 'text-MobileNav' : 'text-white/80'}`}
          >
             <AccountIcon className={`w-8 h-8 shrink-0 transition-colors duration-500 ${activeTab === 'account' ? 'text-MobileNav' : 'text-white'}`} />
             <span className="font-bold text-2xl">Account</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

//* --- TABLET BOTTOM NAV COMPONENT ---
const TabletNav = () => (
<nav className="hidden md:flex lg:hidden flex-col w-24 bg-TabletNav h-screen sticky top-0 p-4 border-r border-white/10">
    {/* Slim design with just icons goes here */}
  </nav>
);

//* --- MOBILE BOTTOM NAV COMPONENT ---
const MobileNav = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="flex md:hidden fixed bottom-0 left-0 right-0 bg-MobileNav h-32 items-center justify-center gap-14 px-2 rounded-t-[2.5rem] shadow-2xl z-50 transition-all duration-500">
      {tabs.map(({ id, label, Icon }) => {
        const isActive = activeTab === id;

        return (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className="relative flex flex-col items-center justify-center w-16 group"
          >
            {/* --- THE FLOATING BUBBLE --- */}
            <div
              className={`
                flex items-center justify-center rounded-full transition-all duration-500 ease-in-out
               ${isActive 
  ? 'bg-Body w-28 h-28 -translate-y-12 text-bg-MobileNav shadow-[0_20px_50px_rgba(0,0,0,0.9)]' 
  : 'w-16 h-16 group-hover:text-white group-hover:scale-90'}
              `}
            >
             {/* Added padding (p-3 or p-4) to shrink the SVG inside */}
              <div className={`${isActive ? 'p-3 w-22 h-22' : 'p-1 w-full h-full '}`}>
               <Icon className={`transition-all duration-300 ${isActive ? 'text-bg-MobileNav' : 'text-white'}`} />
              </div>
            
            </div>

            {/* --- THE LABEL --- */}
            <span
              className={`
                absolute transition-all duration-500 text-[1.3rem] font-bold whitespace-nowrap mt-6
                ${isActive 
                  ? 'text-white translate-y-2 opacity-100' 
                  : 'text-white/60 opacity-100 translate-y-10 group-hover:text-white'}
              `}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

//! --- MAIN LAYOUT (PARENT) ---
export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="flex min-h-screen bg-MobileNav overflow-hidden">
      
      {/* 1. Ensure PCNav has a lower or relative z-index */}
      <PCNav activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* 2. Overlapping Main Container */}
      <main className={`flex-1 bg-Body p-8 -ml-5 z-20 rounded-l-[3.5rem] relative`}>

        <div className="max-w-6xl h-auto mx-auto ml-5 mt-10 border-4 border-blue-800">
           {/* Your Content Goes Here */}
           <h2 className="text-3xl font-bold text-MobileNav capitalize">{activeTab}</h2>
        </div>
      </main>

      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>  
  );
}
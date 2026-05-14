import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DashboardIcon, 
  EducationIcon, 
  CommunityIcon, 
  HistoryIcon, 
  AccountIcon 
} from '../Icons';

const tabsPC = [
  { id: 'dashboard', label: 'Dashboard', Icon: DashboardIcon },
  { id: 'education', label: 'Education', Icon: EducationIcon },
  { id: 'community', label: 'Community', Icon: CommunityIcon },
  { id: 'history', label: 'History', Icon: HistoryIcon },
];

export default function PCNav({ activeTab, setActiveTab }) {
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <nav className={`hidden lg:flex ${isMinimized ? 'w-24' : 'w-64'} bg-MobileNav h-screen sticky top-0 shadow-xl flex-col py-8 transition-all duration-500 overflow-visible`}>
      
      {/* Logo Section */}
      <div className={`flex items-center mb-16 transition-all duration-500 ${isMinimized ? 'justify-center px-0' : 'px-6'}`}>
        <button 
          onClick={() => setIsMinimized(!isMinimized)}
          className={`w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg cursor-pointer active:scale-90 transition-all duration-500 
            ${isMinimized ? 'rotate-0' : '-rotate-12'}`} // <--- THE TILT LOGIC
        >
          <span className="text-2xl text-MobileNav">💧</span>
        </button>
        <h1 className={`text-white font-bold transition-all duration-500 whitespace-nowrap overflow-hidden ${isMinimized ? 'w-0 opacity-0' : 'w-auto opacity-100 ml-4 text-3xl'}`}>
          Flow<span className='italic text-[#46a4fe]'>State</span>
        </h1>
      </div>

      {/* Nav Wrapper */}
      <div className={`flex flex-col flex-1 relative transition-all duration-500 ${isMinimized ? 'ml-0' : 'ml-6'} overflow-visible`}>
        
        <div className="flex flex-col gap-2 relative">
          {tabsPC.map(({ id, label, Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`relative flex items-center w-full h-16 group outline-none cursor-pointer
                  ${isMinimized ? 'justify-center pl-0' : 'justify-start pl-4'}
                  ${isActive ? 'text-MobileNav' : 'text-white/80 hover:text-cyan-400'}`}
              >
                {/* 1. THE STABLE INDICATOR */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="activeScoop"
                      className="absolute -right-1 inset-y-0 w-[calc(100%+4px)] bg-[#F0F7FF] rounded-l-full z-0
                        before:content-[''] before:absolute before:top-[-30.5px] before:right-px before:w-8 before:h-8
                        before:rounded-br-[30px] before:shadow-[10px_10px_0_0_#F0F7FF] 
                        after:content-[''] after:absolute after:bottom-[-30.5px] after:right-px after:w-8 after:h-8
                        after:rounded-tr-[30px] after:shadow-[10px_-10px_0_0_#F0F7FF]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </AnimatePresence>

                {/* 2. THE CONTENT WRAPPER */}
                <div className="relative z-10 flex items-center transition-transform duration-150 active:scale-90">
                  <div className="w-10 h-10 flex items-center justify-center shrink-0">
                    <Icon className={`transition-all duration-500 ${isActive ? 'text-MobileNav' : 'text-white'} ${isMinimized ? 'w-9 h-9' : 'w-7 h-7'}`} />
                  </div>
                  <span className={`font-bold transition-all duration-500 whitespace-nowrap overflow-hidden ${isMinimized ? 'w-0 opacity-0 ml-0' : 'w-auto opacity-100 ml-3 text-xl'}`}>
                    {label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Account Button at Bottom */}
        <div className="mt-auto pb-8">
          <button
            onClick={() => setActiveTab('account')}
            className={`relative flex items-center w-full h-16 group outline-none cursor-pointer
              ${isMinimized ? 'justify-center pl-0' : 'justify-start pl-4'}
              ${activeTab === 'account' ? 'text-MobileNav' : 'text-white/80 hover:text-cyan-400'}`}
          >
            {activeTab === 'account' && (
              <motion.div
                layoutId="activeScoop"
                className="absolute -right-1 inset-y-0 w-[calc(100%+4px)] bg-[#F0F7FF] rounded-l-full z-0
                  before:content-[''] before:absolute before:top-[-30.5px] before:right-px before:w-8 before:h-8
                  before:rounded-br-[30px] before:shadow-[10px_10px_0_0_#F0F7FF]
                  after:content-[''] after:absolute after:bottom-[-30.5px] after:right-px after:w-8 after:h-8
                  after:rounded-tr-[30px] after:shadow-[10px_-10px_0_0_#F0F7FF]"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <div className="relative z-10 flex items-center transition-transform duration-150 active:scale-90">
              <div className="w-10 h-10 flex items-center justify-center shrink-0">
                <AccountIcon className={`transition-all duration-500 ${activeTab === 'account' ? 'text-MobileNav' : 'text-white'} ${isMinimized ? 'w-9 h-9' : 'w-7 h-7'}`} />
              </div>
              <span className={`font-bold transition-all duration-500 whitespace-nowrap overflow-hidden ${isMinimized ? 'w-0 opacity-0 ml-0' : 'w-auto opacity-100 ml-3 text-xl'}`}>
                Account
              </span>
            </div>
          </button>
        </div>
      </div>
    </nav>
  );
}
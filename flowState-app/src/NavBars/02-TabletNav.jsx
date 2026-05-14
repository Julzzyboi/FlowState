import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  DashboardIcon, 
  EducationIcon, 
  CommunityIcon, 
  HistoryIcon, 
  AccountIcon 
} from '../Icons';

const tabsTablet = [
  { id: 'dashboard', label: 'Dashboard', Icon: DashboardIcon },
  { id: 'education', label: 'Education', Icon: EducationIcon },
  { id: 'community', label: 'Community', Icon: CommunityIcon },
  { id: 'history', label: 'History', Icon: HistoryIcon },
];

export default function TabletNav({ activeTab, setActiveTab }) {
  return (
    <nav className="hidden md:flex lg:hidden flex-col w-24 bg-MobileNav h-screen sticky top-0 py-8 shadow-xl transition-all duration-500 overflow-visible">
      
      {/* Logo Section */}
      <div className="flex flex-col items-center mb-16 px-0">
        <button className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg transform active:scale-90 transition-all cursor-pointer hover:rotate-6">
          <span className="text-2xl text-MobileNav">💧</span>
        </button>
      </div>

      {/* Main Wrapper - isolate ensures z-index logic works cleanly */}
      <div className="flex flex-col flex-1 relative isolate overflow-visible">
        
        {/* Navigation Links */}
        <div className="flex flex-col gap-2 relative">
          {tabsTablet.map(({ id, Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`relative flex items-center justify-center w-full h-16 group outline-none cursor-pointer
                  ${isActive ? 'text-MobileNav' : 'text-white/80'}`}
              >
                {/* 1. THE SLIDING INDICATOR - Pins to the edge and slides smoothly */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicatorTablet"
                      className="absolute -right-1 inset-y-0 w-[calc(100%+4px)] bg-[#F0F7FF] rounded-l-full z-0
                        /* Top Scoop - Solid Shadow Match */
                        before:content-[''] before:absolute before:top-[-30.5px] before:right-px before:w-8 before:h-8
                        before:rounded-br-[30px] before:shadow-[10px_10px_0_0_#F0F7FF] 
                        /* Bottom Scoop - Solid Shadow Match */
                        after:content-[''] after:absolute after:bottom-[-30.5px] after:right-px after:w-8 after:h-8
                        after:rounded-tr-[30px] after:shadow-[10px_-10px_0_0_#F0F7FF]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </AnimatePresence>

                {/* 2. ICON CONTENT - Handles click scale and hover pop */}
                <div className={`
                  relative z-10 flex items-center justify-center transition-all duration-200 
                  active:scale-90 
                  ${!isActive && 'group-hover:text-cyan-400 group-hover:scale-110'}
                `}>
                  <div className="w-10 h-10 flex items-center justify-center shrink-0">
                    <Icon className={`transition-all duration-500 w-9 h-9 ${isActive ? 'text-MobileNav' : 'text-white'}`} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Account Link - Pushed to bottom */}
        <div className="mt-auto pb-8">
          <button
            onClick={() => setActiveTab('account')}
            className={`relative flex items-center justify-center w-full h-16 group outline-none cursor-pointer
              ${activeTab === 'account' ? 'text-MobileNav' : 'text-white/80'}`}
          >
            {activeTab === 'account' && (
              <motion.div
                layoutId="activeIndicatorTablet"
                className="absolute -right-1 inset-y-0 w-[calc(100%+4px)] bg-[#F0F7FF] rounded-l-full z-0
                  before:content-[''] before:absolute before:top-[-30.5px] before:right-px before:w-8 before:h-8
                  before:rounded-br-[30px] before:shadow-[10px_10px_0_0_#F0F7FF]
                  after:content-[''] after:absolute after:bottom-[-30.5px] after:right-px after:w-8 after:h-8
                  after:rounded-tr-[30px] after:shadow-[10px_-10px_0_0_#F0F7FF]"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <div className={`
              relative z-10 flex items-center justify-center transition-all duration-200 
              active:scale-90 
              ${activeTab !== 'account' && 'group-hover:text-cyan-400 group-hover:scale-110'}
            `}>
              <div className="w-10 h-10 flex items-center justify-center shrink-0">
                <AccountIcon className={`transition-all duration-500 w-9 h-9 ${activeTab === 'account' ? 'text-MobileNav' : 'text-white'}`} />
              </div>
            </div>
          </button>
        </div>
      </div>
    </nav>
  );
}
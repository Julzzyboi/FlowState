import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, LayoutGroup } from 'framer-motion';
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

export default function PCNav() {
  const [isMinimized, setIsMinimized] = useState(false);
  
  // ✨ Get the live location path from React Router
  const location = useLocation();

  return (
    <LayoutGroup id="sidebarNavigation">
      {/* Navbar Container */}
      <nav className={`hidden lg:flex ${isMinimized ? 'w-24' : 'w-64'} bg-MobileNav h-screen sticky top-0 z-10 flex-col py-8 transition-all duration-500 overflow-visible`}>
        
        {/* Logo Section */}
        <div className={`flex items-center mb-16 transition-all duration-500 relative z-30 ${isMinimized ? 'justify-center px-0' : 'px-6'}`}>
          <button 
            onClick={() => setIsMinimized(!isMinimized)}
            className={`w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg cursor-pointer active:scale-90 transition-all duration-500 
              ${isMinimized ? 'rotate-0' : '-rotate-12'}`}
          >
            <span className="text-2xl text-MobileNav">💧</span>
          </button>
          <h1 className={`text-white font-bold transition-all duration-500 whitespace-nowrap overflow-hidden ${isMinimized ? 'w-0 opacity-0' : 'w-auto opacity-100 ml-4 text-3xl'}`}>
            Flow<span className='italic text-[#46a4fe]'>State</span>
          </h1>
        </div>

        {/* Nav Wrapper */}
        <div className={`flex flex-col flex-1 relative transition-all duration-500 ${isMinimized ? 'ml-0' : 'ml-6'} overflow-visible`}>
          
          {/* Main Loop Tabs */}
          <div className="flex flex-col gap-2 relative">
            {tabsPC.map(({ id, label, Icon }) => {
              // ✨ BUG FIX: Check if the current URL starts with the tab's path segment.
              // This keeps 'community' highlighted even when the path shifts to '/community/pro_zone'
              const isActive = location.pathname.startsWith(`/${id}`);

              return (
                <Link
                  key={id}
                  to={`/${id}`}
                  className={`relative flex items-center w-full h-16 group outline-none cursor-pointer overflow-visible
                    ${isMinimized ? 'justify-center pl-0' : 'justify-start pl-4'}
                    ${isActive ? 'text-MobileNav' : 'text-white/80 hover:text-cyan-400'}`}
                >
                  {/* SLIDING INDICATOR */}
                  {isActive && (
                    <motion.div
                      layoutId="globalNavIndicator"
                      className="absolute -right-6.5 inset-y-0 w-[calc(100%+32px)] bg-Body rounded-l-full z-0
                        before:content-[''] before:absolute before:top-[-30.5px] before:right-6 before:w-8 before:h-8
                        before:rounded-br-[30px] before:shadow-[10px_10px_0_0_#EEF5FD] 
                        after:content-[''] after:absolute after:bottom-[-30.5px] after:right-6 after:w-8 after:h-8
                        after:rounded-tr-[30px] after:shadow-[10px_-10px_0_0_#EEF5FD]"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}

                  {/* CONTENT WRAPPER */}
                  <div className="relative z-30 flex items-center transition-transform duration-150 active:scale-90">
                    <div className="w-10 h-10 flex items-center justify-center shrink-0">
                      <Icon className={`transition-all duration-500 ${isActive ? 'text-MobileNav' : 'text-white'} ${isMinimized ? 'w-9 h-9' : 'w-7 h-7'}`} />
                    </div>
                    <span className={`font-bold transition-all duration-500 whitespace-nowrap overflow-hidden ${isMinimized ? 'w-0 opacity-0 ml-0' : 'w-auto opacity-100 ml-3 text-xl'}`}>
                      {label}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Account Button at Bottom */}
          <div className="mt-auto pb-8">
            {/* ✨ Update the active check for your separate account link too */}
            {(() => {
              const isAccountActive = location.pathname.startsWith('/account');
              return (
                <Link
                  to="/account"
                  className={`relative flex items-center w-full h-16 group outline-none cursor-pointer overflow-visible
                    ${isMinimized ? 'justify-center pl-0' : 'justify-start pl-4'}
                    ${isAccountActive ? 'text-MobileNav' : 'text-white/80 hover:text-cyan-400'}`}
                >
                  {isAccountActive && (
                    <motion.div
                      layoutId="globalNavIndicator"
                      className="absolute -right-6.5 inset-y-0 w-[calc(100%+32px)] bg-Body rounded-l-full z-0
                        before:content-[''] before:absolute before:top-[-30.5px] before:right-6 before:w-8 before:h-8
                        before:rounded-br-[30px] before:shadow-[10px_10px_0_0_#EEF5FD]
                        after:content-[''] after:absolute after:bottom-[-30.5px] after:right-6 after:w-8 after:h-8
                        after:rounded-tr-[30px] after:shadow-[10px_-10px_0_0_#EEF5FD]"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <div className="relative z-30 flex items-center transition-transform duration-150 active:scale-90">
                    <div className="w-10 h-10 flex items-center justify-center shrink-0">
                      <AccountIcon className={`transition-all duration-500 ${isAccountActive ? 'text-MobileNav' : 'text-white'} ${isMinimized ? 'w-9 h-9' : 'w-7 h-7'}`} />
                    </div>
                    <span className={`font-bold transition-all duration-500 whitespace-nowrap overflow-hidden ${isMinimized ? 'w-0 opacity-0 ml-0' : 'w-auto opacity-100 ml-3 text-xl'}`}>
                      Account
                    </span>
                  </div>
                </Link>
              );
            })()}
          </div>
        </div>
      </nav>
    </LayoutGroup>
  );
}
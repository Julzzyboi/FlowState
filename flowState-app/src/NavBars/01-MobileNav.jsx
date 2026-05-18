// src/Components/MobileNav.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { 
  DashboardIcon, 
  EducationIcon, 
  CommunityIcon, 
  HistoryIcon, 
  AccountIcon 
} from '../Icons';

export default function MobileNav() {
  const location = useLocation();
  
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', Icon: DashboardIcon },
    { id: 'education', label: 'Education', Icon: EducationIcon },
    { id: 'community', label: 'Community', Icon: CommunityIcon }, 
    { id: 'history', label: 'History', Icon: HistoryIcon },
    { id: 'account', label: 'Account', Icon: AccountIcon },
  ];

  return (
    <LayoutGroup id="mobileTabBarNavigation">
      {/* Target Mobile screens: flex by default, hidden completely on medium (md) and up */}
      <nav className="flex md:hidden fixed bottom-0 left-0 right-0 bg-MobileNav h-28 items-center justify-around px-4 rounded-t-[2.5rem] z-50 overflow-visible">
        {tabs.map(({ id, label, Icon }) => {
          const isActive = location.pathname.startsWith(`/${id}`);

          return (
            <Link
              key={id}
              to={`/${id}`}
              className="relative flex flex-col items-center justify-center w-16 group outline-none cursor-pointer"
            >
              {/* THE INDICATOR BUBBLE */}
              <div className="relative flex items-center justify-center w-20 h-20">
                <AnimatePresence mode="popLayout">
                  {isActive && (
                    <motion.div
                      layoutId="globalMobileBubbleIndicator"
                      className="absolute inset-0 bg-[#F0F7FF] rounded-full shadow-[0_15px_35px_rgba(0,0,0,0.4)] -translate-y-10 z-10"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                </AnimatePresence>

                {/* ICON CONTAINER */}
                <div className={`
                  relative z-20 flex items-center justify-center transition-all duration-500
                  ${isActive ? '-translate-y-10 scale-110' : 'scale-100 group-hover:scale-110'}
                `}>
                  <div className="w-10 h-10 flex items-center justify-center">
                    <Icon className={`transition-all duration-300 w-full h-full ${isActive ? 'text-MobileNav' : 'text-white'}`} />
                  </div>
                </div>
              </div>

              {/* TEXT LABEL */}
              <span
                className={`
                  absolute bottom-2 transition-all duration-500 text-sm font-bold tracking-wide z-20
                  ${isActive 
                    ? 'text-white opacity-100 translate-y-0' 
                    : 'text-white/40 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-2'}
                `}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
    </LayoutGroup>
  );
}
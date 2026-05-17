import React from 'react';
import { Link } from 'react-router-dom';
import { motion, LayoutGroup } from 'framer-motion';
import { 
  DashboardIcon, 
  EducationIcon, 
  CommunityIcon, 
  HistoryIcon, 
  AccountIcon 
} from '../Icons';

const tabsTablet = [
  { id: 'dashboard', Icon: DashboardIcon },
  { id: 'education', Icon: EducationIcon },
  { id: 'community', Icon: CommunityIcon },
  { id: 'history', Icon: HistoryIcon },
];

export default function TabletNav({ activeTab }) {
  return (
    <LayoutGroup id="tabletNavigation">
      {/* CHANGED: Dropped navbar frame depth wrapper context down to z-10 */}
      <nav className="hidden md:flex lg:hidden w-24 bg-MobileNav h-screen sticky top-0 z-10 flex-col py-8 items-center overflow-visible">
        
        {/* Logo Container */}
        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg mb-16 relative z-30">
          <span className="text-2xl text-MobileNav">💧</span>
        </div>

        {/* Nav Content Elements */}
        <div className="flex flex-col flex-1 w-full relative overflow-visible">
          <div className="flex flex-col gap-2 w-full relative">
            {tabsTablet.map(({ id, Icon }) => {
              const isActive = activeTab === id;
              return (
                <Link
                  key={id}
                  to={`/${id}`}
                  className={`relative flex items-center justify-center w-full h-16 group outline-none cursor-pointer overflow-visible
                    ${isActive ? 'text-MobileNav' : 'text-white/80 hover:text-cyan-400'}`}
                >
                  {/* CHANGED: Shifted indicator depths to z-0 and extended widths */}
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

                  {/* CHANGED: Set items content block to z-30 */}
                  <div className="relative z-30 w-10 h-10 flex items-center justify-center transition-transform duration-150 active:scale-90">
                    <Icon className={`transition-all duration-500 w-9 h-9 ${isActive ? 'text-MobileNav' : 'text-white'}`} />
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Separated Account Placement */}
          <div className="mt-auto w-full">
            <Link
              to="/account"
              className={`relative flex items-center justify-center w-full h-16 group outline-none cursor-pointer overflow-visible
                ${activeTab === 'account' ? 'text-MobileNav' : 'text-white/80 hover:text-cyan-400'}`}
            >
              {/* CHANGED: Adjusted account item layout coordinates */}
              {activeTab === 'account' && (
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
              
              {/* CHANGED: Set z-30 */}
              <div className="relative z-30 w-10 h-10 flex items-center justify-center transition-transform duration-150 active:scale-90">
                <AccountIcon className={`transition-all duration-500 w-9 h-9 ${activeTab === 'account' ? 'text-MobileNav' : 'text-white'}`} />
              </div>
            </Link>
          </div>
        </div>
      </nav>
    </LayoutGroup>
  );
}
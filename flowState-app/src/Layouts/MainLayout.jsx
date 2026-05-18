import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import PCNav from '../NavBars/03-PCNav';       
import TabletNav from '../NavBars/02-TabletNav';
import MobileNav from  '../NavBars/01-MobileNav';

// ✅ FIX 1: Accept 'user' as a prop from AppRouter
export default function MainLayout({ user }) {
  const location = useLocation();
  const currentTab = location.pathname.substring(1) || 'dashboard';

  return (
    /* Outer viewport wrapper frame uses the darker gradient/color */
    <div className="w-screen h-screen flex flex-col md:flex-row overflow-hidden bg-MobileNav">
      
      {/* 1. MOBILE TOP/BOTTOM NAVIGATION CONTAINER */}
      <div className="block md:hidden shrink-0 z-20">
        <MobileNav activeTab={currentTab} />
      </div>

      {/* 2. STATIONARY LEFT-SIDEBAR (Tablets & PCs) */}
      <div className="hidden md:block h-full shrink-0 relative z-20">
        <PCNav activeTab={currentTab} />
        <TabletNav activeTab={currentTab} />
      </div>

      {/* 3. RESTORED: THE ORIGINAL MAIN PORT CANVAS */}
      <main className="flex-1 h-full bg-Body md:rounded-l-[2.5rem] overflow-y-auto min-w-0 relative">
        {/* Your subpages (Dashboard, Community, etc.) render here */}
        
        {/* ✅ FIX 2: Pass the user into the outlet context as authUser */}
        <Outlet context={{ authUser: user }} />
      </main>

    </div>
  );
}
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import PCNav from '../NavBars/03-PCNav';       
import TabletNav from '../NavBars/02-TabletNav';
import MobileNav from  '../NavBars/01-MobileNav';

export default function MainLayout() {
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
      {/* CHANGED:
        - bg-Body: Sets the workspace panel background color back to your custom light gray/blue palette.
        - md:rounded-l-[2.5rem]: Restores the classic deep curve specifically along the left edge where it catches the sliding navigation indicator tabs!
        - Removed margin padding offsets so it expands flush against the top, bottom, and right edges of the display just like your photo.
      */}
      <main className="flex-1 h-full bg-Body md:rounded-l-[2.5rem] overflow-y-auto min-w-0 relative">
        {/* Your subpages (Dashboard, Community, etc.) render here */}
        <Outlet />
      </main>

    </div>
  );
}
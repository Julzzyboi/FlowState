import React from 'react';
import { Outlet, useLocation } from 'react-router-dom'; // Crucial imports
import MobileNav from '../NavBars/01-MobileNav';
import TabletNav from '../NavBars/02-TabletNav';
import PCNav from '../NavBars/03-PCNav';

export default function MainLayout() {
  const location = useLocation();
  
  // Magic: Strips '/dashboard' down to just 'dashboard' to use for your styling selectors
  const activeTab = location.pathname.split('/')[1] || 'dashboard';

  return (
    <div className="flex min-h-screen bg-MobileNav overflow-hidden">
      
      {/* 1. PC Navigation (Visible only on Desktop) */}
      <div className="hidden lg:flex">
        {/* We removed setActiveTab because standard Links handle that now */}
        <PCNav key="pc-nav" activeTab={activeTab} />
      </div>

      {/* 2. Tablet Navigation (Visible only on Tablet) */}
      <div className="hidden md:flex lg:hidden">
        <TabletNav key="tablet-nav" activeTab={activeTab} />
      </div>

      {/* 3. Main Content Area */}
      <main className="flex-1 bg-Body p-8 z-20 md:rounded-l-[2.7rem] relative ">
        <div className="max-w-6xl h-auto mx-auto ml-5 mt-10">
          <h2 className="text-4xl font-bold text-MobileNav capitalize tracking-tight">
            {activeTab}
          </h2>
          
          <div className="mt-10 p-10 bg-white rounded-3xl min-h-[60vh] shadow-sm">
            {/* --- THE OUTLET --- */}
            {/* This tag dynamically loads your individual page components */}
            <Outlet />
          </div>
        </div>
      </main>

      {/* 4. Mobile Navigation (Fixed at bottom) */}
      <div className="md:hidden">
        <MobileNav key="mobile-nav" activeTab={activeTab} />
      </div>

    </div>  
  );
}
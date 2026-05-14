import React, { useState } from 'react';
import MobileNav from './NavBars/01-MobileNav';
import TabletNav from './NavBars/02-TabletNav';
import PCNav from './NavBars/03-PCNav';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="flex min-h-screen bg-MobileNav overflow-hidden">
      
      {/* 1. PC Navigation (Visible only on Desktop) */}
      <div className="hidden lg:flex">
        <PCNav 
          key="pc-nav" 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />
      </div>

      {/* 2. Tablet Navigation (Visible only on Tablet) */}
      <div className="hidden md:flex lg:hidden">
        <TabletNav 
          key="tablet-nav" 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />
      </div>

      {/* 3. Main Content Area */}
      <main className="flex-1 bg-Body p-8 z-20 md:rounded-l-[2.7rem] relative">
        <div className="max-w-6xl h-auto mx-auto ml-5 mt-10">
          <h2 className="text-4xl font-bold text-MobileNav capitalize tracking-tight">
            {activeTab}
          </h2>
          
          <div className="mt-10 p-10 border-4 border-dashed border-blue-200 rounded-3xl min-h-[60vh] flex items-center justify-center text-blue-300 font-medium">
            Content for {activeTab} goes here...
          </div>
        </div>
      </main>

      {/* 4. Mobile Navigation (Fixed at bottom) */}
      <div className="md:hidden">
       <MobileNav
          key="mobile-nav" 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />
      </div>

    </div>  
  );
}
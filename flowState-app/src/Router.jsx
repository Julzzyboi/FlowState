import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './Firebase'; 

import MainLayout from './Layouts/MainLayout';
import DashboardPage from './Pages/01-Dashboard';
import EducationPage from './Pages/02-Education';
import CommunityPage from './Pages/03-Community'; 
import ChatPortal from './Components/Community/CommunityChatPortal'; 
import HistoryPage from './Pages/04-History';
import AccountPage from './Pages/05-Account';

import LandingPage from './Pages/Landing'; 
import AuthPage from './Pages/Auth';

export default function AppRouter() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f14] flex items-center justify-center text-white font-sans text-xs tracking-widest uppercase">
        <div className="w-6 h-6 border-2 border-[#46a4fe]/20 border-t-[#46a4fe] rounded-full animate-spin mr-3 inline-block" />
        Loading App Context...
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* =========================================================
            1. PUBLIC ACCESSIBLE OUT-OF-APP ROUTES (No Login Required)
           ========================================================= */}
        
        {/* Landing page shows up first for unauthenticated traffic */}
        <Route path="/" element={!user ? <LandingPage /> : <Navigate to="/dashboard" replace />} />
        
        {/* Explicit Route pointing to your Auth Page */}
        <Route path="/login" element={!user ? <AuthPage /> : <Navigate to="/dashboard" replace />} />

        {/* =========================================================
            2. PROTECTED INTERFACE LAYOUT (Requires Verified Session Auth)
           ========================================================= */}
        {user ? (
          <Route path="/" element={<MainLayout />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="education" element={<EducationPage />} />
            
            {/* 👥 Flattened Community Route Cluster */}
            <Route path="community" element={<CommunityPage />} />
            <Route path="community/:roomId" element={<ChatPortal />} />
            
            <Route path="history" element={<HistoryPage />} />
            <Route path="account" element={<AccountPage />} />
            
            {/* Catch-all safety fallback inside dashboard layout */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        ) : (
          /* Global fallback: If user attempts to guess a deep dashboard link while logged out, bounce to landing page */
          <Route path="*" element={<Navigate to="/" replace />} />
        )}
      </Routes>
    </Router>
  );
}
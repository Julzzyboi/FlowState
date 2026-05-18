import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './Firebase'; 

import MainLayout from './Layouts/MainLayout';
import DashboardPage from './Pages/01-Dashboard';
import EducationPage from './Pages/02-Education';
import CommunityPage from './Pages/03-Community'; 
import CommunityGrid from './Components/Community/CommunityGrid'; 
import ChatPortal from './Components/Community/CommunityChatPortal'; 
import HistoryPage from './Pages/04-History';
import AccountPage from './Pages/05-Account';
import AuthPage from './Pages/Auth'; 
import LandingPage from './Pages/Landing'; 

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
      <div className="min-h-screen bg-MobileNav flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* 🌐 PUBLIC PAGES */}
        <Route 
          path="/" 
          element={user ? <Navigate to="/dashboard" replace /> : <LandingPage />} 
        />
        
        <Route 
          path="/auth" 
          element={user ? <Navigate to="/dashboard" replace /> : <AuthPage />} 
        />

        {/* 🔐 PROTECTED APPLICATION SPACE */}
        {user ? (
          <Route path="/" element={<MainLayout />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="education" element={<EducationPage />} />
            
            {/* 👥 Nested Community Framework */}
            <Route path="community" element={<CommunityPage />}>
              <Route index element={<CommunityGrid />} />
              <Route path=":roomId" element={<ChatPortal />} />
            </Route>
            
            <Route path="history" element={<HistoryPage />} />
            <Route path="account" element={<AccountPage />} />
            
            {/* Logged-in catch-all redirect */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        ) : (
          /* Cleaned up: No extra curly braces here anymore! */
          <Route path="*" element={<Navigate to="/" replace />} />
        )}
      </Routes>
    </Router>
  );
}
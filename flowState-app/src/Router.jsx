import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase'; 

import MainLayout from './Layouts/MainLayout';
import DashboardPage from './Pages/01-Dashboard';
import EducationPage from './Pages/02-Education';
import CommunityPage from './Pages/03-Community';
import HistoryPage from './Pages/04-History';
import AccountPage from './Pages/05-Account';
import LandingPage from './Pages/TestLanding'; 
import LandingOfficial from './Pages/00-LandingPage';

export default function AppRouter() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simply observe auth state cleanly
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
        {!user ? (
          <Route path="*" element={<LandingOfficial />} />
        ) : (
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="education" element={<EducationPage />} />
            <Route path="community" element={<CommunityPage />} />
            <Route path="history" element={<HistoryPage />} />
            <Route path="account" element={<AccountPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        )}
      </Routes>
    </Router>
  );
}
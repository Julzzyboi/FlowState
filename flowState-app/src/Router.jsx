import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './Layouts/MainLayout';
import DashboardPage from './Pages/01-Dashboard';
import EducationPage from './Pages/02-Education';
import CommunityPage from './Pages/03-Community';
import HistoryPage from './Pages/04-History';
import AccountPage from './Pages/05-Account';




export default function AppRouter() {
  return (
    <Router>    
      <Routes>
        {/* MainLayout acts as the persistent frame around our pages */}
        <Route path="/" element={<MainLayout />}>
          
          {/* Automatically forward the base path to our dashboard */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          
          {/* Inner pages render directly inside MainLayout's <Outlet /> */}
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="education" element={<EducationPage />} />
          <Route path="community" element={<CommunityPage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="account" element={<AccountPage />} />
          
          {/* Absolute safe fallback wrapper */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}
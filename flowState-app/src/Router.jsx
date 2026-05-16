import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './Layouts/MainLayout';

// Placeholder views (Swap these with your actual page files later)
const DashboardPage = () => <div className="text-2xl font-bold text-slate-700">Dashboard View Dashboard Metrics Here</div>;
const EducationPage = () => <div className="text-2xl font-bold text-slate-700">Education View View Lessons Here</div>;
const CommunityPage = () => <div className="text-2xl font-bold text-slate-700">Community View Join Discussions Here</div>;
const HistoryPage = () => <div className="text-2xl font-bold text-slate-700">History View Track Submissions Here</div>;
const AccountPage = () => <div className="text-2xl font-bold text-slate-700">Account Settings Profile Configuration</div>;

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
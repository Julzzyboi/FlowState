import React from 'react';
import { auth } from '../Firebase'; // Import your app auth controller
import { signOut } from 'firebase/auth';

export default function AccountPage() {
  const currentUser = auth.currentUser;

  const handleLogout = async () => {
    try {
      // 1. Clears the browser session cookie and signs out of Firebase
      await signOut(auth);
      console.log("User logged out successfully!");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <div className="p-6 max-w-xl bg-white rounded-4xl shadow-sm border border-slate-100 mt-4">
      <h3 className="text-2xl font-bold text-slate-800 mb-6">Profile Settings</h3>
      
      {currentUser ? (
        <div className="flex flex-col gap-6">
          {/* User Info Header */}
          <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
            {currentUser.photoURL ? (
              <img 
                src={currentUser.photoURL} 
                alt="Profile" 
                className="w-16 h-16 rounded-full border-2 border-[#46a4fe] shadow-sm"
                referrerPolicy="no-referrer" // Prevents Google from blocking image rendering
              />
            ) : (
              <div className="w-16 h-16 bg-[#46a4fe] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {currentUser.displayName ? currentUser.displayName[0] : 'U'}
              </div>
            )}
            <div>
              <h4 className="font-bold text-slate-800 text-lg">{currentUser.displayName || 'FlowState User'}</h4>
              <p className="text-sm text-gray-500 font-medium">{currentUser.email}</p>
            </div>
          </div>

          {/* Account Details Metadata */}
          <div className="space-y-3 text-sm text-slate-600 px-2">
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="font-medium text-gray-400">Account ID</span>
              <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-700 select-all">{currentUser.uid}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="font-medium text-gray-400">Created At</span>
              <span>{new Date(currentUser.metadata.creationTime).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Logout Trigger Button */}
          <button
            onClick={handleLogout}
            className="w-full mt-4 px-6 py-4 bg-red-50 text-red-600 font-bold rounded-2xl shadow-sm border border-red-100 hover:bg-red-100 active:scale-[0.98] transition-all cursor-pointer text-center"
          >
            Sign Out of FlowState
          </button>
        </div>
      ) : (
        <p className="text-gray-400">No active user session detected.</p>
      )}
    </div>
  );
}
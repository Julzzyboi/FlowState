import React, { useState } from 'react'
import { auth } from '../Firebase'
import { signOut } from 'firebase/auth'

export default function AccountPage() {
  const currentUser = auth.currentUser

  // State to manage user bio text and editing mode
  const [isEditing, setIsEditing] = useState(false)
  const [bioText, setBioText] = useState(
    "Product Designer who focuses on simplicity & usability. Passionate about clean water access and building impact-driven community initiatives."
  )

  const handleLogout = async () => {
    try {
      await signOut(auth)
      console.log('User logged out successfully!')
    } catch (error) {
      console.error('Error signing out: ', error)
    }
  }

  const providerName =
    currentUser?.providerData?.[0]?.providerId === 'google.com'
      ? 'Google Account'
      : 'Email Account'

  // Placeholder metrics data
  const stats = {
    waterLitersYear: 1450,
    communitiesJoined: 8,
    sanitizationAchievements: 12
  }

  return (
    <div className="w-full min-h-screen p-4 sm:p-8 bg-slate-50/50">
      {/* MAIN CONTAINER */}
      <div className="w-full min-h-[85vh] bg-white rounded-[34px] border border-slate-200 shadow-xs p-6 sm:p-8 flex flex-col max-w-7xl mx-auto">
        
        {/* TOP HEADER */}
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-100 pb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Account Settings
            </h1>
            <p className="text-slate-500 mt-1 text-sm">
              Manage your FlowState profile, session parameters, and metrics history.
            </p>
          </div>

          <div className="px-4 py-1.5 rounded-xl bg-blue-50 border border-blue-100 shrink-0">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              {providerName}
            </span>
          </div>
        </div>

        {currentUser ? (
          <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8 mt-8 flex-1 items-stretch">
            
            {/* INSPIRATION CARD COMPONENT (LEFT SIDEBAR) */}
            <div className="bg-white rounded-[30px] border border-slate-200/80 shadow-xs overflow-hidden flex flex-col h-fit">
              {/* Card Banner Sky */}
              <div className="h-32 bg-linear-to-b from-blue-200 to-blue-100 w-full relative">
                <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-xs px-3 py-1 rounded-full text-[10px] font-bold text-slate-600">
                  Active User
                </div>
              </div>

              {/* Card Content Wrapper */}
              <div className="px-6 pb-6 pt-0 flex flex-col items-center text-center relative flex-1">
                {/* Overlapping Rounded Avatar */}
                <div className="relative -mt-14 mb-4">
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt="Profile Avatar"
                      className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-[#46a4fe] border-4 border-white flex items-center justify-center text-white text-3xl font-extrabold shadow-md">
                      {currentUser.displayName ? currentUser.displayName[0] : 'U'}
                    </div>
                  )}
                  <div className="absolute inset-0 rounded-full border border-slate-900/5 pointer-events-none" />
                </div>

                {/* Profile Identity Text */}
                <h2 className="text-xl font-black text-slate-800 tracking-tight">
                  {currentUser.displayName || 'Noah Thompson'}
                </h2>
                <p className="text-slate-400 text-xs mt-1 font-medium max-w-60 truncate">
                  {currentUser.email}
                </p>

                {/* Inline Stats Row Integration */}
                <div className="w-full grid grid-cols-2 bg-slate-50/80 border border-slate-100 rounded-2xl p-3.5 mt-6 gap-2">
                  <div className="flex flex-col text-center border-r border-slate-200/60">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Joined</span>
                    <span className="text-xs font-bold text-slate-700 mt-0.5">
                      {currentUser.metadata.creationTime
                        ? new Date(currentUser.metadata.creationTime).toLocaleDateString(undefined, {
                            month: 'short',
                            year: 'numeric'
                          })
                        : 'N/A'}
                    </span>
                  </div>
                  <div className="flex flex-col text-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Contact</span>
                    <span className="text-xs font-bold text-slate-700 mt-0.5 truncate px-1">
                      {currentUser.phoneNumber || 'Not Linked'}
                    </span>
                  </div>
                </div>

                {/* LOGOUT BUTTON ACTION */}
                <button
                  onClick={handleLogout}
                  className="mt-8 w-full px-6 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 font-bold text-xs uppercase tracking-wider hover:bg-red-100 transition-all active:scale-[0.98] cursor-pointer"
                >
                  Logout
                </button>
              </div>
            </div>

            {/* RIGHT MAIN PANEL CONTENT */}
            <div className="flex flex-col h-full gap-6">
              
              {/* CARD METRICS HUB ROWS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* METRIC 1: WATER COUNTER */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-3xs hover:border-blue-200 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-bold text-[11px] uppercase tracking-wider">Annual Consumption</span>
                      <span className="text-lg">💧</span>
                    </div>
                    <h3 className="mt-4 font-black text-3xl text-slate-800 tracking-tight">
                      {stats.waterLitersYear.toLocaleString()} <span className="text-xs font-bold text-slate-400 uppercase font-sans">Liters</span>
                    </h3>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-3 border-t border-slate-50 pt-2">Overall clean water processed this year</p>
                </div>

                {/* METRIC 2: COMMUNITIES COUNTER */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-3xs hover:border-purple-200 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-bold text-[11px] uppercase tracking-wider">Network Hubs</span>
                      <span className="text-lg">🌍</span>
                    </div>
                    <h3 className="mt-4 font-black text-3xl text-slate-800 tracking-tight">
                      {stats.communitiesJoined} <span className="text-xs font-bold text-slate-400 uppercase font-sans">Joined</span>
                    </h3>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-3 border-t border-slate-50 pt-2">Active channels and cluster affiliations</p>
                </div>

                {/* METRIC 3: SANITIZATION COUNTER */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-3xs hover:border-emerald-200 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-bold text-[11px] uppercase tracking-wider">Sanitization Targets</span>
                      <span className="text-lg">✨</span>
                    </div>
                    <h3 className="mt-4 font-black text-3xl text-slate-800 tracking-tight">
                      {stats.sanitizationAchievements} <span className="text-xs font-bold text-slate-400 uppercase font-sans">Badges</span>
                    </h3>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-3 border-t border-slate-50 pt-2">Verified sanitation checklist actions</p>
                </div>
              </div>

              {/* DASHBOARD CONTENT */}
              <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_320px] gap-6 mt-8">

                {/* RECENT ACTIVITY */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6 flex flex-col">

                  <h4 className="text-xl font-bold text-slate-800">

                    Recent Activity

                  </h4>

                  <div className="mt-6 flex flex-col gap-5">

                    <div className="flex items-start gap-4">

                      <div className="w-3 h-3 rounded-full bg-green-500 mt-2" />

                      <div>

                        <p className="font-semibold text-slate-700">

                          Logged in successfully

                        </p>

                        <span className="text-sm text-slate-400">

                          Active Firebase session detected

                        </span>

                      </div>

                    </div>

                    <div className="flex items-start gap-4">

                      <div className="w-3 h-3 rounded-full bg-blue-500 mt-2" />

                      <div>

                        <p className="font-semibold text-slate-700">

                          Google Account Connected

                        </p>

                        <span className="text-sm text-slate-400">

                          Authentication synced securely

                        </span>

                      </div>

                    </div>

                  </div>

                  {isEditing ? (
                    <div className="space-y-3">
                      <textarea
                        value={bioText}
                        onChange={(e) => setBioText(e.target.value)}
                        rows={4}
                        maxLength={250}
                        className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-slate-700 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                        placeholder="Write a little bit about yourself..."
                      />
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] text-slate-400 font-medium">
                          {bioText.length}/250 characters
                        </span>
                        <button
                          onClick={() => setIsEditing(false)}
                          className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 transition-all cursor-pointer shadow-3xs"
                        >
                          Save Description
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-600 leading-relaxed text-sm max-w-3xl italic bg-white/40 p-4 rounded-2xl border border-slate-100">
                      "{bioText || 'No description provided yet. Click edit to customize your profile summary!'}"
                    </p>
                  )}
                </div>

                {/* SIDE INFO */}
                <div className="flex flex-col gap-5">

                  <div className="bg-white border border-slate-100 rounded-3xl p-6">

                    <p className="text-slate-400 text-sm">
                      Account Type
                    </p>

                    <h4 className="mt-3 font-bold text-xl text-slate-800">

                      {providerName}

                    </h4>

                  </div>

                  <div className="bg-white border border-slate-100 rounded-3xl p-6">

                    <p className="text-slate-400 text-sm">
                      Authentication
                    </p>

                    <h4 className="mt-3 font-bold text-xl text-green-600">

                      Secure Login

                    </h4>

                  </div>

                  <div className="bg-white border border-slate-100 rounded-3xl p-6">

                    <p className="text-slate-400 text-sm">
                      Session Status
                    </p>

                    <h4 className="mt-3 font-bold text-xl text-[#2563eb]">

                      Active Session

                    </h4>

                  </div>

                </div>

              </div>

            </div>
          </div>
        ) : (
          <div className="mt-8 bg-slate-50 border border-slate-100 rounded-3xl p-8 text-center">
            <p className="text-slate-400 font-medium text-sm">
              No active session infrastructure found. Please sign in to verify.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
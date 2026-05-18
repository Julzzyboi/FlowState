// src/Pages/Account.jsx

import React from 'react'
import { auth } from '../Firebase'
import { signOut } from 'firebase/auth'

export default function AccountPage() {

  const currentUser = auth.currentUser

  const handleLogout = async () => {
    try {

      await signOut(auth)

      console.log(
        'User logged out successfully!'
      )

    } catch (error) {

      console.error(
        'Error signing out: ',
        error
      )

    }
  }

  const providerName =
    currentUser?.providerData?.[0]
      ?.providerId === 'google.com'
      ? 'Google Account'
      : 'Email Account'

  return (
    <div className="w-full min-h-screen p-8">

      {/* MAIN CONTAINER */}
      <div className="w-full min-h-[85vh] bg-white rounded-[34px] border border-slate-200 shadow-sm p-8 flex flex-col">

        {/* TOP HEADER */}
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-100 pb-6">

          <div>

            <h1 className="text-4xl font-bold text-slate-800">
              Account Settings
            </h1>

            <p className="text-slate-500 mt-2 text-sm">
              Manage your FlowState profile and session information.
            </p>

          </div>

          <div className="px-5 py-2 rounded-2xl bg-[#eff6ff] border border-[#bfdbfe]">

            <span className="text-sm font-semibold text-[#2563eb]">

              {providerName}

            </span>

          </div>

        </div>

        {currentUser ? (

          <div className="grid grid-cols-1 xl:grid-cols-[340px_1fr] gap-8 mt-8 flex-1 items-stretch">

            {/* LEFT PROFILE SIDEBAR */}
            <div className="bg-slate-50 rounded-[30px] border border-slate-100 p-6 flex flex-col">

              <div className="flex flex-col items-center text-center">

                {currentUser.photoURL ? (

                  <img
                    src={currentUser.photoURL}
                    alt="Profile"
                    className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover"
                    referrerPolicy="no-referrer"
                  />

                ) : (

                  <div className="w-32 h-32 rounded-full bg-[#46a4fe] flex items-center justify-center text-white text-5xl font-bold shadow-md">

                    {currentUser.displayName
                      ? currentUser.displayName[0]
                      : 'U'}

                  </div>

                )}

                <h2 className="mt-6 text-3xl font-bold text-slate-800 leading-tight">

                  {currentUser.displayName ||
                    'FlowState User'}

                </h2>

                <p className="text-slate-500 text-sm mt-2 break-all">

                  {currentUser.email}

                </p>

              </div>

              {/* ACCOUNT META */}
              <div className="mt-8 bg-white rounded-3xl border border-slate-100 p-5 flex flex-col gap-5">

                <div className="flex items-center justify-between">

                  <span className="text-slate-400 text-sm">
                    Joined
                  </span>

                  <span className="font-semibold text-slate-700 text-sm">

                    {new Date(
                      currentUser.metadata.creationTime
                    ).toLocaleDateString()}

                  </span>

                </div>

                <div className="border-t border-slate-100" />

                <div className="flex items-center justify-between">

                  <span className="text-slate-400 text-sm">
                    Last Login
                  </span>

                  <span className="font-semibold text-slate-700 text-sm">

                    {new Date(
                      currentUser.metadata.lastSignInTime
                    ).toLocaleDateString()}

                  </span>

                </div>

                <div className="border-t border-slate-100" />

                <div className="flex items-center justify-between">

                  <span className="text-slate-400 text-sm">
                    Email Status
                  </span>

                  <span
                    className={`text-sm font-semibold ${
                      currentUser.emailVerified
                        ? 'text-green-600'
                        : 'text-red-500'
                    }`}
                  >

                    {currentUser.emailVerified
                      ? 'Verified'
                      : 'Not Verified'}

                  </span>

                </div>

              </div>

              {/* SIGN OUT */}
              <button
                onClick={handleLogout}
                className="mt-auto w-full px-6 py-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 font-bold hover:bg-red-100 transition-all active:scale-[0.98]"
              >

                Sign Out of FlowState

              </button>

            </div>

            {/* RIGHT DASHBOARD */}
            <div className="bg-slate-50 rounded-[30px] border border-slate-100 p-8 flex flex-col h-full">

              {/* OVERVIEW */}
              <div>

                <h3 className="text-3xl font-bold text-slate-800">
                  Profile Overview
                </h3>

                <p className="mt-3 text-slate-500 leading-8 text-sm max-w-3xl">

                  Your FlowState account is securely
                  connected using Firebase Authentication.
                  Your profile information syncs
                  automatically from your login provider.

                </p>

              </div>

              {/* OVERVIEW CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">

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

              {/* EXTRA SECTIONS */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8 flex-1">

                {/* ACTIVITY */}
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

                </div>

                {/* SECURITY */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6 flex flex-col">

                  <h4 className="text-xl font-bold text-slate-800">

                    Security Overview

                  </h4>

                  <div className="mt-6 space-y-5">

                    <div className="flex items-center justify-between">

                      <span className="text-slate-500">

                        Email Verification

                      </span>

                      <span className="font-semibold text-green-600">

                        Enabled

                      </span>

                    </div>

                    <div className="border-t border-slate-100" />

                    <div className="flex items-center justify-between">

                      <span className="text-slate-500">

                        Authentication Provider

                      </span>

                      <span className="font-semibold text-slate-700">

                        Google OAuth

                      </span>

                    </div>

                    <div className="border-t border-slate-100" />

                    <div className="flex items-center justify-between">

                      <span className="text-slate-500">

                        Account Protection

                      </span>

                      <span className="font-semibold text-[#2563eb]">

                        Secure

                      </span>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        ) : (

          <div className="mt-8 bg-slate-50 border border-slate-100 rounded-3xl p-8">

            <p className="text-slate-400">

              No active user session detected.

            </p>

          </div>

        )}

      </div>

    </div>
  )
}
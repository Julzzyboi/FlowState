import React, { useState } from 'react';
import { auth, db, googleProvider } from '../Firebase';
import { signInWithPopup } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function AuthPage() {
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Central Database Profile Syncer
  const saveUserProfileToFirestore = async (user) => {
    try {
      const userRef = doc(db, "userProfiles", user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        displayName: user.displayName || "Google Node",
        email: user.email, 
        photoURL: user.photoURL || null,
        lastLogin: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      console.error("Firestore DB Error:", error);
    }
  };

  // Google Single Sign-On Flow
  const handleGoogleAuth = async () => {
    setErrorMessage('');
    setLoading(true);
    try {
      googleProvider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, googleProvider);
      await saveUserProfileToFirestore(result.user);
    } catch (error) {
      console.error("Google Auth Error:", error);
      if (error.code !== 'auth/popup-closed-by-user') {
        setErrorMessage(error.message.replace("Firebase: ", ""));
      }
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-MobileNav font-sans antialiased px-4 relative">
      
      {/* 💧 Loading Intercept Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-md z-50 flex flex-col items-center justify-center gap-4">
          {/* Custom CSS Smooth Spinning Loading Ring */}
          <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-slate-600 text-xs font-bold uppercase tracking-widest animate-pulse">
            Securely Syncing Profile...
          </p>
        </div>
      )}

      {/* 🏛️ Material Design Identity Container */}
      <div className="w-full max-w-[448px] bg-white border border-slate-200 rounded-lg p-6 sm:p-10 shadow-sm transition-all duration-200">
        
        {/* App Branding Header Layout */}
        <div className="flex flex-col items-center text-center mb-8">
          {/* App Emblem */}
          <div className="w-10 h-10 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center mb-4 text-xl">
            🌊
          </div>
          <h1 className="text-2xl font-normal text-slate-900 tracking-tight mb-2">
            Sign in to <span className="font-semibold text-blue-600">FlowState</span>
          </h1>
          <p className="text-slate-500 text-sm">
            to continue to your personal dashboard workspace
          </p>
        </div>

        {/* Error Feedback Message Box */}
        {errorMessage && (
          <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-xs text-left font-medium flex items-start gap-2">
            <span className="shrink-0 mt-0.5">⚠️</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 🎯 Official-Spec Google Single-Action Portal */}
        <div className="py-4">
          <button 
            type="button" 
            onClick={handleGoogleAuth} 
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-white text-slate-700 hover:bg-slate-50 active:bg-slate-100 font-medium px-6 py-2.5 rounded-full border border-slate-300 shadow-2xs hover:shadow-xs transition-all text-sm cursor-pointer select-none outline-hidden focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
          >
            {/* Precise Multi-Color Path Geometry Vector Logo */}
            <svg className="w-[18px] h-[18px] shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
            <span className="font-semibold tracking-wide">Sign in with Google</span>
          </button>
        </div>

        {/* Identity Disclaimer Legal Footnotes */}
        <p className="text-center mt-6 text-xs text-slate-400 font-normal px-2 leading-relaxed">
          Secured with end-to-end Firebase Identity management. By signing in, your data configuration initializes automatically.
        </p>

      </div>

      {/* Auxiliary Help Links Bar */}
      <div className="w-full max-w-[448px] flex justify-between px-4 mt-4 text-xs text-slate-500 font-normal">
        <span className="hover:text-slate-800 cursor-pointer transition">Privacy Policy</span>
        <span className="hover:text-slate-800 cursor-pointer transition">Terms of Service</span>
      </div>
    </div>
  );
}
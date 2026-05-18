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
      console.log("Data saved securely to Firestore!");
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
      
      // Only show an explicit alert banner if they didn't close it on purpose
      if (error.code !== 'auth/popup-closed-by-user') {
        setErrorMessage(error.message.replace("Firebase: ", ""));
      }
      
      // 🟢 FIXED: This is now outside the if block, killing the loader immediately if closed!
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#1e2b3a] text-white px-4 relative overflow-hidden font-sans">
      
      {/* Premium Ambient Background Accents */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#46a4fe]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Modern, Premium Loading Intercept Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-[#0b0f14]/80 backdrop-blur-md z-50 flex flex-col items-center justify-center gap-4 animate-fadeIn">
          <div className="w-10 h-10 border-[3px] border-[#46a4fe]/20 border-t-[#46a4fe] rounded-full animate-spin" />
          <p className="text-slate-400 text-xs font-semibold tracking-[0.15em] uppercase animate-pulse">
            Syncing Profile Metrics
          </p>
        </div>
      )}

      {/* Main Authentication Card */}
      <div className="w-full max-w-105 bg-[#11161d] p-8 sm:p-10 rounded-4xl border border-white/6 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] z-10 transition-all">
        
        {/* Brand Identity Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <h1 className="text-2xl font-black text-white tracking-tight sm:text-3xl">
            Flow<span className="text-[#46a4fe] italic">State</span>
          </h1>
          
          <p className="text-slate-400 mt-2 text-xs sm:text-sm font-medium max-w-70 leading-relaxed">
            Access your unified workspace instantly via single sign-on.
          </p>
        </div>

        {/* Dynamic Exception Handler Message Banner */}
        {errorMessage && (
          <div className="mb-6 p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs text-center font-semibold leading-relaxed animate-fadeIn">
            ⚠️ {errorMessage}
          </div>
        )}

        {/* Pure Single Action Portal: Modern Google Button Style */}
        <button 
          type="button" 
          onClick={handleGoogleAuth} 
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-900 font-bold px-6 h-13 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_4px_20px_rgba(250,250,250,0.1)] active:scale-[0.98] transition-all text-xs uppercase tracking-wider cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
          </svg>
          Continue with Google
        </button>

        {/* Informational Security Footer Anchor */}
        <div className="mt-8 pt-6 border-t border-white/4 text-center">
          <p className="text-[11px] text-slate-500 font-medium px-2 leading-relaxed">
            Secured by Firebase Identity. Your dashboard metrics populate automatically upon connection completion.
          </p>
        </div>

      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { auth, db, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function LandingPage() {
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
      if (error.code !== 'auth/popup-closed-by-user') {
        setErrorMessage(error.message.replace("Firebase: ", ""));
      }
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-MobileNav text-white px-4 relative">
      
      {/* Loading Intercept Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex flex-col items-center justify-center gap-3">
          <span className="text-5xl animate-bounce">💧</span>
          <p className="text-[#46a4fe] text-sm font-bold uppercase tracking-widest animate-pulse">
            Syncing Profile Metrics...
          </p>
        </div>
      )}

      <div className="w-full max-w-md bg-white/5 p-10 rounded-[2.5rem] backdrop-blur-md border border-white/10 shadow-2xl">
        
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-6">
          <span className="text-3xl">💧</span>
        </div>
        
        <h1 className="text-4xl font-extrabold mb-2 text-center tracking-tight">
          Flow<span className="text-[#46a4fe]">State</span>
        </h1>
        
        <p className="text-white/50 mb-8 text-center text-sm">
          Access your interface instantly using your secure Google account.
        </p>

        {errorMessage && (
          <div className="mb-6 p-3 bg-red-500/20 border border-red-500/30 text-red-200 rounded-xl text-sm text-center font-medium">
            {errorMessage}
          </div>
        )}

        {/* Pure Single Action Portal */}
        <button 
          type="button" 
          onClick={handleGoogleAuth} 
          className="w-full flex items-center justify-center gap-3 bg-white text-slate-800 font-bold px-6 py-4 rounded-xl shadow-xl hover:bg-slate-100 active:scale-95 transition-all text-base cursor-pointer"
        >
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.227C18.214 1.594 15.485 1 12.24 1 6.056 1 1 .6 1 6.056s5.056 11 11.24 11c6.458 0 10.766-4.509 10.766-10.959 0-.738-.078-1.3-.176-1.812H12.24z"/>
          </svg>
          Continue with Google
        </button>

        <p className="text-center mt-8 text-xs text-white/30 font-medium px-4 leading-relaxed">
          Secured by Firebase Identity. Your dashboard profile transitions automatically upon credential authentication.
        </p>

      </div>
    </div>
  );
}
import React, { useState, useEffect } from "react";
import { auth } from "../Firebase";

export default function DashboardPage() {
  const [authUser, setAuthUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  
  // Interaction Input States
  const [customMessage, setCustomMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [statusFeedback, setStatusFeedback] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setAuthUser(user);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleEmailSubmission = async (e) => {
    e.preventDefault();
    if (!customMessage.trim() || !authUser?.email) return;

    setIsSending(true);
    setStatusFeedback("Contacting node delivery relay...");

    try {
      const response = await fetch("http://localhost:5000/api/send-dashboard-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: authUser.email,
          userName: authUser.displayName || "User Account",
          messageText: customMessage.trim()
        }),
      });

      const result = await response.json();

      if (result.success) {
        setStatusFeedback("📨 Success! Check your Gmail inbox.");
        setCustomMessage(""); // Clean out input box
      } else {
        setStatusFeedback(`❌ Server Refusal: ${result.error}`);
      }
    } catch (error) {
      setStatusFeedback("❌ Transmission failed. Is your node server listening on port 4000?");
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };

  if (authLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center min-h-[40vh] animate-pulse">
        <p className="text-xs font-bold tracking-widest text-slate-400 uppercase">Mounting Dashboard Console...</p>
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="w-full h-full flex items-center justify-center p-6 min-h-[40vh]">
        <div className="bg-white border p-8 rounded-3xl max-w-sm text-center shadow-md">
          <span className="text-2xl">🔒</span>
          <h2 className="text-xs font-black text-slate-800 mt-2 uppercase tracking-wider">Session Guard</h2>
          <p className="text-xs text-slate-400 mt-1">Please sign in to your authenticated profile to open your control desk tools.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full max-w-2xl mx-auto text-slate-800 flex flex-col gap-6 animate-fadeIn">
      
      {/* SECTION BANNER TITLE */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          User <span className="text-[#46a4fe]">Dashboard</span>
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">
          Trigger transactional email events across system parameters.
        </p>
      </div>

      {/* CORE CONTROL CONTAINER CARD */}
      <div className="bg-white border border-slate-200 rounded-4xl p-6 sm:p-8 shadow-sm">
        <div className="mb-6">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">Manual Email Engine</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Target Mailbox Destination: <span className="font-mono text-[#46a4fe] font-bold">{authUser.email}</span>
          </p>
        </div>

        <form onSubmit={handleEmailSubmission} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Custom Message Payload</label>
            <textarea
              required
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Write a message here to text blast your personal email mailbox inbox..."
              rows={4}
              disabled={isSending}
              className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-xs outline-none focus:border-[#46a4fe] focus:bg-white transition-all resize-none font-medium leading-relaxed text-slate-800 shadow-inner"
            />
          </div>

          <button
            type="submit"
            disabled={isSending || !customMessage.trim()}
            className="w-full bg-[#46a4fe] text-white font-extrabold h-12 rounded-2xl text-xs uppercase tracking-widest shadow-md shadow-[#46a4fe]/20 hover:bg-[#3894eb] transition-all active:scale-[0.99] disabled:bg-slate-150 disabled:text-slate-400 disabled:shadow-none disabled:scale-100 cursor-pointer flex items-center justify-center"
          >
            {isSending ? "Dispatching Relay..." : "✉️ Push Email Notification"}
          </button>

          {/* STATUS SYSTEM BOX REPLIES */}
          {statusFeedback && (
            <div className={`p-3 text-center text-xs font-bold rounded-xl border transition-all animate-fadeIn ${
              statusFeedback.includes("❌") 
                ? "bg-red-50 text-red-600 border-red-100" 
                : "bg-blue-50 text-[#46a4fe] border-blue-100"
            }`}>
              {statusFeedback}
            </div>
          )}
        </form>
      </div>

    </div>
  );
}
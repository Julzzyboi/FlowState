import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';

export default function CommunityPage() {
  const [posts, setPosts] = useState([]);
  const [postContent, setPostContent] = useState('');
  const [roomTag, setRoomTag] = useState(''); // Optional promo anchor for a group chat room
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const currentUser = auth.currentUser;

  // 1. Fetch all community posts from the Express backend server
  const fetchFeed = async () => {
    try {
      // Points to your backend server running on port 5000
      const response = await fetch('http://localhost:5000/api/community/posts');
      const data = await response.json();
      if (data.success) {
        setPosts(data.posts);
      }
    } catch (error) {
      console.error("Failed to sync community feed:", error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  // 2. Handle publishing a post payload
  const handlePublishPost = async (e) => {
    e.preventDefault();
    if (!postContent.trim() || !currentUser) return;

    setLoading(true);

    const postPayload = {
      uid: currentUser.uid,
      displayName: currentUser.displayName || currentUser.email.split('@')[0],
      email: currentUser.email,
      content: postContent,
      promotedRoom: roomTag.trim() || null // Ties a group room promo tag if filled out
    };

    try {
      const response = await fetch('http://localhost:5000/api/community/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postPayload)
      });

      const data = await response.json();
      if (data.success) {
        setPostContent('');
        setRoomTag('');
        fetchFeed(); // Refresh the feed array instantly
      }
    } catch (error) {
      console.error("Transmission error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto text-slate-800 min-h-screen">
      
      {/* Page Header Headers */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Community <span className="text-[#46a4fe]">Billboard</span>
        </h1>
        <p className="text-slate-500 text-xs mt-1">
          Share micro-updates, publish announcements, or promote group chat rooms below.
        </p>
      </div>

      {/* CREATE POST BOX PANEL */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm mb-8">
        <form onSubmit={handlePublishPost} className="flex flex-col gap-3">
          <textarea
            required
            rows="3"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            placeholder="Share a project update or announce a community space..."
            className="w-full bg-slate-50 border border-slate-200 focus:bg-white px-4 py-3 rounded-2xl text-sm outline-none focus:border-[#46a4fe] transition-all resize-none text-slate-800 placeholder-slate-400"
          />
          
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            {/* Optional Room Promo Input Field */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl flex-1 max-w-sm">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0">🏠 Room Tag:</span>
              <input 
                type="text"
                value={roomTag}
                onChange={(e) => setRoomTag(e.target.value)}
                placeholder="e.g., TypeScript Devs (Optional)"
                className="bg-transparent w-full outline-none text-xs text-slate-700 placeholder-slate-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !postContent.trim()}
              className="bg-[#46a4fe] hover:bg-cyan-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs tracking-wide uppercase transition-all shadow-md disabled:opacity-40 cursor-pointer"
            >
              {loading ? "Publishing..." : "Post Announcement"}
            </button>
          </div>
        </form>
      </div>

      {/* TIMELINE SOCIAL FEED */}
      <div className="flex flex-col gap-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
          Recent Activity Logs
        </h3>

        {fetching ? (
          <p className="text-center text-slate-400 text-xs py-10 animate-pulse">Syncing timeline arrays...</p>
        ) : posts.length === 0 ? (
          <div className="text-center bg-slate-50 border border-slate-200 rounded-2xl p-10 text-slate-400 text-xs">
            The billboard is currently quiet. Log a fresh bulletin to kickstart activity!
          </div>
        ) : (
          posts.map((post) => (
            <div 
              key={post.id} 
              className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm hover:border-slate-300 transition-all flex flex-col gap-3"
            >
              {/* User Header Block */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#46a4fe]/10 text-[#46a4fe] text-xs font-bold flex items-center justify-center border border-[#46a4fe]/20">
                  {post.displayName?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 leading-tight">{post.displayName}</h4>
                  <p className="text-[10px] text-slate-400">{post.email}</p>
                </div>
              </div>

              {/* Main Content Message Body */}
              <p className="text-sm text-slate-700 leading-relaxed pl-1">
                {post.content}
              </p>

              {/* Conditionally displays an operational Room Promotion tag banner if one was specified */}
              {post.promotedRoom && (
                <div className="mt-1 flex items-center justify-between bg-[#46a4fe]/5 border border-[#46a4fe]/20 rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🏠</span>
                    <div>
                      <p className="text-xs font-bold text-slate-800">Promoted Community Room</p>
                      <p className="text-[11px] text-[#46a4fe] font-semibold">#{post.promotedRoom}</p>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => alert(`Entering ${post.promotedRoom} room lobby... (Room functionality pending next development step)`)}
                    className="bg-white border border-slate-200 hover:border-[#46a4fe] text-slate-700 hover:text-[#46a4fe] font-bold px-3 py-1.5 rounded-xl text-[10px] uppercase tracking-wider transition-all shadow-xs cursor-pointer"
                  >
                    Open Hub
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

    </div>
  );
}
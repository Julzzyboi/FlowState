import React from "react";
import { db, auth } from "../../Firebase";

export default function CommunityGrid({ 
  rooms, 
  isRoomsLoading, 
  searchQuery, 
  sortBy, 
  auth, 
  handleJoinRoom
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {isRoomsLoading ? (
        Array.from({ length: 4 }).map((_, indices) => (
          <div key={indices} className="bg-white border border-slate-200 rounded-4xl flex flex-col justify-between overflow-hidden min-h-85 shadow-xs animate-pulse">
            <div className="w-full h-40 bg-slate-200" />
            <div className="p-5 flex-1 flex flex-col justify-between gap-4">
              <div className="space-y-2">
                <div className="h-4 bg-slate-200 rounded-md w-3/4" />
                <div className="h-3 bg-slate-200 rounded-md w-full" />
              </div>
              <div className="h-10 bg-slate-200 rounded-2xl w-full mt-auto" />
            </div>
          </div>
        ))
      ) : (
        rooms
          // Step 1: Text Search Filtering
          .filter((r) => r.title?.toLowerCase().includes(searchQuery.toLowerCase()))
          // Step 2: Dynamic Sorting Rule Execution
          .sort((a, b) => {
            if (sortBy === "recent") {
              return (b.createdAt || 0) - (a.createdAt || 0);
            }
            if (sortBy === "oldest") {
              return (a.createdAt || 0) - (b.createdAt || 0);
            }
            if (sortBy === "alphabetical") {
              return (a.title || "").localeCompare(b.title || "");
            }
            return 0;
          })
          // Step 3: Render Organized Cards
          .map((room) => (
            <div key={room.id} className="bg-white border border-slate-200 rounded-4xl shadow-md shadow-slate-100 hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between overflow-hidden min-h-85 transform hover:-translate-y-0.5">
              <div className="w-full h-40 bg-slate-100 relative overflow-hidden">
                <img src={room.coverPhoto || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=60"} alt={room.title} className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 bg-black/60 text-white text-[9px] font-mono px-2 py-0.5 rounded shadow-sm">{room.id}</span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-base font-extrabold text-slate-900 mb-1.5 truncate">{room.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-3 mb-4">{room.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleJoinRoom(room)}
                  className="w-full bg-slate-50 hover:bg-[#46a4fe] text-slate-700 hover:text-white border border-slate-200 font-extrabold py-3 px-4 rounded-2xl text-xs uppercase shadow-3xs hover:shadow-md hover:shadow-[#46a4fe]/20 active:scale-98 transition-all mt-auto cursor-pointer"
                >
                  Join Community →
                </button>
              </div>
            </div>
          ))
      )}
    </div>
  );
}
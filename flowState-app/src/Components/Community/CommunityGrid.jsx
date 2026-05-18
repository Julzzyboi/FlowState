import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
// Line 4 needs exactly FOUR dots:
import { db, auth } from "../../Firebase";
import { collection, onSnapshot, doc, setDoc } from "firebase/firestore";

export default function CommunityGrid() {
  const { authUser } = useOutletContext(); // Safely reads data from the parent wrapper page
  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]);
  const [isRoomsLoading, setIsRoomsLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [roomId, setRoomId] = useState("");
  const [coverPhoto, setCoverPhoto] = useState(null);
  const fileInputRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setIsRoomsLoading(true);
    const unsubscribeRooms = onSnapshot(collection(db, "rooms"), (snapshot) => {
      setRooms(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setIsRoomsLoading(false);
    }, (error) => {
      console.error("Firestore rooms sync error:", error);
      setIsRoomsLoading(false);
    });
    return () => unsubscribeRooms();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setCoverPhoto(reader.result);
    reader.readAsDataURL(file);
  };

  const handleCreateRoomCard = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !roomId.trim()) return;

    const formattedId = roomId.trim().toUpperCase().replace(/\s+/g, "_");
    try {
      await setDoc(doc(db, "rooms", formattedId), {
        title: title.trim(),
        description: description.trim(),
        coverPhoto: coverPhoto || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=60",
        createdAt: Date.now()
      });
      setTitle(""); setDescription(""); setRoomId(""); setCoverPhoto(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) { console.error("Room creation error:", err); }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto text-slate-800 flex-1 flex flex-col gap-6 animate-fadeIn pb-28 relative bg-Body z-10">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">Community <span className="text-[#46a4fe]">Spaces</span></h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">Discover and access authenticated channel clusters.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-4xl p-5 sm:p-6 shadow-md shadow-slate-100">
        <h2 className="text-xs sm:text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-4">✨ Create a New Space</h2>
        <form onSubmit={handleCreateRoomCard} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Room ID</label>
              <input type="text" required value={roomId} onChange={(e) => setRoomId(e.target.value)} placeholder="PRO_ZONE" className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs outline-none focus:border-[#46a4fe] focus:bg-white transition-colors" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Display Title</label>
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Production Room" className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs outline-none focus:border-[#46a4fe] focus:bg-white transition-colors" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Description</label>
              <input type="text" required value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Verified entry points..." className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs outline-none focus:border-[#46a4fe] focus:bg-white transition-colors" />
            </div>
          </div>
          <div className="flex justify-between items-center border-t border-slate-100 pt-3">
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
            <button type="button" onClick={() => fileInputRef.current.click()} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs uppercase border border-slate-200 transition-colors shadow-3xs">🖼️ Choose Banner</button>
            <button type="submit" className="bg-[#46a4fe] text-white font-bold py-3 px-6 rounded-xl text-xs uppercase tracking-wider shadow-md shadow-[#46a4fe]/20 hover:shadow-lg transition-all active:scale-98">Create Community</button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {isRoomsLoading ? (
          Array.from({ length: 4 }).map((_, indices) => (
            <div key={indices} className="bg-white border border-slate-200 rounded-4xl flex flex-col justify-between overflow-hidden min-h-85 shadow-xs animate-pulse">
              <div className="w-full h-40 bg-slate-200" />
              <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                <div className="space-y-2"><div className="h-4 bg-slate-200 rounded-md w-3/4" /><div className="h-3 bg-slate-200 rounded-md w-full" /></div>
                <div className="h-10 bg-slate-200 rounded-2xl w-full mt-auto" />
              </div>
            </div>
          ))
        ) : (
          rooms.filter(r => r.title?.toLowerCase().includes(searchQuery.toLowerCase())).map((room) => (
            <div key={room.id} className="bg-white border border-slate-200 rounded-4xl shadow-md shadow-slate-100 hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between overflow-hidden min-h-85 transform hover:-translate-y-0.5">
              <div className="w-full h-40 bg-slate-100 relative overflow-hidden">
                <img src={room.coverPhoto} alt={room.title} className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 bg-black/60 text-white text-[9px] font-mono px-2 py-0.5 rounded shadow-sm">{room.id}</span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-base font-extrabold text-slate-900 mb-1.5 truncate">{room.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-3 mb-4">{room.description}</p>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    const googleUserPayload = {
                      id: authUser.uid,
                      name: authUser.displayName || "Google User",
                      email: authUser.email,
                      avatar: authUser.photoURL,
                      joinedAt: Date.now()
                    };
                    try {
                      await setDoc(doc(db, "rooms", room.id, "members", authUser.uid), googleUserPayload);
                      // Navigate straight to the dynamic room route path
                      navigate(`/community/${room.id.toLowerCase()}`);
                    } catch (err) { console.error("Roster join crash:", err); }
                  }}
                  className="w-full bg-slate-50 hover:bg-[#46a4fe] text-slate-700 hover:text-white border border-slate-200 font-extrabold py-3 px-4 rounded-2xl text-xs uppercase shadow-3xs hover:shadow-md hover:shadow-[#46a4fe]/20 active:scale-98 transition-all mt-auto cursor-pointer"
                >
                  Join Community →
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
import React, { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import { db } from "../firebase"; // Adjust paths to match your folder tree
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  addDoc, 
  query, 
  orderBy, 
  limit 
} from "firebase/firestore";

// Initialize the WebSocket engine pipeline connection node
// Replace with your active backend production or local Node server address
const SOCKET_SERVER_URL = "http://localhost:4000";
const socket = io(SOCKET_SERVER_URL, { autoConnect: false });

export default function CommunityPage() {
  // Global Live Reactive State Matrix
  const [rooms, setRooms] = useState([]);
  const [messages, setMessages] = useState([]); // Array layout for active targeted stream

  // Input Field Tracking States
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [roomId, setRoomId] = useState("");
  const [coverPhoto, setCoverPhoto] = useState(null);
  const fileInputRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Viewport Position Parameters
  const [activeChatRoom, setActiveChatRoom] = useState(null);
  const [currentMessageText, setCurrentMessageText] = useState("");
  const messagesEndRef = useRef(null);

  // Auto Scroll Engine
  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  // ==========================================
  // SYNC UTILITY 1: FIREBASE SPACES DATASTREAM
  // ==========================================
  useEffect(() => {
    // Open a persistent live listener connection to the Firestore 'rooms' collection
    const roomsCollectionRef = collection(db, "rooms");
    const unsubscribeRooms = onSnapshot(roomsCollectionRef, (snapshot) => {
      const activeRoomsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRooms(activeRoomsList);
    }, (error) => console.error("Firestore spaces query sync crash:", error));

    // Connect WebSocket socket channel globally
    socket.connect();

    return () => {
      unsubscribeRooms();
      socket.disconnect();
    };
  }, []);

  // ==========================================
  // SYNC UTILITY 2: ACTIVE ROOM WEB-PIPELINE
  // ==========================================
  useEffect(() => {
    if (!activeChatRoom) {
      setMessages([]);
      return;
    }

    const currentRoomId = activeChatRoom.id;

    // 1. Join room gateway on WebSocket connection server
    socket.emit("join_room", { room: currentRoomId });

    // 2. Load historic chat logs backlog directly via Firestore queries
    const messagesQueryRef = query(
      collection(db, "rooms", currentRoomId, "messages"),
      orderBy("createdAt", "asc"),
      limit(100)
    );

    const unsubscribeMessages = onSnapshot(messagesQueryRef, (snapshot) => {
      const historicalLogs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(historicalLogs);
      scrollToBottom();
    });

    // 3. Catch immediate realtime live incoming socket broadcast messages
    const handleIncomingSocketStream = (msgPayload) => {
      // Guard double render if message comes through both Firestore and Socket
      setMessages((prev) => {
        if (prev.some((m) => m.id === msgPayload.id)) return prev;
        return [...prev, msgPayload];
      });
      scrollToBottom();
    };

    socket.on("receive_message", handleIncomingSocketStream);

    // Cleanup active channel infrastructure before switching rooms
    return () => {
      socket.emit("leave_room", { room: currentRoomId });
      socket.off("receive_message", handleIncomingSocketStream);
      unsubscribeMessages();
    };
  }, [activeChatRoom]);

  // Image Conversion Engine
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setCoverPhoto(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Create new space node and sync to Firebase Firestore
  const handleCreateRoomCard = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !roomId.trim()) return;

    const formattedId = roomId.trim().toUpperCase().replace(/\s+/g, "_");
    
    const newRoomPayload = {
      title: title.trim(),
      description: description.trim(),
      userCount: 0,
      coverPhoto: coverPhoto || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=60",
      createdAt: Date.now()
    };

    try {
      // Use setDoc to enforce custom assigned Document ID matrix strings
      await setDoc(doc(db, "rooms", formattedId), newRoomPayload);
      
      setTitle("");
      setDescription("");
      setRoomId("");
      setCoverPhoto(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error("Failed to sync structural space node configuration:", err);
    }
  };

  // Dispatch message execution across both DB and WebSocket pipelines
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!currentMessageText.trim() || !activeChatRoom) return;

    const currentRoomId = activeChatRoom.id;
    
    const structuredMessageNode = {
      id: `MSG_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      sender: "You", // Update this dynamically when auth is added
      text: currentMessageText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      createdAt: Date.now(),
      room: currentRoomId
    };

    try {
      // 1. Instantly fire down transient socket line to update other viewports
      socket.emit("send_message", structuredMessageNode);

      // 2. Commit to cloud store for persistent storage
      await addDoc(
        collection(db, "rooms", currentRoomId, "messages"), 
        structuredMessageNode
      );

      setCurrentMessageText("");
      scrollToBottom();
    } catch (err) {
      console.error("Message execution pipeline drop:", err);
    }
  };

  // Search filtration matching engine
  const filteredRooms = rooms.filter((room) => {
    const query = searchQuery.toLowerCase().trim();
    return (
      room.title?.toLowerCase().includes(query) ||
      room.id?.toLowerCase().includes(query) ||
      room.description?.toLowerCase().includes(query)
    );
  });

  // ==========================================
  // VIEW RENDER 1: THE RESPONSIVE CHAT PORTAL
  // ==========================================
  if (activeChatRoom) {
    return (
      <div className="w-full h-full max-h-full flex flex-col bg-[#f8fafc] relative overflow-hidden">
        {/* CHAT HEADER HUB BAR */}
        <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3.5 flex items-center justify-between shrink-0 shadow-2xs z-10">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setActiveChatRoom(null)}
              className="bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 font-extrabold px-3 py-2 rounded-xl text-xs uppercase border border-slate-200 transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <span>←</span> Exit
            </button>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-extrabold text-slate-900 leading-none truncate">
                  {activeChatRoom.title}
                </h2>
                <span className="bg-slate-100 text-[8px] font-mono font-bold px-1.5 py-0.5 text-slate-500 rounded border border-slate-100 hidden sm:inline-block">
                  {activeChatRoom.id}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                {activeChatRoom.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-green-50 text-green-600 px-2.5 py-1 rounded-full text-[9px] font-bold border border-green-100 shrink-0 ml-2">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className="hidden sm:inline">Live Channel</span>
          </div>
        </div>

        {/* MESSAGES LAYER WATERFALL WINDOW */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-3.5 bg-slate-50/40">
          <div className="bg-white border border-slate-150 rounded-2xl p-4 text-center max-w-xs mx-auto shadow-2xs my-4">
            <span className="text-xl">📡</span>
            <p className="text-xs font-bold text-slate-800 mt-1">Channel Synced Securely</p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Transmitting live inside terminal node {activeChatRoom.id}.
            </p>
          </div>

          {messages.map((msg) => {
            // Check identity properties (adjust match rules once Auth exists)
            const isSelfMessage = msg.sender === "You";
            return (
              <div
                key={msg.id}
                className={`flex flex-col max-w-[85%] sm:max-w-[70%] ${isSelfMessage ? "ml-auto items-end" : "mr-auto items-start"}`}
              >
                <div className="flex items-center gap-1.5 mb-0.5 px-1">
                  <span className="text-[10px] font-bold text-slate-500">{msg.sender}</span>
                  <span className="text-[8px] text-slate-400">{msg.timestamp}</span>
                </div>
                <div
                  className={`p-3 rounded-2xl text-xs font-medium shadow-2xs leading-relaxed wrap-break-word w-full
                  ${isSelfMessage
                      ? "bg-[#46a4fe] text-white rounded-tr-none"
                      : "bg-white text-slate-800 border border-slate-200 rounded-tl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* HIGH-CONTRAST SECURE CHAT INPUT BAR MODULE */}
        <div className="bg-slate-50/90 backdrop-blur-md border-t border-slate-200/80 px-4 pt-4 pb-4 md:pb-5 shrink-0 z-10 shadow-[0_-8px_30px_rgb(0,0,0,0.04)] max-md:mb-20">
          <form onSubmit={handleSendMessage} className="w-full max-w-6xl mx-auto flex gap-2 sm:gap-3">
            <input
              type="text"
              value={currentMessageText}
              onChange={(e) => setCurrentMessageText(e.target.value)}
              placeholder={`Message ${activeChatRoom.title}...`}
              className="flex-1 bg-white border border-slate-250/80 shadow-inner px-4 py-3 rounded-xl sm:rounded-2xl text-xs outline-none focus:border-[#46a4fe] focus:ring-2 focus:ring-[#46a4fe]/10 text-slate-800 transition-all placeholder-slate-400 font-medium"
            />
            <button
              type="submit"
              className="bg-[#46a4fe] hover:bg-blue-500 text-white font-extrabold px-5 sm:px-7 py-3 rounded-xl sm:rounded-2xl text-xs tracking-wider uppercase transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer shrink-0 flex items-center justify-center gap-1"
            >
              <span>Send</span>
              <span className="text-[10px] hidden sm:inline">⚡</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW RENDER 2: THE COMMUNITY GRID
  // ==========================================
  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto text-slate-800 flex-1 flex flex-col gap-6 animate-fadeIn">
      {/* PAGE HEADER */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Community <span className="text-[#46a4fe]">Spaces</span>
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">
          Discover, initialize, and deploy open interactive group room nodes with custom design banners.
        </p>
      </div>

      {/* THE GENERATOR PANEL */}
      <div className="bg-white border border-slate-200 rounded-4xl p-5 sm:p-6 shadow-xs">
        <h2 className="text-xs sm:text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <span>✨</span> Create a New Community Space
        </h2>

        <form onSubmit={handleCreateRoomCard} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Room Unique Identifier</label>
              <input
                type="text" required value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="e.g., TS_DEV_ZONE"
                className="w-full bg-slate-50 border border-slate-200 focus:bg-white px-3.5 py-2.5 rounded-xl text-xs outline-none focus:border-[#46a4fe] text-slate-800 transition-all placeholder-slate-400"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Room Public Display Title</label>
              <input
                type="text" required value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., TypeScript Specialists"
                className="w-full bg-slate-50 border border-slate-200 focus:bg-white px-3.5 py-2.5 rounded-xl text-xs outline-none focus:border-[#46a4fe] text-slate-800 transition-all placeholder-slate-400"
              />
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-2 lg:col-span-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Description</label>
              <input
                type="text" required value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detail the core directives for this space..."
                className="w-full bg-slate-50 border border-slate-200 focus:bg-white px-3.5 py-2.5 rounded-xl text-xs outline-none focus:border-[#46a4fe] text-slate-800 transition-all placeholder-slate-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center border-t border-slate-100 pt-3">
            <div className="lg:col-span-2 flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Upload</label>
              <div className="flex items-center gap-4 w-full">
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
                <button
                  type="button" onClick={() => fileInputRef.current.click()}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer border border-slate-200 active:scale-95 flex items-center gap-2"
                >
                  <span>🖼️</span> Choose Banner Photo
                </button>
                <p className="text-[11px] text-slate-400 italic">Supports JPG, PNG, or WebP interface assets.</p>
              </div>
            </div>

            {coverPhoto && (
              <div className="relative w-full h-16 rounded-xl border border-slate-200 overflow-hidden flex items-center bg-slate-50 p-1 animate-fadeIn">
                <img src={coverPhoto} alt="Preview" className="w-20 h-full object-cover rounded-lg shrink-0 shadow-xs" />
                <div className="ml-3 flex-1 overflow-hidden">
                  <p className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Asset Buffered</p>
                  <p className="text-[9px] text-green-500 font-medium truncate">Ready for space initialization</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setCoverPhoto(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="text-slate-400 hover:text-red-500 font-bold px-3 text-xs cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          <div className="border-t border-slate-100 pt-3 flex justify-end">
            <button type="submit" className="w-full lg:w-auto min-w-50 bg-[#46a4fe] hover:bg-cyan-500 text-white font-bold py-3 px-6 rounded-xl text-xs tracking-wider uppercase transition-all shadow-md active:scale-[0.99] cursor-pointer">
              Create Community
            </button>
          </div>
        </form>
      </div>

      {/* SEARCH FILTER BAR MODULE */}
      <div className="w-full bg-white border border-slate-200 rounded-2xl p-3 shadow-xs flex items-center gap-3">
        <span className="text-xl pl-2 text-slate-400 select-none">🔍</span>
        <input
          type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter deployments by title, ID strings, or keywords..."
          className="flex-1 bg-transparent text-sm outline-none text-slate-800 placeholder-slate-400"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="text-xs font-bold text-slate-400 hover:text-[#46a4fe] px-2 py-1 rounded-md transition-colors cursor-pointer"
          >
            CLEAR
          </button>
        )}
      </div>

      {/* ACTIVE TARGETS DISPLAY GRID CONTAINER */}
      <div className="flex flex-col gap-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
          {searchQuery ? `Matching Results (${filteredRooms.length})` : `Active Deployments (${rooms.length})`}
        </h3>

        {filteredRooms.length === 0 && (
          <div className="w-full bg-white/60 border border-dashed border-slate-300 rounded-4xl py-12 px-4 text-center flex flex-col items-center justify-center">
            <span className="text-3xl mb-2">📡</span>
            <p className="text-sm font-bold text-slate-700">No active rooms match your search filter</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredRooms.map((room) => (
            <div key={room.id} className="bg-white border border-slate-200 rounded-4xl shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between group min-h-85 overflow-hidden">
              <div className="w-full h-40 bg-slate-100 overflow-hidden relative shrink-0 border-b border-slate-100">
                <img src={room.coverPhoto} alt={room.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
                  <span className="bg-black/60 backdrop-blur-md text-white text-[9px] font-mono px-2 py-0.5 rounded-md tracking-wider font-semibold truncate max-w-30">
                    {room.id}
                  </span>
                  <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md text-green-600 px-2 py-0.5 rounded-full text-[10px] font-bold shadow-xs">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    {room.userCount || 0} Users
                  </div>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-base font-extrabold text-slate-900 leading-snug group-hover:text-[#46a4fe] transition-colors mb-1.5 line-clamp-1">
                    {room.title}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 mb-4">
                    {room.description}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setActiveChatRoom(room);
                    scrollToBottom();
                  }}
                  className="w-full bg-slate-50 hover:bg-[#46a4fe] text-slate-700 hover:text-white border border-slate-200 hover:border-[#46a4fe] font-extrabold py-3 px-4 rounded-2xl text-xs uppercase tracking-wider transition-all shadow-xs active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 mt-auto"
                >
                  Join Community <span>→</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
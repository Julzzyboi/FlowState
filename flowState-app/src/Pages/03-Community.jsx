import React, { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import { db } from "../firebase"; // Adjust paths to match your folder tree
import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  deleteDoc,
  query, 
  orderBy, 
  limit 
} from "firebase/firestore";

// Initialize the WebSocket engine pipeline connection node
const SOCKET_SERVER_URL = "http://localhost:4000";
const socket = io(SOCKET_SERVER_URL, { autoConnect: false });

export default function CommunityPage() {
  // Global Live Reactive State Matrix
  const [rooms, setRooms] = useState([]);
  const [messages, setMessages] = useState([]); // Array layout for active targeted stream
  const [members, setMembers] = useState([]); // Dynamic roster of users in the active room
  const [allUsers, setAllUsers] = useState([]); // Real global registered accounts list from Firebase
  const [isRoomsLoading, setIsRoomsLoading] = useState(true); // Skeleton Loader Toggle
  const [currentUserSessionId, setCurrentUserSessionId] = useState(null); // Tracks generated guest presence token

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
  // SYNC UTILITY 1: FIREBASE GLOBAL DATASTREAM
  // ==========================================
  useEffect(() => {
    setIsRoomsLoading(true);
    
    // 1. Open a persistent live listener connection to the Firestore 'rooms' collection
    const roomsCollectionRef = collection(db, "rooms");
    const unsubscribeRooms = onSnapshot(roomsCollectionRef, (snapshot) => {
      const activeRoomsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRooms(activeRoomsList);
      setIsRoomsLoading(false);
    }, (error) => {
      console.error("Firestore spaces query sync crash:", error);
      setIsRoomsLoading(false);
    });

    // 2. Open a persistent live listener to fetch ALL real registered user accounts
    const usersCollectionRef = collection(db, "users");
    const unsubscribeUsers = onSnapshot(usersCollectionRef, (snapshot) => {
      const registeredUsersList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAllUsers(registeredUsersList);
    }, (error) => {
      console.error("Global users directory sync drop:", error);
    });

    // Connect WebSocket socket channel globally
    socket.connect();

    return () => {
      unsubscribeRooms();
      unsubscribeUsers();
      socket.disconnect();
    };
  }, []);

  // ==========================================
  // SYNC UTILITY 2: ACTIVE ROOM WEB-PIPELINE
  // ==========================================
  useEffect(() => {
    if (!activeChatRoom) {
      setMessages([]);
      setMembers([]);
      return;
    }

    const currentRoomId = activeChatRoom.id;

    // 1. Join room gateway on WebSocket connection server
    socket.emit("join_room", { room: currentRoomId });

    // 2. Sync Active Members List dynamically from Firestore Subcollection
    const membersCollectionRef = collection(db, "rooms", currentRoomId, "members");
    const unsubscribeMembers = onSnapshot(membersCollectionRef, (snapshot) => {
      const activeMembers = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMembers(activeMembers);
    }, (err) => console.error("Members roster stream pipeline drop:", err));

    // 3. Load historic chat logs backlog directly via Firestore queries
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

    // 4. Catch immediate realtime live incoming socket broadcast messages
    const handleIncomingSocketStream = (msgPayload) => {
      setMessages((prev) => {
        if (prev.some((m) => m.id === msgPayload.id)) return prev;
        return [...prev, msgPayload];
      });
      scrollToBottom();
    };

    socket.on("receive_message", handleIncomingSocketStream);

    return () => {
      socket.emit("leave_room", { room: currentRoomId });
      socket.off("receive_message", handleIncomingSocketStream);
      unsubscribeMessages();
      unsubscribeMembers();
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
    const uniqueMessageId = `MSG_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    
    const structuredMessageNode = {
      id: uniqueMessageId,
      sender: "You", 
      text: currentMessageText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      createdAt: Date.now(),
      room: currentRoomId
    };

    try {
      socket.emit("send_message", structuredMessageNode);
      const messageDocRef = doc(db, "rooms", currentRoomId, "messages", uniqueMessageId);
      await setDoc(messageDocRef, structuredMessageNode);
      setCurrentMessageText("");
      scrollToBottom();
    } catch (err) {
      console.error("Message execution pipeline drop:", err);
    }
  };

  // Remove active presence credentials on exit selection
  const handleLeaveRoom = async () => {
    if (!activeChatRoom || !currentUserSessionId) {
      setActiveChatRoom(null);
      return;
    }

    const currentRoomId = activeChatRoom.id;
    
    try {
      // Direct targeting vector calculation on current active session path
      const memberDocRef = doc(db, "rooms", currentRoomId, "members", currentUserSessionId);
      await deleteDoc(memberDocRef);
    } catch (err) {
      console.error("Failed to gracefully break structural member node configuration:", err);
    } finally {
      setCurrentUserSessionId(null);
      setActiveChatRoom(null);
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
              onClick={handleLeaveRoom}
              className="bg-slate-50 hover:bg-red-50 hover:text-red-600 text-slate-600 font-extrabold px-3 py-2 rounded-xl text-xs uppercase border border-slate-200 transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <span>←</span> Leave Room
            </button>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-extrabold text-slate-900 leading-none truncate">
                  {activeChatRoom.title}
                </h2>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                {activeChatRoom.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-[#46a4fe]/10 text-[#46a4fe] px-2.5 py-1 rounded-full text-[10px] font-bold border border-[#46a4fe]/20 shrink-0 ml-2">
            <span>👥 {members.length} In Room</span>
          </div>
        </div>

        {/* WORKSPACE CONTENT BODY FRAME SPLIT */}
        <div className="flex-1 flex overflow-hidden w-full relative">
          
          {/* CHAT INTERACTIVE VIEWPORT COLUMN */}
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-3.5 bg-slate-50/40">
              {messages.map((msg) => {
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
                      ${isSelfMessage ? "bg-[#46a4fe] text-white rounded-tr-none" : "bg-white text-slate-800 border border-slate-200 rounded-tl-none"}`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* CHAT INPUT BAR MODULE */}
            <div className="bg-slate-50/90 backdrop-blur-md border-t border-slate-200/80 px-4 pt-4 pb-4 md:pb-5 shrink-0 z-10 max-md:mb-20">
              <form onSubmit={handleSendMessage} className="w-full max-w-6xl mx-auto flex gap-2 sm:gap-3">
                <input
                  type="text"
                  value={currentMessageText}
                  onChange={(e) => setCurrentMessageText(e.target.value)}
                  placeholder={`Message ${activeChatRoom.title}...`}
                  className="flex-1 bg-white border border-slate-250/80 shadow-inner px-4 py-3 rounded-xl sm:rounded-2xl text-xs outline-none focus:border-[#46a4fe] text-slate-800"
                />
                <button type="submit" className="bg-[#46a4fe] text-white font-extrabold px-5 rounded-xl text-xs uppercase">
                  Send
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT SIDEBAR: REAL USER SYSTEM ACCOUNT DIRECTORY DIRECT LOOP */}
          <div className="hidden sm:flex flex-col w-72 bg-white border-l border-slate-200 h-full shrink-0 p-4 overflow-y-auto">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">
              Registered Accounts ({allUsers.length})
            </h3>
            <div className="flex flex-col gap-3">
              {allUsers.map((user) => (
                <div key={user.id} className="flex items-start gap-3 p-2 bg-slate-50/50 border border-slate-100 rounded-2xl transition-all hover:bg-slate-50">
                  <img 
                    src={user.photoURL || user.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${user.id}`} 
                    alt={user.displayName || "User Avatar"} 
                    className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 object-cover shadow-3xs"
                  />
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-xs font-black text-slate-800 truncate">
                      {user.displayName || "Anonymous User"}
                    </span>
                    <span className="text-[9px] text-slate-400 truncate tracking-tight font-mono -mt-0.5">
                      {user.email || "No email synchronized"}
                    </span>
                    {user.bio && (
                      <p className="text-[10px] text-slate-500 line-clamp-2 mt-1 bg-white p-1 rounded-lg border border-slate-100 italic">
                        "{user.bio}"
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW RENDER 2: THE COMMUNITY GRID
  // ==========================================
  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto text-slate-800 flex-1 flex flex-col gap-6 animate-fadeIn pb-28">
      {/* PAGE HEADER */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Community <span className="text-[#46a4fe]">Spaces</span>
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">
          Discover, initialize, and deploy open interactive group room nodes.
        </p>
      </div>

      {/* CREATE SPACE GENERATOR */}
      <div className="bg-white border border-slate-200 rounded-4xl p-5 sm:p-6 shadow-xs">
        <h2 className="text-xs sm:text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-4">
          ✨ Create a New Space
        </h2>

        <form onSubmit={handleCreateRoomCard} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Room ID</label>
              <input type="text" required value={roomId} onChange={(e) => setRoomId(e.target.value)} placeholder="TS_DEV_ZONE" className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs outline-none" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Display Title</label>
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="TypeScript Specialists" className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs outline-none" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Description</label>
              <input type="text" required value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Core directives for this space..." className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center border-t border-slate-100 pt-3">
            <div className="lg:col-span-2 flex gap-4 items-center">
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
              <button type="button" onClick={() => fileInputRef.current.click()} className="bg-slate-100 text-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs uppercase border border-slate-200">
                🖼️ Choose Banner Photo
              </button>
            </div>
            {coverPhoto && (
              <div className="relative w-full h-16 rounded-xl border border-slate-200 overflow-hidden flex items-center bg-slate-50 p-1">
                <img src={coverPhoto} alt="Preview" className="w-20 h-full object-cover rounded-lg" />
                <button type="button" onClick={() => setCoverPhoto(null)} className="ml-auto text-slate-400 hover:text-red-500 font-bold px-3">✕</button>
              </div>
            )}
          </div>
          <div className="flex justify-end pt-2">
            <button type="submit" className="bg-[#46a4fe] text-white font-bold py-3 px-6 rounded-xl text-xs uppercase tracking-wider">Create Community</button>
          </div>
        </form>
      </div>

      {/* RENDER ACTIVE SPACES TILES */}
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredRooms.map((room) => (
            <div key={room.id} className="bg-white border border-slate-200 rounded-4xl shadow-xs flex flex-col justify-between overflow-hidden min-h-85 group">
              <div className="w-full h-40 bg-slate-100 relative overflow-hidden border-b border-slate-100">
                <img src={room.coverPhoto} alt={room.title} className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 bg-black/60 text-white text-[9px] font-mono px-2 py-0.5 rounded">{room.id}</span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-base font-extrabold text-slate-900 mb-1.5 truncate">{room.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-3 mb-4">{room.description}</p>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    // Create transient unique user token on connection gateway entry
                    const temporaryUserId = "USER_" + Math.random().toString(36).substr(2, 4).toUpperCase();
                    const mockUserPayload = {
                      id: temporaryUserId,
                      name: `Dev_${temporaryUserId.split('_')[1]}`,
                      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${temporaryUserId}`,
                      joinedAt: Date.now()
                    };

                    try {
                      await setDoc(
                        doc(db, "rooms", room.id, "members", temporaryUserId), 
                        mockUserPayload
                      );
                      setCurrentUserSessionId(temporaryUserId); // Cache token locally to perform deletion on exit selection
                    } catch (err) {
                      console.error("Roster membership write crash:", err);
                    }

                    setActiveChatRoom(room);
                    scrollToBottom();
                  }}
                  className="w-full bg-slate-50 hover:bg-[#46a4fe] text-slate-700 hover:text-white border border-slate-200 font-extrabold py-3 px-4 rounded-2xl text-xs uppercase tracking-wider transition-all mt-auto cursor-pointer"
                >
                  Join Community →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
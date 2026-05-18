import React, { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import { db, auth } from "../Firebase"; 
import { useParams, useNavigate } from "react-router-dom"; 
import { motion, AnimatePresence } from "framer-motion";
import { 
  collection, 
  onSnapshot, 
  doc, 
  getDoc, 
  setDoc, 
  deleteDoc,
  query, 
  orderBy, 
  limit 
} from "firebase/firestore";

const SOCKET_SERVER_URL = "http://localhost:5000";
const socket = io(SOCKET_SERVER_URL, { autoConnect: false });

export default function CommunityPage() {
  const { roomId: urlRoomId } = useParams(); 
  const navigate = useNavigate();

  // Component Infrastructure States
  const [rooms, setRooms] = useState([]);
  const [messages, setMessages] = useState([]); 
  const [members, setMembers] = useState([]); 
  const [isRoomsLoading, setIsRoomsLoading] = useState(true); 
  const [authUser, setAuthUser] = useState(null); 
  const [authLoading, setAuthLoading] = useState(true);
  const [isRoomRestoring, setIsRoomRestoring] = useState(!!urlRoomId);
  
  // 🔘 Modal Window Trigger
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 📝 RETAINED ORIGINAL INPUT FORM STATES
  const [roomId, setRoomId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverPhoto, setCoverPhoto] = useState(null);
  const fileInputRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Communication & Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [activeChatRoom, setActiveChatRoom] = useState(null);
  const [currentMessageText, setCurrentMessageText] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  // 1. AUTHENTICATION STATE LISTENER
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      setAuthUser(user || null);
      setAuthLoading(false);
    });
    return () => unsubscribeAuth();
  }, []);

  // 2. GLOBAL ROOMS SYNC & URL RESTORATION
  useEffect(() => {
    setIsRoomsLoading(true);
    const roomsCollectionRef = collection(db, "rooms");
    
    const unsubscribeRooms = onSnapshot(roomsCollectionRef, (snapshot) => {
      const activeRoomsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRooms(activeRoomsList);
      setIsRoomsLoading(false);
    }, (error) => {
      console.error("Firestore sync error:", error);
      setIsRoomsLoading(false);
    });

    socket.connect();

    if (urlRoomId) {
      const restoreRoomFromURL = async () => {
        try {
          const targetRoomId = urlRoomId.toUpperCase();
          const roomDocRef = doc(db, "rooms", targetRoomId);
          const roomSnap = await getDoc(roomDocRef);
          
          if (roomSnap.exists()) {
            setActiveChatRoom({ id: roomSnap.id, ...roomSnap.data() });
          } else {
            navigate("/community");
          }
        } catch (err) {
          console.error("Failed to restore session from URL:", err);
          navigate("/community");
        } finally {
          setIsRoomRestoring(false);
        }
      };
      restoreRoomFromURL();
    } else {
      setActiveChatRoom(null);
      setIsRoomRestoring(false);
    }

    return () => {
      unsubscribeRooms();
      socket.disconnect();
    };
  }, [urlRoomId, navigate]);

  // 3. ACTIVE CHAT SYNC LOOP
  useEffect(() => {
    if (!activeChatRoom || !authUser) {
      setMessages([]);
      setMembers([]);
      return;
    }

    const currentRoomId = activeChatRoom.id;
    socket.emit("join_room", { room: currentRoomId, userId: authUser.uid });

    const membersCollectionRef = collection(db, "rooms", currentRoomId, "members");
    const unsubscribeMembers = onSnapshot(membersCollectionRef, (snapshot) => {
      setMembers(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    }, (err) => console.error("Members roster error:", err));

    const messagesQueryRef = query(
      collection(db, "rooms", currentRoomId, "messages"),
      orderBy("createdAt", "asc"),
      limit(100)
    );

    const unsubscribeMessages = onSnapshot(messagesQueryRef, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      scrollToBottom();
    });

    const handleIncomingSocketStream = (msgPayload) => {
      if (msgPayload.room === currentRoomId) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === msgPayload.id)) return prev;
          return [...prev, msgPayload];
        });
        scrollToBottom();
      }
    };

    socket.on("receive_message", handleIncomingSocketStream);

    return () => {
      socket.emit("leave_room", { room: currentRoomId, userId: authUser.uid });
      socket.off("receive_message", handleIncomingSocketStream);
      unsubscribeMessages();
      unsubscribeMembers();
    };
  }, [activeChatRoom, authUser]);

  // 🌟 ORIGINAL BASE64 COMPRESSION (Bypasses Firestore 1MB string size crashes)
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 500; 
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        setCoverPhoto(canvas.toDataURL("image/jpeg", 0.7));
      };
    };
    reader.readAsDataURL(file);
  };

  // 🔄 RE-INTEGRATED TRANSACTION CARD ACTION 
  const handleCreateRoomCard = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !roomId.trim()) return;
    setIsSubmitting(true);

    const formattedId = roomId.trim().toUpperCase().replace(/\s+/g, "_");
    try {
      await setDoc(doc(db, "rooms", formattedId), {
        title: title.trim(),
        description: description.trim(),
        coverPhoto: coverPhoto || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=60",
        createdAt: Date.now()
      });
      
      // Clean form state variables on completion
      setTitle(""); 
      setDescription(""); 
      setRoomId(""); 
      setCoverPhoto(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setIsModalOpen(false); // Snap modal window shut on success!
    } catch (err) {
      console.error("Room creation error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!currentMessageText.trim() || !activeChatRoom || !auth.currentUser) return; 

    const user = auth.currentUser;
    const currentRoomId = activeChatRoom.id;
    const uniqueMessageId = `MSG_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    
    const structuredMessageNode = {
      id: uniqueMessageId,
      senderId: user.uid, 
      senderName: user.displayName || "Google User",
      senderEmail: user.email,
      text: currentMessageText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      createdAt: Date.now(),
      room: currentRoomId
    };

    try {
      socket.emit("send_message", structuredMessageNode);
      await setDoc(doc(db, "rooms", currentRoomId, "messages", uniqueMessageId), structuredMessageNode);
      setCurrentMessageText("");
      scrollToBottom();
    } catch (err) {
      console.error("Message send failure:", err);
    }
  };

  const handleLeaveRoom = async () => {
    if (!activeChatRoom || !auth.currentUser) {
      setActiveChatRoom(null);
      navigate("/community");
      return;
    }
    try {
      await deleteDoc(doc(db, "rooms", activeChatRoom.id, "members", auth.currentUser.uid));
    } catch (err) {
      console.error("Error leaving room:", err);
    } finally {
      setActiveChatRoom(null);
      navigate("/community");
    }
  };

  if (authLoading || isRoomRestoring) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-Body z-10 relative gap-4 min-h-[50vh]">
        <div className="flex space-x-2 animate-pulse">
          <div className="w-3 h-3 bg-[#46a4fe] rounded-full"></div>
          <div className="w-3 h-3 bg-[#46a4fe]/60 rounded-full"></div>
          <div className="w-3 h-3 bg-[#46a4fe]/30 rounded-full"></div>
        </div>
        <p className="text-xs font-black tracking-widest text-slate-400 uppercase animate-pulse">
          Syncing Channel Workspace Session
        </p>
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#f8fafc] z-10 relative p-6">
        <div className="bg-white border border-slate-200 p-8 rounded-4xl max-w-sm text-center shadow-xl">
          <span className="text-3xl">🔒</span>
          <h2 className="text-sm font-black text-slate-800 mt-3 uppercase tracking-wider">Access Restricted</h2>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">You must be logged into your verified Google Account to view community spaces and join live chats.</p>
        </div>
      </div>
    );
  }

  // =========================================================
  // VIEW RENDER 1: THE ACTIVE CHAT WINDOW
  // =========================================================
  if (activeChatRoom) {
    return (
      <div className="w-full h-full max-h-full flex flex-col bg-Body relative overflow-hidden z-10">
        <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3.5 flex items-center justify-between shrink-0 shadow-xs z-10">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={handleLeaveRoom}
              className="bg-slate-50 hover:bg-red-50 hover:text-red-600 text-slate-600 font-extrabold px-3 py-2 rounded-xl text-xs uppercase border border-slate-200 shadow-3xs hover:shadow-2xs transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <span>←</span> Leave Room
            </button>
            <div className="flex flex-col min-w-0">
              <h2 className="text-sm font-extrabold text-slate-900 leading-none truncate">{activeChatRoom.title}</h2>
              <p className="text-[11px] text-slate-400 mt-0.5 truncate">{activeChatRoom.description}</p>
            </div>
          </div>
          <div className="bg-[#46a4fe]/10 text-[#46a4fe] px-2.5 py-1 rounded-full text-[10px] font-bold border border-[#46a4fe]/20 shrink-0 ml-2 shadow-3xs">
            <span>👥 {members.length} Online</span>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden w-full relative">
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-3.5 bg-slate-50/40">
              {messages.map((msg) => {
                const isSelfMessage = msg.senderId === auth.currentUser?.uid;
                return (
                  <div key={msg.id} className={`flex flex-col max-w-[85%] sm:max-w-[70%] ${isSelfMessage ? "ml-auto items-end" : "mr-auto items-start"}`}>
                    <div className="flex items-center gap-1.5 mb-0.5 px-1">
                      <span className="text-[10px] font-bold text-slate-500">{isSelfMessage ? "You" : msg.senderName}</span>
                      <span className="text-[8px] text-slate-400">{msg.timestamp}</span>
                    </div>
                    <div className={`p-3 rounded-2xl text-xs font-medium shadow-2xs leading-relaxed wrap-break-word w-full ${isSelfMessage ? "bg-[#46a4fe] text-white rounded-tr-none shadow-md shadow-[#46a4fe]/20" : "bg-white text-slate-800 border border-slate-200 rounded-tl-none"}`}>
                      {msg.text}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <div className="bg-slate-50/90 backdrop-blur-md border-t border-slate-200/80 px-4 pt-4 pb-4 md:pb-5 shrink-0 z-10 max-md:mb-20">
              <form onSubmit={handleSendMessage} className="w-full max-w-6xl mx-auto flex gap-2 sm:gap-3">
                <input
                  type="text"
                  value={currentMessageText}
                  onChange={(e) => setCurrentMessageText(e.target.value)}
                  placeholder={`Message as ${authUser.displayName || "Google User"}...`}
                  className="flex-1 bg-white border border-slate-250/80 shadow-md px-4 py-3 rounded-xl sm:rounded-2xl text-xs outline-none focus:border-[#46a4fe] text-slate-800 focus:shadow-lg transition-shadow"
                />
                <button type="submit" className="bg-[#46a4fe] text-white font-extrabold px-5 rounded-xl text-xs uppercase shadow-md shadow-[#46a4fe]/20 hover:shadow-lg active:scale-98 transition-all">Send</button>
              </form>
            </div>
          </div>

          <div className="hidden sm:flex flex-col w-72 bg-white border-l border-slate-200 h-full shrink-0 p-4 overflow-y-auto">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Verified Accounts ({members.length})</h3>
            <div className="flex flex-col gap-3">
              {members.map((member) => {
                const isMe = member.id === auth.currentUser?.uid;
                return (
                  <div key={member.id} className={`flex items-start gap-3 p-2 border rounded-2xl transition-all shadow-3xs ${isMe ? "bg-[#46a4fe]/5 border-[#46a4fe]/20" : "bg-slate-50/50 border-slate-100 hover:bg-slate-50 hover:shadow-2xs"}`}>
                    <img src={member.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${member.id}`} alt={member.name} className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 object-cover shadow-3xs" />
                    <div className="flex flex-col min-w-0 flex-1 justify-center">
                      <span className="text-xs font-black text-slate-800 truncate">{member.name} {isMe && <span className="text-[9px] text-[#46a4fe] font-black ml-1">(You)</span>}</span>
                      <span className="text-[9px] text-slate-400 truncate tracking-tight font-mono">{member.email}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // VIEW RENDER 2: THE COMMUNITIES MAIN SEARCH & GRID 
  // =========================================================
  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto text-slate-800 flex-1 flex flex-col gap-6 animate-fadeIn pb-28 relative bg-Body z-10">
      
      {/* GRID PAGE HEADER */}
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">Community <span className="text-[#46a4fe]">Spaces</span></h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">Discover and access authenticated channel clusters.</p>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#46a4fe] text-white font-bold px-6 py-3 rounded-2xl shadow-lg shadow-[#46a4fe]/10 hover:scale-[1.02] transition-all text-xs uppercase tracking-wider cursor-pointer"
        >
          + Add a Community
        </button>
      </div>

      {/* FILTER SEARCH FIELD */}
      <div className="w-full max-w-md">
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="🔍 Search rooms by title..."
          className="w-full bg-white border border-slate-200 px-4 py-2.5 rounded-2xl text-xs outline-none focus:border-[#46a4fe] shadow-3xs font-medium"
        />
      </div>

      {/* RENDER DYNAMIC GRID DISPLAY CARDS */}
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
          rooms.filter(r => r.title?.toLowerCase().includes(searchQuery.toLowerCase())).map((room) => (
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
                  onClick={async () => {
                    const user = auth.currentUser;
                    if (!user) return;

                    const googleUserPayload = {
                      id: user.uid,
                      name: user.displayName || "Google User",
                      email: user.email,
                      avatar: user.photoURL,
                      joinedAt: Date.now()
                    };

                    try {
                      await setDoc(doc(db, "rooms", room.id, "members", user.uid), googleUserPayload);
                      navigate(`/community/${room.id.toLowerCase()}`);
                      setActiveChatRoom(room);
                      scrollToBottom();
                    } catch (err) {
                      console.error("Roster join crash:", err);
                    }
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

      {/* =========================================================
          MODAL INTERFACE CONTAINER (Retains all original inputs)
          ========================================================= */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            
            {/* Backdrop Layer */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => !isSubmitting && setIsModalOpen(false)} 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            />
            
            {/* Form Content Panel */}
            <motion.div 
              initial={{ y: 30, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              exit={{ y: 30, opacity: 0 }} 
              className="bg-[#111c24] text-white w-full max-w-md p-8 rounded-[2.5rem] relative shadow-2xl border border-white/10"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">✨ Create a New Space</h3>
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors text-xs"
                  disabled={isSubmitting}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateRoomCard} className="flex flex-col gap-4">
                
                {/* ROOM ID INPUT */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-white/50">Room ID</label>
                  <input 
                    type="text" 
                    required 
                    value={roomId} 
                    onChange={(e) => setRoomId(e.target.value)} 
                    placeholder="e.g., PRO_ZONE" 
                    className="w-full bg-slate-900 border border-white/10 px-4 py-3 rounded-xl text-xs outline-none focus:border-[#46a4fe] transition-colors"
                    disabled={isSubmitting}
                  />
                </div>

                {/* DISPLAY TITLE INPUT */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-white/50">Display Title</label>
                  <input 
                    type="text" 
                    required 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder="e.g., Production Room" 
                    className="w-full bg-slate-900 border border-white/10 px-4 py-3 rounded-xl text-xs outline-none focus:border-[#46a4fe] transition-colors"
                    disabled={isSubmitting}
                  />
                </div>

                {/* DESCRIPTION INPUT */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-white/50">Description</label>
                  <textarea 
                    required 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    placeholder="Verified entry points..." 
                    rows={3}
                    className="w-full bg-slate-900 border border-white/10 px-4 py-3 rounded-xl text-xs outline-none focus:border-[#46a4fe] transition-colors resize-none"
                    disabled={isSubmitting}
                  />
                </div>

                {/* BANNER SELECTION BLOCK */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-white/50">Cover Banner</label>
                  <div 
                    onClick={() => !isSubmitting && fileInputRef.current.click()}
                    className="border-2 border-dashed border-white/10 rounded-xl p-4 text-center cursor-pointer hover:bg-white/5 hover:border-white/20 transition-all flex flex-col items-center justify-center min-h-22.5"
                  >
                    {coverPhoto ? (
                      <div className="w-full h-20 relative rounded-lg overflow-hidden">
                        <img src={coverPhoto} alt="Banner Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-[10px] font-bold">Change Image</div>
                      </div>
                    ) : (
                      <p className="text-xs text-white/40 font-medium py-3">🖼️ Click to choose banner photo</p>
                    )}
                  </div>
                  <input 
                    type="file" 
                    accept="image/*" 
                    ref={fileInputRef} 
                    onChange={handleImageUpload} 
                    className="hidden" 
                    disabled={isSubmitting}
                  />
                </div>

                {/* SUBMIT EXECUTION BUTTON */}
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-[#46a4fe] text-white font-bold h-12 rounded-xl text-xs uppercase tracking-wider shadow-md shadow-[#46a4fe]/20 hover:bg-[#358edb] transition-all active:scale-95 disabled:bg-slate-700 disabled:scale-100 mt-2 flex items-center justify-center"
                >
                  {isSubmitting ? "Generating Workspace..." : "Create Community"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
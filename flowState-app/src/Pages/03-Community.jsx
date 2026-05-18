import React, { useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import { db, auth } from "../Firebase"; 
import { useParams, useNavigate } from "react-router-dom"; 
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

const SOCKET_SERVER_URL = "http://localhost:4000";
const socket = io(SOCKET_SERVER_URL, { autoConnect: false });

export default function CommunityPage() {
  const { roomId: urlRoomId } = useParams(); 
  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]);
  const [messages, setMessages] = useState([]); 
  const [members, setMembers] = useState([]); 
  const [isRoomsLoading, setIsRoomsLoading] = useState(true); 
  
  const [authUser, setAuthUser] = useState(null); 
  const [authLoading, setAuthLoading] = useState(true);

  // ✨ NEW: Initial route verification guard to stop layout flashes
  const [isRoomRestoring, setIsRoomRestoring] = useState(!!urlRoomId);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [roomId, setRoomId] = useState("");
  const [coverPhoto, setCoverPhoto] = useState(null);
  const fileInputRef = useRef(null);
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

  // 2. GLOBAL ROOMS SYNC & URL-ROUTE SESSION RESTORATION
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
      console.error("Firestore rooms sync error:", error);
      setIsRoomsLoading(false);
    });

    socket.connect();

    // URL PARSER ON REFRESH
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
          console.error("Failed to restore chat view from URL routing state:", err);
          navigate("/community");
        } finally {
          // ✨ Lift the loading gate once the room data is completely loaded
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
    } catch (err) {
      console.error("Room creation error:", err);
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

  // 4. COMBINED APPLICATION ENGINE LOADING WRAPPER
  // ✨ Added isRoomRestoring check here to freeze layouts until data routing finishes completely
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

  // ==========================================
  // VIEW RENDER 1: THE DYNAMIC CHAT PORTAL
  // ==========================================
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

  // ==========================================
  // VIEW RENDER 2: THE MAIN COMMUNITY GRID
  // ==========================================
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
    </div>
  );
}
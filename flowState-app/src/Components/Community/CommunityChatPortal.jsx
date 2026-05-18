import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import { io } from "socket.io-client";
// Line 4 needs exactly FOUR dots:
import { db, auth } from "../../Firebase";
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

export default function ChatPortal() {
  const { roomId } = useParams(); 
  const navigate = useNavigate();
  const { authUser } = useOutletContext();

  const [activeChatRoom, setActiveChatRoom] = useState(null);
  const [messages, setMessages] = useState([]); 
  const [members, setMembers] = useState([]); 
  const [isRoomRestoring, setIsRoomRestoring] = useState(true);

  const [currentMessageText, setCurrentMessageText] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    setTimeout(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, 50);
  };

  // SYNC ACTIVE ROOM DETAILS DIRECTLY FROM PARAMETER URL ON MOUNT
  useEffect(() => {
    if (!roomId) {
      navigate("/community");
      return;
    }

    const restoreRoomFromURL = async () => {
      try {
        const targetRoomId = roomId.toUpperCase();
        const roomSnap = await getDoc(doc(db, "rooms", targetRoomId));
        
        if (roomSnap.exists()) {
          setActiveChatRoom({ id: roomSnap.id, ...roomSnap.data() });
        } else {
          navigate("/community");
        }
      } catch (err) {
        console.error("Error identifying target channel mapping:", err);
        navigate("/community");
      } finally {
        setIsRoomRestoring(false);
      }
    };

    restoreRoomFromURL();
    socket.connect();

    return () => { socket.disconnect(); };
  }, [roomId, navigate]);

  // LIVE SOCKET & FIRESTORE LOG PIPELINES
  useEffect(() => {
    if (!activeChatRoom || !authUser) return;

    const currentRoomId = activeChatRoom.id;
    socket.emit("join_room", { room: currentRoomId, userId: authUser.uid });

    const unsubscribeMembers = onSnapshot(collection(db, "rooms", currentRoomId, "members"), (snapshot) => {
      setMembers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (err) => console.error("Members roster error:", err));

    const messagesQueryRef = query(
      collection(db, "rooms", currentRoomId, "messages"),
      orderBy("createdAt", "asc"),
      limit(100)
    );

    const unsubscribeMessages = onSnapshot(messagesQueryRef, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
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

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!currentMessageText.trim() || !activeChatRoom) return; 

    const currentRoomId = activeChatRoom.id;
    const uniqueMessageId = `MSG_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    
    const structuredMessageNode = {
      id: uniqueMessageId,
      senderId: authUser.uid, 
      senderName: authUser.displayName || "Google User",
      senderEmail: authUser.email,
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
    } catch (err) { console.error("Message send failure:", err); }
  };

  const handleLeaveRoom = async () => {
    if (!activeChatRoom) return;
    try {
      await deleteDoc(doc(db, "rooms", activeChatRoom.id, "members", authUser.uid));
    } catch (err) {
      console.error("Error exiting current room node:", err);
    } finally {
      navigate("/community");
    }
  };

  // Lock UI framework until room retrieval confirmation finishes
  if (isRoomRestoring) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-Body min-h-[50vh] gap-4">
        <div className="flex space-x-2 animate-pulse">
          <div className="w-3 h-3 bg-[#46a4fe] rounded-full"></div>
          <div className="w-3 h-3 bg-[#46a4fe]/60 rounded-full"></div>
          <div className="w-3 h-3 bg-[#46a4fe]/30 rounded-full"></div>
        </div>
        <p className="text-xs font-black tracking-widest text-slate-400 uppercase animate-pulse">
          Connecting to Channel Server
        </p>
      </div>
    );
  }

  if (!activeChatRoom) return null;

  return (
    <div className="w-full h-full max-h-full flex flex-col bg-Body relative overflow-hidden z-10">
      {/* CHAT HEADER */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3.5 flex items-center justify-between shrink-0 shadow-xs z-10">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={handleLeaveRoom} className="bg-slate-50 hover:bg-red-50 hover:text-red-600 text-slate-600 font-extrabold px-3 py-2 rounded-xl text-xs uppercase border border-slate-200 shadow-3xs transition-all cursor-pointer">
            ← Leave Room
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

      {/* CORE WORKSPACE PORTAL BODY */}
      <div className="flex-1 flex overflow-hidden w-full relative">
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* MESSAGES VIEWPORT */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-3.5 bg-slate-50/40">
            {messages.map((msg) => {
              const isSelfMessage = msg.senderId === authUser.uid;
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

          {/* INPUT BAR MODULE */}
          <div className="bg-slate-50/90 backdrop-blur-md border-t border-slate-200/80 px-4 pt-4 pb-4 md:pb-5 shrink-0 z-10 max-md:mb-20">
            <form onSubmit={handleSendMessage} className="w-full max-w-6xl mx-auto flex gap-2 sm:gap-3">
              <input type="text" value={currentMessageText} onChange={(e) => setCurrentMessageText(e.target.value)} placeholder={`Message room...`} className="flex-1 bg-white border border-slate-250/80 shadow-md px-4 py-3 rounded-xl sm:rounded-2xl text-xs outline-none focus:border-[#46a4fe] text-slate-800" />
              <button type="submit" className="bg-[#46a4fe] text-white font-extrabold px-5 rounded-xl text-xs uppercase shadow-md">Send</button>
            </form>
          </div>
        </div>

        {/* SIDEBAR MEMBERSHIP ROSTER */}
        <div className="hidden sm:flex flex-col w-72 bg-white border-l border-slate-200 h-full shrink-0 p-4 overflow-y-auto">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Verified Accounts ({members.length})</h3>
          <div className="flex flex-col gap-3">
            {members.map((member) => {
              const isMe = member.id === authUser.uid;
              return (
                <div key={member.id} className={`flex items-start gap-3 p-2 border rounded-2xl transition-all shadow-3xs ${isMe ? "bg-[#46a4fe]/5 border-[#46a4fe]/20" : "bg-slate-50/50 border-slate-100 hover:bg-slate-50"}`}>
                  <img src={member.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${member.id}`} alt={member.name} className="w-9 h-9 rounded-full bg-slate-100 object-cover" />
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
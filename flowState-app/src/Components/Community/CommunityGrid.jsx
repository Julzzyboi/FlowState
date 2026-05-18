// src/Components/Community/CommunityGrid.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { AnimatePresence } from 'framer-motion';
import { db, storage } from '../../Firebase'; // 💡 Ensure this path matches your project structure
import CreateCommunityModal from './CreateCommunityModal';

export default function CommunityGrid() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // 🛡️ Safe Snapshot listener with error handling
    const unsubscribe = onSnapshot(
      collection(db, 'rooms'), 
      (snapshot) => {
        setRooms(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      },
      (error) => {
        console.warn("Firestore snapshot listener encountered a permissions check exception:", error.message);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleCreateRoom = async ({ title, description, coverFile }) => {
    // Elegant fallback Unsplash placeholder in case an upload is blocked
    let finalImageUrl = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60'; 

    if (coverFile) {
      try {
        const uniqueFileName = `communityCovers/${Date.now()}_${coverFile.name.replace(/\s+/g, '_')}`;
        const storageRef = ref(storage, uniqueFileName);
        
        const snapshot = await uploadBytes(storageRef, coverFile);
        const uploadedUrl = await getDownloadURL(snapshot.ref);
        
        if (uploadedUrl) {
          finalImageUrl = uploadedUrl;
        }
      } catch (storageError) {
        // 🛡️ Safety container bypasses any stubborn local browser preflight cache issues
        console.warn("Firebase Storage upload caught a network block. Gracefully falling back to stock asset URL.", storageError);
      }
    }

    try {
      await addDoc(collection(db, 'rooms'), {
        name: String(title).trim(),
        description: String(description).trim(),
        cover: finalImageUrl,
        createdAt: serverTimestamp()
      });
    } catch (firestoreError) {
      console.error("Failed to commit document record to Firestore Database Collection:", firestoreError);
    }
  };

  return (
    <div className="p-6 lg:p-12 w-full max-w-7xl mx-auto">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-800">Communities</h1>
          <p className="text-slate-500 text-sm mt-1">Join a space to connect with other creators</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-6 h-12 bg-[#46a4fe] text-white rounded-2xl font-bold shadow-lg shadow-[#46a4fe]/20 hover:bg-[#358edb] active:scale-95 transition-all cursor-pointer text-sm"
        >
          + Add a Community
        </button>
      </div>

      {/* RENDER GRID DISPLAY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => {
          let finalName = "Untitled Room";
          let finalDesc = "Welcome to this space! Hop into chat to say hello.";

          if (room.name && typeof room.name === 'object') {
            finalName = room.name.title || room.name.name || finalName;
            finalDesc = room.name.description || finalDesc;
          } else if (room.room && typeof room.room === 'object') {
            finalName = room.room.title || room.room.name || finalName;
            finalDesc = room.room.description || finalDesc;
          } else {
            finalName = room.name || room.title || finalName;
            finalDesc = room.description || finalDesc;
          }

          return (
            <div 
              key={room.id}
              onClick={() => navigate(`/community/${room.id}`)}
              className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="h-36 w-full relative overflow-hidden bg-slate-100">
                  <img 
                    src={room.cover || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60'} 
                    alt={finalName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/10" />
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-800 group-hover:text-[#46a4fe] transition-colors line-clamp-1">
                    {finalName}
                  </h3>
                  <p className="text-slate-500 text-xs mt-2 line-clamp-2 leading-relaxed">
                    {finalDesc}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6">
                <p className="text-slate-400 text-[11px] font-semibold pt-4 border-t border-slate-50/80">
                  Click to join channel →
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <CreateCommunityModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onCreateRoom={handleCreateRoom}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
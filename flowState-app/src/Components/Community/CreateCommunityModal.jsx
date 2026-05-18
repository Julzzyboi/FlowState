// src/Components/Community/CreateCommunityModal.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function CreateCommunityModal({ isOpen, onClose, onCreateRoom }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverFile, setCoverFile] = useState(null); 
  const [previewUrl, setPreviewUrl] = useState(''); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverFile(file);
      setPreviewUrl(URL.createObjectURL(file)); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsSubmitting(true);
    try {
      await onCreateRoom({ 
        title: title.trim(), 
        description: description.trim(),
        coverFile: coverFile || null
      });
      
      setTitle('');
      setDescription('');
      setCoverFile(null);
      setPreviewUrl('');
      onClose();
    } catch (error) {
      console.error("Form execution failure:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="bg-[#111c24] w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative z-10 border border-white/10 text-white max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Create a New Community</h3>
          <button 
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors text-white text-sm"
            disabled={isSubmitting}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {/* COMMUNITY TITLE INPUT */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-white/70 uppercase tracking-wider">Community Title</label>
            <input 
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., UI/UX Designers"
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 outline-none text-white focus:border-[#46a4fe] transition-all font-medium text-sm"
              autoFocus
              required
              disabled={isSubmitting}
            />
          </div>

          {/* DESCRIPTION INPUT */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-white/70 uppercase tracking-wider">Description</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this space all about?..."
              rows={3}
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 outline-none text-white focus:border-[#46a4fe] transition-all font-medium text-sm定位 resize-none"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* BANNER FILE UPLOAD DROPZONE */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-white/70 uppercase tracking-wider">Cover Banner Image</label>
            <div className="flex flex-col gap-3 items-center justify-center border-2 border-dashed border-white/20 rounded-xl p-4 bg-slate-900/40 relative">
              {previewUrl ? (
                <div className="w-full h-24 rounded-lg overflow-hidden relative group">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-xs font-bold text-white">Change Image File</p>
                  </div>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" disabled={isSubmitting} />
                </div>
              ) : (
                <div className="w-full h-20 flex flex-col items-center justify-center cursor-pointer group relative">
                  <span className="text-2xl">📁</span>
                  <p className="text-xs font-semibold text-white/60 mt-1 group-hover:text-[#46a4fe] transition-colors">Click to Add Cover Photo</p>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" disabled={isSubmitting} />
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#46a4fe] text-white rounded-xl h-12 font-bold hover:bg-[#358edb] active:scale-[0.98] disabled:bg-slate-500 disabled:scale-100 transition-all shadow-lg shadow-[#46a4fe]/20 mt-2 text-sm flex items-center justify-center"
          >
            {isSubmitting ? "Uploading Asset..." : "Create Space"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
// src/components/CommunitySkeleton.jsx
import React from "react";

export default function CommunitySkeleton() {
  // Array to render multiple placeholder post cards
  const skeletonCards = Array(3).fill(0);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6 animate-pulse">
      
      {/* 1. Header Area Placeholder */}
      <div className="space-y-2 mb-8">
        <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded-md w-1/4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-md w-2/3"></div>
      </div>

      {/* 2. Feed Cards Mock Array */}
      {skeletonCards.map((_, index) => (
        <div 
          key={index} 
          className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-5 space-y-4 shadow-sm"
        >
          {/* Header Row: Avatar + User Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full shrink-0"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/5"></div>
            </div>
          </div>

          {/* Post Content Blocks */}
          <div className="space-y-2 pt-2">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-11/12"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
          </div>

          {/* Bottom Action Footer Row (Like, Comment, Share) */}
          <div className="flex items-center gap-6 pt-4 border-t border-gray-100 dark:border-zinc-800">
            <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-14"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-14"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
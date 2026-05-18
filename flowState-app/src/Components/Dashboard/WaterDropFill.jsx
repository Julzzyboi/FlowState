import React from 'react';

export default function WaterDropFill({ percentage }) {
  // Safe bounded vertical parameters for standard 100x100 viewport grid space
  // 0% progress = water surface line rests at Y=84
  // 100% progress = water surface line hits top at Y=14
  const baseFloor = 84;
  const topCeiling = 14;
  
  // Calculate exact Y level
  // If percentage is 0, we push the blue block down to Y=100 so it's completely hidden
  const waterYLevel = percentage === 0 
    ? 100 
    : baseFloor - (percentage * (baseFloor - topCeiling) / 100);

  return (
    <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none">
      {/* CONTAINER DROPLET TRACKER */}
      <div className="w-36 h-36 relative">
        
        <svg className="w-full h-full drop-shadow-[0_8px_22px_rgba(59,130,246,0.05)]" viewBox="0 0 100 100">
          <defs>
            {/* SEAMLESS DROPLET SHAPE MASK */}
            <clipPath id="dropletWorkspaceMask">
              <path d="M 50,14 C 50,14 80,48 80,68 A 30,30 0 1,1 20,68 C 20,48 50,14 50,14 Z" />
            </clipPath>
          </defs>

          {/* DROPLET BASE BACKGROUND SHIELD */}
          {/* Changed fill color to #E2E8F0 to match the gauge ring track exactly */}
          <path 
            d="M 50,14 C 50,14 80,48 80,68 A 30,30 0 1,1 20,68 C 20,48 50,14 50,14 Z" 
            fill="#E2E8F0" 
            className="opacity-100"
          />

          {/* CLIPPED SOLID LIQUID SURFACE */}
          <g clipPath="url(#dropletWorkspaceMask)">
            {/* Renders a clean flat blue water block when tracking volume levels */}
            <rect 
              x="0" 
              y={waterYLevel} 
              width="100" 
              height="100" 
              fill="#3b82f6" 
              className="transition-all duration-[1000ms] ease-out"
            />
          </g>
        </svg>

        {/* GLOSSY INTERIOR GLASS SHINE */}
        {/* Slightly reduced opacity to blend smoothly with the new gray background */}
        <div className="absolute w-2 h-7 bg-white/50 rounded-full rotate-[28deg] pointer-events-none top-[34%] left-[34%] filter blur-[0.4px]" />
      </div>
    </div>
  );
}
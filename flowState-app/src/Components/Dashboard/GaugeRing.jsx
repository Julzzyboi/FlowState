import React from 'react';

export default function GaugeRing({ percentage, children }) {
  const strokeDasharray = 502.6;
  const strokeDashoffset = strokeDasharray - (377 * percentage) / 100;

  return (
    <div className="w-64 h-64 relative flex items-center justify-center select-none">
      <svg className="absolute inset-0 w-full h-full transform rotate-[-225deg]" viewBox="0 0 200 200">
        <circle
          cx="100"
          cy="100"
          r="80"
          fill="transparent"
          stroke="#E2E8F0"
          strokeWidth="11"
          strokeDasharray="377 502.6"
          strokeLinecap="round"
        />
        <circle
          cx="100"
          cy="100"
          r="80"
          fill="transparent"
          stroke="#3b82f6"
          strokeWidth="11"
          strokeDasharray="502.6"
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1200 ease-out drop-shadow-[0_4px_10px_rgba(59,130,246,0.2)]"
        />
      </svg>

      {/* Contains our new beautifully upright WaterDropFill component */}
      {children}

      {/* Hash Marks */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.2]">
        {[...Array(9)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-2 bg-slate-500 left-1/2 top-4.75 origin-[0_113px]"
            style={{ transform: `translateX(-50%) rotate(${i * 28 - 112}deg)` }}
          />
        ))}
      </div>
    </div>
  );
}
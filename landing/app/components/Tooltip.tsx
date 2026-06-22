'use client';

import React, { useState } from 'react';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
}

export default function Tooltip({ content, children }: TooltipProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
    >
      {children}
      {isHovered && (
        <span className="absolute top-full right-0 mt-3 z-50 w-72 md:w-96 p-1 bg-white dark:bg-zinc-900 rounded-lg shadow-xl border border-zinc-200 dark:border-zinc-800 transition-all duration-200 pointer-events-none animate-in fade-in slide-in-from-top-2">
          {content}
        </span>
      )}
    </span>
  );
}

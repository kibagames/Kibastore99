import React from 'react';

interface DiamondChestSvgProps {
  className?: string;
  size?: number;
}

export default function DiamondChestSvg({ className = '', size = 120 }: DiamondChestSvgProps) {
  return (
    <svg
      width={size}
      height={size * 0.85}
      viewBox="0 0 160 136"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none filter drop-shadow-[0_4px_12px_rgba(30,58,138,0.25)] ${className}`}
    >
      <defs>
        {/* Diamond Gradients */}
        <linearGradient id="diam-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
        <linearGradient id="diam-light" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0.1" />
        </linearGradient>
        
        {/* Gold Border Gradients */}
        <linearGradient id="gold-metal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="30%" stopColor="#facc15" />
          <stop offset="70%" stopColor="#ca8a04" />
          <stop offset="100%" stopColor="#854d0e" />
        </linearGradient>
        
        {/* Purple Metallic Chest Body Gradients */}
        <linearGradient id="purple-metal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#b492fc" />
          <stop offset="25%" stopColor="#7c3aed" />
          <stop offset="70%" stopColor="#4c1d95" />
          <stop offset="100%" stopColor="#2e1065" />
        </linearGradient>

        {/* Shadow and Glow */}
        <radialGradient id="glow-effect" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Cyber/Pulse Glow in the Background of Diamonds */}
      <circle cx="80" cy="50" r="45" fill="url(#glow-effect)" className="animate-pulse" />

      {/* --- STEP 1: GLOWING DIAMONDS INSIDE THE CHEST --- */}
      <g>
        {/* Diamond 1 - Far Left */}
        <polygon points="30,55 45,35 60,35 50,55 35,65" fill="url(#diam-grad)" />
        <polygon points="30,55 45,35 60,35" fill="url(#diam-light)" />

        {/* Diamond 2 - Center Left */}
        <polygon points="45,45 65,15 85,25 75,55 55,55" fill="url(#diam-grad)" />
        <polygon points="45,45 65,15 85,25" fill="url(#diam-light)" />
        
        {/* Diamond 3 - Center Right (The Big Diamond Pile) */}
        <polygon points="75,35 100,5 125,25 110,50 85,45" fill="url(#diam-grad)" />
        <polygon points="75,35 100,5 125,25" fill="url(#diam-light)" stroke="#ffffff" strokeWidth="0.5" />

        {/* Diamond 4 - Far Right */}
        <polygon points="110,40 120,25 135,30 145,50 125,55" fill="url(#diam-grad)" />
        <polygon points="110,40 120,25 135,30" fill="url(#diam-light)" />

        {/* Extra crystals piled up */}
        <polygon points="65,30 75,20 85,30 75,40" fill="url(#diam-grad)" />
        <polygon points="95,40 110,25 120,40 105,45" fill="url(#diam-grad)" />
      </g>

      {/* Sparkle effects on top of diamonds */}
      <g className="animate-bounce" style={{ animationDuration: '3s' }}>
        <path d="M65,15 L67,23 L75,25 L67,27 L65,35 L63,27 L55,25 L63,23 Z" fill="#ffffff" opacity="0.9" />
        <path d="M100,5 L101.5,11 L107,12.5 L101.5,14 L100,20 L98.5,14 L93,12.5 L98.5,11 Z" fill="#ffffff" opacity="0.95" />
        <path d="M125,30 L126,35 L131,36 L126,37 L125,42 L124,37 L119,36 L124,35 Z" fill="#ffffff" opacity="0.8" />
      </g>

      {/* --- STEP 2: THE TREASURE CHEST BODY --- */}
      {/* Back Inner rim */}
      <path d="M22,50 L138,50 L146,56 L14,56 Z" fill="#1e1b4b" />

      {/* Left Wall Projection */}
      <polygon points="10,54 26,50 26,110 10,110" fill="url(#purple-metal)" opacity="0.85" />

      {/* Right Wall Projection */}
      <polygon points="134,50 150,54 150,110 134,110" fill="url(#purple-metal)" opacity="0.85" />

      {/* Main Front Panel */}
      <path
        d="M26,50 L134,50 L134,110 C134,115 130,120 124,120 L36,120 C30,120 26,115 26,110 Z"
        fill="url(#purple-metal)"
        stroke="#1e1035"
        strokeWidth="1.5"
      />

      {/* --- STEP 3: GOLDEN BORDERS & TRIMS --- */}
      {/* Top golden border of the front tray */}
      <polygon points="22,50 138,50 134,56 26,56" fill="url(#gold-metal)" />
      
      {/* Left Column Pillar Gold Trim */}
      <path
        d="M26,50 L34,50 L34,118 L26,114 Z"
        fill="url(#gold-metal)"
      />

      {/* Right Column Pillar Gold Trim */}
      <path
        d="M126,50 L134,50 L134,114 L126,118 Z"
        fill="url(#gold-metal)"
      />

      {/* Bottom Tray Gold Plate Rim */}
      <path
        d="M30,113 L130,113 L126,120 L34,120 Z"
        fill="url(#gold-metal)"
      />

      {/* --- STEP 4: THE DISTINCTIVE "M" LOGO / EMBLEM --- */}
      {/* A beautiful metallic gold stylized crown insignia 'M' in the center of the chest front */}
      <g>
        {/* Left pillar of the M */}
        <polygon points="50,70 56,66 62,70 62,100 50,105" fill="url(#gold-metal)" />
        {/* Right pillar of the M */}
        <polygon points="98,70 104,66 110,70 110,105 98,100" fill="url(#gold-metal)" />
        {/* Diagonal joints forming the gold 'M' crown crest */}
        <polygon points="62,70 80,94 98,70 94,103 80,108 66,103" fill="url(#gold-metal)" />
        
        {/* Inlay Inner Shadow of M */}
        <path d="M80,94 L62,70 L56,66 L80,102 L104,66 L98,70 Z" fill="#ffffff" opacity="0.3" />
        <circle cx="80" cy="85" r="2.5" fill="#fef08a" />
      </g>

      {/* Outer framing rim highlighting highlights */}
      <path d="M26,50 L134,50" stroke="#fef08a" strokeWidth="1" opacity="0.7" />

      {/* --- STEP 5: LOOSE DIAMONDS SPILLED ON THE BOTTOM LEFT --- */}
      <g className="filter drop-shadow-[0_2px_5px_rgba(56,189,248,0.4)]">
        {/* Loose Diamond 1 */}
        <polygon
          points="10,100 24,90 32,105 18,115"
          fill="url(#diam-grad)"
          stroke="#0284c7"
          strokeWidth="0.5"
        />
        <polygon points="10,100 24,90 32,105" fill="url(#diam-light)" opacity="0.7" />

        {/* Loose Diamond 2 (intersecting further forward) */}
        <polygon
          points="22,110 38,100 48,115 32,125"
          fill="url(#diam-grad)"
          stroke="#0284c7"
          strokeWidth="0.5"
        />
        <polygon points="22,110 38,100 48,115" fill="url(#diam-light)" opacity="0.75" />
      </g>
    </svg>
  );
}

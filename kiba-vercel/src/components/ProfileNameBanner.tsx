import React from 'react';

interface ProfileNameBannerProps {
  name: string;
  theme?: 'dark' | 'light';
  className?: string;
}

export default function ProfileNameBanner({ name, theme = 'dark', className = '' }: ProfileNameBannerProps) {
  // Compute size-friendly truncation and dynamic font sizes depending on name length
  const displayName = name.trim() || 'Gamer Profile';
  const nameLength = displayName.length;

  let fontSizeClass = 'text-sm sm:text-base font-black'; // default
  if (nameLength > 20) {
    fontSizeClass = 'text-[10px] sm:text-[11px] font-bold tracking-tight';
  } else if (nameLength > 15) {
    fontSizeClass = 'text-[11px] sm:text-[12px] font-black tracking-tight';
  } else if (nameLength > 10) {
    fontSizeClass = 'text-xs sm:text-sm font-black';
  }

  return (
    <div className={`relative flex items-center h-12 w-[240px] sm:w-[280px] shrink-0 font-display select-none select-none ${className}`}>
      {/* --- SVG BACKGROUND BANNER --- */}
      <svg
        className="absolute inset-0 w-full h-full filter drop-shadow-[0_2px_8px_rgba(202,138,4,0.15)]"
        viewBox="0 0 280 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Gold Metallic Gradients */}
          <linearGradient id="banner-gold-gild" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="25%" stopColor="#facc15" />
            <stop offset="70%" stopColor="#ca8a04" />
            <stop offset="100%" stopColor="#854d0e" />
          </linearGradient>

          {/* Bronze/Dark interior gradient for high text contrast */}
          <linearGradient id="banner-bronze-fill" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1e1b4b" stopOpacity="0.9" />
            <stop offset="15%" stopColor="#451a03" />
            <stop offset="50%" stopColor="#1c1917" />
            <stop offset="85%" stopColor="#451a03" />
            <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0.9" />
          </linearGradient>

          {/* Subtle gold shine overlay */}
          <linearGradient id="gild-shine" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ca8a04" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* 1. Main outer golden frame wings */}
        <path
          d="M 12 6 
             L 268 6 
             C 274 6, 278 10, 276 16 
             L 272 34 
             C 270 40, 266 42, 260 42 
             L 32 42 
             C 26 42, 22 40, 20 34 
             L 16 16 
             C 14 10, 8 6, 12 6 Z"
          fill="url(#banner-gold-gild)"
          stroke="#451a03"
          strokeWidth="1.5"
        />

        {/* 2. Inner Bronze contrasted container where text resides */}
        <path
          d="M 38 10 
             L 260 10 
             L 256 32 
             C 255 35, 252 38, 248 38 
             L 48 38 
             C 44 38, 41 35, 40 32 Z"
          fill="url(#banner-bronze-fill)"
          stroke="#ca8a04"
          strokeWidth="1"
        />

        {/* 3. Shine highlighting along top borders */}
        <path d="M 38 10 L 260 10" stroke="#fef08a" strokeWidth="1" opacity="0.6" />

        {/* 4. Left Crest Shield detailing */}
        {/* Diamond shaped shield base */}
        <path
          d="M 10 24 L 24 10 L 38 24 L 24 38 Z"
          fill="url(#banner-gold-gild)"
          stroke="#422006"
          strokeWidth="1"
        />
        {/* Dark inner triangle */}
        <polygon points="15,24 24,15 33,24 24,33" fill="#451a03" />
        {/* Golden central insignia jewel/crest */}
        <polygon points="19,24 24,19 29,24 24,29" fill="url(#banner-gold-gild)" />
        <line x1="24" y1="15" x2="24" y2="33" stroke="url(#banner-gold-gild)" strokeWidth="1" />
        <line x1="15" y1="24" x2="33" y2="24" stroke="url(#banner-gold-gild)" strokeWidth="1" />

        {/* Left side flanking ribbon ends */}
        <polygon points="4,20 10,14 10,34 4,28" fill="url(#banner-gold-gild)" opacity="0.8" />
        {/* Right side flanking ribbon ends */}
        <polygon points="276,20 270,14 270,34 276,28" fill="url(#banner-gold-gild)" opacity="0.8" />
      </svg>

      {/* --- FLOATING TEXT: ALIGNED CENTER OF CONSTRAINED BRONZE AREA --- */}
      {/* Placed inside a strict max-width block to fully prevent clipping or overflow */}
      <div className="absolute left-[46px] right-[24px] top-0 bottom-0 flex items-center justify-center pointer-events-none">
        <span
          className={`text-center truncate uppercase tracking-widest leading-none drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)] ${fontSizeClass} ${
            theme === 'dark' 
              ? 'text-yellow-400 bg-gradient-to-b from-white to-yellow-400 bg-clip-text font-black' 
              : 'text-amber-300 font-extrabold'
          }`}
          style={{ maxWidth: '100%' }}
        >
          {displayName}
        </span>
      </div>
    </div>
  );
}

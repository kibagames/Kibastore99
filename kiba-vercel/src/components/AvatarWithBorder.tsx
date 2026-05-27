import React from 'react';

export interface AvatarBorder {
  id: string;
  name: string;
  rarity: 'Common' | 'Special' | 'Epic' | 'Legend' | 'Mythic' | 'Collector';
  description: string;
  glowColor: string;
}

export const AVATAR_BORDERS: AvatarBorder[] = [
  { id: 'default', name: 'Moonton Civilian', rarity: 'Common', description: 'Standard citizen framework.', glowColor: 'rgba(100, 116, 139, 0.4)' },
  { id: 'amber-glow', name: 'Amber Starburst', rarity: 'Special', description: 'Shining amber aura from local gold reserves.', glowColor: 'rgba(245, 158, 11, 0.6)' },
  { id: 'mystic-phoenix', name: 'Phoenix Firelord', rarity: 'Epic', description: 'Blazing cyclic fire ring containing burning embers.', glowColor: 'rgba(239, 68, 68, 0.8)' },
  { id: 'glacier-ice', name: 'Glacier Overlord', rarity: 'Epic', description: 'Frosted cyan scales forged in frozen tundras.', glowColor: 'rgba(6, 182, 212, 0.8)' },
  { id: 'cyber-laser', name: 'Laser Cyberpunk', rarity: 'Collector', description: 'High frequency neon-magenta grid projection.', glowColor: 'rgba(219, 39, 119, 0.9)' },
  { id: 'cosmic-star', name: 'Cosmic Singularity', rarity: 'Legend', description: 'Swirling celestial void drawing stars inward.', glowColor: 'rgba(139, 92, 246, 0.9)' },
  { id: 'legend-wings', name: 'Majestic Wings', rarity: 'Legend', description: 'Sprouting golden celestial angel wings.', glowColor: 'rgba(234, 179, 8, 0.9)' },
  { id: 'mythic-immortal', name: 'Mythic Immortal', rarity: 'Mythic', description: 'Spasmodic double-ring crimson shield with stars.', glowColor: 'rgba(244, 63, 94, 0.95)' },
  { id: 'shadow-assassin', name: 'Obsidian Smoke', rarity: 'Special', description: 'Midnight dark smoke haze and shadows.', glowColor: 'rgba(15, 23, 42, 0.8)' },
  { id: 'sakura-dream', name: 'Sakura Petals', rarity: 'Special', description: 'Lovely cherry blossom pastel pink circle.', glowColor: 'rgba(244, 114, 182, 0.6)' },
  { id: 'abysm-lord', name: 'Abysm Eclipse', rarity: 'Collector', description: 'Dark blood-red gothic crown spiked frame.', glowColor: 'rgba(153, 27, 27, 0.95)' },
  { id: 'star-guardian', name: 'Star Crest', rarity: 'Epic', description: 'Pulsing cyan diamond stars at top and bottom.', glowColor: 'rgba(14, 116, 144, 0.75)' },
  { id: 'dragon-soul', name: 'Jade Serpent', rarity: 'Collector', description: 'Sculptured neon emerald dragon tail wrapping.', glowColor: 'rgba(16, 185, 129, 0.9)' },
  { id: 'arcade-matrix', name: '8-Bit Glitch', rarity: 'Special', description: 'Retro pixelated glowing terminal border.', glowColor: 'rgba(59, 130, 246, 0.7)' },
  { id: 'venom-pulse', name: 'Acidic Venom', rarity: 'Epic', description: 'Toxic nuclear bubbling green hazard ring.', glowColor: 'rgba(34, 197, 94, 0.85)' },
  { id: 'gold-champion', name: 'Aurum Emperor', rarity: 'Mythic', description: 'Highest purity polished gold plate frame.', glowColor: 'rgba(202, 138, 4, 0.95)' },
  { id: 'celestial-god', name: 'Elysian Glow', rarity: 'Legend', description: 'Pure platinum ring throwing golden rays.', glowColor: 'rgba(254, 240, 138, 0.9)' },
  { id: 'void-wanderer', name: 'Void Core Rift', rarity: 'Epic', description: 'Torn space fracture with dimensional lightwaves.', glowColor: 'rgba(168, 85, 247, 0.8)' },
  { id: 'kiba-exclusive', name: 'Kiba Monarch', rarity: 'Collector', description: 'Our custom store branding. Lava gold crown.', glowColor: 'rgba(217, 119, 6, 1)' },
  { id: 'neon-shogun', name: 'Neon Shogun', rarity: 'Epic', description: 'Pulsator cyber sakura warrior plate.', glowColor: 'rgba(236, 72, 153, 0.8)' },
  { id: 'emerald-aurora', name: 'Emerald Aurora', rarity: 'Special', description: 'Stunner neon green curtain of high lights.', glowColor: 'rgba(5, 150, 105, 0.6)' },
  { id: 'shinobi-headband', name: 'Shinobi Pride', rarity: 'Legend', description: 'Hidden Leaf style forehead plate protector with leaf carvings.', glowColor: 'rgba(56, 189, 248, 0.85)' },
  { id: 'super-saiyan', name: 'Saiyan Overdrive', rarity: 'Legend', description: 'Flaring bright golden aura with electric cyan plasma discharges.', glowColor: 'rgba(234, 179, 8, 0.95)' },
  { id: 'sharingan-eye', name: 'Ethereal Sharingan', rarity: 'Collector', description: 'Three black tomoe blades swirling inside a blood-red ring.', glowColor: 'rgba(239, 68, 68, 0.95)' },
  { id: 'water-breathing', name: 'Water Breathing', rarity: 'Epic', description: 'Tidal waves of ocean water with rising white foam caps.', glowColor: 'rgba(14, 165, 233, 0.85)' },
  { id: 'sun-god', name: 'Sun God Gear 5', rarity: 'Mythic', description: 'Fluffy white giant deity smoke clouds wrapping a golden core.', glowColor: 'rgba(255, 255, 255, 0.9)' },
  { id: 'hollow-mask', name: 'Hollow Vizard', rarity: 'Collector', description: 'Fearsome bone-white mask crown with red warpaint details.', glowColor: 'rgba(220, 38, 38, 0.9)' },
  { id: 'shadow-sovereign', name: 'Shadow Sovereign', rarity: 'Mythic', description: 'Sprouting neon violet shadow vapor flame tendrils.', glowColor: 'rgba(124, 58, 237, 0.95)' },
  { id: 'domain-limitless', name: 'Limitless Blue', rarity: 'Legend', description: 'Subtle infinite sky-blue energy ripples and gravity waves.', glowColor: 'rgba(6, 182, 212, 0.9)' },
  { id: 'curse-seal', name: 'Heavenly Curse Seal', rarity: 'Special', description: 'Midnight dark purple flame patterns and snake markings.', glowColor: 'rgba(168, 85, 247, 0.7)' }
];

interface AvatarWithBorderProps {
  avatarUrl: string;
  borderId?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
}

export default function AvatarWithBorder({
  avatarUrl,
  borderId = 'default',
  size = 'md',
  className = '',
  onClick
}: AvatarWithBorderProps) {
  
  // Decide dimensions based on size
  let containerSize = 'w-10 h-10';
  let imgSize = 'w-7.5 h-7.5';
  let borderWidth = 'border-2';

  if (size === 'sm') {
    containerSize = 'w-8 h-8';
    imgSize = 'w-6 h-6';
    borderWidth = 'border';
  } else if (size === 'lg') {
    containerSize = 'w-14 h-14';
    imgSize = 'w-10.5 h-10.5';
    borderWidth = 'border-3';
  } else if (size === 'xl') {
    containerSize = 'w-24 h-24';
    imgSize = 'w-18.5 h-18.5';
    borderWidth = 'border-4';
  }

  // Find associated border configuration
  const border = AVATAR_BORDERS.find(b => b.id === borderId) || AVATAR_BORDERS[0];

  // Render the specific visual borders using absolute wrappers
  const renderBorderFrame = () => {
    switch (border.id) {
      case 'amber-glow':
        return (
          <div className="absolute inset-0 rounded-full border-2 border-amber-500 animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.6)]" />
        );
      case 'mystic-phoenix':
        return (
          <>
            <div className="absolute inset-0 rounded-full border-[3px] border-t-rose-500 border-r-orange-500 border-b-yellow-400 border-l-red-500 animate-spin" style={{ animationDuration: '3s' }} />
            <div className="absolute -inset-0.5 rounded-full bg-red-500/10 blur-[2px] animate-pulse" />
          </>
        );
      case 'glacier-ice':
        return (
          <>
            <div className="absolute inset-0 rounded-full border-2 border-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.7)]" />
            <div className="absolute -top-1 -right-1 text-[8px] animate-bounce">❄</div>
            <div className="absolute -bottom-1 -left-1 text-[6px] text-cyan-200">💎</div>
          </>
        );
      case 'cyber-laser':
        return (
          <>
            <div className="absolute inset-0 rounded-full border-2 border-pink-500 shadow-[0_0_12px_rgba(236,72,153,0.8)]" />
            <div className="absolute inset-1 rounded-full border border-teal-400 rotate-45 animate-pulse" />
          </>
        );
      case 'cosmic-star':
        return (
          <div className="absolute inset-0 rounded-full border-2 border-indigo-500 bg-gradient-to-tr from-purple-900/10 via-amber-500/5 to-indigo-900/10 animate-spin shadow-[0_0_12px_rgba(139,92,246,0.7)]" style={{ animationDuration: '8s' }} />
        );
      case 'legend-wings':
        return (
          <>
            <div className="absolute inset-0 rounded-full border-2 border-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.7)]" />
            {/* Crown Peak and Wings SVG accents overlaid */}
            <svg viewBox="0 0 100 100" className="absolute -inset-1.5 w-[112%] h-[112%] text-yellow-500 pointer-events-none drop-shadow-[0_2px_4px_rgba(234,179,8,0.4)]" fill="currentColor">
              <path d="M 50 12 L 53 22 L 47 22 Z" /> {/* Crown */}
              <path d="M 12 50 C 6 42, 6 32, 14 36 C 8 46, 12 54, 16 52 Z" /> {/* Left wing */}
              <path d="M 88 50 C 94 42, 94 32, 86 36 C 92 46, 88 54, 84 52 Z" /> {/* Right wing */}
            </svg>
          </>
        );
      case 'mythic-immortal':
        return (
          <>
            {/* Spiky and high stakes Red/Orange frames */}
            <div className="absolute inset-0 rounded-full border-2 border-rose-600 animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.8)]" />
            <div className="absolute -inset-1 rounded-full border border-dashed border-rose-400 animate-spin" style={{ animationDuration: '12s' }} />
            <span className="absolute -bottom-1 inset-x-0 mx-auto w-3 h-3 bg-rose-600 rotate-45 border border-white flex items-center justify-center text-[5px] text-white font-black">★</span>
          </>
        );
      case 'shadow-assassin':
        return (
          <div className="absolute inset-0 rounded-full border-2 border-slate-900 bg-slate-950/25 shadow-[0_0_8px_rgba(15,23,42,0.9)] opacity-80" />
        );
      case 'sakura-dream':
        return (
          <>
            <div className="absolute inset-0 rounded-full border-2 border-pink-400 shadow-[0_0_6px_rgba(244,114,182,0.5)] bg-pink-500/5" />
            <div className="absolute -top-0.5 right-1.5 text-[7px] text-pink-300 animate-pulse">🌸</div>
            <div className="absolute -bottom-1 left-2 text-[6px] text-pink-300">✿</div>
          </>
        );
      case 'abysm-lord':
        return (
          <>
            <div className="absolute inset-0 rounded-full border-2 border-red-700 bg-black/45 shadow-[0_0_14px_rgba(153,27,27,0.9)]" />
            <svg viewBox="0 0 100 100" className="absolute -inset-2.5 w-[120%] h-[120%] text-red-650 pointer-events-none" fill="currentColor">
              {/* Spikes */}
              <polygon points="50,12 46,24 54,24" fill="#ef4444" />
              <polygon points="12,50 24,46 24,54" fill="#991b1b" />
              <polygon points="88,50 76,46 76,54" fill="#991b1b" />
              <polygon points="50,88 46,76 54,76" fill="#991b1b" />
            </svg>
          </>
        );
      case 'star-guardian':
        return (
          <>
            <div className="absolute inset-0 rounded-full border-2 border-sky-400" />
            <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-[9px] text-sky-300 animate-bounce">✦</span>
            <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 text-[9px] text-sky-400">✦</span>
          </>
        );
      case 'dragon-soul':
        return (
          <>
            <div className="absolute inset-0 rounded-full border-2 border-emerald-500 bg-gradient-to-b from-transparent to-emerald-950/20" />
            <div className="absolute -inset-1 rounded-full border border-dashed border-emerald-400/50 animate-spin" style={{ animationDuration: '10s' }} />
            <span className="absolute right-0 top-0 text-[8px] text-emerald-300">🐲</span>
          </>
        );
      case 'arcade-matrix':
        return (
          <div className="absolute inset-0 rounded-full border-2 border-blue-500 border-dashed animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
        );
      case 'venom-pulse':
        return (
          <>
            <div className="absolute inset-0 rounded-full border-[2.5px] border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]" />
            <div className="absolute inset-0.5 rounded-full border border-lime-400 animate-pulse" />
          </>
        );
      case 'gold-champion':
        return (
          <>
            <div className="absolute inset-0 rounded-full border-[3px] border-yellow-600 bg-gradient-to-r from-yellow-300 via-yellow-600 to-yellow-800 shadow-[0_0_15px_rgba(202,138,4,0.8)]" />
            <div className="absolute inset-[1px] rounded-full border border-[#fef08a]" />
          </>
        );
      case 'celestial-god':
        return (
          <>
            <div className="absolute inset-0 rounded-full border-2 border-indigo-100 bg-gradient-to-tr from-amber-200/20 to-indigo-100/20 shadow-[0_0_12px_rgba(254,240,138,0.8)]" />
            <div className="absolute -inset-1.5 rounded-full border border-yellow-250 animate-ping opacity-25" style={{ animationDuration: '4s' }} />
          </>
        );
      case 'void-wanderer':
        return (
          <div className="absolute inset-0 rounded-full border-2 border-purple-600 shadow-[0_0_12px_rgba(168,85,247,0.7)] animate-pulse" />
        );
      case 'kiba-exclusive':
        return (
          <>
            {/* Highly engineered custom hot red-orange glowing ring */}
            <div className="absolute inset-0 rounded-full border-[3px] border-t-amber-500 border-r-rose-600 border-b-amber-600 border-l-red-650 animate-spin" style={{ animationDuration: '2s' }} />
            <div className="absolute inset-[1.5px] rounded-full border border-yellow-300" />
            <div className="absolute -inset-1 rounded-full bg-amber-500/10 shadow-[0_0_20px_rgba(217,119,6,0.7)] animate-pulse" />
            <span className="absolute -top-1 right-2 text-[7px] animate-bounce">🔥</span>
            <span className="absolute -bottom-1 left-2 text-[6px]">👑</span>
          </>
        );
      case 'neon-shogun':
        return (
          <>
            <div className="absolute inset-0 rounded-full border-2 border-fuchsia-500 shadow-[0_0_12px_rgba(217,70,239,0.8)]" />
            <div className="absolute -top-1 left-1 bg-fuchsia-600 w-2 h-1 rounded transform rotate-12" />
            <div className="absolute -bottom-1 right-1 bg-fuchsia-600 w-2 h-1 rounded transform rotate-12" />
          </>
        );
      case 'emerald-aurora':
        return (
          <div className="absolute inset-0 rounded-full border-2 border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.7)] animate-pulse" />
        );
      case 'shinobi-headband':
        return (
          <>
            <div className="absolute inset-0 rounded-full border-2 border-sky-400/80 shadow-[0_0_8px_rgba(56,189,248,0.5)]" />
            {/* Standard headband metallic strip on top */}
            <div className="absolute -top-1.5 inset-x-0 mx-auto w-10 h-3 bg-gradient-to-b from-slate-200 via-slate-400 to-slate-500 rounded-sm border border-slate-600 flex items-center justify-center shadow-md z-10">
              {/* Leaf Crest engraved */}
              <div className="w-1.5 h-1.5 rounded-full border border-slate-800 flex items-center justify-center relative scale-75">
                <div className="w-1 h-0.5 bg-slate-800 rotate-12 absolute" />
              </div>
              {/* Rivets */}
              <span className="absolute left-0.5 top-1 w-0.5 h-0.5 rounded-full bg-slate-800" />
              <span className="absolute right-0.5 top-1 w-0.5 h-0.5 rounded-full bg-slate-800" />
            </div>
            {/* Tied cloth knots on sides */}
            <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1.5 h-3 bg-sky-900 rounded-l" />
            <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-1.5 h-3 bg-sky-900 rounded-r" />
          </>
        );
      case 'super-saiyan':
        return (
          <>
            <div className="absolute inset-0 rounded-full border-[3px] border-amber-450 animate-pulse bg-gradient-to-tr from-amber-500/10 via-yellow-400/10 to-transparent shadow-[0_0_18px_rgba(234,179,8,1)]" />
            {/* Floating electric spikes */}
            <div className="absolute -inset-1 rounded-full border border-dashed border-cyan-400 animate-spin opacity-80" style={{ animationDuration: '4s' }} />
            <div className="absolute -top-1.5 left-2 animate-bounce text-[6.5px] text-yellow-300">⚡</div>
            <div className="absolute -bottom-1 right-2 animate-bounce text-[6.5px] text-cyan-300">⚡</div>
          </>
        );
      case 'sharingan-eye':
         return (
           <>
             {/* Rich Red eyeball crimson track */}
             <div className="absolute inset-0 rounded-full border-[3px] border-red-650 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.9)]" />
             <div className="absolute inset-1 rounded-full border border-slate-950/40 animate-spin" style={{ animationDuration: '6s' }}>
                {/* 3 Tomoe blades positioned at 120 deg steps */}
                <div className="absolute top-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-slate-950 rounded-full flex items-center justify-center">
                  <div className="w-1 h-1.5 bg-slate-950 rounded-tr-full transform rotate-45 -translate-y-[1px]" />
                </div>
                <div className="absolute bottom-1.5 left-1 w-1.5 h-1.5 bg-slate-950 rounded-full flex items-center justify-center">
                  <div className="w-1 h-1.5 bg-slate-950 rounded-tr-full transform rotate-[165deg] -translate-y-[1px]" />
                </div>
                <div className="absolute bottom-1.5 right-1 w-1.5 h-1.5 bg-slate-150 bg-slate-950 rounded-full flex items-center justify-center">
                  <div className="w-1 h-1.5 bg-slate-950 rounded-tr-full transform rotate-[285deg] -translate-y-[1px]" />
                </div>
             </div>
           </>
         );
      case 'water-breathing':
         return (
           <>
             <div className="absolute inset-0 rounded-full border-2 border-sky-500 shadow-[0_0_12px_rgba(14,165,233,0.85)] animate-pulse" />
             {/* Swirling active foaming water trails */}
             <div className="absolute -inset-1 rounded-full border border-dashed border-cyan-200 animate-spin" style={{ animationDuration: '3.5s' }} />
             <span className="absolute -top-1 right-1 text-[8px] animate-pulse">🌊</span>
             <span className="absolute -bottom-1 left-2 text-[6px] text-sky-200">❄</span>
           </>
         );
      case 'sun-god':
         return (
           <>
             <div className="absolute inset-0 rounded-full border-[3px] border-yellow-400 bg-gradient-to-tr from-amber-450/10 to-slate-100/10 shadow-[0_0_16px_rgba(253,224,71,0.9)] animate-pulse" />
             {/* Deity White Clouds wrappers on borders */}
             <div className="absolute -inset-1.5 rounded-full border border-dashed border-white/60 animate-spin" style={{ animationDuration: '8s' }} />
             <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-2 bg-white rounded-full border border-slate-300 shadow flex items-center justify-center">
               <span className="text-[5px] text-slate-400 leading-none">☁</span>
             </div>
             <div className="absolute -bottom-1 right-2 w-3.5 h-2 bg-white rounded-full border border-slate-300 shadow flex items-center justify-center">
               <span className="text-[4px] text-slate-400 leading-none">☁</span>
             </div>
           </>
         );
      case 'hollow-mask':
         return (
           <>
             {/* Bone-like outer plate with red spikes */}
             <div className="absolute inset-0 rounded-full border-2 border-stone-200 shadow-[0_0_14px_rgba(220,38,38,0.7)]" />
             <div className="absolute -inset-1 rounded-full border-2 border-red-600 border-t-transparent border-b-transparent animate-pulse" />
             {/* Scary white hollow guard spikes at top */}
             <svg viewBox="0 0 100 100" className="absolute -inset-2.5 w-[120%] h-[120%] text-stone-200 pointer-events-none drop-shadow-md" fill="currentColor">
               <polygon points="40,11 44,22 41,22" />
               <polygon points="60,11 56,22 59,22" />
               <path d="M 35 15 L 65 15 L 50 25 Z" fill="#dc2626" opacity="0.8" /> {/* Splatters */}
             </svg>
           </>
         );
      case 'shadow-sovereign':
         return (
           <>
             <div className="absolute inset-0 rounded-full border-[2.5px] border-violet-600 bg-violet-950/10 shadow-[0_0_15px_rgba(124,58,237,0.9)]" />
             {/* Whimsical purple smoke spirals */}
             <div className="absolute -inset-1 rounded-full border-2 border-dashed border-purple-500 animate-spin opacity-50" style={{ animationDuration: '5s' }} />
             <div className="absolute -top-1 right-2.5 text-[7px] animate-bounce">🔮</div>
             <div className="absolute -bottom-1 left-2 text-[6px] animate-pulse">✨</div>
           </>
         );
      case 'domain-limitless':
         return (
           <>
             <div className="absolute inset-0 rounded-full border-2 border-cyan-400 shadow-[0_0_14px_rgba(6,182,212,0.85)]" />
             {/* Double expanding target gravity circles */}
             <div className="absolute -inset-1 rounded-full border border-dashed border-cyan-300 animate-pulse" />
             <div className="absolute inset-1.5 rounded-full border border-cyan-200 animate-pulse" />
           </>
         );
      case 'curse-seal':
         return (
           <>
             <div className="absolute inset-0 rounded-full border-2 border-purple-800 shadow-[0_0_10px_rgba(168,85,247,0.6)]" />
             {/* Triple curse tomoe/marks printed as small black dots around frame */}
             <div className="absolute inset-0 rounded-full border border-dashed border-purple-950 animate-spin" style={{ animationDuration: '11s' }} />
             <span className="absolute top-0 right-1 text-[6px] text-purple-400 rotate-12">🌀</span>
             <span className="absolute bottom-1 left-1 text-[6px] text-purple-400 rotate-45">🌀</span>
           </>
         );
      default:
        // Plain simple circle border suitable for baseline aesthetics
        return (
          <div className={`absolute inset-0 rounded-full border ${borderWidth} border-amber-500/35`} />
        );
    }
  };

  return (
    <div
      onClick={onClick}
      className={`relative rounded-full flex items-center justify-center shrink-0 ${containerSize} ${
        onClick ? 'cursor-pointer select-none transition-transform active:scale-95' : ''
      } ${className}`}
      style={{
        boxShadow: borderId !== 'default' ? `0 0 14px ${border.glowColor}` : 'none'
      }}
    >
      {/* 1. Underlying background or subtle border aura */}
      <div className="absolute inset-1.5 rounded-full bg-slate-900 overflow-hidden">
        {/* Profile Image avatar */}
        <img
          src={avatarUrl || 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=100'}
          alt={border.name}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* 2. Absolute overlaying premium game styled borders */}
      {renderBorderFrame()}
    </div>
  );
}

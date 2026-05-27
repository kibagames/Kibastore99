import React, { useState } from 'react';
import { Copy, Check, QrCode, ShieldCheck, Heart, Sparkles, Award } from 'lucide-react';

export default function PaymentQrCard({ price, theme }: { price: string; theme: 'dark' | 'light' }) {
  const upiId = 'kebamimi1@oksbi';
  const [copied, setCopied] = useState(false);

  const copyUPI = async () => {
    try {
      await navigator.clipboard.writeText(upiId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy UPI ID:', err);
    }
  };

  // Dynamic UPI URL to make scanning actually functional and fast
  const upiUrl = `upi://pay?pa=${upiId}&pn=Kiba%20Official%20Store&am=${price.replace(/[^0-9]/g, '')}&cu=INR`;

  return (
    <div className={`relative overflow-hidden rounded-3xl border transition-all duration-300 ${
      theme === 'dark' 
        ? 'border-amber-500/35 bg-slate-950/90 text-slate-100 shadow-[0_0_25px_rgba(245,158,11,0.15)]' 
        : 'border-slate-300 bg-white text-slate-900 shadow-xl'
      } p-6 max-w-sm mx-auto`}
    >
      {/* Golden Frame Art Borders from the image */}
      <div className="absolute top-2 left-2 w-5 h-5 border-t border-l border-amber-500/60" />
      <div className="absolute top-2 right-2 w-5 h-5 border-t border-r border-amber-500/60" />
      <div className="absolute bottom-2 left-2 w-5 h-5 border-b border-l border-amber-500/60" />
      <div className="absolute bottom-2 right-2 w-5 h-5 border-b border-r border-amber-500/60" />

      {/* Decorative floral corners */}
      <div className="absolute top-2.5 left-2.5 text-[8px] text-amber-500/40 select-none">🗎</div>
      <div className="absolute top-2.5 right-2.5 text-[8px] text-amber-500/40 select-none">🗏</div>

      {/* Header Region - Visual Poster Recreation */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-indigo-950/80 via-slate-950 to-slate-950 p-4 border border-amber-500/20 text-center mb-5">
        {/* Abstract vector graphics acting as the background character & clouds of Cici */}
        <div className="absolute inset-x-0 top-0 h-full opacity-25 pointer-events-none">
          {/* Sky background with glowing paper lanterns */}
          <svg viewBox="0 0 100 60" className="w-full h-full">
            <radialGradient id="twilight-sky" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.4" />
              <stop offset="60%" stopColor="#ec4899" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#030712" stopOpacity="0" />
            </radialGradient>
            <rect width="100" height="60" fill="url(#twilight-sky)" />
            {/* Lanterns */}
            <circle cx="20" cy="15" r="2.5" fill="#f97316" filter="blur(0.5px)" className="animate-pulse" />
            <line x1="20" y1="10" x2="20" y2="13" stroke="#f97316" strokeWidth="0.3" />
            <circle cx="80" cy="25" r="3" fill="#f43f5e" filter="blur(0.5px)" className="animate-pulse" style={{ animationDelay: '1s' }} />
            <line x1="80" y1="15" x2="80" y2="22" stroke="#f43f5e" strokeWidth="0.3" />
            
            {/* Maple Leaves Silhouette */}
            <path d="M5,40 C10,42 15,38 20,44" stroke="#f43f5e" strokeWidth="0.5" opacity="0.3" />
            <path d="M95,15 C90,18 85,14 80,18" stroke="#f43f5e" strokeWidth="0.5" opacity="0.3" />
          </svg>
        </div>

        {/* Character Silhouette Illustration resembling the game skin from Kiba QR */}
        <div className="relative z-10 mx-auto w-12 h-12 rounded-full border border-amber-500/40 bg-slate-900 flex items-center justify-center mb-2.5">
          <svg viewBox="0 0 32 32" className="w-9 h-9 text-amber-500" fill="currentColor">
            {/* Crowned game avatar symbol */}
            <path d="M16 2a4 4 0 00-4 4v1a1.5 1.5 0 01-1.5 1.5h-1a1.5 1.5 0 00-1.5 1.5v3a1.5 1.5 0 001.5 1.5h1A1.5 1.5 0 0112 15v1.5a4 4 0 008 0V15a1.5 1.5 0 011.5-1.5h1A1.5 1.5 0 0024 12V9a1.5 1.5 0 00-1.5-1.5h-1A1.5 1.5 0 0120 6V4a4 4 0 00-4-2zM10 22h12a2 2 0 012 2v4a2 2 0 01-2 2H10a2 2 0 01-2-2v-4a2 2 0 012-2z" />
          </svg>
        </div>

        {/* Typography exactly as in the image */}
        <div className="relative z-10 text-center">
          <h2 className="text-2xl font-black font-display tracking-widest text-center text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 uppercase drop-shadow-[0_1px_6px_rgba(0,0,0,0.85)] leading-none">
            KIBA
          </h2>
          <div className="text-[10px] font-bold tracking-[0.25em] text-white uppercase mt-0.5 opacity-90">
            OFFICIAL STORE
          </div>
          {/* Subtle laurel twigs icon */}
          <div className="flex items-center justify-center gap-1.5 text-[8px] text-amber-500 mt-1">
            <span>✿ ✿ ✿</span>
            <span className="font-mono tracking-widest text-[7px] uppercase text-slate-450">INSTANT UPI</span>
            <span>✿ ✿ ✿</span>
          </div>
        </div>
      </div>

      {/* QR Code Scan Area */}
      <div className="flex flex-col items-center space-y-4">
        
        {/* UPI QR Canvas Frame */}
        <div className="relative p-3.5 rounded-3xl bg-white border border-amber-500/40 flex flex-col items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.1)]">
          <div className="w-48 h-48 flex flex-col items-center justify-center relative bg-white rounded-2xl overflow-hidden p-1.5">
            <img
              src="https://i.imgur.com/kFK8ws9.jpeg"
              alt="Kiba Official UPI QR"
              className="w-full h-full object-contain select-none transition-transform hover:scale-102"
              referrerPolicy="no-referrer"
            />
          </div>
          
          <div className="mt-2 text-[8px] text-slate-500 font-mono tracking-widest uppercase font-bold text-center">
            ✦ SCAN WITH ANY UPI APP ✦
          </div>
        </div>

        {/* UPI Copier interface */}
        <div className="w-full space-y-2">
          <div className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl border text-xs font-mono font-bold ${
            theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="truncate text-amber-500 font-bold select-all pr-2">
              {upiId}
            </div>
            <button
              type="button"
              onClick={copyUPI}
              className={`p-2 rounded-xl transition-all hover:scale-105 cursor-pointer ${
                theme === 'dark' ? 'bg-slate-950 hover:bg-slate-800 text-slate-300' : 'bg-white hover:bg-slate-100 text-slate-600 shadow-sm'
              }`}
              title="Copy UPI ID"
            >
              {copied ? (
                <Check size={14} className="text-emerald-500" />
              ) : (
                <Copy size={14} className={theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-indigo-600'} />
              )}
            </button>
          </div>

          <div className="text-center space-y-1 bg-amber-500/5 border border-amber-500/10 rounded-2xl p-3">
            <span className={`text-[10px] uppercase font-mono tracking-wider block font-bold ${
              theme === 'dark' ? 'text-amber-400' : 'text-amber-700'
            }`}>
              PAYMENT DUE: <span className="text-[17px] font-black font-sans font-black tracking-tight">{price}</span>
            </span>
            <p className="text-[9px] text-slate-400 leading-relaxed">
              Scan QR above or save the UPI ID to pay. Complete your transfer, then insert the 12-digit transaction UTR reference index below.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

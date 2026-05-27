import React from 'react';
import { Globe, Moon, ShieldAlert, Key, Zap, Flame } from 'lucide-react';
import { motion } from 'motion/react';

interface BannerProps {
  theme: 'dark' | 'light';
}

export default function Banner({ theme }: BannerProps) {
  const isDark = theme === 'dark';

  return (
    <div className="space-y-4">
      {/* Visual Game Theme Promo card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative overflow-hidden rounded-3xl border p-6 transition-all duration-300 ${
          isDark
            ? 'border-amber-500/20 bg-slate-950/80 shadow-[0_0_35px_rgba(245,158,11,0.05)]'
            : 'border-slate-200 bg-white shadow-xl'
        }`}
      >
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-sky-500/5 rounded-full blur-2xl -z-10" />

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span className={`text-[10px] uppercase tracking-widest font-mono font-bold ${
              isDark ? 'text-amber-400' : 'text-amber-700'
            }`}>
              Kiba Official Promo
            </span>
          </div>

          <h3 className={`font-display font-black text-xl sm:text-2xl tracking-tight -mt-1 uppercase ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            MLBB SECURED TOP-UP
          </h3>

          <p className={`text-xs leading-relaxed font-sans ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
            Ready to unlock the finest MLBB skins? KIBA OFFICIAL is India's premium dealer offering fast, 100% genuine Moonton direct diamond deposit packages. Completely isolated, legit, and verified.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className={`flex items-center gap-2.5 rounded-2xl p-3 border ${
              isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <Zap className="text-amber-500 shrink-0" size={16} />
              <div>
                <span className="text-[9px] text-slate-500 font-mono block">DELIVERY</span>
                <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>10–120 Mins</span>
              </div>
            </div>
            <div className={`flex items-center gap-2.5 rounded-2xl p-3 border ${
              isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <Flame className="text-amber-550 shrink-0" size={16} />
              <div>
                <span className="text-[9px] text-slate-500 font-mono block">SUPPORT</span>
                <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>WhatsApp 24/7</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Grid of Key badges inspired by the reference screenshot */}
      <div className="grid grid-cols-1 gap-3">
        {/* Item 1: All Regions Working */}
        <div className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
          isDark ? 'bg-slate-950/80 border-slate-900 hover:border-amber-500/30' : 'bg-white border-slate-200 hover:border-amber-600/30 shadow-sm'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-full border flex items-center justify-center bg-amber-950/10 text-amber-500 ${
              isDark ? 'border-amber-500/20' : 'border-amber-500/30'
            }`}>
              <Globe size={18} />
            </div>
            <div>
              <div className="text-[9px] font-mono uppercase text-slate-400 tracking-wider">ALL REGIONS</div>
              <div className="text-base font-black text-amber-500 font-display">WORKING</div>
            </div>
          </div>
          <span className="text-[9px] font-mono font-bold text-emerald-500 bg-emerald-950/20 border border-emerald-900 px-2.5 py-1 rounded-full uppercase">
            Active
          </span>
        </div>

        {/* Item 2: Process Evening -> Midnight */}
        <div className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
          isDark ? 'bg-slate-950/80 border-slate-900 hover:border-amber-500/30' : 'bg-white border-slate-200 hover:border-amber-600/30 shadow-sm'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-full border flex items-center justify-center bg-amber-950/10 text-amber-500 ${
              isDark ? 'border-amber-500/20' : 'border-amber-500/30'
            }`}>
              <Moon size={18} />
            </div>
            <div>
              <div className="text-[9px] font-mono uppercase text-slate-400 tracking-wider">PROCESS SCHEDULE</div>
              <div className={`text-base font-black font-display uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>
                EVENING → MIDNIGHT
              </div>
            </div>
          </div>
          <span className="text-[9px] font-mono font-bold text-amber-500 bg-amber-950/20 border border-amber-900 px-2.5 py-1 rounded-full uppercase">
            Normal
          </span>
        </div>

        {/* Item 3: Login via Moonton */}
        <div className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
          isDark ? 'bg-slate-950/80 border-slate-900 hover:border-amber-500/30' : 'bg-white border-slate-200 hover:border-amber-600/30 shadow-sm'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-full border flex items-center justify-center bg-amber-950/10 text-amber-500 ${
              isDark ? 'border-amber-500/20' : 'border-amber-500/30'
            }`}>
              <Key size={18} />
            </div>
            <div>
              <div className="text-[9px] font-mono uppercase text-slate-400 tracking-wider">AUTHENTICATOR</div>
              <div className="text-base font-black text-amber-500 font-display uppercase">MOONTON CONNECT</div>
            </div>
          </div>
          <span className="text-[9px] font-mono text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-full uppercase">
            Required
          </span>
        </div>

        {/* Item 4: Turn off New Device Verification */}
        <div className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
          isDark ? 'bg-slate-950/80 border-slate-900 hover:border-amber-500/30' : 'bg-white border-slate-200 hover:border-amber-600/30 shadow-sm'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full border border-rose-500/30 flex items-center justify-center bg-rose-950/10 text-rose-500">
              <ShieldAlert size={18} />
            </div>
            <div>
              <div className="text-[9px] font-mono uppercase text-slate-400 tracking-wider">PREREQUISITE STATE</div>
              <div className="text-base font-black text-rose-500 font-display uppercase">TURN OFF VERIFICATION</div>
            </div>
          </div>
          <span className="text-[9px] font-mono font-bold text-rose-500 bg-rose-950/20 border border-rose-950 px-2.5 py-1 rounded-full uppercase">
            Alert
          </span>
        </div>
      </div>
    </div>
  );
}

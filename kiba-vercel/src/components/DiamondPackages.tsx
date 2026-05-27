import React from 'react';
import { ShoppingCart, ShieldAlert, Sparkles, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import DiamondChestSvg from './DiamondChestSvg';

interface Pack {
  diamonds: string;
  price: string;
}

interface DiamondPackagesProps {
  onSelectPackage: (pack: Pack) => void;
  selectedPackage: Pack | null;
  theme: 'dark' | 'light';
}

export const packages: Pack[] = [
  { diamonds: '1765', price: '₹1900' },
  { diamonds: '2920', price: '₹2950' },
  { diamonds: '3530', price: '₹3600' },
  { diamonds: '4685', price: '₹4650' },
  { diamonds: '5295', price: '₹5250' },
  { diamonds: '6450', price: '₹6300' },
  { diamonds: '7060', price: '₹7000' },
  { diamonds: '10590', price: '₹9700' },
];

export default function DiamondPackages({ onSelectPackage, selectedPackage, theme }: DiamondPackagesProps) {
  const isDark = theme === 'dark';

  return (
    <div className={`w-full border rounded-3xl p-6 transition-all duration-300 ${
      isDark
        ? 'bg-slate-950/80 border-amber-500/20 shadow-[0_0_30px_rgba(245,158,11,0.05)]'
        : 'bg-white border-slate-200 shadow-xl'
    }`}>
      {/* Header */}
      <div className="text-center mb-6">
        <span className={`text-[10px] font-bold tracking-widest uppercase font-mono px-4 py-1.5 rounded-full border ${
          isDark 
            ? 'text-amber-400 bg-amber-950/40 border-amber-950/60' 
            : 'text-amber-700 bg-amber-50 border-amber-200'
        }`}>
          — CHEAPEST IN THE MARKET —
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-amber-500 tracking-tight mt-3 uppercase font-display flex items-center justify-center gap-2">
          SELECT DIAMONDS Pack
        </h2>
      </div>

      {/* Package Grid List */}
      <div className="space-y-3">
        {packages.map((pack, idx) => {
          const isSelected = selectedPackage?.diamonds === pack.diamonds;
          return (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.01, x: 2 }}
              onClick={() => onSelectPackage(pack)}
              className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all duration-200 border ${
                isDark
                  ? isSelected
                    ? 'bg-amber-950/20 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                    : 'bg-slate-900/40 border-slate-900 hover:border-amber-500/30 hover:bg-slate-900/60'
                  : isSelected
                    ? 'bg-amber-50 border-amber-600 shadow-sm'
                    : 'bg-slate-50 border-slate-200 hover:border-amber-500/30 hover:bg-white'
              }`}
            >
              {/* Left Column: Icon & Diamond Info */}
              <div className="flex items-center gap-3">
                <div className={`w-14 h-14 rounded-xl border flex items-center justify-center shadow-md transition-colors shrink-0 overflow-visible ${
                  isDark
                    ? isSelected 
                      ? 'bg-amber-950 border-amber-500 shadow-[0_0_12px_rgba(30,58,138,0.3)]'
                      : 'bg-slate-950 border-amber-500/10'
                    : isSelected
                      ? 'bg-amber-100 border-amber-500'
                      : 'bg-white border-slate-200'
                }`}>
                  {/* High Quality Game Styled Diamond Chest Graphic */}
                  <DiamondChestSvg size={42} className="transform hover:scale-110 transition-transform" />
                </div>
                <div>
                  <div className={`font-display font-black text-base sm:text-lg tracking-wide ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    {pack.diamonds}
                  </div>
                  <div className="text-[10px] text-emerald-500 font-mono flex items-center gap-1 font-bold">
                    <CheckCircle size={10} className="shrink-0" />
                    Available
                  </div>
                </div>
              </div>

              {/* Right Column: Price and Cart Trigger */}
              <div className="flex items-center gap-3">
                <span className={`font-mono text-xl sm:text-2xl font-black px-4 py-1.5 rounded-xl border ${
                  isDark
                    ? 'text-amber-400 bg-amber-950/20 border-amber-950'
                    : 'text-amber-700 bg-amber-50 border-amber-200'
                }`}>
                  {pack.price}
                </span>
                
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectPackage(pack);
                  }}
                  className={`hidden sm:flex items-center justify-center p-2 rounded-xl transition-all ${
                    isDark
                      ? isSelected
                        ? 'bg-amber-500 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:scale-105'
                        : 'bg-slate-800 text-slate-300 hover:bg-amber-500 hover:text-slate-950'
                      : isSelected
                        ? 'bg-amber-600 text-white hover:scale-105'
                        : 'bg-slate-200 text-slate-700 hover:bg-amber-600 hover:text-white'
                  }`}
                >
                  <ShoppingCart size={16} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Safety Notice Footer */}
      <div className={`mt-5 p-4 rounded-xl border flex gap-3 text-xs leading-relaxed ${
        isDark ? 'bg-slate-900/50 border-slate-850 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
      }`}>
        <ShieldAlert size={28} className="text-amber-500 shrink-0 mt-0.5 animate-pulse" />
        <div>
          <span className="text-amber-500 font-black uppercase block mb-0.5">Automated UPI Settlement</span>
          Save and capture the UPI Transaction UTR verification reference ID to enter on submission. Moonton secure credentials are kept isolated strictly in temporary state.
        </div>
      </div>
    </div>
  );
}

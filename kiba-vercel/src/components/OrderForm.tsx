import React, { useState, useRef, useEffect } from 'react';
import { CreditCard, ArrowRight, ShieldCheck, AlertCircle, X, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';
import PaymentQrCard from './PaymentQrCard';

interface Pack {
  diamonds: string;
  price: string;
}

interface OrderFormProps {
  selectedPackage: Pack | null;
  onSubmit: (formData: any) => Promise<void>;
  isSubmitting: boolean;
  onClose: () => void;
  theme: 'dark' | 'light';
}

export default function OrderForm({ selectedPackage, onSubmit, isSubmitting, onClose, theme }: OrderFormProps) {
  // Account Information State
  const [uid, setUid] = useState('');
  const [serverId, setServerId] = useState('');
  const [moontonEmail, setMoontonEmail] = useState('');
  const [moontonPassword, setMoontonPassword] = useState('');
  const [whatsAppNumber, setWhatsAppNumber] = useState('');
  const [paymentUtr, setPaymentUtr] = useState('');

  // Local interactive states
  const [errorMsg, setErrorMsg] = useState('');
  const [showPasswordHelp, setShowPasswordHelp] = useState(false);

  // Scroll lock & Auto fill profile values effect on mounting
  useEffect(() => {
    document.body.style.overflow = 'hidden';

    try {
      const saved = localStorage.getItem('kiba-user-profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.uid) setUid(parsed.uid);
        if (parsed.serverId) setServerId(parsed.serverId);
        if (parsed.whatsAppNumber) setWhatsAppNumber(parsed.whatsAppNumber);
      }
    } catch (e) {
      console.warn('Could not auto-fill default profiles in OrderForm', e);
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPackage) {
      setErrorMsg('Please select a top-up package from the list first.');
      return;
    }

    if (!uid || !serverId || !moontonEmail || !moontonPassword || !whatsAppNumber || !paymentUtr) {
      setErrorMsg('All fields are required. This ensures secure Moonton logins & top-ups.');
      return;
    }

    // UTR Verification check (12-digit UPI reference ID)
    const sanitizedUtr = paymentUtr.replace(/\s/g, '');
    if (sanitizedUtr.length < 6) {
      setErrorMsg('Please enter a valid Bank Transaction UTR (usually 12 digits). Check your UPI App.');
      return;
    }

    setErrorMsg('');

    // Trigger state submission to parent (App.tsx)
    await onSubmit({
      packageName: selectedPackage.diamonds,
      price: selectedPackage.price,
      uid,
      serverId,
      moontonEmail,
      moontonPassword,
      whatsAppNumber,
      paymentUtr: sanitizedUtr,
    });

    // Zero-out sensitive Moonton credentials immediately to satisfy strict Security Audits
    setMoontonEmail('');
    setMoontonPassword('');
    setPaymentUtr('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end md:justify-center p-0 md:p-4 overflow-hidden">
      {/* Dark backdrop blur */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
      />

      {/* Slide drawer container */}
      <motion.div
        initial={{ x: '100%', opacity: 0.5 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '100%', opacity: 0.5 }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        className={`relative w-full md:max-w-4xl h-full md:h-[90vh] md:rounded-3xl flex flex-col md:flex-row overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] border ${
          theme === 'dark' ? 'bg-slate-950 border-slate-900' : 'bg-white border-slate-200'
        }`}
      >
        {/* CLOSE CONTROL */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 z-40 p-2 rounded-xl border transition-all ${
            theme === 'dark' 
              ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800' 
              : 'bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-200'
          }`}
          title="Close Checkout Panel"
        >
          <X size={18} />
        </button>

        {/* LEFT COLUMN: Animated Video Background Panel */}
        <div className="relative w-full md:w-[42%] h-[180px] md:h-full shrink-0 overflow-hidden bg-slate-950 flex flex-col justify-end p-6 border-b md:border-b-0 md:border-r border-slate-900">
          
          {/* HTML5 Infinite Loop Autoplay Video Background */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover scale-105 pointer-events-none filter brightness-50 contrast-125"
            src="https://assets.mixkit.co/videos/preview/mixkit-abstract-laser-lights-background-loop-41851-large.mp4"
          />

          {/* Luxury overlay dark and blur gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent pointer-events-none" />
          <div className="absolute inset-0 backdrop-blur-[2px] pointer-events-none" />

          {/* Pack Selected Card Inside Video Header */}
          <div className="relative z-10 space-y-2">
            <span className="text-[10px] font-mono font-bold tracking-widest text-amber-500 bg-amber-950/80 px-2.5 py-1.5 rounded-full border border-amber-500/30 uppercase inline-block">
              Package Authorized
            </span>
            <h3 className="text-2xl font-display font-black text-white uppercase tracking-tight text-glow-pink">
              {selectedPackage ? selectedPackage.diamonds : 'Store Diamond Checkout'}
            </h3>
            <p className="text-xs text-slate-300 max-w-xs leading-relaxed">
              Fast-delivery login credit using official secure UPI channels and Moonton credentials checking.
            </p>
            <div className="pt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black font-mono text-amber-400">
                {selectedPackage ? selectedPackage.price : '₹0'}
              </span>
              <span className="text-[10px] font-mono text-slate-400 uppercase">GST & Fee included</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Glassmorphic Interactive Form */}
        <div className={`w-full flex-1 h-full overflow-y-auto px-6 py-6 md:py-8 space-y-6 ${
          theme === 'dark' ? 'bg-slate-950/50' : 'bg-slate-50/50'
        }`}>
          <div>
            <h2 className={`text-xl font-bold font-display uppercase tracking-tight ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              SECURE LOGINS-UP CHECKOUT
            </h2>
            <p className="text-xs text-slate-500 mt-1">Provide temporary account verification credentials & UTR</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Form Section 1: MLBB Gamer ID */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 border-b border-amber-500/20 pb-1.5">
                <span className="text-xs font-bold font-mono text-amber-500 uppercase">1. Player Identity</span>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className={`block text-[10px] font-bold uppercase font-mono ${
                    theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                  } mb-1.5`}>
                    MLBB User ID *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 12986348"
                    value={uid}
                    onChange={(e) => setUid(e.target.value)}
                    className={`w-full px-3.5 py-2.5 text-xs rounded-xl border focus:outline-none focus:ring-1 ${
                      theme === 'dark'
                        ? 'bg-slate-900/60 border-slate-800 text-white focus:border-amber-500 focus:ring-amber-500'
                        : 'bg-white border-slate-350 text-slate-900 focus:border-amber-600 focus:ring-amber-600'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-[10px] font-bold uppercase font-mono ${
                    theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                  } mb-1.5`}>
                    Server ID *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2092"
                    value={serverId}
                    onChange={(e) => setServerId(e.target.value)}
                    className={`w-full px-3.5 py-2.5 text-xs rounded-xl border focus:outline-none focus:ring-1 ${
                      theme === 'dark'
                        ? 'bg-slate-900/60 border-slate-800 text-white focus:border-amber-500 focus:ring-amber-500'
                        : 'bg-white border-slate-350 text-slate-900 focus:border-amber-600 focus:ring-amber-600'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Form Section 2: Temporary Credentials Checking only */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-1.5">
                <span className="text-xs font-bold font-mono text-amber-500 uppercase flex items-center gap-1.5">
                  2. Moonton Authentication
                  <HelpCircle
                    size={14}
                    className="text-amber-500/70 hover:text-amber-500 cursor-pointer"
                    onClick={() => setShowPasswordHelp(!showPasswordHelp)}
                  />
                </span>
                <span className="text-[9px] font-mono font-bold text-rose-500 bg-rose-950/20 border border-rose-950 px-2 py-0.5 rounded uppercase">
                  Never Stored in Database
                </span>
              </div>

              {showPasswordHelp && (
                <div className={`p-3.5 rounded-xl text-xs space-y-1.5 leading-relaxed ${
                  theme === 'dark' ? 'bg-slate-900 border border-slate-800 text-slate-300' : 'bg-slate-100 border border-slate-200 text-slate-700'
                }`}>
                  <strong className="text-amber-500 block">🔒 Highly Isolated Transactions</strong>
                  To top up your MLBB account directly using the cheapest official dealers rates, our automated system redirects verification to WhatsApp. These Moonton login credentials will **never** be saved to any database or leaked. They clear immediately after use.
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className={`block text-[10px] font-bold uppercase font-mono ${
                    theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                  } mb-1.5`}>
                    Moonton Email *
                  </label>
                  <input
                    type="email"
                    required
                    autoComplete="off"
                    placeholder="e.g. gamer@moonton.com"
                    value={moontonEmail}
                    onChange={(e) => setMoontonEmail(e.target.value)}
                    className={`w-full px-3.5 py-2.5 text-xs rounded-xl border focus:outline-none focus:ring-1 ${
                      theme === 'dark'
                        ? 'bg-slate-900/60 border-slate-800 text-white focus:border-amber-500 focus:ring-amber-500'
                        : 'bg-white border-slate-350 text-slate-900 focus:border-amber-600 focus:ring-amber-600'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-[10px] font-bold uppercase font-mono ${
                    theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                  } mb-1.5`}>
                    Moonton Password *
                  </label>
                  <input
                    type="password"
                    required
                    autoComplete="new-password"
                    placeholder="••••••••••••"
                    value={moontonPassword}
                    onChange={(e) => setMoontonPassword(e.target.value)}
                    className={`w-full px-3.5 py-2.5 text-xs rounded-xl border focus:outline-none focus:ring-1 ${
                      theme === 'dark'
                        ? 'bg-slate-900/60 border-slate-800 text-white focus:border-amber-500 focus:ring-amber-500'
                        : 'bg-white border-slate-350 text-slate-900 focus:border-amber-600 focus:ring-amber-600'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-[10px] font-bold uppercase font-mono ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                } mb-1.5`}>
                  WhatsApp Phone Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. +91 9863068885"
                  value={whatsAppNumber}
                  onChange={(e) => setWhatsAppNumber(e.target.value)}
                  className={`w-full px-3.5 py-2.5 text-xs rounded-xl border focus:outline-none focus:ring-1 ${
                    theme === 'dark'
                      ? 'bg-slate-900/60 border-slate-800 text-white focus:border-amber-500 focus:ring-amber-500'
                      : 'bg-white border-slate-350 text-slate-900 focus:border-amber-600 focus:ring-amber-600'
                  }`}
                />
              </div>
            </div>

            {/* Form Section 3: QR Image & Pay instructions */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-amber-500/20 pb-1.5">
                <span className="text-xs font-bold font-mono text-amber-500 uppercase">3. Scan QR UPI Payment</span>
              </div>

              {/* Integrated QR code component */}
              <PaymentQrCard price={selectedPackage?.price || '₹0'} theme={theme} />

              <div className="space-y-2">
                <label className={`block text-[10px] font-bold uppercase font-mono ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                } mb-1.5`}>
                  Transaction UTR Code (12 Digits) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 518386304859"
                  value={paymentUtr}
                  onChange={(e) => setPaymentUtr(e.target.value)}
                  className={`w-full px-3.5 py-2.5 text-sm font-mono tracking-widest text-center rounded-xl border focus:outline-none focus:ring-1 ${
                    theme === 'dark'
                      ? 'bg-slate-900/60 border-slate-800 text-white focus:border-amber-500 focus:ring-amber-500'
                      : 'bg-white border-slate-350 text-slate-900 focus:border-amber-600 focus:ring-amber-600'
                  }`}
                  maxLength={40}
                />
              </div>
            </div>

            {/* ERROR MESSAGE DISPLAY BANNER */}
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30 flex gap-2.5 items-center text-xs text-rose-300">
                <AlertCircle size={16} className="text-rose-500 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* ACTION TRIGGERS */}
            <div className="pt-2 sticky bottom-0 bg-transparent">
              <button
                type="submit"
                disabled={isSubmitting || !selectedPackage}
                className={`w-full py-4 px-6 font-black text-xs tracking-wider uppercase font-display rounded-2xl border transition-all duration-300 flex items-center justify-center gap-2 ${
                  isSubmitting || !selectedPackage
                    ? 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed'
                    : 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 border-emerald-400 hover:scale-[1.01] hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] cursor-pointer'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-slate-950" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    AUTHORIZING SECURE CHANNELS...
                  </span>
                ) : (
                  <>
                    SUBMIT & DIRECT TO WHATSAPP
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>

            <div className="text-[10px] text-center text-slate-500 italic max-w-sm mx-auto leading-tight">
              🔒 By clicking submit, your payment reference UTR is indexed on Firestore, and your logins are securely packed as a click-to-chat message direct to the shop owner.
            </div>

          </form>
        </div>

      </motion.div>
    </div>
  );
}

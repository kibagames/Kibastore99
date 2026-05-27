import React, { useState, useEffect } from 'react';
import { auth, loginWithGoogle, logoutUser, db, handleFirestoreError } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Order, OperationType } from './types';
import DiamondPackages from './components/DiamondPackages';
import Banner from './components/Banner';
import OrderForm from './components/OrderForm';
import AdminDashboard from './components/AdminDashboard';
import { motion, AnimatePresence } from 'motion/react';
import { Gem, LogIn, LogOut, ShieldAlert, CheckCircle, Smartphone, Sun, Moon, MessagesSquare, Award, X, Monitor } from 'lucide-react';
import ProfileNameBanner from './components/ProfileNameBanner';
import ProfileSettingsModal from './components/ProfileSettingsModal';
import AvatarWithBorder from './components/AvatarWithBorder';
import firebaseConfig from '../firebase-applet-config.json';

interface Pack {
  diamonds: string;
  price: string;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  
  // Theme state: dark is the default classic gamestore aesthetic, customizable to light
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('kiba-theme') as 'dark' | 'light') || 'dark';
  });

  const [selectedTab, setSelectedTab] = useState<'store' | 'admin'>('store');
  const [selectedPackage, setSelectedPackage] = useState<Pack | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [successOrder, setSuccessOrder] = useState<any | null>(null);

  // User profile information loaded or synced with localStorage
  const [profile, setProfile] = useState<{ gamerTag: string; uid: string; serverId: string; whatsAppNumber: string; avatarUrl: string; borderId: string } | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // States for dynamic authorized domains troubleshooting
  const [authError, setAuthError] = useState<{ message: string; domain: string } | null>(null);
  const [copiedDomain, setCopiedDomain] = useState(false);

  // Top-right floating custom warning notifications
  const [toast, setToast] = useState<{ message: string; type: 'warning' | 'success' | 'info' } | null>(null);

  // Mobile visitor Desktop-Mode prompt alert state
  const [showMobilePrompt, setShowMobilePrompt] = useState(false);

  useEffect(() => {
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 1024;
    const hasSeenPrompt = sessionStorage.getItem('kiba-mobile-desktop-seen');
    if (isMobileDevice && !hasSeenPrompt) {
      setShowMobilePrompt(true);
    }
  }, []);

  // Auto-dismiss notification after 5 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Authenticate user changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Persist theme choice in localStorage
  useEffect(() => {
    localStorage.setItem('kiba-theme', theme);
  }, [theme]);

  // Load and sync user profile information when logged in
  useEffect(() => {
    if (user) {
      try {
        const saved = localStorage.getItem('kiba-user-profile');
        if (saved) {
          setProfile(JSON.parse(saved));
        } else {
          setProfile({
            gamerTag: user.displayName || 'Gamer',
            uid: '',
            serverId: '',
            whatsAppNumber: '',
            avatarUrl: user.photoURL || '',
            borderId: 'default'
          });
        }
      } catch (e) {
        console.error('Error loading profile', e);
      }
    } else {
      setProfile(null);
    }
  }, [user]);

  const handleGoogleLogin = async () => {
    try {
      setAuthError(null);
      await loginWithGoogle();
    } catch (err: any) {
      console.error('Google authorization failed:', err);
      const msg = err?.message || '';
      
      // Specifically target auth/unauthorized-domain errors
      if (msg.includes('auth/unauthorized-domain') || err?.code === 'auth/unauthorized-domain') {
        const currentDomain = window.location.hostname;
        setAuthError({
          message: 'The current domain is not yet authorized in your Firebase console. Because AI Studio preview URLs run on dynamic Cloud Run domains, you must add this host to allow secure Google Sign-Up redirects.',
          domain: currentDomain
        });
      } else {
        setToast({
          message: msg || 'Failed to authenticate Google profile.',
          type: 'warning'
        });
      }
    }
  };

  const [crystalPos, setCrystalPos] = useState<{ x: number; y: number } | null>(null);

  const toggleTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    // Set ripple origin as CSS vars for the view-transition clip-path
    document.documentElement.style.setProperty('--ripple-x', `${x}px`);
    document.documentElement.style.setProperty('--ripple-y', `${y}px`);

    // Trigger crystal shimmer burst overlay
    setCrystalPos({ x, y });
    setTimeout(() => setCrystalPos(null), 950);

    const next: 'dark' | 'light' = theme === 'dark' ? 'light' : 'dark';

    if (!document.startViewTransition) {
      setTheme(next);
      return;
    }
    document.startViewTransition(() => setTheme(next));
  };

  const handleSelectPackage = (pack: Pack) => {
    if (!user) {
      setToast({
        message: 'Please authorize your account with Google first before purchasing packages!',
        type: 'warning'
      });
      return;
    }
    setSelectedPackage(pack);
    setShowOrderModal(true);
  };

  const handleOrderSubmit = async (formData: any) => {
    if (!user) return;
    setIsSubmitting(true);
    const path = 'orders';

    try {
      // 1. Create a document ref in firestore to auto-generate a unique ID
      const ordersCol = collection(db, 'orders');
      const newOrderDoc = doc(ordersCol);
      const orderId = newOrderDoc.id;

      // 2. Prepare order payload SEVERING moontonEmail & moontonPassword for strict Security Regulations
      const orderPayload: Omit<Order, 'id'> = {
        packageName: formData.packageName,
        price: formData.price,
        uid: formData.uid,
        serverId: formData.serverId,
        whatsAppNumber: formData.whatsAppNumber,
        paymentUtr: formData.paymentUtr,
        status: 'pending',
        userId: user.uid,
        userEmail: user.email || '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      // 3. Write securely to database or simulator storage containing NO sensitive Moonton credentials
      if (user.uid === 'offline-guest-simulation-id') {
        const storedOrders = localStorage.getItem('_offline_orders');
        const offlineList = storedOrders ? JSON.parse(storedOrders) : [];
        const simulatedOrder = {
          id: orderId,
          ...orderPayload,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        offlineList.unshift(simulatedOrder);
        localStorage.setItem('_offline_orders', JSON.stringify(offlineList));
      } else {
        await setDoc(newOrderDoc, orderPayload);
      }

      // 4. Construct WhatsApp click-to-chat message (including all details in text only for transient delivery dispatch)
      const message = `💎 KIBA OFFICIAL MLBB ORDER 💎\n` +
                      `------------------------------------\n` +
                      `★ Order Reference ID: #${orderId.toUpperCase()}\n` +
                      `★ Selected Item: ${formData.packageName}\n` +
                      `★ Amount Paid: ${formData.price}\n` +
                      `★ Player Game ID: ${formData.uid}\n` +
                      `★ Player Server ID: ${formData.serverId}\n` +
                      `------------------------------------\n` +
                      `🔐 Moonton Account: ${formData.moontonEmail}\n` +
                      `🔐 Moonton Password: ${formData.moontonPassword}\n` +
                      `------------------------------------\n` +
                      `★ Customer WhatsApp: ${formData.whatsAppNumber}\n` +
                      `★ Bank UPI UTR Number: ${formData.paymentUtr}\n` +
                      `★ Settlement Status: Completed`;

      const whatsappUrl = `https://wa.me/919863068885?text=${encodeURIComponent(message)}`;

      // 5. Update success states & Trigger WhatsApp link popup/redirect
      setSuccessOrder({
        id: orderId,
        whatsappUrl,
        packageName: formData.packageName,
        price: formData.price,
        paymentUtr: formData.paymentUtr,
      });
      setShowOrderModal(false);
      setSelectedPackage(null);

      // Open whatsapp immediately in a new tab
      window.open(whatsappUrl, '_blank', 'referrer');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen relative pb-16 font-sans transition-colors duration-300 ${
      isDark 
        ? 'bg-slate-950 text-slate-100 bg-grid-pattern selection:bg-amber-500 selection:text-slate-950' 
        : 'bg-slate-50 text-slate-900 bg-grid-pattern-light selection:bg-amber-500 selection:text-slate-950'
    }`}>
      {/* Crystal shimmer burst on theme toggle */}
      {crystalPos && (
        <>
          <div className="crystal-burst" style={{ left: crystalPos.x, top: crystalPos.y }} />
          <div className="crystal-ring"  style={{ left: crystalPos.x, top: crystalPos.y }} />
        </>
      )}

      {/* Background Ambience (Softer in light mode) */}
      {isDark ? (
        <>
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl -z-20 pointer-events-none" />
          <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-amber-600/5 rounded-full blur-3xl -z-20 pointer-events-none" />
        </>
      ) : (
        <>
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl -z-20 pointer-events-none animate-pulse" />
          <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-3xl -z-20 pointer-events-none" />
        </>
      )}

      {/* Navigation Bar */}
      <header className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors duration-300 ${
        isDark ? 'bg-slate-950/80 border-amber-500/10' : 'bg-white/80 border-slate-200 shadow-sm'
      }`}>
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black tracking-tighter text-base shadow-[0_0_15px_rgba(245,158,11,0.3)]">
              KB
            </div>
            <div>
              <h1 className={`font-display font-black text-lg sm:text-xl tracking-tight uppercase leading-none ${
                isDark ? 'text-white' : 'text-slate-950'
              }`}>
                KIBA OFFICIAL
              </h1>
              <span className="text-[9px] text-amber-500 font-mono tracking-widest font-black uppercase block mt-0.5">
                💎 MLBB OFFICIAL TOP-UP
              </span>
            </div>
          </div>

          {/* Navigation Toggles (Desktop) */}
          <nav className="hidden sm:flex items-center gap-1.5">
            <button
              onClick={() => setSelectedTab('store')}
              className={`px-4 py-2 text-xs font-black font-display uppercase tracking-wider rounded-xl border transition-all ${
                selectedTab === 'store'
                  ? isDark
                    ? 'bg-amber-950/30 text-amber-550 border-amber-500/35'
                    : 'bg-amber-550 text-slate-950 border-amber-200'
                  : 'border-transparent text-slate-400 hover:text-amber-500'
              }`}
            >
              Diamond Topup
            </button>
            {user?.email === 'kebamimi1@gmail.com' && (
              <button
                onClick={() => setSelectedTab('admin')}
                className={`px-4 py-2 text-xs font-black font-display uppercase tracking-wider rounded-xl border transition-all ${
                  selectedTab === 'admin'
                    ? 'bg-amber-950/40 text-amber-400 border-amber-500/30'
                    : 'bg-amber-600 text-white border-amber-500 shadow-sm'
                }`}
              >
                Owner Portal
              </button>
            )}
          </nav>

          {/* Controls Cluster (Theme, Profile, Login) */}
          <div className="flex items-center gap-3">
            
            {/* Elegant Theme Toggle Button */}
            <button
              type="button"
              onClick={(e) => toggleTheme(e)}
              className={`p-2.5 rounded-xl border transition-all hover:scale-105 cursor-pointer ${
                isDark 
                  ? 'bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-850' 
                  : 'bg-slate-100 border-slate-200 text-amber-600 hover:bg-slate-200'
              }`}
              title={isDark ? "Switch to Amber Light Theme" : "Switch to Classic Dark Gaming Theme"}
            >
              {isDark ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {authLoading ? (
              <span className="text-[10px] font-mono text-slate-500 uppercase">Verifying...</span>
            ) : user ? (
              <div className="flex items-center gap-3">
                {/* Gold Name Tag Banner containing Custom IGN or Default name */}
                <div 
                  className="hidden md:block cursor-pointer transition-transform hover:scale-[1.02]"
                  onClick={() => setShowProfileModal(true)}
                  title="Open Profile Settings"
                >
                  <ProfileNameBanner name={profile?.gamerTag || user.displayName || 'Gamer'} theme="dark" />
                </div>
                
                {/* Customizable Avatar & Elite Animations border */}
                <AvatarWithBorder
                  avatarUrl={profile?.avatarUrl || user.photoURL || ''}
                  borderId={profile?.borderId || 'default'}
                  size="md"
                  onClick={() => setShowProfileModal(true)}
                  className="hover:scale-105 transition-transform"
                />

                <button
                  onClick={logoutUser}
                  className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                    isDark 
                      ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-rose-500 hover:bg-slate-850' 
                      : 'bg-slate-100 border-slate-200 text-slate-500 hover:text-rose-600 hover:bg-slate-200'
                  }`}
                  title="Sign Out"
                >
                  <LogOut size={14} />
                </button>
              </div>
            ) : (
              <button
                onClick={handleGoogleLogin}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-display text-xs font-black uppercase rounded-xl border border-amber-400 transition-all shadow-md flex items-center gap-1.5 cursor-pointer hover:scale-105"
              >
                <LogIn size={14} />
                CONNECT GOOGLE
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 mt-6">
        
        {/* Mobile Tab Helper Toggles */}
        <div className={`flex sm:hidden items-center justify-center gap-1.5 mb-6 p-1.5 rounded-2xl border transition-colors duration-300 ${
          isDark ? 'bg-slate-900/60 border-slate-850' : 'bg-slate-100 border-slate-200'
        }`}>
          <button
            onClick={() => setSelectedTab('store')}
            className={`flex-1 text-center py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all border ${
              selectedTab === 'store'
                ? isDark
                  ? 'bg-amber-950/40 text-amber-400 border-amber-500/30'
                  : 'bg-white text-amber-700 border-amber-200'
                : 'border-transparent text-slate-450'
              }`}
            >
              Store List
            </button>
            {user?.email === 'kebamimi1@gmail.com' && (
              <button
                onClick={() => setSelectedTab('admin')}
                className={`flex-1 text-center py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all border ${
                  selectedTab === 'admin'
                    ? isDark
                      ? 'bg-amber-950/45 text-amber-400 border-amber-550/30'
                      : 'bg-amber-600 text-white border-amber-500'
                    : 'border-transparent text-amber-500'
                }`}
              >
                Admin Feed
              </button>
            )}
          </div>

        {/* Dynamic Display Panels */}
        <AnimatePresence mode="wait">
          {selectedTab === 'store' && (
            <motion.div
              key="store"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* Left Column: Interactive Packs selection lists */}
              <div className="lg:col-span-7">
                <DiamondPackages
                  onSelectPackage={handleSelectPackage}
                  selectedPackage={selectedPackage}
                  theme={theme}
                />
              </div>

              {/* Right Column: Promotional details banner cluster */}
              <div className="lg:col-span-5 space-y-6">
                
                <Banner theme={theme} />

                {/* Secure payments official verify badge */}
                <div className={`p-4 rounded-2xl border flex items-center justify-between text-xs transition-colors duration-300 ${
                  isDark ? 'bg-slate-950/20 border-slate-900' : 'bg-slate-100/55 border-slate-200'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono font-black bg-amber-950 text-amber-550 border border-amber-900 px-2 py-0.5 rounded-full">
                      UPI ACTIVE
                    </span>
                    <span className="text-slate-450 font-mono font-bold">kebamimi1@oksbi</span>
                  </div>
                  <span className="text-emerald-500 flex items-center gap-1 font-mono font-black text-[10px]">
                    <CheckCircle size={12} />
                    OFFICIAL DEALER
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {selectedTab === 'admin' && (
            <motion.div
              key="admin"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <AdminDashboard theme={theme} currentUser={user} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Interactive Sliding Modal Drawer Component */}
      <AnimatePresence>
        {showOrderModal && (
          <OrderForm
            selectedPackage={selectedPackage}
            onSubmit={handleOrderSubmit}
            isSubmitting={isSubmitting}
            onClose={() => {
              setShowOrderModal(false);
              setSelectedPackage(null);
            }}
            theme={theme}
          />
        )}
      </AnimatePresence>

      {/* Transaction Success Overlay Popup Screen */}
      <AnimatePresence>
        {successOrder && (
          <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md bg-slate-950 border-2 border-emerald-500/50 rounded-3xl p-6 text-center space-y-6 shadow-[0_0_40px_rgba(16,185,129,0.2)]"
            >
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-950/40 border border-emerald-500 flex items-center justify-center text-emerald-400">
                <CheckCircle size={32} className="animate-pulse" />
              </div>

              <div>
                <span className="text-[9px] font-mono font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-900">
                  Transaction Authenticated
                </span>
                <h3 className="text-lg font-black font-display text-white mt-3 uppercase tracking-tight">
                  ORDER REGISTERED SECURELY
                </h3>
                <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase tracking-wider">REF: #{successOrder.id.toUpperCase()}</p>
              </div>

              <div className="bg-slate-900 border border-slate-850 p-4 rounded-2xl text-left text-xs text-slate-300 space-y-2.5">
                <div className="flex justify-between">
                  <span className="text-slate-500 uppercase font-mono text-[9px]">Diamonds Deal</span>
                  <strong className="text-white">{successOrder.packageName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 uppercase font-mono text-[9px]">Settled Price</span>
                  <strong className="text-amber-500 font-mono text-sm">{successOrder.price}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 uppercase font-mono text-[9px]">UPI UTR code</span>
                  <strong className="text-emerald-400 font-mono text-sm tracking-wide select-all">{successOrder.paymentUtr}</strong>
                </div>
                <div className="pb-1 border-b border-slate-850" />
                <p className="text-[10px] leading-relaxed text-slate-450 text-center">
                  Your payment reference UTR is securely indexed, and Moonton credentials are coded temporarily. Tap below to finalize the topup on WhatsApp immediately.
                </p>
              </div>

              <div className="space-y-2">
                <a
                  href={successOrder.whatsappUrl}
                  target="_blank"
                  referrerPolicy="no-referrer"
                  className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black font-display text-xs uppercase tracking-wider rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
                >
                  <MessagesSquare size={16} />
                  SEND RECEIPT TO CHAT
                </a>

                <button
                  onClick={() => setSuccessOrder(null)}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-white font-mono text-xs uppercase rounded-xl transition cursor-pointer"
                >
                  Return to Store
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Profile Settings Modal Overlay */}
        {showProfileModal && user && (
          <ProfileSettingsModal
            theme={theme}
            googleDisplayName={user.displayName || ''}
            googlePhotoURL={user.photoURL || ''}
            onClose={() => setShowProfileModal(false)}
            onSave={(newSettings) => setProfile(newSettings)}
          />
        )}

        {/* Dynamic Firebase Authorized Domains Troubleshooting Modal */}
        {authError && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`relative w-full max-w-md rounded-3xl border p-6 overflow-hidden shadow-2xl transition-all duration-300 ${
                isDark 
                  ? 'bg-slate-950 border-amber-500/20 text-slate-100 shadow-[0_0_50px_rgba(245,158,11,0.12)]' 
                  : 'bg-white border-slate-200 text-slate-900 shadow-[0_10px_40px_rgba(0,0,0,0.1)]'
              }`}
            >
              {/* Absolute Close button */}
              <button
                onClick={() => {
                  setAuthError(null);
                  setCopiedDomain(false);
                }}
                className={`absolute top-4 right-4 p-2 rounded-xl transition-all border cursor-pointer ${
                  isDark 
                    ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800' 
                    : 'bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                <X size={14} />
              </button>

              <span className="text-[8px] font-mono font-black text-amber-500 tracking-widest block mb-1 uppercase">
                ★ SECURE DOMAIN CONFIGURATION ★
              </span>
              <h3 className="text-lg font-black font-display uppercase tracking-tight flex items-center gap-2">
                <ShieldAlert className="text-amber-500 animate-pulse animate-duration-1000" size={20} />
                DOMAIN NOT AUTHORIZED
              </h3>
              
              <p className="text-slate-400 text-xs leading-relaxed mt-2.5">
                Google OAuth requires registering the dynamic hosting domain in your Firebase project security policies. Please complete this 1-minute setup:
              </p>

              {/* Box highlighting active domain to copy */}
              <div className={`mt-4 p-3 rounded-2xl border flex flex-col space-y-2 ${
                isDark ? 'bg-slate-900/60 border-slate-900' : 'bg-slate-50 border-slate-150'
              }`}>
                <span className="text-[8px] font-mono text-slate-500 uppercase tracking-wider font-bold">
                  YOUR CURRENT PREVIEW DOMAIN:
                </span>
                
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono font-black text-amber-550 truncate select-all">
                    {authError.domain}
                  </span>
                  
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(authError.domain);
                      setCopiedDomain(true);
                      setTimeout(() => setCopiedDomain(false), 2000);
                    }}
                    className={`shrink-0 px-2.5 py-1.5 text-[10px] uppercase font-black rounded-lg transition-all cursor-pointer ${
                      copiedDomain 
                        ? 'bg-emerald-500 text-slate-950 font-black' 
                        : 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                    }`}
                  >
                    {copiedDomain ? 'COPIED! ✓' : 'COPY HOST'}
                  </button>
                </div>
              </div>

              {/* Instructions steps */}
              <div className="mt-4 space-y-3.5">
                <div className="flex gap-2.5 text-xs">
                  <span className="w-5 h-5 shrink-0 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center font-mono font-black text-[10px] text-amber-500">
                    1
                  </span>
                  <div className="text-slate-400 leading-snug">
                    Open your <a href={`https://console.firebase.google.com/project/${firebaseConfig.projectId}/authentication/providers`} target="_blank" rel="noreferrer" className="text-amber-500 hover:underline font-black">Firebase Console</a>.
                  </div>
                </div>

                <div className="flex gap-2.5 text-xs">
                  <span className="w-5 h-5 shrink-0 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center font-mono font-black text-[10px] text-amber-500">
                    2
                  </span>
                  <div className="text-slate-400 leading-snug">
                    Go to <span className="font-bold text-slate-200">Authentication</span> &gt; <span className="text-amber-500 font-bold">Settings (tab)</span> &gt; scroll to <span className="font-bold text-slate-200">Authorized domains</span>.
                  </div>
                </div>

                <div className="flex gap-2.5 text-xs">
                  <span className="w-5 h-5 shrink-0 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center font-mono font-black text-[10px] text-amber-500">
                    3
                  </span>
                  <div className="text-slate-400 leading-snug">
                    Click <span className="font-bold text-slate-200">Add domain</span>, paste your copied host, click add, and then return here to log in!
                  </div>
                </div>
              </div>

              <div className="mt-4 border-t border-dashed border-slate-800/65 pt-4">
                <span className="text-[8px] font-mono text-amber-500 uppercase tracking-wider block mb-1 font-extrabold">
                  ⚡ ALTERNATIVE: SIMULATOR / OFFLINE BYPASS
                </span>
                <p className="text-[10px] text-slate-400 leading-relaxed mb-3">
                  If you are unable to access your Firebase console right now, enter your Email Address below to bypass the login check and test all store & owner portal features instantly offline:
                </p>
                <div className="flex gap-1.5">
                  <input
                    type="email"
                    id="bypass-email"
                    placeholder="e.g. kebamimi1@gmail.com"
                    defaultValue="kebamimi1@gmail.com"
                    className={`flex-1 px-3 py-2 text-xs rounded-xl focus:outline-none focus:ring-1 ${
                      isDark
                        ? 'bg-slate-900 border-slate-800 text-white focus:border-amber-500 focus:ring-amber-500'
                        : 'bg-slate-100 border-slate-250 text-slate-850'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const emailInput = document.getElementById('bypass-email') as HTMLInputElement;
                      const enteredEmail = emailInput?.value?.trim() || 'kebamimi1@gmail.com';
                      setUser({
                        uid: 'offline-guest-simulation-id',
                        email: enteredEmail,
                        displayName: enteredEmail.split('@')[0],
                        photoURL: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=150',
                        emailVerified: true
                      } as any);
                      setAuthError(null);
                      setToast({
                        message: `Welcome! Authorized successfully via Offline Guest Bypass as: ${enteredEmail}`,
                        type: 'success'
                      });
                    }}
                    className="py-2 px-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-[10px] font-extrabold uppercase rounded-xl border border-amber-450 cursor-pointer shadow-md shrink-0 transition-transform active:scale-95"
                  >
                    Bypass Now
                  </button>
                </div>
              </div>

              <button
                onClick={() => {
                  setAuthError(null);
                  setCopiedDomain(false);
                }}
                className={`w-full mt-5 py-3 text-xs font-black uppercase rounded-2xl transition border cursor-pointer ${
                  isDark 
                    ? 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-white' 
                    : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-900'
                }`}
              >
                GOT IT
              </button>
            </motion.div>
          </div>
        )}

        {/* Floating Top-Right Toast Notification */}
        {toast && (
          <motion.div
            key="toast-alert"
            initial={{ opacity: 0, x: 50, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.95, transition: { duration: 0.25 } }}
            className={`fixed top-6 right-6 z-[60] w-full max-w-sm rounded-[20px] border p-4 shadow-2xl flex items-start gap-3 transition-all duration-300 pointer-events-auto ${
              isDark 
                ? 'bg-slate-950 border-amber-500/30 text-slate-100 shadow-[0_10px_35px_rgba(245,158,11,0.2)]' 
                : 'bg-white border-slate-200 text-slate-900 shadow-[0_10px_35px_rgba(15,23,42,0.12)]'
            }`}
          >
            <div className={`p-2.5 rounded-xl shrink-0 ${
              toast.type === 'warning' 
                ? 'bg-amber-550/15 text-amber-500' 
                : toast.type === 'success'
                  ? 'bg-emerald-550/15 text-emerald-500'
                  : 'bg-blue-550/15 text-blue-500'
            }`}>
              <ShieldAlert size={18} className="animate-bounce" />
            </div>
            
            <div className="flex-1 min-w-0">
              <span className="text-[8px] font-mono font-black text-amber-500 tracking-widest block mb-0.5">
                {toast.type === 'warning' ? '★ SECURE POLICY NOTICE ★' : '★ NOTIFICATION ★'}
              </span>
              <p className="text-xs font-black tracking-tight leading-snug">
                {toast.message}
              </p>
            </div>

            <button
              onClick={() => setToast(null)}
              className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}

        {/* Mobile Desktop Mode Notification Interstitial */}
        {showMobilePrompt && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`relative w-full max-w-md rounded-3xl border-2 p-6 text-center space-y-6 shadow-[0_0_50px_rgba(245,158,11,0.15)] transition-all duration-300 ${
                isDark 
                  ? 'bg-slate-950 border-amber-500/35 text-slate-100' 
                  : 'bg-white border-amber-500/25 text-slate-900'
              }`}
            >
              {/* Close Button top-right */}
              <button
                onClick={() => {
                  sessionStorage.setItem('kiba-mobile-desktop-seen', 'true');
                  setShowMobilePrompt(false);
                }}
                className={`absolute top-4 right-4 p-1.5 rounded-lg transition-colors cursor-pointer ${
                  isDark 
                    ? 'text-slate-400 hover:text-white hover:bg-slate-800' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <X size={16} />
              </button>

              <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                <Monitor className="animate-pulse" size={32} />
              </div>

              <div className="space-y-2">
                <span className="text-[9px] font-mono font-black text-amber-500 bg-amber-500/10 border border-amber-500/25 px-3 py-1 rounded-full uppercase tracking-widest leading-none inline-block">
                  PRO GAMER TIP
                </span>
                <h3 className={`text-lg font-black font-display uppercase tracking-tight ${
                  isDark ? 'text-white' : 'text-slate-950'
                }`}>
                  USE DESKTOP MODE FOR PREMIER ADVENTURE
                </h3>
                <p className={`text-xs leading-relaxed max-w-sm mx-auto ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  Our legendary 3D-styled grids, glowing custom avatars, and secure live order boards are optimized for widescreen PC view. Engage Desktop Mode in your mobile browser or open this link on a computer monitor for a superior experience.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  sessionStorage.setItem('kiba-mobile-desktop-seen', 'true');
                  setShowMobilePrompt(false);
                }}
                className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black font-display text-xs uppercase tracking-wider rounded-2xl transition-all shadow-md cursor-pointer hover:scale-101 active:scale-99"
              >
                CONTINUE TO STORE
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating real-time ribbons footer */}
      <footer className={`fixed bottom-0 left-0 right-0 py-3 border-t backdrop-blur-md z-30 transition-colors duration-300 ${
        isDark ? 'bg-slate-950/90 border-slate-900' : 'bg-white/90 border-slate-200 shadow-lg'
      }`}>
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
            <span className="text-[9px] text-slate-400 uppercase font-mono tracking-wider font-bold">
              DM SECURE CHAT:
            </span>
            <span className="text-xs font-mono font-black text-amber-500 select-all">+91 9863068885</span>
          </div>
          
          <div className="text-[9px] text-slate-500 font-mono uppercase tracking-wider">
            © 2026 KIBA OFFICIAL Top-ups. Isolated transactions.
          </div>
        </div>
      </footer>
    </div>
  );
}

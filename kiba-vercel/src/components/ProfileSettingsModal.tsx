import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { X, Save, User, Smartphone, ShieldCheck, Gamepad2, Sparkles, Image as ImageIcon, Upload, Link as LinkIcon, Award } from 'lucide-react';
import ProfileNameBanner from './ProfileNameBanner';
import AvatarWithBorder, { AVATAR_BORDERS, AvatarBorder } from './AvatarWithBorder';

interface ProfileSettings {
  gamerTag: string;
  uid: string;
  serverId: string;
  whatsAppNumber: string;
  avatarUrl: string;
  borderId: string;
}

interface ProfileSettingsModalProps {
  onClose: () => void;
  theme: 'dark' | 'light';
  googleDisplayName: string;
  googlePhotoURL: string;
  onSave: (settings: ProfileSettings) => void;
}

// 6 Beautiful Gaming Presets
const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=150';

export default function ProfileSettingsModal({ onClose, theme, googleDisplayName, googlePhotoURL, onSave }: ProfileSettingsModalProps) {
  const isDark = theme === 'dark';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [gamerTag, setGamerTag] = useState('');
  const [uid, setUid] = useState('');
  const [serverId, setServerId] = useState('');
  const [whatsAppNumber, setWhatsAppNumber] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [borderId, setBorderId] = useState('default');
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [showUrlField, setShowUrlField] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showBorderSelector, setShowBorderSelector] = useState(false);

  // Load existing profile from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('kiba-user-profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        setGamerTag(parsed.gamerTag || '');
        setUid(parsed.uid || '');
        setServerId(parsed.serverId || '');
        setWhatsAppNumber(parsed.whatsAppNumber || '');
        setAvatarUrl(parsed.avatarUrl || googlePhotoURL || '');
        setBorderId(parsed.borderId || 'default');
      } else {
        setGamerTag(googleDisplayName || '');
        setAvatarUrl(googlePhotoURL || DEFAULT_AVATAR);
      }
    } catch (e) {
      console.error('Error loading profile settings:', e);
    }
  }, [googleDisplayName, googlePhotoURL]);

  // Handle local image file uploads and convert to base64 string
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError('');
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setUploadError('Image must be under 2MB to save reliably in offline state!');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setAvatarUrl(event.target.result as string);
      }
    };
    reader.onerror = () => {
      setUploadError('Failed to parse selected image file.');
    };
    reader.readAsDataURL(file);
  };

  const applyCustomUrl = () => {
    if (customUrlInput.trim().startsWith('http')) {
      setAvatarUrl(customUrlInput.trim());
      setCustomUrlInput('');
      setShowUrlField(false);
    } else {
      setUploadError('Please provide a valid URL starting with HTTP/HTTPS');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const settings: ProfileSettings = {
      gamerTag: gamerTag.trim() || googleDisplayName || 'Gamer',
      uid: uid.trim(),
      serverId: serverId.trim(),
      whatsAppNumber: whatsAppNumber.trim(),
      avatarUrl: avatarUrl || googlePhotoURL || DEFAULT_AVATAR,
      borderId
    };

    // Save strictly to local storage
    localStorage.setItem('kiba-user-profile', JSON.stringify(settings));
    onSave(settings);

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-slate-150/5">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/90 backdrop-blur-md"
      />

      {/* Main Panel Content Box */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className={`relative w-full max-w-lg rounded-3xl border p-6 my-8 overflow-hidden shadow-2xl transition-all duration-300 z-10 ${
          isDark 
            ? 'bg-slate-950 border-amber-500/20 text-slate-100 shadow-[0_0_50px_rgba(245,158,11,0.08)]' 
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className={`absolute top-4 right-4 p-2.5 rounded-xl border transition-all pointer-events-auto cursor-pointer z-20 ${
            isDark 
              ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800' 
              : 'bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-200'
          }`}
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div className="mb-5 pr-8">
          <span className="text-[9px] font-mono font-black tracking-widest uppercase text-amber-500">
            ★ ELITE GAMER DESK ★
          </span>
          <h2 className="text-xl font-black font-display uppercase tracking-tight mt-1 flex items-center gap-2">
            <Gamepad2 className="text-amber-500 animate-pulse" size={20} />
            PERSONALIZE IDENTITY
          </h2>
          <p className="text-slate-400 text-[11px] leading-relaxed mt-0.5">
            Synchronize your avatar border, visual banners, and automatic lookup templates.
          </p>
        </div>

        {/* LIVE REAL-TIME COMBINED PREVIEW */}
        <div className={`p-4 rounded-2xl border flex flex-col items-center justify-center space-y-4 mb-5 ${
          isDark ? 'bg-slate-900/40 border-slate-900' : 'bg-slate-50 border-slate-150'
        }`}>
          <span className="text-[8px] font-mono font-black text-slate-450 uppercase tracking-widest">
            REAL-TIME MATCH PREVIEW
          </span>
          
          <div className="flex items-center gap-4">
            {/* Custom Avatar + Selected Custom Border (Pulsing live preview) */}
            <AvatarWithBorder
              avatarUrl={avatarUrl || googlePhotoURL || DEFAULT_AVATAR}
              borderId={borderId}
              size="lg"
              className="transform hover:scale-105 transition-transform"
            />
            
            {/* Display banner showing Gamer ID */}
            <div className="flex flex-col space-y-1">
              <ProfileNameBanner name={gamerTag || googleDisplayName || 'Gamer'} theme="dark" />
              <div className="flex gap-2 text-[9px] font-mono text-slate-400 pl-2">
                <span>ID: {uid || 'Not Defined'}</span>
                <span>Server: ({serverId || '----'})</span>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 max-h-[50vh] overflow-y-auto px-1 scrollbar-thin">
          
          {/* 1. SECTION: CHOOSE CUSTOM PROFILE PIC / EDIT PICTURE */}
          <div className="space-y-2.5">
            <h3 className={`text-[10px] font-bold uppercase font-mono tracking-wider ${isDark ? 'text-amber-400/90' : 'text-amber-800'}`}>
              1. Customize Profile Photo
            </h3>

            {/* Error notifications */}
            {uploadError && (
              <div className="p-2 border border-rose-500/30 bg-rose-950/10 rounded-xl text-[10px] text-rose-400">
                ⚠️ {uploadError}
              </div>
            )}

            {/* File upload actions */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`py-2 px-3 text-[10px] font-bold uppercase rounded-xl border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  isDark 
                    ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800' 
                    : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200 shadow-sm'
                }`}
              >
                <Upload size={12} />
                Upload File (.png / .jpg)
              </button>
              <button
                type="button"
                onClick={() => setShowUrlField(!showUrlField)}
                className={`py-2 px-3 text-[10px] font-bold uppercase rounded-xl border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  isDark 
                    ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800' 
                    : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200 shadow-sm'
                }`}
              >
                <LinkIcon size={12} />
                Paste Image Link
              </button>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />

            {/* Link URL input fields */}
            {showUrlField && (
              <div className="flex gap-2 p-1.5 rounded-xl border border-dashed border-amber-500/20">
                <input
                  type="text"
                  placeholder="https://example.com/photo.jpg"
                  value={customUrlInput}
                  onChange={(e) => setCustomUrlInput(e.target.value)}
                  className={`flex-1 px-3 py-1.5 text-[10px] rounded-lg border focus:outline-none ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                />
                <button
                  type="button"
                  onClick={applyCustomUrl}
                  className="py-1.5 px-3 bg-amber-500 hover:bg-amber-600 text-slate-950 text-[10px] font-black uppercase rounded-lg"
                >
                  Apply
                </button>
              </div>
            )}
          </div>

          <hr className={isDark ? 'border-slate-900' : 'border-slate-150'} />

          {/* 2. SECTION: EXTRA LARGE BORDER GRID (30 BORDERS REVEAL) */}
          <div className="space-y-2.5">
            {!showBorderSelector ? (
              <div className={`p-3 rounded-2xl border border-dashed flex items-center justify-between gap-3 ${
                isDark 
                  ? 'border-amber-500/20 bg-amber-500/[0.02]' 
                  : 'border-slate-300 bg-slate-50'
              }`}>
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-1.5 bg-amber-500/10 text-amber-500 rounded-xl relative">
                    <Award size={16} className="animate-pulse" />
                  </div>
                  <div className="min-w-0">
                    <span className={`block text-[10px] uppercase font-mono font-black ${isDark ? 'text-amber-400' : 'text-amber-800'}`}>
                      Select Custom Border
                    </span>
                    <span className="block text-[8px] font-mono text-slate-400 uppercase truncate">
                      {AVATAR_BORDERS.length} EXOTIC ANIME FRAMES ACTIVE
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowBorderSelector(true)}
                  className="shrink-0 px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-[10px] font-black uppercase rounded-xl border border-amber-400 transition-all hover:scale-103 cursor-pointer shadow-md"
                >
                  Edit Border
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <h3 className={`text-[10px] font-bold uppercase font-mono tracking-wider ${isDark ? 'text-amber-400/90' : 'text-amber-800'}`}>
                    2. Select Avatar Border (30 Customs)
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowBorderSelector(false)}
                    className="text-[9px] font-mono font-black text-amber-500 hover:underline uppercase cursor-pointer"
                  >
                    Collapse ▲
                  </button>
                </div>

                {/* Beautiful horizontal/vertical scrollgrid of borders */}
                <div className={`p-2 rounded-2xl border flex flex-col space-y-2.5 max-h-48 overflow-y-auto ${
                  isDark ? 'bg-slate-900/30 border-slate-900' : 'bg-slate-50 border-slate-150'
                }`}>
                  <div className="grid grid-cols-3 gap-2">
                    {AVATAR_BORDERS.map((border) => {
                      const isSelected = borderId === border.id;
                      let badgeColors = 'bg-slate-800 text-slate-350';
                      if (border.rarity === 'Legend') badgeColors = 'bg-yellow-950 text-yellow-500 border border-yellow-800';
                      if (border.rarity === 'Mythic') badgeColors = 'bg-rose-950 text-rose-500 border border-rose-800';
                      if (border.rarity === 'Collector') badgeColors = 'bg-fuchsia-950 text-fuchsia-400 border border-fuchsia-850';
                      if (border.rarity === 'Epic') badgeColors = 'bg-blue-950 text-blue-400 border border-blue-900';
                      if (border.rarity === 'Special') badgeColors = 'bg-amber-950 text-amber-500 border border-amber-900';

                      return (
                        <button
                          key={border.id}
                          type="button"
                          onClick={() => setBorderId(border.id)}
                          className={`p-2 rounded-xl flex items-center gap-2 border transition-all cursor-pointer ${
                            isSelected 
                              ? 'bg-amber-500/10 border-amber-500 shadow-md ring-1 ring-amber-500/20' 
                              : isDark
                                ? 'bg-slate-950 border-slate-900 text-slate-300 hover:border-slate-800'
                                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          {/* Circle Thumbnail displaying this frame border */}
                          <AvatarWithBorder
                            avatarUrl={avatarUrl || googlePhotoURL || DEFAULT_AVATAR}
                            borderId={border.id}
                            size="sm"
                          />
                          <div className="text-left overflow-hidden">
                            <div className="text-[10px] font-black font-display tracking-tight leading-tight truncate">
                              {border.name}
                            </div>
                            <span className={`text-[7px] px-1 font-extrabold rounded uppercase leading-none mt-0.5 inline-block ${badgeColors}`}>
                              {border.rarity}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>

          <hr className={isDark ? 'border-slate-900' : 'border-slate-150'} />

          {/* 3. SECTION: CONVENTIONAL LOOKUP DATA FIELDS */}
          <div className="space-y-3 pt-1">
            <h3 className={`text-[10px] font-bold uppercase font-mono tracking-wider ${isDark ? 'text-amber-400/90' : 'text-amber-800'}`}>
              3. Preset MLBB Credentials
            </h3>

            {/* Custom In Game Name Tag */}
            <div>
              <label className={`block text-[9px] font-bold uppercase font-mono ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              } mb-1`}>
                Gamer In-Game Nickname
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <User size={12} />
                </span>
                <input
                  type="text"
                  maxLength={30}
                  placeholder="e.g. KIBA MASTER"
                  value={gamerTag}
                  onChange={(e) => setGamerTag(e.target.value)}
                  className={`w-full pl-8 pr-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 ${
                    isDark
                      ? 'bg-slate-900 border-slate-800 text-white focus:border-amber-500 focus:ring-amber-500'
                      : 'bg-white border-slate-300 text-slate-900 focus:border-amber-600 focus:ring-amber-600'
                  }`}
                />
              </div>
            </div>

            {/* MLBB Identity Defaults */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={`block text-[9px] font-bold uppercase font-mono ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                } mb-1`}>
                  MLBB User ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. 19582963"
                  value={uid}
                  onChange={(e) => setUid(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 ${
                    isDark
                      ? 'bg-slate-900 border-slate-800 text-white focus:border-amber-500 focus:ring-amber-500'
                      : 'bg-white border-slate-300 text-slate-900 focus:border-amber-600 focus:ring-amber-600'
                  }`}
                />
              </div>
              <div>
                <label className={`block text-[9px] font-bold uppercase font-mono ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                } mb-1`}>
                  Server ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2190"
                  value={serverId}
                  onChange={(e) => setServerId(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 ${
                    isDark
                      ? 'bg-slate-900 border-slate-800 text-white focus:border-amber-500 focus:ring-amber-500'
                      : 'bg-white border-slate-300 text-slate-900 focus:border-amber-600 focus:ring-amber-600'
                  }`}
                />
              </div>
            </div>

            {/* Default WhatsApp destination */}
            <div>
              <label className={`block text-[9px] font-bold uppercase font-mono ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              } mb-1`}>
                WhatsApp Phone Number
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Smartphone size={12} />
                </span>
                <input
                  type="text"
                  placeholder="e.g. +91 9863068885"
                  value={whatsAppNumber}
                  onChange={(e) => setWhatsAppNumber(e.target.value)}
                  className={`w-full pl-8 pr-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-1 ${
                    isDark
                      ? 'bg-slate-900 border-slate-800 text-white focus:border-amber-500 focus:ring-amber-500'
                      : 'bg-white border-slate-300 text-slate-900 focus:border-amber-600 focus:ring-amber-600'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Saved Notification */}
          {savedSuccess && (
            <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs flex items-center gap-2">
              <ShieldCheck size={16} />
              <span>Gamer credentials and custom frame synced!</span>
            </div>
          )}

          {/* Action triggers */}
          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className={`flex-1 py-3 text-xs font-bold uppercase rounded-xl border transition-all cursor-pointer ${
                isDark 
                  ? 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white' 
                  : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs uppercase rounded-xl border border-amber-400 hover:scale-101 shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Save size={14} />
              SAVE PROFILE
            </button>
          </div>
        </form>

      </motion.div>
    </div>
  );
}

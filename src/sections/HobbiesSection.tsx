import React, { useRef, useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import FadeIn from '../components/FadeIn';
import { useBreakpoint } from '../hooks/useBreakpoint';

type Quote = { content: string; author: string }

function useQuote() {
  const { t, i18n } = useTranslation()
  const pick = () => {
    const list = t('quotes', { returnObjects: true }) as { c: string; a: string }[]
    const q = list[Math.floor(Math.random() * list.length)]
    return { content: q.c, author: q.a }
  }
  const [quote, setQuote] = useState<Quote>(pick)
  useEffect(() => { setQuote(pick()) }, [i18n.language])
  return { quote, refresh: () => setQuote(pick()) }
}

const HOBBY_IDS = ["software", "coffee", "muaythai", "photo", "music", "gaming"] as const;
const HOBBY_ICONS: Record<string, string> = { software: "💻", coffee: "☕", muaythai: "🥊", photo: "📸", music: "🎧", gaming: "✈️" };
const HOBBY_COLORS: Record<string, string> = { software: "#0ea5e9", coffee: "#f59e0b", muaythai: "#e11d48", photo: "#c026d3", music: "#10b981", gaming: "#8b5cf6" };

function getImage(id: string) {
  switch (id) {
    case 'software': return 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=100&w=1600&auto=format&fit=crop';
    case 'coffee':   return 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=100&w=1600&auto=format&fit=crop';
    case 'muaythai': return 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=100&w=1600&auto=format&fit=crop';
    case 'photo':    return 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=100&w=1600&auto=format&fit=crop';
    case 'music':    return 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=100&w=1600&auto=format&fit=crop';
    case 'gaming':   return 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=100&w=1600&auto=format&fit=crop';
    default: return '';
  }
}

/* ─── Frequency Visualizer ─── */
const BAR_COUNT = 24;
const WAVE_COLORS = Array.from({ length: BAR_COUNT }).map((_, i) => `hsl(${(i * 12) + 180}, 90%, 65%)`);
const IDLE_HEIGHTS = Array.from({ length: BAR_COUNT }).map((_, i) => 0.15 + 0.7 * Math.abs(Math.sin((i / BAR_COUNT) * Math.PI)));

function SoundWave({ analyserRef, playing }: { analyserRef: React.RefObject<AnalyserNode | null>; playing: boolean }) {
  const barsRef = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const animate = (ts: number) => {
      rafRef.current = requestAnimationFrame(animate);
      const analyser = analyserRef.current;
      if (analyser && playing) {
        const data = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(data);
        // Use only lower 60% of spectrum — high bins have near-zero energy in music
        const usableBins = Math.floor(data.length * 0.6);
        const step = usableBins / BAR_COUNT;
        barsRef.current.forEach((el, i) => {
          if (!el) return;
          const bin = Math.floor(i * step);
          el.style.transform = `scaleY(${Math.max(0.06, data[bin] / 255)})`;
        });
      } else {
        const t = ts / 1000;
        barsRef.current.forEach((el, i) => {
          if (!el) return;
          const phase = t * (1.2 + (i % 7) * 0.18) + (i % 5) * 0.11 * Math.PI;
          el.style.transform = `scaleY(${Math.max(0.06, IDLE_HEIGHTS[i] * (0.5 + 0.5 * Math.sin(phase * Math.PI * 2)))})`;
        });
      }
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [analyserRef, playing]);

  return (
    <div className="flex items-end justify-between gap-[3px] h-16 w-full opacity-90 mx-auto px-4 z-10 relative">
      {WAVE_COLORS.map((color, i) => (
        <div key={i} ref={el => { barsRef.current[i] = el; }} className="flex-1 rounded-t-sm origin-bottom"
          style={{ backgroundColor: color, height: '100%', willChange: 'transform' }} />
      ))}
    </div>
  );
}

const PLAYLIST = [
  {
    title: 'Instant Crush',
    artist: 'Daft Punk ft. Julian Casablancas',
    audioSrc: '/images/audio/Daft Punk Instant Crush.mp3',
    coverSrc: '/images/audio/instantcrush .png',
    durationStr: '5:37'
  },
  {
    title: 'Let It Happen',
    artist: 'Tame Impala',
    audioSrc: '/images/audio/Tame Impala - Let It Happen .mp3',
    coverSrc: '/images/audio/let it happen.jpeg',
    durationStr: '7:47'
  },
  {
    title: 'Sweet Disposition',
    artist: 'The Temper Trap',
    audioSrc: '/images/audio/The Temper Trap - Sweet Disposition .mp3',
    coverSrc: '/images/audio/Sweet Disposistion.jpg',
    durationStr: '3:53'
  },
  {
    title: 'Stereo Love',
    artist: 'Edward Maya',
    audioSrc: '/images/audio/Stereo Love - Edward Maya.mp3',
    coverSrc: '/images/audio/Stereo Love.jpg',
    durationStr: '4:07'
  },
  {
    title: 'In And Out Of Love',
    artist: 'Armin van Buuren',
    audioSrc: '/images/audio/In And Out Of Love .mp3',
    coverSrc: '/images/audio/in and out of love.jpeg',
    durationStr: '6:05'
  }
];

/* ─── Mini Frequency Visualizer (for floating player) ─── */
const MINI_BARS = 10;
const MINI_COLORS = Array.from({ length: MINI_BARS }).map((_, i) =>
  `hsl(${160 + i * 18}, 90%, 60%)`
);
const MINI_IDLE = Array.from({ length: MINI_BARS }).map((_, i) =>
  0.15 + 0.7 * Math.abs(Math.sin((i / MINI_BARS) * Math.PI))
);

function MiniWave({ analyserRef, playing }: { analyserRef: React.RefObject<AnalyserNode | null>; playing: boolean }) {
  const barsRef = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const animate = (ts: number) => {
      rafRef.current = requestAnimationFrame(animate);
      const analyser = analyserRef.current;
      if (analyser && playing) {
        const data = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(data);
        const usable = Math.floor(data.length * 0.6);
        const step = usable / MINI_BARS;
        barsRef.current.forEach((el, i) => {
          if (!el) return;
          const bin = Math.floor(i * step);
          el.style.transform = `scaleY(${Math.max(0.08, data[bin] / 255)})`;
        });
      } else {
        const t = ts / 1000;
        barsRef.current.forEach((el, i) => {
          if (!el) return;
          const phase = t * (1.1 + (i % 5) * 0.22) + (i % 3) * 0.14 * Math.PI;
          const h = playing ? MINI_IDLE[i] : MINI_IDLE[i] * 0.35;
          el.style.transform = `scaleY(${Math.max(0.05, h * (0.5 + 0.5 * Math.sin(phase * Math.PI * 2)))})`;
        });
      }
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [analyserRef, playing]);

  return (
    <div className="flex items-end gap-[2px] h-5 w-[36px]">
      {MINI_COLORS.map((color, i) => (
        <div
          key={i}
          ref={el => { barsRef.current[i] = el; }}
          className="flex-1 rounded-t-[1px] origin-bottom"
          style={{ backgroundColor: color, height: '100%', willChange: 'transform' }}
        />
      ))}
    </div>
  );
}

/* ─── Floating Mini Player (portal) ─── */
function FloatingMiniPlayer({ show, playing, trackIdx, analyserRef, onPause, onPlay, onNext, onPrev, onClose, progress }: {
  show: boolean;
  playing: boolean;
  trackIdx: number;
  analyserRef: React.RefObject<AnalyserNode | null>;
  onPause: () => void;
  onPlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
  progress: number;
}) {
  const track = PLAYLIST[trackIdx];
  return ReactDOM.createPortal(
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.93 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.93 }}
          transition={{ type: 'spring', stiffness: 280, damping: 26 }}
          className="fixed bottom-4 right-3 sm:bottom-6 sm:right-6 z-[9999] flex items-center gap-2 sm:gap-3 px-2.5 py-1.5 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl border border-white/5 opacity-10 hover:opacity-55 transition-opacity duration-300 sm:opacity-15 sm:hover:opacity-60"
          style={{
            background: 'rgba(10,10,12,0.15)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.04)',
          }}
        >
          {/* Close button (top-right) */}
          <button
            onClick={onClose}
            className="absolute -top-2 -right-2 w-5 h-5 rounded-full border border-white/15 flex items-center justify-center text-white hover:scale-110 transition-all duration-200 z-10"
            style={{ background: 'rgba(20,20,22,0.35)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
            title="Close"
          >
            <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Cover art */}
          <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl overflow-hidden shrink-0 border border-white/10">
            <img src={track.coverSrc} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/20" />
          </div>

          {/* Track info */}
          <div className="flex flex-col min-w-0 max-w-[80px] sm:max-w-[140px]">
            <AnimatePresence mode="wait">
              <motion.div key={track.title}
                initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <span className="block text-white font-black text-[11px] uppercase tracking-tight truncate leading-tight">{track.title}</span>
                <span className="block text-white/40 font-mono text-[9px] tracking-widest truncate uppercase">{track.artist.split(' ')[0]}</span>
              </motion.div>
            </AnimatePresence>
            {/* progress bar */}
            <div className="mt-1.5 w-full h-[2px] bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-white/60 rounded-full transition-all duration-300" style={{ width: `${progress * 100}%` }} />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1 shrink-0 ml-1">
            <button onClick={onPrev} className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-white/50 hover:text-white transition-colors">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
            </button>
            <button
              onClick={playing ? onPause : onPlay}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white flex items-center justify-center text-black hover:scale-105 active:scale-95 transition-transform shadow-lg shrink-0"
            >
              {playing
                ? <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                : <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5"><path d="M5 3l14 9-14 9V3z"/></svg>
              }
            </button>
            <button onClick={onNext} className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-white/50 hover:text-white transition-colors">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6v12l8.5-6zM16 6h2v12h-2z"/></svg>
            </button>
          </div>

          {/* Live/paused indicator + Mini Wave + Track counter */}
          <div className="hidden sm:flex flex-col items-center gap-1 shrink-0">
            <MiniWave analyserRef={analyserRef} playing={playing} />
            <span className="font-mono text-[8px] tracking-widest text-white/30 leading-none">
              {trackIdx + 1}<span className="text-white/15">/{PLAYLIST.length}</span>
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

/* ─── Music Player Card ─── */
function MusicPlayerCard({ audioRef, analyserRef, playing, setPlaying, trackIdx, setTrackIdx }: {
  audioRef: React.RefObject<HTMLAudioElement>;
  analyserRef: React.MutableRefObject<AnalyserNode | null>;
  playing: boolean;
  setPlaying: (v: boolean) => void;
  trackIdx: number;
  setTrackIdx: React.Dispatch<React.SetStateAction<number>>;
}) {
  const { t } = useTranslation();
  const [progress, setProgress] = useState(0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const currentTrack = PLAYLIST[trackIdx];

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (!audioCtxRef.current) {
      const ctx = new AudioContext();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      const source = ctx.createMediaElementSource(a);
      source.connect(analyser);
      analyser.connect(ctx.destination);
      audioCtxRef.current = ctx;
      analyserRef.current = analyser;
    }
    if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume();
    if (playing) { a.pause(); setPlaying(false); }
    else { a.play(); setPlaying(true); }
  };

  const nextTrack = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setTrackIdx((prev) => (prev + 1) % PLAYLIST.length);
  };

  const prevTrack = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setTrackIdx((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
  };

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTime = () => setProgress(a.duration ? a.currentTime / a.duration : 0);
    const onEnd = () => nextTrack();
    a.addEventListener('timeupdate', onTime);
    a.addEventListener('ended', onEnd);
    return () => { a.removeEventListener('timeupdate', onTime); a.removeEventListener('ended', onEnd); };
  }, []);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.load();
    if (playing) {
      a.play().catch(err => console.log('Auto-play after track switch prevented:', err));
    }
  }, [trackIdx]);

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const a = audioRef.current;
    if (!a) return;
    const r = e.currentTarget.getBoundingClientRect();
    a.currentTime = ((e.clientX - r.left) / r.width) * a.duration;
  };

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  const dur = audioRef.current?.duration || 0;
  const cur = audioRef.current?.currentTime || 0;

  return (
    <div className="relative group col-span-1 md:col-span-2 lg:col-span-1 min-h-[300px] sm:min-h-[360px] lg:h-[400px] rounded-[2rem] overflow-hidden border border-[var(--fg-08)]">
      {/* Inner Spinning Background */}
      <div className="absolute inset-0 bg-[conic-gradient(from_0deg,#ff0055,#00ff99,#00ccff,#ff0055)] animate-[spin_4s_linear_infinite] opacity-100 pointer-events-none" />
      
      {/* Opaque Center */}
      <div className="absolute inset-[3px] md:inset-[4px] bg-[var(--card-bg)] rounded-[1.8rem] z-0" />
      
      {/* Inner Card content */}
      <div className="absolute inset-[3px] md:inset-[4px] rounded-[1.8rem] overflow-hidden z-10">
        <audio ref={audioRef} src={currentTrack.audioSrc} preload="metadata" crossOrigin="anonymous" />
        
        <AnimatePresence mode="wait">
          <motion.img 
            key={currentTrack.coverSrc}
            initial={{ opacity: 0, scale: 1.2 }}
            animate={{ opacity: 0.6, scale: 1.1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            src={currentTrack.coverSrc} 
            alt="Cover" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-100" 
          />
        </AnimatePresence>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none" />
        
        {/* All Time Favorite Label */}
        <div className="absolute top-5 left-6 z-20 pointer-events-none flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#00ccff] shadow-[0_0_8px_#00ccff] animate-pulse" />
          <span className="text-white/80 font-mono text-[10px] tracking-[0.2em] uppercase drop-shadow-md">{t('hobbies.allTimeFavorite')}</span>
          <span className="text-white/40 font-mono text-[10px] tracking-widest ml-1">[{trackIdx + 1}/{PLAYLIST.length}]</span>
        </div>
        
        <div className={`absolute top-5 right-5 w-16 h-16 rounded-full border-2 border-white/20 overflow-hidden transition-all duration-500 ${playing ? 'animate-spin opacity-80' : 'opacity-40'}`} style={{ animationDuration: '3s' }}>
          <img src={currentTrack.coverSrc} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center"><div className="w-3 h-3 rounded-full bg-black border border-white/30" /></div>
        </div>
        
        <div className="absolute inset-0 flex flex-col justify-end p-6 z-10 pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.div key={currentTrack.title} initial={{ y: 5, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -5, opacity: 0 }} transition={{ duration: 0.3 }} className="pointer-events-auto">
              <span className="block text-white/40 font-mono text-[9px] uppercase tracking-widest mb-1">{currentTrack.artist}</span>
              <h3 className="text-white text-2xl font-black uppercase tracking-tight leading-none mb-3 truncate pr-4">{currentTrack.title}</h3>
            </motion.div>
          </AnimatePresence>
          
          <div className="w-full h-1 bg-white/20 rounded-full mb-3 cursor-pointer pointer-events-auto group/bar relative" onClick={seek}>
            <div className="h-full bg-white rounded-full relative transition-all duration-200" style={{ width: `${progress * 100}%` }}>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full shadow opacity-0 group-hover/bar:opacity-100 transition-opacity" />
            </div>
          </div>
          
          <div className="flex justify-between text-white/30 text-[9px] font-mono mb-4 pointer-events-auto">
            <span>{fmt(cur)}</span><span>{dur ? fmt(dur) : currentTrack.durationStr}</span>
          </div>
          
          <div className="flex items-center justify-center gap-4 pointer-events-auto">
            <button onClick={prevTrack} className="text-white hover:text-[#00ff99] transition-colors active:scale-95">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
            </button>
            <button onClick={toggle} className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-black hover:scale-105 active:scale-95 transition-transform shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              {playing
                ? <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                : <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="ml-1"><path d="M5 3l14 9-14 9V3z"/></svg>
              }
            </button>
            <button onClick={nextTrack} className="text-white hover:text-[#00ff99] transition-colors active:scale-95">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6v12l8.5-6zM16 6h2v12h-2z"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Quote Card ─── */
function SpotifyCard() {
  const { quote, refresh } = useQuote();
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className="relative group col-span-1 min-h-[300px] sm:min-h-[360px] lg:h-[400px] rounded-[2rem] overflow-hidden border border-[var(--fg-08)]"
    >
      {/* Inner Card content */}
      <div className="absolute inset-0 p-5 md:p-6 flex flex-col z-10 overflow-hidden">
        
        {/* Full Opaque Inner Spinning Background */}
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg,#ff0055,#00ff99,#00ccff,#ff0055)] animate-[spin_4s_linear_infinite] opacity-100 pointer-events-none" />
        
        {/* Opaque Center to make text readable but leave corners/edges visible */}
        <div className="absolute inset-[3px] md:inset-[4px] bg-[var(--card-bg)] rounded-[1.8rem] z-0" />
        
        {/* Subtle Background Grid (over the opaque center) */}
        <div className="absolute inset-[3px] md:inset-[4px] bg-[linear-gradient(var(--fg-06)_1px,transparent_1px),linear-gradient(90deg,var(--fg-06)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none rounded-[1.8rem] overflow-hidden" />
        
        {/* Interactive Mouse Spotlight (Elegant & Flashy) */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none mix-blend-screen z-10"
          style={{
            background: `
              radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.15), transparent 40%),
              radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.05), transparent 50%)
            `
          }}
        />

        {/* Content Container */}
        <div className="relative z-20 w-full flex flex-col h-full pointer-events-none">
          <div className="flex items-center justify-between mb-4 pointer-events-auto">
            <span className="text-[var(--fg-40)] font-mono text-[10px] tracking-[0.2em] uppercase">Daily Inspiration</span>
            <button onClick={refresh} className="opacity-50 hover:opacity-100 transition-opacity relative z-20" title="New quote">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            </button>
          </div>
          <div className="w-full flex-grow rounded-[1rem] bg-[var(--fg-06)] border border-[var(--fg-06)] flex flex-col justify-between p-5">
            {quote
              ? <>
                  <div className="flex flex-col gap-4">
                    <span className="text-[var(--fg-18)] text-4xl leading-none font-serif">"</span>
                    <p className="text-[var(--fg)] text-base sm:text-lg leading-relaxed font-light">{quote.content}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[var(--fg-06)]">
                    <div className="w-1 h-6 rounded-full bg-[#00ff99] shadow-[0_0_10px_rgba(0,255,153,0.5)]" />
                    <span className="text-[var(--fg-40)] text-[10px] font-mono uppercase tracking-widest">{quote.author}</span>
                  </div>
                </>
              : <div className="flex flex-col gap-3 w-full h-full justify-center">
                  {[70, 90, 60, 40].map((w, i) => (<div key={i} className="h-3 rounded bg-[var(--fg-06)] animate-pulse" style={{ width: `${w}%` }} />))}
                </div>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Section ─── */
export default function HobbiesSection() {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();

  const containerRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  // Shared audio/analyser refs so SoundWave syncs with MusicPlayerCard
  const audioRef = useRef<HTMLAudioElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const [playing, setPlaying] = useState(false);
  const [trackIdx, setTrackIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showPlayer, setShowPlayer] = useState(false);

  // Show the floating player the moment music starts; never auto-hide it
  useEffect(() => {
    if (playing) setShowPlayer(true);
  }, [playing]);

  // Sync progress for floating mini player
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTime = () => setProgress(a.duration ? a.currentTime / a.duration : 0);
    a.addEventListener('timeupdate', onTime);
    return () => a.removeEventListener('timeupdate', onTime);
  }, []);

  const pauseAudio = () => {
    audioRef.current?.pause();
    setPlaying(false);
  };

  const resumeAudio = () => {
    audioRef.current?.play().catch(() => {});
    setPlaying(true);
  };

  const nextTrackGlobal = () => setTrackIdx(prev => (prev + 1) % PLAYLIST.length);
  const prevTrackGlobal = () => setTrackIdx(prev => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);

  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const isMobile = useBreakpoint(1024);
  const [isGalleryHovered, setIsGalleryHovered] = useState(false);

  const hobbiesData = useMemo(() => HOBBY_IDS.map((id) => ({
    id,
    title: t(`hobbies.${id}.title`),
    subtitle: t(`hobbies.${id}.subtitle`),
    desc: t(`hobbies.${id}.desc`),
    icon: HOBBY_ICONS[id] || "✨",
    color: HOBBY_COLORS[id] || "#8aa6c1",
    image: getImage(id)
  })), [t]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMobile || !galleryRef.current || !cursorRef.current) return;
    const rect = galleryRef.current.getBoundingClientRect();
    cursorRef.current.style.transform = `translate3d(${e.clientX - rect.left - 40}px, ${e.clientY - rect.top - 40}px, 0)`;
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    setIsGalleryHovered(true);
    if (isMobile || !galleryRef.current || !cursorRef.current) return;
    const rect = galleryRef.current.getBoundingClientRect();
    cursorRef.current.style.transform = `translate3d(${e.clientX - rect.left - 40}px, ${e.clientY - rect.top - 40}px, 0)`;
  };

  return (
    <section
      ref={containerRef}
      id="hobbies"
      className="relative min-h-[120vh] text-[var(--fg)] pt-40 sm:pt-52 pb-24 sm:pb-32 overflow-hidden flex flex-col justify-center transition-colors duration-500 selection:bg-[var(--fg)] selection:text-[var(--bg)] border-t"
      style={{ background: 'transparent', borderColor: 'var(--fg-06)' }}
    >
      <div className="absolute top-1/4 left-0 w-full whitespace-nowrap pointer-events-none select-none z-0 flex flex-col items-center justify-center opacity-[0.04] dark:opacity-[0.06]">
        <h1 className="text-[20vw] font-black uppercase leading-[0.8] tracking-tighter text-transparent custom-stroke">
          {t('hobbies.bg_text')}
        </h1>
      </div>

      {hobbiesData.map((hobby, index) => (
        <div
          key={`glow-${hobby.id}`}
          className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-[1.2s] ease-[cubic-bezier(0.19,1,0.22,1)] blur-[100px] lg:blur-[180px]"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${hobby.color} 0%, transparent 60%)`,
            opacity: activeIndex === index ? (theme === 'light' ? 0.08 : 0.22) : 0
          }}
        />
      ))}

      <div className="relative z-10 w-full max-w-[1800px] mx-auto px-4 sm:px-8 lg:px-12 h-full flex flex-col">
        <div className="mb-12 sm:mb-20 text-center relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="hero-heading font-black uppercase leading-none tracking-tight text-center mb-6 break-words px-4 w-full"
            style={{ fontSize: 'clamp(2rem, 9.5vw, 150px)', color: 'rgb(100, 105, 115)' }}
          >
            {t('hobbies.heading')}
          </motion.h2>
          {t('hobbies.caption') && (
            <motion.p
              initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-base md:text-lg font-light leading-relaxed max-w-[680px] mx-auto text-center"
              style={{ color: 'var(--fg-40)' }}
            >
              {t('hobbies.caption')}
            </motion.p>
          )}
        </div>

        <FadeIn delay={0.4} y={40} className="w-full relative">
          <div
            ref={galleryRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={() => { setIsGalleryHovered(false); if (!isMobile) setActiveIndex(0); }}
            className="w-full h-[75vh] min-h-[600px] lg:h-[750px] flex flex-col lg:flex-row gap-2 lg:gap-4 relative cursor-crosshair awwwards-gallery"
          >
            {!isMobile && (
              <motion.div
                ref={cursorRef}
                animate={{ scale: isGalleryHovered ? 1 : 0, opacity: isGalleryHovered ? 1 : 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
                className="absolute w-20 h-20 rounded-full border border-white/30 backdrop-blur-sm bg-white/5 pointer-events-none z-[100] flex items-center justify-center mix-blend-difference"
                style={{ left: 0, top: 0, position: 'absolute', willChange: 'transform' }}
              >
                <span className="text-[9px] font-mono font-bold tracking-widest text-white uppercase">View</span>
              </motion.div>
            )}

            {hobbiesData.map((hobby, index) => {
              const isActive = activeIndex === index;
              return (
                <div
                  key={hobby.id}
                  role="button" tabIndex={0}
                  onMouseEnter={() => !isMobile && setActiveIndex(index)}
                  onClick={() => isMobile && setActiveIndex(isActive ? null : index)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setActiveIndex(isActive ? null : index); }}
                  className={`awwwards-card relative overflow-hidden bg-[var(--card-bg)] border border-[var(--fg-08)] z-10 transition-all duration-[1.2s] ease-[cubic-bezier(0.19,1,0.22,1)] will-change-[flex,opacity] outline-none focus-visible:border-[var(--fg-35)] cursor-pointer
                    ${isActive ? 'flex-[6] md:flex-[8] lg:flex-[10] opacity-100 rounded-[1.5rem] lg:rounded-[2.5rem] shadow-[0_0_80px_rgba(0,0,0,0.5)] z-30' : 'flex-[2] opacity-75 hover:opacity-90 rounded-[1rem] lg:rounded-[1.5rem]'}`}
                  style={isActive ? { boxShadow: `0 0 100px ${hobby.color}40, inset 0 0 40px ${hobby.color}20`, borderColor: `${hobby.color}80` } : {}}
                >
                  <div className={`absolute inset-0 z-10 transition-opacity duration-[1.2s] mix-blend-color pointer-events-none ${isActive ? 'opacity-50' : 'opacity-0'}`} style={{ backgroundColor: hobby.color }} />
                  <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20vw] lg:text-[15vw] font-black text-[var(--fg-06)] pointer-events-none transition-all duration-[1.5s] ease-[cubic-bezier(0.19,1,0.22,1)] z-0 select-none ${isActive ? 'scale-150 opacity-0' : 'scale-100 opacity-100'}`}>0{index + 1}</div>
                  <div className="absolute inset-0 bg-cover bg-center origin-center z-10 pointer-events-none" style={{ backgroundImage: `url(${hobby.image})`, transform: isActive ? 'scale(1)' : 'scale(1.15) translate3d(0,0,0)', filter: isActive ? 'grayscale(0%) brightness(0.7) contrast(1)' : 'grayscale(100%) brightness(0.25) contrast(1.1)', transition: 'transform 1.5s cubic-bezier(0.19,1,0.22,1), filter 1.5s cubic-bezier(0.19,1,0.22,1)' }} />
                  <div className="absolute inset-0 bg-black/60 transition-opacity duration-[1.2s] ease-[cubic-bezier(0.19,1,0.22,1)] z-15 pointer-events-none" style={{ opacity: isActive ? 0 : 0.7 }} />
                  <div className="absolute inset-0 transition-opacity duration-1000 z-20 pointer-events-none" style={{ opacity: isActive ? 0.95 : 0.4 }}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent lg:h-[80%] lg:top-auto lg:bottom-0" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-transparent opacity-60" />
                    <div className="absolute inset-0 bg-black/20" />
                  </div>
                  <div className={`absolute inset-0 pointer-events-none z-30 hidden lg:flex flex-col items-center justify-between py-10 transition-opacity duration-700 ${isActive ? 'opacity-0' : 'opacity-100'}`}>
                    <span className="text-white/40 text-xs font-mono font-bold tracking-widest">0{index + 1}</span>
                    <div className="relative flex items-center justify-center w-full flex-grow">
                      <span className="text-white/70 font-black uppercase tracking-[0.25em] text-lg sm:text-xl whitespace-nowrap absolute transform -rotate-90 origin-center leading-none">{hobby.title}</span>
                    </div>
                    <div className="w-[1px] h-12 bg-white/20"></div>
                  </div>
                  <div className={`absolute inset-0 pointer-events-none z-30 flex lg:hidden items-center justify-between px-6 transition-opacity duration-700 ${isActive ? 'opacity-0' : 'opacity-100'}`}>
                    <span className="text-white/80 font-black uppercase tracking-[0.2em] text-lg">{hobby.title}</span>
                    <span className="text-white/40 text-xs font-mono font-bold tracking-widest">0{index + 1}</span>
                  </div>
                  <div className="absolute inset-0 p-5 sm:p-8 lg:p-10 flex flex-col justify-between pointer-events-none z-40 transition-all duration-[1.2s] ease-[cubic-bezier(0.19,1,0.22,1)]"
                    style={{ opacity: isActive ? 1 : 0, transform: isActive ? 'translate3d(0,0,0)' : 'translate3d(0,20px,0)', pointerEvents: isActive ? 'auto' : 'none' }}>
                    <div className="flex items-start justify-between w-full">
                      <div className="flex flex-col gap-2" style={{ opacity: isActive ? 1 : 0, transform: isActive ? 'translate3d(0,0,0)' : 'translate3d(0,-15px,0)', transition: 'opacity 0.8s cubic-bezier(0.19,1,0.22,1) 0.15s, transform 0.8s cubic-bezier(0.19,1,0.22,1) 0.15s' }}>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-full border border-white/20 bg-black/40 backdrop-blur-xl flex items-center justify-center text-lg lg:text-xl relative overflow-hidden">{hobby.icon}</div>
                          <span className="text-[#8aa6c1] text-[9px] lg:text-[10px] font-bold tracking-[0.3em] uppercase py-1 px-3 rounded-full border border-[#8aa6c1]/30 bg-[#8aa6c1]/10 backdrop-blur-md">{hobby.subtitle}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-white text-xs lg:text-sm font-mono font-bold tracking-widest">0{index + 1} <span className="text-white/20 mx-1">/</span> <span className="text-white/40">0{hobbiesData.length}</span></span>
                      </div>
                    </div>
                    <div className="flex flex-col items-start gap-3 md:gap-4 w-full pointer-events-none">
                      <div className="flex flex-col overflow-hidden w-full">
                        <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black uppercase tracking-tighter text-white leading-none drop-shadow-2xl"
                          style={{ transform: isActive ? 'translate3d(0,0,0)' : 'translate3d(0,120%,0)', transition: 'transform 1.2s cubic-bezier(0.19,1,0.22,1) 0.1s' }}>
                          {hobby.title}
                        </h3>
                      </div>
                      <div className="max-w-xl border-l border-white/20 pl-4 lg:pl-6"
                        style={{ opacity: isActive ? 1 : 0, transform: isActive ? 'translate3d(0,0,0)' : 'translate3d(0,15px,0)', transition: 'opacity 1s cubic-bezier(0.19,1,0.22,1) 0.2s, transform 1s cubic-bezier(0.19,1,0.22,1) 0.2s' }}>
                        <p className="text-white/80 font-light text-[11px] sm:text-xs md:text-sm leading-relaxed text-left">{hobby.desc}</p>
                      </div>
                    </div>
                  </div>
                  <div className={`absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-white/30 to-transparent transition-opacity duration-1000 ${isActive ? 'opacity-100 delay-500' : 'opacity-0'}`}></div>
                  <div className={`absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-white/30 to-transparent transition-opacity duration-1000 ${isActive ? 'opacity-100 delay-500' : 'opacity-0'}`}></div>
                </div>
              );
            })}
          </div>


        </FadeIn>

        <FadeIn delay={0.5} y={40} className="w-full mt-10 lg:mt-16 relative z-30">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            <SpotifyCard />

            <div className="relative group col-span-1 min-h-[300px] sm:min-h-[360px] lg:h-[400px] rounded-[2rem] overflow-hidden border border-[var(--fg-08)]">
              {/* Inner Spinning Background */}
              <div className="absolute inset-0 bg-[conic-gradient(from_0deg,#ff0055,#00ff99,#00ccff,#ff0055)] animate-[spin_4s_linear_infinite] opacity-100 pointer-events-none" />
              
              {/* Opaque Center */}
              <div className="absolute inset-[3px] md:inset-[4px] bg-[var(--card-bg)] rounded-[1.8rem] z-0" />
              
              {/* Inner Card content */}
              <div className="absolute inset-[3px] md:inset-[4px] p-6 px-6 sm:px-8 rounded-[1.8rem] overflow-hidden flex flex-col justify-end shadow-inner cursor-crosshair z-10">
                <div className="absolute -top-10 -right-10 w-48 h-48 md:w-72 md:h-72 bg-fuchsia-600/20 dark:bg-fuchsia-600/30 blur-[60px] md:blur-[90px] rounded-full group-hover:bg-fuchsia-500/40 transition-colors duration-[2s] animate-[pulse_4s_ease-in-out_infinite]" />
                <div className="absolute -bottom-10 -left-10 w-48 h-48 md:w-72 md:h-72 bg-cyan-600/20 dark:bg-cyan-600/30 blur-[60px] md:blur-[90px] rounded-full group-hover:bg-cyan-500/40 transition-colors duration-[2s] animate-[pulse_5s_ease-in-out_infinite_1s]" />
                <div className="absolute inset-0 bg-[linear-gradient(var(--fg-06)_1px,transparent_1px),linear-gradient(90deg,var(--fg-06)_1px,transparent_1px)] bg-[size:20px_20px] md:bg-[size:30px_30px] opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="relative z-10 w-full mb-6 md:mb-8 pointer-events-none">
                  <SoundWave analyserRef={analyserRef} playing={playing} />
                </div>
                <div className="relative z-10 flex flex-col border-t border-[var(--fg-08)] pt-5 md:pt-6">
                  <span className="text-[var(--fg)] text-3xl md:text-[2rem] font-black uppercase tracking-tighter leading-none mb-1">Frequency</span>
                  <span className="text-[var(--fg-40)] text-[10px] sm:text-xs font-mono tracking-[0.2em] uppercase">Audio Output Spectrum</span>
                  <span className={`absolute right-0 bottom-0 md:bottom-1 text-[9px] font-mono transition-colors duration-300 ${playing ? 'text-[#00ff99] animate-pulse' : 'text-[var(--fg-28)]'}`}>
                    {playing ? 'LIVE [SYNC]' : 'SYNC [OK]'}
                  </span>
                </div>
              </div>
            </div>

            <MusicPlayerCard audioRef={audioRef} analyserRef={analyserRef} playing={playing} setPlaying={setPlaying} trackIdx={trackIdx} setTrackIdx={setTrackIdx} />
          </div>
        </FadeIn>
      </div>
      <FloatingMiniPlayer
        show={showPlayer}
        playing={playing}
        trackIdx={trackIdx}
        analyserRef={analyserRef}
        onPause={pauseAudio}
        onPlay={resumeAudio}
        onNext={nextTrackGlobal}
        onPrev={prevTrackGlobal}
        onClose={() => { pauseAudio(); setShowPlayer(false); }}
        progress={progress}
      />
    </section>
  );
}

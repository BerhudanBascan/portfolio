import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useBreakpoint } from '../hooks/useBreakpoint'

const IMAGES = [
  { src: '/images/contact/github.png', bg: '#F4845F', title: 'GITHUB',   label: 'github.com/BerhudanBascan',       link: 'https://github.com/BerhudanBascan' },
  { src: '/images/contact/linkedin.png', bg: '#6BBF7A', title: 'LINKEDIN', label: 'linkedin.com/in/berhudan-başcan',  link: 'https://www.linkedin.com/in/berhudan-başcan-2b28671aa' },
  { src: '/images/contact/email.png', bg: '#E882B4', title: 'EMAIL',    label: 'berhudanbascan@gmail.com',       link: 'mailto:berhudanbascan@gmail.com' },
  { src: '/images/contact/phone.png', bg: '#6EB5FF', title: 'PHONE',    label: '+90 533 679 71 68',              link: 'tel:+905336797168' },
]

export default function ContactSection() {
  const { t } = useTranslation()
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const isMobile = useBreakpoint(640)
  const dragStartX = useRef<number | null>(null)
  const touchStartX = useRef<number | null>(null)
  const wheelAccum = useRef(0)
  const wheelTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    IMAGES.forEach(item => { const img = new Image(); img.src = item.src })
  }, [])

  const navigate = (dir: 'next' | 'prev') => {
    if (isAnimating) return
    setIsAnimating(true)
    setActiveIndex(prev => dir === 'next' ? (prev + 1) % 4 : (prev + 3) % 4)
    setTimeout(() => setIsAnimating(false), 650)
  }

  const getRole = (i: number) => {
    if (i === activeIndex) return 'center'
    if (i === (activeIndex + 3) % 4) return 'left'
    if (i === (activeIndex + 1) % 4) return 'right'
    return 'back'
  }

  const currentItem = IMAGES[activeIndex]

  const getStyle = (i: number): React.CSSProperties => {
    const role = getRole(i)
    const base: React.CSSProperties = {
      position: 'absolute',
      aspectRatio: '0.6 / 1',
      willChange: 'transform, filter, opacity',
      transition: 'transform 650ms cubic-bezier(0.4,0,0.2,1), filter 650ms cubic-bezier(0.4,0,0.2,1), opacity 650ms cubic-bezier(0.4,0,0.2,1), left 650ms cubic-bezier(0.4,0,0.2,1), bottom 650ms cubic-bezier(0.4,0,0.2,1)',
    }
    if (role === 'center') return { ...base, transform: `translateX(-50%) scale(${isMobile ? 1.25 : 1.15})`,  filter: 'none',      opacity: 1,    zIndex: 20, left: '50%',                       height: isMobile ? '60%' : '65%', bottom: isMobile ? '20%' : '4%'  }
    if (role === 'left')   return { ...base, transform: 'translateX(-50%) scale(1)',                          filter: 'blur(2px)', opacity: 0.85, zIndex: 10, left: isMobile ? '20%' : '30%',  height: isMobile ? '16%' : '26%', bottom: isMobile ? '32%' : '12%' }
    if (role === 'right')  return { ...base, transform: 'translateX(-50%) scale(1)',                          filter: 'blur(2px)', opacity: 0.85, zIndex: 10, left: isMobile ? '80%' : '70%',  height: isMobile ? '16%' : '26%', bottom: isMobile ? '32%' : '12%' }
    return                        { ...base, transform: 'translateX(-50%) scale(1)',                          filter: 'blur(4px)', opacity: 0.5,  zIndex: 5,  left: '50%',                       height: isMobile ? '13%' : '20%', bottom: isMobile ? '36%' : '16%' }
  }

  return (
    <section
      id="contact"
      className="relative w-full -mt-10 sm:-mt-12 md:-mt-14 z-10"
      style={{
        backgroundColor: currentItem.bg,
        transition: 'background-color 650ms cubic-bezier(0.4,0,0.2,1)',
        fontFamily: 'Inter, sans-serif',
        borderRadius: '40px 40px 0 0'
      }}
    >
      {/* Performant GPU-Accelerated Steam/Glow Effect */}
      <style>{`
        @keyframes chimney-left {
          0% { transform: translate(-50%, 0) scale(0.2); opacity: 0; }
          15% { opacity: 0.8; }
          50% { transform: translate(calc(-50% - 6vw), -10vh) scale(1.5); opacity: 0.6; }
          80% { transform: translate(calc(-50% - 15vw), -20vh) scale(3); opacity: 0.2; }
          100% { transform: translate(calc(-50% - 20vw), -25vh) scale(4); opacity: 0; }
        }
        @keyframes chimney-right {
          0% { transform: translate(-50%, 0) scale(0.2); opacity: 0; }
          15% { opacity: 0.8; }
          50% { transform: translate(calc(-50% + 8vw), -12vh) scale(1.6); opacity: 0.6; }
          80% { transform: translate(calc(-50% + 18vw), -22vh) scale(3.2); opacity: 0.2; }
          100% { transform: translate(calc(-50% + 25vw), -28vh) scale(4.5); opacity: 0; }
        }
        @keyframes chimney-center {
          0% { transform: translate(-50%, 0) scale(0.2); opacity: 0; }
          15% { opacity: 0.9; }
          50% { transform: translate(calc(-50% + 2vw), -15vh) scale(1.8); opacity: 0.7; }
          80% { transform: translate(calc(-50% - 3vw), -25vh) scale(3.5); opacity: 0.3; }
          100% { transform: translate(calc(-50% + 5vw), -30vh) scale(5); opacity: 0; }
        }
        @keyframes contactFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        .chimney-particle {
          position: absolute;
          left: 50%;
          bottom: -40px;
          border-radius: 50%;
          filter: blur(25px);
          will-change: transform, opacity;
        }
      `}</style>
      {IMAGES.map((img, i) => (
        <div 
          key={img.title}
          className="absolute -top-40 md:-top-56 left-0 w-full h-40 md:h-56 pointer-events-none mix-blend-screen"
          style={{
            opacity: activeIndex === i ? 1 : 0,
            transition: 'opacity 650ms cubic-bezier(0.4,0,0.2,1)',
            willChange: 'opacity',
            zIndex: 1
          }}
        >
          {/* Chimney Smoke Billowing from Center */}
          <div className="chimney-particle w-32 h-32 md:w-48 md:h-48" style={{ background: `radial-gradient(circle, ${img.bg} 0%, transparent 70%)`, animation: 'chimney-left 4.5s infinite ease-in-out 0s' }} />
          <div className="chimney-particle w-32 h-32 md:w-48 md:h-48" style={{ background: `radial-gradient(circle, ${img.bg} 0%, transparent 70%)`, animation: 'chimney-right 5.2s infinite ease-in-out 0.8s' }} />
          <div className="chimney-particle w-40 h-40 md:w-56 md:h-56" style={{ background: `radial-gradient(circle, ${img.bg} 0%, transparent 70%)`, animation: 'chimney-center 4.8s infinite ease-in-out 1.5s' }} />
          
          <div className="chimney-particle w-32 h-32 md:w-48 md:h-48" style={{ background: `radial-gradient(circle, ${img.bg} 0%, transparent 70%)`, animation: 'chimney-left 5s infinite ease-in-out 2.2s' }} />
          <div className="chimney-particle w-32 h-32 md:w-48 md:h-48" style={{ background: `radial-gradient(circle, ${img.bg} 0%, transparent 70%)`, animation: 'chimney-right 4.7s infinite ease-in-out 3s' }} />
          <div className="chimney-particle w-40 h-40 md:w-56 md:h-56" style={{ background: `radial-gradient(circle, ${img.bg} 0%, transparent 70%)`, animation: 'chimney-center 5.5s infinite ease-in-out 3.8s' }} />
        </div>
      ))}
      
      {/* Soft Transition Gradient from main background to contact background */}
      <div 
        className="absolute top-0 left-0 w-full h-40 md:h-64 z-40 pointer-events-none mix-blend-normal"
        style={{ background: 'linear-gradient(to bottom, var(--bg) 0%, transparent 100%)' }}
      />
      
      <div className="relative w-full" style={{ height: 'clamp(600px, 100svh, 820px)', overflow: 'hidden' }}>

        {/* Grain overlay */}
        <div className="absolute inset-0 pointer-events-none z-50 opacity-40 mix-blend-overlay">
          <svg width="100%" height="100%">
            <filter id="noise">
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch" />
              <feColorMatrix type="matrix" values="1 0 0 0 0, 0 1 0 0 0, 0 0 1 0 0, 0 0 0 0.1 0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noise)" />
          </svg>
        </div>

        {/* Giant ghost text */}
        <div className="absolute inset-x-0 flex items-center justify-center pointer-events-none select-none" style={{ zIndex: 2, top: '18%' }}>
          <AnimatePresence mode="wait">
            <motion.h1
              key={currentItem.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              style={{ fontFamily: 'Anton, sans-serif', fontSize: 'clamp(70px, 20vw, 380px)', fontWeight: 900, color: 'white', lineHeight: 1, textTransform: 'uppercase', letterSpacing: '-0.02em', whiteSpace: 'nowrap', opacity: 0.9 }}
            >
              {currentItem.title}
            </motion.h1>
          </AnimatePresence>
        </div>

        {/* Top-left label */}
        <div className="absolute top-6 left-4 sm:left-8" style={{ zIndex: 60 }}>
          <span className="text-xs font-semibold uppercase" style={{ color: 'white', opacity: 0.9, letterSpacing: '0.18em' }}>Berhudan</span>
        </div>

        {/* Carousel */}
        <div
          className="absolute inset-0"
          style={{ zIndex: 3, cursor: 'grab' }}
          onMouseDown={e => { dragStartX.current = e.clientX }}
          onMouseUp={e => {
            if (dragStartX.current === null) return
            const delta = e.clientX - dragStartX.current
            dragStartX.current = null
            if (Math.abs(delta) < 40) return
            navigate(delta < 0 ? 'next' : 'prev')
          }}
          onMouseLeave={() => { dragStartX.current = null }}
          onTouchStart={e => { touchStartX.current = e.touches[0].clientX }}
          onTouchEnd={e => {
            if (touchStartX.current === null) return
            const delta = e.changedTouches[0].clientX - touchStartX.current
            touchStartX.current = null
            if (Math.abs(delta) < 40) return
            navigate(delta < 0 ? 'next' : 'prev')
          }}
          onWheel={e => {
            if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) return
            wheelAccum.current += e.deltaX
            if (wheelTimer.current) clearTimeout(wheelTimer.current)
            wheelTimer.current = setTimeout(() => { wheelAccum.current = 0 }, 300)
            if (Math.abs(wheelAccum.current) > 60) {
              const dir = wheelAccum.current > 0 ? 'next' : 'prev'
              wheelAccum.current = 0
              navigate(dir)
            }
          }}
        >
          {IMAGES.map((item, i) => {
            const role = getRole(i)
            const floatDelay = [0, 0.8, 1.6, 2.4][i]
            const floatDur = role === 'center' ? '3.2s' : '4s'
            return (
              <div key={i} style={getStyle(i)}>
                <div style={{ width: '100%', height: '100%', animation: `contactFloat ${floatDur} ease-in-out ${floatDelay}s infinite` }}>
                  <img src={item.src} alt={item.title} className="w-full h-full object-contain drop-shadow-2xl pointer-events-none" style={{ objectPosition: 'bottom center' }} draggable={false} />
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom-left text + nav buttons */}
        <div className="absolute bottom-8 left-4 sm:bottom-20 sm:left-12 lg:left-24" style={{ zIndex: 60, maxWidth: 400 }}>
          <p className="font-bold uppercase tracking-[0.02em] mb-1 sm:mb-3 text-base sm:text-[22px]" style={{ color: 'white', opacity: 0.95 }}>
            {currentItem.title}
          </p>
          <p className="block text-[10px] sm:text-sm mb-3 sm:mb-6" style={{ color: 'white', opacity: 0.75, lineHeight: 1.5 }}>
            <span className="hidden sm:inline">{t('contact.reach', { platform: currentItem.title.toLowerCase() })}<br /></span>
            <strong>{currentItem.label}</strong>
          </p>
          <div className="flex gap-4">
            {([{ dir: 'prev' as const, Icon: ArrowLeft }, { dir: 'next' as const, Icon: ArrowRight }]).map(({ dir, Icon }) => (
              <button
                key={dir}
                onClick={() => navigate(dir)}
                disabled={isAnimating}
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-white/50 flex items-center justify-center text-white transition-all duration-150 hover:scale-[1.08] hover:bg-white/10 active:scale-95 disabled:opacity-50"
              >
                <Icon size={26} strokeWidth={2.25} />
              </button>
            ))}
          </div>
        </div>

        {/* Bottom-right link */}
        <a
          href={currentItem.link}
          target={currentItem.link.startsWith('http') ? '_blank' : undefined}
          rel="noopener noreferrer"
          className="absolute bottom-8 right-4 sm:bottom-20 sm:right-10 flex items-center gap-3 group"
          style={{ zIndex: 60 }}
        >
          <span style={{ fontFamily: 'Anton, sans-serif', fontSize: 'clamp(24px, 4vw, 56px)', fontWeight: 400, color: 'white', opacity: 0.9, letterSpacing: '-0.02em', lineHeight: 1, textTransform: 'uppercase', transition: 'opacity 200ms' }}
            onMouseEnter={e => ((e.currentTarget as HTMLSpanElement).style.opacity = '1')}
            onMouseLeave={e => ((e.currentTarget as HTMLSpanElement).style.opacity = '0.9')}
          >
            {t('contact.connect')}
          </span>
          <ArrowRight className="w-6 h-6 sm:w-10 sm:h-10 text-white/90 group-hover:text-white transition-transform duration-300 group-hover:translate-x-2" strokeWidth={3} />
        </a>

      </div>
    </section>
  )
}

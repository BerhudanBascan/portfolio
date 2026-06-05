import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640)
  const dragStartX = useRef<number | null>(null)
  const touchStartX = useRef<number | null>(null)
  const wheelAccum = useRef(0)
  const wheelTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    IMAGES.forEach(item => { const img = new Image(); img.src = item.src })
    const handleResize = () => setIsMobile(window.innerWidth < 640)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
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
    if (role === 'center') return { ...base, transform: `translateX(-50%) scale(${isMobile ? 1.25 : 1.68})`, filter: 'none',      opacity: 1,    zIndex: 20, left: '50%',                       height: isMobile ? '60%' : '92%', bottom: isMobile ? '20%' : '-4%' }
    if (role === 'left')   return { ...base, transform: 'translateX(-50%) scale(1)',                          filter: 'blur(2px)', opacity: 0.85, zIndex: 10, left: isMobile ? '20%' : '30%',  height: isMobile ? '16%' : '28%', bottom: isMobile ? '32%' : '12%' }
    if (role === 'right')  return { ...base, transform: 'translateX(-50%) scale(1)',                          filter: 'blur(2px)', opacity: 0.85, zIndex: 10, left: isMobile ? '80%' : '70%',  height: isMobile ? '16%' : '28%', bottom: isMobile ? '32%' : '12%' }
    return                        { ...base, transform: 'translateX(-50%) scale(1)',                          filter: 'blur(4px)', opacity: 0.5,  zIndex: 5,  left: '50%',                       height: isMobile ? '13%' : '22%', bottom: isMobile ? '36%' : '16%' }
  }

  return (
    <section
      id="contact"
      className="relative w-full overflow-hidden -mt-10 sm:-mt-12 md:-mt-14 z-10"
      style={{ backgroundColor: currentItem.bg, transition: 'background-color 650ms cubic-bezier(0.4,0,0.2,1)', fontFamily: 'Inter, sans-serif', borderRadius: '40px 40px 0 0' }}
    >
      <div className="relative w-full" style={{ height: '120vh', overflow: 'hidden' }}>

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
          {IMAGES.map((item, i) => (
            <div key={i} style={getStyle(i)}>
              <img src={item.src} alt={item.title} className="w-full h-full object-contain drop-shadow-2xl pointer-events-none" style={{ objectPosition: 'bottom center' }} draggable={false} />
            </div>
          ))}
        </div>

        {/* Bottom-left text + nav buttons */}
        <div className="absolute bottom-6 left-4 sm:bottom-20 sm:left-12 lg:left-24" style={{ zIndex: 60, maxWidth: 400 }}>
          <p className="font-bold uppercase tracking-[0.02em] mb-2 sm:mb-3 text-base sm:text-[22px]" style={{ color: 'white', opacity: 0.95 }}>
            {currentItem.title}
          </p>
          <p className="hidden sm:block text-xs sm:text-sm mb-4 sm:mb-6" style={{ color: 'white', opacity: 0.85, lineHeight: 1.6 }}>
            {t('contact.reach', { platform: currentItem.title.toLowerCase() })}<br />
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
          className="absolute bottom-6 right-4 sm:bottom-20 sm:right-10 flex items-center gap-3 group"
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

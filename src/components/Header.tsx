import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../context/ThemeContext'

const LANGS = ['EN', 'TR', 'DE'] as const
const SOCIALS = [
  { label: 'GH', href: 'https://github.com/BerhudanBascan' },
  { label: 'LN', href: 'https://www.linkedin.com/in/berhudan-başcan-2b28671aa' },
  { label: 'ML', href: 'mailto:berhudanbascan@gmail.com' },
]

/* ─── Magnetic wrapper ─── */
function MagneticWrapper({ children }: { children: React.ReactNode }) {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const ref = useRef<HTMLDivElement>(null)
  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const { left, top, width, height } = ref.current.getBoundingClientRect()
    setPos({ x: (e.clientX - left - width / 2) * 0.2, y: (e.clientY - top - height / 2) * 0.2 })
  }
  return (
    <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={() => setPos({ x: 0, y: 0 })}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
    >{children}</motion.div>
  )
}

/* ─── Theme bulb ─── */
function ThemeBulb() {
  const { theme, toggleTheme } = useTheme()
  const isLight = theme === 'light'
  const [isPulling, setIsPulling] = useState(false)
  return (
    <motion.div className="flex flex-col items-center cursor-pointer select-none origin-top"
      onPointerDown={() => setIsPulling(true)}
      onPointerUp={() => { setIsPulling(false); toggleTheme() }}
      onPointerLeave={() => setIsPulling(false)}
      animate={{ y: isPulling ? 10 : 0 }}
      transition={{ type: 'spring', stiffness: 500, damping: 6, mass: 0.8 }}
      style={{ marginTop: '-0.4rem' }}
    >
      <motion.div className="w-[1.5px]"
        animate={{ height: isPulling ? 40 : 22, backgroundColor: isLight ? '#f59e0b' : 'rgba(215,226,234,0.3)' }}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      />
      <div style={{ width: 8, height: 6, background: '#333', borderRadius: '2px 2px 0 0', marginBottom: -1 }} />
      <motion.div className="relative flex items-center justify-center"
        animate={{ rotate: isPulling ? -6 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 10 }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24"
          fill={isLight ? '#fcd34d' : 'transparent'}
          stroke={isLight ? '#b45309' : 'rgba(215,226,234,0.4)'}
          strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"
          style={{ transition: 'fill 0.4s, stroke 0.4s' }}
        >
          <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5" />
          <path d="M9 18h6" /><path d="M10 22h4" />
        </svg>
        <AnimatePresence>
          {isLight && (
            <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }} transition={{ duration: 0.4 }}
              style={{ position: 'absolute', top: 4, left: '50%', transform: 'translateX(-50%)', width: 50, height: 50, background: 'rgba(252,211,77,0.25)', borderRadius: '50%', filter: 'blur(12px)', pointerEvents: 'none' }}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

/* ─── Lang switch ─── */
function LangSwitch() {
  const { i18n } = useTranslation()
  const btnRef = useRef<HTMLButtonElement>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const idx = LANGS.findIndex(l => l.toLowerCase() === i18n.language.toLowerCase())
  const current = idx === -1 ? 0 : idx
  const cycle = () => i18n.changeLanguage(LANGS[(current + 1) % LANGS.length].toLowerCase())
  const onMove = (e: React.MouseEvent) => {
    if (!btnRef.current) return
    const r = btnRef.current.getBoundingClientRect()
    setPos({ x: (e.clientX - r.left - r.width / 2) * 0.3, y: (e.clientY - r.top - r.height / 2) * 0.3 })
  }
  return (
    <motion.button ref={btnRef} onClick={cycle} onMouseMove={onMove} onMouseLeave={() => setPos({ x: 0, y: 0 })}
      animate={{ x: pos.x, y: pos.y }} transition={{ type: 'spring', stiffness: 180, damping: 14, mass: 0.1 }}
      whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
      style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid var(--fg-18)', background: 'transparent', cursor: 'pointer', position: 'relative', overflow: 'hidden', flexShrink: 0 }}
    >
      <AnimatePresence mode="wait">
        <motion.span key={LANGS[current]}
          initial={{ opacity: 0, y: 10, rotateX: 80 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} exit={{ opacity: 0, y: -10, rotateX: -80 }}
          transition={{ duration: 0.22 }}
          style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.52rem', fontWeight: 900, letterSpacing: '0.12em', color: 'var(--fg)', pointerEvents: 'none' }}
        >{LANGS[current]}</motion.span>
      </AnimatePresence>
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', transform: 'rotate(-90deg)', pointerEvents: 'none', opacity: 0.45 }} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="47" fill="none" stroke="white" strokeWidth="1.5" opacity="0.15" />
        <motion.circle cx="50" cy="50" r="47" fill="none" stroke="white" strokeWidth="2"
          strokeDasharray="295.3"
          animate={{ strokeDashoffset: 295.3 - (295.3 * ((current + 1) / LANGS.length)) }}
          transition={{ type: 'spring', bounce: 0.3 }}
        />
      </svg>
    </motion.button>
  )
}

/* ─── Desktop pill nav ─── */
function DesktopNav({ navLinks }: { navLinks: { label: string; href: string }[] }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [visible, setVisible] = useState(true)
  const lastY = useRef(0)
  const { t } = useTranslation()

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      const diff = y - lastY.current
      if (Math.abs(diff) > 8) {
        setVisible(diff < 0 || y < 80)
        lastY.current = y
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: visible ? 0 : -120, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
      className="hidden md:flex justify-center w-full fixed top-5 z-50 pointer-events-none"
    >
      <div className="flex items-center p-1.5 rounded-full pointer-events-auto relative overflow-hidden group/nav"
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {/* Glass bg */}
        <div className="absolute inset-0 bg-[#0c0c0c]/50 backdrop-blur-2xl border border-white/10 rounded-full z-0 shadow-[0_8px_32px_rgba(0,0,0,0.3)] group-hover/nav:bg-[#141414]/70 transition-colors duration-500" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        <div className="relative z-10 flex items-center">
          {/* Logo */}
          <MagneticWrapper>
            <div className="pl-5 pr-5 font-black text-base tracking-tighter text-white flex items-center gap-2.5 cursor-pointer group/logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="relative w-5 h-5 flex items-center justify-center">
                <div className="absolute inset-0 border-[1.5px] border-white/30 rounded-full group-hover/logo:border-white transition-colors duration-500" />
                <div className="w-1.5 h-1.5 bg-white rounded-full group-hover/logo:scale-150 transition-transform duration-500" />
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-[-4px] border border-dashed border-white/20 rounded-full opacity-0 group-hover/logo:opacity-100 transition-opacity duration-500"
                />
              </div>
              <span className="relative overflow-hidden h-[20px]">
                <span className="block group-hover/logo:-translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] text-sm">B.</span>
                <span className="absolute left-0 top-full block group-hover/logo:-translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] text-sm text-[#D7E2EA]">B.</span>
              </span>
            </div>
          </MagneticWrapper>

          <div className="w-px h-5 bg-white/10 mx-1" />

          {/* Nav items */}
          <div className="flex relative px-1">
            {navLinks.map((item, index) => (
              <a key={item.href} href={item.href}
                onMouseEnter={() => setHoveredIndex(index)}
                className="relative px-4 py-2 cursor-pointer z-10 flex items-center"
                style={{ textDecoration: 'none' }}
              >
                <span className="relative overflow-hidden block h-[18px] z-10">
                  <motion.span
                    animate={{ y: hoveredIndex === index ? '-100%' : '0%' }}
                    transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
                    className="block text-[11px] font-bold tracking-widest uppercase"
                    style={{ color: hoveredIndex === index ? '#000' : 'rgba(255,255,255,0.65)' }}
                  >{item.label}</motion.span>
                  <motion.span
                    animate={{ y: hoveredIndex === index ? '-100%' : '0%' }}
                    transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
                    className="absolute left-0 top-full block w-full text-center text-[11px] font-bold tracking-widest uppercase text-black"
                  >{item.label}</motion.span>
                </span>
                {hoveredIndex === index && (
                  <motion.div layoutId="nav-pill"
                    className="absolute inset-0 bg-white rounded-full z-0 pointer-events-none"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </a>
            ))}
          </div>

          <div className="w-px h-5 bg-white/10 mx-1" />

          {/* Controls */}
          <div className="flex items-center gap-2 pl-2 pr-3">
            <ThemeBulb />
            <LangSwitch />
            <MagneticWrapper>
              <motion.a href="#contact"
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="ml-1 h-8 px-4 rounded-full bg-white/10 hover:bg-white text-white hover:text-black text-[10px] font-bold tracking-widest uppercase flex items-center gap-2 transition-colors duration-300 border border-white/20 hover:border-white group/btn overflow-hidden relative"
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  {t('contact_btn')}
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 group-hover/btn:bg-black transition-colors duration-300 shadow-[0_0_6px_rgba(74,222,128,0.8)] group-hover/btn:shadow-none" />
                </span>
              </motion.a>
            </MagneticWrapper>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}

/* ─── Mobile fullscreen menu ─── */
function MobileMenu({ isOpen, setIsOpen, navLinks }: { isOpen: boolean; setIsOpen: (v: boolean) => void; navLinks: { label: string; href: string }[] }) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ clipPath: 'circle(0% at calc(100% - 56px) 56px)' }}
          animate={{ clipPath: 'circle(150% at calc(100% - 56px) 56px)' }}
          exit={{ clipPath: 'circle(0% at calc(100% - 56px) 56px)' }}
          transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
          style={{ position: 'fixed', inset: 0, zIndex: 998, background: 'var(--bg)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 2.5rem' }}
        >
          {/* Close button */}
          <motion.button onClick={() => setIsOpen(false)}
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.35, duration: 0.3 }}
            style={{ position: 'absolute', top: '1.2rem', right: '1.2rem', width: 44, height: 44, borderRadius: '50%', border: '1px solid var(--fg-18)', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" stroke="var(--fg)" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </motion.button>

          {/* Decorative rings */}
          <div style={{ position: 'absolute', inset: 0, opacity: 0.15, pointerEvents: 'none', overflow: 'hidden' }}>
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.4, duration: 1.5 }}
              style={{ position: 'absolute', top: '5%', right: '-20%', width: '80vw', height: '80vw', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)' }} />
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.5, duration: 1.5 }}
              style={{ position: 'absolute', bottom: '0%', left: '-20%', width: '100vw', height: '100vw', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.05)' }} />
          </div>

          {/* Nav links */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative', zIndex: 10, marginTop: '2rem' }}>
            {navLinks.map((item, i) => (
              <div key={item.href} style={{ overflow: 'hidden' }}>
                <motion.a href={item.href} onClick={() => setIsOpen(false)}
                  initial={{ y: 80, opacity: 0, rotateZ: 4 }}
                  animate={{ y: 0, opacity: 1, rotateZ: 0 }}
                  exit={{ y: -40, opacity: 0, rotateZ: -4 }}
                  transition={{ duration: 0.7, delay: 0.3 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  style={{ display: 'inline-block', fontSize: 'clamp(2.8rem, 14vw, 5rem)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.03em', color: 'var(--fg)', textDecoration: 'none', lineHeight: 1 }}
                  className="hover:opacity-60 transition-opacity duration-300"
                >{item.label}</motion.a>
              </div>
            ))}
          </nav>

          {/* Footer */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.6 }}
            style={{ position: 'absolute', bottom: '2.5rem', left: '2.5rem', right: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}
          >
            <div style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.18em', color: 'var(--fg-35)', textTransform: 'uppercase', lineHeight: 1.8 }}>
              Berhudan Başcan © 2026<br />
              <span style={{ color: 'var(--fg-18)' }}>All rights reserved</span>
            </div>
            <div style={{ display: 'flex', gap: 20 }}>
              {SOCIALS.map(s => (
                <motion.a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  whileHover={{ y: -3 }}
                  style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.18em', color: 'var(--fg-40)', textTransform: 'uppercase', textDecoration: 'none' }}
                  className="hover:text-white transition-colors"
                >{s.label}</motion.a>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ─── Mobile top bar ─── */
function MobileBar({ menuOpen, setMenuOpen }: { menuOpen: boolean; setMenuOpen: (v: boolean) => void }) {
  const visibleRef = useRef(true)
  const lastY = useRef(0)
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      const diff = y - lastY.current
      if (Math.abs(diff) > 6) {
        visibleRef.current = diff < 0
        if (barRef.current) barRef.current.style.transform = visibleRef.current ? 'translateY(0)' : 'translateY(-100%)'
        lastY.current = y
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div ref={barRef} className="md:hidden" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, transition: 'transform 0.35s cubic-bezier(0.25,0.1,0.25,1)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.9rem 1.2rem', borderBottom: '1px solid var(--fg-06)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', backgroundColor: 'var(--header-bg)' }}>
        <span style={{ color: 'var(--fg)', fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.65 }}>Berhudan</span>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
          <ThemeBulb />
          <LangSwitch />
          <motion.button onClick={() => setMenuOpen(!menuOpen)}
            style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid var(--fg-15)', background: 'transparent', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5, flexShrink: 0 }}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          >
            <motion.div animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 7 : 0 }} transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
              style={{ width: 17, height: 1.5, background: 'var(--fg)', borderRadius: 2 }} />
            <motion.div animate={{ opacity: menuOpen ? 0 : 1 }} transition={{ duration: 0.25 }}
              style={{ width: 17, height: 1.5, background: 'var(--fg)', borderRadius: 2 }} />
            <motion.div animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -7 : 0 }} transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
              style={{ width: 17, height: 1.5, background: 'var(--fg)', borderRadius: 2 }} />
          </motion.button>
        </div>
      </div>
    </div>
  )
}

/* ─── Main export ─── */
export default function Header() {
  const { t } = useTranslation()
  const [menuOpen, setMenuOpen] = useState(false)

  const NAV_LINKS = [
    { label: t('nav.about'),      href: '#about' },
    { label: t('nav.experience'), href: '#experience' },
    { label: t('nav.skills'),     href: '#skills' },
    { label: t('nav.services'),   href: '#services' },
    { label: t('nav.projects'),   href: '#projects' },
    { label: t('nav.hobbies'),    href: '#hobbies' },
    { label: t('nav.contact'),    href: '#contact' },
  ]

  return (
    <>
      <DesktopNav navLinks={NAV_LINKS} />
      <MobileBar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MobileMenu isOpen={menuOpen} setIsOpen={setMenuOpen} navLinks={NAV_LINKS} />
    </>
  )
}

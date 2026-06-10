import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../context/ThemeContext'
import { useLangChange } from '../context/LangContext'

const LANGS = ['EN', 'TR', 'DE'] as const

function scrollTo(href: string) {
  const el = document.querySelector(href)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}
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
    <motion.div 
      className="flex flex-col items-center cursor-pointer select-none origin-top shrink-0 -mt-1 sm:-mt-[0.4rem] md:-mt-[0.5rem] lg:-mt-[0.4rem]"
      onPointerDown={() => setIsPulling(true)}
      onPointerUp={() => { setIsPulling(false); toggleTheme() }}
      onPointerLeave={() => setIsPulling(false)}
      animate={{ y: isPulling ? 10 : 0 }}
      transition={{ type: 'spring', stiffness: 500, damping: 6, mass: 0.8 }}
      role="button"
      aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
      tabIndex={0}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && (setIsPulling(false), toggleTheme())}
    >
      <motion.div className="w-[1px] sm:w-[1.5px] md:w-[2px] lg:w-[1.5px]"
        animate={{ height: isPulling ? 40 : 22, backgroundColor: isLight ? '#f59e0b' : 'var(--fg-28)' }}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      />
      <div className="w-1.5 h-1 sm:w-2 sm:h-1.5 md:w-2.5 md:h-2 lg:w-2 lg:h-1.5 bg-[var(--fg-40)] rounded-t-[2px] -mb-px" />
      <motion.div className="relative flex items-center justify-center scale-75 sm:scale-100 md:scale-110 lg:scale-100"
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
              className="absolute top-1 left-1/2 -translate-x-1/2 w-10 h-10 sm:w-[50px] sm:h-[50px] md:w-[60px] md:h-[60px] lg:w-[50px] lg:h-[50px] bg-amber-300/25 rounded-full blur-[12px] pointer-events-none"
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
  const requestLangChange = useLangChange()
  const btnRef = useRef<HTMLButtonElement>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const idx = LANGS.findIndex(l => l.toLowerCase() === i18n.language.split('-')[0].toLowerCase())
  const current = idx === -1 ? 0 : idx
  const cycle = () => requestLangChange(LANGS[(current + 1) % LANGS.length].toLowerCase())
  const onMove = (e: React.MouseEvent) => {
    if (!btnRef.current) return
    const r = btnRef.current.getBoundingClientRect()
    setPos({ x: (e.clientX - r.left - r.width / 2) * 0.3, y: (e.clientY - r.top - r.height / 2) * 0.3 })
  }
  return (
    <motion.button ref={btnRef} onClick={cycle} onMouseMove={onMove} onMouseLeave={() => setPos({ x: 0, y: 0 })}
      animate={{ x: pos.x, y: pos.y }} transition={{ type: 'spring', stiffness: 180, damping: 14, mass: 0.1 }}
      whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
      aria-label={`Change language, current: ${LANGS[current]}`}
      className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-9 lg:h-9 rounded-full border border-[var(--fg-18)] bg-transparent cursor-pointer relative overflow-hidden shrink-0 flex items-center justify-center"
    >
      <AnimatePresence mode="wait">
        <motion.span key={LANGS[current]}
          initial={{ opacity: 0, y: 10, rotateX: 80 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} exit={{ opacity: 0, y: -10, rotateX: -80 }}
          transition={{ duration: 0.22 }}
          className="absolute inset-0 flex items-center justify-center text-[0.45rem] sm:text-[0.52rem] md:text-[0.6rem] lg:text-[0.52rem] font-black tracking-widest text-[var(--fg)] pointer-events-none"
        >{LANGS[current]}</motion.span>
      </AnimatePresence>
      <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none opacity-45" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="47" fill="none" stroke="var(--fg)" strokeWidth="1.5" className="opacity-15" />
        <motion.circle cx="50" cy="50" r="47" fill="none" stroke="var(--fg)" strokeWidth="2"
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
      className="hidden lg:flex justify-center w-full fixed top-5 z-50 pointer-events-none"
    >
      <div className="flex items-center p-1.5 rounded-full pointer-events-auto relative overflow-hidden group/nav"
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {/* Glass bg — theme-aware */}
        <div className="absolute inset-0 backdrop-blur-2xl border border-white/10 rounded-full z-0 shadow-[0_8px_32px_rgba(0,0,0,0.3)] group-hover/nav:transition-colors duration-500"
          style={{ backgroundColor: 'color-mix(in srgb, var(--bg) 70%, transparent)', borderColor: 'var(--fg-10)' }} />
        <div className="absolute inset-x-0 bottom-0 h-px" style={{ background: 'linear-gradient(to right, transparent, var(--fg-18), transparent)' }} />

        <div className="relative z-10 flex items-center">
          {/* Logo */}
          <MagneticWrapper>
            <div className="pl-5 pr-5 font-black text-base tracking-tighter text-[var(--fg)] flex items-center gap-2.5 cursor-pointer group/logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="relative w-5 h-5 flex items-center justify-center">
                <div className="absolute inset-0 border-[1.5px] border-[var(--fg-28)] group-hover/logo:border-[var(--fg)] rounded-full transition-colors duration-500" />
                <div className="w-1.5 h-1.5 bg-[var(--fg)] rounded-full group-hover/logo:scale-150 transition-transform duration-500" />
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-[-4px] border border-dashed border-[var(--fg-18)] rounded-full opacity-0 group-hover/logo:opacity-100 transition-opacity duration-500"
                />
              </div>
              <span className="relative overflow-hidden h-[20px]">
                <span className="block group-hover/logo:-translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] text-sm">B.</span>
                <span className="absolute left-0 top-full block group-hover/logo:-translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] text-sm text-[var(--fg)]">B.</span>
              </span>
            </div>
          </MagneticWrapper>

          <div className="w-px h-5 bg-[var(--fg-10)] mx-1" />

          {/* Nav items */}
          <div className="flex relative px-1">
            {navLinks.map((item, index) => (
              <a key={item.href} href={item.href}
                onMouseEnter={() => setHoveredIndex(index)}
                onClick={e => { e.preventDefault(); scrollTo(item.href) }}
                className="relative px-4 py-2 cursor-pointer z-10 flex items-center"
                style={{ textDecoration: 'none' }}
              >
                <span className="relative overflow-hidden block h-[18px] z-10">
                  <motion.span
                    animate={{ y: hoveredIndex === index ? '-100%' : '0%' }}
                    transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
                    className="block text-[11px] font-bold tracking-widest uppercase"
                    style={{ color: hoveredIndex === index ? 'var(--bg)' : 'var(--fg-40)' }}
                  >{item.label}</motion.span>
                  <motion.span
                    animate={{ y: hoveredIndex === index ? '-100%' : '0%' }}
                    transition={{ duration: 0.35, ease: [0.76, 0, 0.24, 1] }}
                    className="absolute left-0 top-full block w-full text-center text-[11px] font-bold tracking-widest uppercase"
                    style={{ color: 'var(--bg)' }}
                  >{item.label}</motion.span>
                </span>
                {hoveredIndex === index && (
                  <motion.div layoutId="nav-pill"
                    className="absolute inset-0 rounded-full z-0 pointer-events-none"
                    style={{ backgroundColor: 'var(--fg)' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </a>
            ))}
          </div>

          <div className="w-px h-5 bg-[var(--fg-10)] mx-1" />

          {/* Controls */}
          <div className="flex items-center gap-2 pl-2 pr-3">
            <ThemeBulb />
            <LangSwitch />
            <MagneticWrapper>
              <motion.a href="#contact"
                onClick={e => { e.preventDefault(); scrollTo('#contact') }}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="ml-1 h-8 px-4 rounded-full bg-[var(--fg-08)] hover:bg-[var(--fg)] text-[var(--fg)] hover:text-[var(--bg)] text-[10px] font-bold tracking-widest uppercase flex items-center gap-2 transition-colors duration-300 border border-[var(--fg-18)] hover:border-[var(--fg)] group/btn overflow-hidden relative"
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  {t('contact_btn')}
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 group-hover/btn:bg-[var(--bg)] transition-colors duration-300 shadow-[0_0_6px_rgba(74,222,128,0.8)] group-hover/btn:shadow-none" />
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
  const scrollY = useRef(0)

  useEffect(() => {
    if (isOpen) {
      scrollY.current = window.scrollY
      document.documentElement.style.overflow = 'hidden'
    } else {
      document.documentElement.style.overflow = ''
    }
    return () => { document.documentElement.style.overflow = '' }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="fixed inset-0 z-[999] bg-[var(--bg)] flex flex-col w-full h-[100dvh] overflow-hidden"
        >
          {/* Top bar inside menu — logo + close */}
          <div className="flex items-center justify-between p-4 sm:py-5 sm:px-8 md:py-6 md:px-12 border-b border-[var(--fg-06)] shrink-0 w-full">
            <span className="text-[var(--fg)] text-[0.65rem] sm:text-[0.75rem] md:text-[0.85rem] font-extrabold tracking-[0.2em] uppercase opacity-65">Berhudan</span>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
              className="w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full border border-[var(--fg-18)] bg-transparent cursor-pointer flex items-center justify-center shrink-0 hover:bg-[var(--fg-06)] transition-colors"
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="none" stroke="var(--fg)" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Nav links — fills remaining space */}
          <nav className="flex-1 flex flex-col justify-center px-6 sm:px-12 md:px-20 py-4 sm:py-8 gap-1 sm:gap-2 md:gap-4 w-full overflow-y-auto">
            {navLinks.map((item, i) => (
              <motion.a
                key={item.href}
                href={item.href}
                onClick={e => { e.preventDefault(); setIsOpen(false); setTimeout(() => scrollTo(item.href), 300) }}
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: 0.05 + i * 0.05, ease: [0.25, 0.1, 0.25, 1] }}
                className="block text-3xl sm:text-4xl md:text-[3.5rem] font-black uppercase tracking-tight text-[var(--fg)] no-underline leading-tight py-2 sm:py-3 md:py-4 border-b border-[var(--fg-06)] hover:text-[var(--fg-60)] transition-colors"
              >
                {item.label}
              </motion.a>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-5 sm:py-6 sm:px-12 md:py-8 md:px-20 border-t border-[var(--fg-06)] flex flex-col sm:flex-row justify-between items-center sm:items-end gap-4 shrink-0 w-full pb-8 sm:pb-8 md:pb-10">
            <div className="text-[0.6rem] sm:text-[0.7rem] md:text-[0.75rem] font-bold tracking-[0.15em] text-[var(--fg-35)] uppercase leading-relaxed text-center sm:text-left">
              Berhudan Başcan © 2026<br />
              <span className="text-[var(--fg-18)]">All rights reserved</span>
            </div>
            <div className="flex gap-4 sm:gap-6 md:gap-8 flex-wrap justify-center">
              {SOCIALS.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="text-[0.6rem] sm:text-[0.7rem] md:text-[0.75rem] font-bold tracking-[0.15em] text-[var(--fg-40)] hover:text-[var(--fg)] uppercase no-underline transition-colors"
                >{s.label}</a>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ─── Mobile top bar ─── */
function MobileBar({ menuOpen, setMenuOpen }: { menuOpen: boolean; setMenuOpen: (v: boolean) => void }) {
  const barRef = useRef<HTMLDivElement>(null)
  const lastY = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      const diff = y - lastY.current
      if (Math.abs(diff) > 6) {
        if (barRef.current) {
          barRef.current.style.transform = (diff < 0 || y < 80) ? 'translateY(0)' : 'translateY(-100%)'
        }
        lastY.current = y
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      ref={barRef}
      className="lg:hidden fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out backdrop-blur-md bg-[var(--header-bg)] border-b border-[var(--fg-06)]"
    >
      <div className="flex items-center justify-between p-3 sm:py-4 sm:px-6 md:py-5 md:px-8">
        <span className="text-[var(--fg)] text-[0.6rem] sm:text-[0.75rem] md:text-[0.85rem] font-extrabold tracking-[0.2em] uppercase opacity-65 truncate mr-2 shrink-0">
          Berhudan
        </span>
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 shrink-0 flex-nowrap">
          <ThemeBulb />
          <LangSwitch />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className="w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full border border-[var(--fg-15)] bg-transparent cursor-pointer flex flex-col items-center justify-center gap-[4px] shrink-0 hover:bg-[var(--fg-06)] transition-colors"
          >
            <motion.div
              animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 5.5 : 0 }}
              transition={{ duration: 0.35 }}
              className="w-4 sm:w-[18px] md:w-[20px] h-[1.5px] bg-[var(--fg)] rounded-[2px]"
            />
            <motion.div
              animate={{ opacity: menuOpen ? 0 : 1, scaleX: menuOpen ? 0 : 1 }}
              transition={{ duration: 0.2 }}
              className="w-4 sm:w-[18px] md:w-[20px] h-[1.5px] bg-[var(--fg)] rounded-[2px]"
            />
            <motion.div
              animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -5.5 : 0 }}
              transition={{ duration: 0.35 }}
              className="w-4 sm:w-[18px] md:w-[20px] h-[1.5px] bg-[var(--fg)] rounded-[2px]"
            />
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Main export ─── */
export default function Header() {
  const { t } = useTranslation()
  const [menuOpen, setMenuOpen] = useState(false)

  const NAV_LINKS = useMemo(() => [
    { label: t('nav.about'),      href: '#about' },
    { label: t('nav.hobbies'),    href: '#hobbies' },
    { label: t('nav.experience'), href: '#experience' },
    { label: t('nav.skills'),     href: '#skills' },
    { label: t('nav.services'),   href: '#services' },
    { label: t('nav.projects'),   href: '#projects' },
    { label: t('nav.contact'),    href: '#contact' },
  ], [t])

  return (
    <>
      <DesktopNav navLinks={NAV_LINKS} />
      <MobileBar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MobileMenu isOpen={menuOpen} setIsOpen={setMenuOpen} navLinks={NAV_LINKS} />
    </>
  )
}

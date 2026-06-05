import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'
import { useTranslation } from 'react-i18next'

const LANGS = ['EN', 'TR', 'DE'] as const

function ThemeBulb() {
  const { theme, toggleTheme } = useTheme()
  const isLight = theme === 'light'
  const [isPulling, setIsPulling] = useState(false)

  return (
    <motion.div
      className="fixed top-0 right-[100px] md:right-[130px] z-[999] flex flex-col items-center cursor-pointer select-none origin-top"
      onPointerDown={() => setIsPulling(true)}
      onPointerUp={() => { setIsPulling(false); toggleTheme() }}
      onPointerLeave={() => setIsPulling(false)}
      animate={{ y: isPulling ? 25 : 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 5, mass: 1 }}
    >
      {/* Wire */}
      <motion.div
        className="w-[2px] shadow-sm"
        animate={{
          height: isPulling ? 100 : 70,
          backgroundColor: isLight ? '#f59e0b' : 'rgba(255,255,255,0.15)',
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
      />

      {/* Socket */}
      <div className="w-4 h-3 bg-[#222] rounded-t-[2px] -mb-[1px] z-10 border-b border-white/5" />

      {/* Bulb */}
      <motion.div
        className="relative flex items-center justify-center z-20"
        animate={{ rotate: isPulling ? -5 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 10 }}
      >
        <svg
          width="40" height="40" viewBox="0 0 24 24"
          fill={isLight ? '#fcd34d' : 'rgba(255,255,255,0.02)'}
          stroke={isLight ? '#b45309' : 'rgba(255,255,255,0.25)'}
          strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"
          className="transition-colors duration-500 drop-shadow-md"
        >
          <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5" />
          <path d="M9 18h6" />
          <path d="M10 22h4" />
        </svg>

        <AnimatePresence>
          {isLight && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.5 }}
              className="absolute top-[8px] left-1/2 -translate-x-1/2 w-[90px] h-[90px] bg-[#fcd34d]/30 blur-[20px] rounded-full pointer-events-none mix-blend-screen"
            />
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

function MagneticLangSwitch() {
  const { i18n } = useTranslation()
  const buttonRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })

  const langIdx = LANGS.findIndex(l => l.toLowerCase() === i18n.language.toLowerCase())
  const currentIdx = langIdx === -1 ? 0 : langIdx

  const cycleLang = () => {
    const next = LANGS[(currentIdx + 1) % LANGS.length].toLowerCase()
    i18n.changeLanguage(next)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return
    const rect = buttonRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) * 0.4
    const y = (e.clientY - rect.top - rect.height / 2) * 0.4
    setPos({ x, y })
  }

  return (
    <div className="fixed top-8 right-6 md:right-10 z-[999] select-none">
      <motion.div
        ref={buttonRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setPos({ x: 0, y: 0 })}
        onClick={cycleLang}
        animate={{ x: pos.x, y: pos.y }}
        transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
        className="lang-switch-btn w-[52px] h-[52px] rounded-full border border-white/20 bg-[#0c0c0c]/60 backdrop-blur-xl flex items-center justify-center cursor-pointer relative overflow-hidden group shadow-[0_4px_24px_rgba(0,0,0,0.5)] hover:bg-[#1a1a1a]/80"
        style={{
          backgroundColor: 'color-mix(in srgb, var(--bg) 75%, transparent)',
          borderColor: 'var(--fg-18)',
        }}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={LANGS[currentIdx]}
            initial={{ opacity: 0, y: 15, rotateX: 90 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, y: -15, rotateX: -90 }}
            transition={{ duration: 0.3 }}
            className="text-[13px] font-black tracking-widest absolute pointer-events-none drop-shadow-md"
            style={{ color: 'var(--fg)' }}
          >
            {LANGS[currentIdx]}
          </motion.span>
        </AnimatePresence>

        {/* Circular progress ring */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity duration-500 rotate-[-90deg]" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--fg-10)' }} />
          <motion.circle
            cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="2.5"
            strokeDasharray="301.59"
            animate={{ strokeDashoffset: 301.59 - (301.59 * ((currentIdx + 1) / LANGS.length)) }}
            transition={{ type: 'spring', bounce: 0.3 }}
            style={{ color: 'var(--fg)' }}
            className="drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]"
          />
        </svg>
      </motion.div>
    </div>
  )
}

export function FloatingControls() {
  return (
    <>
      <ThemeBulb />
      <MagneticLangSwitch />
    </>
  )
}
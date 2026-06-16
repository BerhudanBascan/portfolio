import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import LoadingScreen from './components/LoadingScreen'
import Header from './components/Header'
import { LangContext } from './context/LangContext'
import HeroSection from './sections/HeroSection'
import MarqueeSection from './sections/MarqueeSection'
import AboutSection from './sections/AboutSection'
import ExperienceSection from './sections/ExperienceSection'
import SkillsSection from './sections/SkillsSection'
import ProjectsSection from './sections/ProjectsSection'
import HobbiesSection from './sections/HobbiesSection'
import ContactSection from './sections/ContactSection'

export default function App() {
  const { i18n } = useTranslation()
  const [loading, setLoading] = useState(true)
  const [isFading, setIsFading] = useState(false)
  const handleDone = useCallback(() => setLoading(false), [])

  useEffect(() => { window.scrollTo(0, 0) }, [])

  useEffect(() => {
    document.documentElement.lang = i18n.language
  }, [i18n.language])

  const requestLangChange = useCallback((lang: string) => {
    (window as any).__langChanging = Date.now() + 1000

    const isAtTop = window.scrollY <= 15

    let anchorEl: HTMLElement | null = null
    let anchorScrollY = 0

    if (!isAtTop) {
      // Only query sections — cheap, small set, avoids iterating hundreds of elements
      const sections = document.querySelectorAll('section[id]')
      const viewportCenter = window.innerHeight / 2
      let bestDist = Infinity
      sections.forEach((el) => {
        const rect = el.getBoundingClientRect()
        if (rect.height > 0 && rect.top < window.innerHeight && rect.bottom > 0) {
          const elCenter = rect.top + rect.height / 2
          const dist = Math.abs(elCenter - viewportCenter)
          if (dist < bestDist) {
            bestDist = dist
            anchorEl = el as HTMLElement
            // Store absolute scroll position of the element top
            anchorScrollY = window.scrollY + rect.top
          }
        }
      })
    }

    // Start fading out
    setIsFading(true)

    // Wait for fade-out to complete (180ms)
    setTimeout(() => {
      i18n.changeLanguage(lang)

      // Wait 2 frames for new language layout to settle before scrolling and fading back in
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (isAtTop) {
            window.scrollTo(0, 0)
          } else if (anchorEl && document.body.contains(anchorEl)) {
            const newRect = (anchorEl as HTMLElement).getBoundingClientRect()
            const currentAnchorScrollY = window.scrollY + newRect.top
            const diff = currentAnchorScrollY - anchorScrollY
            if (Math.abs(diff) > 0.5) window.scrollBy(0, diff)
          }
          // Fade back in
          setIsFading(false)
        })
      })
    }, 180)
  }, [i18n])

  return (
    <LangContext.Provider value={requestLangChange}>
    <div className="w-full flex flex-col relative min-h-screen">
      <div style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none', opacity:0.25, background:'radial-gradient(ellipse 80% 60% at 20% 30%, #ff6ec799 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 20%, #6ec6ff88 0%, transparent 55%), radial-gradient(ellipse 70% 60% at 60% 80%, #ff9f4077 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 10% 80%, #a78bfa77 0%, transparent 55%)' }} />
      <AnimatePresence>{loading && <LoadingScreen onDone={handleDone} />}</AnimatePresence>
      <motion.div
        style={{ backgroundColor: 'transparent' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : (isFading ? 0 : 1) }}
        transition={{ duration: isFading ? 0.18 : 0.45, ease: [0.25, 0.1, 0.25, 1] }}
        className="flex flex-col w-full"
      >
        <Header />
          <div className="pt-6 lg:pt-16 w-full flex flex-col">
            <HeroSection />
            <MarqueeSection />
            <AboutSection />
            <HobbiesSection />
            <ExperienceSection />
            <SkillsSection />
            <ProjectsSection />
            <ContactSection />
          </div>
      </motion.div>
    </div>
    </LangContext.Provider>
  )
}

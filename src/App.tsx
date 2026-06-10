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
  const handleDone = useCallback(() => setLoading(false), [])

  useEffect(() => { window.scrollTo(0, 0) }, [])

  useEffect(() => {
    document.documentElement.lang = i18n.language
  }, [i18n.language])

  const requestLangChange = useCallback((lang: string) => {
    const sections = document.querySelectorAll('section[id], div[id]')
    let anchorEl: HTMLElement | null = null
    let anchorOffset = 0
    const viewportCenter = window.innerHeight / 2
    let bestDist = Infinity

    sections.forEach((el) => {
      const rect = el.getBoundingClientRect()
      const elCenter = rect.top + rect.height / 2
      const dist = Math.abs(elCenter - viewportCenter)
      
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        if (dist < bestDist) {
          bestDist = dist
          anchorEl = el as HTMLElement
          anchorOffset = rect.top
        }
      }
    })

    i18n.changeLanguage(lang)

    if (anchorEl) {
      let count = 0
      const adjust = () => {
        if (!anchorEl) return
        const newRect = anchorEl.getBoundingClientRect()
        const diff = newRect.top - anchorOffset
        if (Math.abs(diff) > 0.5) {
          window.scrollBy(0, diff)
        }
        count++
        if (count < 25) {
          requestAnimationFrame(adjust)
        }
      }
      requestAnimationFrame(adjust)
    }
  }, [i18n])

  return (
    <LangContext.Provider value={requestLangChange}>
    <div className="w-full flex flex-col relative min-h-screen">
      <div style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none', opacity:0.25, background:'radial-gradient(ellipse 80% 60% at 20% 30%, #ff6ec799 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 20%, #6ec6ff88 0%, transparent 55%), radial-gradient(ellipse 70% 60% at 60% 80%, #ff9f4077 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 10% 80%, #a78bfa77 0%, transparent 55%)' }} />
      <AnimatePresence>{loading && <LoadingScreen onDone={handleDone} />}</AnimatePresence>
      <motion.div
        style={{ backgroundColor: 'transparent' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
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

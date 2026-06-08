import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LoadingScreen from './components/LoadingScreen'
import Header from './components/Header'
import HeroSection from './sections/HeroSection'
import MarqueeSection from './sections/MarqueeSection'
import AboutSection from './sections/AboutSection'
import ExperienceSection from './sections/ExperienceSection'
import SkillsSection from './sections/SkillsSection'
import ProjectsSection from './sections/ProjectsSection'
import ContactSection from './sections/ContactSection'

export default function App() {
  const [loading, setLoading] = useState(true)
  const handleDone = useCallback(() => setLoading(false), [])

  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <>
      <div style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none', opacity:0.15, background:'radial-gradient(ellipse 80% 60% at 20% 30%, #ff6ec799 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 20%, #6ec6ff88 0%, transparent 55%), radial-gradient(ellipse 70% 60% at 60% 80%, #ff9f4077 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 10% 80%, #a78bfa77 0%, transparent 55%)' }} />
      <AnimatePresence>{loading && <LoadingScreen onDone={handleDone} />}</AnimatePresence>
      <motion.div
        style={{ backgroundColor: 'var(--bg)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: loading ? 0 : 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <Header />
        <div className="pt-6 lg:pt-16">
        <HeroSection />
        <MarqueeSection />
        <AboutSection />
        <ExperienceSection />
        <SkillsSection />
        <ProjectsSection />
        <ContactSection />
        </div>
      </motion.div>
    </>
  )
}

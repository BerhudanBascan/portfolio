import { useRef, useState, useEffect } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion'
import Magnet from './Magnet'

const PORTRAIT_URL = '/images/berhudan.png'

const RINGS = [0, 1, 2]

function SonarRing({ delay, isHovered }: { delay: number; isHovered: boolean }) {
  return (
    <motion.span
      style={{
        position: 'absolute', inset: 0,
        borderRadius: '50%',
        border: '1px solid var(--fg)',
        pointerEvents: 'none',
        zIndex: 0,
      }}
      animate={isHovered ? {
        scale: [1, 1.8],
        opacity: [0, 0.3, 0],
      } : { opacity: 0, scale: 1 }}
      transition={isHovered ? {
        duration: 2.2,
        delay,
        repeat: Infinity,
        ease: 'easeOut',
        times: [0, 0.3, 1],
      } : { duration: 1.0, ease: 'easeOut' }}
    />
  )
}

export default function InteractivePortrait() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const isHoveredRef = useRef(false)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => setIsVisible(e.isIntersecting), { threshold: 0.1 })
    if (containerRef.current) obs.observe(containerRef.current)
    return () => obs.disconnect()
  }, [])

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const smoothX = useSpring(mouseX, { damping: 28, stiffness: 45, mass: 0.9 })
  const smoothY = useSpring(mouseY, { damping: 28, stiffness: 45, mass: 0.9 })

  const rotateX = useTransform(smoothY, [-1, 1], [7, -7])
  const rotateY = useTransform(smoothX, [-1, 1], [-7, 7])
  const tx = useTransform(smoothX, [-1, 1], [-10, 10])
  const ty = useTransform(smoothY, [-1, 1], [-10, 10])
  const glowX = useTransform(smoothX, [-1, 1], [35, 65])
  const glowY = useTransform(smoothY, [-1, 1], [35, 65])
  const glowBg = useMotionTemplate`radial-gradient(circle at ${glowX}% ${glowY}%, rgba(255,255,255,0.12) 0%, transparent 55%)`

  useEffect(() => {
    isHoveredRef.current = isHovered
    if (!isHovered) { mouseX.set(0); mouseY.set(0) }
  }, [isHovered, mouseX, mouseY])

  useEffect(() => {
    if (!isVisible) return
    const onMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const dist = Math.hypot(e.clientX - (rect.left + rect.width / 2), e.clientY - (rect.top + rect.height / 2))
      if (dist < Math.max(rect.width, rect.height) / 2 + 150) {
        if (!isHoveredRef.current) setIsHovered(true)
        mouseX.set((e.clientX - rect.left) / rect.width * 2 - 1)
        mouseY.set((e.clientY - rect.top) / rect.height * 2 - 1)
      } else if (isHoveredRef.current) {
        setIsHovered(false)
      }
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [mouseX, mouseY, isVisible])

  return (
    <Magnet padding={150} strength={2.5} activeTransition="transform 0.3s ease-out" inactiveTransition="transform 0.7s ease-in-out">
      <div ref={containerRef} className="relative w-full h-full flex items-center justify-center">

        {/* Sonar rings */}
        <div style={{ position: 'absolute', inset: '15%', borderRadius: '50%', pointerEvents: 'none' }}>
          {RINGS.map(i => <SonarRing key={i} delay={i * 0.55} isHovered={isHovered} />)}
        </div>

        {/* Dynamic spotlight under avatar */}
        <motion.div
          style={{
            position: 'absolute', inset: 0,
            background: `radial-gradient(ellipse 60% 40% at 50% 90%, var(--fg), transparent 70%)`,
            opacity: isHovered ? 0.06 : 0.03,
            pointerEvents: 'none',
            zIndex: 1,
            transition: 'opacity 0.6s ease',
          }}
        />

        {/* Cursor-following inner glow on avatar */}
        <motion.div
          style={{
            position: 'absolute', inset: 0,
            background: glowBg,
            pointerEvents: 'none',
            zIndex: 11,
            borderRadius: 8,
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.4s ease',
          }}
        />

        {/* Avatar */}
        <motion.div
          style={{ rotateX, rotateY, x: tx, y: ty, perspective: 1400, zIndex: 10, width: '100%' }}
          animate={isVisible ? { y: [0, -10, 0], rotate: [0, 1.2, -1.2, 0] } : { y: 0, rotate: 0 }}
          transition={{ duration: 1.2, repeat: isVisible ? Infinity : 0, repeatType: 'mirror', ease: 'easeInOut' }}
        >
          <motion.img
            src={PORTRAIT_URL}
            alt="Berhudan portrait"
            draggable={false}
            animate={{ filter: isHovered ? 'brightness(1.08) contrast(1.02)' : 'brightness(1) contrast(1)' }}
            transition={{ duration: 0.5 }}
            className="w-full h-auto object-contain pointer-events-none select-none"
          />
        </motion.div>

      </div>
    </Magnet>
  )
}
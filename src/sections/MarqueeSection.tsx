import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useBreakpoint } from '../hooks/useBreakpoint'

const IMAGES = Array.from({ length: 21 }, (_, i) => `/images/marquee/${String(i + 1).padStart(2, '0')}.gif`)
const ROW1 = IMAGES.slice(0, 11)
const ROW2 = IMAGES.slice(11)

function MobileMarquee() {
  const { t } = useTranslation()
  const sectionRef = useRef<HTMLElement>(null)
  const [preloaded, setPreloaded] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setPreloaded(true)
        obs.disconnect()
      }
    }, { rootMargin: '200px' })
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section ref={sectionRef} style={{ padding: '60px 0 48px', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @keyframes marquee-left  { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        @keyframes marquee-right { from { transform: translateX(-50%) } to { transform: translateX(0) } }
        .mq-left  { animation: marquee-left  22s linear infinite; display: flex; width: max-content; will-change: transform; }
        .mq-right { animation: marquee-right 26s linear infinite; display: flex; width: max-content; will-change: transform; }
      `}</style>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <span style={{ height: 1, width: 40, background: 'var(--fg-15)', display: 'block' }} />
        <span style={{ color: 'var(--fg-28)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase' }}>{t('marquee.selectedWork')}</span>
        <span style={{ height: 1, width: 40, background: 'var(--fg-15)', display: 'block' }} />
      </div>

      <div style={{ overflow: 'hidden', marginBottom: 12 }}>
        <div className="mq-left" style={{ gap: 12 }}>
          {[...ROW1, ...ROW1].map((src, i) => (
            <div key={i} style={{ flexShrink: 0, borderRadius: 16, overflow: 'hidden', boxShadow: '0 6px 24px rgba(0,0,0,0.45)', border: '1px solid var(--fg-06)', width: 220, height: 140, background: 'var(--fg-08)', position: 'relative' }}>
              {preloaded && <img src={src} alt="" style={{ width: 220, height: 140, display: 'block', objectFit: 'cover' }} />}
            </div>
          ))}
        </div>
      </div>

      <div style={{ overflow: 'hidden' }}>
        <div className="mq-right" style={{ gap: 12 }}>
          {[...ROW2, ...ROW2].map((src, i) => (
            <div key={i} style={{ flexShrink: 0, borderRadius: 16, overflow: 'hidden', boxShadow: '0 6px 24px rgba(0,0,0,0.45)', border: '1px solid var(--fg-06)', width: 220, height: 140, background: 'var(--fg-08)', position: 'relative' }}>
              {preloaded && <img src={src} alt="" style={{ width: 220, height: 140, display: 'block', objectFit: 'cover' }} />}
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(to right, var(--bg) 0%, transparent 10%, transparent 90%, var(--bg) 100%)' }} />
    </section>
  )
}

export default function MarqueeSection() {
  const isMobile = useBreakpoint(768)

  if (isMobile) return <MobileMarquee />

  return <DesktopMarquee />
}

function DesktopMarquee() {
  const { t } = useTranslation()
  const containerRef = useRef<HTMLDivElement>(null)
  const [tileW, setTileW] = useState(440)
  const [tileH, setTileH] = useState(280)
  const [progress, setProgress] = useState(0)
  const [innerVw, setInnerVw] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200)
  const [sectionH, setSectionH] = useState(0)

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      setInnerVw(w)
      if (w < 1024) { setTileW(380); setTileH(244) }
      else { setTileW(440); setTileH(280) }
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    const updateH = () => setSectionH(window.innerHeight)
    updateH()
    window.addEventListener('resize', updateH)
    return () => window.removeEventListener('resize', updateH)
  }, [])

  useEffect(() => {
    const onScroll = () => {
      const el = containerRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const total = el.offsetHeight - window.innerHeight
      setProgress(Math.max(0, Math.min(1, -rect.top / total)))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const gap = 16
  const row1W = ROW1.length * (tileW + gap)
  const row2W = ROW2.length * (tileW + gap)
  const maxShift1 = row1W - innerVw + 48
  const maxShift2 = row2W - innerVw + 48
  const ease = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2
  const shift1 = ease * maxShift1
  const shift2 = (ease - 1) * maxShift2

  return (
    <section ref={containerRef} style={{ height: `${Math.max(row1W, row2W) + (sectionH || window.innerHeight)}px`, position: 'relative' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 14 }}>
        <div style={{ position: 'absolute', top: 'clamp(28px, 5vh, 52px)', left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, pointerEvents: 'none' }}>
          <span style={{ height: 1, width: 40, background: 'var(--fg-15)', display: 'block' }} />
          <span style={{ color: 'var(--fg-28)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase' }}>{t('marquee.selectedWork')}</span>
          <span style={{ height: 1, width: 40, background: 'var(--fg-15)', display: 'block' }} />
        </div>
        <div style={{ display: 'flex', gap, paddingLeft: 24, transform: `translateX(${-shift1}px)`, willChange: 'transform', transition: 'transform 0.08s linear' }}>
          {ROW1.map((src, i) => (
            <div key={i} style={{ flexShrink: 0, borderRadius: 20, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.45)', border: '1px solid var(--fg-06)' }}>
              <img src={src} alt="" loading="lazy" style={{ width: tileW, height: tileH, display: 'block', objectFit: 'cover' }} />
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap, paddingLeft: 24, transform: `translateX(${shift2}px)`, willChange: 'transform', transition: 'transform 0.08s linear' }}>
          {ROW2.map((src, i) => (
            <div key={i} style={{ flexShrink: 0, borderRadius: 20, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.45)', border: '1px solid var(--fg-06)' }}>
              <img src={src} alt="" loading="lazy" style={{ width: tileW, height: tileH, display: 'block', objectFit: 'cover' }} />
            </div>
          ))}
        </div>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(to right, var(--bg) 0%, transparent 8%, transparent 92%, var(--bg) 100%)' }} />
        <div style={{ position: 'absolute', bottom: 'clamp(20px, 4vh, 40px)', left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: 120, height: 2, borderRadius: 999, background: 'var(--fg-08)', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progress * 100}%`, background: 'var(--fg-35)', borderRadius: 999, transition: 'width 0.1s linear' }} />
          </div>
        </div>
      </div>
    </section>
  )
}
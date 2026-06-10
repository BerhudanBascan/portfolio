import { useRef, useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import SkillsCard from '../components/SkillsCard';
import CardSwap, { Card } from '../components/CardSwap';
import FadeIn from '../components/FadeIn';
import { useBreakpoint } from '../hooks/useBreakpoint';

const C = { base: 'var(--fg)' };

/* ─── Skill pill group ─── */
function StackGroup({ title, skills, align = 'left' }: { title: string; skills: string[]; align?: 'left' | 'right' }) {
  return (
    <div className={`flex flex-col ${align === 'right' ? 'xl:items-end xl:text-right items-start text-left' : 'items-start text-left'}`}>
      <h4 className="font-mono uppercase tracking-[0.3em] text-[10px] mb-4 flex items-center gap-3" style={{ color: 'var(--fg-35)' }}>
        {align === 'right' && <span className="w-12 h-[1px] hidden xl:block" style={{ background: 'var(--fg-15)' }} />}
        [ {title} ]
        <span className={`w-12 h-[1px] ${align === 'right' ? 'xl:hidden block' : 'block'}`} style={{ background: 'var(--fg-15)' }} />
      </h4>
      <div className={`flex flex-wrap gap-2 ${align === 'right' ? 'xl:justify-end justify-start' : 'justify-start'} w-full xl:max-w-[320px]`}>
        {skills.map(s => (
          <span key={s} className="group relative px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest cursor-crosshair overflow-hidden transition-all duration-300"
            style={{ color: 'var(--fg-40)', border: '1px solid var(--fg-08)', background: 'var(--fg-06)' }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLSpanElement; el.style.color = 'var(--fg)'; el.style.borderColor = 'var(--fg-28)'; el.style.background = 'var(--fg-08)'; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLSpanElement; el.style.color = 'var(--fg-40)'; el.style.borderColor = 'var(--fg-08)'; el.style.background = 'var(--fg-06)'; }}
          >
            <span className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ borderColor: 'var(--fg-35)' }} />
            <span className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ borderColor: 'var(--fg-35)' }} />
            <span className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ borderColor: 'var(--fg-35)' }} />
            <span className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ borderColor: 'var(--fg-35)' }} />
            <span className="relative z-10">{s}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

const AURORA_COLORS = [
  [59,130,246],
  [168,85,247],
  [16,185,129],
  [249,115,22],
  [245,158,11],
];

function ServicesAccordion({ services }: { services: any[] }) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null)
  const isMobile = useBreakpoint(640)
  const toggle = (i: number) => setActiveIdx(prev => prev === i ? null : i)

  return (
    <div className="relative w-full">
      {/* Aurora background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        {services.map((_, i) => {
          const [r,g,b] = AURORA_COLORS[i % AURORA_COLORS.length]
          return (
            <motion.div
              key={i}
              animate={{ opacity: activeIdx === i ? 1 : 0, scale: activeIdx === i ? 1 : 0.85 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] h-[160%] rounded-full blur-[80px]"
              style={{ background: `radial-gradient(circle, rgba(${r},${g},${b},0.7) 0%, rgba(${r},${g},${b},0.3) 40%, transparent 70%)` }}
            />
          )
        })}
      </div>

      <div className="flex flex-col w-full border-t" style={{ borderColor: 'var(--fg-08)' }}>
        {services.map((s, i) => {
          const isOpen = activeIdx === i
          return (
            <div key={s.number} className="border-b overflow-hidden" style={{ borderColor: 'var(--fg-08)' }}>
              <button
                onClick={() => toggle(i)}
                className="w-full flex items-center justify-between text-left outline-none"
                style={{ padding: '14px 0', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <div className="flex items-center gap-3 sm:gap-5 min-w-0 flex-1 pr-4">
                  <span
                    className="shrink-0 font-mono font-bold tracking-[0.3em] transition-all duration-700"
                    style={{
                      fontSize: isOpen ? '0.7rem' : '0.55rem',
                      color: isOpen ? 'var(--fg)' : 'var(--fg-28)',
                    }}
                  >
                    {s.number}
                  </span>
                  <span
                    className="font-black uppercase tracking-tight leading-none transition-all duration-700"
                    style={isMobile ? {
                      fontSize: 'clamp(0.82rem, 1.4vw, 1rem)',
                      color: isOpen ? 'var(--fg)' : 'var(--fg-40)',
                      letterSpacing: isOpen ? '-0.02em' : '0.01em',
                      transform: isOpen ? 'scale(1.35)' : 'scale(1)',
                      transformOrigin: 'left center',
                      transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1), color 0.4s',
                    } : {
                      fontSize: isOpen ? 'clamp(1.6rem, 4vw, 3.2rem)' : 'clamp(0.82rem, 1.4vw, 1rem)',
                      color: isOpen ? 'var(--fg)' : 'var(--fg-40)',
                      letterSpacing: isOpen ? '-0.02em' : '0.01em',
                    }}
                  >
                    {s.name}
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className="hidden sm:block font-mono uppercase tracking-widest transition-all duration-700"
                    style={{ fontSize: '0.55rem', color: isOpen ? 'var(--fg-40)' : 'var(--fg-18)' }}
                  >
                    {s.tags?.[0]}
                  </span>
                  <div
                    className="flex items-center justify-center rounded-full border transition-all duration-500"
                    style={{
                      width: isOpen ? 32 : 24,
                      height: isOpen ? 32 : 24,
                      border: `1px solid ${isOpen ? 'var(--fg)' : 'var(--fg-18)'}`,
                      background: isOpen ? 'var(--fg)' : 'transparent',
                    }}
                  >
                    <motion.div animate={{ rotate: isOpen ? 135 : 0 }} transition={{ type: 'spring', stiffness: 200, damping: 22 }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={isOpen ? 'var(--bg)' : 'var(--fg)'} strokeWidth="2.5" strokeLinecap="round">
                        <path d="M12 5v14m-7-7h14" />
                      </svg>
                    </motion.div>
                  </div>
                </div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0, ...(isMobile ? {} : { filter: 'blur(10px)' }) }}
                    animate={{ height: 'auto', opacity: 1, ...(isMobile ? {} : { filter: 'blur(0px)' }) }}
                    exit={{ height: 0, opacity: 0, ...(isMobile ? {} : { filter: 'blur(10px)' }) }}
                    transition={isMobile ? {
                      height:  { duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] },
                      opacity: { duration: 0.4, ease: 'easeOut', delay: 0.1 },
                    } : {
                      height:  { duration: 1.4, ease: [0.04, 0.62, 0.23, 0.98] },
                      opacity: { duration: 1.0, ease: 'easeOut', delay: 0.3 },
                      filter:  { duration: 1.0, ease: 'easeOut', delay: 0.2 },
                    }}
                    className="overflow-hidden"
                  >
                    <div style={{ paddingBottom: '28px', paddingLeft: 'calc(0.7rem + 20px + 12px)' }}>
                      <p style={{ color: 'var(--fg)', opacity: 0.6, fontSize: 'clamp(0.88rem, 1.6vw, 1.15rem)', lineHeight: 1.75, marginBottom: 20, maxWidth: '65ch' }}>
                        {s.description}
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {s.tags?.map((tag: string) => (
                          <span key={tag} style={{ color: 'var(--fg)', border: '1px solid var(--fg-15)', padding: '5px 14px', borderRadius: 999, fontSize: '0.58rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', opacity: 0.6 }}>{tag}</span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ResponsiveCardSwap({ services }: { services: any[] }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [cardW, setCardW] = useState(300)
  const [shiftX, setShiftX] = useState(0)

  const isNarrow = useBreakpoint(640)
  const isMidWidth = useBreakpoint(1024)

  useEffect(() => {
    let lastVw = -1
    const measure = () => {
      if (wrapRef.current) {
        const vw = window.innerWidth
        if (vw === lastVw) return
        lastVw = vw

        const totalCards = services.length
        const maxMultiplier = 1 + (totalCards - 1) * (52 / 340)
        const maxW = isNarrow 
          ? Math.min((vw - 64) / maxMultiplier, 220) 
          : isMidWidth 
            ? Math.min(vw - 48, 280) 
            : 340
        const computedW = Math.max(160, Math.floor(maxW))
        setCardW(computedW)

        const computedDist = Math.round(computedW * (52 / 340))
        setShiftX(computedDist * 0.5)
      }
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [services.length, isNarrow, isMidWidth])

  const ratio = cardW < 240 ? 0.85 : cardW < 320 ? 0.75 : (270 / 440)
  const cardH = Math.round(cardW * ratio)
  const dist = Math.round(cardW * (38 / 340))
  const distY = Math.round(dist * 0.77)
  const totalUpwardProtrusion = (services.length - 1) * distY

  return (
    <div ref={wrapRef} style={{ width: '100%', maxWidth: 340, margin: '0 auto', overflow: 'visible' }}>
      <div 
        style={{ 
          height: cardH + totalUpwardProtrusion, 
          width: cardW,
          margin: '0 auto',
          overflow: 'visible', 
          position: 'relative',
          transform: `translateX(-${shiftX}px)`,
          transition: 'transform 0.2s ease-out'
        }}
      >
        <div style={{ paddingTop: totalUpwardProtrusion, overflow: 'visible' }}>
          <CardSwap
            width={cardW}
            height={cardH}
            cardDistance={dist}
            verticalDistance={distY}
            delay={2800}
            pauseOnHover={true}
            easing="linear"
          >
            {services.map((service, i) => (
              <Card
                key={service.number ?? i}
                customClass="p-6 flex flex-col justify-between overflow-hidden"
                style={{ background: 'var(--bg)', border: '1px solid var(--fg-10)' }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-black uppercase tracking-[0.28em]" style={{ color: 'var(--fg-28)', fontSize: '0.65rem' }}>
                    {service.number}
                  </span>
                  <div className="w-4 h-4 rounded-full" style={{ border: '1px solid var(--fg-15)' }} />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="font-black uppercase leading-tight" style={{ color: C.base, fontSize: '1.15rem' }}>
                    {service.name}
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {service.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="font-medium uppercase tracking-wider rounded-full px-2 py-0.5"
                        style={{ color: C.base, border: '1px solid var(--fg-15)', fontSize: '0.6rem', opacity: 0.52 }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="h-[1px] w-full" style={{ background: `rgba(215,226,234,${0.05 + i * 0.04})` }} />
              </Card>
            ))}
          </CardSwap>
        </div>
      </div>
    </div>
  )
}

export default function SkillsSection() {
  const { t } = useTranslation()
  const SERVICES = t('skills.services', { returnObjects: true }) as any[]
  const techStacks = useMemo(() => ({
    left: [
      { title: t('skills.stacks.languages'), skills: ['Python', 'JavaScript (ES6+)', 'TypeScript', 'Flutter', 'SQL'] },
      { title: t('skills.stacks.backend'),    skills: ['Node.js', 'Express.js', 'RESTful APIs', 'Firebase Functions'] },
      { title: t('skills.stacks.databases'),  skills: ['MongoDB', 'PostgreSQL', 'MySQL', 'Supabase'] },
    ],
    right: [
      { title: t('skills.stacks.frontend'),   skills: ['React.js', 'Next.js', 'HTML5', 'CSS3', 'Tailwind CSS'] },
      { title: t('skills.stacks.data'),        skills: ['Pandas', 'NumPy', 'Data Analysis', 'Data Cleaning'] },
      { title: t('skills.stacks.devops'),      skills: ['Git', 'GitHub', 'Docker'] },
    ],
  }), [t])

  return (
    <section id="skills" className="relative z-10 w-full overflow-x-clip">

      {/* ─── TOP: Technical Skills ─── */}
      <div className="border-t pt-12 sm:pt-16 md:pt-20 pb-16 sm:pb-20 md:pb-24 xl:pb-24 relative w-full flex flex-col items-center" style={{ borderColor: 'var(--fg-06)' }}>
        <div className="max-w-5xl mx-auto w-full px-4 sm:px-8 md:px-10">
          <FadeIn delay={0} y={40}>
            <h2 className="hero-heading font-black uppercase leading-none tracking-tight mb-8 sm:mb-12 text-center break-words px-4 w-full" style={{ fontSize: 'clamp(2rem, 12vw, 160px)', color: 'rgb(100, 105, 115)' }}>
              {t('skills.heading')}
            </h2>
          </FadeIn>
        </div>

        <FadeIn className="w-full" delay={0.2} y={30}>
          <div className="max-w-[1440px] mx-auto w-full">
            <p className="hidden xl:block text-center text-[0.6rem] tracking-widest uppercase mb-10" style={{ color: 'var(--fg-35)' }}>
              {t('skills.hint')}
            </p>
            <div className="max-w-[1440px] mx-auto w-full relative flex flex-col xl:block xl:min-h-[520px]">
              <div className="hidden xl:flex absolute inset-0 pointer-events-none justify-center items-center z-30">
                <div className="pointer-events-auto"><SkillsCard /></div>
              </div>
              <div className="flex flex-col xl:flex-row justify-between xl:items-center px-6 md:px-12 xl:px-8 h-full relative z-20 gap-12 sm:gap-16 md:gap-20 xl:gap-0">
                <div className="flex flex-col gap-6 md:gap-12 w-full xl:w-auto pointer-events-auto">
                  {techStacks.left.map(stack => <StackGroup key={stack.title} title={stack.title} skills={stack.skills} align="left" />)}
                </div>
                <div className="xl:hidden w-full flex flex-col items-center relative z-10 gap-6 mb-8 sm:mb-12">
                  <p className="text-center text-[0.6rem] tracking-widest uppercase" style={{ color: 'var(--fg-35)' }}>{t('skills.hint_mobile')}</p>
                  <div><SkillsCard /></div>
                </div>
                <div className="flex flex-col gap-6 md:gap-12 w-full xl:w-auto pointer-events-auto">
                  {techStacks.right.map(stack => <StackGroup key={stack.title} title={stack.title} skills={stack.skills} align="right" />)}
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>

      {/* ─── BOTTOM: Services ─── */}
      <div id="services" className="border-t relative overflow-hidden" style={{ borderColor: 'var(--fg-06)' }}>
        <div className="max-w-[1500px] mx-auto px-4 sm:px-8 md:px-10 lg:px-12 pt-16 sm:pt-20 md:pt-24 pb-48 sm:pb-32 md:pb-36 lg:pb-40">

          {/* Heading */}
          <FadeIn delay={0} y={40}>
            <h2 className="hero-heading font-black uppercase leading-none tracking-tight mb-10 sm:mb-14 md:mb-20 text-center break-words px-4 w-full" style={{ fontSize: 'clamp(2rem, 12vw, 160px)', color: 'rgb(100, 105, 115)' }}>
              {t('skills.services_heading')}
            </h2>
          </FadeIn>

          {/* Desktop: accordion left + CardSwap right sticky */}
          {/* Mobile/tablet: accordion full width, CardSwap below */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 xl:gap-24 w-full items-start">

            {/* Accordion — takes full width on mobile, 60% on desktop */}
            <div className="w-full lg:flex-1 min-w-0">
              <ServicesAccordion services={SERVICES} />
            </div>

            {/* CardSwap — full width on mobile (below), sticky sidebar on desktop */}
            <div className="w-full lg:w-auto lg:shrink-0 lg:sticky lg:top-28 lg:self-start flex justify-center lg:justify-start overflow-visible">
              <ResponsiveCardSwap services={SERVICES} />
            </div>

          </div>
        </div>
      </div>

    </section>
  );
}

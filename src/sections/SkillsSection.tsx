import { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import SkillsCard from '../components/SkillsCard';
import CardSwap, { Card } from '../components/CardSwap';
import FadeIn from '../components/FadeIn';

const C = { base: 'var(--fg)' };
const E = [0.25, 0.1, 0.25, 1] as [number, number, number, number];

/* ─── Skill pill group ─── */
function StackGroup({ title, skills, align = 'left' }: { title: string; skills: string[]; align?: 'left' | 'right' }) {
  return (
    <div className={`flex flex-col ${align === 'right' ? 'xl:items-end xl:text-right items-start text-left' : 'items-start text-left'}`}>
      <h4
        className="font-black uppercase tracking-[0.2em] text-xs mb-4 flex items-center gap-3"
        style={{ color: 'var(--fg-40)' }}
      >
        {align === 'right' && <span className="w-12 h-[1px] hidden xl:block" style={{ background: 'var(--fg-15)' }} />}
        {title}
        <span className={`w-12 h-[1px] ${align === 'right' ? 'xl:hidden block' : 'block'}`} style={{ background: 'var(--fg-15)' }} />
      </h4>
      <div className={`flex flex-wrap gap-2 ${align === 'right' ? 'xl:justify-end justify-start' : 'justify-start'} w-full xl:max-w-[320px]`}>
        {skills.map(s => (
          <span
            key={s}
            className="px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider cursor-default transition-all duration-200"
            style={{ color: C.base, border: '1px solid var(--fg-15)', background: 'var(--fg-06)', opacity: 0.7 }}
            onMouseEnter={e => { (e.currentTarget as HTMLSpanElement).style.opacity = '1'; (e.currentTarget as HTMLSpanElement).style.borderColor = 'var(--fg-35)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLSpanElement).style.opacity = '0.7'; (e.currentTarget as HTMLSpanElement).style.borderColor = 'var(--fg-15)'; }}
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

function ServicesAccordion({ services }: { services: any[] }) {
  const [expanded, setExpanded] = useState<number|null>(null)
  const toggle = (i: number) => setExpanded(prev => prev === i ? null : i)

  return (
    <div className={`sv-list flex flex-col w-full${expanded !== null ? ' has-open' : ''}`}>
      {services.map((s, i) => {
        const isOpen = expanded === i
        return (
          <motion.div key={s.number} className={`sv-item w-full${isOpen ? ' is-open' : ''}`}
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32, delay: i * 0.05, ease: E }}
            style={{ borderBottom: '1px solid var(--fg-08)', ...(i === 0 ? { borderTop: '1px solid var(--fg-08)' } : {}) }}
          >
            <div onClick={() => toggle(i)} style={{ padding: '14px 0', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ color: 'var(--fg-18)', fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', flexShrink: 0, minWidth: 28 }}>{s.number}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: C.base, fontWeight: 800, textTransform: 'uppercase', fontSize: 'clamp(0.82rem, 1.4vw, 1rem)', letterSpacing: '0.01em' }}>{s.name}</span>
                    <div style={{ width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${isOpen ? C.base : 'var(--fg-18)'}`, background: isOpen ? C.base : 'transparent', flexShrink: 0, transition: 'all 0.25s' }}>
                      <motion.div animate={{ rotate: isOpen ? 135 : 0 }} transition={{ type: 'spring', stiffness: 200, damping: 20 }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={isOpen ? 'var(--bg)' : C.base} strokeWidth="2.5" strokeLinecap="round">
                          <path d="M12 5v14m-7-7h14" />
                        </svg>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
              <AnimatePresence>
                {isOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} style={{ overflow: 'hidden' }}>
                    <div style={{ paddingTop: 8, paddingLeft: 38 }}>
                      <p style={{ color: C.base, opacity: 0.5, fontSize: 'clamp(0.66rem, 1vw, 0.76rem)', lineHeight: 1.65, marginBottom: 8 }}>{s.description}</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                        {s.tags.map((tag: string) => (
                          <span key={tag} style={{ color: C.base, border: '1px solid var(--fg-10)', padding: '2px 7px', borderRadius: 999, fontSize: '0.48rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.5 }}>{tag}</span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

export default function SkillsSection() {
  const { t } = useTranslation()
  const SERVICES = t('skills.services', { returnObjects: true }) as any[]
  const techStacks = {
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
  }
  return (
    <section id="skills" className="relative z-10 w-full overflow-x-hidden">
      <style>{`
        .sv-list.has-open .sv-item:not(.is-open) { filter:blur(3px); opacity:0.25; transform:scale(0.98); }
        .sv-list.has-open .sv-item.is-open { transform:scale(1.01); }
        .sv-item { transition:filter 400ms ease, opacity 400ms ease, transform 400ms ease; }
      `}</style>

      {/* ─── TOP: Technical Skills ─── */}
      <div
        className="border-t pt-12 sm:pt-16 md:pt-20 pb-10 relative w-full flex flex-col items-center"
        style={{ borderColor: 'var(--fg-06)' }}
      >
        <div className="max-w-5xl mx-auto w-full px-4 sm:px-8 md:px-10">
          <FadeIn delay={0} y={40}>
            <h2
              className="hero-heading font-black uppercase leading-none tracking-tight mb-8 sm:mb-12 text-center"
              style={{ fontSize: 'clamp(2.8rem, 12vw, 160px)', color: C.base }}
            >
              {t('skills.heading')}
            </h2>
          </FadeIn>
        </div>

        <FadeIn className="w-full" delay={0.2} y={30}>
          <div className="max-w-[1440px] mx-auto w-full">
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_auto_1fr] gap-4 xl:gap-8 items-center px-6 md:px-12 xl:px-8">
              <div className="flex flex-col gap-8 md:gap-12 w-full z-20">
                {techStacks.left.map(stack => <StackGroup key={stack.title} title={stack.title} skills={stack.skills} align="left" />)}
              </div>
              <div className="flex flex-col items-center justify-center w-full z-10 gap-0">
                <p className="text-center max-w-xs text-[0.6rem] tracking-widest uppercase mt-10 mb-2 xl:mt-0 xl:mb-0 relative top-[95px] sm:top-[75px] md:top-[55px] lg:top-[35px] xl:top-0" style={{ color: 'var(--fg-35)' }}>
                  <span className="xl:hidden">{t('skills.hint_mobile')}</span>
                  <span className="hidden xl:inline">{t('skills.hint')}</span>
                </p>
                <SkillsCard />
              </div>
              <div className="flex flex-col gap-8 md:gap-12 w-full z-20">
                {techStacks.right.map(stack => <StackGroup key={stack.title} title={stack.title} skills={stack.skills} align="right" />)}
              </div>
            </div>
          </div>
        </FadeIn>
      </div>

      {/* ─── BOTTOM: Services ─── */}
      <div id="services" className="border-t px-4 sm:px-8 md:px-10 pt-16 sm:pt-20 md:pt-28 pb-16 sm:pb-20 md:pb-28" style={{ borderColor: 'var(--fg-06)' }}>
        <div className="max-w-5xl mx-auto">

          
          {/* Full-width heading */}
          <FadeIn delay={0} y={40}>
            <h2
              className="hero-heading font-black uppercase leading-none tracking-tight mb-10 sm:mb-14 text-center"
              style={{ fontSize: 'clamp(2.8rem, 12vw, 160px)', color: C.base }}
            >
              {t('skills.services_heading')}
            </h2>
          </FadeIn>

          {/* Content below heading: list left, CardSwap right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-14 xl:gap-x-20 gap-y-10">

            {/* Left: accordion list */}
            <ServicesAccordion services={SERVICES} />

            {/* Right: CardSwap, vertically centered */}
            <div className="flex flex-col items-center lg:items-start justify-center mt-8 lg:mt-0 overflow-visible w-full">
              <FadeIn delay={0.1} y={30} className="w-full flex justify-center lg:justify-start overflow-visible">
                <ResponsiveCardSwap services={SERVICES} />
              </FadeIn>
            </div>

          </div>
        </div>
      </div>

    </section>
  );
}

function ResponsiveCardSwap({ services }: { services: any[] }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [cardW, setCardW] = useState(300)
  const [shiftX, setShiftX] = useState(0)

  useEffect(() => {
    const measure = () => {
      if (wrapRef.current) {
        const vw = window.innerWidth
        const totalCards = services.length
        const maxMultiplier = 1 + (totalCards - 1) * (52 / 440)
        // Leave 32px padding on each side on mobile (64px total).
        const maxW = vw < 640 
          ? Math.min((vw - 64) / maxMultiplier, 260) 
          : vw < 1024 
            ? Math.min(vw - 48, 400) 
            : 440
        const computedW = Math.max(180, Math.floor(maxW))
        setCardW(computedW)

        const computedDist = Math.round(computedW * (52 / 440))
        if (vw < 1024) {
          // Shift left by 1.5 * computedDist to keep the front card visually centered
          setShiftX(computedDist * 1.5)
        } else {
          setShiftX(0)
        }
      }
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [services.length])

  const ratio = cardW < 320 ? 0.85 : cardW < 400 ? 0.75 : (270 / 440)
  const cardH = Math.round(cardW * ratio)
  const dist = Math.round(cardW * (38 / 440))
  const distY = Math.round(dist * 0.77)
  const totalUpwardProtrusion = (services.length - 1) * distY

  return (
    <div ref={wrapRef} style={{ width: '100%', maxWidth: 440, margin: '0 auto', overflow: 'visible' }}>
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
                key={i}
                customClass="p-6 flex flex-col justify-between overflow-hidden"
                style={{ background: 'var(--bg)', border: '1px solid var(--fg-10)' }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-black uppercase tracking-[0.28em]" style={{ color: 'var(--fg-28)', fontSize: '0.58rem' }}>
                    {service.number}
                  </span>
                  <div className="w-4 h-4 rounded-full" style={{ border: '1px solid var(--fg-15)' }} />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="font-black uppercase leading-tight" style={{ color: C.base, fontSize: '1.05rem' }}>
                    {service.name}
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {service.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="font-medium uppercase tracking-wider rounded-full px-2 py-0.5"
                        style={{ color: C.base, border: '1px solid var(--fg-15)', fontSize: '0.5rem', opacity: 0.52 }}
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

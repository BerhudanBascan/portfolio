import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import FadeIn from '../components/FadeIn'
import ContactButton from '../components/ContactButton'
import { useTranslation } from 'react-i18next'

const MOON_URL         = '/images/about/moon.png'
const BOTTOM_LEFT_URL  = '/images/about/bottom-left.png'
const LEGO_URL         = '/images/about/lego.png'
const BOTTOM_RIGHT_URL = '/images/about/bottom-right.png'

const STAT_IMGS = [
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800&auto=format&fit=crop',
]

function AnimatedParagraph({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.2'] })
  const words = text.split(' ')
  let charCounter = 0
  const totalChars = text.replace(/\s+/g, '').length
  return (
    <p ref={ref} className="flex flex-wrap" style={{ color: 'var(--fg)', fontSize: 'clamp(1rem, 2vw, 1.5rem)', lineHeight: 1.65, fontWeight: 300 }}>
      {words.map((word, wi) => (
        <span key={wi} className="inline-flex mr-[0.3em]">
          {word.split('').map((char, ci) => {
            const start = charCounter / totalChars
            const end = start + 1 / totalChars
            charCounter++
            return <AnimChar key={ci} char={char} progress={scrollYProgress} range={[start, end]} />
          })}
        </span>
      ))}
    </p>
  )
}

function AnimChar({ char, progress, range }: { char: string; progress: any; range: number[] }) {
  const opacity = useTransform(progress, range, [0.15, 1])
  return (
    <span className="relative inline-block">
      <span className="invisible">{char}</span>
      <motion.span style={{ opacity }} className="absolute left-0 top-0">{char}</motion.span>
    </span>
  )
}

export default function AboutSection() {
  const { t } = useTranslation()
  const heading = t('about.heading')
  const lgVw = Math.min(7, 90 / heading.length)
  const mobileVw = Math.min(9.5, 90 / heading.length)
  const containerRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start end', 'end start'] })
  const y1 = useTransform(scrollYProgress, [0, 1], [0,    -220])
  const y2 = useTransform(scrollYProgress, [0, 1], [80,    160])
  const headingY = useTransform(scrollYProgress, [0, 1], [-80, 280])


  const stats = [
    { value: t('about.stats.years'),     suffix: t('about.stats.years_suffix'),     label: t('about.stats.years_label'),     desc: 'Production' },
    { value: t('about.stats.projects'),  suffix: t('about.stats.projects_suffix'),  label: t('about.stats.projects_label'),  desc: 'End-to-End' },
    { value: t('about.stats.gpa'),       suffix: t('about.stats.gpa_suffix'),       label: t('about.stats.gpa_label'),       desc: 'Computer Eng.' },
    { value: t('about.stats.graduated'), suffix: t('about.stats.graduated_suffix'), label: t('about.stats.graduated_label'), desc: 'Sakarya Univ.' },
  ]

  return (
    <section ref={containerRef} id="about" className="relative w-full overflow-x-hidden border-t" style={{ borderColor: 'var(--fg-06)' }}>
      <style>{`
        .metric-fluid-row { display:grid; grid-template-columns:1fr 1fr; width:100%; }
        .metric-fluid-cell { transition:all 1s cubic-bezier(0.19,1,0.22,1); border-right:1px solid var(--fg-06); border-bottom:1px solid var(--fg-06); transform:translateZ(0); }
        .metric-fluid-cell:nth-child(2n) { border-right:none; }
        .metric-fluid-cell:nth-child(3), .metric-fluid-cell:nth-child(4) { border-bottom:none; }
        @media(min-width:768px){
          .metric-fluid-row { display:flex; flex-direction:row; }
          .metric-fluid-cell { border-bottom:none; border-right:1px solid var(--fg-06); flex:1; }
          .metric-fluid-cell:nth-child(2n) { border-right:1px solid var(--fg-06); }
          .metric-fluid-cell:last-child { border-right:none; }
          @media(hover:hover){
            .metric-fluid-row:hover .metric-fluid-cell { flex:0.85; opacity:0.3; filter:grayscale(100%); }
            .metric-fluid-row .metric-fluid-cell:hover { flex:1.45; opacity:1; filter:grayscale(0%); }
            .metric-fluid-cell:hover .wow-num { -webkit-text-stroke:1px var(--fg); color:var(--fg); transform:translateY(-5px); }
            .metric-fluid-cell:hover .wow-label { transform:translateX(8px); }
          }
                  }
        .wow-num { -webkit-text-stroke:1.5px var(--fg); color:transparent; transition:all 0.8s cubic-bezier(0.19,1,0.22,1); }
        .wow-label { transition:transform 0.8s cubic-bezier(0.19,1,0.22,1); }
      `}</style>

      {/* Floating decorative images — parallax */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 hidden sm:block">
        <motion.div style={{ y: y1 }} className="absolute top-[5%] left-[2%] md:left-[4%] w-[100px] md:w-[155px] lg:w-[195px]">
          <img src={MOON_URL} alt="" className="w-full h-auto" draggable={false} />
        </motion.div>
        <motion.div style={{ y: y1 }} className="absolute top-[5%] right-[2%] md:right-[4%] w-[100px] md:w-[155px] lg:w-[195px]">
          <img src={BOTTOM_RIGHT_URL} alt="" className="w-full h-auto" draggable={false} />
        </motion.div>
        <motion.div style={{ y: y2 }} className="absolute top-[75%] right-[3%] md:right-[6%] w-[85px] md:w-[140px] lg:w-[180px]">
          <img src={LEGO_URL} alt="" className="w-full h-auto" draggable={false} />
        </motion.div>
        <motion.div style={{ y: y2 }} className="absolute top-[75%] left-[3%] md:left-[6%] w-[75px] md:w-[130px] lg:w-[165px]">
          <img src={BOTTOM_LEFT_URL} alt="" className="w-full h-auto" draggable={false} />
        </motion.div>
      </div>

      <div className="relative z-10 max-w-[1560px] mx-auto px-5 sm:px-10 md:px-16 xl:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-14">

          {/* Left — sticky heading */}
          <div className="lg:col-span-5 w-full">
            <div className="lg:sticky lg:top-0 lg:h-screen flex flex-col justify-center items-center lg:items-start pt-32 sm:pt-48 lg:pt-24 pb-0 lg:pb-0 text-center lg:text-left">
              <motion.div style={{ y: headingY }} className="hidden lg:block w-full">
                <h2 className="hero-heading font-black uppercase leading-none tracking-tight whitespace-nowrap" style={{ fontSize: `clamp(2.8rem, ${lgVw}vw, 120px)`, color: 'rgb(100, 105, 115)' }}>
                  {heading}
                </h2>
              </motion.div>
              <h2 className="hero-heading font-black uppercase leading-none tracking-tight block lg:hidden text-center mb-10 sm:mb-14 whitespace-nowrap px-4 w-full" style={{ fontSize: `clamp(2rem, ${mobileVw}vw, 150px)`, color: 'rgb(100, 105, 115)' }}>
                {heading}
              </h2>
            </div>
          </div>

          {/* Right — scrolling content */}
          <div className="lg:col-span-7 flex flex-col justify-center lg:py-[30vh] gap-20 sm:gap-28 pb-32">

            {/* Bio */}
            <FadeIn delay={0.2} y={30} className="relative">
              <div className="absolute -left-5 top-0 bottom-0 w-px hidden lg:block"
                style={{ background: 'linear-gradient(to bottom, transparent, var(--fg-15), transparent)' }} />
              <AnimatedParagraph text={t('about.bio')} />
            </FadeIn>

            {/* Metric accordion ribbon */}
            <FadeIn delay={0.25} y={30}>
              <div className="group/bar relative w-full overflow-hidden rounded-2xl border"
                style={{ borderColor: 'var(--fg-06)', background: 'var(--card-bg)' }}>
                {/* Laser line on hover */}
                <div className="absolute top-0 left-0 w-full h-px opacity-0 group-hover/bar:opacity-100 transition-opacity duration-700 pointer-events-none z-20"
                  style={{ background: 'linear-gradient(90deg, transparent, var(--fg-35), transparent)' }} />

                <div className="metric-fluid-row">
                  {stats.map((stat, i) => (
                    <div key={i} className="metric-fluid-cell group/cell relative flex flex-col justify-between p-2 sm:p-4 md:p-6 lg:p-8 min-h-[130px] sm:min-h-[175px] md:min-h-[250px] overflow-hidden cursor-crosshair">

                      {/* BG image reveal */}
                      <div className="absolute inset-0 z-0 overflow-hidden" style={{ background: 'var(--card-bg)' }}>
                        <img
                          src={STAT_IMGS[i]}
                          alt=""
                          className="absolute inset-0 w-full h-full object-cover opacity-0 scale-125 group-hover/cell:opacity-[0.18] group-hover/cell:scale-100 transition-all duration-[1.4s] ease-[cubic-bezier(0.19,1,0.22,1)] mix-blend-luminosity"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/cell:opacity-100 transition-opacity duration-700" />
                      </div>

                      {/* Top index + dot */}
                      <div className="relative z-10 flex items-center justify-between w-full">
                        <span className="font-mono uppercase transition-colors duration-500"
                          style={{ fontSize: '0.6rem', letterSpacing: '0.22em', color: 'var(--fg-40)' }}>
                          IDX.0{i + 1}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5 transition-transform duration-300 lg:hidden group-hover/cell:rotate-45" style={{ color: 'var(--fg-28)' }} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
                          </svg>
                          <div className="w-1.5 h-1.5 rounded-full border transition-all duration-500 group-hover/cell:border-[var(--fg-35)] group-hover/cell:shadow-[0_0_8px_var(--fg-35)] hidden lg:block"
                            style={{ borderColor: 'var(--fg-15)' }} />
                        </div>
                      </div>

                      {/* Bottom stat */}
                      <div className="relative z-10 wow-label flex flex-col mt-8 md:mt-14 w-full">
                        <div className="mb-1.5 h-4 overflow-hidden">
                          <span className="font-mono uppercase block opacity-0 translate-y-full group-hover/cell:opacity-100 group-hover/cell:translate-y-0 transition-all duration-700"
                            style={{ fontSize: '0.6rem', letterSpacing: '0.2em', color: 'var(--fg-35)' }}>
                            {stat.desc}
                          </span>
                        </div>
                        <span className="uppercase mb-1 transition-colors duration-500 group-hover/cell:opacity-90"
                          style={{ fontSize: '0.65rem', fontFamily: 'monospace', letterSpacing: '0.18em', color: 'var(--fg-40)' }}>
                          {stat.label}
                        </span>
                        <div className="flex items-baseline gap-1.5">
                          <span className="wow-num font-black leading-none tracking-tighter"
                            style={{ fontSize: 'clamp(1.6rem, 3.8vw, 4.5rem)' }}>
                            {stat.value}
                          </span>
                          <span className="font-mono transition-colors duration-500 group-hover/cell:opacity-60"
                            style={{ fontSize: '0.62rem', color: 'var(--fg-40)', marginBottom: 2 }}>
                            {stat.suffix}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* CTA */}
            <FadeIn delay={0.4} y={20} className="pt-8 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8"
              style={{ borderColor: 'var(--fg-06)' }}>
              <div>
                <h4 className="font-semibold mb-1" style={{ color: 'var(--fg)', fontSize: 'clamp(1rem, 1.8vw, 1.3rem)' }}>{t('about.cta_title')}</h4>
                <p style={{ color: 'var(--fg)', opacity: 0.4, fontSize: 'clamp(0.75rem, 1.1vw, 0.9rem)', fontWeight: 300 }}>{t('about.cta_subtitle')}</p>
              </div>
              <ContactButton />
            </FadeIn>

          </div>
        </div>
      </div>
    </section>
  )
}
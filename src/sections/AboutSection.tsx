import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import FadeIn from '../components/FadeIn'
import ContactButton from '../components/ContactButton'
import { useTranslation } from 'react-i18next'

const MOON_URL = '/images/about/moon.png'
const BOTTOM_LEFT_URL = '/images/about/bottom-left.png'
const LEGO_URL = '/images/about/lego.png'
const BOTTOM_RIGHT_URL = '/images/about/bottom-right.png'

function AnimatedParagraph({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'end 0.2'] })
  const words = text.split(' ')
  let charCounter = 0
  const totalChars = text.replace(/\s+/g, '').length
  return (
    <p ref={ref} className="flex flex-wrap justify-center" style={{ color: 'var(--fg)', fontSize: 'clamp(0.9rem, 1.8vw, 1.25rem)', lineHeight: 1.75, maxWidth: 'min(620px, 88vw)', fontWeight: 300 }}>
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
  const hobbies = t('about.hobbies', { returnObjects: true }) as string[]
  const stats = [
    { value: t('about.stats.years'),     label: t('about.stats.years_label') },
    { value: t('about.stats.projects'),  label: t('about.stats.projects_label') },
    { value: t('about.stats.gpa'),       label: t('about.stats.gpa_label') },
    { value: t('about.stats.graduated'), label: t('about.stats.graduated_label') },
  ]

  return (
    <section id="about" className="relative w-full">
      <div className="hidden sm:block">
        <FadeIn delay={0.1} x={-80} y={0} duration={0.9} className="absolute top-[6%] left-[1%] md:left-[3%] z-0">
          <img src={MOON_URL} alt="" className="w-[110px] md:w-[180px] lg:w-[210px]" draggable={false} />
        </FadeIn>
        <FadeIn delay={0.25} x={-80} y={0} duration={0.9} className="absolute bottom-[6%] left-[2%] md:left-[6%] z-0">
          <img src={BOTTOM_LEFT_URL} alt="" className="w-[90px] md:w-[150px] lg:w-[180px]" draggable={false} />
        </FadeIn>
        <FadeIn delay={0.15} x={80} y={0} duration={0.9} className="absolute top-[6%] right-[1%] md:right-[3%] z-0">
          <img src={LEGO_URL} alt="" className="w-[110px] md:w-[180px] lg:w-[210px]" draggable={false} />
        </FadeIn>
        <FadeIn delay={0.3} x={80} y={0} duration={0.9} className="absolute bottom-[6%] right-[2%] md:right-[6%] z-0">
          <img src={BOTTOM_RIGHT_URL} alt="" className="w-[120px] md:w-[170px] lg:w-[220px]" draggable={false} />
        </FadeIn>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center text-center px-5 sm:px-8 md:px-10 py-24 sm:py-32 md:py-40" style={{ minHeight: '100vh' }}>
        <FadeIn delay={0} y={40}>
          <h2 className="hero-heading font-black uppercase leading-none tracking-tight mb-10 sm:mb-14 text-center" style={{ fontSize: 'clamp(2.8rem, 12vw, 160px)' }}>
            {t('about.heading')}
          </h2>
        </FadeIn>

        <AnimatedParagraph text={t('about.bio')} />

        <FadeIn delay={0.3} y={24} className="w-full mt-12 sm:mt-16">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px max-w-2xl mx-auto" style={{ border: '1px solid var(--fg-10)', borderRadius: 20, overflow: 'hidden' }}>
            {stats.map((s, i) => (
              <div key={i} className="flex flex-col items-center justify-center gap-1 py-5 px-4" style={{ backgroundColor: 'var(--fg-06)' }}>
                <span className="font-black leading-none" style={{ color: 'var(--fg)', fontSize: 'clamp(1.4rem, 3.5vw, 2.2rem)' }}>{s.value}</span>
                <span className="font-light uppercase tracking-wider text-center" style={{ color: 'var(--fg)', opacity: 0.4, fontSize: 'clamp(0.55rem, 0.9vw, 0.7rem)' }}>{s.label}</span>
              </div>
            ))}
          </div>
        </FadeIn>

        <FadeIn delay={0.4} y={20} className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {hobbies.map(hobby => (
            <span key={hobby} className="px-4 py-1.5 rounded-full font-medium uppercase tracking-widest" style={{ color: 'var(--fg)', border: '1px solid var(--fg-18)', fontSize: 'clamp(0.58rem, 0.95vw, 0.72rem)', opacity: 0.7 }}>
              {hobby}
            </span>
          ))}
        </FadeIn>

        <FadeIn delay={0.5} y={20} className="mt-12 sm:mt-14">
          <ContactButton />
        </FadeIn>
      </div>
    </section>
  )
}
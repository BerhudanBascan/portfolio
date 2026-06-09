import FadeIn from '../components/FadeIn'
import ContactButton from '../components/ContactButton'
import InteractivePortrait from '../components/InteractivePortrait'
import { useTranslation } from 'react-i18next'

export default function HeroSection() {
  const { t } = useTranslation()
  return (
    <section className="min-h-[100svh] flex flex-col relative w-full overflow-hidden">
      <FadeIn delay={0.15} y={40} as="h1" className="hero-heading font-black uppercase tracking-tight leading-none w-full flex-shrink-0 mt-14 sm:mt-16 md:mt-10 text-center break-words sm:whitespace-nowrap px-4" style={{ fontSize: 'clamp(2.5rem, 7.2vw, 280px)', color: 'rgb(100, 105, 115)' }}>
        {t('hero.name')}
      </FadeIn>

      <div className="absolute left-1/2 -translate-x-1/2 z-10 bottom-[32%] sm:bottom-0 w-[260px] sm:w-[340px] md:w-[420px] lg:w-[500px] max-w-full pointer-events-none sm:pointer-events-auto">
        <FadeIn delay={0.6} y={30}>
          <InteractivePortrait />
        </FadeIn>
      </div>

      <div className="flex justify-between items-end pb-6 sm:pb-7 md:pb-10 px-4 sm:px-6 md:px-10 mt-auto flex-shrink-0 w-full relative z-20">
        <FadeIn delay={0.35} y={20} className="flex-1">
          <p className="font-light uppercase tracking-wide leading-snug max-w-[180px] sm:max-w-[240px] md:max-w-[320px]" style={{ color: 'var(--fg)', fontSize: 'clamp(0.75rem, 2vw, 1.5rem)' }}>
            {t('hero.tagline')}
          </p>
        </FadeIn>
        <FadeIn delay={0.5} y={20}><ContactButton /></FadeIn>
      </div>
    </section>
  )
}

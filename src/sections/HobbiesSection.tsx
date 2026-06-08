import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import FadeIn from '../components/FadeIn';

const HOBBY_IDS = ["software", "coffee", "muaythai", "photo", "music", "gaming"] as const;

function getImage(id: string) {
  switch (id) {
    case 'software': return 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=1200&auto=format&fit=crop';
    case 'coffee': return 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=1200&auto=format&fit=crop';
    case 'muaythai': return 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop';
    case 'photo': return 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop';
    case 'music': return 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop';
    case 'gaming': return 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop';
    default: return '';
  }
}

export default function HobbiesSection() {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, -120]);

  const hobbiesData = HOBBY_IDS.map((id) => ({
    id,
    title: t(`hobbies.${id}.title`),
    subtitle: t(`hobbies.${id}.subtitle`),
    desc: t(`hobbies.${id}.desc`),
    image: getImage(id)
  }));

  return (
    <section 
      ref={containerRef} 
      id="hobbies" 
      className="relative w-full py-24 sm:py-32 md:py-40 overflow-hidden transition-colors duration-300"
      style={{ backgroundColor: 'var(--bg)', color: 'var(--fg)' }}
    >
      
      {/* Soft Ambient Light */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.03] mix-blend-overlay"
        style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }}
      />
      
      <motion.div 
         style={{ 
           y: yParallax,
           backgroundColor: theme === 'light' ? 'rgba(138, 166, 193, 0.25)' : '#8aa6c1'
         }}
         className="absolute top-[20%] right-[-10%] w-[60vw] h-[60vw] rounded-full blur-[180px] opacity-[0.08] pointer-events-none mix-blend-screen" 
      />

      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-4 sm:px-8 md:px-10 h-full flex flex-col">
        
        {/* Header (Aligned with standard section header style) */}
        <div className="mb-12 sm:mb-20 text-center">
          <FadeIn delay={0} y={40}>
            <h2 className="hero-heading font-black uppercase leading-none tracking-tight text-center mb-6" style={{ fontSize: 'clamp(2.8rem, 12vw, 160px)' }}>
              {t('hobbies.heading')}
            </h2>
          </FadeIn>
          {t('hobbies.caption') && (
            <FadeIn delay={0.15} y={20}>
              <p className="text-white/50 text-base md:text-lg font-light leading-relaxed max-w-[680px] mx-auto" style={{ color: 'var(--fg-40)' }}>
                {t('hobbies.caption')}
              </p>
            </FadeIn>
          )}
        </div>

        {/* Vertically Stacked High-End Cards */}
        <div className="flex flex-col gap-6 sm:gap-8 w-full">
          {hobbiesData.map((hobby, index) => {
             return (
               <FadeIn key={hobby.id} delay={index * 0.08} y={30} className="w-full">
                 <div
                    className="group relative rounded-[2rem] overflow-hidden border transition-all duration-500 ease-out flex flex-col md:flex-row justify-between gap-6 p-8 md:p-12 min-h-[220px] sm:min-h-[280px]"
                    style={{ 
                      borderColor: 'var(--fg-08)',
                      backgroundColor: 'var(--fg-06)' 
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget;
                      el.style.borderColor = 'var(--fg-28)';
                      el.style.boxShadow = '0 16px 48px rgba(0,0,0,0.4)';
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget;
                      el.style.borderColor = 'var(--fg-08)';
                      el.style.boxShadow = 'none';
                    }}
                 >
                    {/* Background Image / Scale Effect */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center origin-center transition-all duration-[800ms] ease-out filter grayscale(60%) brightness(0.22) group-hover:scale-[1.03] group-hover:grayscale-[20%] group-hover:brightness-[0.35]"
                      style={{ 
                        backgroundImage: `url(${hobby.image})`,
                        zIndex: 0
                      }}
                    />
                    
                    {/* Cinematic Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10 pointer-events-none max-md:bg-gradient-to-t max-md:from-black/90 max-md:via-black/50" />

                    {/* Left Column: Index & Title & Subtitle */}
                    <div className="relative z-20 flex flex-col justify-center flex-1">
                       <span className="text-[#8aa6c1] text-[10px] font-mono font-bold tracking-[0.2em] uppercase mb-2 opacity-75">
                          0{index + 1} — {hobby.subtitle}
                       </span>
                       <h3 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-white">
                          {hobby.title}
                       </h3>
                    </div>

                    {/* Right Column: Description */}
                    <div className="relative z-20 flex items-center flex-[1.2] md:max-w-[520px]">
                       <p className="text-white/80 font-light text-sm sm:text-base leading-relaxed">
                          {hobby.desc}
                       </p>
                    </div>

                    {/* Subtle Inner Glow on Hover */}
                    <div className="absolute inset-0 rounded-[2rem] border border-white/10 pointer-events-none transition-opacity duration-500 opacity-0 group-hover:opacity-100 z-30" />
                    
                 </div>
               </FadeIn>
             );
          })}
        </div>

      </div>
    </section>
  );
}

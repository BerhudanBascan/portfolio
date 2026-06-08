import { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import FadeIn from '../components/FadeIn';

const HOBBY_IDS = ["software", "coffee", "muaythai", "photo", "music", "gaming"] as const;

function getIcon(id: string) {
  switch (id) {
    case 'software': return '💻';
    case 'coffee': return '☕';
    case 'muaythai': return '🥊';
    case 'photo': return '📸';
    case 'music': return '🎧';
    case 'gaming': return '✈️';
    default: return '';
  }
}

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
  const [activeCard, setActiveCard] = useState<string | null>(null);

  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, -150]);

  const hobbiesData = HOBBY_IDS.map((id) => ({
    id,
    title: t(`hobbies.${id}.title`),
    subtitle: t(`hobbies.${id}.subtitle`),
    desc: t(`hobbies.${id}.desc`),
    icon: getIcon(id),
    image: getImage(id)
  }));

  const handleCardClick = (id: string) => {
    setActiveCard(prev => prev === id ? null : id);
  };

  return (
    <section 
      ref={containerRef} 
      id="hobbies" 
      className="relative min-h-[100vh] py-24 sm:py-32 overflow-hidden flex flex-col justify-center transition-colors duration-300"
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

      <div className="relative z-10 w-full max-w-[1800px] mx-auto px-6 sm:px-12 h-full flex flex-col">
        
        {/* Header */}
        <div className="w-full flex flex-col md:flex-row md:items-end justify-between mb-12 lg:mb-20 gap-8">
           <div className="flex flex-col">
              <FadeIn delay={0.1} y={20}>
                <span className="text-[#8aa6c1] text-xs uppercase tracking-[0.4em] font-semibold mb-6 block">
                  {t('hobbies.section_title')}
                </span>
              </FadeIn>
              <FadeIn delay={0.2} y={30}>
                <h2 className="text-[clamp(3rem,8vw,100px)] font-black uppercase leading-[0.85] tracking-tighter" style={{ color: 'var(--fg)' }}>
                  {t('hobbies.title_main')}
                  <span className="block text-white/40 italic font-light ml-[-2px] md:ml-2" style={{ color: 'var(--fg-40)' }}>
                    {t('hobbies.subtitle_main')}
                  </span>
                </h2>
              </FadeIn>
           </div>
           
           <FadeIn delay={0.3} y={30} className="max-w-[450px]">
              <p className="text-white/50 text-base md:text-lg font-light leading-relaxed" style={{ color: 'var(--fg-40)' }}>
                 {t('hobbies.caption')}
              </p>
           </FadeIn>
        </div>

        {/* High-End Expanding Gallery with pure CSS transition / JS toggle for mobile */}
        <FadeIn delay={0.4} y={40} className="w-full">
           <div className={`hobby-gallery w-full h-[70vh] lg:h-[650px] min-h-[500px] flex flex-col lg:flex-row gap-2 lg:gap-3 group/gallery ${activeCard ? 'has-active' : ''}`}>
              {hobbiesData.map((hobby, index) => {
                 const isActive = activeCard === hobby.id;
                 return (
                   <div
                      key={hobby.id}
                      onClick={() => handleCardClick(hobby.id)}
                      className={`hobby-card relative rounded-[2rem] overflow-hidden cursor-pointer flex-shrink-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-[flex,opacity,filter] border flex-1 z-10 ${isActive ? 'is-active' : ''}`}
                      style={{ 
                        borderColor: 'var(--fg-08)',
                        backgroundColor: 'var(--fg-06)' 
                      }}
                   >
                      {/* Background Image / Scale Effect */}
                      <div 
                        className="hobby-bg absolute inset-0 bg-cover bg-center origin-center transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
                        style={{ 
                          backgroundImage: `url(${hobby.image})`,
                          filter: 'grayscale(80%) brightness(0.3)'
                        }}
                      />
                      
                      {/* Cinematic Gradients */}
                      <div className="hobby-gradient absolute inset-0 transition-opacity duration-700 opacity-30">
                         <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                         <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent opacity-50" />
                      </div>

                      {/* Content Container */}
                      <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between pointer-events-none">
                         {/* Top Header / Icon */}
                         <div className="flex items-start justify-between w-full relative z-10 max-lg:hidden lg:flex">
                            <div className="hobby-icon w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-xl md:text-2xl transition-all duration-700 ease-out backdrop-blur-md bg-black/40 border border-white/5">
                               {hobby.icon}
                            </div>

                            <span className="hobby-index text-xs font-mono font-bold tracking-widest transition-opacity duration-500 will-change-opacity text-white/30">
                               0{index + 1}
                            </span>
                         </div>

                         {/* Mobile Top Header */}
                         <div className="hobby-mobile-head flex justify-between items-center w-full lg:hidden relative z-10 transition-opacity duration-300 opacity-0">
                            <div className="flex items-center gap-4">
                               <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center">
                                  {hobby.icon}
                               </div>
                               <span className="text-[#8aa6c1] text-[10px] font-bold tracking-[0.2em] uppercase">
                                  {hobby.subtitle}
                                </span>
                            </div>
                            <span className="text-xs font-mono font-bold tracking-widest text-white/50">
                               0{index + 1}
                            </span>
                         </div>

                         {/* Bottom Title & Description Reveal */}
                         <div className="flex flex-col relative z-10 justify-end flex-grow h-full">
                            
                            {/* Collapsed Vertical/Horizontal Text */}
                            <div className="hobby-collapsed absolute bottom-0 left-0 transition-opacity duration-300 w-full lg:w-[300px] flex items-center lg:items-end lg:origin-bottom-left lg:-rotate-90 lg:translate-x-4 lg:pb-0 pb-2 opacity-100 max-lg:translate-y-0 relative lg:absolute">
                               <h3 className="text-lg md:text-2xl font-black uppercase tracking-widest whitespace-nowrap text-white/50">
                                  {hobby.title}
                               </h3>
                            </div>

                            {/* Expanded Content */}
                            <div className="hobby-expanded flex flex-col gap-2 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] max-lg:absolute max-lg:bottom-0 max-lg:left-0 max-lg:right-0 max-lg:px-0 max-lg:pb-2 opacity-0 translate-y-10 lg:max-h-0">
                               
                               <h3 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white whitespace-nowrap max-lg:hidden">
                                  {hobby.title}
                               </h3>
                               
                               <h3 className="text-3xl font-black uppercase tracking-tight text-white whitespace-nowrap lg:hidden">
                                  {hobby.title}
                               </h3>
                               
                               <span className="text-[#8aa6c1] text-xs font-bold tracking-[0.2em] uppercase max-lg:hidden">
                                  {hobby.subtitle}
                               </span>
                               
                               <p className="text-white/70 font-light text-xs sm:text-sm md:text-base leading-relaxed lg:w-[320px] whitespace-normal mt-1 md:mt-2 line-clamp-3 lg:line-clamp-none">
                                  {hobby.desc}
                               </p>
                            </div>

                         </div>
                      </div>

                      {/* Subtle Inner Glow on Hover / Active */}
                      <div className="hobby-glow absolute inset-0 rounded-[2rem] border border-white/20 pointer-events-none transition-opacity duration-700 opacity-0" />
                      
                   </div>
                 );
              })}
           </div>
        </FadeIn>

        {/* Global Styles for Pure CSS Hover Expansion & JS click active class */}
        <style dangerouslySetInnerHTML={{__html:`
           @media (hover: hover) {
              /* When gallery is hovered, dim others */
              .hobby-gallery:hover .hobby-card {
                 flex: 0.5;
                 opacity: 0.4;
                 filter: blur(1px);
                 z-index: 10;
              }
              @media (min-width: 1024px) {
                 .hobby-gallery:hover .hobby-card {
                    flex: 0.6;
                 }
              }

              /* When specific card is hovered, expand it */
              .hobby-gallery .hobby-card:hover {
                 flex: 3;
                 opacity: 1;
                 filter: blur(0px);
                 z-index: 20;
                 box-shadow: 0 30px 100px rgba(0,0,0,0.8);
              }
              @media (min-width: 1024px) {
                 .hobby-gallery .hobby-card:hover {
                    flex: 4;
                 }
              }

              /* Animate inner elements on card hover */
              .hobby-card:hover .hobby-bg {
                 transform: scale(1.05);
                 filter: grayscale(0%) brightness(0.6) !important;
              }
              .hobby-card:hover .hobby-gradient { opacity: 1; }
              .hobby-card:hover .hobby-icon {
                 background-color: rgba(255,255,255,0.1);
                 border-color: rgba(255,255,255,0.2);
                 box-shadow: 0 0 30px rgba(255,255,255,0.1);
                 transform: scale(1.1);
              }
              .hobby-card:hover .hobby-index { color: white; opacity: 1; }
              .hobby-card:hover .hobby-mobile-head { opacity: 1; }
              
              .hobby-card:hover .hobby-collapsed {
                 opacity: 0 !important;
                 pointer-events: none;
              }
              .hobby-card:hover .hobby-expanded {
                 opacity: 1 !important;
                 transform: translateY(0);
                 max-height: 300px;
              }
              .hobby-card:hover .hobby-glow { opacity: 1; }
           }

           /* Touch/JS Active State (Overrides/Supplements hover behavior) */
           .hobby-gallery.has-active .hobby-card:not(.is-active) {
              flex: 0.5;
              opacity: 0.3;
              filter: blur(1px);
              z-index: 10;
           }

           .hobby-gallery .hobby-card.is-active {
              flex: 4;
              opacity: 1;
              filter: blur(0px);
              z-index: 20;
              box-shadow: 0 30px 100px rgba(0,0,0,0.8);
           }

           .hobby-card.is-active .hobby-bg {
              transform: scale(1.05);
              filter: grayscale(0%) brightness(0.6) !important;
           }
           .hobby-card.is-active .hobby-gradient { opacity: 1; }
           .hobby-card.is-active .hobby-icon {
              background-color: rgba(255,255,255,0.1);
              border-color: rgba(255,255,255,0.2);
              box-shadow: 0 0 30px rgba(255,255,255,0.1);
              transform: scale(1.1);
           }
           .hobby-card.is-active .hobby-index { color: white; opacity: 1; }
           .hobby-card.is-active .hobby-mobile-head { opacity: 1; }
           
           .hobby-card.is-active .hobby-collapsed {
              opacity: 0 !important;
              pointer-events: none;
           }
           .hobby-card.is-active .hobby-expanded {
              opacity: 1 !important;
              transform: translateY(0);
              max-height: 300px;
           }
           .hobby-card.is-active .hobby-glow { opacity: 1; }
        `}} />

      </div>
    </section>
  );
}

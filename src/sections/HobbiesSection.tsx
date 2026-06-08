import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';

const HOBBY_IDS = ["software", "coffee", "muaythai", "photo", "music", "gaming"] as const;

function getImage(id: string) {
  switch (id) {
    case 'software': return 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=600&auto=format&fit=crop';
    case 'coffee': return 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=600&auto=format&fit=crop';
    case 'muaythai': return 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop';
    case 'photo': return 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=600&auto=format&fit=crop';
    case 'music': return 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop';
    case 'gaming': return 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop';
    default: return '';
  }
}

export default function HobbiesSection() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [activeCard, setActiveCard] = useState<string | null>(null);

  useEffect(() => {
    // Open the first card by default ONLY on mobile viewports
    if (window.innerWidth < 768) {
      setActiveCard("software");
    }
  }, []);

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

  const handleCardClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveCard(prev => prev === id ? null : id);
  };

  return (
    <section 
      ref={containerRef} 
      id="hobbies" 
      className="relative w-full py-24 sm:py-32 md:py-40 overflow-hidden transition-colors duration-300"
      style={{ backgroundColor: 'var(--bg)', color: 'var(--fg)' }}
    >
      
      {/* Background Parallax Glow (Static on mobile to avoid layout shifts) */}
      <motion.div 
         style={{ 
           y: yParallax,
           backgroundColor: theme === 'light' ? 'rgba(138, 166, 193, 0.25)' : '#8aa6c1'
         }}
         className="absolute top-[20%] right-[-10%] w-[60vw] h-[60vw] rounded-full blur-[180px] opacity-[0.08] pointer-events-none mix-blend-screen max-md:hidden" 
      />
      <div 
         style={{ 
           backgroundColor: theme === 'light' ? 'rgba(138, 166, 193, 0.25)' : '#8aa6c1'
         }}
         className="absolute top-[20%] right-[-10%] w-[60vw] h-[60vw] rounded-full blur-[180px] opacity-[0.08] pointer-events-none mix-blend-screen md:hidden" 
      />

      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-4 sm:px-8 md:px-10 h-full flex flex-col">
        
        {/* Header (Animates once on mount, no viewport loop issues) */}
        <div className="mb-12 sm:mb-20 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="hero-heading font-black uppercase leading-none tracking-tight text-center mb-6" 
            style={{ fontSize: 'clamp(2.8rem, 12vw, 160px)' }}
          >
            {t('hobbies.heading')}
          </motion.h2>
          
          {t('hobbies.caption') && (
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-white/50 text-base md:text-lg font-light leading-relaxed max-w-[680px] mx-auto" 
              style={{ color: 'var(--fg-40)' }}
            >
              {t('hobbies.caption')}
            </motion.p>
          )}
        </div>

        {/* Vertically Stacked Accordion Rows */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="w-full"
        >
           <div className={`hobby-gallery w-full flex flex-col gap-3 group/gallery ${activeCard ? 'has-active' : ''}`}>
              {hobbiesData.map((hobby, index) => {
                 const isActive = activeCard === hobby.id;
                 return (
                   <button
                      key={hobby.id}
                      type="button"
                      onClick={(e) => handleCardClick(e, hobby.id)}
                      className={`hobby-card group relative rounded-[1.5rem] md:rounded-[2rem] overflow-hidden pointer-events-auto cursor-pointer border z-10 w-full text-left p-0 block ${isActive ? 'is-active' : ''}`}
                      style={{ 
                        borderColor: 'var(--fg-08)',
                        backgroundColor: '#000000' 
                      }}
                   >
                      {/* Background Image */}
                      <div 
                        className="hobby-bg absolute inset-0 bg-cover bg-center origin-center pointer-events-none opacity-25"
                        style={{ 
                          backgroundImage: `url(${hobby.image})`,
                          zIndex: 0,
                          transition: 'opacity 0.4s ease-out'
                        }}
                      />
                      
                      {/* Gradients */}
                      <div className="hobby-gradient absolute inset-0 transition-opacity duration-500 opacity-40 z-10 pointer-events-none">
                         <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                         <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent opacity-60" />
                      </div>

                      {/* Content Container */}
                      <div className="absolute inset-0 p-5 sm:p-6 md:p-8 flex flex-col justify-between pointer-events-none z-20">
                         {/* Top Header */}
                         <div className="flex justify-between items-start w-full relative z-10">
                            <span className="text-[#8aa6c1] text-[10px] font-bold tracking-[0.2em] uppercase transition-opacity duration-500 opacity-0 group-hover:opacity-100 group-[.is-active]:opacity-100">
                               {hobby.subtitle}
                            </span>
                            <span className="text-xs font-mono font-bold tracking-widest text-white/30 group-hover:text-white/80 group-[.is-active]:text-white/80 transition-colors duration-500">
                               0{index + 1}
                            </span>
                         </div>

                         {/* Bottom Title & Description Reveal */}
                         <div className="relative z-10 flex flex-col justify-end h-full">
                            {/* Collapsed view: Title only */}
                            <div className="hobby-collapsed absolute bottom-0 left-0 transition-opacity duration-300 w-full opacity-100 group-hover:opacity-0 group-[.is-active]:opacity-0">
                               <h3 className="text-lg sm:text-xl md:text-2xl font-black uppercase tracking-widest whitespace-nowrap text-white/60">
                                  {hobby.title}
                               </h3>
                            </div>

                            {/* Expanded view: Title & description */}
                            <div className="hobby-expanded flex flex-col gap-1 sm:gap-2 transition-all duration-500 ease-out opacity-0 translate-y-2 max-h-0 overflow-hidden">
                               <h3 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-white leading-none">
                                  {hobby.title}
                               </h3>
                               <p className="text-white/85 font-light text-xs sm:text-sm md:text-base leading-relaxed max-w-[750px] mt-1 sm:mt-2">
                                  {hobby.desc}
                               </p>
                            </div>
                         </div>
                      </div>

                      {/* Subtle Inner Glow on Hover / Active */}
                      <div className="hobby-glow absolute inset-0 rounded-[1.5rem] md:rounded-[2rem] border border-white/10 pointer-events-none transition-opacity duration-500 opacity-0 z-30" />
                      
                   </button>
                 );
              })}
           </div>
        </motion.div>

        {/* CSS Layout and Animation Transitions */}
        <style dangerouslySetInnerHTML={{__html:`
           /* Card default size and transitions */
           .hobby-card {
              height: 90px;
              transition: border-color 0.4s, opacity 0.4s, box-shadow 0.4s;
           }
           @media (min-width: 768px) {
              .hobby-card {
                 height: 100px;
                 transition: height 0.5s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s, opacity 0.4s, box-shadow 0.4s;
              }
           }

           @media (hover: hover) {
              /* Dim non-hovered items */
              .hobby-gallery:hover .hobby-card {
                 opacity: 0.5;
              }

              /* Expand hovered item */
              .hobby-gallery .hobby-card:hover {
                 height: 250px;
                 opacity: 1;
                 z-index: 20;
                 box-shadow: 0 15px 40px rgba(0,0,0,0.4);
              }
              @media (min-width: 768px) {
                 .hobby-gallery .hobby-card:hover {
                    height: 280px;
                 }
              }

              .hobby-card:hover .hobby-bg {
                 opacity: 0.55;
              }
              .hobby-card:hover .hobby-gradient { opacity: 1; }
              
              .hobby-card:hover .hobby-collapsed {
                 opacity: 0 !important;
                 pointer-events: none;
              }
              .hobby-card:hover .hobby-expanded {
                 opacity: 1 !important;
                 transform: translateY(0);
                 max-height: 250px;
              }
              .hobby-card:hover .hobby-glow { opacity: 1; }
           }

           /* Touch/JS Active State (For Mobile viewports) */
           .hobby-gallery.has-active .hobby-card:not(.is-active) {
              opacity: 0.4;
           }

           .hobby-gallery .hobby-card.is-active {
              height: 250px;
              opacity: 1;
              z-index: 20;
              box-shadow: 0 15px 40px rgba(0,0,0,0.4);
           }
           @media (min-width: 768px) {
              .hobby-gallery .hobby-card.is-active {
                 height: 280px;
              }
           }

           .hobby-card.is-active .hobby-bg {
              opacity: 0.55;
           }
           .hobby-card.is-active .hobby-gradient { opacity: 1; }
           
           .hobby-card.is-active .hobby-collapsed {
              opacity: 0 !important;
              pointer-events: none;
           }
           .hobby-card.is-active .hobby-expanded {
              opacity: 1 !important;
              transform: translateY(0);
              max-height: 250px;
           }
           .hobby-card.is-active .hobby-glow { opacity: 1; }
        `}} />

      </div>
    </section>
  );
}

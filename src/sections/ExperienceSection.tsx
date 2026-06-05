import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FadeIn from '../components/FadeIn'
import { useTranslation } from 'react-i18next'

const B = 'var(--fg)'
const E = [0.25,0.1,0.25,1] as [number,number,number,number]
const tabV = { initial:{opacity:0,y:14}, animate:{opacity:1,y:0,transition:{duration:0.32,ease:E}}, exit:{opacity:0,y:-8,transition:{duration:0.18}} }
const TABS = ['work','intern','certs'] as const

const CSS = `
  .ec-list { display:flex; flex-direction:column; }
  .ec-item { border-bottom:1px solid var(--fg-08); transition:filter 400ms ease, opacity 400ms ease, transform 400ms ease; cursor:pointer; }
  .ec-item:first-child { border-top:1px solid var(--fg-08); }
  .ec-list.has-open .ec-item:not(.is-open) { filter:blur(3px); opacity:0.25; transform:scale(0.98); }
  .ec-list.has-open .ec-item.is-open { transform:scale(1.01); }
`

function Pills({ items }: { items: string[] }) {
  return (
    <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginTop:8 }}>
      {items.map(t => (
        <span key={t} style={{ color:B, border:'1px solid var(--fg-18)', padding:'2px 8px', borderRadius:999, fontSize:'0.5rem', fontWeight:600, textTransform:'uppercase', letterSpacing:'0.1em', opacity:0.6 }}>{t}</span>
      ))}
    </div>
  )
}

function AccordionItem({ children, delay, isOpen }: { children: React.ReactNode; delay: number; isOpen: boolean }) {
  return (
    <motion.div className={`ec-item${isOpen ? ' is-open' : ''}`} initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0, transition:{ duration:0.32, delay, ease:E } }}>
      {children}
    </motion.div>
  )
}

export default function ExperienceSection() {
  const { t } = useTranslation()
  const [tab, setTab] = useState<'work'|'intern'|'certs'>('work')
  const [expanded, setExpanded] = useState<number|null>(null)

  const work = t('experience.work', { returnObjects: true }) as any[]
  const internships = t('experience.internships', { returnObjects: true }) as any[]
  const certs = t('experience.certs', { returnObjects: true }) as any[]

  const toggle = (i: number) => setExpanded(prev => prev === i ? null : i)

  const PlusBtn = ({ open }: { open: boolean }) => (
    <div style={{ width:28, height:28, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', border:`1px solid ${open ? B : 'var(--fg-18)'}`, background: open ? B : 'transparent', flexShrink:0, transition:'all 0.25s' }}>
      <motion.div animate={{ rotate: open ? 135 : 0 }} transition={{ type:'spring', stiffness:200, damping:20 }}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={open ? 'var(--bg)' : B} strokeWidth="2.5" strokeLinecap="round">
          <path d="M12 5v14m-7-7h14" />
        </svg>
      </motion.div>
    </div>
  )

  return (
    <section id="experience" className="px-4 sm:px-8 md:px-10 py-16 sm:py-24 md:py-32">
      <style>{CSS}</style>
      <div className="max-w-5xl mx-auto">
        <FadeIn delay={0} y={40}>
          <h2 className="hero-heading font-black uppercase leading-none tracking-tight mb-10 sm:mb-14 text-center" style={{ fontSize:'clamp(2.8rem,12vw,160px)' }}>
            {t('experience.heading')}
          </h2>
        </FadeIn>

        <div className="flex flex-col md:flex-row gap-8 md:gap-14">
          {/* Tab buttons */}
          <FadeIn delay={0.1} y={20}>
            <div className="flex flex-row md:flex-col gap-2 md:gap-2.5 md:w-44 md:flex-shrink-0 md:sticky md:top-28 md:self-start flex-wrap">
              {TABS.map(id => (
                <button key={id} onClick={() => { setTab(id); setExpanded(null) }}
                  style={{ padding:'0.5rem 1.1rem', fontSize:'clamp(0.55rem,1vw,0.68rem)', letterSpacing:'0.1em', backgroundColor:tab===id ? B : 'transparent', color:tab===id ? 'var(--bg)' : B, border:'1px solid var(--fg-18)', opacity:tab===id ? 1 : 0.45, cursor:'pointer', borderRadius:999, fontWeight:600, textTransform:'uppercase', transition:'all 0.25s', whiteSpace:'nowrap' }}>
                  {t(`experience.tabs.${id}`)}
                </button>
              ))}
              <div className="hidden md:block mt-4" style={{ width:1, height:80, backgroundColor:'var(--fg-06)', marginLeft:'1.1rem' }} />
            </div>
          </FadeIn>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">

              {tab === 'work' && (
                <motion.div key="work" variants={tabV} initial="initial" animate="animate" exit="exit">
                  <div className={`ec-list${expanded !== null ? " has-open" : ""}`}>
                    {work.map((x: any, i: number) => {
                      const isOpen = expanded === i
                      return (
                        <AccordionItem key={i} delay={i * 0.05} isOpen={isOpen}>
                          <div onClick={() => toggle(i)} style={{ padding:'16px 0' }}>
                            <div style={{ display:'flex', alignItems:'baseline', gap:10 }}>
                              <span style={{ color:B, opacity:0.32, fontSize:'0.58rem', fontWeight:500, letterSpacing:'0.06em', whiteSpace:'nowrap', flexShrink:0, minWidth:72 }}>{x.period}</span>
                              <div style={{ flex:1, minWidth:0 }}>
                                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:8 }}>
                                  <div>
                                    <span style={{ color:B, fontWeight:800, fontSize:'clamp(0.82rem,1.3vw,1rem)', letterSpacing:'0.01em', display:'block' }}>{x.role}</span>
                                    <span style={{ color:B, opacity:0.5, fontSize:'0.65rem', fontWeight:500, letterSpacing:'0.06em', textTransform:'uppercase', marginTop:2, display:'block' }}>{x.company} · {x.location}</span>
                                  </div>
                                  <PlusBtn open={isOpen} />
                                </div>
                              </div>
                            </div>
                            <AnimatePresence>
                              {isOpen && (
                                <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }} transition={{ duration:0.35, ease:[0.16,1,0.3,1] }} style={{ overflow:'hidden' }}>
                                  <div style={{ paddingTop:10, paddingLeft: 'clamp(0px, 6vw, 82px)' }}>
                                    <ul style={{ display:'flex', flexDirection:'column', gap:3 }}>
                                      {x.bullets.map((b: string, j: number) => (
                                        <li key={j} style={{ display:'flex', alignItems:'flex-start', gap:7, color:B, opacity:0.62, fontSize:'0.75rem', lineHeight:1.55 }}>
                                          <span style={{ marginTop:7, width:3, height:3, borderRadius:'50%', background:B, flexShrink:0, opacity:0.45 }} />
                                          {b}
                                        </li>
                                      ))}
                                    </ul>
                                    <Pills items={x.stack} />
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </AccordionItem>
                      )
                    })}
                  </div>
                </motion.div>
              )}

              {tab === 'intern' && (
                <motion.div key="intern" variants={tabV} initial="initial" animate="animate" exit="exit">
                  <div className={`ec-list${expanded !== null ? " has-open" : ""}`}>
                    {internships.map((x: any, i: number) => {
                      const isOpen = expanded === i
                      return (
                        <AccordionItem key={i} delay={i * 0.05} isOpen={isOpen}>
                          <div onClick={() => toggle(i)} style={{ padding:'16px 0' }}>
                            <div style={{ display:'flex', alignItems:'baseline', gap:10 }}>
                              <span style={{ color:B, opacity:0.32, fontSize:'0.58rem', fontWeight:500, letterSpacing:'0.06em', whiteSpace:'nowrap', flexShrink:0, minWidth:72 }}>{x.period}</span>
                              <div style={{ flex:1, minWidth:0 }}>
                                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:8 }}>
                                  <div>
                                    <span style={{ color:B, fontWeight:800, fontSize:'clamp(0.82rem,1.3vw,1rem)', letterSpacing:'0.01em', display:'block' }}>{x.role}</span>
                                    <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:2 }}>
                                      <span style={{ color:B, opacity:0.5, fontSize:'0.65rem', fontWeight:500, letterSpacing:'0.06em', textTransform:'uppercase' }}>{x.company}</span>
                                      <span style={{ color:B, opacity:0.32, fontSize:'0.55rem', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', border:'1px solid var(--fg-15)', padding:'1px 6px', borderRadius:999 }}>{x.type}</span>
                                    </div>
                                  </div>
                                  <PlusBtn open={isOpen} />
                                </div>
                              </div>
                            </div>
                            <AnimatePresence>
                              {isOpen && (
                                <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }} transition={{ duration:0.35, ease:[0.16,1,0.3,1] }} style={{ overflow:'hidden' }}>
                                  <div style={{ paddingTop:10, paddingLeft: 'clamp(0px, 6vw, 82px)' }}>
                                    <p style={{ color:B, opacity:0.65, fontSize:'0.75rem', lineHeight:1.6, marginBottom:6 }}>{x.desc}</p>
                                    <Pills items={x.stack} />
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </AccordionItem>
                      )
                    })}
                  </div>
                </motion.div>
              )}

              {tab === 'certs' && (
                <motion.div key="certs" variants={tabV} initial="initial" animate="animate" exit="exit">
                  <div className={`ec-list${expanded !== null ? " has-open" : ""}`}>
                    {certs.map((x: any, i: number) => {
                      const isOpen = expanded === i
                      return (
                        <AccordionItem key={i} delay={i * 0.05} isOpen={isOpen}>
                          <div onClick={() => toggle(i)} style={{ padding:'16px 0' }}>
                            <div style={{ display:'flex', alignItems:'baseline', gap:10 }}>
                              <span style={{ color:B, opacity:0.32, fontSize:'0.58rem', fontWeight:500, letterSpacing:'0.06em', whiteSpace:'nowrap', flexShrink:0, minWidth:72 }}>{x.year}</span>
                              <div style={{ flex:1, minWidth:0 }}>
                                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:8 }}>
                                  <div>
                                    <span style={{ color:B, fontWeight:800, fontSize:'clamp(0.82rem,1.3vw,1rem)', letterSpacing:'0.01em', display:'block' }}>{x.title}</span>
                                    <span style={{ color:B, opacity:0.5, fontSize:'0.65rem', fontWeight:500, display:'block', marginTop:2 }}>{x.issuer}{x.instructor ? ` · ${x.instructor}` : ''}</span>
                                  </div>
                                  <PlusBtn open={isOpen} />
                                </div>
                              </div>
                            </div>
                            <AnimatePresence>
                              {isOpen && x.link && (
                                <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }} transition={{ duration:0.35, ease:[0.16,1,0.3,1] }} style={{ overflow:'hidden' }}>
                                  <div style={{ paddingTop:8, paddingLeft: 'clamp(0px, 6vw, 82px)' }}>
                                    <a href={x.link} target="_blank" rel="noopener noreferrer" style={{ color:B, opacity:0.5, fontSize:'0.65rem', letterSpacing:'0.08em', textDecoration:'underline', textUnderlineOffset:3 }}>View Certificate →</a>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </AccordionItem>
                      )
                    })}
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}

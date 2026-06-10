import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useBreakpoint } from '../hooks/useBreakpoint'

const PROJECT_COLORS = [
  '59,130,246',   // 01 KargoLink — blue
  '220,38,127',   // 02 CS Vortex — pink/red
  '99,102,241',   // 03 Blab CRM — indigo
  '16,185,129',   // 04 KimyaLab — emerald
  '249,115,22',   // 05 CleanerLab — orange
  '245,158,11',   // 06 CryptoBot — amber
  '6,182,212',    // 07 Freqtradee — cyan
  '132,204,22',   // 08 Agrobot — lime
  '168,85,247',   // 09 MKG Tools — purple
  '239,68,68',    // 10 AliExpress — red
  '20,184,166',   // 11 Stok Takibi — teal
  '236,72,153',   // 12 Aura Web — hot pink
  '34,197,94',    // 13 Doctor App — green
  '251,191,36',   // 14 Voltage — yellow
]

const PROJECTS: any[] = [
  { num:'01', client:'Full-Stack MVP',    name:'KargoLink',          stack:'TypeScript · React · Node.js · PostgreSQL · Docker',     github:'https://github.com/BerhudanBascan/KargoLink',                  tl:'https://opengraph.githubassets.com/1/BerhudanBascan/KargoLink',                  bl:'https://opengraph.githubassets.com/1/BerhudanBascan/KargoLink',       r:'https://opengraph.githubassets.com/1/BerhudanBascan/kimyalab' },
  { num:'02', client:'Security Tool',     name:'CS Vortex',          stack:'Python · AI/ML · OpenRouter · Parallel Processing',      github:'https://github.com/BerhudanBascan/CS_Vortex_b_b',              tl:'https://opengraph.githubassets.com/1/BerhudanBascan/CS_Vortex_b_b',              bl:'https://opengraph.githubassets.com/1/BerhudanBascan/CS_Vortex_b_b',          r:'https://opengraph.githubassets.com/1/BerhudanBascan/Freqtradee' },
  { num:'03', client:'Full-Stack SaaS',   name:'Blab Market CRM',    stack:'TypeScript · React · Node.js · PostgreSQL · Socket.io',  github:'https://github.com/BerhudanBascan/Blab-Market-',               tl:'https://opengraph.githubassets.com/1/BerhudanBascan/Blab-Market-',               bl:'https://opengraph.githubassets.com/1/BerhudanBascan/Blab-Market-',          r:'https://opengraph.githubassets.com/1/BerhudanBascan/CS_Vortex_b_b' },
  { num:'04', client:'Client Project',    name:'KimyaLab',           stack:'TypeScript · React · Three.js · Firebase · Tailwind',    github:'https://github.com/BerhudanBascan/kimyalab',                   tl:'https://opengraph.githubassets.com/1/BerhudanBascan/kimyalab',                   bl:'https://opengraph.githubassets.com/1/BerhudanBascan/kimyalab', r:'https://opengraph.githubassets.com/1/BerhudanBascan/aura_WEB_site' },
  { num:'05', client:'Mobile App',        name:'CleanerLab',         stack:'React Native · Node.js · JIMP · MobX · IAP',             github:'https://github.com/BerhudanBascan/CleanerLab',                 tl:'https://opengraph.githubassets.com/1/BerhudanBascan/CleanerLab',                 bl:'https://opengraph.githubassets.com/1/BerhudanBascan/CleanerLab', r:'https://opengraph.githubassets.com/1/BerhudanBascan/Blab-Market-' },
  { num:'06', client:'Algo Trading',      name:'CryptoBot',          stack:'Python · WebSockets · Financial APIs · Risk Mgmt',       github:'https://github.com/BerhudanBascan/CryptoBot',                  tl:'https://opengraph.githubassets.com/1/BerhudanBascan/CryptoBot',                  bl:'https://opengraph.githubassets.com/1/BerhudanBascan/CryptoBot',         r:'https://opengraph.githubassets.com/1/BerhudanBascan/CS_Vortex_b_b' },
  { num:'07', client:'Trading Automation',name:'Freqtradee',         stack:'Python · Freqtrade · TA-Lib · Docker',                   github:'https://github.com/BerhudanBascan/Freqtradee',                 tl:'https://opengraph.githubassets.com/1/BerhudanBascan/Freqtradee',                 bl:'https://opengraph.githubassets.com/1/BerhudanBascan/Freqtradee',          r:'https://opengraph.githubassets.com/1/BerhudanBascan/KargoLink' },
  { num:'08', client:'R&D Internship',    name:'Agrobot TUBiTAK',   stack:'React · TypeScript · REST API · Data Visualization',     github:'https://github.com/BerhudanBascan/Agrobot-Tubitak---Project', tl:'https://opengraph.githubassets.com/1/BerhudanBascan/Agrobot-Tubitak---Project',  bl:'https://opengraph.githubassets.com/1/BerhudanBascan/Agrobot-Tubitak---Project',           r:'https://opengraph.githubassets.com/1/BerhudanBascan/kimyalab' },
  { num:'09', client:'Production Tool',   name:'MKG Internal Tools', stack:'Python · TypeScript · Flutter · Supabase · PostgreSQL',  github:'https://github.com/BerhudanBascan/MKG_ELK',                    tl:'https://opengraph.githubassets.com/1/BerhudanBascan/MKG_ELK',                   bl:'https://opengraph.githubassets.com/1/BerhudanBascan/MKG_ELK', r:'https://opengraph.githubassets.com/1/BerhudanBascan/Blab-Market-' },
  { num:'10', client:'Automation',        name:'AliExpress Scraper', stack:'Python · Web Scraping · Selenium · Data Pipeline',       github:'https://github.com/BerhudanBascan/AliExpressScrapingBot',      tl:'https://opengraph.githubassets.com/1/BerhudanBascan/AliExpressScrapingBot',      bl:'https://opengraph.githubassets.com/1/BerhudanBascan/AliExpressScrapingBot',           r:'https://opengraph.githubassets.com/1/BerhudanBascan/Freqtradee' },
  { num:'11', client:'Internal Tool',     name:'Stok Takibi',        stack:'Next.js · Supabase · TypeScript · Tailwind CSS',         github:'https://github.com/BerhudanBascan',                            tl:'https://opengraph.githubassets.com/1/BerhudanBascan/CleanerLab',                 bl:'https://opengraph.githubassets.com/1/BerhudanBascan/CleanerLab',          r:'https://opengraph.githubassets.com/1/BerhudanBascan/aura_WEB_site' },
  { num:'12', client:'Web Design',        name:'Aura Web Site',      stack:'TypeScript · React · CSS Animations',                   github:'https://github.com/BerhudanBascan/aura_WEB_site',              tl:'https://opengraph.githubassets.com/1/BerhudanBascan/aura_WEB_site',              bl:'https://opengraph.githubassets.com/1/BerhudanBascan/aura_WEB_site', r:'https://opengraph.githubassets.com/1/BerhudanBascan/DoctorAppointmentEdoc' },
  { num:'13', client:'Web App',           name:'Doctor Appointment', stack:'React · Node.js · MongoDB · Express.js',                github:'https://github.com/BerhudanBascan/DoctorAppointmentEdoc',      tl:'https://opengraph.githubassets.com/1/BerhudanBascan/DoctorAppointmentEdoc',      bl:'https://opengraph.githubassets.com/1/BerhudanBascan/DoctorAppointmentEdoc',         r:'https://opengraph.githubassets.com/1/BerhudanBascan/CryptoBot' },
  { num:'14', client:'Creative 3D',       name:'Voltage Animation',  stack:'JavaScript · Three.js · CSS · WebGL',                   github:'https://github.com/BerhudanBascan/Voltage-Animation-Web-Site', tl:'https://opengraph.githubassets.com/1/BerhudanBascan/Voltage-Animation-Web-Site', bl:'https://opengraph.githubassets.com/1/BerhudanBascan/Voltage-Animation-Web-Site',      r:'https://opengraph.githubassets.com/1/BerhudanBascan/AliExpressScrapingBot' },
] as const

const TOTAL = PROJECTS.length

type D = { desc:string; hi:string[]; year:string; status:string }
const DET: Record<string,D> = {
  '01':{year:'2025',status:'Active',     desc:'Centralized logistics MVP aggregating Turkish cargo carriers (Yurtici, Aras, MNG) under one API. One request returns sorted price/ETA from all carriers. Customer selects, system auto-books, real-time tracking unified into one feed.',hi:['Parallel carrier queries, normalized response schema','Automated booking pipeline with confirmation flow','Unified GPS tracking across all carriers','Admin panel for carrier management and history','Bulk Excel import for corporate multi-shipment orders']},
  '02':{year:'2026',status:'Active',     desc:'Advanced vulnerability scanner with AI-driven analysis via OpenRouter. 150+ req/sec, 3.2% false positive rate. WAF bypass via adaptive stealth with user-agent rotation and SOCKS5/Tor proxies. Comprehensive detection across 10+ vulnerability classes.',hi:['833-payload tiered system with WAF bypass mutation engine','AI triage via GPT-4 / Claude / Llama 3','Detects SQLi, XSS, CSRF, SSRF, LFI, XXE, SSTI, JWT flaws','Subdomain discovery via CT log enumeration','75%+ test coverage, 320+ test cases']},
  '03':{year:'2025',status:'Production', desc:'Full CRM for medical product and trade companies — customer management, sales pipeline, inventory, invoicing, financial analytics, and workflow automation. Glassmorphism UI with real-time WebSocket notifications and role-based access.',hi:['Role-based access with 5 permission levels','Real-time KPI analytics dashboard and sales funnel','Automated invoicing with PDF/Excel export','WebSocket live notifications and activity feed','Time-based workflow automation engine']},
  '04':{year:'2025',status:'Production', desc:'Chemical product management platform with real-time Firebase sync, interactive 3D molecular visualizations via Three.js, and multilingual certificate handling (TR/EN/AR) with full RTL support.',hi:['3D molecular visualization with Three.js WebGL','Real-time Firestore sync with onSnapshot listeners','Multilingual SDS/COA/MSDS certificate handling','Search across CAS number, SKU, formula, brand','Secure role-based admin panel']},
  '05':{year:'2025',status:'Production', desc:'iOS and Android storage cleaner with native Node.js bridge for on-device JIMP image processing. Detects duplicate and similar photos, IAP-backed premium packs, 17+ languages, Google Ads, and iOS widget extension.',hi:['Native Node.js bridge for GPU image analysis','iOS widget with shared App Group storage','IAP with 6 city-themed premium packs','Google Mobile Ads rewarded and interstitial','Lottie-powered animations throughout']},
  '06':{year:'2025',status:'Active',     desc:'Low-latency automated HFT system for multi-exchange crypto execution. WebSocket data feeds with systematic risk management, minimal slippage targeting, real-time P&L tracking, and configurable stop-loss logic.',hi:['Sub-millisecond WebSocket order book ingestion','Multi-exchange unified order abstraction','Dynamic position sizing with risk controls','Real-time P&L dashboard and drawdown monitoring','Configurable strategy params with backtesting']},
  '07':{year:'2025',status:'Active',     desc:'Production-grade automated trading bot on Freqtrade. Custom TA-Lib strategy logic, full OHLCV backtesting pipeline, live trading execution, and performance monitoring dashboard — containerized with Docker.',hi:['Custom strategy with TA-Lib indicators','Full backtesting on historical OHLCV data','Docker-containerized multi-environment deploy','Hyperopt parameter optimization','Telegram integration for live trade alerts']},
  '08':{year:'2024',status:'Completed',  desc:'R&D drone data monitoring frontend built during TUBiTAK BiLGEM internship for the Agrobot agricultural project. Automatically fetches and visualizes drone-generated field data for researchers and field engineers.',hi:['Real-time drone telemetry visualization','Automatic backend API data fetching and display','Built in a formal R&D environment','React responsive dashboard for field use','Integrated into TUBiTAK Agrobot pipeline']},
  '09':{year:'2026',status:'Production', desc:'Digital transformation suite for MKG Elektromekanik. Automated invoicing from scraped supplier data and a Flutter personnel tracking app — both actively deployed and used in daily production operations.',hi:['Auto invoice generation from scraped catalog','Flutter personnel app on company devices','Supabase real-time PostgreSQL backend','Significantly reduced manual workload','Integrated with ERP and supplier data flows']},
  '10':{year:'2026',status:'Production', desc:'Automated AliExpress scraping pipeline extracting and normalizing product data at scale. Powers MKG automated invoicing with an always-updated catalog containing accurate pricing and specifications.',hi:['High-throughput AliExpress product extraction','Data normalization with category classification','Schema mapping to internal product database','Rate-limit-aware scraping with proxy rotation','Direct feed into MKG invoicing pipeline']},
  '11':{year:'2026',status:'Production', desc:'Real-time inventory tracking app with Next.js App Router and Supabase. Live stock monitoring, product management, and instant updates for operational teams — deployed in production for daily MKG workflows.',hi:['Real-time stock via Supabase live subscriptions','Product catalog with category filtering','Next.js App Router with server components','Role-based access for warehouse teams','Mobile-responsive for on-floor warehouse use']},
  '12':{year:'2026',status:'Active',     desc:'Modern animation-forward agency website for Aura creative studio. Smooth CSS animations, fully responsive layout, and refined brand identity. Currently live and actively maintained as the studios primary digital presence.',hi:['Smooth scroll-driven CSS animations','Fully responsive from mobile to ultra-wide','Polished brand identity with custom typography','Fast static delivery with optimized assets','Live and actively maintained in production']},
  '13':{year:'2024',status:'Completed',  desc:'Doctor appointment web app with patient-facing booking flow, doctor profile search with specialization filters, real-time availability tracking, and an admin interface for clinic staff management.',hi:['Patient-facing doctor search with filters','Real-time appointment slot availability','Admin dashboard for clinic staff','MongoDB appointment and patient data model','Express.js REST API with JWT auth']},
  '14':{year:'2026',status:'Completed',  desc:'Visually ambitious 3D animated web experience pushing browser-based WebGL through Three.js-inspired GPU-accelerated canvas animations — high-voltage electric arc effects, particle systems, and dynamic lighting at 60fps.',hi:['GPU-accelerated WebGL with custom shaders','High-voltage electric arc and particle effects','Dynamic lighting and bloom post-processing','60fps rendering with requestAnimationFrame','Zero-dependency custom WebGL pipeline']},
}


function ProjectCard({ project, index, isMobile, scrollYProgress }: {
  project: typeof PROJECTS[0]
  index: number
  isMobile: boolean
  scrollYProgress: any
}) {
  const { t } = useTranslation()

  const range = [index / TOTAL, Math.min((index + 2) / TOTAL, 1)]
  const scale = useTransform(scrollYProgress, range, [1, 1 - (TOTAL - 1 - index) * 0.025])
  const rawD = DET[project.num]
  const detTr = t(`projects.det.${project.num}`, { returnObjects: true, defaultValue: null }) as any
  const d = detTr && typeof detTr === 'object' && detTr.desc ? { ...rawD, desc: detTr.desc, hi: detTr.hi } : rawD
  const live = d.status === 'Production' || d.status === 'Active'
  const highlights = d.hi

  const [hovered, setHovered] = useState(false)
  const color = PROJECT_COLORS[index % PROJECT_COLORS.length]

  return (
    <div style={{ position: isMobile ? 'relative' : 'sticky', top: isMobile ? 'auto' : 72, zIndex: index + 1 }}>
      <motion.div
        style={{ scale: isMobile ? 1 : scale, transformOrigin: 'top center', maxWidth: 1200, margin: '0 auto', padding: isMobile ? '0 0.5rem' : '0 clamp(0.75rem,3vw,2rem)', position: 'relative' }}
      >
        {/* Aurora glow behind card */}
        <div style={{
          position: 'absolute',
          inset: '-30px',
          borderRadius: 'clamp(32px,5vw,64px)',
          background: `radial-gradient(ellipse at 50% 60%, rgba(${color},0.3) 0%, rgba(${color},0.1) 45%, transparent 75%)`,
          pointerEvents: 'none',
          zIndex: 0,
          opacity: hovered ? 0.55 : 0.2,
          transition: 'opacity 0.8s cubic-bezier(0.16,1,0.3,1)',
        }} />
        <div
          style={{ position: 'relative', zIndex: 1, background: 'var(--card-bg)', border: `2px solid rgba(215,226,234,${0.1 + (TOTAL - 1 - index) * 0.025})`, borderRadius: isMobile ? 20 : 'clamp(24px,3.5vw,48px)', boxShadow: '0 8px 32px rgba(0,0,0,0.6)', overflow: 'hidden', transition: 'border-color 0.4s, box-shadow 0.4s' }}
          onMouseEnter={e => { setHovered(true); const el = e.currentTarget; el.style.borderColor = `rgba(${color},0.35)`; el.style.boxShadow = `0 24px 80px rgba(0,0,0,0.9), 0 0 60px rgba(${color},0.15)` }}
          onMouseLeave={e => { setHovered(false); const el = e.currentTarget; el.style.borderColor = `rgba(215,226,234,${0.1 + (TOTAL - 1 - index) * 0.025})`; el.style.boxShadow = '0 8px 32px rgba(0,0,0,0.6)' }}
        >
          <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,var(--fg-28) 35%,var(--fg-08) 70%,transparent)' }} />
          <div style={{ padding: isMobile ? '0.9rem' : 'clamp(1.4rem,3.5vw,3rem)' }}>

            {/* Card header: num + title + badges + github */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: isMobile ? '0.6rem' : 'clamp(0.8rem,2.5vw,1.8rem)', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: isMobile ? '0.5rem' : 'clamp(0.8rem,2.5vw,1.8rem)', flex: 1, minWidth: 0 }}>
                {!isMobile && (
                  <span style={{ fontSize: 'clamp(2.2rem,8vw,100px)', fontWeight: 900, lineHeight: 0.85, color: 'transparent', WebkitTextStroke: '1.5px var(--fg-10)', letterSpacing: '-0.04em', flexShrink: 0, userSelect: 'none', marginTop: '0.06em' }}>{project.num}</span>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: '0.4rem', alignItems: 'center' }}>
                    {isMobile && <span style={{ color: 'var(--fg-28)', fontWeight: 900, fontSize: '0.6rem', letterSpacing: '0.1em', marginRight: 2 }}>{project.num}</span>}
                    <span style={{ padding: '2px 8px', border: '1px solid var(--fg-15)', borderRadius: 999, fontSize: '0.62rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--fg-40)' }}>{project.client}</span>
                    <span style={{ padding: '2px 8px', borderRadius: 999, fontSize: '0.62rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', background: live ? 'rgba(61,184,125,0.1)' : 'var(--fg-06)', color: live ? '#3DB87D' : 'var(--fg-35)', border: live ? '1px solid rgba(61,184,125,0.25)' : '1px solid var(--fg-10)' }}>{t('projects.status.' + d.status, d.status)}</span>
                    <span style={{ padding: '2px 8px', border: '1px solid var(--fg-08)', borderRadius: 999, fontSize: '0.62rem', fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--fg-18)' }}>{d.year}</span>
                  </div>
                  <h3 className="hero-heading" style={{ fontSize: isMobile ? 'clamp(1.3rem,7vw,2rem)' : 'clamp(1.3rem,4vw,3.8rem)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.03em', lineHeight: 1, margin: 0, color: 'rgb(100, 105, 115)' }}>{project.name}</h3>
                </div>
              </div>
              <a href={project.github} target="_blank" rel="noopener noreferrer"
                style={{ flexShrink: 0, borderRadius: 999, border: '1.5px solid var(--fg-18)', color: 'var(--fg)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', padding: isMobile ? '0.45rem 1rem' : '0.55rem 1.5rem', fontSize: isMobile ? '0.6rem' : '0.6rem', textDecoration: 'none', transition: 'all 0.25s', display: 'inline-flex', alignItems: 'center', gap: 5, background: 'transparent', whiteSpace: 'nowrap', alignSelf: 'flex-start' }}
                onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor = 'var(--fg-40)'; el.style.background = 'var(--fg-06)' }}
                onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = 'var(--fg-18)'; el.style.background = 'transparent' }}
              >GitHub <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg></a>
            </div>

            {/* Stack pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: isMobile ? '0.6rem' : 'clamp(0.8rem,2vw,1.5rem)' }}>
              {project.stack.split(' · ').map((tech: string) => <span key={tech} style={{ padding: '2px 8px', border: '1px solid var(--fg-08)', borderRadius: 999, fontSize: '0.62rem', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--fg-35)' }}>{tech}</span>)}
            </div>
            <div style={{ height: 1, background: 'linear-gradient(90deg,var(--fg-10),var(--fg-06) 70%,transparent)', marginBottom: isMobile ? '0.6rem' : 'clamp(0.8rem,2vw,1.5rem)' }} />

            {/* Content: images + text panel */}
            <div style={{ display: 'flex', gap: 'clamp(0.75rem,2vw,1.4rem)', flexDirection: 'row' }}>
              {!isMobile && <div style={{ flex: '0 0 clamp(140px,36%,40%)', display: 'flex', flexDirection: 'column', gap: 'clamp(0.5rem,1.2vw,0.9rem)' }}>
                <img src={project.tl} alt="" loading="lazy" style={{ width: '100%', objectFit: 'cover', objectPosition: 'top center', borderRadius: 'clamp(10px,1.6vw,20px)', height: 'clamp(120px,12vw,200px)', display: 'block', opacity: 0.88 }} />
                <img src={project.tl} alt="" loading="lazy" style={{ width: '100%', objectFit: 'cover', objectPosition: 'bottom center', borderRadius: 'clamp(10px,1.6vw,20px)', height: 'clamp(150px,17vw,270px)', display: 'block', opacity: 0.78 }} />
              </div>}
              <div style={{ flex: 1, minWidth: 0, borderRadius: isMobile ? 12 : 'clamp(10px,1.6vw,20px)', padding: isMobile ? '0.75rem' : 'clamp(1rem,2.2vw,1.8rem)', border: '1px solid var(--fg-06)', background: 'var(--fg-06)', display: 'flex', flexDirection: 'column', gap: isMobile ? '0.5rem' : 'clamp(0.7rem,1.5vw,1.1rem)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: '0.4rem' }}>
                    <div style={{ width: 14, height: 1, background: 'var(--fg-28)' }} />
                    <span style={{ fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--fg-35)' }}>{t('projects.labels.overview')}</span>
                  </div>
                  <p style={{ fontSize: 'clamp(0.76rem,1.2vw,0.93rem)', fontWeight: 300, lineHeight: 1.7, color: 'var(--fg)', margin: 0 }}>{d.desc}</p>
                </div>
                <div style={{ height: 1, background: 'linear-gradient(90deg,var(--fg-08),transparent)', flexShrink: 0 }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: '0.4rem' }}>
                    <div style={{ width: 14, height: 1, background: 'var(--fg-28)' }} />
                    <span style={{ fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--fg-35)' }}>{t('projects.labels.highlights')}</span>
                  </div>
                  <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    {highlights.map((h: string) => (
                      <li key={h} style={{ display: 'flex', alignItems: 'flex-start', gap: 7 }}>
                        <span style={{ marginTop: 6, width: 3, height: 3, borderRadius: '50%', background: 'var(--fg-35)', flexShrink: 0, display: 'inline-block' }} />
                        <span style={{ fontSize: 'clamp(0.72rem,1.1vw,0.86rem)', fontWeight: 300, lineHeight: 1.55, color: 'var(--fg)' }}>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default function ProjectsSection() {
  const { t } = useTranslation()
  const containerRef = useRef<HTMLDivElement>(null)
  const isMobile = useBreakpoint(640)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] })

  return (
    <section id="projects" ref={containerRef} style={{ position: 'relative', zIndex: 20, borderColor: 'var(--fg-06)' }} className="rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 w-full pt-20 sm:pt-24 md:pt-32 pb-4 sm:pb-24 md:pb-32 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-10 mb-10 sm:mb-16">
        <h2 className="hero-heading font-black uppercase leading-none tracking-tight text-center break-words px-4 w-full" style={{ fontSize: 'clamp(2rem,9.5vw,150px)', color: 'rgb(100, 105, 115)' }}>{ t('projects.heading') }</h2>
      </div>
      <div style={{ paddingBottom: isMobile ? '40vh' : '60vh' }}>
        {PROJECTS.map((p, i) => <ProjectCard key={p.num} project={p} index={i} isMobile={isMobile} scrollYProgress={scrollYProgress} />)}
      </div>
    </section>
  )
}

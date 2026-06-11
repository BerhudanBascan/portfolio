import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FadeIn from '../components/FadeIn'
import { useTranslation } from 'react-i18next'

const TAB_CONFIG = {
  work:      { id: "01", labelKey: "experience.tabs.work",      titleKey: "experience.titles.work",      color: "from-blue-500 to-indigo-600",   shadow: "shadow-blue-500/20",    bg: "bg-blue-500/10" },
  intern:    { id: "02", labelKey: "experience.tabs.intern",    titleKey: "experience.titles.intern",    color: "from-purple-500 to-pink-500",   shadow: "shadow-purple-500/20",  bg: "bg-purple-500/10" },
  certs:     { id: "03", labelKey: "experience.tabs.certs",     titleKey: "experience.titles.certs",     color: "from-emerald-500 to-teal-500",  shadow: "shadow-emerald-500/20", bg: "bg-emerald-500/10" },
  languages: { id: "04", labelKey: "experience.tabs.languages", titleKey: "experience.titles.languages", color: "from-orange-500 to-red-500",    shadow: "shadow-orange-500/20",  bg: "bg-orange-500/10" },
} as const;

type TabKey = keyof typeof TAB_CONFIG;

function getItemMeta(item: any, tabKey: TabKey) {
  let badge = '', title = '', sub = ''
  if (tabKey === 'work')      { badge = item.period; title = item.role;  sub = item.company && item.location ? item.company + ' · ' + item.location : item.company || '' }
  if (tabKey === 'intern')    { badge = item.type;   title = item.role;  sub = item.company && item.location ? item.company + ' · ' + item.location : item.company || '' }
  if (tabKey === 'certs')     { badge = item.year;   title = item.title; sub = item.issuer + (item.instructor ? ' · ' + item.instructor : '') }
  if (tabKey === 'languages') { badge = item.period; title = item.role;  sub = item.company }
  return { badge, title, sub }
}

/* ─── Desktop: compact selectable list item ─── */
function ListItem({ item, tabKey, isActive, color, onEnter }: {
  item: any; tabKey: TabKey; isActive: boolean; color: string; onEnter: () => void
}) {
  const { badge, title, sub } = getItemMeta(item, tabKey)
  return (
    <div
      onMouseEnter={onEnter}
      className={`group relative flex items-center gap-3 xl:gap-4 p-3 xl:p-4 rounded-xl border cursor-pointer transition-all duration-300 overflow-hidden ${
        isActive
          ? 'bg-[var(--fg-08)] border-[var(--fg-28)]'
          : 'bg-[var(--fg-06)]/30 border-[var(--fg-06)] hover:bg-[var(--fg-08)] hover:border-[var(--fg-18)]'
      }`}
    >
      {isActive && (
        <motion.div
          layoutId="listBeam"
          className={`absolute left-0 top-0 bottom-0 w-[3px] rounded-r-full bg-gradient-to-b ${color}`}
          transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
        />
      )}
      <div className="flex flex-col min-w-0 flex-1 ml-1">
        <span className="font-mono text-[9px] xl:text-[10px] tracking-[0.25em] uppercase text-[var(--fg-35)] mb-0.5">{badge}</span>
        <span className={`font-black text-[0.82rem] xl:text-[0.9rem] uppercase tracking-tight leading-tight transition-colors duration-300 ${isActive ? 'text-[var(--fg)]' : 'text-[var(--fg-40)] group-hover:text-[var(--fg)]'}`}>
          {title}
        </span>
        <span className="font-semibold text-[10px] xl:text-[11px] tracking-widest uppercase text-[var(--fg-28)] truncate mt-0.5">{sub}</span>
      </div>
      <div className={`w-1.5 h-1.5 rounded-full shrink-0 transition-all duration-300 ${isActive ? 'bg-white' : 'bg-[var(--fg-18)] group-hover:bg-[var(--fg-35)]'}`} />
    </div>
  )
}

/* ─── Desktop: fixed-height detail panel ─── */
function DetailPanel({ item, tabKey, color, t }: {
  item: any; tabKey: TabKey; color: string; t: (k: string) => string
}) {
  if (!item) return null
  const { badge, title, sub } = getItemMeta(item, tabKey)
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -10, filter: 'blur(8px)' }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="h-full flex flex-col gap-5 p-6 xl:p-8 rounded-2xl border bg-[var(--fg-06)]/40 border-[var(--fg-10)] overflow-hidden relative"
    >
      {/* Ambient glow */}
      <div className={`absolute top-0 right-0 w-48 h-48 rounded-full bg-gradient-to-bl ${color} opacity-[0.07] blur-3xl pointer-events-none`} />

      {/* Header */}
      <div>
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[0.65rem] font-mono tracking-[0.2em] uppercase bg-gradient-to-r ${color} text-white mb-3`}>
          {badge}
        </span>
        <h3 className="text-xl xl:text-2xl font-black uppercase tracking-tight leading-tight text-[var(--fg)] mb-1">{title}</h3>
        <p className="text-[0.72rem] xl:text-[0.78rem] font-semibold tracking-widest uppercase text-[var(--fg-35)]">{sub}</p>
      </div>

      <div className="h-[1px] w-full bg-gradient-to-r from-[var(--fg-18)] to-transparent" />

      {/* Body content */}
      <div className="flex flex-col gap-4 flex-1 overflow-hidden">
        {tabKey === 'work' && Array.isArray(item.bullets) && (
          <ul className="flex flex-col gap-2">
            {item.bullets.map((b: string, j: number) => (
              <li key={j} className="flex items-start gap-3 text-[0.75rem] xl:text-[0.8rem] leading-relaxed text-[var(--fg-40)]">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gradient-to-br from-white/60 to-white/20 shrink-0" />
                <span>{b}</span>
              </li>
            ))}
          </ul>
        )}
        {(tabKey === 'intern' || tabKey === 'languages') && (
          <p className="text-[0.78rem] xl:text-[0.83rem] leading-relaxed font-light text-[var(--fg-40)]">{item.desc}</p>
        )}
        {tabKey === 'certs' && item.link && (
          <a
            href={item.link} target="_blank" rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 text-[0.72rem] font-mono tracking-widest uppercase font-bold text-[var(--fg-40)] hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r ${color} transition-all duration-400 border-b border-[var(--fg-18)] pb-0.5 w-fit`}
          >
            {t('experience.view_cert') || 'View Certificate →'}
          </a>
        )}
      </div>

      {/* Stack tags */}
      {(tabKey === 'work' || tabKey === 'intern') && Array.isArray(item.stack) && (
        <div className="flex flex-wrap gap-1.5 pt-3 border-t border-[var(--fg-06)]">
          {item.stack.map((s: string) => (
            <span key={s} className="px-2.5 py-1 rounded-full border border-[var(--fg-10)] bg-[var(--fg-06)] text-[0.62rem] font-mono tracking-wider uppercase text-[var(--fg-40)]">{s}</span>
          ))}
        </div>
      )}
    </motion.div>
  )
}

/* ─── Mobile: accordion card ─── */
function MobileCard({ item, tabKey, isOpen, color, onToggle, t }: {
  item: any; tabKey: TabKey; isOpen: boolean; color: string; onToggle: () => void; t: (k: string) => string
}) {
  const { badge, title, sub } = getItemMeta(item, tabKey)
  return (
    <div
      onClick={onToggle}
      className={`group relative flex flex-col p-4 sm:p-5 rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer select-none ${
        isOpen
          ? 'bg-[var(--fg-08)] border-[var(--fg-28)] shadow-lg shadow-black/5'
          : 'bg-[var(--fg-06)]/20 border-[var(--fg-06)] hover:bg-[var(--fg-08)] hover:border-[var(--fg-18)]'
      }`}
    >
      {/* Top accent gradient line */}
      {isOpen && <div className={`absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r ${color}`} />}

      <div className="flex justify-between items-start gap-3 w-full">
        <div className="flex flex-col min-w-0 flex-1">
          {/* Badge (date/issuer) */}
          <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-[var(--fg-35)] mb-1.5 font-bold">
            {badge}
          </span>
          {/* Title */}
          <h4 className={`text-[0.92rem] sm:text-[1rem] font-black uppercase tracking-tight leading-tight transition-colors duration-300 ${
            isOpen ? 'text-[var(--fg)]' : 'text-[var(--fg-40)] group-hover:text-[var(--fg)]'
          }`}>
            {title}
          </h4>
          {/* Subtitle / Company */}
          <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase text-[var(--fg-28)] mt-1 truncate">
            {sub}
          </span>
        </div>

        {/* Plus / Minus indicator button */}
        <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border transition-all duration-300 shrink-0 ${
          isOpen ? `bg-gradient-to-tr ${color} border-transparent text-white` : 'border-[var(--fg-18)] text-[var(--fg)] opacity-55'
        }`}>
          <motion.div animate={{ rotate: isOpen ? 135 : 0 }} transition={{ type: 'spring', stiffness: 200, damping: 20 }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
              <path d="M12 5v14m-7-7h14" />
            </svg>
          </motion.div>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            {/* Content area */}
            <div className="pt-4 mt-4 border-t border-[var(--fg-10)] flex flex-col gap-3">
              {tabKey === 'work' && Array.isArray(item.bullets) && (
                <ul className="flex flex-col gap-2.5 pl-1">
                  {item.bullets.map((b: string, j: number) => (
                    <li key={j} className="flex items-start gap-2.5 text-[0.78rem] sm:text-[0.82rem] leading-relaxed text-[var(--fg-40)]">
                      <span className={`mt-2 w-1.5 h-1.5 rounded-full bg-gradient-to-r ${color} shrink-0 shadow-sm`} />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
              {(tabKey === 'intern' || tabKey === 'languages') && (
                <p className="text-[var(--fg-40)] text-[0.78rem] sm:text-[0.82rem] leading-relaxed font-light pl-1">{item.desc}</p>
              )}
              {tabKey === 'certs' && item.link && (
                <a href={item.link} target="_blank" rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono tracking-widest uppercase font-bold text-[var(--fg-40)] hover:text-white border-b border-[var(--fg-18)] pb-0.5 w-fit mt-1 ml-1`}>
                  {t('experience.view_cert') || 'View Certificate →'}
                </a>
              )}
              {(tabKey === 'work' || tabKey === 'intern') && Array.isArray(item.stack) && (
                <div className="flex flex-wrap gap-1.5 pt-3.5 mt-1 border-t border-[var(--fg-06)]">
                  {item.stack.map((s: string) => (
                    <span key={s} className="px-2.5 py-1 rounded-full border border-[var(--fg-10)] bg-[var(--fg-06)] text-[8px] font-mono tracking-wider uppercase text-[var(--fg-40)]">{s}</span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function ExperienceSection() {
  const { t } = useTranslation()
  const heading = t('experience.heading')
  const headingVw = Math.min(9.5, 90 / heading.length)
  const [activeTab, setActiveTab] = useState<TabKey>('work')
  const [selectedIdx, setSelectedIdx] = useState<number>(0)
  const [expandedCard, setExpandedCard] = useState<number | null>(null)
  const rawWork      = t('experience.work',        { returnObjects: true }); const safeWork      = Array.isArray(rawWork)      ? rawWork      as any[] : []
  const rawIntern    = t('experience.internships', { returnObjects: true }); const safeIntern    = Array.isArray(rawIntern)    ? rawIntern    as any[] : []
  const rawCerts     = t('experience.certs',       { returnObjects: true }); const safeCerts     = Array.isArray(rawCerts)     ? rawCerts     as any[] : []
  const rawLanguages = t('experience.languages',   { returnObjects: true }); const safeLanguages = Array.isArray(rawLanguages) ? rawLanguages as any[] : []

  const getTabItems = (key: TabKey) => {
    switch (key) {
      case 'work':      return safeWork
      case 'intern':    return safeIntern
      case 'certs':     return safeCerts
      case 'languages': return safeLanguages
      default:          return []
    }
  }

  const cfg = TAB_CONFIG[activeTab]

  const selectTab = (key: TabKey) => {
    setActiveTab(key)
    setSelectedIdx(0)
    setExpandedCard(null)
  }

  return (
    <section id="experience" className="relative text-[var(--fg)] py-16 sm:py-24 md:py-32 overflow-hidden z-20 border-t" style={{ borderColor: 'var(--fg-06)' }}>
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className={`absolute top-[40%] right-[-10%] w-[400px] sm:w-[700px] lg:w-[900px] h-[400px] sm:h-[700px] lg:h-[900px] rounded-full blur-[120px] sm:blur-[180px] opacity-20 dark:opacity-40 transition-all duration-1000 ${cfg.bg}`} />
        <div className={`absolute bottom-[-10%] left-[-10%] w-[400px] sm:w-[700px] lg:w-[1000px] h-[400px] sm:h-[700px] lg:h-[1000px] rounded-full blur-[120px] sm:blur-[200px] opacity-15 dark:opacity-30 transition-all duration-1000 ${cfg.bg}`} />
      </div>

      <div className="relative z-10 w-full max-w-[1500px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col">
        <FadeIn delay={0} y={40}>
          <h2
            className="hero-heading font-black uppercase leading-none tracking-tight mb-10 sm:mb-16 md:mb-20 text-center whitespace-nowrap px-4 w-full"
            style={{ fontSize: `clamp(2rem,${headingVw}vw,150px)`, color: 'rgb(100,105,115)' }}
          >
            {heading}
          </h2>
        </FadeIn>

        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 lg:gap-14 xl:gap-20 w-full">

          {/* ── Tab nav: grid structure on mobile (no arrows to save horizontal space) ── */}
          <nav className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 lg:hidden shrink-0">
            {(Object.keys(TAB_CONFIG) as TabKey[]).map((key) => {
              const isActive = activeTab === key
              const tab = TAB_CONFIG[key]
              return (
                <button key={key} onClick={() => selectTab(key)}
                  className={`group relative flex items-center justify-between gap-2 p-3 sm:p-4 lg:p-5 rounded-2xl transition-all duration-500 overflow-hidden text-left border ${
                    isActive
                      ? `bg-[var(--fg-06)] border-[var(--fg-18)] shadow-lg ${tab.shadow}`
                      : `bg-transparent border-[var(--fg-06)] hover:bg-[var(--fg-06)] hover:border-[var(--fg-12)]`
                  }`}
                >
                  {isActive && (
                    <motion.div layoutId="tabBeam"
                      className={`absolute left-0 top-0 bottom-0 w-1 lg:w-1.5 bg-gradient-to-b ${tab.color} hidden lg:block`}
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.8 }}
                    />
                  )}
                  {isActive && (
                    <motion.div layoutId="tabBeamH"
                      className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${tab.color} lg:hidden`}
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.8 }}
                    />
                  )}
                  <div className="relative z-10 flex flex-col gap-0.5 lg:ml-2 min-w-0 flex-1">
                    <span className={`font-mono text-[7px] sm:text-[9px] tracking-[0.3em] font-bold transition-colors duration-500 ${isActive ? 'text-[var(--fg)]' : 'text-[var(--fg-35)]'}`}>
                      {tab.id}
                    </span>
                    <span className={`text-[0.74rem] sm:text-[0.85rem] lg:text-[1rem] xl:text-[1.2rem] font-black tracking-tight uppercase leading-tight transition-colors duration-500 ${isActive ? 'text-[var(--fg)]' : 'text-[var(--fg-40)] group-hover:text-[var(--fg)]'}`}>
                      {t(tab.labelKey)}
                    </span>
                  </div>
                  <div className={`relative z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center transition-all duration-500 shrink-0 lg:flex hidden ${
                    isActive
                      ? `bg-gradient-to-tr ${tab.color} text-white border-transparent rotate-90`
                      : `border-[var(--fg-10)] text-[var(--fg-35)] group-hover:border-[var(--fg-28)] group-hover:text-[var(--fg)]`
                  }`}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                    </svg>
                  </div>
                </button>
              )
            })}
          </nav>

          {/* ── Tab nav on desktop: vertical sidebar ── */}
          <nav className="hidden lg:grid lg:w-[240px] xl:w-[280px] lg:grid-cols-1 gap-3 lg:sticky lg:top-24 lg:self-start shrink-0">
            {(Object.keys(TAB_CONFIG) as TabKey[]).map((key) => {
              const isActive = activeTab === key
              const tab = TAB_CONFIG[key]
              return (
                <button key={key} onClick={() => selectTab(key)}
                  className={`group relative flex items-center justify-between gap-1.5 sm:gap-2 p-5 rounded-2xl transition-all duration-500 overflow-hidden text-left border ${
                    isActive
                      ? `bg-[var(--fg-06)] border-[var(--fg-18)] shadow-lg ${tab.shadow}`
                      : `bg-transparent border-[var(--fg-06)] hover:bg-[var(--fg-06)] hover:border-[var(--fg-12)]`
                  }`}
                >
                  {isActive && (
                    <motion.div layoutId="tabBeam"
                      className={`absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b ${tab.color}`}
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.8 }}
                    />
                  )}
                  <div className="relative z-10 flex flex-col gap-0.5 lg:ml-2 min-w-0 flex-1">
                    <span className={`font-mono text-[9px] tracking-[0.3em] font-bold transition-colors duration-500 ${isActive ? 'text-[var(--fg)]' : 'text-[var(--fg-35)]'}`}>
                      {tab.id}
                    </span>
                    <span className={`text-[1rem] xl:text-[1.2rem] font-black tracking-tight uppercase leading-tight transition-colors duration-500 ${isActive ? 'text-[var(--fg)]' : 'text-[var(--fg-40)] group-hover:text-[var(--fg)]'}`}>
                      {t(tab.labelKey)}
                    </span>
                  </div>
                  <div className={`relative z-10 w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-500 shrink-0 ${
                    isActive
                      ? `bg-gradient-to-tr ${tab.color} text-white border-transparent rotate-90 ${tab.shadow}`
                      : `border-[var(--fg-10)] text-[var(--fg-35)] group-hover:border-[var(--fg-28)] group-hover:text-[var(--fg)] group-hover:scale-110`
                  }`}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                    </svg>
                  </div>
                </button>
              )
            })}
          </nav>

          {/* ── Content area ── */}
          <div className="w-full lg:flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="flex flex-col w-full"
              >
                <div className="mb-6 sm:mb-8 md:mb-10">
                  <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-[var(--fg)] tracking-tight uppercase leading-none">
                    {t(cfg.titleKey)}
                  </h3>
                </div>

                {/* Desktop: compact list (left) + fixed detail panel (right) — zero layout shift */}
                <div className="hidden lg:flex gap-5 xl:gap-6 w-full">
                  {/* Compact list */}
                  <div className="w-[42%] shrink-0 flex flex-col gap-2">
                    {getTabItems(activeTab).map((item, idx) => (
                      <ListItem
                        key={idx}
                        item={item}
                        tabKey={activeTab}
                        isActive={selectedIdx === idx}
                        color={cfg.color}
                        onEnter={() => setSelectedIdx(idx)}
                      />
                    ))}
                  </div>
                  {/* Fixed detail panel */}
                  <div className="flex-1 min-h-[320px] xl:min-h-[360px]">
                    <AnimatePresence mode="wait">
                      <DetailPanel
                        key={`${activeTab}-${selectedIdx}`}
                        item={getTabItems(activeTab)[selectedIdx]}
                        tabKey={activeTab}
                        color={cfg.color}
                        t={t}
                      />
                    </AnimatePresence>
                  </div>
                </div>

                {/* Mobile: accordion (click to expand) */}
                <div className="flex flex-col gap-3.5 w-full lg:hidden">
                  {getTabItems(activeTab).map((item, idx) => (
                    <MobileCard
                      key={idx}
                      item={item}
                      tabKey={activeTab}
                      isOpen={expandedCard === idx}
                      color={cfg.color}
                      onToggle={() => setExpandedCard(prev => prev === idx ? null : idx)}
                      t={t}
                    />
                  ))}
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  )
}

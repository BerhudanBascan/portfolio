import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const PORTRAIT_URL = '/images/berhudan.png'
const B = '#D7E2EA'

export default function LoadingScreen({ onDone }: { onDone: () => void }) {
  const { t } = useTranslation()
  const [phase, setPhase] = useState<'in' | 'hold' | 'out'>('in')
  const [imgLoaded, setImgLoaded] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const t1 = setTimeout(() => setPhase('hold'), 600)
    const t2 = setTimeout(() => setPhase('out'), 3100)
    const t3 = setTimeout(() => { document.body.style.overflow = ''; onDone() }, 3900)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); document.body.style.overflow = '' }
  }, [onDone])

  return (
    <AnimatePresence>
      {phase !== 'out' ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] } }}
          style={{ position: 'fixed', inset: 0, zIndex: 9999, backgroundColor: '#0C0C0C', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 0 }}
        >
          <motion.div
            initial={{ y: 32, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } }}
            style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 220, height: 120, background: 'radial-gradient(ellipse at 50% 100%, rgba(215,226,234,0.13) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <motion.img
              src={PORTRAIT_URL}
              alt="avatar"
              onLoad={() => setImgLoaded(true)}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              style={{ width: 160, height: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 24px 48px rgba(0,0,0,0.7))', display: 'block', position: 'relative', zIndex: 1, opacity: imgLoaded ? 1 : 0, transition: 'opacity 0.5s ease' }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] } }}
            style={{ marginTop: 28, textAlign: 'center' }}
          >
            <span style={{ color: B, fontFamily: 'inherit', fontSize: 'clamp(2rem, 6vw, 3.5rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1 }}>
              {t('loading.hey')}
            </span>
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
              style={{ display: 'inline-block', width: '3px', height: '0.85em', background: B, marginLeft: 4, verticalAlign: 'middle', borderRadius: 2, opacity: 0.7 }}
            />
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.9, duration: 0.4 } }} style={{ marginTop: 52 }}>
            <LoaderDots />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

function LoaderDots() {
  return (
    <div style={{ position: 'relative', width: 200, height: 60 }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ width: 14, height: 14, position: 'absolute', borderRadius: '50%', backgroundColor: B, left: i === 2 ? 'auto' : `${i === 0 ? 15 : 45}%`, right: i === 2 ? '15%' : 'auto', transformOrigin: '50%', animation: `ls_circle 0.5s ${i * 0.15}s alternate infinite ease` }} />
      ))}
      {[0, 1, 2].map((i) => (
        <div key={`s${i}`} style={{ width: 14, height: 4, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', position: 'absolute', top: 62, left: i === 2 ? 'auto' : `${i === 0 ? 15 : 45}%`, right: i === 2 ? '15%' : 'auto', transformOrigin: '50%', zIndex: -1, filter: 'blur(1px)', animation: `ls_shadow 0.5s ${i * 0.15}s alternate infinite ease` }} />
      ))}
      <style>{`
        @keyframes ls_circle { 0%{top:60px;height:5px;border-radius:50px 50px 25px 25px;transform:scaleX(1.5)} 40%{height:14px;border-radius:50%;transform:scaleX(1)} 100%{top:0%} }
        @keyframes ls_shadow { 0%{transform:scaleX(1.5)} 40%{transform:scaleX(1);opacity:.7} 100%{transform:scaleX(.2);opacity:.4} }
      `}</style>
    </div>
  )
}

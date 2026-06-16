import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const PORTRAIT_URL = '/images/berhudan.png'
const B = '#D7E2EA'

export default function LoadingScreen({ onDone }: { onDone: () => void }) {
  const { t } = useTranslation()
  const [phase, setPhase] = useState<'in' | 'hold' | 'out'>('in')
  const [imgLoaded, setImgLoaded] = useState(false)
  const [percent, setPercent] = useState(0)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const t1 = setTimeout(() => setPhase('hold'), 600)
    const t2 = setTimeout(() => setPhase('out'), 3100)
    const t3 = setTimeout(() => { document.body.style.overflow = ''; onDone() }, 3900)
    
    // Yüzdelik sayaç
    let p = 0;
    const pInterval = setInterval(() => {
      p += Math.floor(Math.random() * 3) + 1;
      if (p > 100) p = 100;
      setPercent(p);
      if (p === 100) clearInterval(pInterval);
    }, 25);

    return () => { 
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); 
      clearInterval(pInterval);
      document.body.style.overflow = '' 
    }
  }, [onDone])

  // Dairesel rozet metni (Güncellendi)
  const textStr = "SOFTWARE DEVELOPER • BERHUDAN BASCAN • "
  
  return (
    <AnimatePresence>
      {phase !== 'out' ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ 
            opacity: 0, 
            scale: 1.1, 
            filter: "blur(20px)",
            transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } 
          }}
          style={{ 
            position: 'fixed', inset: 0, zIndex: 9999, 
            backgroundColor: '#050505', 
            display: 'flex', flexDirection: 'column', 
            alignItems: 'center', justifyContent: 'center', 
            overflow: 'hidden',
          }}
        >
          {/* ULTRA WOW: Sinematik Siyah Barlar (Çıkışta açılacaklar) */}
          <motion.div
            exit={{ y: '-100%', transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } }}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '8vh', background: '#000', zIndex: 10, pointerEvents: 'none' }}
          />
          <motion.div
            exit={{ y: '100%', transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } }}
            style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '8vh', background: '#000', zIndex: 10, pointerEvents: 'none' }}
          />

          {/* Arka Planda Kayan Devasa Tipografi */}
          <motion.div
            initial={{ x: '-5%' }}
            animate={{ x: '-50%' }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            style={{
              position: 'absolute', top: '50%', left: 0,
              transform: 'translateY(-50%)',
              whiteSpace: 'nowrap', pointerEvents: 'none',
              fontSize: '25vw', fontWeight: 900, lineHeight: 1,
              color: 'transparent',
              WebkitTextStroke: `1px rgba(215, 226, 234, 0.15)`, // Görünürlüğü artırıldı (0.04 -> 0.15)
              zIndex: 0
            }}
          >
            SOFTWARE DEVELOPER SOFTWARE DEVELOPER SOFTWARE DEVELOPER
          </motion.div>

          {/* Arka Plan Aurora / Spot Işığı */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.15, 0.08] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute', width: '60vw', height: '60vw', maxWidth: 800, maxHeight: 800,
              background: `radial-gradient(circle at center, ${B} 0%, transparent 60%)`,
              filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0
            }}
          />

          {/* Köşe Teknoloji Verileri */}
          <div style={{ position: 'absolute', top: '10vh', left: 32, color: B, opacity: 0.3, fontSize: '0.65rem', fontFamily: 'monospace', letterSpacing: '0.15em', zIndex: 1 }}>
            SYS.INIT // 2024<br/>
            VER. 2.0.0<br/>
            [LOADING_SEQ]
          </div>
          <div style={{ position: 'absolute', bottom: '10vh', right: 32, color: B, opacity: 0.3, fontSize: '0.65rem', fontFamily: 'monospace', textAlign: 'right', letterSpacing: '0.15em', zIndex: 1 }}>
            LAT_41.0082_N<br/>
            LON_28.9784_E<br/>
            NETWORK_OK
          </div>

          {/* Merkez: Avatar ve ULTRA 3D Jiroskopik Yörünge */}
          <motion.div
            initial={{ scale: 0.8, filter: 'blur(15px)', opacity: 0 }}
            animate={{ scale: 1, filter: 'blur(0px)', opacity: 1 }}
            transition={{ duration: 1.2, type: 'spring', bounce: 0.3 }}
            style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, perspective: 1200 }}
          >
            {/* Dairesel Dönen Metin (Dış Rozet) */}
            <motion.div
              animate={{ rotateZ: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              style={{ position: 'absolute', width: 340, height: 340, opacity: 0.4, zIndex: 1 }}
            >
              <svg viewBox="0 0 100 100" width="100%" height="100%">
                <path id="circlePath" d="M 50, 50 m -40, 0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0" fill="none" />
                <text fontSize="5.5" fill={B} letterSpacing="0.25em" fontWeight="300">
                  <textPath href="#circlePath" startOffset="0%">
                    {textStr}
                  </textPath>
                </text>
              </svg>
            </motion.div>

            {/* ULTRA WOW: 3 Boyutlu (3D) Jiroskopik Halkalar */}
            <motion.div style={{ position: 'absolute', width: 280, height: 280, zIndex: 1, transformStyle: 'preserve-3d' }}>
              {/* Düz Halka */}
              <motion.svg animate={{ rotateZ: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} style={{ position: 'absolute', inset: 0, opacity: 0.2 }} viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="48" fill="none" stroke={B} strokeWidth="0.2" strokeDasharray="1 3" />
              </motion.svg>
              {/* X Ekseninde Eğik Halka (Tilted X) */}
              <motion.svg animate={{ rotateZ: -360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} style={{ position: 'absolute', inset: 0, opacity: 0.5, transform: 'rotateX(65deg)' }} viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="48" fill="none" stroke={B} strokeWidth="0.5" strokeDasharray="10 20" />
                <circle cx="50" cy="50" r="44" fill="none" stroke={B} strokeWidth="1" strokeDasharray="2 98" />
              </motion.svg>
              {/* Y Ekseninde Eğik Halka (Tilted Y) */}
              <motion.svg animate={{ rotateZ: 360 }} transition={{ duration: 18, repeat: Infinity, ease: "linear" }} style={{ position: 'absolute', inset: 0, opacity: 0.3, transform: 'rotateY(65deg)' }} viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="48" fill="none" stroke={B} strokeWidth="0.4" strokeDasharray="30 70" />
              </motion.svg>
            </motion.div>

            {/* Ana Avatar */}
            <motion.div style={{ position: 'relative', zIndex: 2 }}>
              <motion.img
                src={PORTRAIT_URL}
                alt="avatar"
                onLoad={() => setImgLoaded(true)}
                animate={{ y: [-8, 8, -8] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                style={{ 
                  width: 150, height: 'auto', objectFit: 'contain', 
                  filter: `drop-shadow(0 20px 40px rgba(0,0,0,0.9)) drop-shadow(0 0 20px rgba(215,226,234,0.2))`, 
                  opacity: imgLoaded ? 1 : 0, transition: 'opacity 0.8s ease' 
                }}
              />
            </motion.div>
          </motion.div>

          {/* Alt Kısım: Ultra Premium Sayaç */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ marginTop: 80, display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 }}
          >
            {/* Holografik (RGB Split) Efektli Dev Yüzdelik Sayaç */}
            <div style={{ display: 'flex', alignItems: 'flex-start', color: '#FFF', lineHeight: 0.8, marginBottom: 20, textShadow: '2px 0px 4px rgba(0,255,255,0.2), -2px 0px 4px rgba(255,0,255,0.2)' }}>
              <span style={{ fontSize: 'clamp(3.5rem, 7vw, 5rem)', fontWeight: 300, letterSpacing: '-0.04em', fontVariantNumeric: 'tabular-nums' }}>
                {percent.toString().padStart(3, '0')}
              </span>
              <span style={{ fontSize: 'clamp(1rem, 2vw, 1.5rem)', opacity: 0.4, marginLeft: 4, fontWeight: 300 }}>%</span>
            </div>

            {/* Yanıp Sönen İmleçli "Hey" Yazısı */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ 
                color: B, opacity: 0.8,
                fontFamily: 'inherit', fontSize: 'clamp(0.85rem, 2vw, 1.1rem)', 
                fontWeight: 400, letterSpacing: '0.5em', textTransform: 'uppercase' 
              }}>
                {t('loading.hey')}
              </span>
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                style={{ display: 'inline-block', width: '14px', height: '4px', background: B, marginLeft: 16, opacity: 0.8, boxShadow: `0 0 10px ${B}` }}
              />
            </div>
            
            {/* Neon Şarj İlerleme Çubuğu */}
            <div style={{ width: 240, height: 2, background: 'rgba(215,226,234,0.05)', marginTop: 28, position: 'relative', overflow: 'hidden', borderRadius: 2 }}>
              <motion.div 
                style={{ 
                  position: 'absolute', top: 0, left: 0, bottom: 0, 
                  background: `linear-gradient(90deg, transparent, ${B})`,
                  boxShadow: `0 0 10px ${B}`
                }}
                animate={{ width: `${percent}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

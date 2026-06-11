import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useIsTouch } from '../hooks/useBreakpoint'

const SKILLS = [
  {
    num: 1, id: 'c1', rarity: 'Language', name: 'TypeScript',
    s1v: 'ES6+', s1l: 'JS', s2v: 'Type', s2l: 'Safe',
    desc: 'Primary language for full-stack development. Powers <span class="hl">React, Next.js, Node.js</span>, and <span class="hl">Express</span> codebases with type-safe, scalable architecture.',
    theme: '#00f2ff', accent: '#0055ff', font: '"Space Grotesk", sans-serif',
    rx: '12deg', ry: '-12deg', rot: '-45deg', tx: '15px', ty: '15px', op: '0.6'
  },
  {
    num: 2, id: 'c2', rarity: 'Backend', name: 'Node.js',
    s1v: 'REST', s1l: 'API', s2v: 'WS', s2l: 'RT',
    desc: 'Backend systems with <span class="hl">Node.js, Express.js</span>, RESTful APIs, and Firebase Functions. Builds performant server-side services deployed in production.',
    theme: '#00ff88', accent: '#006622', font: '"Space Grotesk", sans-serif',
    rx: '15deg', ry: '0deg', rot: '0deg', tx: '0px', ty: '15px', op: '0.4'
  },
  {
    num: 3, id: 'c3', rarity: 'Frontend', name: 'React & Next.js',
    s1v: 'SPA', s1l: 'App', s2v: 'SSR', s2l: 'Next',
    desc: 'Component-driven UI with <span class="hl">React.js</span> and <span class="hl">Next.js</span>. Tailwind CSS, HTML5, and CSS3 for responsive, high-performance web applications.',
    theme: '#61dafb', accent: '#0a7ea4', font: '"Cinzel", serif',
    rx: '12deg', ry: '12deg', rot: '45deg', tx: '-15px', ty: '15px', op: '0.6'
  },
  {
    num: 4, id: 'c4', rarity: 'Automation', name: 'Python',
    s1v: 'ML', s1l: 'Data', s2v: 'Auto', s2l: 'Bot',
    desc: 'Scripting, data pipelines, and automation. <span class="hl">Pandas</span> and <span class="hl">NumPy</span> for analysis and cleaning; <span class="hl">FastAPI</span> and Flask for backend; LangChain for AI workflows.',
    theme: '#ff00ea', accent: '#7000ff', font: '"JetBrains Mono", monospace',
    rx: '0deg', ry: '-15deg', rot: '-90deg', tx: '20px', ty: '0px', op: '0.5'
  },
  {
    num: 5, id: 'c5', rarity: 'Core Stack', name: 'Full-Stack Dev',
    s1v: '14+', s1l: 'Proj', s2v: '4+', s2l: 'Yrs',
    desc: 'End-to-end product engineering — <span class="hl">Python, TypeScript, React, Node.js</span>, PostgreSQL, MongoDB, Docker, and Flutter. Architecture to live deployment.',
    theme: '#ffffff', accent: '#94a3b8', font: '"Space Grotesk", sans-serif',
    rx: '0deg', ry: '0deg', rot: '0deg', tx: '0px', ty: '0px', op: '0.1'
  },
  {
    num: 6, id: 'c6', rarity: 'Databases', name: 'Postgres & Mongo',
    s1v: 'SQL', s1l: 'NoSQL', s2v: 'RLS', s2l: 'Auth',
    desc: 'Database design across <span class="hl">MongoDB, PostgreSQL, MySQL</span>, and <span class="hl">Supabase</span>. Row-level security, real-time subscriptions, and production-grade migrations.',
    theme: '#f5a623', accent: '#c47800', font: '"Cinzel", serif',
    rx: '0deg', ry: '15deg', rot: '90deg', tx: '-20px', ty: '0px', op: '0.5'
  },
  {
    num: 7, id: 'c7', rarity: 'Mobile', name: 'Flutter',
    s1v: 'iOS', s1l: '+And', s2v: 'Dart', s2l: 'SDK',
    desc: 'Production Flutter app deployed at MKG. Real-time personnel tracking with <span class="hl">Supabase backend</span>, iOS widget, 17 languages — used daily in the field.',
    theme: '#0080ff', accent: '#00ffff', font: '"Cinzel", serif',
    rx: '-12deg', ry: '-12deg', rot: '-135deg', tx: '15px', ty: '-15px', op: '0.6'
  },
  {
    num: 8, id: 'c8', rarity: 'Analytics', name: 'Pandas & NumPy',
    s1v: 'EDA', s1l: 'Vis', s2v: 'ETL', s2l: 'Pipe',
    desc: 'Data analysis and cleaning pipelines. <span class="hl">Pandas</span> and <span class="hl">NumPy</span> for research, business intelligence, and AI feature engineering workflows.',
    theme: '#3ddc84', accent: '#228b22', font: '"Space Grotesk", sans-serif',
    rx: '-15deg', ry: '0deg', rot: '180deg', tx: '0px', ty: '-15px', op: '0.4'
  },
  {
    num: 9, id: 'c9', rarity: 'DevOps', name: 'Docker & Git',
    s1v: 'CI', s1l: 'CD', s2v: 'Hub', s2l: 'Acts',
    desc: 'Containerized deployments with <span class="hl">Docker</span> and <span class="hl">GitHub Actions CI/CD</span>. Multi-service orchestration, environment parity, and automated release pipelines.',
    theme: '#7000ff', accent: '#ff0033', font: '"Cinzel", serif',
    rx: '-12deg', ry: '12deg', rot: '135deg', tx: '-15px', ty: '-15px', op: '0.6'
  }
];

const SkillsCard = () => {
  const { t } = useTranslation()
  const [activeSkillNum, setActiveSkillNum] = useState<number>(5);
  const isTouch = useIsTouch(1024);

  useEffect(() => {
    if (!isTouch) return;

    const interval = setInterval(() => {
      setActiveSkillNum(prev => (prev === 9 ? 1 : prev + 1));
    }, 3500);

    return () => clearInterval(interval);
  }, [isTouch]);

  const handleCardClick = (e: React.MouseEvent) => {
    if (isTouch) {
      e.preventDefault();
      e.stopPropagation();
      setActiveSkillNum(prev => (prev === 9 ? 1 : prev + 1));
    }
  };

  const TRANSLATED = SKILLS.map(s => ({ ...s, desc: t(`skills.cards.${s.id}`, s.desc) }))

  return (
    <div className="skills-card-wrapper relative flex justify-center items-center overflow-visible mx-auto">
      <div 
        className="scale-container transform scale-[0.5] sm:scale-[0.6] md:scale-[0.7] lg:scale-[0.8] transition-transform duration-500 origin-center absolute"
        onClick={handleCardClick}
      >
        <div className="body sk-body relative" style={{ position: 'relative' }}>
          <div className="aura" />
          <div className={`anchor ${activeSkillNum !== null ? `active-card-${activeSkillNum}` : ''}`}>
            <div className="sensors">
              {TRANSLATED.map(s => (
                <div key={s.id} className={`p${s.num}`} />
              ))}
            </div>
            <div className="relic-chassis">
              <div className="orb-base">
                <div className="scanline-layer" />
                <div className="glare-surface" />
                <div className="orbital-ring ring-1" />
                <div className="orbital-ring ring-2" />
              </div>
              <div className="core-sphere">
                <div style={{position: 'absolute', inset: 0, border: '1px solid rgba(255,255,255,0.2)', borderRadius: '50%', transform: 'scale(1.2)'}} />
              </div>
              <div className="ui-arc">
                {TRANSLATED.map(s => (
                  <div key={s.id} className={`orb-content ${s.id}`}>
                    <header className="name-arc">
                      <span className="rarity-token">{s.rarity}</span>
                      <p className="hero-name">{s.name}</p>
                    </header>
                    <div className="stats-hub">
                      <div className="stat-circle">
                        <span className="s-v">{s.s1v}</span><span className="s-l">{s.s1l}</span>
                      </div>
                      <div className="stat-circle">
                        <span className="s-v">{s.s2v}</span><span className="s-l">{s.s2l}</span>
                      </div>
                    </div>
                    <div className="ability-capsule">
                      <p dangerouslySetInnerHTML={{ __html: s.desc }} />
                    </div>
                    <div className="cost-dial">{String(s.num).padStart(2, '0')}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: SKILLS_CARD_CSS}} />
    </div>
  );
}

const DYNAMIC_STYLES = SKILLS.map(s => `
  .skills-card-wrapper .anchor:has(.p${s.num}:hover),
  .skills-card-wrapper .anchor:not(:has(.sensors div:hover)).active-card-${s.num} {
    --theme: ${s.theme};
    --accent: ${s.accent};
    --font-main: ${s.font};
    --rx: ${s.rx};
    --ry: ${s.ry};
    --ring-rot: ${s.rot};
    --tx: ${s.tx};
    --ty: ${s.ty};
    --op: ${s.op};
  }
  .skills-card-wrapper .anchor:has(.p${s.num}:hover) .${s.id},
  .skills-card-wrapper .anchor:not(:has(.sensors div:hover)).active-card-${s.num} .${s.id} {
    display: flex;
    opacity: 1;
  }
`).join('\n');

const SKILLS_CARD_CSS = `
        .skills-card-wrapper {
          width: 210px;
          height: 290px;
          transition: width 0.5s, height 0.5s;
        }
        @media (min-width: 640px) {
          .skills-card-wrapper {
            width: 252px;
            height: 348px;
          }
        }
        @media (min-width: 768px) {
          .skills-card-wrapper {
            width: 294px;
            height: 406px;
          }
        }
        @media (min-width: 1024px) {
          .skills-card-wrapper {
            width: 336px;
            height: 464px;
          }
        }

        .skills-card-wrapper .scale-container {
          width: 420px;
          height: 580px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .skills-card-wrapper .sk-body {
          --bg: transparent;
          --theme: #ffffff;
          --accent: rgba(255, 255, 255, 0.4);
          --font-main: "Space Grotesk", sans-serif;
          --rx: 0deg;
          --ry: 0deg;
          --tx: 0px;
          --ty: 0px;
          --ring-rot: 0deg;
          --scale: 1;
          --op: 0.1;
          --blur: blur(20px);

          margin: 0;
          background: transparent;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          overflow: visible;
          font-family: var(--font-main);
        }

        .skills-card-wrapper .anchor {
          position: relative;
          width: 420px;
          height: 580px;
          perspective: 2000px;
          user-select: none;
        }

        .skills-card-wrapper .sensors {
          position: absolute;
          inset: -120px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: repeat(3, 1fr);
          z-index: 10000;
        }

        .skills-card-wrapper .sensors > div {
          cursor: crosshair;
        }

        .skills-card-wrapper .orb-content {
          display: none;
          opacity: 0;
          transition: opacity 0.5s ease;
          flex-direction: column;
          height: 100%;
        }

        /* Default visible card is c5 */
        .skills-card-wrapper .anchor:not(:has(.sensors div:hover)):not([class*="active-card-"]) .c5 {
          display: flex;
          opacity: 1;
        }

        ${DYNAMIC_STYLES}

        .skills-card-wrapper .relic-chassis {
          position: relative;
          width: 100%;
          height: 100%;
          transform: rotateX(var(--rx)) rotateY(var(--ry));
          transition: transform 1s cubic-bezier(0.1, 0.8, 0.2, 1);
          transform-style: preserve-3d;
        }

        .skills-card-wrapper .orb-base {
          position: absolute;
          inset: 0;
          background: rgba(2, 3, 8, 0.95);
          border-radius: 50% 50% 10% 10% / 40% 40% 5% 5%;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 40px 100px rgba(0, 0, 0, 0.9);
          overflow: hidden;
        }

        .skills-card-wrapper .orbital-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          border-radius: 50%;
          border: 1px solid transparent;
          transform-style: preserve-3d;
          transition:
            transform 1.2s cubic-bezier(0.1, 0.9, 0.3, 1),
            border-color 0.6s ease;
        }

        .skills-card-wrapper .ring-1 {
          width: 480px;
          height: 480px;
          margin: -240px;
          border-top: 2px solid var(--theme);
          border-left: 2px solid var(--theme);
          transform: translateZ(-20px) rotate(calc(var(--ring-rot) * 0.5));
          opacity: 0.2;
        }

        .skills-card-wrapper .ring-2 {
          width: 320px;
          height: 320px;
          margin: -160px;
          border: 2px solid var(--theme);
          clip-path: polygon(0 0, 100% 0, 100% 30%, 0 30%);
          transform: translateZ(40px) rotate(calc(var(--ring-rot) * -1));
          opacity: 0.6;
        }

        .skills-card-wrapper .core-sphere {
          position: absolute;
          top: 200px;
          left: 50%;
          width: 160px;
          height: 160px;
          margin-left: -80px;
          background: radial-gradient(circle at 30% 30%, var(--theme), #000);
          border-radius: 50%;
          transform: translateZ(80px);
          box-shadow:
            0 0 50px var(--theme),
            inset -20px -20px 50px rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: sphereFloat 6s ease-in-out infinite alternate;
        }

        @keyframes sphereFloat {
          0% {
            transform: translateZ(80px) translateY(0);
          }
          100% {
            transform: translateZ(100px) translateY(-10px);
          }
        }

        .skills-card-wrapper .ui-arc {
          position: absolute;
          inset: 20px;
          display: flex;
          flex-direction: column;
          transform: translateZ(120px) translate(var(--tx), var(--ty));
          transition: transform 0.9s cubic-bezier(0.1, 0.9, 0.2, 1);
          pointer-events: none;
        }

        .skills-card-wrapper .name-arc {
          padding-top: 300px;
          text-align: center;
        }

        .skills-card-wrapper .rarity-token {
          font-size: 0.6rem;
          font-weight: 900;
          color: var(--theme);
          letter-spacing: 5px;
          text-transform: uppercase;
          margin-bottom: 8px;
          display: block;
        }

        .skills-card-wrapper .hero-name {
          font-size: 2rem;
          font-weight: 900;
          text-transform: uppercase;
          margin: 0;
          color: #fff;
        }

        .skills-card-wrapper .stats-hub {
          display: flex;
          justify-content: space-around;
          margin-top: 25px;
          padding: 15px;
          background: rgba(255,255,255,0.05);
          backdrop-filter: var(--blur);
          border-radius: 100px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .skills-card-wrapper .stat-circle {
          text-align: center;
        }

        .skills-card-wrapper .s-v {
          display: block;
          font-size: 1.4rem;
          font-weight: 900;
          color: #fff;
          line-height: 1;
        }
        .skills-card-wrapper .s-l {
          font-size: 0.5rem;
          color: #64748b;
          text-transform: uppercase;
          font-weight: 800;
          letter-spacing: 2px;
        }

        .skills-card-wrapper .ability-capsule {
          margin-top: 20px;
          background: rgba(0, 0, 0, 0.7);
          border-bottom: 3px solid var(--theme);
          padding: 20px;
          border-radius: 20px;
          backdrop-filter: blur(30px);
          transition: border-color 0.6s ease;
        }

        .skills-card-wrapper .ability-capsule p {
          margin: 0;
          font-size: 0.9rem;
          line-height: 1.6;
          color: #cbd5e1;
          font-family: var(--font-main);
        }

        .skills-card-wrapper .hl {
          color: #fff;
          font-weight: 700;
          text-shadow: 0 0 10px var(--theme);
        }

        .skills-card-wrapper .aura {
          position: absolute;
          inset: -50%;
          background: radial-gradient(
            circle at center,
            var(--theme) 0%,
            transparent 70%
          );
          opacity: var(--op);
          filter: blur(150px);
          pointer-events: none;
          z-index: -1;
          transition:
            background 1s ease,
            opacity 1s ease;
        }

        .skills-card-wrapper .glare-surface {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle at 50% 50%,
            rgba(255, 255, 255, 0.1) 0%,
            transparent 65%
          );
          pointer-events: none;
          z-index: 50;
        }

        .skills-card-wrapper .cost-dial {
          position: absolute;
          top: 30px;
          right: 30px;
          width: 50px;
          height: 50px;
          background: #000;
          border: 2px solid var(--theme);
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          font-weight: 900;
          color: #fff;
          font-size: 1.2rem;
          box-shadow: 0 0 30px rgba(0, 0, 0, 0.9);
          z-index: 100;
          transition: border-color 0.6s ease;
        }

        .skills-card-wrapper .scanline-layer {
          position: absolute;
          inset: 0;
          background: linear-gradient(rgba(255, 255, 255, 0.01) 1px, transparent 1px);
          background-size: 100% 4px;
          pointer-events: none;
        }
`;

export default SkillsCard;

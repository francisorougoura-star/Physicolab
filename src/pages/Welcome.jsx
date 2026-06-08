import React, { useState, useEffect, useRef } from 'react'

// ─── Animated particle background ─────────────────────────
function ParticleField() {
  const canvasRef = useRef()
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let W = canvas.width = window.innerWidth
    let H = canvas.height = window.innerHeight
    let raf

    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight }
    window.addEventListener('resize', resize)

    // Physics-inspired particles: orbits, falling dots, sine waves
    const particles = Array.from({ length: 60 }, (_, i) => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.4 + 0.1,
      hue: [210, 250, 190, 45][Math.floor(Math.random() * 4)],
    }))

    // Connection lines
    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue}, 80%, 65%, ${p.opacity})`
        ctx.fill()
      })
      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(96, 165, 250, ${0.08 * (1 - dist / 120)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />
}

// ─── Module card data ──────────────────────────────────────
const MODULES = [
  {
    id: 'chute', icon: '↓', label: 'Chute libre',
    desc: 'Gravité, hauteur, conservation de l\'énergie mécanique',
    color: '#60A5FA', glow: 'rgba(96,165,250,0.3)',
    formula: 'y = h₀ − ½gt²',
    tags: ['Mécanique', 'Énergie'],
  },
  {
    id: 'projectile', icon: '⤴', label: 'Projectile',
    desc: 'Trajectoire parabolique, portée maximale, vecteurs',
    color: '#34D399', glow: 'rgba(52,211,153,0.3)',
    formula: 'R = v₀²sin2θ / g',
    tags: ['Cinématique', '2D'],
  },
  {
    id: 'pendule', icon: '◎', label: 'Pendule',
    desc: 'Oscillations, amortissement, mesure de la période',
    color: '#A78BFA', glow: 'rgba(167,139,250,0.3)',
    formula: 'T = 2π√(L/g)',
    tags: ['Oscillations', 'Euler-Cromer'],
  },
  {
    id: 'newton', icon: '⇉', label: 'Lois de Newton',
    desc: 'F=ma, frottement, plan incliné, forces en jeu',
    color: '#FBBF24', glow: 'rgba(251,191,36,0.3)',
    formula: '∑F = ma',
    tags: ['Dynamique', 'Friction'],
  },
  {
    id: 'circuit', icon: '⚡', label: 'Circuit électrique',
    desc: 'Régimes RC, RL, RLC — transitoire et permanent',
    color: '#F472B6', glow: 'rgba(244,114,182,0.3)',
    formula: 'τ = RC  |  RK4',
    tags: ['Électricité', 'RLC'],
  },
  {
    id: 'chaleur', icon: '◈', label: 'Chaleur 1D',
    desc: 'Diffusion thermique, différences finies, stabilité CFL',
    color: '#FB923C', glow: 'rgba(251,146,60,0.3)',
    formula: '∂T/∂t = α ∂²T/∂x²',
    tags: ['Thermique', 'FTCS'],
  },
]

const STEPS = [
  { num: '01', label: 'Choisir un module', desc: 'Sélectionnez la simulation dans le menu latéral' },
  { num: '02', label: 'Régler les paramètres', desc: 'Sliders et champs numériques synchronisés en temps réel' },
  { num: '03', label: 'Lancer & observer', desc: 'Animation canvas + graphiques Chart.js se mettent à jour en direct' },
  { num: '04', label: 'Analyser & exporter', desc: 'Sauvegardez, comparez, exportez CSV / JSON ou activez le mode pédagogique' },
]

// ─── Main component ────────────────────────────────────────
export default function Welcome({ onEnter }) {
  const [hovered, setHovered] = useState(null)
  const [entered, setEntered] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80)
    return () => clearTimeout(t)
  }, [])

  const handleEnter = () => {
    setEntered(true)
    setTimeout(() => onEnter(), 600)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #060B18 0%, #0B1120 50%, #0D1526 100%)',
      color: '#F1F5F9',
      fontFamily: '"DM Sans", "Segoe UI", system-ui, sans-serif',
      overflowX: 'hidden',
      opacity: entered ? 0 : 1,
      transition: 'opacity 0.5s ease',
    }}>
      <ParticleField />

      {/* ── HERO ──────────────────────────────────────────── */}
      <section style={{
        position: 'relative', zIndex: 1,
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '60px 24px 40px',
        textAlign: 'center',
      }}>
        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(59,130,246,0.12)',
          border: '1px solid rgba(59,130,246,0.3)',
          borderRadius: 999, padding: '6px 18px',
          fontSize: 12, color: '#93C5FD', letterSpacing: 2,
          textTransform: 'uppercase', marginBottom: 32,
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(16px)',
          transition: 'all 0.6s ease 0.1s',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px #10B981' }} />
          Simulateur pédagogique interactif
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: 'clamp(48px, 8vw, 96px)',
          fontWeight: 800,
          lineHeight: 1.0,
          letterSpacing: '-3px',
          marginBottom: 8,
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(24px)',
          transition: 'all 0.7s ease 0.2s',
        }}>
          <span style={{ color: '#F1F5F9' }}>Physics</span>
          <span style={{
            background: 'linear-gradient(135deg, #3B82F6, #8B5CF6, #06B6D4)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>Lab</span>
        </h1>

        {/* Tagline */}
        <p style={{
          fontSize: 'clamp(16px, 2.5vw, 22px)',
          color: '#94A3B8',
          maxWidth: 560,
          lineHeight: 1.6,
          marginBottom: 48,
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.7s ease 0.35s',
        }}>
          6 simulations physiques interactives — animations canvas, graphiques en temps réel,
          mode pédagogique et export des données.
        </p>

        {/* CTA */}
        <div style={{
          display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.7s ease 0.5s',
        }}>
          <button
            onClick={handleEnter}
            style={{
              background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
              color: '#fff', border: 'none',
              borderRadius: 14, padding: '16px 36px',
              fontSize: 16, fontWeight: 700, cursor: 'pointer',
              boxShadow: '0 0 32px rgba(59,130,246,0.4), 0 4px 16px rgba(0,0,0,0.4)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              letterSpacing: 0.3,
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)'; e.currentTarget.style.boxShadow = '0 0 48px rgba(59,130,246,0.6), 0 8px 24px rgba(0,0,0,0.4)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 0 32px rgba(59,130,246,0.4), 0 4px 16px rgba(0,0,0,0.4)' }}
          >
            Lancer l'application →
          </button>
          <a href="#modules"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#CBD5E1', borderRadius: 14,
              padding: '16px 28px', fontSize: 15,
              cursor: 'pointer', textDecoration: 'none',
              transition: 'background 0.2s, border-color 0.2s',
              display: 'inline-block',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)' }}
          >
            Voir les modules ↓
          </a>
        </div>

        {/* Stats bar */}
        <div style={{
          display: 'flex', gap: 40, marginTop: 72, flexWrap: 'wrap', justifyContent: 'center',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.7s ease 0.7s',
        }}>
          {[['6', 'Modules'], ['Temps réel', 'Animations Canvas'], ['RK4 + FTCS', 'Méthodes numériques'], ['localStorage', 'Sauvegarde locale']].map(([val, lbl]) => (
            <div key={lbl} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#60A5FA', letterSpacing: -1 }}>{val}</div>
              <div style={{ fontSize: 11, color: '#475569', textTransform: 'uppercase', letterSpacing: 1 }}>{lbl}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '80px 24px', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <p style={{ color: '#3B82F6', fontSize: 12, textTransform: 'uppercase', letterSpacing: 3, marginBottom: 12 }}>Workflow</p>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: -1 }}>Comment ça marche</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 2 }}>
          {STEPS.map((step, i) => (
            <div key={i} style={{
              position: 'relative',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 16, padding: '28px 22px',
              transition: 'background 0.2s, border-color 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.06)'; e.currentTarget.style.borderColor = 'rgba(59,130,246,0.2)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)' }}
            >
              <div style={{ fontSize: 11, color: '#3B82F6', fontWeight: 800, letterSpacing: 2, marginBottom: 12 }}>{step.num}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#F1F5F9', marginBottom: 8 }}>{step.label}</div>
              <div style={{ fontSize: 13, color: '#64748B', lineHeight: 1.6 }}>{step.desc}</div>
              {i < STEPS.length - 1 && (
                <div style={{
                  position: 'absolute', right: -12, top: '50%', transform: 'translateY(-50%)',
                  color: '#1E3A5F', fontSize: 18, zIndex: 2,
                  display: window.innerWidth < 600 ? 'none' : 'block'
                }}>›</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── MODULES GRID ──────────────────────────────────── */}
      <section id="modules" style={{ position: 'relative', zIndex: 1, padding: '60px 24px 80px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <p style={{ color: '#3B82F6', fontSize: 12, textTransform: 'uppercase', letterSpacing: 3, marginBottom: 12 }}>Simulations</p>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: -1 }}>6 modules de physique</h2>
          <p style={{ color: '#64748B', marginTop: 12, fontSize: 15 }}>Chaque module est indépendant, avec ses propres paramètres, son canvas et ses graphiques.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {MODULES.map((m) => (
            <div
              key={m.id}
              onMouseEnter={() => setHovered(m.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                position: 'relative', overflow: 'hidden',
                background: hovered === m.id
                  ? `linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))`
                  : 'rgba(255,255,255,0.025)',
                border: `1px solid ${hovered === m.id ? m.color + '44' : 'rgba(255,255,255,0.07)'}`,
                borderRadius: 20, padding: '28px 24px',
                cursor: 'default',
                transition: 'all 0.25s ease',
                boxShadow: hovered === m.id ? `0 0 40px ${m.glow}, 0 8px 32px rgba(0,0,0,0.3)` : 'none',
                transform: hovered === m.id ? 'translateY(-4px)' : 'none',
              }}
            >
              {/* Glow blob */}
              <div style={{
                position: 'absolute', top: -40, right: -40, width: 120, height: 120,
                borderRadius: '50%', background: m.glow,
                filter: 'blur(40px)', opacity: hovered === m.id ? 1 : 0,
                transition: 'opacity 0.4s', pointerEvents: 'none',
              }} />

              {/* Icon + label */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                <div style={{
                  width: 46, height: 46, borderRadius: 12,
                  background: `linear-gradient(135deg, ${m.color}22, ${m.color}11)`,
                  border: `1px solid ${m.color}33`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, color: m.color, flexShrink: 0,
                  fontStyle: 'normal',
                }}>
                  {m.icon}
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#F1F5F9' }}>{m.label}</div>
                  <div style={{ fontSize: 11, color: m.color, fontFamily: '"Fira Code", monospace', marginTop: 2 }}>{m.formula}</div>
                </div>
              </div>

              <p style={{ color: '#94A3B8', fontSize: 13, lineHeight: 1.6, marginBottom: 16 }}>{m.desc}</p>

              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {m.tags.map(tag => (
                  <span key={tag} style={{
                    fontSize: 11, padding: '3px 10px', borderRadius: 999,
                    background: `${m.color}14`, color: m.color,
                    border: `1px solid ${m.color}28`,
                  }}>{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '60px 24px', background: 'rgba(255,255,255,0.015)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32 }}>
          {[
            { icon: '⚡', label: 'Temps réel', desc: 'requestAnimationFrame, zéro latence, 60 FPS', color: '#FBBF24' },
            { icon: '📊', label: 'Chart.js 4', desc: 'Graphiques dynamiques mis à jour à chaque frame', color: '#34D399' },
            { icon: '💾', label: 'localStorage', desc: 'Sauvegarde & historique des simulations', color: '#60A5FA' },
            { icon: '🎓', label: 'Mode péda.', desc: 'Équations, explications, vérification des lois', color: '#A78BFA' },
            { icon: '📤', label: 'Export', desc: 'CSV et JSON téléchargeables en un clic', color: '#FB923C' },
            { icon: '📱', label: 'Responsive', desc: 'Fonctionne sur desktop, tablette et mobile', color: '#F472B6' },
          ].map(f => (
            <div key={f.label} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ fontSize: 22, lineHeight: 1, flexShrink: 0, marginTop: 2 }}>{f.icon}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: f.color, marginBottom: 4 }}>{f.label}</div>
                <div style={{ fontSize: 13, color: '#64748B', lineHeight: 1.5 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────── */}
      <section style={{ position: 'relative', zIndex: 1, padding: '100px 24px', textAlign: 'center' }}>
        <div style={{
          display: 'inline-block',
          background: 'radial-gradient(ellipse at center, rgba(59,130,246,0.12) 0%, transparent 70%)',
          padding: '60px 40px', borderRadius: 32,
          border: '1px solid rgba(59,130,246,0.15)',
          maxWidth: 560,
        }}>
          <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 800, letterSpacing: -1, marginBottom: 14 }}>
            Prêt à simuler ?
          </h2>
          <p style={{ color: '#64748B', fontSize: 15, lineHeight: 1.7, marginBottom: 36 }}>
            Accédez à tous les modules directement. Aucune connexion, aucune installation supplémentaire — tout tourne dans votre navigateur.
          </p>
          <button
            onClick={handleEnter}
            style={{
              background: 'linear-gradient(135deg, #3B82F6, #6D28D9)',
              color: '#fff', border: 'none',
              borderRadius: 14, padding: '16px 44px',
              fontSize: 16, fontWeight: 700, cursor: 'pointer',
              boxShadow: '0 0 40px rgba(109,40,217,0.4)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = '0 0 60px rgba(109,40,217,0.6)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 0 40px rgba(109,40,217,0.4)' }}
          >
            Entrer dans PhysicsLab →
          </button>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────── */}
      <footer style={{
        position: 'relative', zIndex: 1,
        borderTop: '1px solid rgba(255,255,255,0.05)',
        padding: '24px', textAlign: 'center',
        color: '#334155', fontSize: 12,
      }}>
        PhysicsLab v1.0 — React 18 + Vite 5 + Chart.js 4 — Simulateur pédagogique
      </footer>
    </div>
  )
}

import React, { useState } from 'react'
import { FaToggleOn, FaToggleOff } from 'react-icons/fa6'
import { btnStyle } from './components/ui.js'
import { ModernIcon } from './components/ModernIcons.jsx'

import Welcome    from './pages/Welcome.jsx'
import ChuteLibre from './modules/ChuteLibre.jsx'
import Projectile from './modules/Projectile.jsx'
import Pendule    from './modules/Pendule.jsx'
import Newton     from './modules/Newton.jsx'
import Circuit    from './modules/Circuit.jsx'
import Chaleur    from './modules/Chaleur.jsx'

const MODULES = [
  { id: 'chute',      label: 'Chute libre',       iconType: 'chute',      component: ChuteLibre },
  { id: 'projectile', label: 'Projectile',         iconType: 'projectile', component: Projectile },
  { id: 'pendule',    label: 'Pendule',            iconType: 'pendule',    component: Pendule    },
  { id: 'newton',     label: 'Lois de Newton',     iconType: 'newton',     component: Newton     },
  { id: 'circuit',    label: 'Circuit élec.',      iconType: 'circuit',    component: Circuit    },
  { id: 'chaleur',    label: 'Chaleur',            iconType: 'chaleur',    component: Chaleur    },
]

export default function App() {
  const [showWelcome, setShowWelcome] = useState(true)
  const [active,   setActive]   = useState('chute')
  const [showPeda, setShowPeda] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [hoveredIcon, setHoveredIcon] = useState(null)

  if (showWelcome) {
    return <Welcome onEnter={() => setShowWelcome(false)} />
  }

  const ActiveModule = MODULES.find(m => m.id === active)?.component
  const activeInfo   = MODULES.find(m => m.id === active)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-main)' }}>

      {/* ── Sidebar ─────────────────────────────────────── */}
      <aside style={{
        width: collapsed ? 56 : 210,
        background: 'var(--bg-deep)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.2s ease',
        flexShrink: 0,
        zIndex: 20,
        overflow: 'hidden',
      }}>
        {/* Logo row */}
        <div style={{
          padding: collapsed ? '16px 0' : '16px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          justifyContent: collapsed ? 'center' : 'flex-start',
          borderBottom: '1px solid var(--border)',
          cursor: 'pointer',
        }} onClick={() => setCollapsed(!collapsed)}>
          <div style={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ModernIcon type="physicslab" isActive={true} isHovered={false} />
          </div>
          {!collapsed && (
            <span style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: 15, whiteSpace: 'nowrap' }}>
              PhysicsLab
            </span>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, paddingTop: 8 }}>
          {MODULES.map(m => {
            const isActive = active === m.id
            const isHovered = hoveredIcon === m.id
            return (
              <button
                key={m.id}
                onClick={() => setActive(m.id)}
                onMouseEnter={() => setHoveredIcon(m.id)}
                onMouseLeave={() => setHoveredIcon(null)}
                title={m.label}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: collapsed ? '11px 0' : '11px 16px',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  background: isActive ? '#1E3A5F' : 'transparent',
                  borderLeft: isActive ? '3px solid var(--accent)' : '3px solid transparent',
                  borderTop: 'none',
                  borderRight: 'none',
                  borderBottom: 'none',
                  cursor: 'pointer',
                  color: isActive ? '#60A5FA' : 'var(--text-secondary)',
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 400,
                  transition: 'all 0.15s',
                  whiteSpace: 'nowrap',
                }}
              >
                <div style={{ width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <ModernIcon type={m.iconType} isActive={isActive} isHovered={isHovered} />
                </div>
                {!collapsed && <span>{m.label}</span>}
              </button>
            )
          })}
        </nav>

        {/* Footer */}
        {!collapsed && (
          <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)' }}>
            <div style={{ color: '#475569', fontSize: 10 }}>PhysicsLab v1.0</div>
            <div style={{ color: '#334155', fontSize: 10 }}>Simulateur pédagogique</div>
          </div>
        )}
      </aside>

      {/* ── Main ────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Top bar */}
        <header style={{
          background: 'var(--bg-deep)',
          borderBottom: '1px solid var(--border)',
          padding: '10px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 10,
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ModernIcon type={activeInfo?.iconType} isActive={true} isHovered={false} />
            </div>
            <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: 15 }}>
              {activeInfo?.label}
            </span>
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>Mode pédagogique</span>
            <button
              onClick={() => setShowPeda(!showPeda)}
              style={{ ...btnStyle(showPeda ? '#6D28D9' : '#334155'), fontSize: 12, padding: '5px 12px' }}
            >
              {showPeda
                ? <><FaToggleOn style={{ fontSize: 16 }} /> ON</>
                : <><FaToggleOff style={{ fontSize: 16 }} /> OFF</>
              }
            </button>
          </div>
        </header>

        {/* Module content */}
        <main style={{ flex: 1, overflowY: 'auto' }}>
          {ActiveModule && (
            <ActiveModule
              showPeda={showPeda}
              onTogglePeda={() => setShowPeda(p => !p)}
            />
          )}
        </main>
      </div>
    </div>
  )
}

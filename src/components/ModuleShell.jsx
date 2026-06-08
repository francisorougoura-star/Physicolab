import React from 'react'
import { FaBookOpen } from 'react-icons/fa6'
import { btnStyle } from './ui.js'
import EnrichedPedagogyPanel from './EnrichedPedagogyPanel.jsx'

export default function ModuleShell({ title, icon, children, pedagogy, showPeda, onTogglePeda }) {
  return (
    <div style={{ padding: '16px 20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ color: '#F1F5F9', fontSize: 20, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 10 }}>
          <i className={icon} style={{ color: '#3B82F6' }} />
          {title}
        </h2>
        <button
          onClick={onTogglePeda}
          style={{ ...btnStyle(showPeda ? '#6D28D9' : '#334155'), fontSize: 12 }}
        >
          <FaBookOpen /> {showPeda ? 'Masquer péda.' : 'Mode péda.'}
        </button>
      </div>

      {children}

      {showPeda && <EnrichedPedagogyPanel content={pedagogy} />}
    </div>
  )
}

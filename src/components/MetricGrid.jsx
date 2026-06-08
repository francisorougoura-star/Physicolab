import React from 'react'

export default function MetricGrid({ items }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8 }}>
      {items.map((item, i) => (
        <div
          key={i}
          style={{
            background: '#0F172A', borderRadius: 8, padding: '8px 12px',
            borderLeft: `3px solid ${item.color || '#3B82F6'}`,
          }}
        >
          <div style={{ color: '#64748B', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 }}>
            {item.label}
          </div>
          <div style={{ color: item.color || '#F1F5F9', fontSize: 18, fontWeight: 600, fontFamily: 'monospace' }}>
            {item.value}
          </div>
          {item.unit && (
            <div style={{ color: '#475569', fontSize: 10 }}>{item.unit}</div>
          )}
        </div>
      ))}
    </div>
  )
}

import React from 'react'

export default function ParamRow({ label, value, min, max, step, unit, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
      <label style={{ color: 'var(--text-secondary)', fontSize: 12, width: 130, flexShrink: 0 }}>
        {label}
      </label>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        style={{ flex: 1 }}
      />
      <input
        type="number" min={min} max={max} step={step} value={value}
        onChange={e => onChange(parseFloat(e.target.value) || min)}
        style={{
          width: 76, background: 'var(--bg-deep)', border: '1px solid var(--border-mid)',
          borderRadius: 6, color: 'var(--text-primary)', fontSize: 12,
          padding: '3px 8px', textAlign: 'right',
        }}
      />
      <span style={{ color: 'var(--text-muted)', fontSize: 11, width: 36, flexShrink: 0 }}>{unit}</span>
    </div>
  )
}

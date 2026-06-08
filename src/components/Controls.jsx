import React from 'react'
import { FaPlay, FaPause, FaRotateLeft } from 'react-icons/fa6'
import { btnStyle } from './ui.js'

const SPEEDS = [0.25, 0.5, 1, 2]

export default function Controls({ running, onStart, onPause, onReset, speed, onSpeed }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
      <button
        onClick={running ? onPause : onStart}
        style={{ ...btnStyle(running ? '#EF4444' : '#10B981'), minWidth: 100 }}
      >
        {running ? <FaPause style={{ marginRight: 6 }} /> : <FaPlay style={{ marginRight: 6 }} />}
        {running ? 'Pause' : 'Lancer'}
      </button>

      <button onClick={onReset} style={btnStyle('#334155')}>
        <FaRotateLeft style={{ marginRight: 6 }} /> Reset
      </button>

      <div style={{ display: 'flex', gap: 4, marginLeft: 8 }}>
        {SPEEDS.map(s => (
          <button
            key={s}
            onClick={() => onSpeed(s)}
            style={{ ...btnStyle(speed === s ? '#3B82F6' : '#1E293B'), padding: '5px 10px', fontSize: 12 }}
          >
            {s}x
          </button>
        ))}
      </div>
    </div>
  )
}

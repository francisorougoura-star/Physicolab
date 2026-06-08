import React, { useState } from 'react'
import { FaFloppyDisk, FaFolderOpen, FaTrash, FaPlay, FaCheck, FaXmark, FaFileCsv, FaFileCode } from 'react-icons/fa6'
import { btnStyle } from './ui.js'
import { loadSaves, persistSaves, exportCSV, exportJSON } from '../utils/export.js'
import { uuid } from '../utils/math.js'

export default function SavePanel({ module, params, metrics, history, onLoad }) {
  const [saves,  setSaves]  = useState(() => loadSaves())
  const [label,  setLabel]  = useState('')
  const [openInput, setOpenInput] = useState(false)
  const [showList,  setShowList]  = useState(false)

  const save = () => {
    const entry = {
      id: uuid(), module,
      label: label || `${module} — ${new Date().toLocaleTimeString()}`,
      timestamp: Date.now(), params, metrics,
      dataHistory: history.slice(-200),
    }
    const next = [entry, ...saves].slice(0, 20)
    setSaves(next)
    persistSaves(next)
    setLabel('')
    setOpenInput(false)
  }

  const del = (id) => {
    const next = saves.filter(s => s.id !== id)
    setSaves(next)
    persistSaves(next)
  }

  const myList = saves.filter(s => s.module === module)

  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', position: 'relative' }}>

      {/* Sauvegarder */}
      <button onClick={() => setOpenInput(!openInput)} style={btnStyle('#334155')}>
        <FaFloppyDisk /> Sauvegarder
      </button>
      {openInput && (
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <input
            value={label} onChange={e => setLabel(e.target.value)}
            placeholder="Nom du scénario…"
            onKeyDown={e => e.key === 'Enter' && save()}
            style={{
              background: '#0F172A', border: '1px solid #334155', borderRadius: 6,
              color: '#F1F5F9', fontSize: 12, padding: '5px 10px', width: 170,
            }}
          />
          <button onClick={save} style={btnStyle('#10B981')}><FaCheck /></button>
          <button onClick={() => setOpenInput(false)} style={btnStyle('#EF4444')}><FaXmark /></button>
        </div>
      )}

      {/* Charger */}
      <div style={{ position: 'relative' }}>
        <button onClick={() => setShowList(!showList)} style={btnStyle('#334155')}>
          <FaFolderOpen /> Charger ({myList.length})
        </button>
        {showList && (
          <div style={{
            position: 'absolute', bottom: '110%', left: 0,
            background: '#1E293B', border: '1px solid #334155',
            borderRadius: 8, padding: 8, minWidth: 270, zIndex: 200,
            maxHeight: 280, overflowY: 'auto',
          }}>
            {myList.length === 0 && (
              <div style={{ color: '#64748B', fontSize: 12 }}>Aucune sauvegarde</div>
            )}
            {myList.map(s => (
              <div key={s.id} style={{ display: 'flex', gap: 6, alignItems: 'center', padding: '5px 0', borderBottom: '1px solid #1E293B' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#F1F5F9', fontSize: 12 }}>{s.label}</div>
                  <div style={{ color: '#64748B', fontSize: 10 }}>{new Date(s.timestamp).toLocaleString()}</div>
                </div>
                <button onClick={() => { onLoad(s); setShowList(false) }} style={btnStyle('#3B82F6')}>
                  <FaPlay />
                </button>
                <button onClick={() => del(s.id)} style={btnStyle('#EF4444')}>
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Exports */}
      <button onClick={() => exportCSV(history, module)} style={btnStyle('#334155')}>
        <FaFileCsv /> CSV
      </button>
      <button onClick={() => exportJSON(module, params, metrics, history)} style={btnStyle('#334155')}>
        <FaFileCode /> JSON
      </button>
    </div>
  )
}

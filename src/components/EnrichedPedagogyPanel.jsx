import React, { useState } from 'react'
import { FaBookOpen, FaCircleCheck } from 'react-icons/fa6'

export default function EnrichedPedagogyPanel({ content }) {
  const [expandedSections, setExpandedSections] = useState({
    concepts: true,
    simulation: true,
    graphiques: true,
    conseils: false,
  })

  if (!content) return null

  const toggleSection = (key) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const Section = ({ id, title, icon, children, defaultOpen = true }) => (
    <div style={{ marginBottom: 12, borderLeft: '3px solid #6D28D9', paddingLeft: 12 }}>
      <button
        onClick={() => toggleSection(id)}
        style={{
          background: 'none', border: 'none', color: '#A78BFA', cursor: 'pointer',
          fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6,
          width: '100%', textAlign: 'left', padding: '6px 0'
        }}
      >
        {icon} {title}
        <span style={{ fontSize: 10, marginLeft: 'auto' }}>
          {expandedSections[id] ? '▾' : '▸'}
        </span>
      </button>
      {expandedSections[id] && (
        <div style={{ color: '#DDD6FE', fontSize: 12, lineHeight: 1.7, marginTop: 8 }}>
          {children}
        </div>
      )}
    </div>
  )

  return (
    <div style={{
      background: '#1E1333', border: '2px solid #6D28D9', borderRadius: 10,
      padding: '16px 18px', marginTop: 12
    }}>
      <div style={{ color: '#8B5CF6', fontWeight: 700, fontSize: 14, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
        <FaBookOpen size={16} /> Mode Pédagogique Complet
      </div>

      {/* CONCEPTS CLÉS */}
      {content.concepts && (
        <Section id="concepts" title="🎯 Concepts Clés" icon="📚">
          <div style={{ background: '#2A1F4A', padding: '10px 12px', borderRadius: 6, marginBottom: 10 }}>
            <div style={{ fontFamily: 'monospace', color: '#C4B5FD', fontSize: 11, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
              {content.concepts.equations}
            </div>
          </div>
          <div style={{ color: '#E9D5FF' }}>
            {content.concepts.definition && (
              <p style={{ marginBottom: 8 }}><strong>Définition :</strong> {content.concepts.definition}</p>
            )}
            {content.concepts.points && (
              <ul style={{ marginLeft: 16, marginTop: 8 }}>
                {content.concepts.points.map((point, i) => (
                  <li key={i} style={{ marginBottom: 6 }}>{point}</li>
                ))}
              </ul>
            )}
          </div>
        </Section>
      )}

      {/* COMMENT ÇA MARCHE */}
      {content.simulation && (
        <Section id="simulation" title="🔬 Interprétation de la Simulation" icon="👁️">
          <div style={{ color: '#E9D5FF' }}>
            <p style={{ marginBottom: 10, fontStyle: 'italic', color: '#BDB4FA' }}>
              {content.simulation.intro}
            </p>
            {content.simulation.steps && (
              <div>
                <p style={{ fontWeight: 600, marginBottom: 6 }}>Étapes à observer :</p>
                <ol style={{ marginLeft: 16 }}>
                  {content.simulation.steps.map((step, i) => (
                    <li key={i} style={{ marginBottom: 8 }}>
                      <strong>{step.titre}</strong> — {step.description}
                      {step.observation && (
                        <div style={{ color: '#93C5FD', fontSize: 11, marginTop: 2, marginLeft: 8 }}>
                          💡 {step.observation}
                        </div>
                      )}
                    </li>
                  ))}
                </ol>
              </div>
            )}
            {content.simulation.tips && (
              <div style={{ marginTop: 10, background: '#2A1F4A', padding: '8px 10px', borderRadius: 6 }}>
                <p style={{ fontSize: 11 }}><strong>Conseil :</strong> {content.simulation.tips}</p>
              </div>
            )}
          </div>
        </Section>
      )}

      {/* LIRE LES GRAPHIQUES */}
      {content.graphiques && (
        <Section id="graphiques" title="📊 Interprétation des Graphiques" icon="📈">
          <div style={{ color: '#E9D5FF' }}>
            {content.graphiques.map((graph, i) => (
              <div key={i} style={{ marginBottom: 12, padding: '8px 10px', background: '#2A1F4A', borderRadius: 6 }}>
                <p style={{ fontWeight: 600, color: '#A78BFA', marginBottom: 6 }}>
                  {i + 1}. {graph.titre}
                </p>
                <p style={{ fontSize: 12, marginBottom: 6 }}>{graph.description}</p>
                {graph.points && (
                  <ul style={{ marginLeft: 16, fontSize: 11 }}>
                    {graph.points.map((point, j) => (
                      <li key={j} style={{ marginBottom: 4 }}>• {point}</li>
                    ))}
                  </ul>
                )}
                {graph.question && (
                  <div style={{ marginTop: 6, padding: '6px 8px', background: '#1E1333', borderLeft: '2px solid #60A5FA', borderRadius: 4 }}>
                    <p style={{ fontSize: 11, color: '#93C5FD' }}>❓ {graph.question}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* CONSEILS & ASTUCES */}
      {content.conseils && (
        <Section id="conseils" title="💡 Conseils & Astuces" icon="✨">
          <div style={{ color: '#E9D5FF' }}>
            {content.conseils.map((conseil, i) => (
              <div key={i} style={{ marginBottom: 10, paddingLeft: 12, borderLeft: '2px solid #10B981' }}>
                <p style={{ fontWeight: 600, color: '#6EE7B7', marginBottom: 4 }}>
                  {conseil.titre}
                </p>
                <p style={{ fontSize: 12 }}>{conseil.description}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* DÉFI ÉDUCATIF */}
      {content.defi && (
        <div style={{ marginTop: 12, padding: '10px 12px', background: '#2D3748', borderLeft: '4px solid #F59E0B', borderRadius: 6 }}>
          <p style={{ color: '#FBBF24', fontWeight: 600, marginBottom: 6, fontSize: 13 }}>
            🎯 Défi : {content.defi.titre}
          </p>
          <p style={{ color: '#E9D5FF', fontSize: 12, lineHeight: 1.6 }}>
            {content.defi.description}
          </p>
          {content.defi.indication && (
            <p style={{ color: '#93C5FD', fontSize: 11, marginTop: 8, fontStyle: 'italic' }}>
              💬 Indication : {content.defi.indication}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

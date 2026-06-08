import React from 'react'
import { FaBookOpen, FaCircleCheck, FaCircleQuestion } from 'react-icons/fa6'

export default function PedagogyPanel({ content }) {
  if (!content) return null
  return (
    <div style={{
      background: '#1E1333', border: '1px solid #6D28D9',
      borderRadius: 10, padding: '14px 18px', marginTop: 12,
    }}>
      <div style={{ color: '#8B5CF6', fontWeight: 600, fontSize: 13, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
        <FaBookOpen /> Mode pédagogique
      </div>
      <pre style={{ color: '#C4B5FD', fontSize: 12, lineHeight: 1.7, fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
        {content.equation}
      </pre>
      <p style={{ color: '#DDD6FE', fontSize: 13, lineHeight: 1.6, marginTop: 8 }}>
        {content.explication}
      </p>
      {content.verification && (
        <div style={{ marginTop: 8, color: '#10B981', fontSize: 12, display: 'flex', alignItems: 'flex-start', gap: 6 }}>
          <FaCircleCheck style={{ marginTop: 2, flexShrink: 0 }} />
          <span>{content.verification}</span>
        </div>
      )}
      {content.question && (
        <div style={{ marginTop: 8, color: '#93C5FD', fontSize: 12, fontStyle: 'italic', display: 'flex', alignItems: 'flex-start', gap: 6 }}>
          <FaCircleQuestion style={{ marginTop: 2, flexShrink: 0 }} />
          <span>{content.question}</span>
        </div>
      )}
    </div>
  )
}

import React from 'react'

// SVG Icons avec style néon/glassmorphism
const iconStyle = {
  filter: 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.4))',
  transition: 'all 0.3s ease',
}

const iconHoverStyle = {
  filter: 'drop-shadow(0 0 16px rgba(139, 92, 246, 0.8)) drop-shadow(0 0 24px rgba(139, 92, 246, 0.6))',
  transform: 'scale(1.1)',
}

export const PhysicsLabIcon = ({ isActive, isHovered }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
    style={isHovered ? { ...iconStyle, ...iconHoverStyle } : iconStyle}>
    <defs>
      <linearGradient id="flask-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#A78BFA" />
        <stop offset="100%" stopColor="#7C3AED" />
      </linearGradient>
      <filter id="glow-flask">
        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <path d="M8 2H16V6C16 6 18 8 18 12C18 15 16 18 16 18H8C8 18 6 15 6 12C6 8 8 6 8 6V2Z" 
      stroke="url(#flask-grad)" strokeWidth="1.5" fill="none" filter="url(#glow-flask)" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10 18H14L13 22H11L10 18Z" stroke="url(#flask-grad)" strokeWidth="1.5" fill="none" filter="url(#glow-flask)" strokeLinecap="round" />
    <circle cx="12" cy="9" r="1.5" fill="url(#flask-grad)" filter="url(#glow-flask)" opacity="0.7" />
  </svg>
)

export const ChuteLibreIcon = ({ isActive, isHovered }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
    style={isHovered ? { ...iconStyle, ...iconHoverStyle } : iconStyle}>
    <defs>
      <linearGradient id="arrow-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#06B6D4" />
        <stop offset="100%" stopColor="#0891B2" />
      </linearGradient>
      <filter id="glow-arrow">
        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <path d="M12 2V16" stroke="url(#arrow-grad)" strokeWidth="2" filter="url(#glow-arrow)" strokeLinecap="round" />
    <path d="M7 11L12 16L17 11" stroke="url(#arrow-grad)" strokeWidth="2" filter="url(#glow-arrow)" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="20" r="2" fill="url(#arrow-grad)" filter="url(#glow-arrow)" />
  </svg>
)

export const ProjectileIcon = ({ isActive, isHovered }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
    style={isHovered ? { ...iconStyle, ...iconHoverStyle } : iconStyle}>
    <defs>
      <linearGradient id="trajectory-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#14B8A6" />
        <stop offset="100%" stopColor="#06B6D4" />
      </linearGradient>
      <filter id="glow-trajectory">
        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <path d="M4 16C4 16 8 6 12 8C16 10 18 4 20 4" stroke="url(#trajectory-grad)" strokeWidth="2" fill="none" filter="url(#glow-trajectory)" strokeLinecap="round" />
    <circle cx="4" cy="16" r="1.5" fill="url(#trajectory-grad)" filter="url(#glow-trajectory)" />
    <circle cx="20" cy="4" r="2" fill="url(#trajectory-grad)" filter="url(#glow-trajectory)" />
  </svg>
)

export const PenduleIcon = ({ isActive, isHovered }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
    style={isHovered ? { ...iconStyle, ...iconHoverStyle } : iconStyle}>
    <defs>
      <linearGradient id="pendulum-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FBBF24" />
        <stop offset="100%" stopColor="#F59E0B" />
      </linearGradient>
      <filter id="glow-pendulum">
        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <path d="M12 2V8" stroke="url(#pendulum-grad)" strokeWidth="1.5" filter="url(#glow-pendulum)" strokeLinecap="round" />
    <circle cx="12" cy="8" r="1" fill="url(#pendulum-grad)" filter="url(#glow-pendulum)" />
    <path d="M12 8C12 8 16 12 16 16C16 18.5 14 20 12 20C10 20 8 18.5 8 16C8 12 12 8 12 8Z" stroke="url(#pendulum-grad)" strokeWidth="1.5" fill="none" filter="url(#glow-pendulum)" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="20" r="2" fill="url(#pendulum-grad)" filter="url(#glow-pendulum)" />
    <path d="M8 14L16 14" stroke="url(#pendulum-grad)" strokeWidth="0.5" opacity="0.5" filter="url(#glow-pendulum)" strokeDasharray="2,2" />
  </svg>
)

export const NewtonIcon = ({ isActive, isHovered }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
    style={isHovered ? { ...iconStyle, ...iconHoverStyle } : iconStyle}>
    <defs>
      <linearGradient id="balance-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10B981" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
      <filter id="glow-balance">
        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <path d="M12 2V6" stroke="url(#balance-grad)" strokeWidth="1.5" filter="url(#glow-balance)" strokeLinecap="round" />
    <circle cx="12" cy="6" r="0.8" fill="url(#balance-grad)" filter="url(#glow-balance)" />
    <path d="M4 8H20" stroke="url(#balance-grad)" strokeWidth="2" filter="url(#glow-balance)" strokeLinecap="round" />
    <path d="M8 8V14C8 16 9 18 12 18C15 18 16 16 16 14V8" stroke="url(#balance-grad)" strokeWidth="1.5" fill="none" filter="url(#glow-balance)" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 8L8 12" stroke="url(#balance-grad)" strokeWidth="1.5" filter="url(#glow-balance)" strokeLinecap="round" />
    <path d="M18 8L16 12" stroke="url(#balance-grad)" strokeWidth="1.5" filter="url(#glow-balance)" strokeLinecap="round" />
  </svg>
)

export const CircuitIcon = ({ isActive, isHovered }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
    style={isHovered ? { ...iconStyle, ...iconHoverStyle } : iconStyle}>
    <defs>
      <linearGradient id="bolt-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#C084FC" />
        <stop offset="100%" stopColor="#A855F7" />
      </linearGradient>
      <filter id="glow-bolt">
        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <path d="M13 2L6 13H10L8 22L18 8H14L13 2Z" stroke="url(#bolt-grad)" strokeWidth="1.5" fill="none" filter="url(#glow-bolt)" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="11" cy="10" r="1" fill="url(#bolt-grad)" filter="url(#glow-bolt)" opacity="0.6" />
  </svg>
)

export const ChaleurIcon = ({ isActive, isHovered }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
    style={isHovered ? { ...iconStyle, ...iconHoverStyle } : iconStyle}>
    <defs>
      <linearGradient id="flame-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF6B35" />
        <stop offset="100%" stopColor="#F97316" />
      </linearGradient>
      <filter id="glow-flame">
        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <path d="M12 2C12 2 10 6 10 10C10 13 11 15 12 16C13 15 14 13 14 10C14 6 12 2 12 2Z" stroke="url(#flame-grad)" strokeWidth="1.5" fill="none" filter="url(#glow-flame)" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10 16C8 17 7 19 7 21C7 22.5 8 24 12 24C16 24 17 22.5 17 21C17 19 16 17 14 16" stroke="url(#flame-grad)" strokeWidth="1.5" fill="none" filter="url(#glow-flame)" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="6" r="1" fill="url(#flame-grad)" filter="url(#glow-flame)" opacity="0.7" />
  </svg>
)

// Composant pour utiliser les icônes
export function ModernIcon({ type, isActive, isHovered }) {
  const icons = {
    physicslab: PhysicsLabIcon,
    chute: ChuteLibreIcon,
    projectile: ProjectileIcon,
    pendule: PenduleIcon,
    newton: NewtonIcon,
    circuit: CircuitIcon,
    chaleur: ChaleurIcon,
  }

  const IconComponent = icons[type]
  return IconComponent ? <IconComponent isActive={isActive} isHovered={isHovered} /> : null
}

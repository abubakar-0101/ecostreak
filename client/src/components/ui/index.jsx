/**
 * @fileoverview Reusable UI primitives – Button, Card, Modal, Badge, Skeleton, StatCard
 * Earth-tone design system: warm shadows, DM Sans body, Lora headings
 */
import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ─── BUTTON ────────────────────────────────────────────── */
export function Button({
  children, variant = 'primary', size = 'md',
  className = '', loading = false, disabled, ...props
}) {
  const sizes    = { sm: 'px-4 py-2 text-sm', md: 'px-6 py-3 text-sm', lg: 'px-8 py-4 text-base' }
  const variants = {
    primary:   'btn-primary',
    secondary: 'btn-secondary',
    ghost: [
      'flex items-center gap-2 rounded-xl font-medium transition-all duration-300',
      'hover:bg-[var(--leaf-shadow)]',
    ].join(' '),
    danger: 'flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-white transition-all duration-300',
  }
  const dangerStyle = variant === 'danger' ? { background: 'var(--color-red)' } : {}

  return (
    <button
      className={`${variants[variant]} ${sizes[size]} ${className} ${disabled || loading ? 'opacity-60 cursor-not-allowed' : ''}`}
      style={dangerStyle}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24" aria-hidden="true">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  )
}

/* ─── CARD ──────────────────────────────────────────────── */
export function Card({ children, className = '', hover = true, ...props }) {
  return (
    <div
      className={`eco-card p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

/* ─── MODAL ─────────────────────────────────────────────── */
export function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose?.() }
    if (isOpen) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const sizes = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          onClick={onClose}
        >
          {/* Backdrop — muted, not frosted */}
          <div className="absolute inset-0 bg-black/40" />

          {/* Panel */}
          <motion.div
            className={`relative w-full ${sizes[size]} rounded-[20px] p-6 z-10`}
            style={{ background: 'var(--color-card)', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--color-border)' }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
          >
            {title && (
              <div className="flex items-center justify-between mb-6">
                <h2
                  className="text-xl font-bold"
                  style={{ fontFamily: "'Lora', serif", color: 'var(--green-deep)' }}
                >
                  {title}
                </h2>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200"
                  style={{ color: 'var(--color-text-muted)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--leaf-shadow)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  aria-label="Close modal"
                >
                  ✕
                </button>
              </div>
            )}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ─── SKELETON ───────────────────────────────────────────── */
export function Skeleton({ className = '', height, width }) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ height: height || '1rem', width: width || '100%' }}
      role="presentation"
      aria-hidden="true"
    />
  )
}

export function SkeletonCard() {
  return (
    <div className="eco-card p-6 space-y-4">
      <Skeleton height="1.5rem" width="55%" />
      <Skeleton height="1rem"   width="75%" />
      <Skeleton height="1rem"   width="40%" />
      <Skeleton height="2.5rem" className="rounded-xl" />
    </div>
  )
}

/* ─── PAGE LOADER ────────────────────────────────────────── */
export default function PageLoader() {
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center gap-5 z-50"
      style={{ background: 'var(--color-bg)' }}
      role="status"
      aria-label="Loading EcoStreak"
    >
      <div className="text-4xl animate-float" aria-hidden="true">🌿</div>
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full"
            style={{
              background: 'var(--green-mid)',
              animation: `bounce 1.2s ease-in-out ${i * 0.18}s infinite`,
            }}
            aria-hidden="true"
          />
        ))}
      </div>
      <p
        className="text-sm"
        style={{ color: 'var(--color-text-muted)', fontFamily: "'Lora', serif", fontStyle: 'italic' }}
      >
        Growing your forest…
      </p>
    </div>
  )
}

/* ─── PROGRESS BAR ───────────────────────────────────────── */
export function ProgressBar({ value, max = 100, label, color }) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  return (
    <div>
      {label && (
        <div className="flex justify-between text-xs mb-1.5" style={{ color: 'var(--color-text-muted)' }}>
          <span>{label}</span>
          <span style={{ color: 'var(--green-mid)', fontWeight: 600 }}>{pct}%</span>
        </div>
      )}
      <div
        className="progress-bar-track"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || 'Progress'}
      >
        <div
          className="progress-bar-fill"
          style={{ width: `${pct}%`, background: color || 'var(--green-mid)' }}
        />
      </div>
    </div>
  )
}

/* ─── EMPTY STATE ────────────────────────────────────────── */
export function EmptyState({ icon = '🌱', title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-5xl mb-4 animate-float" aria-hidden="true">{icon}</div>
      <h3
        className="text-xl font-bold mb-2"
        style={{ fontFamily: "'Lora', serif", color: 'var(--green-deep)' }}
      >
        {title}
      </h3>
      {description && (
        <p
          className="text-sm mb-6 max-w-xs"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {description}
        </p>
      )}
      {action}
    </div>
  )
}

/* ─── STAT CARD ──────────────────────────────────────────── */
export function StatCard({ icon, label, value, sub, color = 'var(--green-mid)' }) {
  return (
    <div
      className="eco-card p-5 flex items-center gap-4"
      role="region"
      aria-label={label}
    >
      {/* Icon bubble — leaf-shadow tint */}
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
        style={{ background: 'var(--leaf-shadow)', border: '1px solid var(--color-border)' }}
        aria-hidden="true"
      >
        {icon}
      </div>
      <div>
        <p
          className="text-2xl font-bold leading-none"
          style={{ color, fontFamily: "'Lora', serif" }}
        >
          {value}
        </p>
        <p
          className="text-xs font-medium mt-0.5"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {label}
        </p>
        {sub && (
          <p className="text-[10px] mt-0.5" style={{ color: 'var(--color-text-muted)', opacity: 0.7 }}>
            {sub}
          </p>
        )}
      </div>
    </div>
  )
}

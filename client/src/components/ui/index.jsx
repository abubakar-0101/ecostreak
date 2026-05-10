/**
 * @fileoverview Reusable UI primitives: Button, Card, Modal, Badge, Skeleton, PageLoader
 */
import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ─── BUTTON ────────────────────────────────────────────── */
/**
 * @param {'primary'|'secondary'|'ghost'|'danger'} variant
 */
export function Button({
  children, variant = 'primary', size = 'md',
  className = '', loading = false, disabled, ...props
}) {
  const sizes = { sm: 'px-4 py-2 text-sm', md: 'px-6 py-3 text-sm', lg: 'px-8 py-4 text-base' }
  const variants = {
    primary:   'btn-primary',
    secondary: 'btn-secondary',
    ghost:     'flex items-center gap-2 rounded-xl font-medium transition-all duration-200 hover:bg-green-50 dark:hover:bg-green-900/20',
    danger:    'flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-red-500 hover:bg-red-600 transition-all',
  }

  return (
    <button
      className={`${variants[variant]} ${sizes[size]} ${className} ${disabled || loading ? 'opacity-60 cursor-not-allowed' : ''}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
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
      className={`eco-card p-6 ${hover ? 'cursor-default' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

/* ─── MODAL ─────────────────────────────────────────────── */
export function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose?.() }
    if (isOpen) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  // Prevent body scroll
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
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          {/* Panel */}
          <motion.div
            className={`relative w-full ${sizes[size]} rounded-[24px] p-6 z-10`}
            style={{ background: 'var(--color-card)', boxShadow: 'var(--shadow-lg)' }}
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            {title && (
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>
                  {title}
                </h2>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                  aria-label="Close modal"
                  style={{ color: 'var(--color-text-muted)' }}
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
      <Skeleton height="1.5rem" width="60%" />
      <Skeleton height="1rem" width="80%" />
      <Skeleton height="1rem" width="40%" />
      <Skeleton height="2.5rem" className="rounded-xl" />
    </div>
  )
}

/* ─── PAGE LOADER ────────────────────────────────────────── */
export default function PageLoader() {
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center gap-4 z-50"
      style={{ background: 'var(--color-bg)' }}
    >
      <div className="text-4xl animate-float">🌿</div>
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full"
            style={{
              background: 'var(--color-primary)',
              animation: `bounce 1s ease-in-out ${i * 0.15}s infinite`,
            }}
          />
        ))}
      </div>
      <p className="text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>
        Loading EcoStreak…
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
        <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--color-text-muted)' }}>
          <span>{label}</span>
          <span>{pct}%</span>
        </div>
      )}
      <div className="progress-bar-track">
        <div
          className="progress-bar-fill"
          style={{ width: `${pct}%`, background: color || undefined }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  )
}

/* ─── EMPTY STATE ────────────────────────────────────────── */
export function EmptyState({ icon = '🌱', title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-5xl mb-4 animate-float">{icon}</div>
      <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
        {title}
      </h3>
      {description && (
        <p className="text-sm mb-6 max-w-xs" style={{ color: 'var(--color-text-muted)' }}>
          {description}
        </p>
      )}
      {action}
    </div>
  )
}

/* ─── STAT CARD ──────────────────────────────────────────── */
export function StatCard({ icon, label, value, sub, color = '#2D6A4F' }) {
  return (
    <div
      className="eco-card p-5 flex items-center gap-4"
      role="region"
      aria-label={label}
    >
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
        style={{ background: `${color}18` }}
      >
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold leading-none" style={{ color }}>
          {value}
        </p>
        <p className="text-xs font-medium mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
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

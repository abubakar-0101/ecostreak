/**
 * @fileoverview 404 Not Found page
 */
import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6"
      style={{ background: 'var(--color-bg)' }}>
      <div className="text-7xl mb-6 animate-float">🌿</div>
      <h1 className="text-5xl font-black mb-4 gradient-text">404</h1>
      <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--color-text)' }}>
        Lost in the forest?
      </h2>
      <p className="mb-8 max-w-sm" style={{ color: 'var(--color-text-muted)' }}>
        This page doesn't exist, but your eco journey does. Let's get you back on track.
      </p>
      <Link to="/" className="btn-primary">← Back to EcoStreak</Link>
    </div>
  )
}

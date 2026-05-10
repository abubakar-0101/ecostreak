/**
 * @fileoverview PageLoader used in Suspense fallback
 */
import React from 'react'

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

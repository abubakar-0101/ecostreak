/**
 * @fileoverview 404 Not Found – nature-journal aesthetic
 */
import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-center px-6"
      style={{ background: 'var(--color-bg)' }}
    >
      {/* Floating leaf */}
      <motion.div
        className="text-7xl mb-6"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, ease: 'easeInOut', repeat: Infinity }}
        aria-hidden="true"
      >
        🍃
      </motion.div>

      {/* 404 in Lora — earthy, not neon */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="text-6xl font-bold mb-4"
        style={{ fontFamily: "'Lora', serif", color: 'var(--green-deep)' }}
      >
        404
      </motion.h1>

      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
        className="text-2xl font-bold mb-3"
        style={{ fontFamily: "'Lora', serif", color: 'var(--green-deep)' }}
      >
        Lost in the forest?
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.18, ease: 'easeOut' }}
        className="mb-8 max-w-sm leading-relaxed"
        style={{
          color:      'var(--color-text-muted)',
          fontFamily: "'Lora', serif",
          fontStyle:  'italic',
        }}
      >
        This page doesn't exist, but your eco journey does. Let's get you back on track.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.28, ease: 'easeOut' }}
      >
        <Link to="/" className="btn-primary">← Back to EcoStreak</Link>
      </motion.div>
    </div>
  )
}

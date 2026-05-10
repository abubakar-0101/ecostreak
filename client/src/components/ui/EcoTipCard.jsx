/**
 * @fileoverview EcoTipCard – rotating field-notes style eco fact card.
 * Fades to a new tip every 8 seconds via AnimatePresence.
 * Styled as a hand-written journal page with ruled lines.
 */
import React, { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const DEFAULT_TIPS = [
  "Turning off the tap while brushing teeth saves up to 8 litres of water per minute.",
  "A single reusable bag replaces an average of 500 plastic bags over its lifetime.",
  "Line-drying laundry for one year saves as much CO₂ as a 1,600 km car journey.",
  "Eating one plant-based meal per week for a year saves the equivalent of driving 1,800 km.",
  "Fixing a dripping tap can save more than 3,000 litres of water a year.",
  "Switching to LED bulbs cuts lighting energy use by up to 75%.",
  "The fashion industry produces 10% of global carbon emissions — choosing second-hand helps.",
  "Composting food scraps diverts organic waste from landfill, cutting methane emissions.",
  "Unplugging devices on standby can reduce a household's energy use by up to 10%.",
  "Every minute in the shower uses about 8–15 litres of water.",
]

export default function EcoTipCard({ tips = DEFAULT_TIPS, intervalMs = 8000 }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (tips.length <= 1) return
    const id = setInterval(() => {
      setIndex(i => (i + 1) % tips.length)
    }, intervalMs)
    return () => clearInterval(id)
  }, [tips, intervalMs])

  const tip = tips[index]

  return (
    <div
      className="field-notes"
      role="status"
      aria-live="polite"
      aria-label="Rotating eco tip"
    >
      {/* Header row */}
      <div className="flex items-center justify-between mb-3" style={{ lineHeight: '28px' }}>
        <span
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: 'var(--green-mid)', fontFamily: "'DM Sans', sans-serif" }}
        >
          🌿 Field Note
        </span>
        {/* Dot indicators */}
        <div className="flex gap-1.5" aria-hidden="true">
          {tips.slice(0, Math.min(tips.length, 10)).map((_, i) => (
            <span
              key={i}
              style={{
                display: 'inline-block',
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: i === index ? 'var(--green-mid)' : 'var(--color-border)',
                transition: 'background 0.4s ease',
              }}
            />
          ))}
        </div>
      </div>

      {/* Animated tip text */}
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          className="field-notes-text"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        >
          "{tip}"
        </motion.p>
      </AnimatePresence>
    </div>
  )
}

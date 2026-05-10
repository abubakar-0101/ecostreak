/**
 * @fileoverview Badges collection page – earthy nature aesthetic
 * Unlocked badges: gentle scale reveal. Locked: soft opacity-0.4, bark lock icon.
 * Detail modal uses Lora headings, warm rarity pills.
 */
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { badgesAPI } from '../services/api'
import { BADGE_CONFIG, RARITY_COLORS } from '../utils/helpers'
import { Card, SkeletonCard, Modal } from '../components/ui'

export default function Badges() {
  const [unlockedIds,  setUnlockedIds]  = useState([])
  const [unlockedData, setUnlockedData] = useState({})
  const [loading,      setLoading]      = useState(true)
  const [selected,     setSelected]     = useState(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await badgesAPI.getUnlocked()
        const ids     = data.badges.map(b => b.badgeId)
        const dataMap = {}
        data.badges.forEach(b => { dataMap[b.badgeId] = b })
        setUnlockedIds(ids)
        setUnlockedData(dataMap)
      } catch { toast.error('Failed to load badges') }
      finally { setLoading(false) }
    }
    fetch()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
      </div>
    )
  }

  const unlocked = BADGE_CONFIG.filter(b =>  unlockedIds.includes(b.id))
  const locked   = BADGE_CONFIG.filter(b => !unlockedIds.includes(b.id))

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <h1
          className="text-3xl font-bold"
          style={{ fontFamily: "'Lora', serif", color: 'var(--green-deep)' }}
        >
          Badge Collection
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
          {unlocked.length} of {BADGE_CONFIG.length} badges earned
        </p>
      </motion.div>

      {/* Unlocked */}
      {unlocked.length > 0 && (
        <section>
          <h2
            className="text-lg font-bold mb-4"
            style={{ fontFamily: "'Lora', serif", color: 'var(--green-deep)' }}
          >
            🏅 Earned Badges
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {unlocked.map((badge, i) => (
              <BadgeCard
                key={badge.id}
                badge={badge}
                unlocked
                earnedAt={unlockedData[badge.id]?.earnedAt}
                delay={i * 0.08}
                onClick={() => setSelected({ ...badge, earnedAt: unlockedData[badge.id]?.earnedAt })}
              />
            ))}
          </div>
        </section>
      )}

      {/* Locked */}
      {locked.length > 0 && (
        <section>
          <h2
            className="text-lg font-bold mb-4"
            style={{ fontFamily: "'Lora', serif", color: 'var(--color-text-muted)' }}
          >
            🔒 Locked Badges
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {locked.map((badge, i) => (
              <BadgeCard
                key={badge.id}
                badge={badge}
                unlocked={false}
                delay={i * 0.06}
                onClick={() => setSelected(badge)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Badge Detail Modal */}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Badge Details">
        {selected && (
          <div className="text-center py-2">
            <div
              className={`text-6xl mb-5 mx-auto transition-all ${selected.earnedAt ? '' : 'opacity-35 grayscale'}`}
              style={selected.earnedAt ? { filter: 'drop-shadow(0 3px 8px rgba(107,76,42,0.25))' } : {}}
              aria-hidden="true"
            >
              {selected.icon}
            </div>
            <h3
              className="text-xl font-bold mb-2"
              style={{ fontFamily: "'Lora', serif", color: 'var(--green-deep)' }}
            >
              {selected.name}
            </h3>
            <span
              className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4"
              style={{
                background: RARITY_COLORS[selected.rarity]?.bg,
                color:      RARITY_COLORS[selected.rarity]?.text,
              }}
            >
              {selected.rarity}
            </span>
            <p className="text-sm mb-4 leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
              {selected.description}
            </p>
            {selected.earnedAt ? (
              <p
                className="text-xs font-medium"
                style={{ fontFamily: "'Lora', serif", fontStyle: 'italic', color: 'var(--green-mid)' }}
              >
                🌿 Earned on {new Date(selected.earnedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            ) : (
              <p className="text-xs" style={{ color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                Keep going to unlock this badge 🌱
              </p>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}

function BadgeCard({ badge, unlocked, earnedAt, delay, onClick }) {
  const rarity = RARITY_COLORS[badge.rarity]
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.45, ease: 'easeOut' }}
      whileHover={{ scale: 1.03, y: -2, transition: { duration: 0.3 } }}
      onClick={onClick}
      className="eco-card p-5 flex flex-col items-center text-center w-full relative overflow-hidden"
      aria-label={`${badge.name} badge – ${unlocked ? 'earned' : 'locked'}`}
    >
      {/* Warm background tint for unlocked */}
      {unlocked && (
        <div
          className="absolute inset-0 rounded-[14px] opacity-30"
          style={{ background: 'var(--leaf-shadow)' }}
          aria-hidden="true"
        />
      )}

      <div
        className={`text-4xl mb-3 relative transition-all ${!unlocked ? 'grayscale opacity-40' : ''}`}
      >
        {badge.icon}
      </div>
      <p
        className="text-sm font-bold leading-tight mb-1.5 relative"
        style={{ color: unlocked ? 'var(--green-deep)' : 'var(--color-text-muted)', fontFamily: "'DM Sans', sans-serif" }}
      >
        {badge.name}
      </p>
      <span
        className="text-[10px] px-2 py-0.5 rounded-full font-semibold relative"
        style={{ background: rarity?.bg, color: rarity?.text }}
      >
        {badge.rarity}
      </span>

      {/* Lock icon */}
      {!unlocked && (
        <div
          className="absolute top-2 right-2 text-xs"
          style={{ color: 'var(--color-text-muted)', opacity: 0.5 }}
          aria-hidden="true"
        >
          🔒
        </div>
      )}
    </motion.button>
  )
}

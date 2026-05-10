/**
 * @fileoverview Badges collection page with locked/unlocked states
 */
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { badgesAPI } from '../services/api'
import { BADGE_CONFIG, RARITY_COLORS } from '../utils/helpers'
import { Card, SkeletonCard, Modal } from '../components/ui'

export default function Badges() {
  const [unlockedIds, setUnlockedIds] = useState([])
  const [unlockedData, setUnlockedData] = useState({})
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await badgesAPI.getUnlocked()
        const ids = data.badges.map(b => b.badgeId)
        const dataMap = {}
        data.badges.forEach(b => { dataMap[b.badgeId] = b })
        setUnlockedIds(ids)
        setUnlockedData(dataMap)
      } catch { toast.error('Failed to load badges') }
      finally { setLoading(false) }
    }
    fetch()
  }, [])

  if (loading) return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
    </div>
  )

  const unlocked = BADGE_CONFIG.filter(b => unlockedIds.includes(b.id))
  const locked = BADGE_CONFIG.filter(b => !unlockedIds.includes(b.id))

  return (
    <div className="space-y-8 animate-fade-in-up max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold" style={{ color: 'var(--color-text)' }}>Badge Collection</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
          {unlocked.length} of {BADGE_CONFIG.length} badges earned
        </p>
      </div>

      {/* Unlocked */}
      {unlocked.length > 0 && (
        <section>
          <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--color-text)' }}>🏅 Earned Badges</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {unlocked.map((badge, i) => (
              <BadgeCard key={badge.id} badge={badge} unlocked earnedAt={unlockedData[badge.id]?.earnedAt}
                delay={i * 0.08} onClick={() => setSelected({ ...badge, earnedAt: unlockedData[badge.id]?.earnedAt })} />
            ))}
          </div>
        </section>
      )}

      {/* Locked */}
      {locked.length > 0 && (
        <section>
          <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--color-text)' }}>🔒 Locked Badges</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {locked.map((badge, i) => (
              <BadgeCard key={badge.id} badge={badge} unlocked={false}
                delay={i * 0.06} onClick={() => setSelected(badge)} />
            ))}
          </div>
        </section>
      )}

      {/* Badge Detail Modal */}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Badge Details">
        {selected && (
          <div className="text-center">
            <div className={`text-6xl mb-4 mx-auto ${selected.earnedAt ? 'animate-badge-glow' : 'opacity-40 grayscale'}`}>
              {selected.icon}
            </div>
            <h3 className="text-xl font-bold mb-1" style={{ color: 'var(--color-text)' }}>{selected.name}</h3>
            <span
              className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3"
              style={{
                background: RARITY_COLORS[selected.rarity]?.bg,
                color: RARITY_COLORS[selected.rarity]?.text,
              }}
            >
              {selected.rarity}
            </span>
            <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>{selected.description}</p>
            {selected.earnedAt ? (
              <p className="text-xs font-medium" style={{ color: 'var(--color-primary)' }}>
                ✅ Earned on {new Date(selected.earnedAt).toLocaleDateString('en-US', { month:'long', day:'numeric', year:'numeric' })}
              </p>
            ) : (
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Keep going to unlock this badge!</p>
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
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: 'spring', stiffness: 300 }}
      onClick={onClick}
      className="eco-card p-5 flex flex-col items-center text-center w-full"
      style={{ position: 'relative', overflow: 'hidden' }}
      aria-label={`${badge.name} badge`}
    >
      <div
        className={`text-4xl mb-3 transition-all ${unlocked ? 'animate-pop-in' : 'grayscale opacity-50'}`}
        style={unlocked ? { filter: 'drop-shadow(0 0 6px rgba(255,183,3,0.4))' } : {}}
      >
        {badge.icon}
      </div>
      <p className="text-sm font-bold leading-tight mb-1" style={{ color: 'var(--color-text)' }}>{badge.name}</p>
      <span
        className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
        style={{ background: rarity?.bg, color: rarity?.text }}
      >
        {badge.rarity}
      </span>
      {!unlocked && (
        <div className="absolute top-2 right-2 text-xs opacity-60">🔒</div>
      )}
    </motion.button>
  )
}

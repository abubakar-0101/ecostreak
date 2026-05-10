/**
 * @fileoverview Dashboard – main hub with today's task, leaf streak, stats, eco tip
 * Nature-journal aesthetic: Lora headings, leaf streak badge, earthy cards, field-notes tip
 */
import React, { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import confetti from 'canvas-confetti'
import { useAuthStore } from '../store'
import { tasksAPI, progressAPI, userAPI } from '../services/api'
import { getGreeting, getMotivationalMessage, getDaysSinceStart, CATEGORY_CONFIG } from '../utils/helpers'
import { Card, SkeletonCard, StatCard, ProgressBar, Button } from '../components/ui'
import EcoTipCard from '../components/ui/EcoTipCard'

// ─── Gentle leaf confetti (replaces standard confetti) ───────────────────────
const fireLeafConfetti = () => {
  confetti({
    particleCount: 70,
    spread: 70,
    origin: { y: 0.55 },
    colors: ['#4A7C2F', '#8DB87A', '#2D5016', '#A8C99A', '#F5F0E8'],
    gravity: 0.9,
    scalar: 1.1,
  })
  setTimeout(() => confetti({
    particleCount: 35, angle: 60, spread: 50,
    origin: { x: 0 }, colors: ['#4A7C2F', '#8DB87A', '#C8DDE8'],
  }), 350)
  setTimeout(() => confetti({
    particleCount: 35, angle: 120, spread: 50,
    origin: { x: 1 }, colors: ['#4A7C2F', '#8DB87A', '#F5F0E8'],
  }), 550)
}

// ─── Scroll-reveal variant (leaves settling) ──────────────────────────────────
const revealVariant = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const staggerContainer = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.10 } },
}

export default function Dashboard() {
  const user       = useAuthStore((s) => s.user)
  const updateUser = useAuthStore((s) => s.updateUser)

  const [todayTask,   setTodayTask]   = useState(null)
  const [streak,      setStreak]      = useState({ current: 0, longest: 0 })
  const [stats,       setStats]       = useState(null)
  const [loading,     setLoading]     = useState(true)
  const [completing,  setCompleting]  = useState(false)
  const [alreadyDone, setAlreadyDone] = useState(false)
  const [showLeaves,  setShowLeaves]  = useState(false)

  const fetchData = useCallback(async () => {
    try {
      const [taskRes, streakRes, statsRes] = await Promise.all([
        tasksAPI.getToday(),
        progressAPI.getStreak(),
        userAPI.getStats(),
      ])
      setTodayTask(taskRes.data.task)
      setAlreadyDone(taskRes.data.completedToday)
      setStreak(streakRes.data)
      setStats(statsRes.data)
    } catch {
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const handleComplete = async () => {
    if (alreadyDone || !todayTask || completing) return
    setCompleting(true)
    try {
      const { data } = await tasksAPI.completeTask(todayTask.dayNumber)
      setAlreadyDone(true)
      updateUser({ currentStreak: data.currentStreak, longestStreak: data.longestStreak, ecoScore: data.ecoScore })
      setStreak({ current: data.currentStreak, longest: data.longestStreak })
      fireLeafConfetti()
      setShowLeaves(true)
      setTimeout(() => setShowLeaves(false), 2200)
      toast.success(`Day ${todayTask.dayNumber} complete! +${data.pointsEarned} eco points 🌿`)
      if (data.newBadges?.length) {
        setTimeout(() => {
          data.newBadges.forEach((b) => toast.success(`🏅 Badge unlocked: ${b.name}!`, { duration: 6000 }))
        }, 1500)
      }
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not complete task')
    } finally {
      setCompleting(false)
    }
  }

  const dayNumber = getDaysSinceStart(user?.challengeStartDate)
  const greeting  = getGreeting()
  const message   = getMotivationalMessage(streak.current)
  const pct       = Math.min(100, Math.round((dayNumber / 30) * 100))

  if (loading) {
    return (
      <div className="space-y-6">
        <SkeletonCard />
        <div className="grid md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
        </div>
        <SkeletonCard />
      </div>
    )
  }

  const cat = todayTask ? CATEGORY_CONFIG[todayTask.category] : null

  return (
    <div className="space-y-7 max-w-5xl mx-auto">

      {/* ── GREETING HEADER ── */}
      <motion.div
        variants={staggerContainer} initial="hidden" animate="show"
        className="flex items-start justify-between flex-wrap gap-4"
      >
        <motion.div variants={revealVariant}>
          <h1
            className="text-3xl font-bold leading-snug"
            style={{ fontFamily: "'Lora', serif", color: 'var(--green-deep)' }}
          >
            {greeting}, {user?.username} 👋
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            {message}
          </p>
        </motion.div>

        {/* Leaf streak badge (replaces flame) */}
        <motion.div variants={revealVariant}>
          <div className="streak-badge" aria-label={`Day ${dayNumber} of 30`}>
            <span
              className="text-base"
              style={{ animation: streak.current > 0 ? 'leafSway 3s ease-in-out infinite' : 'none' }}
              aria-hidden="true"
            >
              🍃
            </span>
            <span>Day {dayNumber} of 30</span>
          </div>
          {streak.current === 0 && (
            <p className="text-xs mt-1.5 text-center" style={{ color: 'var(--bark)' }}>
              Keep your streak alive! 🌱
            </p>
          )}
        </motion.div>
      </motion.div>

      {/* ── CHALLENGE PROGRESS (animated bar) ── */}
      <motion.div
        variants={revealVariant} initial="hidden" animate="show"
        transition={{ delay: 0.1 }}
      >
        <Card>
          <div className="flex justify-between text-sm mb-3 font-medium" style={{ color: 'var(--color-text)' }}>
            <span style={{ fontFamily: "'Lora', serif" }}>
              Your forest is growing 🌱 — {dayNumber} of 30 days
            </span>
            <span style={{ color: 'var(--green-mid)', fontWeight: 600 }}>{pct}%</span>
          </div>

          {/* Animated progress bar */}
          <ProgressBar value={dayNumber} max={30} />

          {/* Milestone markers */}
          <div className="flex justify-between mt-3" aria-hidden="true">
            {[7, 14, 21, 30].map(m => (
              <div key={m} className="flex flex-col items-center gap-1">
                <div
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
                    dayNumber >= m
                      ? 'scale-110'
                      : ''
                  }`}
                  style={{
                    background: dayNumber >= m ? 'var(--green-mid)' : 'var(--color-border)',
                    boxShadow: dayNumber >= m ? '0 0 0 3px rgba(74,124,47,0.18)' : 'none',
                  }}
                />
                <span className="text-[10px]" style={{ color: dayNumber >= m ? 'var(--green-mid)' : 'var(--color-text-muted)' }}>
                  Day {m}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* ── QUICK STATS ── */}
      <motion.div
        variants={staggerContainer} initial="hidden" animate="show"
        transition={{ delayChildren: 0.15 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <motion.div variants={revealVariant}>
          <StatCard icon="🍃" label="Current Streak" value={`${streak.current}d`} color="var(--green-mid)" />
        </motion.div>
        <motion.div variants={revealVariant}>
          <StatCard icon="🌿" label="Longest Streak" value={`${streak.longest}d`} color="var(--green-deep)" />
        </motion.div>
        <motion.div variants={revealVariant}>
          <StatCard icon="🌍" label="Eco Score" value={stats?.ecoScore ?? 0} color="var(--bark)" />
        </motion.div>
        <motion.div variants={revealVariant}>
          <StatCard icon="🏅" label="Badges" value={stats?.badgeCount ?? 0} color="var(--color-gold)" />
        </motion.div>
      </motion.div>

      {/* ── TODAY'S TASK CARD ── */}
      {todayTask ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
          className="eco-card p-6 relative overflow-hidden"
        >
          {/* Subtle bark-toned corner accent — no garish blobs */}
          <div
            className="absolute top-0 right-0 w-36 h-36 rounded-full opacity-[0.04] -translate-y-1/2 translate-x-1/2 pointer-events-none"
            style={{ background: 'var(--bark)' }}
            aria-hidden="true"
          />

          <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
            <div>
              {/* Day badge — circular bark-brown */}
              <div className="flex items-center gap-2.5 mb-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                  style={{ background: 'var(--bark)', fontFamily: "'DM Sans', sans-serif" }}
                  aria-label={`Day ${todayTask.dayNumber}`}
                >
                  {todayTask.dayNumber}
                </div>
                <span
                  className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                  style={{ background: cat?.bg, color: cat?.color }}
                >
                  {cat?.icon} {todayTask.category}
                </span>
                <span className={`pill-${todayTask.difficulty.toLowerCase()}`}>{todayTask.difficulty}</span>
                <span
                  className="text-xs px-2.5 py-1 rounded-full"
                  style={{ background: 'var(--leaf-shadow)', color: 'var(--color-text-muted)' }}
                >
                  ⏱ {todayTask.estimatedMinutes} min
                </span>
              </div>

              <h2
                className="text-xl font-bold"
                style={{ fontFamily: "'Lora', serif", color: 'var(--green-deep)' }}
              >
                {todayTask.title}
              </h2>
            </div>

            {/* Completed badge */}
            <AnimatePresence>
              {alreadyDone && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [1, 1.15, 1], opacity: 1 }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                  className="flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-semibold"
                  style={{ background: 'var(--leaf-shadow)', color: 'var(--green-deep)', border: '1.5px solid var(--green-light)' }}
                >
                  🌿 Completed Today
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--color-text-muted)' }}>
            {todayTask.description}
          </p>

          {/* Impact preview row */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { icon: '💧', label: `${todayTask.waterSaved}L water`,      color: '#3B7EA8' },
              { icon: '🌿', label: `${todayTask.co2Reduced}g CO₂`,        color: 'var(--green-mid)' },
              { icon: '♻️', label: `${todayTask.plasticAvoided}g plastic`, color: 'var(--bark)' },
            ].map(({ icon, label, color }) => (
              <div
                key={label}
                className="text-center p-3 rounded-xl"
                style={{ background: 'var(--leaf-shadow)', border: '1px solid var(--color-border)' }}
              >
                <div className="text-xl" aria-hidden="true">{icon}</div>
                <div className="text-xs font-semibold mt-1" style={{ color }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Eco fact — field-notes style */}
          {todayTask.ecoFactTip && (
            <div
              className="p-4 rounded-xl mb-5"
              style={{ background: 'var(--leaf-shadow)', borderLeft: '3px solid var(--green-mid)' }}
            >
              <p
                className="text-sm"
                style={{ fontFamily: "'Lora', serif", fontStyle: 'italic', color: 'var(--bark)' }}
              >
                💡 {todayTask.ecoFactTip}
              </p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 flex-wrap">
            <Button
              onClick={handleComplete}
              disabled={alreadyDone}
              loading={completing}
              className="flex-1 text-base py-4"
            >
              {alreadyDone ? '🌿 Task Complete!' : '🌿 Mark as Complete'}
            </Button>
            <Link to="/tasks" className="btn-secondary py-4 px-6 text-sm">
              View Details
            </Link>
          </div>
        </motion.div>
      ) : (
        <Card>
          <div className="text-center py-10">
            <div className="text-5xl mb-4 animate-float" aria-hidden="true">🌳</div>
            <h3
              className="text-xl font-bold mb-2"
              style={{ fontFamily: "'Lora', serif", color: 'var(--green-deep)' }}
            >
              Challenge Complete!
            </h3>
            <p className="mb-5" style={{ color: 'var(--color-text-muted)' }}>
              You've finished all 30 days. Your forest is fully grown 🌿
            </p>
            <Link to="/report" className="btn-primary inline-flex">View My Impact Report →</Link>
          </div>
        </Card>
      )}

      {/* ── ECO TIP CARD — rotating field-notes ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35, ease: 'easeOut' }}
      >
        <EcoTipCard tips={todayTask?.ecoFactTip ? [todayTask.ecoFactTip] : undefined} />
      </motion.div>

      {/* ── CUMULATIVE IMPACT TEASER ── */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45, ease: 'easeOut' }}
        >
          <Card>
            <h3
              className="font-bold mb-4"
              style={{ fontFamily: "'Lora', serif", color: 'var(--green-deep)' }}
            >
              🌍 Your Cumulative Impact
            </h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              {[
                { v: stats.totalWaterSaved,                          unit: 'L',  label: 'Water Saved',    color: '#3B7EA8' },
                { v: (stats.totalCO2Reduced / 1000).toFixed(2),     unit: 'kg', label: 'CO₂ Reduced',    color: 'var(--green-mid)' },
                { v: stats.totalPlasticAvoided,                      unit: 'g',  label: 'Plastic Avoided', color: 'var(--bark)' },
              ].map(({ v, unit, label, color }) => (
                <div key={label}>
                  <p className="text-2xl font-bold" style={{ color, fontFamily: "'Lora', serif" }}>
                    {v}<span className="text-sm ml-1">{unit}</span>
                  </p>
                  <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>{label}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 text-center">
              <Link
                to="/impact"
                className="text-sm font-semibold hover:underline"
                style={{ color: 'var(--green-mid)' }}
              >
                View Full Impact Stats →
              </Link>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  )
}

/**
 * @fileoverview Dashboard – main hub with today's task, streak, stats
 */
import React, { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import confetti from 'canvas-confetti'
import { useAuthStore } from '../store'
import { tasksAPI, progressAPI, userAPI } from '../services/api'
import { getGreeting, getMotivationalMessage, getDaysSinceStart, CATEGORY_CONFIG } from '../utils/helpers'
import { Card, SkeletonCard, StatCard, ProgressBar } from '../components/ui'
import { Button } from '../components/ui'

const DIFF_COLOR = { Easy: '#22c55e', Medium: '#f59e0b', Hard: '#ef4444' }

export default function Dashboard() {
  const user = useAuthStore((s) => s.user)
  const updateUser = useAuthStore((s) => s.updateUser)

  const [todayTask, setTodayTask] = useState(null)
  const [streak, setStreak] = useState({ current: 0, longest: 0 })
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [completing, setCompleting] = useState(false)
  const [alreadyDone, setAlreadyDone] = useState(false)

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

  /** Fire confetti burst on task completion */
  const fireConfetti = () => {
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 },
      colors: ['#2D6A4F','#52B788','#95D5B2','#FFB703'] })
    setTimeout(() => confetti({ particleCount: 60, angle: 60, spread: 55, origin: { x: 0 } }), 250)
    setTimeout(() => confetti({ particleCount: 60, angle: 120, spread: 55, origin: { x: 1 } }), 400)
  }

  const handleComplete = async () => {
    if (alreadyDone || !todayTask || completing) return
    setCompleting(true)
    try {
      const { data } = await tasksAPI.completeTask(todayTask.dayNumber)
      setAlreadyDone(true)
      updateUser({ currentStreak: data.currentStreak, longestStreak: data.longestStreak, ecoScore: data.ecoScore })
      setStreak({ current: data.currentStreak, longest: data.longestStreak })
      fireConfetti()
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
  const greeting = getGreeting()
  const message = getMotivationalMessage(streak.current)

  if (loading) {
    return (
      <div className="space-y-6">
        <SkeletonCard />
        <div className="grid md:grid-cols-3 gap-4">
          {[1,2,3].map(i => <SkeletonCard key={i} />)}
        </div>
        <SkeletonCard />
      </div>
    )
  }

  const cat = todayTask ? CATEGORY_CONFIG[todayTask.category] : null

  return (
    <div className="space-y-6 animate-fade-in-up max-w-5xl mx-auto">

      {/* ── GREETING HEADER ── */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--color-text)' }}>
            {greeting}, {user?.username}! 👋
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            {message}
          </p>
        </div>
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
          style={{ background: 'linear-gradient(135deg,#FFB70318,#FFB70330)', color: '#d97706', border: '1px solid #FFB70340' }}
        >
          <span className={streak.current > 0 ? 'animate-bounce-flame streak-flame-active' : ''}>🔥</span>
          Day {dayNumber} of 30
        </div>
      </div>

      {/* ── PROGRESS BAR ── */}
      <Card>
        <div className="flex justify-between text-sm mb-3 font-medium" style={{ color: 'var(--color-text)' }}>
          <span>Challenge Progress</span>
          <span>{dayNumber}/30 days</span>
        </div>
        <ProgressBar value={dayNumber} max={30} />
        <div className="flex justify-between mt-2">
          {[7,14,21,30].map(m => (
            <div key={m} className="flex flex-col items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${dayNumber >= m ? 'bg-green-500' : 'bg-gray-300'}`} />
              <span className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>Day {m}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* ── QUICK STATS ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon="🔥" label="Current Streak" value={`${streak.current}d`} color="#f59e0b" />
        <StatCard icon="⚡" label="Longest Streak" value={`${streak.longest}d`} color="#8b5cf6" />
        <StatCard icon="🌿" label="Eco Score" value={stats?.ecoScore ?? 0} color="#2D6A4F" />
        <StatCard icon="🏅" label="Badges" value={stats?.badgeCount ?? 0} color="#FFB703" />
      </div>

      {/* ── TODAY'S TASK CARD ── */}
      {todayTask ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="eco-card p-6 relative overflow-hidden"
        >
          {/* Background accent */}
          <div
            className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-5 -translate-y-1/2 translate-x-1/2"
            style={{ background: cat?.color || '#2D6A4F' }}
          />

          <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full"
                  style={{ background: cat?.bg, color: cat?.color }}>
                  {cat?.icon} {todayTask.category}
                </span>
                <span className={`pill-${todayTask.difficulty.toLowerCase()}`}>{todayTask.difficulty}</span>
                <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'var(--color-border)', color: 'var(--color-text-muted)' }}>
                  ⏱ {todayTask.estimatedMinutes} min
                </span>
              </div>
              <h2 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>
                Day {todayTask.dayNumber}: {todayTask.title}
              </h2>
            </div>
            {alreadyDone && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-green-700 bg-green-100">
                ✅ Completed Today
              </div>
            )}
          </div>

          <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--color-text-muted)' }}>
            {todayTask.description}
          </p>

          {/* Impact preview */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { icon: '💧', label: `${todayTask.waterSaved}L water`, color: '#3b82f6' },
              { icon: '🌿', label: `${todayTask.co2Reduced}g CO₂`, color: '#2D6A4F' },
              { icon: '♻️', label: `${todayTask.plasticAvoided}g plastic`, color: '#f59e0b' },
            ].map(({ icon, label, color }) => (
              <div key={label} className="text-center p-3 rounded-xl" style={{ background: `${color}12` }}>
                <div className="text-xl">{icon}</div>
                <div className="text-xs font-medium mt-1" style={{ color }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Eco fact */}
          {todayTask.ecoFactTip && (
            <div className="p-4 rounded-xl mb-5" style={{ background: 'rgba(45,106,79,0.07)', borderLeft: '3px solid #2D6A4F' }}>
              <p className="text-xs font-medium" style={{ color: 'var(--color-primary)' }}>
                💡 Did You Know? {todayTask.ecoFactTip}
              </p>
            </div>
          )}

          {/* Complete button */}
          <div className="flex gap-3 flex-wrap">
            <Button
              onClick={handleComplete}
              disabled={alreadyDone}
              loading={completing}
              className="flex-1 text-base py-4"
            >
              {alreadyDone ? '✅ Task Complete!' : '🌿 Mark as Complete'}
            </Button>
            <Link to="/tasks" className="btn-secondary py-4 px-6 text-sm">
              View Details
            </Link>
          </div>
        </motion.div>
      ) : (
        <Card>
          <div className="text-center py-8">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
              Challenge Complete!
            </h3>
            <p style={{ color: 'var(--color-text-muted)' }}>You've finished all 30 days. Check your Impact Report!</p>
            <Link to="/report" className="btn-primary mt-4 inline-flex">View My Report →</Link>
          </div>
        </Card>
      )}

      {/* ── IMPACT TEASER ── */}
      {stats && (
        <Card>
          <h3 className="font-bold mb-4" style={{ color: 'var(--color-text)' }}>🌍 Your Cumulative Impact</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { v: stats.totalWaterSaved, unit: 'L', label: 'Water Saved', color: '#3b82f6' },
              { v: (stats.totalCO2Reduced / 1000).toFixed(2), unit: 'kg', label: 'CO₂ Reduced', color: '#2D6A4F' },
              { v: stats.totalPlasticAvoided, unit: 'g', label: 'Plastic Avoided', color: '#f59e0b' },
            ].map(({ v, unit, label, color }) => (
              <div key={label}>
                <p className="text-2xl font-bold" style={{ color }}>{v}<span className="text-sm ml-1">{unit}</span></p>
                <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>{label}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Link to="/impact" className="text-sm font-medium hover:underline" style={{ color: 'var(--color-primary)' }}>
              View Full Impact Stats →
            </Link>
          </div>
        </Card>
      )}
    </div>
  )
}

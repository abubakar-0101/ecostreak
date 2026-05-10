/**
 * @fileoverview Daily Task detail page – earthy nature aesthetic
 */
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import confetti from 'canvas-confetti'
import { motion } from 'framer-motion'
import { tasksAPI, progressAPI } from '../services/api'
import { getDaysSinceStart, CATEGORY_CONFIG } from '../utils/helpers'
import { useAuthStore } from '../store'
import { Card, SkeletonCard, ProgressBar, Button } from '../components/ui'
import EcoTipCard from '../components/ui/EcoTipCard'

const fireLeafConfetti = () => {
  confetti({
    particleCount: 70,
    spread: 65,
    origin: { y: 0.6 },
    colors: ['#4A7C2F', '#8DB87A', '#2D5016', '#A8C99A', '#F5F0E8'],
    gravity: 0.9,
  })
}

export default function Tasks() {
  const user       = useAuthStore((s) => s.user)
  const updateUser = useAuthStore((s) => s.updateUser)
  const [task,           setTask]           = useState(null)
  const [completedToday, setCompletedToday] = useState(false)
  const [loading,        setLoading]        = useState(true)
  const [completing,     setCompleting]     = useState(false)
  const [calendar,       setCalendar]       = useState([])

  const dayNumber = getDaysSinceStart(user?.challengeStartDate)

  useEffect(() => {
    const fetch = async () => {
      try {
        const [taskRes, calRes] = await Promise.all([
          tasksAPI.getToday(),
          progressAPI.getCalendar(),
        ])
        setTask(taskRes.data.task)
        setCompletedToday(taskRes.data.completedToday)
        setCalendar(calRes.data.days || [])
      } catch { toast.error('Failed to load task') }
      finally { setLoading(false) }
    }
    fetch()
  }, [])

  const handleComplete = async () => {
    if (completedToday || !task || completing) return
    setCompleting(true)
    try {
      const { data } = await tasksAPI.completeTask(task.dayNumber)
      setCompletedToday(true)
      updateUser({ currentStreak: data.currentStreak, ecoScore: data.ecoScore })
      fireLeafConfetti()
      toast.success(`Day ${task.dayNumber} complete! 🌿 +${data.pointsEarned} pts`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error completing task')
    } finally {
      setCompleting(false)
    }
  }

  if (loading) return <div className="space-y-4"><SkeletonCard /><SkeletonCard /></div>

  const cat = task ? CATEGORY_CONFIG[task.category] : null

  return (
    <div className="space-y-7 max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <h1
          className="text-3xl font-bold"
          style={{ fontFamily: "'Lora', serif", color: 'var(--green-deep)' }}
        >
          Today's Eco Task
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
          Day {dayNumber} of 30
        </p>
      </motion.div>

      {task ? (
        <>
          <motion.div
            className="eco-card p-6"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08, ease: 'easeOut' }}
          >
            {/* Category + meta */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
              {/* Bark-brown day badge */}
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0 leading-none"
                style={{ background: 'var(--bark)', fontFamily: "'DM Sans', sans-serif" }}
                aria-label={`Day ${task.dayNumber}`}
              >
                {task.dayNumber}
              </div>
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold leading-none"
                style={{ background: cat?.bg, color: cat?.color }}
              >
                <span aria-hidden="true" className="text-[14px] leading-none">{cat?.icon}</span>
                <span>{task.category}</span>
              </span>
              <span className={`pill-${task.difficulty.toLowerCase()} inline-flex items-center px-3 py-1.5 leading-none`}>
                {task.difficulty}
              </span>
              <span
                className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium leading-none"
                style={{ background: 'var(--leaf-shadow)', color: 'var(--color-text-muted)' }}
              >
                <span aria-hidden="true" className="text-[14px] leading-none">⏱️</span>
                <span>{task.estimatedMinutes} minutes</span>
              </span>
            </div>

            <h2
              className="text-2xl font-bold mb-3"
              style={{ fontFamily: "'Lora', serif", color: 'var(--green-deep)' }}
            >
              {task.title}
            </h2>
            <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--color-text-muted)' }}>
              {task.description}
            </p>

            {/* Impact row */}
            <h3
              className="text-sm font-bold mb-3"
              style={{ fontFamily: "'Lora', serif", color: 'var(--color-text)' }}
            >
              🌍 Your Impact Today
            </h3>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { icon: '💧', label: `${task.waterSaved}L`,         sub: 'water',   color: '#3B7EA8' },
                { icon: '🌿', label: `${task.co2Reduced}g`,         sub: 'CO₂',     color: 'var(--green-mid)' },
                { icon: '♻️', label: `${task.plasticAvoided}g`,     sub: 'plastic', color: 'var(--bark)' },
              ].map(({ icon, label, sub, color }) => (
                <div
                  key={sub}
                  className="p-4 rounded-xl text-center"
                  style={{ background: 'var(--leaf-shadow)', border: '1px solid var(--color-border)' }}
                >
                  <div className="text-2xl" aria-hidden="true">{icon}</div>
                  <p
                    className="text-lg font-bold mt-1"
                    style={{ color, fontFamily: "'Lora', serif" }}
                  >
                    {label}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{sub} saved</p>
                </div>
              ))}
            </div>

            {/* Eco fact — field-notes inline style */}
            {task.ecoFactTip && (
              <div
                className="p-4 rounded-xl mb-6"
                style={{
                  background:  'var(--leaf-shadow)',
                  borderLeft:  '3px solid var(--green-mid)',
                }}
              >
                <p
                  className="text-sm"
                  style={{
                    fontFamily: "'Lora', serif",
                    fontStyle:  'italic',
                    color:      'var(--bark)',
                  }}
                >
                  💡 {task.ecoFactTip}
                </p>
              </div>
            )}

            <Button
              onClick={handleComplete}
              loading={completing}
              disabled={completedToday}
              className="w-full text-base py-4"
            >
              {completedToday ? '🌿 Completed Today!' : '🌿 Mark as Complete'}
            </Button>
          </motion.div>

          {/* Rotating eco tip */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          >
            <EcoTipCard />
          </motion.div>

          {/* Recent completions */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
          >
            <Card>
              <h3
                className="font-bold mb-4"
                style={{ fontFamily: "'Lora', serif", color: 'var(--green-deep)' }}
              >
                Recent Completions
              </h3>
              <div className="space-y-2">
                {calendar.filter(d => d.status === 'complete').slice(-5).reverse().map(d => (
                  <div
                    key={d.dayNumber}
                    className="flex justify-between items-center py-2.5 border-b last:border-0"
                    style={{ borderColor: 'var(--color-border)' }}
                  >
                    <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                      Day {d.dayNumber}
                    </span>
                    <span
                      className="text-xs font-medium"
                      style={{ color: 'var(--green-mid)' }}
                    >
                      🌿 {new Date(d.completedAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
                {calendar.filter(d => d.status === 'complete').length === 0 && (
                  <p className="text-sm text-center py-4" style={{ color: 'var(--color-text-muted)', fontFamily: "'Lora', serif", fontStyle: 'italic' }}>
                    No completed days yet. Start today! 🌱
                  </p>
                )}
              </div>
            </Card>
          </motion.div>
        </>
      ) : (
        <Card>
          <div className="text-center py-12">
            <div className="text-5xl mb-4 animate-float" aria-hidden="true">🌳</div>
            <h3
              className="text-xl font-bold mb-2"
              style={{ fontFamily: "'Lora', serif", color: 'var(--green-deep)' }}
            >
              All Done!
            </h3>
            <p style={{ color: 'var(--color-text-muted)' }}>
              You've completed the full 30-day challenge. Your forest is grown 🌿
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}

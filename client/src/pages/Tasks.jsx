/**
 * @fileoverview Daily Task detail page
 */
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import confetti from 'canvas-confetti'
import { motion } from 'framer-motion'
import { tasksAPI, progressAPI } from '../services/api'
import { getDaysSinceStart, CATEGORY_CONFIG } from '../utils/helpers'
import { useAuthStore } from '../store'
import { Card, SkeletonCard, ProgressBar, Button } from '../components/ui'

export default function Tasks() {
  const user = useAuthStore((s) => s.user)
  const updateUser = useAuthStore((s) => s.updateUser)
  const [task, setTask] = useState(null)
  const [completedToday, setCompletedToday] = useState(false)
  const [loading, setLoading] = useState(true)
  const [completing, setCompleting] = useState(false)
  const [calendar, setCalendar] = useState([])

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
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } })
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
    <div className="space-y-6 animate-fade-in-up max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold" style={{ color: 'var(--color-text)' }}>Today's Eco Task</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>Day {dayNumber} of 30</p>
      </div>

      {task ? (
        <>
          <motion.div className="eco-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Category + meta */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold"
                style={{ background: cat?.bg, color: cat?.color }}>
                {cat?.icon} {task.category}
              </span>
              <span className={`pill-${task.difficulty.toLowerCase()}`}>{task.difficulty}</span>
              <span className="text-xs px-3 py-1 rounded-full font-medium"
                style={{ background: 'var(--color-border)', color: 'var(--color-text-muted)' }}>
                ⏱ {task.estimatedMinutes} minutes
              </span>
            </div>

            <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--color-text)' }}>
              {task.title}
            </h2>
            <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--color-text-muted)' }}>
              {task.description}
            </p>

            {/* Impact */}
            <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--color-text)' }}>🌍 Your Impact Today</h3>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { icon:'💧', label:`${task.waterSaved}L`, sub:'water', color:'#3b82f6' },
                { icon:'🌿', label:`${task.co2Reduced}g`, sub:'CO₂', color:'#2D6A4F' },
                { icon:'♻️', label:`${task.plasticAvoided}g`, sub:'plastic', color:'#f59e0b' },
              ].map(({ icon, label, sub, color }) => (
                <div key={sub} className="p-4 rounded-xl text-center" style={{ background: `${color}12` }}>
                  <div className="text-2xl">{icon}</div>
                  <p className="text-lg font-bold mt-1" style={{ color }}>{label}</p>
                  <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{sub} saved</p>
                </div>
              ))}
            </div>

            {/* Did you know */}
            {task.ecoFactTip && (
              <div className="p-4 rounded-xl mb-6"
                style={{ background:'rgba(45,106,79,0.07)', borderLeft:'3px solid #2D6A4F' }}>
                <p className="text-sm font-medium" style={{ color:'var(--color-primary)' }}>
                  💡 Did You Know? {task.ecoFactTip}
                </p>
              </div>
            )}

            <Button onClick={handleComplete} loading={completing} disabled={completedToday}
              className="w-full text-base py-4">
              {completedToday ? '✅ Completed Today!' : '🌿 Mark as Complete'}
            </Button>
          </motion.div>

          {/* Completed days list */}
          <Card>
            <h3 className="font-bold mb-4" style={{ color: 'var(--color-text)' }}>Recent Completions</h3>
            <div className="space-y-2">
              {calendar.filter(d => d.status === 'complete').slice(-5).reverse().map(d => (
                <div key={d.dayNumber} className="flex justify-between items-center py-2 border-b last:border-0"
                  style={{ borderColor: 'var(--color-border)' }}>
                  <span className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>Day {d.dayNumber}</span>
                  <span className="text-xs text-green-600">✅ {new Date(d.completedAt).toLocaleDateString()}</span>
                </div>
              ))}
              {calendar.filter(d => d.status === 'complete').length === 0 && (
                <p className="text-sm text-center py-4" style={{ color: 'var(--color-text-muted)' }}>
                  No completed days yet. Start today! 🌱
                </p>
              )}
            </div>
          </Card>
        </>
      ) : (
        <Card>
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🎉</div>
            <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>All Done!</h3>
            <p style={{ color: 'var(--color-text-muted)' }}>You've completed the 30-day challenge!</p>
          </div>
        </Card>
      )}
    </div>
  )
}

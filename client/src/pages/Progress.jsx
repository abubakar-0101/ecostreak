/**
 * @fileoverview Progress Calendar page – 30-day visual grid
 */
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { progressAPI } from '../services/api'
import { useAuthStore } from '../store'
import { getDaysSinceStart, MILESTONES } from '../utils/helpers'
import { Card, SkeletonCard, ProgressBar } from '../components/ui'

export default function Progress() {
  const user = useAuthStore((s) => s.user)
  const [calendar, setCalendar] = useState([])
  const [streak, setStreak] = useState({ current: 0, longest: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const [calRes, strRes] = await Promise.all([progressAPI.getCalendar(), progressAPI.getStreak()])
        setCalendar(calRes.data.days || [])
        setStreak(strRes.data)
      } catch { toast.error('Failed to load progress') }
      finally { setLoading(false) }
    }
    fetch()
  }, [])

  const dayNumber = getDaysSinceStart(user?.challengeStartDate)
  const completed = calendar.filter(d => d.status === 'complete').length

  if (loading) return <div className="space-y-6"><SkeletonCard /><SkeletonCard /></div>

  return (
    <div className="space-y-6 animate-fade-in-up max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold" style={{ color: 'var(--color-text)' }}>Progress Tracker</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>Your 30-day eco journey at a glance</p>
      </div>

      {/* Streak cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: '🔥', label: 'Current Streak', value: `${streak.current} days`, color: '#f59e0b' },
          { icon: '⚡', label: 'Longest Streak', value: `${streak.longest} days`, color: '#8b5cf6' },
          { icon: '✅', label: 'Days Complete', value: `${completed}/30`, color: '#2D6A4F' },
          { icon: '📅', label: 'Day Number', value: `Day ${dayNumber}`, color: '#3b82f6' },
        ].map(({ icon, label, value, color }) => (
          <Card key={label} className="text-center p-4">
            <div className="text-3xl mb-1">{icon}</div>
            <p className="text-xl font-bold" style={{ color }}>{value}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>{label}</p>
          </Card>
        ))}
      </div>

      {/* Overall progress */}
      <Card>
        <div className="flex justify-between mb-3 text-sm font-medium" style={{ color: 'var(--color-text)' }}>
          <span>Challenge Progress</span><span>{completed}/30 days</span>
        </div>
        <ProgressBar value={completed} max={30} />
        {/* Milestone markers */}
        <div className="flex justify-between mt-3">
          {MILESTONES.map(m => (
            <div key={m} className="flex flex-col items-center gap-1">
              <div className={`w-3 h-3 rounded-full border-2 transition-colors ${
                completed >= m ? 'bg-green-500 border-green-500' : 'bg-white border-gray-300'}`} />
              <span className="text-[10px] font-medium" style={{ color: completed >= m ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>
                Day {m}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Calendar grid */}
      <Card>
        <h2 className="text-lg font-bold mb-5" style={{ color: 'var(--color-text)' }}>📅 30-Day Calendar</h2>
        <div className="grid grid-cols-6 sm:grid-cols-10 gap-2">
          {Array.from({ length: 30 }, (_, i) => {
            const dayNum = i + 1
            const dayData = calendar.find(d => d.dayNumber === dayNum)
            const status = dayData?.status || (dayNum > dayNumber ? 'future' : 'missed')
            const isToday = dayNum === dayNumber

            return (
              <motion.div
                key={dayNum}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.02 }}
                className={`
                  aspect-square rounded-xl flex flex-col items-center justify-center text-sm font-bold
                  relative border transition-all
                  ${status === 'complete' ? 'calendar-day-complete border-transparent' : ''}
                  ${status === 'missed' ? 'calendar-day-missed' : ''}
                  ${status === 'future' ? 'calendar-day-future border-dashed' : ''}
                  ${isToday && status !== 'complete' ? 'calendar-day-today' : ''}
                `}
                style={status === 'future' ? { borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' } : {}}
                title={`Day ${dayNum}${dayData?.completedAt ? ` – Completed` : ''}`}
              >
                <span className="text-xs leading-none">{dayNum}</span>
                <span className="text-sm mt-0.5 leading-none">
                  {status === 'complete' ? '✓' : status === 'missed' ? '✕' : status === 'future' ? '🔒' : ''}
                </span>
                {isToday && status !== 'complete' && (
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse-glow" />
                )}
                {MILESTONES.includes(dayNum) && (
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 text-[8px]">⭐</div>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-5 text-xs" style={{ color: 'var(--color-text-muted)' }}>
          {[
            { color: '#2D6A4F', label: '✓ Completed' },
            { color: '#E63946', label: '✕ Missed' },
            { color: '#f59e0b', label: '⭐ Milestone' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded" style={{ background: color }} />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

/**
 * @fileoverview Progress Calendar – 30-day visual grid with vine-growth ring
 * Nature aesthetic: earthy calendar cells, circular forest-green progress ring,
 * leaf-shadow milestone markers, gentle stagger reveal on cells
 */
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { progressAPI } from '../services/api'
import { useAuthStore } from '../store'
import { getDaysSinceStart, MILESTONES } from '../utils/helpers'
import { Card, SkeletonCard, ProgressBar } from '../components/ui'

// ─── Circular vine-growth progress ring ─────────────────────────────────────
function VineRing({ completed, total = 30 }) {
  const radius        = 52
  const circumference = 2 * Math.PI * radius
  const pct           = Math.min(1, completed / total)
  const offset        = circumference * (1 - pct)

  return (
    <div className="flex flex-col items-center gap-3">
      <svg width="140" height="140" viewBox="0 0 140 140" aria-hidden="true">
        {/* Track ring */}
        <circle
          cx="70" cy="70" r={radius}
          fill="none"
          stroke="var(--leaf-shadow)"
          strokeWidth="10"
        />
        {/* Vine growth ring */}
        <circle
          cx="70" cy="70" r={radius}
          fill="none"
          stroke="var(--green-mid)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 70 70)"
          style={{ transition: 'stroke-dashoffset 1.4s ease-in-out' }}
        />
        {/* Centre label */}
        <text
          x="70" y="65"
          textAnchor="middle"
          fill="var(--green-deep)"
          fontSize="22"
          fontWeight="700"
          fontFamily="'Lora', serif"
        >
          {completed}
        </text>
        <text
          x="70" y="83"
          textAnchor="middle"
          fill="var(--color-text-muted)"
          fontSize="11"
          fontFamily="'DM Sans', sans-serif"
        >
          of {total} days
        </text>
      </svg>
      <p
        className="text-sm font-medium text-center"
        style={{ fontFamily: "'Lora', serif", fontStyle: 'italic', color: 'var(--bark)' }}
      >
        Your forest is growing 🌱
      </p>
      {/* Accessible progress value */}
      <div
        role="progressbar"
        aria-valuenow={completed}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={`${completed} of ${total} days completed`}
        className="sr-only"
      />
    </div>
  )
}

export default function Progress() {
  const user     = useAuthStore((s) => s.user)
  const [calendar, setCalendar] = useState([])
  const [streak,   setStreak]   = useState({ current: 0, longest: 0 })
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const [calRes, strRes] = await Promise.all([
          progressAPI.getCalendar(),
          progressAPI.getStreak(),
        ])
        setCalendar(calRes.data.days || [])
        setStreak(strRes.data)
      } catch {
        toast.error('Failed to load progress')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const dayNumber = getDaysSinceStart(user?.challengeStartDate)
  const completed = calendar.filter(d => d.status === 'complete').length

  if (loading) {
    return <div className="space-y-6"><SkeletonCard /><SkeletonCard /></div>
  }

  return (
    <div className="space-y-7 max-w-4xl mx-auto">

      {/* ── Page header ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <h1
          className="text-3xl font-bold"
          style={{ fontFamily: "'Lora', serif", color: 'var(--green-deep)' }}
        >
          Progress Tracker
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
          Your 30-day eco journey, day by day
        </p>
      </motion.div>

      {/* ── Vine ring + streak stats row ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.08, ease: 'easeOut' }}
        className="grid md:grid-cols-2 gap-6"
      >
        {/* Vine-growth ring */}
        <Card className="flex items-center justify-center py-4">
          <VineRing completed={completed} total={30} />
        </Card>

        {/* Streak + stats grid */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon: '🍃', label: 'Current Streak', value: `${streak.current} days`, color: 'var(--green-mid)' },
            { icon: '🌿', label: 'Longest Streak',  value: `${streak.longest} days`, color: 'var(--green-deep)' },
            { icon: '✅', label: 'Days Complete',   value: `${completed}/30`,         color: 'var(--bark)' },
            { icon: '📅', label: 'Current Day',     value: `Day ${dayNumber}`,        color: '#3B7EA8' },
          ].map(({ icon, label, value, color }) => (
            <Card key={label} className="text-center py-5 px-3">
              <div className="text-3xl mb-1" aria-hidden="true">{icon}</div>
              <p className="text-lg font-bold" style={{ color, fontFamily: "'Lora', serif" }}>
                {value}
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{label}</p>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* ── Overall progress bar ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.16, ease: 'easeOut' }}
      >
        <Card>
          <div
            className="flex justify-between mb-3 text-sm font-semibold"
            style={{ color: 'var(--color-text)' }}
          >
            <span style={{ fontFamily: "'Lora', serif" }}>Challenge Progress</span>
            <span style={{ color: 'var(--green-mid)' }}>{completed}/30 days</span>
          </div>
          <ProgressBar value={completed} max={30} />

          {/* Milestone markers */}
          <div className="flex justify-between mt-3" aria-hidden="true">
            {MILESTONES.map(m => (
              <div key={m} className="flex flex-col items-center gap-1">
                <div
                  className="w-3 h-3 rounded-full border-2 transition-all duration-500"
                  style={
                    completed >= m
                      ? { background: 'var(--green-mid)', borderColor: 'var(--green-mid)', boxShadow: '0 0 0 3px rgba(74,124,47,0.18)' }
                      : { background: 'var(--color-card)', borderColor: 'var(--color-border)' }
                  }
                />
                <span
                  className="text-[10px] font-medium"
                  style={{ color: completed >= m ? 'var(--green-mid)' : 'var(--color-text-muted)' }}
                >
                  Day {m}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* ── 30-Day Calendar grid ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.22, ease: 'easeOut' }}
      >
        <Card>
          <h2
            className="text-lg font-bold mb-5"
            style={{ fontFamily: "'Lora', serif", color: 'var(--green-deep)' }}
          >
            🌿 30-Day Calendar
          </h2>

          <div className="grid grid-cols-6 sm:grid-cols-10 gap-2">
            {Array.from({ length: 30 }, (_, i) => {
              const dayNum  = i + 1
              const dayData = calendar.find(d => d.dayNumber === dayNum)
              const status  = dayData?.status || (dayNum > dayNumber ? 'future' : 'missed')
              const isToday = dayNum === dayNumber
              const isMilestone = MILESTONES.includes(dayNum)

              return (
                <motion.div
                  key={dayNum}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.022, duration: 0.35, ease: 'easeOut' }}
                  className={[
                    'aspect-square rounded-xl flex flex-col items-center justify-center',
                    'text-sm font-bold relative border transition-all',
                    status === 'complete' ? 'calendar-day-complete border-transparent' : '',
                    status === 'missed'   ? 'calendar-day-missed' : '',
                    status === 'future'   ? 'calendar-day-future' : '',
                    isToday && status !== 'complete' ? 'calendar-day-today' : '',
                  ].join(' ')}
                  style={
                    status === 'future'
                      ? { borderColor: 'var(--color-border)', color: 'var(--color-text-muted)', borderStyle: 'dashed' }
                      : status === 'complete' || status === 'missed'
                        ? {}
                        : { borderColor: 'var(--color-border)' }
                  }
                  title={`Day ${dayNum}${dayData?.completedAt ? ' – Completed' : ''}`}
                >
                  <span className="text-xs leading-none">{dayNum}</span>
                  <span className="text-sm mt-0.5 leading-none" aria-hidden="true">
                    {status === 'complete' ? '🍃' : status === 'missed' ? '✕' : status === 'future' ? '🔒' : ''}
                  </span>

                  {/* Today dot */}
                  {isToday && status !== 'complete' && (
                    <div
                      className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full animate-leaf-pulse"
                      style={{ background: 'var(--green-mid)' }}
                      aria-hidden="true"
                    />
                  )}

                  {/* Milestone star */}
                  {isMilestone && (
                    <div
                      className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 text-[9px]"
                      aria-hidden="true"
                    >
                      ⭐
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>

          {/* Legend */}
          <div
            className="flex flex-wrap gap-4 mt-5 text-xs"
            style={{ color: 'var(--color-text-muted)' }}
            aria-label="Calendar legend"
          >
            {[
              { color: 'var(--green-mid)', label: '🍃 Completed' },
              { color: 'var(--color-red)', label: '✕ Missed' },
              { color: 'var(--color-gold)', label: '⭐ Milestone' },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded" style={{ background: color }} aria-hidden="true" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

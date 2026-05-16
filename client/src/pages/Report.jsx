/**
 * @fileoverview Report page – 30-day summary, earthy certificate, nature-themed charts
 * Completion screen: falling leaves animation, heartfelt Lora message, earth impact stats
 */
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { Bar, Pie, Line } from 'react-chartjs-2'
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  ArcElement, LineElement, PointElement, Title, Tooltip, Legend, Filler,
} from 'chart.js'
import { impactAPI } from '../services/api'
import { useAuthStore } from '../store'
import { Card, SkeletonCard, Button } from '../components/ui'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, LineElement, PointElement, Title, Tooltip, Legend, Filler)

// ─── Falling leaves particle system ─────────────────────────────────────────
function LeafParticles({ count = 18 }) {
  const leaves = Array.from({ length: count }, (_, i) => ({
    id:   i,
    left: `${5 + Math.random() * 90}%`,
    top:  `${-10 - Math.random() * 10}%`,
    delay: Math.random() * 1.2,
    size:  0.8 + Math.random() * 0.8,
    emoji: ['🍃', '🌿', '🍀'][Math.floor(Math.random() * 3)],
  }))

  return (
    <div aria-hidden="true">
      {leaves.map(l => (
        <span
          key={l.id}
          className="leaf-particle"
          style={{
            left:             l.left,
            top:              l.top,
            fontSize:         `${l.size}rem`,
            animationDelay:   `${l.delay}s`,
          }}
        >
          {l.emoji}
        </span>
      ))}
    </div>
  )
}

// Chart option factory – earthy DM Sans axis labels
const makeOpts = () => ({
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
      labels: { font: { family: "'DM Sans', sans-serif", size: 12 }, color: '#5A6B4A' },
    },
  },
  scales: {
    x: {
      grid:  { display: false },
      ticks: { font: { family: "'DM Sans', sans-serif" }, color: '#5A6B4A' },
    },
    y: {
      type: 'linear',
      display: true,
      position: 'left',
      beginAtZero: true,
      grid:  { color: 'rgba(74,124,47,0.06)' },
      ticks: { font: { family: "'DM Sans', sans-serif" }, color: '#5A6B4A' },
    },
    y1: {
      type: 'linear',
      display: true,
      position: 'right',
      beginAtZero: true,
      grid: { drawOnChartArea: false },
      ticks: { font: { family: "'DM Sans', sans-serif" }, color: '#5A6B4A' },
    },
  },
})

export default function Report() {
  const user      = useAuthStore((s) => s.user)
  const [report,  setReport]  = useState(null)
  const [loading, setLoading] = useState(true)
  const [showLeaves, setShowLeaves] = useState(false)

  useEffect(() => {
    impactAPI.getReport()
      .then(({ data }) => {
        setReport(data)
        // Trigger falling leaves on load if 100 days complete
        if (data?.completedDays >= 100) {
          setTimeout(() => setShowLeaves(true), 600)
          setTimeout(() => setShowLeaves(false), 2800)
        }
      })
      .catch(() => toast.error('Failed to load report'))
      .finally(() => setLoading(false))
  }, [])


  if (loading) {
    return <div className="space-y-6">{[1, 2, 3].map(i => <SkeletonCard key={i} />)}</div>
  }

  const days   = report?.dailyBreakdown || []
  const labels = days.map(d => `Day ${d.day}`)

  const barData = {
    labels,
    datasets: [
      { label: 'Water (L)',  data: days.map(d => d.waterSaved),  backgroundColor: 'rgba(59,126,168,0.55)', borderRadius: 5, yAxisID: 'y' },
      { label: 'CO₂ (g)',   data: days.map(d => d.co2Reduced),  backgroundColor: 'rgba(74,124,47,0.55)',  borderRadius: 5, yAxisID: 'y1' },
    ],
  }

  const catBreakdown = report?.categoryBreakdown || {}
  const pieData = {
    labels: Object.keys(catBreakdown),
    datasets: [{
      data:            Object.values(catBreakdown),
      backgroundColor: ['rgba(59,126,168,0.7)', 'rgba(201,150,10,0.7)', 'rgba(155,107,53,0.7)', 'rgba(74,124,47,0.7)'],
      borderWidth:     2,
      borderColor:     'var(--color-card)',
    }],
  }

  const lineData = {
    labels,
    datasets: [{
      label:           'Streak',
      data:            days.map(d => d.streakAtDay || 0),
      borderColor:     '#4A7C2F',
      backgroundColor: 'rgba(74,124,47,0.08)',
      fill:            true,
      tension:         0.4,
      pointRadius:     3,
      pointBackgroundColor: '#4A7C2F',
    }],
  }

  const opts = makeOpts()

  return (
    <div className="space-y-7 max-w-4xl mx-auto relative">
      {/* Falling leaves on completion */}
      <AnimatePresence>
        {showLeaves && <LeafParticles count={20} />}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <h1
          className="text-3xl font-bold"
          style={{ fontFamily: "'Lora', serif", color: 'var(--green-deep)' }}
        >
          🌿 100-Day Impact Report
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
          Your complete environmental contribution summary
        </p>
      </motion.div>

      {/* Summary impact cards – animated earth stats */}
      <div className="grid md:grid-cols-3 gap-5">
        {[
          { icon: '💧', label: 'Water Saved',    value: `${report?.totalWaterSaved ?? 0}L`,                          color: '#3B7EA8' },
          { icon: '🌿', label: 'CO₂ Reduced',    value: `${((report?.totalCO2Reduced ?? 0) / 1000).toFixed(2)}kg`,  color: 'var(--green-mid)' },
          { icon: '♻️', label: 'Plastic Avoided', value: `${report?.totalPlasticAvoided ?? 0}g`,                     color: 'var(--bark)' },
        ].map(({ icon, label, value, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.10, duration: 0.55, ease: 'easeOut' }}
          >
            <Card className="text-center py-7">
              <div className="text-4xl mb-3" aria-hidden="true">{icon}</div>
              <p
                className="text-3xl font-black"
                style={{ color, fontFamily: "'Lora', serif" }}
              >
                {value}
              </p>
              <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>{label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      {days.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: 'easeOut' }}
          className="grid md:grid-cols-2 gap-6"
        >
          <Card>
            <h3 className="font-bold mb-4" style={{ fontFamily: "'Lora', serif", color: 'var(--green-deep)' }}>
              📊 Daily Impact
            </h3>
            <Bar data={barData} options={opts} />
          </Card>
          <Card>
            <h3 className="font-bold mb-4" style={{ fontFamily: "'Lora', serif", color: 'var(--green-deep)' }}>
              🌿 By Category
            </h3>
            <Pie data={pieData} options={(() => { const { scales, ...rest } = opts; return rest; })()} />
          </Card>
        </motion.div>
      )}

      {days.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35, ease: 'easeOut' }}
        >
          <Card>
            <h3 className="font-bold mb-4" style={{ fontFamily: "'Lora', serif", color: 'var(--green-deep)' }}>
              📈 Streak Trend
            </h3>
            <Line data={lineData} options={opts} />
          </Card>
        </motion.div>
      )}

      {/* ── Certificate CTA ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.45, ease: 'easeOut' }}
      >
        <Card>
          {(() => {
            const isDemo = user?.email?.endsWith('@ecostreak.app')
            const done = report?.completedDaysCount ?? 0
            const pct  = Math.min(100, Math.round((done / 100) * 100))
            const isUnlocked = isDemo || done >= 100

            return (
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ background: 'var(--leaf-shadow)', border: '1.5px solid var(--green-light)' }}
                  >
                    {isUnlocked ? '🏅' : '🔒'}
                  </div>
                  <div>
                    <h3
                      className="font-bold text-lg"
                      style={{ fontFamily: "'Lora', serif", color: 'var(--green-deep)' }}
                    >
                      Certificate of Completion
                    </h3>
                    {isUnlocked ? (
                      <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                        View and print your official EcoStreak achievement certificate.
                      </p>
                    ) : (
                      <div className="mt-1.5 space-y-1.5">
                        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                          Complete all 100 days to unlock — <strong style={{ color: 'var(--green-mid)' }}>{done}/100 done</strong>
                        </p>
                        <div className="progress-bar-track" style={{ height: '6px', maxWidth: '220px' }}>
                          <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {isUnlocked ? (
                  <Link to="/certificate" id="btn-view-certificate" className="btn-primary text-sm px-5 py-3">
                    View Certificate →
                  </Link>
                ) : (
                  <span
                    className="text-sm px-5 py-3 rounded-2xl font-semibold"
                    style={{
                      background: 'var(--leaf-shadow)',
                      color: 'var(--color-text-muted)',
                      border: '1px solid var(--color-border)',
                      cursor: 'not-allowed',
                    }}
                    title={`Complete ${100 - done} more day${100 - done !== 1 ? 's' : ''} to unlock`}
                  >
                    🔒 Locked
                  </span>
                )}
              </div>
            )
          })()}
        </Card>
      </motion.div>
    </div>
  )
}

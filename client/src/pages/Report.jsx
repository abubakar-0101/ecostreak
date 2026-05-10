/**
 * @fileoverview Report page – 30-day summary, earthy certificate, nature-themed charts
 * Completion screen: falling leaves animation, heartfelt Lora message, earth impact stats
 */
import React, { useEffect, useState, useRef } from 'react'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { Bar, Pie, Line } from 'react-chartjs-2'
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  ArcElement, LineElement, PointElement, Title, Tooltip, Legend,
} from 'chart.js'
import { impactAPI } from '../services/api'
import { useAuthStore } from '../store'
import { Card, SkeletonCard, Button } from '../components/ui'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, LineElement, PointElement, Title, Tooltip, Legend)

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
    y: {
      beginAtZero: true,
      grid:  { color: 'rgba(74,124,47,0.06)' },
      ticks: { font: { family: "'DM Sans', sans-serif" }, color: '#5A6B4A' },
    },
    x: {
      grid:  { display: false },
      ticks: { font: { family: "'DM Sans', sans-serif" }, color: '#5A6B4A' },
    },
  },
})

export default function Report() {
  const user      = useAuthStore((s) => s.user)
  const [report,  setReport]  = useState(null)
  const [loading, setLoading] = useState(true)
  const [showLeaves, setShowLeaves] = useState(false)
  const certRef = useRef(null)

  useEffect(() => {
    impactAPI.getReport()
      .then(({ data }) => {
        setReport(data)
        // Trigger falling leaves on load if 30 days complete
        if (data?.completedDays >= 30) {
          setTimeout(() => setShowLeaves(true), 600)
          setTimeout(() => setShowLeaves(false), 2800)
        }
      })
      .catch(() => toast.error('Failed to load report'))
      .finally(() => setLoading(false))
  }, [])

  const handleDownloadCert = () => {
    if (!certRef.current) return
    const html = certRef.current.outerHTML
    const blob = new Blob([`<!DOCTYPE html><html><head><meta charset="utf-8"/><style>
      @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@400;600&display=swap');
      body{font-family:'DM Sans',sans-serif;background:#F5F0E8;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0}
      .cert{background:#FDFAF4;border:3px solid #4A7C2F;border-radius:20px;padding:48px;max-width:640px;text-align:center}
      h2{font-family:'Lora',serif;color:#2D5016}
      p{color:#6B4C2A}
    </style></head><body>${html}</body></html>`], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'EcoStreak-Certificate.html'; a.click()
    URL.revokeObjectURL(url)
    toast.success('Certificate downloaded! 🌿')
  }

  if (loading) {
    return <div className="space-y-6">{[1, 2, 3].map(i => <SkeletonCard key={i} />)}</div>
  }

  const days   = report?.dailyBreakdown || []
  const labels = days.map(d => `Day ${d.day}`)

  const barData = {
    labels,
    datasets: [
      { label: 'Water (L)',  data: days.map(d => d.waterSaved),  backgroundColor: 'rgba(59,126,168,0.55)', borderRadius: 5 },
      { label: 'CO₂ (g)',   data: days.map(d => d.co2Reduced),  backgroundColor: 'rgba(74,124,47,0.55)',  borderRadius: 5 },
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
          🌿 30-Day Impact Report
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
            <Pie data={pieData} options={{ ...opts, scales: undefined }} />
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

      {/* Certificate – completion celebration screen */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.45, ease: 'easeOut' }}
      >
        <Card>
          <h3
            className="font-bold mb-6 text-center text-xl"
            style={{ fontFamily: "'Lora', serif", color: 'var(--green-deep)' }}
          >
            🏅 Certificate of Completion
          </h3>

          {/* Certificate parchment */}
          <div
            ref={certRef}
            className="cert border-2 rounded-2xl p-10 text-center mx-auto max-w-lg"
            style={{
              borderColor:  'var(--green-mid)',
              background:   '#FDFAF4',
              borderStyle:  'solid',
              boxShadow:    'inset 0 0 40px rgba(74,124,47,0.04)',
            }}
          >
            <div className="text-5xl mb-5 animate-float" aria-hidden="true">🌿</div>
            <h2
              className="text-2xl font-bold mb-2"
              style={{ fontFamily: "'Lora', serif", color: 'var(--green-deep)' }}
            >
              EcoStreak
            </h2>
            <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)', fontFamily: "'DM Sans', sans-serif" }}>
              This certifies that
            </p>
            <p
              className="text-3xl font-bold mb-4"
              style={{ fontFamily: "'Lora', serif", color: 'var(--green-deep)' }}
            >
              {user?.username}
            </p>
            <p
              className="text-base mb-5 leading-relaxed"
              style={{ color: 'var(--bark)', fontFamily: "'Lora', serif", fontStyle: 'italic' }}
            >
              has successfully completed the<br />
              <strong style={{ fontStyle: 'normal' }}>30-Day Sustainability Challenge</strong>
            </p>
            {/* Animated earth impact stats */}
            <div
              className="flex justify-center gap-4 flex-wrap my-5 text-sm"
              style={{ color: 'var(--green-mid)' }}
            >
              <span>💧 {report?.totalWaterSaved ?? 0}L water</span>
              <span>🌿 {((report?.totalCO2Reduced ?? 0) / 1000).toFixed(2)}kg CO₂</span>
              <span>♻️ {report?.totalPlasticAvoided ?? 0}g plastic</span>
            </div>
            <p
              className="text-xs"
              style={{ color: 'var(--color-text-muted)', fontFamily: "'DM Sans', sans-serif" }}
            >
              {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="flex gap-3 mt-6 justify-center flex-wrap">
            <Button onClick={handleDownloadCert}>⬇ Download Certificate</Button>
            <Button
              variant="secondary"
              onClick={() => {
                navigator.share?.({
                  title: 'I completed EcoStreak!',
                  text:  'I just finished the 30-Day Sustainability Challenge! 🌍',
                }).catch(() => toast('Share not supported on this browser'))
              }}
            >
              📤 Share
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

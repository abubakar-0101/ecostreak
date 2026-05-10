/**
 * @fileoverview Report page – 30-day summary with Chart.js charts and certificate
 */
import React, { useEffect, useState, useRef } from 'react'
import toast from 'react-hot-toast'
import { Bar, Pie, Line } from 'react-chartjs-2'
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  ArcElement, LineElement, PointElement, Title, Tooltip, Legend,
} from 'chart.js'
import { impactAPI } from '../services/api'
import { useAuthStore } from '../store'
import { Card, SkeletonCard, Button } from '../components/ui'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, LineElement, PointElement, Title, Tooltip, Legend)

export default function Report() {
  const user = useAuthStore((s) => s.user)
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const certRef = useRef(null)

  useEffect(() => {
    impactAPI.getReport()
      .then(({ data }) => setReport(data))
      .catch(() => toast.error('Failed to load report'))
      .finally(() => setLoading(false))
  }, [])

  const handleDownloadCert = () => {
    if (!certRef.current) return
    const html = certRef.current.outerHTML
    const blob = new Blob([`<!DOCTYPE html><html><head><meta charset="utf-8"/><style>
      body{font-family:sans-serif;background:#F8FAF5;display:flex;align-items:center;justify-content:center;min-height:100vh}
      .cert{background:white;border:4px solid #2D6A4F;border-radius:24px;padding:48px;max-width:640px;text-align:center}
    </style></head><body>${html}</body></html>`], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'EcoStreak-Certificate.html'; a.click()
    URL.revokeObjectURL(url)
    toast.success('Certificate downloaded!')
  }

  if (loading) return <div className="space-y-6">{[1,2,3].map(i => <SkeletonCard key={i} />)}</div>

  const days = report?.dailyBreakdown || []
  const labels = days.map(d => `Day ${d.day}`)
  const colors = { water: '#3b82f6', co2: '#2D6A4F', plastic: '#f59e0b' }

  const barData = {
    labels,
    datasets: [
      { label: 'Water (L)', data: days.map(d => d.waterSaved), backgroundColor: colors.water + '99', borderRadius: 4 },
      { label: 'CO₂ (g)', data: days.map(d => d.co2Reduced), backgroundColor: colors.co2 + '99', borderRadius: 4 },
    ],
  }

  const catBreakdown = report?.categoryBreakdown || {}
  const pieData = {
    labels: Object.keys(catBreakdown),
    datasets: [{
      data: Object.values(catBreakdown),
      backgroundColor: ['#3b82f6', '#f59e0b', '#f97316', '#22c55e'],
      borderWidth: 2, borderColor: '#fff',
    }],
  }

  const lineData = {
    labels,
    datasets: [{
      label: 'Streak',
      data: days.map(d => d.streakAtDay || 0),
      borderColor: '#2D6A4F', backgroundColor: 'rgba(45,106,79,0.1)',
      fill: true, tension: 0.4, pointRadius: 3,
    }],
  }

  const opts = { responsive: true, plugins: { legend: { position: 'top' } } }

  return (
    <div className="space-y-6 animate-fade-in-up max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold gradient-text">🏆 30-Day Impact Report</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
          Your complete environmental contribution summary
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { icon:'💧', label:'Water Saved', value:`${report?.totalWaterSaved ?? 0}L`, color:'#3b82f6' },
          { icon:'🌿', label:'CO₂ Reduced', value:`${((report?.totalCO2Reduced ?? 0)/1000).toFixed(2)}kg`, color:'#2D6A4F' },
          { icon:'♻️', label:'Plastic Avoided', value:`${report?.totalPlasticAvoided ?? 0}g`, color:'#f59e0b' },
        ].map(({ icon, label, value, color }) => (
          <Card key={label} className="text-center p-6">
            <div className="text-4xl mb-2">{icon}</div>
            <p className="text-3xl font-black" style={{ color }}>{value}</p>
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>{label}</p>
          </Card>
        ))}
      </div>

      {/* Charts */}
      {days.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <h3 className="font-bold mb-4" style={{ color: 'var(--color-text)' }}>📊 Daily Impact</h3>
            <Bar data={barData} options={opts} />
          </Card>
          <Card>
            <h3 className="font-bold mb-4" style={{ color: 'var(--color-text)' }}>🥧 By Category</h3>
            <Pie data={pieData} options={opts} />
          </Card>
        </div>
      )}

      {days.length > 0 && (
        <Card>
          <h3 className="font-bold mb-4" style={{ color: 'var(--color-text)' }}>📈 Streak Trend</h3>
          <Line data={lineData} options={opts} />
        </Card>
      )}

      {/* Certificate */}
      <Card>
        <h3 className="font-bold mb-4 text-center" style={{ color: 'var(--color-text)' }}>
          🏅 Certificate of Completion
        </h3>
        <div
          ref={certRef}
          className="cert border-4 rounded-3xl p-10 text-center mx-auto max-w-lg"
          style={{ borderColor: '#2D6A4F' }}
        >
          <div className="text-5xl mb-4">🌿</div>
          <h2 className="text-2xl font-black gradient-text mb-2">EcoStreak</h2>
          <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>This certifies that</p>
          <p className="text-3xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
            {user?.username}
          </p>
          <p className="text-base mb-4" style={{ color: 'var(--color-text-muted)' }}>
            has successfully completed the<br />
            <strong>30-Day Sustainability Challenge</strong>
          </p>
          <div className="flex justify-center gap-6 my-6 text-sm">
            <span>💧 {report?.totalWaterSaved ?? 0}L water</span>
            <span>🌿 {((report?.totalCO2Reduced ?? 0)/1000).toFixed(2)}kg CO₂</span>
            <span>♻️ {report?.totalPlasticAvoided ?? 0}g plastic</span>
          </div>
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            {new Date().toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })}
          </p>
        </div>
        <div className="flex gap-3 mt-6 justify-center">
          <Button onClick={handleDownloadCert}>⬇ Download Certificate</Button>
          <Button variant="secondary" onClick={() => {
            navigator.share?.({ title: 'I completed EcoStreak!', text: `I just finished the 30-Day Sustainability Challenge! 🌍` })
              .catch(() => toast('Share not supported on this browser'))
          }}>
            📤 Share
          </Button>
        </div>
      </Card>
    </div>
  )
}

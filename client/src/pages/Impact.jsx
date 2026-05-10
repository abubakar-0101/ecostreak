/**
 * @fileoverview Eco Impact page – animated counters and Chart.js rings
 */
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  BarElement, Title, Tooltip, Legend,
} from 'chart.js'
import { impactAPI } from '../services/api'
import { getImpactComparisons } from '../utils/helpers'
import { Card, SkeletonCard } from '../components/ui'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function Impact() {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    impactAPI.getSummary()
      .then(({ data }) => setSummary(data))
      .catch(() => toast.error('Failed to load impact data'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="space-y-6">{[1,2,3].map(i => <SkeletonCard key={i} />)}</div>

  const comparisons = summary
    ? getImpactComparisons({
        waterSaved: summary.totalWaterSaved,
        co2Reduced: summary.totalCO2Reduced,
        plasticAvoided: summary.totalPlasticAvoided,
      })
    : null

  const chartData = {
    labels: summary?.dailyBreakdown?.map(d => `D${d.day}`) || [],
    datasets: [
      {
        label: 'Water Saved (L)',
        data: summary?.dailyBreakdown?.map(d => d.waterSaved) || [],
        backgroundColor: 'rgba(59,130,246,0.6)',
        borderRadius: 6,
      },
      {
        label: 'CO₂ Reduced (g)',
        data: summary?.dailyBreakdown?.map(d => d.co2Reduced) || [],
        backgroundColor: 'rgba(45,106,79,0.6)',
        borderRadius: 6,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: false },
    },
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
      x: { grid: { display: false } },
    },
  }

  return (
    <div className="space-y-6 animate-fade-in-up max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold" style={{ color: 'var(--color-text)' }}>🌍 Eco Impact</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
          Your real-world environmental contribution
        </p>
      </div>

      {/* Main metrics */}
      {comparisons && (
        <div className="grid md:grid-cols-3 gap-4">
          {Object.values(comparisons).map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="eco-card p-6 text-center"
            >
              <div className="text-4xl mb-3">{metric.icon}</div>
              <p className="text-3xl font-bold" style={{ color: metric.color }}>
                {metric.value}
                <span className="text-lg ml-1">{metric.unit}</span>
              </p>
              <p className="text-sm font-semibold mt-1" style={{ color: 'var(--color-text)' }}>
                {metric.label}
              </p>
              <div
                className="mt-3 p-2 rounded-xl text-xs font-medium"
                style={{ background: `${metric.color}15`, color: metric.color }}
              >
                ≈ {metric.comparison}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Bar chart */}
      {summary?.dailyBreakdown?.length > 0 && (
        <Card>
          <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--color-text)' }}>
            📊 Daily Impact Breakdown
          </h2>
          <Bar data={chartData} options={chartOptions} />
        </Card>
      )}

      {/* Impact score */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg" style={{ color: 'var(--color-text)' }}>Total Eco Score</h3>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              Cumulative points across all completed tasks
            </p>
          </div>
          <div className="text-5xl font-black gradient-text">{summary?.ecoScore || 0}</div>
        </div>
      </Card>
    </div>
  )
}

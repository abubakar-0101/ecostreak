/**
 * @fileoverview Eco Impact page – animated stat cards, earthy bar chart, warm color tokens
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

const REVEAL = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export default function Impact() {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    impactAPI.getSummary()
      .then(({ data }) => setSummary(data))
      .catch(() => toast.error('Failed to load impact data'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="space-y-6">{[1, 2, 3].map(i => <SkeletonCard key={i} />)}</div>
  }

  const comparisons = summary
    ? getImpactComparisons({
        waterSaved:     summary.totalWaterSaved,
        co2Reduced:     summary.totalCO2Reduced,
        plasticAvoided: summary.totalPlasticAvoided,
      })
    : null

  // Earth-tone chart colours
  const chartData = {
    labels: summary?.dailyBreakdown?.map(d => `D${d.day}`) || [],
    datasets: [
      {
        label:           'Water Saved (L)',
        data:            summary?.dailyBreakdown?.map(d => d.waterSaved) || [],
        backgroundColor: 'rgba(59,126,168,0.55)',
        borderRadius:    6,
      },
      {
        label:           'CO₂ Reduced (g)',
        data:            summary?.dailyBreakdown?.map(d => d.co2Reduced) || [],
        backgroundColor: 'rgba(74,124,47,0.55)',
        borderRadius:    6,
      },
    ],
  }

  const chartOptions = {
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
        grid: { color: 'rgba(74,124,47,0.06)' },
        ticks: { font: { family: "'DM Sans', sans-serif" }, color: '#5A6B4A' },
      },
      x: {
        grid: { display: false },
        ticks: { font: { family: "'DM Sans', sans-serif" }, color: '#5A6B4A' },
      },
    },
  }

  return (
    <div className="space-y-7 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        variants={REVEAL} initial="hidden" animate="show"
      >
        <h1
          className="text-3xl font-bold"
          style={{ fontFamily: "'Lora', serif", color: 'var(--green-deep)' }}
        >
          🌍 Eco Impact
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
          Your real-world environmental contribution
        </p>
      </motion.div>

      {/* Main metric cards */}
      {comparisons && (
        <div className="grid md:grid-cols-3 gap-5">
          {Object.values(comparisons).map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.10, duration: 0.55, ease: 'easeOut' }}
              className="eco-card p-6 text-center"
            >
              <div className="text-4xl mb-3" aria-hidden="true">{metric.icon}</div>
              <p
                className="text-3xl font-bold"
                style={{ color: metric.color, fontFamily: "'Lora', serif" }}
              >
                {metric.value}
                <span className="text-lg ml-1">{metric.unit}</span>
              </p>
              <p
                className="text-sm font-semibold mt-1"
                style={{ color: 'var(--color-text)' }}
              >
                {metric.label}
              </p>
              <div
                className="mt-3 p-2.5 rounded-xl text-xs font-medium"
                style={{ background: 'var(--leaf-shadow)', color: 'var(--bark)', border: '1px solid var(--color-border)' }}
              >
                ≈ {metric.comparison}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Bar chart */}
      {summary?.dailyBreakdown?.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: 'easeOut' }}
        >
          <Card>
            <h2
              className="text-lg font-bold mb-5"
              style={{ fontFamily: "'Lora', serif", color: 'var(--green-deep)' }}
            >
              📊 Daily Impact Breakdown
            </h2>
            <Bar data={chartData} options={chartOptions} />
          </Card>
        </motion.div>
      )}

      {/* Eco Score card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35, ease: 'easeOut' }}
      >
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h3
                className="font-bold text-lg"
                style={{ fontFamily: "'Lora', serif", color: 'var(--green-deep)' }}
              >
                Total Eco Score
              </h3>
              <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
                Cumulative points across all completed tasks
              </p>
            </div>
            <div
              className="text-5xl font-black"
              style={{ fontFamily: "'Lora', serif", color: 'var(--green-mid)' }}
            >
              {summary?.ecoScore || 0}
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

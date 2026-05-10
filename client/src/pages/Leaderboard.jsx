/**
 * @fileoverview Leaderboard page with real-time polling via Socket.io
 */
import React, { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { io } from 'socket.io-client'
import { leaderboardAPI } from '../services/api'
import { useAuthStore } from '../store'
import { Card, SkeletonCard } from '../components/ui'

const TABS = [
  { key: 'streak', label: '🔥 Streak' },
  { key: 'score', label: '🌿 Eco Score' },
]
const PERIODS = [
  { key: 'weekly', label: 'This Week' },
  { key: 'alltime', label: 'All Time' },
]

export default function Leaderboard() {
  const user = useAuthStore((s) => s.user)
  const [type, setType] = useState('streak')
  const [period, setPeriod] = useState('alltime')
  const [entries, setEntries] = useState([])
  const [myRank, setMyRank] = useState(null)
  const [loading, setLoading] = useState(true)
  const socketRef = useRef(null)

  const fetchLeaderboard = async (t = type, p = period) => {
    try {
      const { data } = await leaderboardAPI.get(t, p)
      setEntries(data.top10)
      setMyRank(data.currentUserRank)
    } catch { toast.error('Failed to load leaderboard') }
    finally { setLoading(false) }
  }

  useEffect(() => {
    setLoading(true)
    fetchLeaderboard(type, period)
  }, [type, period])

  // Real-time updates via Socket.io
  useEffect(() => {
    socketRef.current = io('/', { path: '/socket.io', transports: ['websocket'] })
    socketRef.current.on('leaderboard:update', () => fetchLeaderboard())
    return () => socketRef.current?.disconnect()
  }, [])

  // Polling fallback every 60s
  useEffect(() => {
    const interval = setInterval(() => fetchLeaderboard(), 60000)
    return () => clearInterval(interval)
  }, [type, period])

  return (
    <div className="space-y-6 animate-fade-in-up max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold" style={{ color: 'var(--color-text)' }}>Leaderboard</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
          Compete with eco warriors worldwide 🌍
        </p>
      </div>

      {/* Tab / Period selectors */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex rounded-xl p-1 gap-1" style={{ background: 'var(--color-border)' }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setType(t.key)}
              className="flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={type === t.key ? { background: 'var(--color-primary)', color: 'white' }
                : { color: 'var(--color-text-muted)' }}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex rounded-xl p-1 gap-1" style={{ background: 'var(--color-border)' }}>
          {PERIODS.map(p => (
            <button key={p.key} onClick={() => setPeriod(p.key)}
              className="flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={period === p.key ? { background: 'var(--color-primary)', color: 'white' }
                : { color: 'var(--color-text-muted)' }}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(10)].map((_, i) => <SkeletonCard key={i} />)}</div>
      ) : (
        <Card className="p-0 overflow-hidden">
          {entries.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-4xl mb-3">🌱</div>
              <p style={{ color: 'var(--color-text-muted)' }}>No entries yet. Be the first!</p>
            </div>
          ) : (
            <ul>
              {entries.map((entry, i) => (
                <LeaderboardRow key={entry.userId} entry={entry} rank={i + 1}
                  isCurrentUser={entry.userId === user?._id} />
              ))}
            </ul>
          )}
        </Card>
      )}

      {/* Current user's rank if outside top 10 */}
      {myRank && myRank.rank > 10 && (
        <Card className="leaderboard-row-current">
          <p className="text-xs mb-2 font-semibold" style={{ color: 'var(--color-text-muted)' }}>
            Your ranking
          </p>
          <LeaderboardRow entry={myRank} rank={myRank.rank} isCurrentUser />
        </Card>
      )}
    </div>
  )
}

function LeaderboardRow({ entry, rank, isCurrentUser }) {
  const rankIcon = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`
  return (
    <motion.li
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: rank * 0.05 }}
      className={`flex items-center gap-4 px-5 py-4 border-b last:border-b-0 transition-colors
        ${isCurrentUser ? 'leaderboard-row-current' : 'hover:bg-green-50 dark:hover:bg-green-900/10'}`}
      style={{ borderColor: 'var(--color-border)' }}
    >
      <div className="w-10 text-center font-bold text-lg flex-shrink-0">
        {rank <= 3 ? rankIcon : <span style={{ color: 'var(--color-text-muted)' }}>#{rank}</span>}
      </div>
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
        style={{ background: 'linear-gradient(135deg,#95D5B2,#52B788)' }}
      >
        {entry.avatar || '🌱'}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm truncate" style={{ color: 'var(--color-text)' }}>
          {entry.username}{isCurrentUser && <span className="ml-2 text-xs" style={{ color: 'var(--color-primary)' }}>← You</span>}
        </p>
        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
          🔥 {entry.currentStreak}d streak
        </p>
      </div>
      <div className="text-right">
        <p className="font-bold" style={{ color: 'var(--color-primary)' }}>{entry.ecoScore}</p>
        <p className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>eco pts</p>
      </div>
    </motion.li>
  )
}

/**
 * @fileoverview Leaderboard – earthy tabs, leaf streak display, warm row highlights
 */
import React, { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { io } from 'socket.io-client'
import { leaderboardAPI } from '../services/api'
import { useAuthStore } from '../store'
import { Card, SkeletonCard } from '../components/ui'

const TABS = [
  { key: 'streak', label: '🍃 Streak' },
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

  useEffect(() => { setLoading(true); fetchLeaderboard(type, period) }, [type, period])

  useEffect(() => {
    socketRef.current = io({ path: '/socket.io', transports: ['websocket', 'polling'] })
    socketRef.current.on('leaderboard:update', () => fetchLeaderboard())
    return () => socketRef.current?.disconnect()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => fetchLeaderboard(), 60000)
    return () => clearInterval(interval)
  }, [type, period])

  // Tab pill styles
  const tabActive = { background: 'var(--green-mid)', color: '#FDFAF4' }
  const tabInactive = { background: 'transparent', color: 'var(--color-text-muted)' }

  return (
    <div className="space-y-7 max-w-3xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <h1
          className="text-3xl font-bold"
          style={{ fontFamily: "'Lora', serif", color: 'var(--green-deep)' }}
        >
          Leaderboard
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
          Compete with eco warriors worldwide 🌍
        </p>
      </motion.div>

      {/* Tab / Period selectors */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Type tabs */}
        <div
          className="flex rounded-2xl p-1 gap-1"
          style={{ background: 'var(--leaf-shadow)', border: '1px solid var(--color-border)' }}
        >
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setType(t.key)}
              className="flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300"
              style={type === t.key ? tabActive : tabInactive}
            >
              {t.label}
            </button>
          ))}
        </div>
        {/* Period tabs */}
        <div
          className="flex rounded-2xl p-1 gap-1"
          style={{ background: 'var(--leaf-shadow)', border: '1px solid var(--color-border)' }}
        >
          {PERIODS.map(p => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className="flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300"
              style={period === p.key ? tabActive : tabInactive}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <Card className="p-0 overflow-hidden">
          {entries.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-4xl mb-3 animate-float" aria-hidden="true">🌱</div>
              <p
                style={{ color: 'var(--color-text-muted)', fontFamily: "'Lora', serif", fontStyle: 'italic' }}
              >
                No entries yet. Be the first eco warrior!
              </p>
            </div>
          ) : (
            <ul role="list">
              {entries.map((entry, i) => (
                <LeaderboardRow
                  key={entry.userId}
                  entry={entry}
                  rank={i + 1}
                  isCurrentUser={entry.userId === user?._id}
                />
              ))}
            </ul>
          )}
        </Card>
      )}

      {/* Current user rank if outside top 10 */}
      {myRank && myRank.rank > 10 && (
        <Card className="leaderboard-row-current p-0 overflow-hidden">
          <div
            className="px-4 pt-3 pb-1 text-xs font-semibold"
            style={{ color: 'var(--color-text-muted)', fontFamily: "'DM Sans', sans-serif" }}
          >
            Your ranking
          </div>
          <LeaderboardRow entry={myRank} rank={myRank.rank} isCurrentUser />
        </Card>
      )}
    </div>
  )
}

function LeaderboardRow({ entry, rank, isCurrentUser }) {
  const rankIcon = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : null

  return (
    <motion.li
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: Math.min(rank * 0.05, 0.5), duration: 0.45, ease: 'easeOut' }}
      className={`flex items-center gap-4 px-5 py-4 border-b last:border-b-0 transition-colors ${isCurrentUser ? 'leaderboard-row-current' : ''
        }`}
      style={{
        borderColor: 'var(--color-border)',
        background: isCurrentUser ? undefined : 'transparent',
      }}
      onMouseEnter={e => !isCurrentUser && (e.currentTarget.style.background = 'var(--leaf-shadow)')}
      onMouseLeave={e => !isCurrentUser && (e.currentTarget.style.background = 'transparent')}
    >
      {/* Rank */}
      <div
        className="w-10 text-center font-bold text-lg flex-shrink-0"
        style={{ fontFamily: "'Lora', serif", color: rank <= 3 ? undefined : 'var(--color-text-muted)' }}
      >
        {rankIcon ?? <span>#{rank}</span>}
      </div>

      {/* Avatar */}
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
        style={{ background: 'var(--leaf-shadow)', border: '1.5px solid var(--green-light)' }}
        aria-hidden="true"
      >
        {entry.avatar || '🌱'}
      </div>

      {/* Name + streak */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm truncate" style={{ color: 'var(--color-text)' }}>
          {entry.username}
          {isCurrentUser && (
            <span
              className="ml-2 text-xs font-normal"
              style={{ color: 'var(--green-mid)', fontStyle: 'italic' }}
            >
              ← You
            </span>
          )}
        </p>
        <p className="text-xs flex items-center gap-1 mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
          <span aria-hidden="true">🍃</span>
          {entry.currentStreak}d streak
        </p>
      </div>

      {/* Score */}
      <div className="text-right">
        <p
          className="font-bold"
          style={{ color: 'var(--green-mid)', fontFamily: "'Lora', serif" }}
        >
          {entry.ecoScore}
        </p>
        <p className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>eco pts</p>
      </div>
    </motion.li>
  )
}

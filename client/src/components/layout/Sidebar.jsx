/**
 * @fileoverview Desktop Sidebar — nature journal aesthetic
 * Leaf logo sways on hover, earthy active states, Lora brand name
 */
import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useAuthStore, useThemeStore } from '../../store'
import { authAPI } from '../../services/api'
import {
  HiOutlineHome, HiOutlineClipboardList, HiOutlineCalendar,
  HiOutlineStar, HiOutlineTrendingUp, HiOutlineChartBar,
  HiOutlineDocumentReport, HiOutlineUser, HiOutlineLogout,
  HiOutlineMoon, HiOutlineSun, HiOutlineAcademicCap,
} from 'react-icons/hi'

const NAV_ITEMS = [
  { to: '/dashboard',   icon: HiOutlineHome,           label: 'Dashboard' },
  { to: '/tasks',       icon: HiOutlineClipboardList,   label: 'Daily Task' },
  { to: '/progress',    icon: HiOutlineCalendar,        label: 'Progress' },
  { to: '/badges',      icon: HiOutlineStar,            label: 'Badges' },
  { to: '/leaderboard', icon: HiOutlineTrendingUp,      label: 'Leaderboard' },
  { to: '/impact',      icon: HiOutlineChartBar,        label: 'Impact' },
  { to: '/report',      icon: HiOutlineDocumentReport,  label: 'Report' },
  { to: '/certificate', icon: HiOutlineAcademicCap,     label: 'Certificate', requiresCompletion: true },
  { to: '/profile',     icon: HiOutlineUser,            label: 'Profile' },
]

export default function Sidebar() {
  const navigate   = useNavigate()
  const { user, clearAuth }      = useAuthStore()
  const { darkMode, toggleDarkMode } = useThemeStore()

  const handleLogout = async () => {
    try { await authAPI.logout() } catch (_) { /* ignore */ }
    clearAuth()
    navigate('/login')
    toast.success('Logged out. See you on the trail! 🌿')
  }

  return (
    <aside
      className="hidden md:flex flex-col fixed left-0 top-0 h-full w-64 z-40 border-r"
      style={{
        background:   'var(--color-sidebar)',
        borderColor:  'var(--color-border)',
        boxShadow:    'var(--shadow-sm)',
      }}
    >
      {/* ── Logo ── */}
      <div className="p-6 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex items-center gap-3">
          {/* Leaf icon — sways on hover via CSS */}
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl cursor-default select-none"
            style={{
              background: 'var(--leaf-shadow)',
              border: '1.5px solid var(--green-light)',
              display: 'inline-block',
            }}
          >
            <span
              className="inline-block"
              style={{ animation: 'leafSway 3s ease-in-out infinite', display: 'block' }}
              aria-hidden="true"
            >
              🍃
            </span>
          </div>
          <div>
            {/* Lora serif for the brand — feels like a nature journal */}
            <h1
              className="font-bold text-base leading-tight"
              style={{ fontFamily: "'Lora', serif", color: 'var(--green-deep)' }}
            >
              EcoStreak
            </h1>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
              30-Day Challenge
            </p>
          </div>
        </div>
      </div>

      {/* ── User mini-profile ── */}
      {user && (
        <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-lg flex-shrink-0"
              style={{ background: 'var(--leaf-shadow)', border: '1.5px solid var(--green-light)' }}
            >
              {user.avatar || '🌱'}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm truncate" style={{ color: 'var(--color-text)' }}>
                {user.username}
              </p>
              {/* Leaf streak instead of flame */}
              <p className="text-xs flex items-center gap-1 mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                <span aria-hidden="true">🍃</span>
                {user.currentStreak || 0} day streak
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Navigation ── */}
      <nav className="flex-1 p-3 overflow-y-auto space-y-0.5" aria-label="Main navigation">
        {NAV_ITEMS.map(({ to, icon: Icon, label, requiresCompletion }) => {
          const isDemo = user?.email?.endsWith('@ecostreak.app')
          const isLocked = requiresCompletion && !isDemo && (user?.completedDays ?? 0) < 30

          if (isLocked) {
            return (
              <div
                key={to}
                title="Complete all 30 days to unlock"
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium"
                style={{ color: 'var(--color-border)', cursor: 'not-allowed', opacity: 0.6 }}
              >
                <Icon className="w-5 h-5 flex-shrink-0" style={{ opacity: 0.5 }} />
                <span style={{ fontFamily: "'DM Sans', sans-serif" }}>{label}</span>
                <span className="ml-auto text-xs" aria-label="Locked">🔒</span>
              </div>
            )
          }

          return (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? 'text-white'
                    : 'hover:bg-[var(--leaf-shadow)]'
                }`
              }
              style={({ isActive }) =>
                isActive
                  ? {
                      background: 'var(--green-mid)',
                      color: '#FDFAF4',
                      boxShadow: '0 2px 10px rgba(74,124,47,0.20)',
                    }
                  : { color: 'var(--color-text-muted)' }
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className="w-5 h-5 flex-shrink-0"
                    style={{ opacity: isActive ? 1 : 0.75 }}
                  />
                  <span style={{ fontFamily: "'DM Sans', sans-serif" }}>{label}</span>
                  {isActive && (
                    <motion.span
                      className="ml-auto"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.25 }}
                      aria-hidden="true"
                    >
                      🌿
                    </motion.span>
                  )}
                </>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* ── Bottom actions ── */}
      <div className="p-3 border-t space-y-1" style={{ borderColor: 'var(--color-border)' }}>
        <button
          onClick={toggleDarkMode}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300"
          style={{ color: 'var(--color-text-muted)' }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--leaf-shadow)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          aria-label="Toggle dark mode"
        >
          {darkMode ? <HiOutlineSun className="w-5 h-5" /> : <HiOutlineMoon className="w-5 h-5" />}
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300"
          style={{ color: 'var(--color-red)' }}
          onMouseEnter={e => e.currentTarget.style.background = '#FAECE8'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          aria-label="Logout"
        >
          <HiOutlineLogout className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}

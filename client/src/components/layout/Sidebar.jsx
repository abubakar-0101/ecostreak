/**
 * @fileoverview Desktop Sidebar navigation component
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
  HiOutlineMoon, HiOutlineSun,
} from 'react-icons/hi'

const NAV_ITEMS = [
  { to: '/dashboard',   icon: HiOutlineHome,           label: 'Dashboard' },
  { to: '/tasks',       icon: HiOutlineClipboardList,   label: 'Daily Task' },
  { to: '/progress',    icon: HiOutlineCalendar,        label: 'Progress' },
  { to: '/badges',      icon: HiOutlineStar,            label: 'Badges' },
  { to: '/leaderboard', icon: HiOutlineTrendingUp,      label: 'Leaderboard' },
  { to: '/impact',      icon: HiOutlineChartBar,        label: 'Impact' },
  { to: '/report',      icon: HiOutlineDocumentReport,  label: 'Report' },
  { to: '/profile',     icon: HiOutlineUser,            label: 'Profile' },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const { user, clearAuth } = useAuthStore()
  const { darkMode, toggleDarkMode } = useThemeStore()

  const handleLogout = async () => {
    try {
      await authAPI.logout()
    } catch (_) { /* ignore */ }
    clearAuth()
    navigate('/login')
    toast.success('Logged out successfully')
  }

  return (
    <aside
      className="hidden md:flex flex-col fixed left-0 top-0 h-full w-64 z-40 border-r"
      style={{
        background: 'var(--color-sidebar)',
        borderColor: 'var(--color-border)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* Logo */}
      <div className="p-6 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{ background: 'linear-gradient(135deg,#2D6A4F,#52B788)' }}
          >
            🌿
          </div>
          <div>
            <h1 className="font-bold text-base leading-tight gradient-text">EcoStreak</h1>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>30-Day Challenge</p>
          </div>
        </div>
      </div>

      {/* User mini-profile */}
      {user && (
        <div className="p-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-lg flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#95D5B2,#52B788)' }}
            >
              {user.avatar || '🌱'}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm truncate" style={{ color: 'var(--color-text)' }}>
                {user.username}
              </p>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                🔥 {user.currentStreak || 0} day streak
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation links */}
      <nav className="flex-1 p-3 overflow-y-auto">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl mb-1 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'text-white shadow-md'
                  : 'hover:bg-green-50 dark:hover:bg-green-900/20'
              }`
            }
            style={({ isActive }) =>
              isActive
                ? { background: 'linear-gradient(135deg,#2D6A4F,#52B788)', color: 'white' }
                : { color: 'var(--color-text-muted)' }
            }
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="p-3 border-t space-y-1" style={{ borderColor: 'var(--color-border)' }}>
        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-green-50 dark:hover:bg-green-900/20"
          style={{ color: 'var(--color-text-muted)' }}
          aria-label="Toggle dark mode"
        >
          {darkMode ? <HiOutlineSun className="w-5 h-5" /> : <HiOutlineMoon className="w-5 h-5" />}
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
          style={{ color: '#E63946' }}
          onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          aria-label="Logout"
        >
          <HiOutlineLogout className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  )
}

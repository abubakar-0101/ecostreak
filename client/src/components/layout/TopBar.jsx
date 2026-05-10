/**
 * @fileoverview Top bar for mobile – logo, theme toggle, and menu hint
 */
import React from 'react'
import { Link } from 'react-router-dom'
import { HiOutlineMoon, HiOutlineSun } from 'react-icons/hi'
import { useThemeStore } from '../../store'

export default function TopBar() {
  const { darkMode, toggleDarkMode } = useThemeStore()

  return (
    <header
      className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 h-14 border-b"
      style={{ background: 'var(--color-card)', borderColor: 'var(--color-border)', boxShadow: 'var(--shadow-sm)' }}
    >
      {/* Logo */}
      <Link to="/dashboard" className="flex items-center gap-2 font-bold gradient-text">
        🌿 EcoStreak
      </Link>

      {/* Theme toggle */}
      <button
        onClick={toggleDarkMode}
        className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
        style={{ background: 'var(--color-border)', color: 'var(--color-text)' }}
        aria-label="Toggle dark mode"
      >
        {darkMode ? <HiOutlineSun className="w-5 h-5" /> : <HiOutlineMoon className="w-5 h-5" />}
      </button>
    </header>
  )
}

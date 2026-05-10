/**
 * @fileoverview TopBar – mobile header, earth palette, Lora brand, leaf logo
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
      style={{
        background:  'var(--color-card)',
        borderColor: 'var(--color-border)',
        boxShadow:   'var(--shadow-sm)',
      }}
    >
      {/* Logo – leaf sway + Lora brand */}
      <Link to="/dashboard" className="flex items-center gap-2 select-none">
        <span
          className="text-lg"
          style={{ display: 'inline-block', animation: 'leafSway 3s ease-in-out infinite' }}
          aria-hidden="true"
        >
          🍃
        </span>
        <span
          className="font-bold text-base"
          style={{ fontFamily: "'Lora', serif", color: 'var(--green-deep)' }}
        >
          EcoStreak
        </span>
      </Link>

      {/* Dark-mode toggle */}
      <button
        onClick={toggleDarkMode}
        className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300"
        style={{ background: 'var(--leaf-shadow)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}
        aria-label="Toggle dark mode"
      >
        {darkMode
          ? <HiOutlineSun className="w-5 h-5" />
          : <HiOutlineMoon className="w-5 h-5" />
        }
      </button>
    </header>
  )
}

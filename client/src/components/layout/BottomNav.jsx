/**
 * @fileoverview Mobile bottom navigation bar
 */
import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  HiOutlineHome, HiOutlineCalendar, HiOutlineStar,
  HiOutlineTrendingUp, HiOutlineUser,
} from 'react-icons/hi'

const MOBILE_NAV = [
  { to: '/dashboard',   icon: HiOutlineHome,       label: 'Home' },
  { to: '/progress',    icon: HiOutlineCalendar,   label: 'Progress' },
  { to: '/badges',      icon: HiOutlineStar,       label: 'Badges' },
  { to: '/leaderboard', icon: HiOutlineTrendingUp, label: 'Ranks' },
  { to: '/profile',     icon: HiOutlineUser,       label: 'Profile' },
]

export default function BottomNav() {
  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t"
      style={{
        background: 'var(--color-card)',
        borderColor: 'var(--color-border)',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
      }}
    >
      <div className="flex items-center justify-around h-16 px-2">
        {MOBILE_NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className="flex flex-col items-center justify-center gap-0.5 flex-1 h-full min-w-0"
            style={({ isActive }) => ({
              color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
            })}
            aria-label={label}
          >
            {({ isActive }) => (
              <>
                <div
                  className={`p-1.5 rounded-xl transition-all duration-200 ${isActive ? 'scale-110' : ''}`}
                  style={isActive ? { background: 'rgba(45,106,79,0.1)' } : {}}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-medium leading-none">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

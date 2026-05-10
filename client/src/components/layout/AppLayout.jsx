/**
 * @fileoverview AppLayout – wraps all protected pages with sidebar + mobile nav
 */
import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import BottomNav from './BottomNav'
import TopBar from './TopBar'

export default function AppLayout() {
  return (
    <div className="flex min-h-screen" style={{ background: 'var(--color-bg)' }}>
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Main area */}
      <div className="flex-1 flex flex-col md:ml-64">
        <TopBar />
        <main className="flex-1 p-4 md:p-8 main-content animate-fade-in">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom nav */}
      <BottomNav />
    </div>
  )
}

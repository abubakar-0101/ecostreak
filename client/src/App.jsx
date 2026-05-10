/**
 * @fileoverview Root App component with React Router v6 setup
 * Handles public/protected route splitting and lazy loading
 */
import React, { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuthStore, useThemeStore } from './store'
import AppLayout from './components/layout/AppLayout'
import PageLoader from './components/ui/PageLoader'

// ─── LAZY-LOADED PAGES ──────────────────────────────────────
const Landing    = lazy(() => import('./pages/Landing'))
const Login      = lazy(() => import('./pages/Login'))
const Register   = lazy(() => import('./pages/Register'))
const VerifyOTP  = lazy(() => import('./pages/VerifyOTP'))
const Dashboard  = lazy(() => import('./pages/Dashboard'))
const Tasks      = lazy(() => import('./pages/Tasks'))
const Progress   = lazy(() => import('./pages/Progress'))
const Badges     = lazy(() => import('./pages/Badges'))
const Leaderboard= lazy(() => import('./pages/Leaderboard'))
const Impact     = lazy(() => import('./pages/Impact'))
const Report     = lazy(() => import('./pages/Report'))
const Profile    = lazy(() => import('./pages/Profile'))
const NotFound   = lazy(() => import('./pages/NotFound'))

// ─── PROTECTED ROUTE WRAPPER ────────────────────────────────
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

// ─── PUBLIC-ONLY ROUTE (redirect if already logged in) ──────
const PublicRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children
}

export default function App() {
  const { initTheme } = useThemeStore()

  // Initialize dark mode from persisted state on mount
  useEffect(() => {
    initTheme()
  }, [initTheme])

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: '12px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
          },
          success: {
            style: { background: '#2D6A4F', color: '#fff' },
            iconTheme: { primary: '#95D5B2', secondary: '#2D6A4F' },
          },
          error: {
            style: { background: '#E63946', color: '#fff' },
          },
        }}
      />

      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* ── Public Routes ── */}
          <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/verify-otp" element={<VerifyOTP />} />

          {/* ── Protected Routes (inside AppLayout) ── */}
          <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route path="dashboard"   element={<Dashboard />} />
            <Route path="tasks"       element={<Tasks />} />
            <Route path="progress"    element={<Progress />} />
            <Route path="badges"      element={<Badges />} />
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="impact"      element={<Impact />} />
            <Route path="report"      element={<Report />} />
            <Route path="profile"     element={<Profile />} />
          </Route>

          {/* ── 404 ── */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

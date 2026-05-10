/**
 * @fileoverview Login Page – enhanced error display, soothing animations, OTP redirect
 */
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { useAuthStore } from '../store'
import { authAPI } from '../services/api'
import { Button } from '../components/ui'

/* ── Floating leaf particles (decorative) ───────────────────────────────── */
const LEAVES = ['🌿', '🍃', '🌱', '🍀', '🌾']

function FloatingLeaf({ index }) {
  const leaf = LEAVES[index % LEAVES.length]
  const style = {
    left: `${10 + (index * 18) % 85}%`,
    animationDelay: `${index * 0.7}s`,
    animationDuration: `${7 + (index * 1.3) % 6}s`,
    fontSize: `${14 + (index * 5) % 12}px`,
    opacity: 0.18 + (index * 0.04) % 0.2,
  }
  return (
    <span
      className="absolute select-none pointer-events-none animate-float"
      style={style}
      aria-hidden="true"
    >
      {leaf}
    </span>
  )
}

/* ── Shake animation variant (for error state) ──────────────────────────── */
const shakeVariants = {
  idle: { x: 0 },
  shake: {
    x: [0, -8, 8, -6, 6, -4, 4, 0],
    transition: { duration: 0.5, ease: 'easeInOut' },
  },
}

/* ── Inline Error message component ────────────────────────────────────── */
function FieldError({ message }) {
  return (
    <AnimatePresence mode="wait">
      {message && (
        <motion.p
          key={message}
          className="text-xs mt-1.5 flex items-center gap-1.5"
          style={{ color: '#E63946' }}
          initial={{ opacity: 0, y: -4, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: -4, height: 0 }}
          transition={{ duration: 0.2 }}
        >
          <span>⚠</span> {message}
        </motion.p>
      )}
    </AnimatePresence>
  )
}

/* ── General alert banner ───────────────────────────────────────────────── */
function AlertBanner({ message, type = 'error' }) {
  const isError = type === 'error'
  return (
    <AnimatePresence mode="wait">
      {message && (
        <motion.div
          key={message}
          initial={{ opacity: 0, scale: 0.95, y: -8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -8 }}
          transition={{ duration: 0.25 }}
          className="p-4 rounded-xl text-sm flex items-start gap-3"
          style={{
            background: isError ? 'rgba(230,57,70,0.08)' : 'rgba(45,106,79,0.08)',
            border: `1px solid ${isError ? 'rgba(230,57,70,0.3)' : 'rgba(45,106,79,0.3)'}`,
            color: isError ? '#C1121F' : '#2D6A4F',
          }}
        >
          <span className="text-base flex-shrink-0">{isError ? '🔴' : '✅'}</span>
          <span>{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function Login() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)

  const [form, setForm] = useState({ email: '', password: '', rememberMe: false })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [shakeKey, setShakeKey] = useState('idle')

  const triggerShake = () => {
    setShakeKey('shake')
    setTimeout(() => setShakeKey('idle'), 600)
  }

  const validate = () => {
    const errs = {}
    if (!form.email) errs.email = 'Email address is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Please enter a valid email address'
    if (!form.password) errs.password = 'Password is required'
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) { triggerShake(); return }
    setLoading(true)
    try {
      const { data } = await authAPI.login({ email: form.email, password: form.password, rememberMe: form.rememberMe })
      setAuth(data.user, data.accessToken)
      toast.success(`Welcome back, ${data.user.username}! 🌿`)
      navigate('/dashboard')
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.'
      setErrors({ general: msg })
      triggerShake()
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }))
    setErrors((p) => ({ ...p, [name]: '', general: '' }))
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--color-bg)' }}>
      {/* ── Left decorative panel ─────────────────────────────────────── */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1B4332, #2D6A4F, #52B788)' }}
      >
        {/* Floating leaves */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <FloatingLeaf key={i} index={i} />
          ))}
        </div>

        {/* Concentric rings */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border border-white"
              style={{
                width: `${(i + 1) * 120}px`,
                height: `${(i + 1) * 120}px`,
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
              animate={{ scale: [1, 1.04, 1], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative text-center text-white z-10">
          <motion.div
            className="text-7xl mb-6"
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            🌿
          </motion.div>
          <h2 className="text-4xl font-bold mb-4">Welcome Back</h2>
          <p className="text-lg text-green-200 max-w-sm">
            Your eco journey awaits. Continue building habits that heal the planet.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-4 text-center">
            {[['🔥', 'Streak'], ['🏅', 'Badges'], ['🌍', 'Impact']].map(([icon, label], i) => (
              <motion.div
                key={label}
                className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.15, duration: 0.5 }}
                whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.18)' }}
              >
                <div className="text-2xl">{icon}</div>
                <div className="text-xs mt-1 text-green-200">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right form panel ──────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 font-bold text-xl gradient-text">
              🌿 EcoStreak
            </Link>
            <motion.h1
              className="text-2xl font-bold mt-4"
              style={{ color: 'var(--color-text)' }}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              Sign in to your account
            </motion.h1>
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold underline" style={{ color: 'var(--color-primary)' }}>
                Sign up free
              </Link>
            </p>
          </div>

          {/* Form card */}
          <motion.div
            className="eco-card p-8"
            variants={shakeVariants}
            animate={shakeKey}
          >
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* General error banner */}
              <AlertBanner message={errors.general} type="error" />

              {/* Email */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <label
                  htmlFor="login-email"
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: 'var(--color-text)' }}
                >
                  Email address
                </label>
                <div className="relative">
                  <input
                    id="login-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all"
                    style={{
                      background: 'var(--color-card)',
                      borderColor: errors.email ? '#E63946' : 'var(--color-border)',
                      color: 'var(--color-text)',
                      boxShadow: errors.email ? '0 0 0 3px rgba(230,57,70,0.1)' : 'none',
                    }}
                  />
                  {errors.email && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">⚠</span>
                  )}
                </div>
                <FieldError message={errors.email} />
              </motion.div>

              {/* Password */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18 }}
              >
                <label
                  htmlFor="login-password"
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: 'var(--color-text)' }}
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="login-password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all"
                    style={{
                      background: 'var(--color-card)',
                      borderColor: errors.password ? '#E63946' : 'var(--color-border)',
                      color: 'var(--color-text)',
                      boxShadow: errors.password ? '0 0 0 3px rgba(230,57,70,0.1)' : 'none',
                    }}
                  />
                  {errors.password && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">⚠</span>
                  )}
                </div>
                <FieldError message={errors.password} />
              </motion.div>

              {/* Remember me */}
              <motion.label
                className="flex items-center gap-3 cursor-pointer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
              >
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={form.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 rounded accent-green-600"
                />
                <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  Remember me for 7 days
                </span>
              </motion.label>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Button type="submit" loading={loading} className="w-full mt-2" aria-label="Sign in">
                  Sign In →
                </Button>
              </motion.div>
            </form>
          </motion.div>

          {/* Footer link */}
          <motion.div
            className="mt-6 p-4 rounded-xl border text-sm text-center"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            🌱 New here?{' '}
            <Link to="/register" style={{ color: 'var(--color-primary)' }} className="font-semibold">
              Create a free account
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

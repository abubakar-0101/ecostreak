/**
 * @fileoverview Standalone OTP Verification Page
 * Used when a user with unverified email tries to log in
 */
import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { useAuthStore } from '../store'
import { authAPI } from '../services/api'
import { Button } from '../components/ui'

export default function VerifyOTP() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email') || ''
  const setAuth = useAuthStore((s) => s.setAuth)

  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [resendCountdown, setResendCountdown] = useState(60)
  const inputRefs = useRef([])

  // Focus first input on mount
  useEffect(() => { inputRefs.current[0]?.focus() }, [])

  // Countdown timer
  useEffect(() => {
    if (resendCountdown <= 0) return
    const t = setTimeout(() => setResendCountdown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [resendCountdown])

  const otpString = otp.join('')

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return
    const next = [...otp]
    next[index] = value
    setOtp(next)
    setError('')
    if (value && index < 5) inputRefs.current[index + 1]?.focus()
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const next = [...otp]
    pasted.split('').forEach((char, i) => { next[i] = char })
    setOtp(next)
    const focusIdx = Math.min(pasted.length, 5)
    inputRefs.current[focusIdx]?.focus()
  }

  const handleVerify = async () => {
    if (otpString.length < 6) { setError('Please enter all 6 digits of your code.'); return }
    setLoading(true)
    try {
      const { data } = await authAPI.verifyOTP(email, otpString)
      setAuth(data.user, data.accessToken)
      toast.success('Email verified! Welcome to EcoStreak 🌿')
      navigate('/dashboard')
    } catch (err) {
      const msg = err.response?.data?.message || 'Verification failed. Please try again.'
      setError(msg)
      setOtp(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (resendCountdown > 0 || resending) return
    setResending(true)
    try {
      await authAPI.resendOTP(email)
      toast.success('New code sent! Check your inbox 📧')
      setResendCountdown(60)
      setOtp(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } catch {
      toast.error('Could not resend code. Try again.')
    } finally {
      setResending(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: 'var(--color-bg)', position: 'relative', overflow: 'hidden' }}
    >
      {/* Decorative background glow */}
      <motion.div
        className="absolute pointer-events-none rounded-full"
        style={{
          width: '600px', height: '600px',
          background: 'radial-gradient(circle, rgba(82,183,136,0.07) 0%, transparent 70%)',
          top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        }}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 font-bold text-xl gradient-text">
            🌿 EcoStreak
          </Link>
        </div>

        <div className="eco-card p-10">
          {/* Animated email icon */}
          <div className="text-center mb-6">
            <motion.div
              className="text-7xl mb-5"
              animate={{ y: [0, -10, 0], rotate: [0, 3, -3, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              📧
            </motion.div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
              Check your email
            </h1>
            <p className="text-sm mt-2" style={{ color: 'var(--color-text-muted)' }}>
              We sent a 6-digit verification code to:
            </p>
            <p className="text-sm font-semibold mt-1" style={{ color: 'var(--color-primary)' }}>
              {email || 'your email address'}
            </p>
          </div>

          {/* OTP input boxes */}
          <div className="flex gap-3 justify-center mb-4" onPaste={handlePaste}>
            {otp.map((digit, i) => (
              <motion.input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                id={`otp-digit-${i}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="w-12 h-14 text-center text-xl font-bold rounded-xl border-2 outline-none transition-all"
                style={{
                  background: 'var(--color-card)',
                  borderColor: error ? '#E63946' : digit ? 'var(--color-primary)' : 'var(--color-border)',
                  color: 'var(--color-text)',
                  boxShadow: digit
                    ? '0 0 0 3px rgba(45,106,79,0.12)'
                    : error
                    ? '0 0 0 3px rgba(230,57,70,0.1)'
                    : 'none',
                }}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.06, type: 'spring', stiffness: 300, damping: 20 }}
              />
            ))}
          </div>

          {/* Error message */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                key={error}
                className="p-3 rounded-xl text-sm flex items-center gap-2 mb-4"
                style={{
                  background: 'rgba(230,57,70,0.08)',
                  border: '1px solid rgba(230,57,70,0.3)',
                  color: '#C1121F',
                }}
                initial={{ opacity: 0, scale: 0.95, y: -6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <span>🔴</span> {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Verify button */}
          <Button
            type="button"
            onClick={handleVerify}
            loading={loading}
            className="w-full"
            disabled={otpString.length < 6}
          >
            ✅ Verify & Continue
          </Button>

          {/* Resend section */}
          <div className="text-center mt-5">
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              Didn't receive it?{' '}
              <button
                type="button"
                onClick={handleResend}
                disabled={resendCountdown > 0 || resending}
                className="font-semibold underline transition-opacity"
                style={{
                  color: 'var(--color-primary)',
                  opacity: resendCountdown > 0 ? 0.5 : 1,
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: resendCountdown > 0 ? 'not-allowed' : 'pointer',
                }}
              >
                {resendCountdown > 0
                  ? `Resend in ${resendCountdown}s`
                  : resending
                  ? 'Sending…'
                  : 'Resend code'}
              </button>
            </p>
          </div>

          {/* Back to login */}
          <div className="text-center mt-4">
            <Link
              to="/login"
              className="text-sm underline"
              style={{ color: 'var(--color-text-muted)' }}
            >
              ← Back to login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

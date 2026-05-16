/**
 * @fileoverview Forgot Password Page - handles email input, OTP verification, and password reset
 */
import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { authAPI } from '../services/api'
import { Button } from '../components/ui'

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
          className="p-4 rounded-xl text-sm flex items-start gap-3 mb-4"
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

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1) // 1: Email, 2: OTP & New Password
  
  // Step 1 state
  const [email, setEmail] = useState('')
  const [step1Loading, setStep1Loading] = useState(false)
  const [step1Errors, setStep1Errors] = useState({})
  
  // Step 2 state
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [step2Loading, setStep2Loading] = useState(false)
  const [step2Errors, setStep2Errors] = useState({})
  
  const [shakeKey, setShakeKey] = useState('idle')
  const inputRefs = useRef([])

  const triggerShake = () => {
    setShakeKey('shake')
    setTimeout(() => setShakeKey('idle'), 600)
  }

  /* ── Step 1 Handlers ── */
  const validateStep1 = () => {
    const errs = {}
    if (!email) errs.email = 'Email address is required'
    else if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = 'Please enter a valid email address'
    setStep1Errors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSendOTP = async (e) => {
    e.preventDefault()
    if (!validateStep1()) { triggerShake(); return }
    setStep1Loading(true)
    try {
      const { data } = await authAPI.forgotPassword(email)
      toast.success('Reset code sent! Check your inbox 📧')
      setStep(2)
      setStep1Errors({ success: data.message })
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to send reset code. Please try again.'
      setStep1Errors({ general: msg })
      triggerShake()
    } finally {
      setStep1Loading(false)
    }
  }

  /* ── Step 2 Handlers ── */
  const otpString = otp.join('')

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return
    const next = [...otp]
    next[index] = value
    setOtp(next)
    setStep2Errors((p) => ({ ...p, general: '', otp: '' }))
    if (value && index < 5) inputRefs.current[index + 1]?.focus()
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleOtpPaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const next = [...otp]
    pasted.split('').forEach((char, i) => { next[i] = char })
    setOtp(next)
    const focusIdx = Math.min(pasted.length, 5)
    inputRefs.current[focusIdx]?.focus()
  }

  const validateStep2 = () => {
    const errs = {}
    if (otpString.length < 6) errs.otp = 'Please enter the complete 6-digit code'
    if (!password) errs.password = 'New password is required'
    else if (password.length < 8) errs.password = 'Password must be at least 8 characters'
    setStep2Errors(errs)
    return Object.keys(errs).length === 0
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    if (!validateStep2()) { triggerShake(); return }
    setStep2Loading(true)
    try {
      const { data } = await authAPI.resetPassword(email, otpString, password)
      toast.success('Password reset successfully! 🌿')
      navigate('/login')
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to reset password.'
      setStep2Errors({ general: msg })
      triggerShake()
    } finally {
      setStep2Loading(false)
    }
  }

  // Focus first OTP input when reaching step 2
  useEffect(() => {
    if (step === 2 && inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [step])

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
          <motion.h1
            className="text-2xl font-bold mt-4"
            style={{ color: 'var(--color-text)' }}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            {step === 1 ? 'Forgot Password' : 'Reset Password'}
          </motion.h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
            {step === 1 
              ? "Enter your email and we'll send you a reset code."
              : "Enter the code and your new password."}
          </p>
        </div>

        <motion.div className="eco-card p-8" variants={shakeVariants} animate={shakeKey}>
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.form
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleSendOTP}
                noValidate
                className="space-y-4"
              >
                <AlertBanner message={step1Errors.general} type="error" />
                <AlertBanner message={step1Errors.success} type="success" />

                <div>
                  <label htmlFor="reset-email" className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>
                    Email address
                  </label>
                  <div className="relative">
                    <input
                      id="reset-email"
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setStep1Errors({}) }}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all"
                      style={{
                        background: 'var(--color-card)',
                        borderColor: step1Errors.email ? '#E63946' : 'var(--color-border)',
                        color: 'var(--color-text)',
                        boxShadow: step1Errors.email ? '0 0 0 3px rgba(230,57,70,0.1)' : 'none',
                      }}
                    />
                  </div>
                  <FieldError message={step1Errors.email} />
                </div>

                <Button type="submit" loading={step1Loading} className="w-full mt-2">
                  Send Reset Code
                </Button>
                
                <div className="text-center mt-4">
                  <Link to="/login" className="text-sm underline" style={{ color: 'var(--color-text-muted)' }}>
                    ← Back to login
                  </Link>
                </div>
              </motion.form>
            ) : (
              <motion.form
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleResetPassword}
                noValidate
                className="space-y-6"
              >
                <AlertBanner message={step2Errors.general} type="error" />

                {/* OTP input */}
                <div>
                  <label className="block text-sm font-medium mb-3 text-center" style={{ color: 'var(--color-text)' }}>
                    Verification Code
                  </label>
                  <div className="flex gap-2 justify-center" onPaste={handleOtpPaste}>
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => (inputRefs.current[i] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                        className="w-10 h-12 text-center text-lg font-bold rounded-lg border-2 outline-none transition-all"
                        style={{
                          background: 'var(--color-card)',
                          borderColor: step2Errors.otp ? '#E63946' : digit ? 'var(--color-primary)' : 'var(--color-border)',
                          color: 'var(--color-text)',
                        }}
                      />
                    ))}
                  </div>
                  <div className="text-center">
                    <FieldError message={step2Errors.otp} />
                  </div>
                </div>

                {/* New Password input */}
                <div>
                  <label htmlFor="new-password" className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      id="new-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setStep2Errors((p) => ({ ...p, password: '' })) }}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all pr-12"
                      style={{
                        background: 'var(--color-card)',
                        borderColor: step2Errors.password ? '#E63946' : 'var(--color-border)',
                        color: 'var(--color-text)',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(p => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none flex items-center justify-center w-8 h-8 rounded-full"
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                  <FieldError message={step2Errors.password} />
                </div>

                <Button type="submit" loading={step2Loading} className="w-full">
                  Reset Password
                </Button>
                
                <div className="text-center mt-4 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  Didn't receive code?{' '}
                  <button
                    type="button"
                    onClick={(e) => { setStep(1); setOtp(['', '', '', '', '', '']); setPassword(''); }}
                    className="underline text-green-600 hover:text-green-700"
                  >
                    Try another email
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  )
}

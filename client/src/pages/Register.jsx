/**
 * @fileoverview Register Page – validation errors, OTP verification step, soothing animations
 * Field component defined outside Register to prevent remount on every keystroke
 */
import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { useAuthStore } from '../store'
import { authAPI } from '../services/api'
import { Button } from '../components/ui'

/* ── Shake animation variant ───────────────────────────────────────────── */
const shakeVariants = {
  idle: { x: 0 },
  shake: {
    x: [0, -8, 8, -6, 6, -4, 4, 0],
    transition: { duration: 0.5, ease: 'easeInOut' },
  },
}

/* ── Field error message ────────────────────────────────────────────────── */
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

/* ── Alert banner ───────────────────────────────────────────────────────── */
function AlertBanner({ message, type = 'error' }) {
  const isError = type === 'error'
  return (
    <AnimatePresence mode="wait">
      {message && (
        <motion.div
          key={message}
          initial={{ opacity: 0, scale: 0.95, y: -8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
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

/* ── Input Field (outside Register to prevent remount) ──────────────────── */
function Field({ id, name, label, type = 'text', placeholder, autoComplete, value, onChange, error }) {
  const [showPassword, setShowPassword] = useState(false)
  const isPasswordField = type === 'password'
  const inputType = isPasswordField ? (showPassword ? 'text' : 'password') : type

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={inputType}
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all ${isPasswordField ? 'pr-12' : ''}`}
          style={{
            background: 'var(--color-card)',
            borderColor: error ? '#E63946' : 'var(--color-border)',
            color: 'var(--color-text)',
            boxShadow: error ? '0 0 0 3px rgba(230,57,70,0.1)' : 'none',
          }}
        />
        {isPasswordField && (
          <button
            type="button"
            onClick={() => setShowPassword(p => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none flex items-center justify-center w-8 h-8 rounded-full"
            style={{ right: error ? '2rem' : '0.5rem' }}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
          </button>
        )}
        {error && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 text-sm pointer-events-none">⚠</span>}
      </div>
      <FieldError message={error} />
    </div>
  )
}

/* ── OTP Step Component ─────────────────────────────────────────────────── */
function OTPStep({ email, onSuccess }) {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [resendCountdown, setResendCountdown] = useState(60)
  const inputRefs = useRef([])
  const setAuth = useAuthStore((s) => s.setAuth)

  // Countdown for resend
  useEffect(() => {
    if (resendCountdown <= 0) return
    const timer = setTimeout(() => setResendCountdown((c) => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [resendCountdown])

  const otpString = otp.join('')

  const handleOTPChange = (index, value) => {
    if (!/^\d?$/.test(value)) return
    const next = [...otp]
    next[index] = value
    setOtp(next)
    setError('')
    if (value && index < 5) inputRefs.current[index + 1]?.focus()
  }

  const handleOTPKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleOTPPaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const next = [...otp]
    pasted.split('').forEach((char, i) => { next[i] = char })
    setOtp(next)
    const focusIdx = Math.min(pasted.length, 5)
    inputRefs.current[focusIdx]?.focus()
  }

  const handleVerify = async () => {
    if (otpString.length < 6) { setError('Please enter the complete 6-digit code.'); return }
    setLoading(true)
    try {
      const { data } = await authAPI.verifyOTP(email, otpString)
      setAuth(data.user, data.accessToken)
      toast.success('Email verified! Welcome to EcoStreak 🌿')
      onSuccess()
    } catch (err) {
      const msg = err.response?.data?.message || 'Verification failed. Try again.'
      setError(msg)
      setOtp(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (resendCountdown > 0) return
    setResending(true)
    try {
      await authAPI.resendOTP(email)
      toast.success('New code sent! Check your email. 📧')
      setResendCountdown(60)
      setOtp(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } catch (err) {
      toast.error('Could not resend code. Try again.')
    } finally {
      setResending(false)
    }
  }

  return (
    <motion.div
      key="otp-step"
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.4 }}
    >
      {/* Email icon */}
      <div className="text-center mb-6">
        <motion.div
          className="text-6xl mb-4"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          📧
        </motion.div>
        <h2 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>
          Verify your email
        </h2>
        <p className="text-sm mt-2" style={{ color: 'var(--color-text-muted)' }}>
          We sent a 6-digit code to{' '}
          <strong style={{ color: 'var(--color-primary)' }}>{email}</strong>
        </p>
      </div>

      {/* OTP boxes */}
      <div className="flex gap-3 justify-center mb-4" onPaste={handleOTPPaste}>
        {otp.map((digit, i) => (
          <motion.input
            key={i}
            ref={(el) => (inputRefs.current[i] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleOTPChange(i, e.target.value)}
            onKeyDown={(e) => handleOTPKeyDown(i, e)}
            className="w-12 h-14 text-center text-xl font-bold rounded-xl border-2 outline-none transition-all"
            style={{
              background: 'var(--color-card)',
              borderColor: error ? '#E63946' : digit ? 'var(--color-primary)' : 'var(--color-border)',
              color: 'var(--color-text)',
              boxShadow: digit ? '0 0 0 3px rgba(45,106,79,0.12)' : error ? '0 0 0 3px rgba(230,57,70,0.1)' : 'none',
            }}
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.06 }}
          />
        ))}
      </div>

      {/* OTP error */}
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            key={error}
            className="p-3 rounded-xl text-sm flex items-center gap-2 mb-4"
            style={{ background: 'rgba(230,57,70,0.08)', border: '1px solid rgba(230,57,70,0.3)', color: '#C1121F' }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <span>🔴</span> {error}
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        type="button"
        onClick={handleVerify}
        loading={loading}
        className="w-full"
        disabled={otpString.length < 6}
      >
        ✅ Verify & Activate Account
      </Button>

      {/* Resend */}
      <p className="text-center text-sm mt-4" style={{ color: 'var(--color-text-muted)' }}>
        Didn't receive the code?{' '}
        <button
          type="button"
          onClick={handleResend}
          disabled={resendCountdown > 0 || resending}
          className="font-semibold underline disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
          style={{ color: 'var(--color-primary)', background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
        >
          {resendCountdown > 0 ? `Resend in ${resendCountdown}s` : resending ? 'Sending…' : 'Resend code'}
        </button>
      </p>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════════════════
   REGISTER PAGE
════════════════════════════════════════════════════════════════════════════ */
export default function Register() {
  const navigate = useNavigate()

  const [step, setStep] = useState('form') // 'form' | 'otp'
  const [pendingEmail, setPendingEmail] = useState('')
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '', agreeTerms: false })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [shakeKey, setShakeKey] = useState('idle')

  const triggerShake = () => {
    setShakeKey('shake')
    setTimeout(() => setShakeKey('idle'), 600)
  }

  const validate = () => {
    const errs = {}
    if (!form.username.trim()) errs.username = 'Username is required'
    else if (form.username.length < 3) errs.username = 'Username must be at least 3 characters'
    else if (form.username.length > 30) errs.username = 'Username can be at most 30 characters'
    if (!form.email) errs.email = 'Email address is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Please enter a valid email address'
    if (!form.password) errs.password = 'Password is required'
    else if (form.password.length < 8) errs.password = 'Password must be at least 8 characters'
    if (!form.confirmPassword) errs.confirmPassword = 'Please confirm your password'
    else if (form.password !== form.confirmPassword) errs.confirmPassword = "Passwords don't match"
    if (!form.agreeTerms) errs.agreeTerms = 'You must agree to the terms to continue'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) { triggerShake(); return }
    setLoading(true)
    try {
      const { data } = await authAPI.register({
        username: form.username,
        email: form.email,
        password: form.password,
      })

      if (data.requiresOTP) {
        setPendingEmail(data.email || form.email)
        toast.success('Check your email for the verification code! 📧')
        setStep('otp')
      } else {
        // Fallback (should not happen with current backend)
        navigate('/dashboard')
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.'
      setErrors({ general: msg })
      triggerShake()
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }))
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }))
    if (errors.general) setErrors((p) => ({ ...p, general: '' }))
  }

  /* ── Step: Progress indicator ─────────────────────────────────────────── */
  const steps = [
    { label: 'Account Info', icon: '📝', key: 'form' },
    { label: 'Verify Email', icon: '📧', key: 'otp' },
    { label: 'Ready!', icon: '🌿', key: 'done' },
  ]
  const currentStepIdx = step === 'form' ? 0 : step === 'otp' ? 1 : 2

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--color-bg)', position: 'relative', overflow: 'hidden' }}>
      {/* Background decorative blobs */}
      <motion.div
        className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(82,183,136,0.08) 0%, transparent 70%)', top: '-80px', right: '-80px' }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(45,106,79,0.06) 0%, transparent 70%)', bottom: '-60px', left: '-60px' }}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        {/* Logo */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 font-bold text-xl gradient-text">
            🌿 EcoStreak
          </Link>
          <h1 className="text-2xl font-bold mt-3" style={{ color: 'var(--color-text)' }}>
            {step === 'form' ? 'Create your account' : 'Verify your email'}
          </h1>
          {step === 'form' && (
            <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
              Already have an account?{' '}
              <Link to="/login" className="font-semibold underline" style={{ color: 'var(--color-primary)' }}>
                Sign in
              </Link>
            </p>
          )}
        </div>

        {/* Step progress bar */}
        <div className="flex items-center mb-6 px-2">
          {steps.map((s, i) => (
            <React.Fragment key={s.key}>
              <motion.div
                className="flex flex-col items-center gap-1"
                animate={{ scale: currentStepIdx === i ? 1.05 : 1 }}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-base font-bold transition-all duration-400"
                  style={{
                    background: currentStepIdx >= i
                      ? 'linear-gradient(135deg, #2D6A4F, #52B788)'
                      : 'var(--color-border)',
                    color: currentStepIdx >= i ? '#fff' : 'var(--color-text-muted)',
                    boxShadow: currentStepIdx === i ? '0 0 0 3px rgba(45,106,79,0.25)' : 'none',
                  }}
                >
                  {currentStepIdx > i ? '✓' : s.icon}
                </div>
                <span className="text-xs" style={{ color: currentStepIdx >= i ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>
                  {s.label}
                </span>
              </motion.div>
              {i < steps.length - 1 && (
                <div
                  className="flex-1 h-0.5 mx-1 transition-all duration-500"
                  style={{ background: currentStepIdx > i ? 'var(--color-primary)' : 'var(--color-border)' }}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Card */}
        <div className="eco-card p-8">
          <AnimatePresence mode="wait">
            {step === 'form' && (
              <motion.div
                key="form-step"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.35 }}
              >
                <motion.form
                  onSubmit={handleSubmit}
                  noValidate
                  className="space-y-4"
                  variants={shakeVariants}
                  animate={shakeKey}
                >
                  <AlertBanner message={errors.general} type="error" />

                  <Field
                    id="reg-username" name="username" label="Username" placeholder="ecohero"
                    autoComplete="username" value={form.username} onChange={handleChange} error={errors.username}
                  />
                  <Field
                    id="reg-email" name="email" label="Email" type="email" placeholder="you@example.com"
                    autoComplete="email" value={form.email} onChange={handleChange} error={errors.email}
                  />
                  <Field
                    id="reg-password" name="password" label="Password" type="password" placeholder="Min. 8 characters"
                    autoComplete="new-password" value={form.password} onChange={handleChange} error={errors.password}
                  />
                  <Field
                    id="reg-confirm" name="confirmPassword" label="Confirm Password" type="password" placeholder="••••••••"
                    autoComplete="new-password" value={form.confirmPassword} onChange={handleChange} error={errors.confirmPassword}
                  />

                  {/* Terms */}
                  <div className="mt-2">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="agreeTerms"
                        checked={form.agreeTerms}
                        onChange={handleChange}
                        className="w-4 h-4 mt-0.5 rounded accent-green-600 flex-shrink-0"
                      />
                      <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                        I agree to the{' '}
                        <span className="underline" style={{ color: 'var(--color-primary)' }}>
                          Terms of Service
                        </span>{' '}
                        and commit to my 30-day eco challenge
                      </span>
                    </label>
                    <FieldError message={errors.agreeTerms} />
                  </div>

                  <Button type="submit" loading={loading} className="w-full mt-4">
                    🌱 Start My Eco Journey
                  </Button>
                </motion.form>
              </motion.div>
            )}

            {step === 'otp' && (
              <OTPStep
                key="otp"
                email={pendingEmail}
                onSuccess={() => navigate('/dashboard')}
              />
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}

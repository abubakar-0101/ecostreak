/**
 * @fileoverview Auth controller – register (with OTP), login, logout, token refresh, password reset
 */
const { validationResult } = require('express-validator')
const crypto = require('crypto')
const User = require('../models/User')
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/jwt')
const { sendOTPEmail } = require('../utils/mailer')

/** Cookie options for HttpOnly refresh token */
const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
}

/** Generate a 6-digit numeric OTP */
const generateOTP = () => String(Math.floor(100000 + crypto.randomInt(900000)))

/** OTP validity window (10 minutes) */
const OTP_TTL_MS = 10 * 60 * 1000

/* ─── POST /auth/register ──────────────────────────────────────────────────
   Step 1: validate → check uniqueness → create unverified user → send OTP
   Returns { message, email } so the client can show the OTP step         */
const register = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg })

    const { username, email, password } = req.body

    // Check for existing verified user
    const existing = await User.findOne({ $or: [{ email }, { username }] })
    if (existing) {
      if (!existing.isVerified) {
        // Resend OTP for unverified accounts
        const otp = generateOTP()
        existing.otpCode   = otp
        existing.otpExpiry = new Date(Date.now() + OTP_TTL_MS)
        await existing.save({ validateBeforeSave: false })

        // Send email in background so the request doesn't hang on slow SMTP servers
        sendOTPEmail(email, otp).catch(err => console.error('[Mailer] Background error:', err.message))
        
        if (process.env.NODE_ENV !== 'production') console.log(`[DEV] OTP for ${email}: ${otp}`)
        
        return res.json({ message: 'OTP resent – check your email.', email, requiresOTP: true })
      }
      const field = existing.email === email ? 'Email' : 'Username'
      return res.status(409).json({ message: `${field} is already taken. Try a different one.` })
    }

    const otp = generateOTP()
    const user = await User.create({
      username,
      email,
      passwordHash: password, // pre-save hook hashes it
      challengeStartDate: new Date(),
      isVerified: false,
      otpCode: otp,
      otpExpiry: new Date(Date.now() + OTP_TTL_MS),
    })

    // Send email in background so the request doesn't hang
    sendOTPEmail(email, otp).catch(err => console.error('[Mailer] Background error:', err.message))
    
    if (process.env.NODE_ENV !== 'production') console.log(`[DEV] OTP for ${email}: ${otp}`)

    res.status(201).json({
      message: 'Account created! Check your email for the verification code.',
      email,
      requiresOTP: true,
    })
  } catch (err) { next(err) }
}

/* ─── POST /auth/verify-otp ────────────────────────────────────────────────
   Step 2: verify OTP → mark user verified → issue tokens                  */
const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body
    if (!email || !otp) return res.status(400).json({ message: 'Email and OTP code are required.' })

    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ message: 'No account found for this email.' })

    if (user.isVerified) return res.status(400).json({ message: 'Account is already verified.' })

    if (!user.otpCode || !user.otpExpiry) {
      return res.status(400).json({ message: 'No OTP was issued. Please register again.' })
    }

    if (new Date() > user.otpExpiry) {
      return res.status(410).json({ message: 'OTP has expired. Please request a new one.' })
    }

    if (user.otpCode !== String(otp).trim()) {
      return res.status(401).json({ message: 'Incorrect OTP code. Please try again.' })
    }

    // Mark verified, clear OTP
    user.isVerified = true
    user.otpCode    = null
    user.otpExpiry  = null

    const accessToken  = signAccessToken({ id: user._id, email: user.email, role: user.role })
    const refreshToken = signRefreshToken({ id: user._id })
    user.refreshToken  = refreshToken
    await user.save({ validateBeforeSave: false })

    res.cookie('refreshToken', refreshToken, COOKIE_OPTS)
    res.status(200).json({
      message: 'Email verified! Welcome to EcoStreak 🌿',
      accessToken,
      user,
    })
  } catch (err) { next(err) }
}

/* ─── POST /auth/resend-otp ─────────────────────────────────────────────── */
const resendOTP = async (req, res, next) => {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ message: 'Email is required.' })

    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ message: 'No account found for this email.' })
    if (user.isVerified) return res.status(400).json({ message: 'Account is already verified.' })

    const otp = generateOTP()
    user.otpCode   = otp
    user.otpExpiry = new Date(Date.now() + OTP_TTL_MS)
    await user.save({ validateBeforeSave: false })

    // Send email in background
    sendOTPEmail(email, otp).catch(err => console.error('[Mailer] Background error:', err.message))

    if (process.env.NODE_ENV !== 'production') console.log(`[DEV] Resent OTP for ${email}: ${otp}`)

    res.json({ message: 'A new OTP has been sent to your email.' })
  } catch (err) { next(err) }
}

/* ─── POST /auth/login ──────────────────────────────────────────────────── */
const login = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg })

    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }

    const passwordMatch = await user.comparePassword(password)
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }

    // OTP is only enforced during new registration — not on login.
    // Silently grandfather existing pre-OTP accounts as verified.
    const accessToken  = signAccessToken({ id: user._id, email: user.email, role: user.role })
    const refreshToken = signRefreshToken({ id: user._id })
    user.refreshToken  = refreshToken
    if (!user.isVerified) user.isVerified = true
    await user.save({ validateBeforeSave: false })

    res.cookie('refreshToken', refreshToken, COOKIE_OPTS)
    res.json({ accessToken, user })
  } catch (err) { next(err) }
}

/* ─── POST /auth/logout ─────────────────────────────────────────────────── */
const logout = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken
    if (token) {
      await User.findOneAndUpdate({ refreshToken: token }, { refreshToken: null })
    }
    res.clearCookie('refreshToken')
    res.json({ message: 'Logged out successfully' })
  } catch (err) { next(err) }
}

/* ─── POST /auth/refresh-token ──────────────────────────────────────────── */
const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken
    if (!token) return res.status(401).json({ message: 'No refresh token' })

    const decoded = verifyRefreshToken(token)
    const user = await User.findById(decoded.id)
    if (!user || user.refreshToken !== token) {
      return res.status(401).json({ message: 'Invalid refresh token' })
    }

    const newAccess  = signAccessToken({ id: user._id, email: user.email, role: user.role })
    const newRefresh = signRefreshToken({ id: user._id })
    user.refreshToken = newRefresh
    await user.save({ validateBeforeSave: false })

    res.cookie('refreshToken', newRefresh, COOKIE_OPTS)
    res.json({ accessToken: newAccess, user })
  } catch (err) {
    res.clearCookie('refreshToken')
    res.status(401).json({ message: 'Session expired, please login again' })
  }
}

/* ─── POST /auth/forgot-password ────────────────────────────────────────── */
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ message: 'Email is required' })

    const user = await User.findOne({ email })
    // Always return 200 to avoid email enumeration
    if (!user) return res.json({ message: 'If that email exists, a reset code was sent.' })

    const otp = generateOTP()
    user.otpCode = otp
    user.otpExpiry = new Date(Date.now() + OTP_TTL_MS)
    await user.save({ validateBeforeSave: false })

    // Send email in background
    sendOTPEmail(email, otp).catch(err => console.error('[Mailer] Background error:', err.message))

    if (process.env.NODE_ENV !== 'production') console.log(`[DEV] Password reset OTP for ${email}: ${otp}`)

    res.json({ message: 'If that email exists, a reset code was sent.', email })
  } catch (err) { next(err) }
}

/* ─── POST /auth/reset-password ─────────────────────────────────────────── */
const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, password } = req.body
    if (!email || !otp || !password) return res.status(400).json({ message: 'Email, OTP, and new password are required' })

    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ message: 'Invalid request' })

    if (!user.otpCode || !user.otpExpiry) {
      return res.status(400).json({ message: 'No OTP was issued. Please request a new one.' })
    }

    if (new Date() > user.otpExpiry) {
      return res.status(410).json({ message: 'OTP has expired. Please request a new one.' })
    }

    if (user.otpCode !== String(otp).trim()) {
      return res.status(401).json({ message: 'Incorrect OTP code. Please try again.' })
    }

    user.passwordHash = password
    user.otpCode = null
    user.otpExpiry = null
    await user.save()

    res.json({ message: 'Password reset successfully' })
  } catch (err) { next(err) }
}

module.exports = { register, verifyOTP, resendOTP, login, logout, refreshToken, forgotPassword, resetPassword }

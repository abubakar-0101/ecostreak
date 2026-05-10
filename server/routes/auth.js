/**
 * @fileoverview Auth routes with express-validator
 */
const express  = require('express')
const { body } = require('express-validator')
const router   = express.Router()
const {
  register, verifyOTP, resendOTP,
  login, logout, refreshToken, forgotPassword, resetPassword,
} = require('../controllers/authController')
const { authLimiter } = require('../middleware/rateLimiter')

/** Validation rules */
const registerRules = [
  body('username').trim().isLength({ min: 3, max: 30 }).withMessage('Username must be 3–30 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
]
const loginRules = [
  body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
  body('password').notEmpty().withMessage('Password is required'),
]
const otpRules = [
  body('email').isEmail().normalizeEmail().withMessage('Invalid email'),
  body('otp').trim().isLength({ min: 6, max: 6 }).isNumeric().withMessage('OTP must be a 6-digit code'),
]

router.post('/register',       authLimiter, registerRules, register)
router.post('/verify-otp',     authLimiter, otpRules,      verifyOTP)
router.post('/resend-otp',     authLimiter, resendOTP)
router.post('/login',          authLimiter, loginRules,    login)
router.post('/logout',         logout)
router.post('/refresh-token',  refreshToken)
router.post('/forgot-password', authLimiter, forgotPassword)
router.post('/reset-password',  resetPassword)

module.exports = router

/**
 * @fileoverview JWT utility – sign, verify access and refresh tokens
 */
const jwt = require('jsonwebtoken')

const ACCESS_SECRET  = process.env.JWT_ACCESS_SECRET
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET

if (!ACCESS_SECRET || !REFRESH_SECRET) {
  throw new Error('FATAL: JWT secrets not configured. Set JWT_ACCESS_SECRET and JWT_REFRESH_SECRET in your .env file.')
}

/**
 * Signs a short-lived access token (15 min)
 * @param {{ id: string, email: string, role: string }} payload
 */
const signAccessToken = (payload) =>
  jwt.sign(payload, ACCESS_SECRET, { expiresIn: '15m' })

/**
 * Signs a long-lived refresh token (7 days)
 * @param {{ id: string }} payload
 */
const signRefreshToken = (payload) =>
  jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' })

/** Verify access token; throws on failure */
const verifyAccessToken = (token) => jwt.verify(token, ACCESS_SECRET)

/** Verify refresh token; throws on failure */
const verifyRefreshToken = (token) => jwt.verify(token, REFRESH_SECRET)

module.exports = { signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken }

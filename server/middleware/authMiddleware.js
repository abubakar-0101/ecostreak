/**
 * @fileoverview Auth middleware – verify JWT access token on protected routes
 */
const { verifyAccessToken } = require('../utils/jwt')
const User = require('../models/User')

/**
 * Middleware: extract Bearer token, verify, attach req.user
 */
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' })
    }

    const token = authHeader.split(' ')[1]
    const decoded = verifyAccessToken(token)

    const user = await User.findById(decoded.id).select('-passwordHash -refreshToken')
    if (!user) return res.status(401).json({ message: 'User not found' })

    req.user = user
    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired', code: 'TOKEN_EXPIRED' })
    }
    res.status(401).json({ message: 'Invalid token' })
  }
}

/** Middleware: require admin role */
const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' })
  }
  next()
}

module.exports = { protect, adminOnly }

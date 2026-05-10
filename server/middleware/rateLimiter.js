/**
 * @fileoverview Express rate limiter middleware
 */
const rateLimit = require('express-rate-limit')

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later' },
})

/** Stricter limiter for auth endpoints */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: 'Too many auth attempts, please wait 15 minutes' },
})

module.exports = rateLimiter
module.exports.authLimiter = authLimiter

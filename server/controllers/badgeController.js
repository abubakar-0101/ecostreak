/**
 * @fileoverview Badge controller – list all badges and user's unlocked badges
 */
const { Badge, UserBadge } = require('../models/Badge')
const { BADGE_CONFIG } = require('../utils/badgeConfig')

/* ─── GET /badges ─────────────────────────────────────── */
const getAllBadges = async (req, res, next) => {
  try {
    res.json({ badges: BADGE_CONFIG })
  } catch (err) { next(err) }
}

/* ─── GET /badges/unlocked ────────────────────────────── */
const getUnlocked = async (req, res, next) => {
  try {
    const userBadges = await UserBadge.find({ userId: req.user._id }).sort({ earnedAt: 1 })
    res.json({ badges: userBadges })
  } catch (err) { next(err) }
}

module.exports = { getAllBadges, getUnlocked }

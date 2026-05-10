/**
 * @fileoverview User controller – profile, stats
 */
const User = require('../models/User')
const { UserBadge } = require('../models/Badge')

/* ─── GET /user/profile ───────────────────────────────── */
const getProfile = async (req, res, next) => {
  try {
    res.json(req.user)
  } catch (err) { next(err) }
}

/* ─── PUT /user/profile ───────────────────────────────── */
const updateProfile = async (req, res, next) => {
  try {
    const allowed = ['username', 'bio', 'location', 'avatar']
    const updates = {}
    allowed.forEach(field => { if (req.body[field] !== undefined) updates[field] = req.body[field] })

    if (updates.username) {
      const exists = await User.findOne({ username: updates.username, _id: { $ne: req.user._id } })
      if (exists) return res.status(409).json({ message: 'Username already taken' })
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true })
      .select('-passwordHash -refreshToken')
    res.json({ user })
  } catch (err) { next(err) }
}

/* ─── GET /user/stats ─────────────────────────────────── */
const getStats = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
    const badgeCount = await UserBadge.countDocuments({ userId: user._id })

    res.json({
      currentStreak:      user.currentStreak,
      longestStreak:      user.longestStreak,
      ecoScore:           user.ecoScore,
      badgeCount,
      totalWaterSaved:    user.totalWaterSaved,
      totalCO2Reduced:    user.totalCO2Reduced,
      totalPlasticAvoided:user.totalPlasticAvoided,
      completedDays:      user.completedDays.length,
    })
  } catch (err) { next(err) }
}

module.exports = { getProfile, updateProfile, getStats }

/**
 * @fileoverview Badge service – checks and awards badges based on user state
 */
const { Badge, UserBadge } = require('../models/Badge')
const User = require('../models/User')

/**
 * Badge condition evaluators
 * Each function receives the full user object and returns true if the badge should be awarded
 */
const CONDITIONS = {
  first_leaf:     (u) => u.completedDays.length >= 1,
  green_week:     (u) => u.currentStreak >= 7,
  month_master:   (u) => u.currentStreak >= 30,
  halfway_hero:   (u) => u.currentStreak >= 50,
  eco_warrior:    (u) => u.completedDays.length >= 100,
  water_guardian: (u) => u.totalWaterSaved >= 100,
  carbon_crusher: (u) => u.totalCO2Reduced >= 500,
  waste_buster:   (u) => u.totalPlasticAvoided >= 200,
  early_bird:     (u) => {
    const last = u.lastCompletedAt
    return last && new Date(last).getHours() < 8
  },
}

/**
 * Checks all badge conditions for a user and awards any newly earned badges.
 * @param {import('../models/User')} user - Full Mongoose user document
 * @returns {Promise<Array>} - Array of newly earned badge objects
 */
const checkAndAwardBadges = async (user) => {
  const newBadges = []

  for (const [badgeId, condition] of Object.entries(CONDITIONS)) {
    // Skip if already earned
    if (user.unlockedBadges.includes(badgeId)) continue

    if (condition(user)) {
      // Create user-badge record
      await UserBadge.create({ userId: user._id, badgeId }).catch(() => {}) // ignore duplicate

      // Add to user's unlocked list
      await User.findByIdAndUpdate(user._id, { $addToSet: { unlockedBadges: badgeId } })

      // Increment badge earned count
      await Badge.findOneAndUpdate({ badgeId }, { $inc: { earnedByCount: 1 } })

      const badge = await Badge.findOne({ badgeId })
      if (badge) newBadges.push(badge)
    }
  }

  return newBadges
}

module.exports = { checkAndAwardBadges }

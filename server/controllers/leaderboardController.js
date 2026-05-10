/**
 * @fileoverview Leaderboard controller
 */
const User = require('../models/User')

/* ─── GET /leaderboard ────────────────────────────────── */
const getLeaderboard = async (req, res, next) => {
  try {
    const { type = 'streak', period = 'alltime' } = req.query

    const sortField = type === 'score' ? { ecoScore: -1 } : { currentStreak: -1 }

    // Weekly: users who completed a task in past 7 days
    const matchStage = period === 'weekly'
      ? { lastCompletedAt: { $gte: new Date(Date.now() - 7 * 86400000) } }
      : {}

    const top10 = await User.find(matchStage)
      .sort(sortField)
      .limit(10)
      .select('username avatar currentStreak longestStreak ecoScore _id')
      .lean()

    // Format entries
    const formatted = top10.map((u, i) => ({
      rank:          i + 1,
      userId:        u._id,
      username:      u.username,
      avatar:        u.avatar,
      currentStreak: u.currentStreak,
      longestStreak: u.longestStreak,
      ecoScore:      u.ecoScore,
    }))

    // Current user rank
    let currentUserRank = null
    const userId = req.user._id
    const userEntry = formatted.find(e => String(e.userId) === String(userId))
    if (!userEntry) {
      const allUsers = await User.find(matchStage).sort(sortField).select('_id').lean()
      const rank = allUsers.findIndex(u => String(u._id) === String(userId)) + 1
      const me = await User.findById(userId).select('username avatar currentStreak ecoScore').lean()
      if (me) {
        currentUserRank = {
          rank, userId, username: me.username, avatar: me.avatar,
          currentStreak: me.currentStreak, ecoScore: me.ecoScore,
        }
      }
    }

    res.json({ top10: formatted, currentUserRank })
  } catch (err) { next(err) }
}

module.exports = { getLeaderboard }

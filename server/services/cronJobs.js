/**
 * @fileoverview Cron jobs – daily streak reset check at midnight
 */
const cron = require('node-cron')
const User = require('../models/User')
const UserProgress = require('../models/UserProgress')

/**
 * Checks all users daily at midnight.
 * If a user missed yesterday's task, their streak is reset to 0.
 */
const setupCronJobs = () => {
  // Run every day at 00:05 AM
  cron.schedule('5 0 * * *', async () => {
    console.log('[CRON] Running daily streak check...')
    try {
      const users = await User.find({ currentStreak: { $gt: 0 } })
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      yesterday.setHours(0, 0, 0, 0)
      const yesterdayEnd = new Date(yesterday)
      yesterdayEnd.setHours(23, 59, 59, 999)

      let resetCount = 0
      for (const user of users) {
        const start = new Date(user.challengeStartDate)
        start.setHours(0, 0, 0, 0)
        const diffDays = Math.floor((yesterday - start) / 86400000)
        const expectedDay = diffDays + 1

        if (expectedDay < 1 || expectedDay > 30) continue

        // Check if yesterday's task was completed
        const completed = await UserProgress.findOne({
          userId: user._id,
          dayNumber: expectedDay,
          completedAt: { $gte: yesterday, $lte: yesterdayEnd },
        })

        if (!completed) {
          user.currentStreak = 0
          await user.save({ validateBeforeSave: false })
          resetCount++
        }
      }
      console.log(`[CRON] Streak check done. Reset ${resetCount} streaks.`)
    } catch (err) {
      console.error('[CRON] Streak check error:', err.message)
    }
  })

  console.log('✅ Cron jobs scheduled')
}

module.exports = { setupCronJobs }

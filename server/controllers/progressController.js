/**
 * @fileoverview Progress controller – calendar and streak data
 */
const UserProgress = require('../models/UserProgress')
const User         = require('../models/User')

/** Map day number to calendar status */
const getDayStatus = (dayNum, completedDays, currentDay, progressMap) => {
  if (completedDays.includes(dayNum)) return 'complete'
  if (dayNum > currentDay) return 'future'
  if (dayNum < currentDay) return 'missed'
  return 'current'
}

/* ─── GET /progress/calendar ──────────────────────────── */
const getCalendar = async (req, res, next) => {
  try {
    const user = req.user
    const start = new Date(user.challengeStartDate)
    start.setHours(0, 0, 0, 0)
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    const currentDay = Math.min(Math.floor((now - start) / 86400000) + 1, 100)

    const progressRecords = await UserProgress.find({ userId: user._id })
    const progressMap = {}
    progressRecords.forEach(p => { progressMap[p.dayNumber] = p })

    const days = Array.from({ length: 100 }, (_, i) => {
      const dayNum = i + 1
      const prog = progressMap[dayNum]
      return {
        dayNumber:   dayNum,
        status:      getDayStatus(dayNum, user.completedDays, currentDay, progressMap),
        completedAt: prog?.completedAt || null,
        isLate:      prog?.isLate || false,
      }
    })

    res.json({ days, currentDay, completedCount: user.completedDays.length })
  } catch (err) { next(err) }
}

/* ─── GET /progress/streak ────────────────────────────── */
const getStreak = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
    res.json({
      current: user.currentStreak,
      longest: user.longestStreak,
      completedDays: user.completedDays,
    })
  } catch (err) { next(err) }
}

module.exports = { getCalendar, getStreak }

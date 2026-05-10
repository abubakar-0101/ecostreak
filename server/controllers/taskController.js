/**
 * @fileoverview Task controller – today's task, get by day, complete task
 */
const Task         = require('../models/Task')
const UserProgress = require('../models/UserProgress')
const User         = require('../models/User')
const { checkAndAwardBadges } = require('../services/badgeService')

/** How many days into the challenge the user is (1-indexed) */
const getCurrentDayNumber = (challengeStartDate) => {
  const start = new Date(challengeStartDate)
  start.setHours(0, 0, 0, 0)
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const diff = Math.floor((now - start) / (1000 * 60 * 60 * 24))
  return Math.min(diff + 1, 30)
}

/** Compute consecutive streak from completed days array */
const computeStreak = (completedDays) => {
  if (!completedDays.length) return 0
  const sorted = [...new Set(completedDays)].sort((a, b) => b - a)
  let streak = 0
  for (let i = 0; i < sorted.length; i++) {
    if (i === 0 || sorted[i - 1] === sorted[i] + 1) streak++
    else break
  }
  return streak
}

/* ─── GET /tasks/today ────────────────────────────────── */
const getToday = async (req, res, next) => {
  try {
    const user = req.user
    const dayNumber = getCurrentDayNumber(user.challengeStartDate)

    const task = await Task.findOne({ dayNumber })
    if (!task) return res.json({ task: null, completedToday: false })

    // Check if already completed today
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const progress = await UserProgress.findOne({
      userId: user._id,
      dayNumber,
      completedAt: { $gte: today },
    })

    res.json({ task, completedToday: !!progress })
  } catch (err) { next(err) }
}

/* ─── GET /tasks/:dayNumber ───────────────────────────── */
const getByDay = async (req, res, next) => {
  try {
    const { dayNumber } = req.params
    const day = parseInt(dayNumber)
    if (isNaN(day) || day < 1 || day > 30) {
      return res.status(400).json({ message: 'Invalid day number (1–30)' })
    }

    const currentDay = getCurrentDayNumber(req.user.challengeStartDate)
    if (day > currentDay) {
      return res.status(403).json({ message: 'This task is not unlocked yet' })
    }

    const task = await Task.findOne({ dayNumber: day })
    if (!task) return res.status(404).json({ message: 'Task not found' })

    const progress = await UserProgress.findOne({ userId: req.user._id, dayNumber: day })
    res.json({ task, completed: !!progress, completedAt: progress?.completedAt })
  } catch (err) { next(err) }
}

/* ─── POST /tasks/:dayNumber/complete ─────────────────── */
const completeTask = async (req, res, next) => {
  try {
    const { dayNumber } = req.params
    const day = parseInt(dayNumber)
    const user = req.user

    const currentDay = getCurrentDayNumber(user.challengeStartDate)

    // Allow current day and grace period (1 day late)
    const isLate = day === currentDay - 1
    if (day !== currentDay && !isLate) {
      return res.status(400).json({ message: 'Cannot complete this day yet' })
    }

    // Prevent duplicate completions
    const existing = await UserProgress.findOne({ userId: user._id, dayNumber: day })
    if (existing) return res.status(409).json({ message: 'Already completed this day' })

    const task = await Task.findOne({ dayNumber: day })
    if (!task) return res.status(404).json({ message: 'Task not found' })

    // Points calculation (Hard tasks = 2x, Medium = 1.5x)
    const multiplier = { Easy: 1, Medium: 1.5, Hard: 2 }[task.difficulty] || 1
    const pointsEarned = Math.round(task.basePoints * multiplier)

    // Create progress record
    await UserProgress.create({ userId: user._id, taskId: task._id, dayNumber: day, isLate, pointsEarned })

    // Update user aggregates
    const fullUser = await User.findById(user._id)
    if (!fullUser.completedDays.includes(day)) {
      fullUser.completedDays.push(day)
    }

    // Recalculate streak
    const newStreak = computeStreak(fullUser.completedDays)
    fullUser.currentStreak = newStreak
    if (newStreak > fullUser.longestStreak) fullUser.longestStreak = newStreak

    fullUser.totalWaterSaved    += task.waterSaved
    fullUser.totalCO2Reduced    += task.co2Reduced
    fullUser.totalPlasticAvoided+= task.plasticAvoided
    fullUser.ecoScore           += pointsEarned
    fullUser.lastCompletedAt    = new Date()

    await fullUser.save()

    // Check & award badges
    const newBadges = await checkAndAwardBadges(fullUser)

    // Broadcast leaderboard update
    const io = req.app.get('io')
    if (io) io.emit('leaderboard:update')

    res.json({
      message:       'Task completed!',
      pointsEarned,
      currentStreak: fullUser.currentStreak,
      longestStreak: fullUser.longestStreak,
      ecoScore:      fullUser.ecoScore,
      newBadges,
    })
  } catch (err) { next(err) }
}

module.exports = { getToday, getByDay, completeTask }

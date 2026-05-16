/**
 * @fileoverview Impact controller – summary and 30-day report
 */
const User         = require('../models/User')
const UserProgress = require('../models/UserProgress')
const Task         = require('../models/Task')

/* ─── GET /impact/summary ─────────────────────────────── */
const getSummary = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)

    // Fallback to dayNumber matching in case seed script breaks taskId refs
    const progressRecords = await UserProgress.find({ userId: user._id }).sort({ dayNumber: 1 })
    const allTasks = await Task.find({})
    const taskMap = allTasks.reduce((acc, t) => { acc[t.dayNumber] = t; return acc; }, {})

    const dailyBreakdown = progressRecords.map(p => {
      const task = taskMap[p.dayNumber] || {}
      return {
        day:         p.dayNumber,
        waterSaved:  task.waterSaved || 0,
        co2Reduced:  task.co2Reduced || 0,
        plasticAvoided: task.plasticAvoided || 0,
      }
    })

    res.json({
      totalWaterSaved:     user.totalWaterSaved,
      totalCO2Reduced:     user.totalCO2Reduced,
      totalPlasticAvoided: user.totalPlasticAvoided,
      ecoScore:            user.ecoScore,
      dailyBreakdown,
    })
  } catch (err) { next(err) }
}

/* ─── GET /impact/report ──────────────────────────────── */
const getReport = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
    
    // Fallback to dayNumber matching
    const progressRecords = await UserProgress.find({ userId: user._id }).sort({ dayNumber: 1 })
    const allTasks = await Task.find({})
    const taskMap = allTasks.reduce((acc, t) => { acc[t.dayNumber] = t; return acc; }, {})

    // Daily breakdown with cumulative streak tracking
    const dailyBreakdown = []
    let streak = 0
    let lastDay = 0

    progressRecords.forEach(p => {
      const task = taskMap[p.dayNumber] || {}
      if (p.dayNumber === lastDay + 1) streak++
      else streak = 1
      lastDay = p.dayNumber

      dailyBreakdown.push({
        day:         p.dayNumber,
        waterSaved:  task.waterSaved || 0,
        co2Reduced:  task.co2Reduced || 0,
        plasticAvoided: task.plasticAvoided || 0,
        streakAtDay: streak,
      })
    })

    // Category breakdown for pie chart
    const categoryTotals = { water: 0, energy: 0, waste: 0, nature: 0 }
    progressRecords.forEach(p => {
      const task = taskMap[p.dayNumber] || {}
      if (task.category) categoryTotals[task.category] += p.pointsEarned || 0
    })

    res.json({
      totalWaterSaved:     user.totalWaterSaved,
      totalCO2Reduced:     user.totalCO2Reduced,
      totalPlasticAvoided: user.totalPlasticAvoided,
      ecoScore:            user.ecoScore,
      completedDaysCount:  user.completedDays.length,
      longestStreak:       user.longestStreak,
      dailyBreakdown,
      categoryBreakdown: categoryTotals,
    })
  } catch (err) { next(err) }
}

module.exports = { getSummary, getReport }

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

    const progressRecords = await UserProgress.find({ userId: user._id }).populate('taskId')
    const dailyBreakdown = progressRecords.map(p => ({
      day:         p.dayNumber,
      waterSaved:  p.taskId?.waterSaved || 0,
      co2Reduced:  p.taskId?.co2Reduced || 0,
      plasticAvoided: p.taskId?.plasticAvoided || 0,
    }))

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
    const progressRecords = await UserProgress.find({ userId: user._id })
      .populate('taskId').sort({ dayNumber: 1 })

    // Daily breakdown with cumulative streak tracking
    const dailyBreakdown = []
    let streak = 0
    let lastDay = 0

    progressRecords.forEach(p => {
      if (p.dayNumber === lastDay + 1) streak++
      else streak = 1
      lastDay = p.dayNumber

      dailyBreakdown.push({
        day:         p.dayNumber,
        waterSaved:  p.taskId?.waterSaved || 0,
        co2Reduced:  p.taskId?.co2Reduced || 0,
        plasticAvoided: p.taskId?.plasticAvoided || 0,
        streakAtDay: streak,
      })
    })

    // Category breakdown for pie chart
    const categoryTotals = { water: 0, energy: 0, waste: 0, nature: 0 }
    progressRecords.forEach(p => {
      if (p.taskId?.category) categoryTotals[p.taskId.category] += p.pointsEarned || 0
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

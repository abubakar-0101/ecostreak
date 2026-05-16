/**
 * @fileoverview Demo users seed – creates 7 realistic users with varying
 * completion levels (10–25 days), streaks, badges, and progress records.
 * Run with: node config/seedDemoUsers.js
 */
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })
const mongoose   = require('mongoose')
const connectDB  = require('./db')
const User       = require('../models/User')
const Task       = require('../models/Task')
const UserProgress = require('../models/UserProgress')
const { Badge, UserBadge } = require('../models/Badge')

/* ─── DEMO USER PROFILES ───────────────────────────────────
   Each user has a different personality, progress level,
   avatar, and challenge start date set in the past so their
   day numbers make sense.                                   */
const DEMO_USERS = [
  {
    username:    'GreenGoddess',
    email:       'greengoddess@ecostreak.app',
    avatar:      '🌳',
    bio:         'Passionate environmentalist. Trees are my best friends 🌿',
    location:    'Portland, OR',
    daysCompleted: 25,   // completed days 1–25 (minor gap at day 12)
    missedDays:  [12],   // missed day 12, breaks streak
    startDaysAgo: 26,
  },
  {
    username:    'EcoNinja',
    email:       'econinja@ecostreak.app',
    avatar:      '🐢',
    bio:         'Silent eco warrior. One action at a time 🥷',
    location:    'Austin, TX',
    daysCompleted: 20,
    missedDays:  [],     // perfect streak
    startDaysAgo: 21,
  },
  {
    username:    'PlanetPete',
    email:       'planetpete@ecostreak.app',
    avatar:      '🌍',
    bio:         'Geography teacher who walks the eco talk 🌎',
    location:    'Denver, CO',
    daysCompleted: 18,
    missedDays:  [5, 11],
    startDaysAgo: 22,
  },
  {
    username:    'SolarSarah',
    email:       'solarsarah@ecostreak.app',
    avatar:      '☀️',
    bio:         'Solar panel installer by day, eco warrior by night ⚡',
    location:    'Phoenix, AZ',
    daysCompleted: 15,
    missedDays:  [7],
    startDaysAgo: 20,
  },
  {
    username:    'WaveRider',
    email:       'waverider@ecostreak.app',
    avatar:      '🌊',
    bio:         'Surfer who keeps oceans clean, one wave at a time 🏄',
    location:    'San Diego, CA',
    daysCompleted: 14,
    missedDays:  [3, 8, 13],
    startDaysAgo: 18,
  },
  {
    username:    'BeeKeeper99',
    email:       'beekeeper99@ecostreak.app',
    avatar:      '🐝',
    bio:         'Beekeeper, gardener, and proud zero-waster 🍯',
    location:    'Asheville, NC',
    daysCompleted: 12,
    missedDays:  [4, 9],
    startDaysAgo: 15,
  },
  {
    username:    'UrbanForester',
    email:       'urbanforester@ecostreak.app',
    avatar:      '🦋',
    bio:         'Turning concrete jungles into green havens 🌱',
    location:    'Chicago, IL',
    daysCompleted: 10,
    missedDays:  [6],
    startDaysAgo: 12,
  },
]

/* ─── BADGE CONDITIONS ──────────────────────────────────── */
const shouldEarnBadge = (badgeId, user, totalWater, totalCO2, totalPlastic) => {
  const completedCount = user.completedDays.length
  const streak = user.currentStreak
  switch (badgeId) {
    case 'first_leaf':     return completedCount >= 1
    case 'green_week':     return user.longestStreak >= 7
    case 'halfway_hero':   return user.longestStreak >= 15
    case 'eco_warrior':    return completedCount >= 30
    case 'water_guardian': return totalWater >= 100
    case 'carbon_crusher': return totalCO2 >= 500
    case 'waste_buster':   return totalPlastic >= 200
    case 'early_bird':     return completedCount >= 5 // simulate some early completions
    default:               return false
  }
}

/* ─── COMPUTE STREAK FROM COMPLETED DAYS ────────────────── */
const computeStreak = (completedDays, allDays) => {
  if (!completedDays.length) return { current: 0, longest: 0 }
  
  const sorted = [...new Set(allDays)].sort((a, b) => a - b)
  let longest = 0
  let currentRun = 0
  let longestRun = 0
  
  for (let i = 0; i < sorted.length; i++) {
    if (!completedDays.includes(sorted[i])) {
      longestRun = Math.max(longestRun, currentRun)
      currentRun = 0
    } else {
      currentRun++
      longestRun = Math.max(longestRun, currentRun)
    }
  }
  
  // Current streak = consecutive from the end
  let current = 0
  const maxDay = Math.max(...completedDays)
  for (let d = maxDay; d >= 1; d--) {
    if (completedDays.includes(d)) current++
    else break
  }
  
  return { current, longest: longestRun }
}

const seed = async () => {
  await connectDB()
  console.log('\n🌱 Seeding demo users...\n')

  // Load all tasks
  const tasks = await Task.find({}).sort({ dayNumber: 1 })
  if (tasks.length < 25) {
    console.error('❌ Tasks not seeded yet. Run: node config/seed.js first')
    process.exit(1)
  }

  const taskMap = {}
  tasks.forEach(t => { taskMap[t.dayNumber] = t })

  const badges = await Badge.find({})
  const badgeMap = {}
  badges.forEach(b => { badgeMap[b.badgeId] = b })

  let created = 0

  for (const profile of DEMO_USERS) {
    // Remove existing demo user if present
    const existing = await User.findOne({ email: profile.email })
    if (existing) {
      await UserProgress.deleteMany({ userId: existing._id })
      await UserBadge.deleteMany({ userId: existing._id })
      await User.deleteOne({ _id: existing._id })
    }

    // Build list of all days they should have progressed through
    const allDays = Array.from({ length: profile.daysCompleted + profile.missedDays.length }, (_, i) => i + 1)
    const completedDays = allDays.filter(d => !profile.missedDays.includes(d) && d <= profile.daysCompleted)

    // Calculate impact totals from completed tasks
    let totalWaterSaved = 0, totalCO2Reduced = 0, totalPlasticAvoided = 0, ecoScore = 0

    for (const day of completedDays) {
      const task = taskMap[day]
      if (!task) continue
      totalWaterSaved    += task.waterSaved
      totalCO2Reduced    += task.co2Reduced
      totalPlasticAvoided+= task.plasticAvoided
      const multiplier = { Easy: 1, Medium: 1.5, Hard: 2 }[task.difficulty] || 1
      ecoScore += Math.round(task.basePoints * multiplier)
    }

    const { current: currentStreak, longest: longestStreak } = computeStreak(completedDays, allDays)

    // NOTE: Pass plain password — the Mongoose pre-save hook hashes it.
    // Do NOT pre-hash here or it will be double-hashed and login will always fail.

    // Challenge start date in the past
    const challengeStartDate = new Date()
    challengeStartDate.setDate(challengeStartDate.getDate() - profile.startDaysAgo)

    // Require password from env
    if (!process.env.DEMO_USER_PASSWORD) {
      console.error('❌ DEMO_USER_PASSWORD environment variable is required to seed demo users.')
      process.exit(1)
    }

    // Create user
    const user = await User.create({
      username:        profile.username,
      email:           profile.email,
      passwordHash:    process.env.DEMO_USER_PASSWORD,   // plain text — hook hashes it
      avatar:          profile.avatar,
      bio:             profile.bio,
      location:        profile.location,
      challengeStartDate,
      joinDate:        challengeStartDate,
      completedDays,
      currentStreak,
      longestStreak,
      totalWaterSaved,
      totalCO2Reduced,
      totalPlasticAvoided,
      ecoScore,
      lastCompletedAt: new Date(),
    })

    // Create UserProgress records for each completed day
    const progressDocs = []
    for (const day of completedDays) {
      const task = taskMap[day]
      if (!task) continue
      const multiplier = { Easy: 1, Medium: 1.5, Hard: 2 }[task.difficulty] || 1
      const pts = Math.round(task.basePoints * multiplier)
      // Simulate completion date based on challenge start + day offset
      const completedAt = new Date(challengeStartDate)
      completedAt.setDate(completedAt.getDate() + day - 1)
      // Randomize hour (some early, some afternoon)
      completedAt.setHours(Math.floor(Math.random() * 18) + 6)

      progressDocs.push({
        userId:      user._id,
        taskId:      task._id,
        dayNumber:   day,
        completedAt,
        isLate:      false,
        pointsEarned: pts,
      })
    }
    await UserProgress.insertMany(progressDocs)

    // Award badges
    const earnedBadges = []
    for (const [badgeId, badge] of Object.entries(badgeMap)) {
      if (shouldEarnBadge(badgeId, user, totalWaterSaved, totalCO2Reduced, totalPlasticAvoided)) {
        await UserBadge.create({ userId: user._id, badgeId }).catch(() => {})
        await User.findByIdAndUpdate(user._id, { $addToSet: { unlockedBadges: badgeId } })
        await Badge.findOneAndUpdate({ badgeId }, { $inc: { earnedByCount: 1 } })
        earnedBadges.push(badgeId)
      }
    }

    console.log(`  ✅ ${profile.username.padEnd(15)} | ${completedDays.length} days | streak ${currentStreak}d | ${longestStreak}d best | ${ecoScore} pts | badges: [${earnedBadges.join(', ')}]`)
    created++
  }

  console.log(`\n🏆 Seeded ${created} demo users successfully!\n`)
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Demo seed failed:', err)
  process.exit(1)
})

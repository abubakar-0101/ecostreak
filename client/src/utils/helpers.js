/**
 * @fileoverview App-wide utility helpers, formatters, and constants
 */

// ─── MOTIVATIONAL MESSAGES ──────────────────────────────────
/**
 * Returns a motivational message based on current streak count
 * @param {number} streak
 * @returns {string}
 */
export const getMotivationalMessage = (streak) => {
  if (streak === 0) return 'Ready to start your eco journey? 🌱'
  if (streak <= 3)  return "You've started something amazing! 🌿"
  if (streak <= 7)  return "You're building a habit — keep going! 🔥"
  if (streak <= 14) return "You're in the zone. The planet thanks you! 🌍"
  if (streak <= 29) return "One full month down. You're incredible! ⚡"
  if (streak <= 49) return "30-day champion! Halfway to legend status! 🌳"
  if (streak <= 99) return "Almost an Eco Warrior. Don't stop now! 🏆"
  return "You are a 100-Day Eco Warrior. You've changed the world! 🏆"
}

// ─── TIME OF DAY GREETING ───────────────────────────────────
/**
 * Returns greeting based on the hour of day
 * @returns {string}
 */
export const getGreeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

// ─── ECO IMPACT COMPARISONS ─────────────────────────────────
/**
 * Returns contextual comparisons for eco impact values
 * @param {{ waterSaved: number, co2Reduced: number, plasticAvoided: number }} stats
 */
export const getImpactComparisons = ({ waterSaved, co2Reduced, plasticAvoided }) => ({
  water: {
    value: waterSaved,
    unit: 'L',
    label: 'Water Saved',
    comparison: `${Math.floor(waterSaved / 65)} showers worth`,
    icon: '💧',
    color: '#3b82f6',
  },
  co2: {
    value: (co2Reduced / 1000).toFixed(2),
    unit: 'kg CO₂',
    label: 'CO₂ Reduced',
    comparison: `${Math.floor(co2Reduced / 2400)} car trips avoided`,
    icon: '🌿',
    color: '#2D6A4F',
  },
  plastic: {
    value: plasticAvoided,
    unit: 'g',
    label: 'Plastic Avoided',
    comparison: `${Math.floor(plasticAvoided / 15)} plastic bottles`,
    icon: '♻️',
    color: '#f59e0b',
  },
})

// ─── DATE HELPERS ───────────────────────────────────────────
/**
 * Returns how many days since a start date
 * @param {string|Date} startDate
 * @returns {number}
 */
export const getDaysSinceStart = (startDate) => {
  if (!startDate) return 0
  const start = new Date(startDate)
  const now = new Date()
  const diff = Math.floor((now - start) / (1000 * 60 * 60 * 24))
  return Math.min(diff + 1, 100)
}

/**
 * Formats a date to readable string
 * @param {string|Date} date
 * @returns {string}
 */
export const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Checks if two dates are the same calendar day
 */
export const isSameDay = (a, b) => {
  const da = new Date(a)
  const db = new Date(b)
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  )
}

// ─── BADGE CONFIG ───────────────────────────────────────────
export const BADGE_CONFIG = [
  { id: 'first_leaf',    name: 'First Leaf',     icon: '🌱', rarity: 'common',    description: 'Complete your very first eco task' },
  { id: 'green_week',    name: 'Green Week',      icon: '🌿', rarity: 'uncommon',  description: 'Maintain a 7-day streak' },
  { id: 'month_master',  name: 'Month Master',    icon: '🗓️', rarity: 'rare',      description: 'Maintain a 30-day streak' },
  { id: 'halfway_hero',  name: 'Halfway Hero',    icon: '⚡', rarity: 'epic',      description: 'Reach a 50-day streak' },
  { id: 'eco_warrior',   name: 'Eco Warrior',     icon: '🏆', rarity: 'legendary', description: 'Complete all 100 days' },
  { id: 'water_guardian',name: 'Water Guardian',  icon: '💧', rarity: 'rare',      description: 'Save 100 liters of water' },
  { id: 'carbon_crusher',name: 'Carbon Crusher',  icon: '🌍', rarity: 'rare',      description: 'Reduce 500g of CO₂' },
  { id: 'waste_buster',  name: 'Waste Buster',    icon: '♻️', rarity: 'uncommon',  description: 'Avoid 200g of plastic' },
  { id: 'early_bird',    name: 'Early Bird',      icon: '🌅', rarity: 'uncommon',  description: 'Complete a task before 8am' },
]

export const RARITY_COLORS = {
  common:    { bg: '#e5e7eb', text: '#6b7280', border: '#d1d5db' },
  uncommon:  { bg: '#dcfce7', text: '#16a34a', border: '#86efac' },
  rare:      { bg: '#dbeafe', text: '#2563eb', border: '#93c5fd' },
  legendary: { bg: '#fef3c7', text: '#d97706', border: '#fcd34d' },
}

// ─── CATEGORY CONFIG ────────────────────────────────────────
export const CATEGORY_CONFIG = {
  water:  { label: 'Water',  icon: '💧', color: '#3b82f6', bg: '#dbeafe' },
  energy: { label: 'Energy', icon: '⚡', color: '#f59e0b', bg: '#fef3c7' },
  waste:  { label: 'Waste',  icon: '♻️', color: '#f97316', bg: '#ffedd5' },
  nature: { label: 'Nature', icon: '🌿', color: '#22c55e', bg: '#dcfce7' },
}

// ─── MILESTONE DAYS ─────────────────────────────────────────
export const MILESTONES = [25, 50, 75, 100]

// ─── AVATAR PRESETS ─────────────────────────────────────────
export const PRESET_AVATARS = [
  { id: 1, emoji: '🌱', label: 'Seedling' },
  { id: 2, emoji: '🌿', label: 'Herb' },
  { id: 3, emoji: '🌳', label: 'Tree' },
  { id: 4, emoji: '🐢', label: 'Turtle' },
  { id: 5, emoji: '🦋', label: 'Butterfly' },
  { id: 6, emoji: '🐝', label: 'Bee' },
  { id: 7, emoji: '🌊', label: 'Wave' },
  { id: 8, emoji: '☀️', label: 'Sun' },
]

// ─── NUMBER FORMATTERS ──────────────────────────────────────
export const formatNumber = (n) => {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}

export const formatGrams = (g) => {
  if (g >= 1000) return `${(g / 1000).toFixed(2)} kg`
  return `${g} g`
}

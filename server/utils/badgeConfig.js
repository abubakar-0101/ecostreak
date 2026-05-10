/**
 * @fileoverview Shared badge config (mirrors client-side constants)
 */
const BADGE_CONFIG = [
  { id: 'first_leaf',     name: 'First Leaf',     icon: '🌱', rarity: 'common',    description: 'Complete your very first eco task', condition: 'Complete Day 1' },
  { id: 'green_week',     name: 'Green Week',      icon: '🌿', rarity: 'uncommon',  description: 'Maintain a 7-day streak', condition: '7-day streak' },
  { id: 'halfway_hero',   name: 'Halfway Hero',    icon: '⚡', rarity: 'rare',      description: 'Reach a 15-day streak', condition: '15-day streak' },
  { id: 'eco_warrior',    name: 'Eco Warrior',     icon: '🏆', rarity: 'legendary', description: 'Complete all 30 days', condition: 'Complete 30 days' },
  { id: 'water_guardian', name: 'Water Guardian',  icon: '💧', rarity: 'rare',      description: 'Save 100 liters of water', condition: '100L water saved' },
  { id: 'carbon_crusher', name: 'Carbon Crusher',  icon: '🌍', rarity: 'rare',      description: 'Reduce 500g of CO₂', condition: '500g CO₂ reduced' },
  { id: 'waste_buster',   name: 'Waste Buster',    icon: '♻️', rarity: 'uncommon',  description: 'Avoid 200g of plastic', condition: '200g plastic avoided' },
  { id: 'early_bird',     name: 'Early Bird',      icon: '🌅', rarity: 'uncommon',  description: 'Complete a task before 8am', condition: 'Before 8am' },
]

module.exports = { BADGE_CONFIG }

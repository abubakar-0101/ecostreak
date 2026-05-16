/**
 * @fileoverview Badge schema – badge definitions and earned records
 */
const mongoose = require('mongoose')

const badgeSchema = new mongoose.Schema(
  {
    badgeId:      { type: String, required: true, unique: true },
    name:         { type: String, required: true },
    description:  { type: String, required: true },
    icon:         { type: String, required: true },
    condition:    { type: String, required: true },
    rarity:       { type: String, enum: ['common','uncommon','rare','epic','legendary'], default: 'common' },
    earnedByCount:{ type: Number, default: 0 },
  },
  { timestamps: true }
)

/** Separate collection for user-badge relationships */
const userBadgeSchema = new mongoose.Schema({
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  badgeId:  { type: String, required: true },
  earnedAt: { type: Date, default: Date.now },
}, { timestamps: true })

userBadgeSchema.index({ userId: 1, badgeId: 1 }, { unique: true })

module.exports = {
  Badge:     mongoose.model('Badge', badgeSchema),
  UserBadge: mongoose.model('UserBadge', userBadgeSchema),
}

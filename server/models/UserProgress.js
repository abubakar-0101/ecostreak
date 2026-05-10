/**
 * @fileoverview UserProgress schema – tracks each completed task per user
 */
const mongoose = require('mongoose')

const userProgressSchema = new mongoose.Schema(
  {
    userId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    taskId:       { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
    dayNumber:    { type: Number, required: true },
    completedAt:  { type: Date, default: Date.now },
    isLate:       { type: Boolean, default: false },   // grace period completion
    pointsEarned: { type: Number, default: 0 },
  },
  { timestamps: true }
)

// Prevent duplicate completions per user per day
userProgressSchema.index({ userId: 1, dayNumber: 1 }, { unique: true })

module.exports = mongoose.model('UserProgress', userProgressSchema)

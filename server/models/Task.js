/**
 * @fileoverview Mongoose Task schema – represents one of 100 daily eco tasks
 */
const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema(
  {
    dayNumber:        { type: Number, required: true, unique: true, min: 1, max: 100 },
    title:            { type: String, required: true },
    description:      { type: String, required: true },
    category:         { type: String, enum: ['water','energy','waste','nature'], required: true },
    difficulty:       { type: String, enum: ['Easy','Medium','Hard'], required: true },
    estimatedMinutes: { type: Number, required: true },
    waterSaved:       { type: Number, default: 0 },   // liters
    co2Reduced:       { type: Number, default: 0 },   // grams
    plasticAvoided:   { type: Number, default: 0 },   // grams
    ecoFactTip:       { type: String, default: '' },
    basePoints:       { type: Number, default: 10 },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Task', taskSchema)

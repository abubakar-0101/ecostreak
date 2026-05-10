/**
 * @fileoverview Mongoose User schema/model
 */
const mongoose = require('mongoose')
const bcrypt   = require('bcryptjs')

const userSchema = new mongoose.Schema(
  {
    username:         { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 30 },
    email:            { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash:     { type: String, required: true },
    avatar:           { type: String, default: '🌱' },
    bio:              { type: String, default: '', maxlength: 300 },
    location:         { type: String, default: '' },
    joinDate:         { type: Date, default: Date.now },
    challengeStartDate: { type: Date, default: Date.now },
    currentStreak:    { type: Number, default: 0 },
    longestStreak:    { type: Number, default: 0 },
    totalWaterSaved:  { type: Number, default: 0 },
    totalCO2Reduced:  { type: Number, default: 0 },
    totalPlasticAvoided: { type: Number, default: 0 },
    ecoScore:         { type: Number, default: 0 },
    completedDays:    [{ type: Number }],
    unlockedBadges:   [{ type: String }],
    refreshToken:     { type: String, default: null },
    lastCompletedAt:  { type: Date, default: null },
    role:             { type: String, enum: ['user','admin'], default: 'user' },
    isVerified:       { type: Boolean, default: false },
    otpCode:          { type: String, default: null },
    otpExpiry:        { type: Date,   default: null },
  },
  { timestamps: true }
)

/** Hash password before saving */
userSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) return next()
  this.passwordHash = await bcrypt.hash(this.passwordHash, 12)
  next()
})

/** Compare plain password with stored hash */
userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash)
}

/** Strip sensitive fields from JSON output */
userSchema.methods.toJSON = function () {
  const obj = this.toObject()
  delete obj.passwordHash
  delete obj.refreshToken
  delete obj.otpCode
  delete obj.otpExpiry
  return obj
}

module.exports = mongoose.model('User', userSchema)

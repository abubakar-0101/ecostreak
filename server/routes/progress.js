const express  = require('express')
const router   = express.Router()
const { protect } = require('../middleware/authMiddleware')
const { getCalendar, getStreak } = require('../controllers/progressController')

router.get('/calendar', protect, getCalendar)
router.get('/streak',   protect, getStreak)

module.exports = router

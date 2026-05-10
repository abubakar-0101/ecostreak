const express  = require('express')
const router   = express.Router()
const { protect } = require('../middleware/authMiddleware')
const { getAllBadges, getUnlocked } = require('../controllers/badgeController')

router.get('/',         protect, getAllBadges)
router.get('/unlocked', protect, getUnlocked)

module.exports = router

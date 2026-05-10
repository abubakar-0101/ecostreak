const express  = require('express')
const router   = express.Router()
const { protect } = require('../middleware/authMiddleware')
const { getProfile, updateProfile, getStats } = require('../controllers/userController')

router.get('/profile', protect, getProfile)
router.put('/profile', protect, updateProfile)
router.get('/stats',   protect, getStats)

module.exports = router

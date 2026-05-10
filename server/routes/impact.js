const express  = require('express')
const router   = express.Router()
const { protect } = require('../middleware/authMiddleware')
const { getSummary, getReport } = require('../controllers/impactController')

router.get('/summary', protect, getSummary)
router.get('/report',  protect, getReport)

module.exports = router

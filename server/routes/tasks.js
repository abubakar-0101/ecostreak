const express  = require('express')
const router   = express.Router()
const { protect } = require('../middleware/authMiddleware')
const { getToday, getByDay, completeTask } = require('../controllers/taskController')

router.get('/today',               protect, getToday)
router.get('/:dayNumber',          protect, getByDay)
router.post('/:dayNumber/complete', protect, completeTask)

module.exports = router

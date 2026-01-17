const express = require('express');
const router = express.Router();
const timetableController = require('../controllers/timetableController');

// Generate and get timetable for a user
router.get('/generate/:userId', timetableController.generateUserTimetable);

module.exports = router;

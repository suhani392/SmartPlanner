const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Get all tasks for a user
router.get('/', taskController.getAllTasks);

// Create a new task
router.post('/', taskController.createTask);

// Update task status
router.put('/:id', taskController.updateTask);

// Delete task
router.delete('/:id', taskController.deleteTask);

module.exports = router;

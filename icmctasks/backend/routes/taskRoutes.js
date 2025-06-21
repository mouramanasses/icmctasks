const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

router.post('/:userId/tasks', taskController.createTask);
router.get('/:userId/tasks', taskController.getTasks);
router.put('/tasks/:taskId', taskController.updateTask);
router.delete('/tasks/:taskId', taskController.deleteTask);

module.exports = router;

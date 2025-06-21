const Task = require('../models/Task');

exports.createTask = async (req, res) => {
  try {
    const task = new Task({ ...req.body, userId: req.params.userId });
    await task.save();
    res.status(201).send(task);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.getTasks = async (req, res) => {
  const { userId } = req.params;
  const { status } = req.query;
  try {
    const filter = { userId };
    if (status) filter.status = status;
    const tasks = await Task.find(filter);
    res.send(tasks);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.taskId, req.body, { new: true });
    res.send(task);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.taskId);
    res.send({ message: 'Tarefa excluída' });
  } catch (err) {
    res.status(500).send(err);
  }
};

const asyncHandler = require("express-async-handler");
const Task = require("../models/taskModel");

//@desc Get all tasks
//@route GET /api/tasks
//@access private
const getTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ user_id: req.user.id });
  res.status(200).json(tasks);
});

//@desc Create a task
//@route POST /api/tasks
//@access private
const createTask = asyncHandler(async (req, res) => {
  const { name, date } = req.body;
  if (!name) {
    res.status(400);
    throw new Error("Please enter a task name");
  }
  const task = await Task.create({
    name,
    user_id: req.user.id,
    date,
  });
  res.status(201).json(task);
});

//@desc Get task
//@route GET /api/tasks/:id
//@access private
const getTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error("Task not Found");
  }
  res.status(201).json(task);
});

//@desc Update task
//@route POST /api/tasks/:id
//@access private
const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error("Task not Found");
  }

  if (task.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("User doesn't have permission to update other user tasks");
  }

  const updateTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.status(200).json(updateTask);
});

//@desc delete task
//@route DELETE /api/tasks/:id
//@access private
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error("Task not Found");
  }

  if (task.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("User doesn't have permission to delete other user tasks");
  }

  await Task.deleteOne({ _id: req.params.id });
  res.status(200).json(task);
});

module.exports = {
  getTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
};

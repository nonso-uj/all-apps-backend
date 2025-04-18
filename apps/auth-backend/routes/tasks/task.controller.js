import Joi from "joi";
import Task from "../../models/Task.js";
import { Types } from "mongoose";

export const GetTasks = async (req, res, next) => {
  const userId = req.user.userId;

  try {
    const tasks = await Task.find({ user_id: new Types.ObjectId(`${userId}`) });
    res.status(201).json({
      success: true,
      message: "Successfull",
      tasks: tasks,
    });
  } catch (error) {
    console.log("Error creating task: ", error);
    res.status(400).json({
      success: false,
      message: "Something went wrong",
      error: `${error}`,
    });
  }
};

export const CreateTask = async (req, res, next) => {
  const userId = req.user.userId;

  const validateRequest = Joi.object({
    name: Joi.string().required().messages({
      "string.empty": "Task name is required",
      "any.required": "Task name is required",
    }),
  });

  const { error } = validateRequest.validate(req.body);
  if (error) {
    const [{ message }] = error.details;
    return res.status(400).json({
      success: false,
      error: message,
    });
  }

  try {
    const newTask = new Task({
      ...req.body,
      user_id: new Types.ObjectId(`${userId}`),
    });
    await newTask.save();
    const tasks = await Task.find({ user_id: new Types.ObjectId(`${userId}`) });
    res.status(201).json({
      success: true,
      message: "New task created successfully",
      tasks: tasks,
    });
  } catch (error) {
    console.log("Error creating task: ", error);
    res.status(400).json({
      success: false,
      message: "Something went wrong",
      error: `${error}`,
    });
  }
};

export const UpdateTask = async (req, res, next) => {
  const userId = req.user.userId;
  const taskId = req.params.taskId;

  try {
    const task = await Task.findById(taskId);
    task.status = req.body.status;
    await task.save();

    const tasks = await Task.find({ user_id: new Types.ObjectId(`${userId}`) });
    res.status(201).json({
      success: true,
      message: "Task updated successfully",
      tasks: tasks,
    });
  } catch (error) {
    console.log("Error creating task: ", error);
    res.status(400).json({
      success: false,
      message: "Something went wrong",
      error: `${error}`,
    });
  }
};


export const DeleteTask = async (req, res, next) => {
  const userId = req.user.userId;
  const taskId = req.params.taskId;

  try {
    await Task.findByIdAndDelete(taskId);

    const tasks = await Task.find({ user_id: new Types.ObjectId(`${userId}`) });
    res.status(201).json({
      success: true,
      message: "Task deleted successfully",
      tasks: tasks,
    });
  } catch (error) {
    console.log("Error creating task: ", error);
    res.status(400).json({
      success: false,
      message: "Something went wrong",
      error: `${error}`,
    });
  }
};
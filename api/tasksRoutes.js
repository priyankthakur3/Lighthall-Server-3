const express = require("express");
const taskData = require("./tasksData");
const { checkString, checkTaskStatus, checkId } = require("./validations");
const router = express.Router();

router.get("/getall", async (req, res) => {
  if (!req.user || !req.user.id) {
    return res
      .status(401)
      .json({ errorMessage: "User unauthorized!", status: false });
  }
  try {
    let allUserTask = await taskData.getAllTaskUser(req.user.id);
    return res.json({
      tasksCount: allUserTask.length,
      status: true,
      taskData: allUserTask,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }
});

router.delete("/delete", async (req, res) => {
  if (!req.user || !req.user.id) {
    return res
      .status(401)
      .json({ errorMessage: "User unauthorized!", status: false });
  }
  let taskID;
  try {
    taskID = checkId(req.body.taskID);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }

  let taskDeletedInfo;
  try {
    taskDeletedInfo = await taskData.removeTask(taskID);
    return res.json(taskDeletedInfo);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }
});
router.post("/create", async (req, res) => {
  let taskTitle, taskDesc, taskStatus, taskDue;
  if (!req.user || !req.user.id) {
    return res
      .status(401)
      .json({ errorMessage: "User unauthorized!", status: false });
  }
  try {
    taskTitle = checkString(req.body.taskTitle, "Task Title");
    taskDesc = checkString(req.body.taskDesc, "Task Description");
    taskStatus = checkTaskStatus(req.body.taskStatus);
    taskDue = checkString(req.body.taskDue, "Task Due");
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }

  let newTaskObj;
  try {
    newTaskObj = await taskData.createTask(
      req.user.id,
      taskTitle,
      taskDesc,
      taskStatus,
      taskDue
    );
    console.log(newTaskObj);
    if (!newTaskObj)
      return res
        .status(500)
        .json({ errorMessage: "Something went wrong!", status: false });
    else {
      return res.json({ taskCreated: true, taskData: newTaskObj });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.put("/updateStatus", async (req, res) => {
  if (!req.user || !req.user.id) {
    return res
      .status(401)
      .json({ errorMessage: "User unauthorized!", status: false });
  }
  let taskID, taskStatus;
  try {
    taskID = checkId(req.body.taskID);
    taskStatus = checkTaskStatus(req.body.taskStatus);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }

  try {
    let updateTaskStatus = await taskData.updateTaskStatus(taskID, taskStatus);
    if (!updateTaskStatus)
      return res
        .status(404)
        .json({ error: `Task Doesnot exists for ID ${taskID}` });
    return res.json({ taskID, updated: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.put("/update", async (req, res) => {
  let taskID, taskTitle, taskDesc, taskStatus, taskDue;
  if (!req.user || !req.user.id) {
    return res
      .status(401)
      .json({ errorMessage: "User unauthorized!", status: false });
  }
  try {
    taskID = checkId(req.body.taskID);
    taskTitle = checkString(req.body.taskTitle, "Task Title");
    taskDesc = checkString(req.body.taskDesc, "Task Description");
    taskStatus = checkTaskStatus(req.body.taskStatus);
    taskDue = checkString(req.body.taskDue, "Task Due");
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }

  try {
    let updatedInfo = await taskData.updateTask(
      taskID,
      taskTitle,
      taskDesc,
      taskStatus,
      taskDue
    );
    if (!updatedInfo)
      return res
        .status(404)
        .json({ error: `Task Doesnot exists for ID ${taskID}` });
    return res.json({ taskID, updated: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  if (!req.user || !req.user.id) {
    return res
      .status(401)
      .json({ errorMessage: "User unauthorized!", status: false });
  }
  let taskID;
  try {
    taskID = checkId(req.body.taskID);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: error.message });
  }
  try {
    let taskObj = await taskData.getTask(taskID);
    if (!taskObj) return res.status(404).json({ error: "Task Not Found" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;

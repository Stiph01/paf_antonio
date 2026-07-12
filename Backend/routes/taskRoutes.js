const express = require("express");

const router = express.Router();

const taskController = require("../controllers/taskController");

router.get("/tareas", taskController.getTasks);

router.get("/tareas/:id", taskController.getTask);

router.post("/tareas", taskController.createTask);

router.put("/tareas/:id", taskController.updateTask);

router.delete("/tareas/:id", taskController.deleteTask);

module.exports = router;

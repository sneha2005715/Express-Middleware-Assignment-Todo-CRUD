const express = require("express");
const fs = require("fs");
const path = require("path");
const rateLimiter = require("../middleware/rateLimiter.middleware");
const validateTodo = require("../middleware/validateTodo.middleware");

const router = express.Router();
const dbPath = path.join(__dirname, "../db.json");

// Helpers
const readDB = () => JSON.parse(fs.readFileSync(dbPath, "utf-8"));
const writeDB = (data) =>
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

/* ---------------- CREATE TODO ---------------- */
router.post("/add", validateTodo, (req, res) => {
  const db = readDB();
  const newTodo = {
    id: Date.now().toString(),
    title: req.body.title,
    completed: false,
  };

  db.todos.push(newTodo);
  writeDB(db);

  res.status(201).json({ message: "Todo added successfully", todo: newTodo });
});

/* ---------------- GET ALL TODOS ---------------- */
router.get("/", rateLimiter, (req, res) => {
  const db = readDB();
  res.status(200).json(db.todos);
});

/* ---------------- GET SINGLE TODO ---------------- */
router.get("/:todoId", (req, res) => {
  const { todoId } = req.params;
  const db = readDB();

  const todo = db.todos.find((t) => t.id === todoId);
  if (!todo) return res.status(404).json({ message: "Todo not found" });

  res.status(200).json(todo);
});

/* ---------------- UPDATE TODO ---------------- */
router.put("/update/:todoId", (req, res) => {
  const { todoId } = req.params;
  const db = readDB();

  const index = db.todos.findIndex((t) => t.id === todoId);
  if (index === -1)
    return res.status(404).json({ message: "Todo not found" });

  db.todos[index] = { ...db.todos[index], ...req.body };
  writeDB(db);

  res.status(200).json({
    message: "Todo updated successfully",
    todo: db.todos[index],
  });
});

/* ---------------- DELETE TODO ---------------- */
router.delete("/delete/:todoId", (req, res) => {
  const { todoId } = req.params;
  const db = readDB();

  const index = db.todos.findIndex((t) => t.id === todoId);
  if (index === -1)
    return res.status(404).json({ message: "Todo not found" });

  const deletedTodo = db.todos.splice(index, 1);
  writeDB(db);

  res.status(200).json({ message: "Todo deleted successfully", deletedTodo });
});

module.exports = router;

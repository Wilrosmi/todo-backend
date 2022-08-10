import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {
  addDbItem,
  getAllDbItems,
  getDbItemById,
  DbItem,
  updateDbItemById,
  deleteDbItemById,
} from "./db";

const app = express();

/** Parses JSON data in a request automatically */
app.use(express.json());
/** To allow 'Cross-Origin Resource Sharing': https://en.wikipedia.org/wiki/Cross-origin_resource_sharing */
app.use(cors());

// read in contents of any environment variables in the .env file
dotenv.config();

// use the environment variable PORT, or 4000 as a fallback
const PORT_NUMBER = process.env.PORT ?? 4000;

// GET /todos
app.get("/todos", (req, res) => {
  const allTodos = getAllDbItems();
  res.status(200).json(allTodos);
});

// POST /todos
app.post<{}, {}, DbItem>("/todos", (req, res) => {
  const postData = req.body;
  const createdTodo = addDbItem(postData);
  res.status(201).json(createdTodo);
});

// GET /todos/:id
app.get<{ id: string }>("/todos/:id", (req, res) => {
  const matchingTodo = getDbItemById(parseInt(req.params.id));
  if (matchingTodo === "not found") {
    res.status(404).json(matchingTodo);
  } else {
    res.status(200).json(matchingTodo);
  }
});

// DELETE /todos/:id
app.delete<{ id: string }>("/todos/:id", (req, res) => {
  const matchingTodo = getDbItemById(parseInt(req.params.id));
  if (matchingTodo === "not found") {
    res.status(404).json(matchingTodo);
  } else {
    deleteDbItemById(parseInt(req.params.id));
    res.status(200).json(matchingTodo);
  }
});

// PATCH /todos/:id
app.patch<{ id: string }, {}, Partial<DbItem>>("/todos/:id", (req, res) => {
  const matchingTodo = updateDbItemById(parseInt(req.params.id), req.body);
  if (matchingTodo === "not found") {
    res.status(404).json(matchingTodo);
  } else {
    updateDbItemById(parseInt(req.params.id), req.body);
    res.status(200).json(matchingTodo);
  }
});

app.listen(PORT_NUMBER, () => {
  console.log(`Server is listening on port ${PORT_NUMBER}!`);
});

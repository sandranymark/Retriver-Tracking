import express from "express";
import { createTraining, getTrainingsByDog, deleteTraining } from "../controllers/training.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";

const router = express.Router();

// 🔹 Skapa ett träningspass
router.post("/", authenticateUser, createTraining);

// 🔹 Hämta träningspass för en specifik hund
router.get("/:dogId", authenticateUser, getTrainingsByDog);

// 🔹 Ta bort ett träningspass
router.delete("/:id", authenticateUser, deleteTraining);

export default router;

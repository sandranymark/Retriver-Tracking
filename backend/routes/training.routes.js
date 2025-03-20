import express from "express";
import { createTraining, getTrainingsByDog, deleteTraining } from "../controllers/training.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";

const router = express.Router();

// Skapar ett träningspass
router.post("/", authenticateUser, createTraining);

// Hämtar träningspass för en specifik hund (id)
router.get("/:dogId", authenticateUser, getTrainingsByDog);

// Ta bort ett träningspass
router.delete("/:id", authenticateUser, deleteTraining);

export default router;

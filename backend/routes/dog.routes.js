import express from "express";
import {
    createDog,
    getDogsByUser,
    getDogById,
    updateDog,
    deleteDog
} from "../controllers/dog.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";

const router = express.Router();

// 🔹 Skapa en hundprofil
router.post("/", authenticateUser, createDog);

// 🔹 Hämta alla hundar för inloggad användare
router.get("/", authenticateUser, getDogsByUser);

// 🔹 Hämta en specifik hund
router.get("/:id", authenticateUser, getDogById);

// 🔹 Uppdatera en hundprofil
router.put("/:id", authenticateUser, updateDog);

// 🔹 Ta bort en hund
router.delete("/:id", authenticateUser, deleteDog);

export default router;

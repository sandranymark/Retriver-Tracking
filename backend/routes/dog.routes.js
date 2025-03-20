import express from "express";
import multer from "multer";
import path from "path";

import {
    createDog,
    getDogsByUser,
    getDogById,
    updateDog,
    deleteDog
} from "../controllers/dog.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";

const router = express.Router();
const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: (req, file, callback) => {
        callback(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

// Skapar en ny hundprofil
router.post("/", upload.single("image"), authenticateUser, createDog);

// Hämtar alla hundar för inloggad användare
router.get("/", authenticateUser, getDogsByUser);

// Hämtar en specifik hund (id)
router.get("/:id", authenticateUser, getDogById);

// Uppdatera en hundprofil
router.put("/:id", authenticateUser, updateDog);

// Tar bort en hund
router.delete("/:id", authenticateUser, deleteDog);

export default router;

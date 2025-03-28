import express from "express";
import { register, login, refreshToken, logout } from "../controllers/auth.controller.js";
import { authenticateUser, authorizeAdmin } from "../middleware/auth.middleware.js";
import User from "../models/User.model.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);

// Hämta alla användare (Endast admin)
router.get("/users", authenticateUser, authorizeAdmin, async (req, res, next) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        next(err);
    }
});

// Ta bort en användare (Endast admin)
router.delete("/users/:id", authenticateUser, authorizeAdmin, async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json({ message: "User deleted successfully" });
    } catch (err) {
        next(err);
    }
});

export default router;

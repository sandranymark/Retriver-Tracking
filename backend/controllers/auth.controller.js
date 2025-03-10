import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ERROR_MESSAGES } from "../utils/errorMessages.js";

// Registrering
export const register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400);
            return next(new Error("User already exists."));
        }

        // ✅ Hasha lösenordet innan det sparas!
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Skapa användaren med HASHAT lösenord
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User created!", user: newUser });
    } catch (err) {
        next(err);
    }
};
// Inloggning
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Kolla om användaren finns
        const user = await User.findOne({ email });
        if (!user) {
            res.status(400);
            return next(new Error(ERROR_MESSAGES.USER_NOT_FOUND));
        }

        // Kolla om lösenordet stämmer
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400);
            return next(new Error(ERROR_MESSAGES.INVALID_CREDENTIALS));
        }

        // Skapa en JWT-token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );


        res.json({ message: "Login successful!", token });
    } catch (error) {
        next(err);
    }
};

import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { registerValidation, loginValidation } from "../validation/auth.validation.js";
import { ERROR_MESSAGES } from "../utils/errorMessages.js";

// Registrering
export const register = async (req, res, next) => {
    try {
        const { error } = registerValidation.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const { username, email, password } = req.body;

        // Kollar om emailen redan används av någon annan.
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            res.status(400);
            return next(new Error("Email is already in use."));
        }

        // Kollar om användarnamnet redan existerar
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            res.status(400);
            return next(new Error("Username is already taken."));
        }

        // Hashar lösenordet innan det sparas
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Skapar användaren med HASHAT lösenord
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
        const { error } = loginValidation.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const { email, password } = req.body;

        // Kolla om användaren finns
        const user = await User.findOne({ email });
        if (!user) {
            res.status(400);
            return next(new Error(ERROR_MESSAGES.USER_NOT_FOUND));
        }

        // Kolla om lösenordet stämmer med det angivna
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400);
            return next(new Error(ERROR_MESSAGES.INVALID_CREDENTIALS));
        }

        // Skapar upp JWT-token
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

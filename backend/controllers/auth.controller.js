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

        // Kollar om användarnamnet redan används av någon annan.
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            res.status(400);
            return next(new Error("Username is already taken."));
        }

        // Hashar lösenordet innan det sparas ner i databasen.
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Skapar en NY användaren med HASHAT lösenord.
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User created!", user: newUser });
    } catch (err) {
        next(err);
    }
};

// // Inloggning
// export const login = async (req, res, next) => {
//     try {
//         const { error } = loginValidation.validate(req.body);
//         if (error) return res.status(400).json({ error: error.details[0].message });

//         const { email, password } = req.body;

//         // Kolla om användaren finns
//         const user = await User.findOne({ email });
//         if (!user) {
//             res.status(400);
//             return next(new Error(ERROR_MESSAGES.USER_NOT_FOUND));
//         }

//         // Kolla om lösenordet stämmer med det angivna
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             res.status(400);
//             return next(new Error(ERROR_MESSAGES.INVALID_CREDENTIALS));
//         }

//         // Skapar upp JWT-token när användaren loggar in.
//         const token = jwt.sign(
//             { userId: user._id, role: user.role },
//             process.env.JWT_SECRET,
//             { expiresIn: "1h" }
//         );
//         res.json({ message: "Login successful!", token });
//     } catch (error) {
//         next(err);
//     }
// };

export const login = async (req, res, next) => {
    try {
        const { error } = loginValidation.validate(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: ERROR_MESSAGES.USER_NOT_FOUND });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: ERROR_MESSAGES.INVALID_CREDENTIALS });

        const accessToken = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "10s" }
        );

        const refreshToken = jwt.sign(
            { userId: user._id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({ message: "Login successful!", token: accessToken });
    } catch (err) {
        next(err);
    }
};

// REFRESH TOKEN
export const refreshToken = (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ error: "Missing refresh token" });

    try {
        const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        const newAccessToken = jwt.sign(
            { userId: payload.userId },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );
        res.json({ token: newAccessToken });
    } catch (err) {
        res.status(403).json({ error: "Invalid refresh token" });
    }
};

// LOGOUT
export const logout = (req, res) => {
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict"
    });
    res.json({ message: "Logged out" });
};
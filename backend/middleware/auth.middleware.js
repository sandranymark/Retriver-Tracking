import jwt from "jsonwebtoken";

export const authenticateUser = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    try {
        const verified = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        req.user = verified;

        console.log("Token data:", req.user);

        next();
    } catch (err) {
        res.status(401).json({ error: "Invalid token." });
    }
};

// Kollar om användaren är admin
export const authorizeAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ error: "Access denied. Admins only, loser!" });
    }
    next();
};

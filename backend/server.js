import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import errorHandler from "./middleware/errorHandler.js";

dotenv.config(); // Hämtar .env filen

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Ansluter till MongoDB
connectDB();

app.use("/api/auth", authRoutes);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://${process.env.HOST || "localhost"}:${PORT}`);
});


import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Ladda in miljövariabler från .env

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: "retrieverTracker", // 👈 Ange databasen här!
        });
        console.log("✅ MongoDB connected to retrieverTracker!");
    } catch (error) {
        console.error("❌ MongoDB connection error:", error);
        process.exit(1);
    }
};

export default connectDB;

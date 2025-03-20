import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.model.js";

dotenv.config();

const updateRole = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const user = await User.findOneAndUpdate(
            { email: "kiss@example.com" },
            { $set: { role: "admin" } },
            { new: true }
        );

        if (!user) {
            console.log("Användaren finns inte!");
            process.exit();
        }

        console.log("Användarens roll uppdaterad:", user);
        process.exit();
    } catch (err) {
        console.error("Fel vid uppdatering:", err);
        process.exit(1);
    }
};

updateRole();

// Denna har jag skapat för att kunna byta roll från user till admin.
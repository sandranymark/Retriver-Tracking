import mongoose from "mongoose";

const trainingSchema = new mongoose.Schema({
    dog: { type: mongoose.Schema.Types.ObjectId, ref: "Dog" }, // Kopplar passet till rätt hund
    date: { type: Date, default: Date.now },
    type: { type: String },
    notes: { type: String },
    rating: { type: Number, min: 1, max: 5 },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" } // Kopplar till rätt användaren
}, { timestamps: true });

const Training = mongoose.model("Training", trainingSchema);
export default Training;

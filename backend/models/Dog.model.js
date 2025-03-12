import mongoose from "mongoose";

const dogSchema = new mongoose.Schema({
    name: { type: String, required: true },
    nickname: { type: String },
    breed: { type: String, required: true },
    age: { type: Number, required: true },
    sex: { type: String, enum: ["male", "female"], required: true },
    image: { type: String },
    trainingHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Training" }],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

const Dog = mongoose.model("Dog", dogSchema);
export default Dog;

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    role: { type: String, enum: ["user", "admin"], default: "user" } // enum betyder att endast två möjliga värden är tillåtna: "user" och "admin". 
}, { timestamps: true, versionKey: false }); //Behöver inte mongoose versions key för att hålla koll på ändringar.

const User = mongoose.model("User", userSchema);

export default User;



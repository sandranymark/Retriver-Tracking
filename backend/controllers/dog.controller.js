import Dog from "../models/Dog.model.js";
import sharp from "sharp";
import path from "path"
import fs from "fs"
import { dogValidation } from "../validation/dog.validation.js";

// Multer storage setup
// Skapar en ny hundprofil på den inloggade användaren



// export const createDog = async (req, res) => {
//     const { error } = dogValidation.validate(req.body);
//     if (error) return res.status(400).json({ error: error.details[0].message });

//     const newDog = new Dog({
//         ...req.body,
//         owner: req.user.userId,
//         imageUrl: req.file ? `uploads/${req.file.filename}` : undefined
//     });

//     await newDog.save();
//     res.status(201).json({ message: "Dog profile created!", dog: newDog });
// };



export const createDog = async (req, res) => {
    const { error } = dogValidation.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    let imageUrl;

    if (req.file) {
        const originalPath = req.file.path;
        const compressedPath = path.join("uploads", `compressed-${req.file.filename}`);

        try {
            // Komprimera & spara ny fil
            await sharp(originalPath)
                .resize(300, 300)
                .jpeg({ quality: 80 })  // justerar kvaliten
                .toFile(compressedPath);

            // Ta bort originalfilen
            fs.unlinkSync(originalPath);

            // Sätt rätt path i databasen
            imageUrl = compressedPath;
        } catch (err) {
            console.error("Bildkomprimering misslyckades:", err);
            return res.status(500).json({ error: "Kunde inte behandla bilden" });
        }
    }

    const newDog = new Dog({
        ...req.body,
        owner: req.user.userId,
        imageUrl: imageUrl,
    });

    await newDog.save();
    res.status(201).json({ message: "Dog profile created!", dog: newDog });
};









// Hämtar alla hundar för inloggad användare (inklusive träningshistorik)
export const getDogsByUser = async (req, res) => {
    try {
        const dogs = await Dog.find({ owner: req.user.userId }).populate("trainingHistory");
        res.json(dogs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Hämtar en specifik hund (id)
export const getDogById = async (req, res) => {
    try {
        const dog = await Dog.findOne({ _id: req.params.id, owner: req.user.userId }).populate("trainingHistory");
        if (!dog) return res.status(404).json({ error: "Dog not found" });
        res.json(dog);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

//  Uppdaterar en hundprofil
export const updateDog = async (req, res) => {
    try {
        const { error } = dogValidation.validate(req.body, { abortEarly: false, allowUnknown: true });
        if (error) return res.status(400).json({ error: error.details.map(detail => detail.message) });

        const updatedDog = await Dog.findOneAndUpdate(
            { _id: req.params.id, owner: req.user.userId },
            { $set: req.body }, // Uppdaterar endast de fält som skickas med som ändringar
            { new: true, runValidators: true }
        );

        if (!updatedDog) return res.status(404).json({ error: "Dog not found" });

        res.json({ message: "Dog profile updated!", dog: updatedDog });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



// Ta bort en hundprofil/avliva...
export const deleteDog = async (req, res) => {
    try {
        const deletedDog = await Dog.findOneAndDelete({ _id: req.params.id, owner: req.user.userId });
        if (!deletedDog) return res.status(404).json({ error: "Dog not found" });
        res.json({ message: "Dog put down/killed successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

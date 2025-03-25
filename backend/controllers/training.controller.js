import Training from "../models/Training.model.js";
import Dog from "../models/Dog.model.js";


export const createTraining = async (req, res) => {
    try {
        const { dogId, type, notes, rating, date } = req.body;

        const dog = await Dog.findById(dogId);
        if (!dog) {
            return res.status(404).json({ error: "Dog not found" });
        }

        const newTraining = new Training({
            dog: dogId,
            type,
            notes,
            rating,
            date: date ? new Date(date) : undefined,
            owner: req.user.userId
        });

        await newTraining.save();

        // Lägg till träningspasset i hundens träningshistorik
        dog.trainingHistory.push(newTraining._id);
        await dog.save();

        res.status(201).json({ message: "Training session added!", training: newTraining });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

//Hämta träningspass för en hund (id)
export const getTrainingsByDog = async (req, res) => {
    try {
        const trainings = await Training.find({ dog: req.params.dogId }).populate("dog");
        res.json(trainings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Tar bort ett träningspass (id)
export const deleteTraining = async (req, res) => {
    try {
        const training = await Training.findByIdAndDelete(req.params.id);
        if (!training) {
            return res.status(404).json({ error: "Training session not found" });
        }

        // Ta bort träningspasset från hundens träningshistorik
        await Dog.findByIdAndUpdate(training.dog, { $pull: { trainingHistory: training._id } });

        res.json({ message: "Training session deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

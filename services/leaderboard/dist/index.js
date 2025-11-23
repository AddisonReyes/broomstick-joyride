import express from "express";
import Entry from "./models/entry.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();
const app = express();
const env = process.env.NODE_ENV || "dev";
let port = process.env.PORT || "3000";
const connectionString = process.env.MONGO_URL;
// Settings
if (connectionString) {
    mongoose.connect(connectionString);
    console.log(" - Database conected");
}
else {
    console.error(" + Error connecting database");
    process.exit();
}
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());
// Setup routes and views
app.get("/leaderboard", async (req, res) => {
    try {
        const entries = await Entry.find();
        res.status(200).send(entries);
    }
    catch (error) {
        const errorMessage = error.message;
        res.status(400).json({
            message: "Error fetching leaderboard",
            error: env === "dev" ? errorMessage : undefined,
        });
    }
});
app.post("/leaderboard", async (req, res) => {
    try {
        const { username, score } = req.body;
        const existingEntry = await Entry.findOne({ username: username });
        if (existingEntry) {
            if (existingEntry.score < score) {
                existingEntry.score = score;
                await Entry.updateOne({ _id: existingEntry._id }, { score: score });
            }
            res.status(201).send(existingEntry);
        }
        else {
            const entry = new Entry({ username, score });
            await entry.save();
            res.status(201).send(entry);
        }
    }
    catch (error) {
        const errorMessage = error.message;
        res.status(400).json({
            message: "Error creating a entry",
            error: env === "dev" ? errorMessage : undefined,
        });
    }
});
// Listen port
app.listen(port, () => {
    if (env === "dev") {
        console.log(`Server running in http://localhost:${port}`);
    }
    else {
        console.log(`Server running`);
    }
});
//# sourceMappingURL=index.js.map
import express, { Request, Response } from "express";
import Entry from "./models/entry.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const app = express();

const env: string = process.env.NODE_ENV || "dev";
let port: string = process.env.PORT || "3000";

const connectionString: string | undefined = process.env.MONGO_URL;

// Settings
if (connectionString) {
  mongoose.connect(connectionString);
  console.log(" - Database conected");
}

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Setup routes and views
app.get("/leaderboard", async (req: Request, res: Response) => {
  try {
    const entries = await Entry.find();
    res.status(200).send(entries);
  } catch (error) {
    const errorMessage = (error as unknown as Error).message;
    res.status(400).json({
      message: "Error fetching leaderboard",
      error: env === "dev" ? errorMessage : undefined,
    });
  }
});

app.post("/leaderboard", async (req: Request, res: Response) => {
  try {
    const { username, score } = req.body;
    const existingEntry = await Entry.findOne({ username: username });
    if (existingEntry) {
      if (existingEntry.score < score) {
        existingEntry.score = score;
        await Entry.updateOne({ _id: existingEntry._id }, { score: score });
      }
      res.status(201).send(existingEntry);
    } else {
      const entry = new Entry({ username, score });
      await entry.save();
      res.status(201).send(entry);
    }
  } catch (error) {
    const errorMessage = (error as unknown as Error).message;
    res.status(400).json({
      message: "Error creating a entry",
      error: env === "dev" ? errorMessage : undefined,
    });
  }
});

// Listen port
app.listen(port, () => {
  console.log(`Server running in http://localhost:${port}`);
});

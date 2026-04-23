import express from "express";
import { config } from "./config.js";
import { JSON_BODY_LIMIT, URL_ENCODED_BODY_LIMIT } from "./constants.js";
import { connectToDatabase } from "./database.js";
import { RequestValidationError } from "./errors/request-validation-error.js";
import { createCorsMiddleware } from "./middleware/cors.js";
import { rateLimit } from "./middleware/rate-limit.js";
import { listLeaderboardEntries, saveLeaderboardEntry, } from "./services/leaderboard-service.js";
import { getErrorMessage } from "./utils/error.js";
import { parseSubmission } from "./utils/leaderboard.js";
const app = express();
startServer();
function configureApp() {
    app.disable("x-powered-by");
    app.use(express.urlencoded({ extended: false, limit: URL_ENCODED_BODY_LIMIT }));
    app.use(express.json({ limit: JSON_BODY_LIMIT }));
    app.use(createCorsMiddleware(config.allowedOrigins));
    app.use(rateLimit);
}
function registerRoutes() {
    app.get("/", (_req, res) => {
        res.status(200).json({
            message: "Leaderboard API is running.",
        });
    });
    app.get("/leaderboard", async (_req, res) => {
        try {
            const entries = await listLeaderboardEntries();
            res.status(200).json(entries);
        }
        catch (error) {
            sendServerError(res, "Error fetching leaderboard", error);
        }
    });
    app.post("/leaderboard", async (req, res) => {
        try {
            const submission = parseSubmission(req.body);
            const result = await saveLeaderboardEntry(submission);
            res.status(result.created ? 201 : 200).json(result.entry);
        }
        catch (error) {
            if (error instanceof RequestValidationError) {
                res.status(400).json({ message: error.message });
                return;
            }
            sendServerError(res, "Error creating leaderboard entry", error);
        }
    });
}
async function startServer() {
    if (!config.mongoUrl) {
        console.error("Missing MONGO_URL environment variable.");
        process.exit(1);
    }
    configureApp();
    registerRoutes();
    await connectToDatabase(config.mongoUrl);
    app.listen(config.port, () => {
        if (config.env === "dev") {
            console.log(`Server running at http://localhost:${config.port}`);
            return;
        }
        console.log("Server running");
    });
}
function sendServerError(res, message, error) {
    res.status(500).json({
        message,
        error: config.env === "dev" ? getErrorMessage(error) : undefined,
    });
}
//# sourceMappingURL=index.js.map
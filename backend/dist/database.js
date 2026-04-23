import mongoose from "mongoose";
import { getErrorMessage } from "./utils/error.js";
export async function connectToDatabase(connectionString) {
    try {
        await mongoose.connect(connectionString);
        console.log("Database connected");
    }
    catch (error) {
        console.error("Error connecting to database", getErrorMessage(error));
        process.exit(1);
    }
}
//# sourceMappingURL=database.js.map
import { MAX_SCORE, MAX_USERNAME_LENGTH, MIN_USERNAME_LENGTH, } from "../constants.js";
import { RequestValidationError } from "../errors/request-validation-error.js";
export function parseSubmission(body) {
    if (!body || typeof body !== "object") {
        throw new RequestValidationError("Request body must be a JSON object.");
    }
    const { username, score } = body;
    return {
        username: sanitizeUsername(username),
        score: parseScore(score),
    };
}
function sanitizeUsername(value) {
    if (typeof value !== "string") {
        throw new RequestValidationError("Username must be a string.");
    }
    const username = value.trim();
    if (username.length < MIN_USERNAME_LENGTH ||
        username.length > MAX_USERNAME_LENGTH) {
        throw new RequestValidationError(`Username must be between ${MIN_USERNAME_LENGTH} and ${MAX_USERNAME_LENGTH} characters.`);
    }
    if (!/^[a-zA-Z0-9 _-]+$/.test(username)) {
        throw new RequestValidationError("Username can only contain letters, numbers, spaces, underscores, and hyphens.");
    }
    return username;
}
function parseScore(value) {
    if (typeof value !== "number" || !Number.isFinite(value)) {
        throw new RequestValidationError("Score must be a valid number.");
    }
    if (!Number.isInteger(value) || value < 0 || value > MAX_SCORE) {
        throw new RequestValidationError(`Score must be an integer between 0 and ${MAX_SCORE}.`);
    }
    return value;
}
//# sourceMappingURL=leaderboard.js.map
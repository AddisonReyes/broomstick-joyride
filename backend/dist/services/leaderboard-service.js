import Entry from "../models/entry.js";
import { LEADERBOARD_LIMIT } from "../constants.js";
export async function listLeaderboardEntries() {
    return Entry.find({}, { username: 1, score: 1, _id: 0 })
        .sort({ score: -1, username: 1 })
        .limit(LEADERBOARD_LIMIT)
        .lean();
}
export async function saveLeaderboardEntry(submission) {
    const existingEntry = await Entry.findOne({ username: submission.username });
    if (existingEntry) {
        if (submission.score > existingEntry.score) {
            existingEntry.score = submission.score;
            await existingEntry.save();
        }
        return {
            created: false,
            entry: {
                username: existingEntry.username,
                score: existingEntry.score,
            },
        };
    }
    const createdEntry = await Entry.create(submission);
    return {
        created: true,
        entry: {
            username: createdEntry.username,
            score: createdEntry.score,
        },
    };
}
//# sourceMappingURL=leaderboard-service.js.map
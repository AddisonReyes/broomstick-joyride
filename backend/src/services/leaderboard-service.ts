import Entry from "../models/entry.js";
import { LEADERBOARD_LIMIT } from "../constants.js";
import { LeaderboardSubmission } from "../utils/leaderboard.js";

type LeaderboardEntry = {
  username: string;
  score: number;
};

export async function listLeaderboardEntries(): Promise<LeaderboardEntry[]> {
  return Entry.find({}, { username: 1, score: 1, _id: 0 })
    .sort({ score: -1, username: 1 })
    .limit(LEADERBOARD_LIMIT)
    .lean();
}

export async function saveLeaderboardEntry(
  submission: LeaderboardSubmission
): Promise<{ entry: LeaderboardEntry; created: boolean }> {
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

import { LeaderboardSubmission } from "../utils/leaderboard.js";
type LeaderboardEntry = {
    username: string;
    score: number;
};
export declare function listLeaderboardEntries(): Promise<LeaderboardEntry[]>;
export declare function saveLeaderboardEntry(submission: LeaderboardSubmission): Promise<{
    entry: LeaderboardEntry;
    created: boolean;
}>;
export {};
//# sourceMappingURL=leaderboard-service.d.ts.map
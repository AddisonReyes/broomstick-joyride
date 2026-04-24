const defaultLeaderboardApiUrl = "http://localhost:3000";

export const gameConfig = {
  leaderboardApiUrl:
    import.meta.env.VITE_LEADERBOARD_API_URL || defaultLeaderboardApiUrl,
};

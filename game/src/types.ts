export type PlayerSceneData = {
  username: string;
};

export type LoseSceneData = PlayerSceneData & {
  score: number;
};

export type LeaderboardEntry = {
  username: string;
  score: number;
};

export type LeaderboardResponse = {
  ok: boolean;
  data: LeaderboardEntry[];
  message: string;
};

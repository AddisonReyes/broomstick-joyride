import { gameConfig } from "../config.js";
import { uiText } from "../constants.js";
import type { LeaderboardEntry, LeaderboardResponse } from "../types.js";

const requestHeaders = {
  "Content-Type": "application/json",
};

export async function getEntries(): Promise<LeaderboardResponse> {
  try {
    const response = await fetch(`${gameConfig.leaderboardApiUrl}/leaderboard`);

    if (!response.ok) {
      return createUnavailableResponse();
    }

    const data = (await response.json()) as unknown;

    return {
      ok: true,
      data: Array.isArray(data) ? (data as LeaderboardEntry[]) : [],
      message: "",
    };
  } catch {
    return createUnavailableResponse();
  }
}

export async function postEntry(
  username: string,
  score: number,
): Promise<void> {
  const normalizedScore = Math.max(0, Math.floor(score));

  try {
    const response = await fetch(`${gameConfig.leaderboardApiUrl}/leaderboard`, {
      method: "POST",
      headers: requestHeaders,
      body: JSON.stringify({ username, score: normalizedScore }),
    });

    if (!response.ok) {
      throw new Error("Unable to submit score.");
    }
  } catch {
    throw new Error("Unable to submit score.");
  }
}

function createUnavailableResponse(): LeaderboardResponse {
  return {
    ok: false,
    data: [],
    message: uiText.leaderboardUnavailable,
  };
}

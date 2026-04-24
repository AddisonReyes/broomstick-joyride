import { gameConfig } from "../config.js";
import { uiText } from "../constants.js";
import type { LeaderboardEntry, LeaderboardResponse } from "../types.js";

const requestHeaders = {
  "Content-Type": "application/json",
};
const developmentMockEntries = createDevelopmentMockEntries();

export async function getEntries(): Promise<LeaderboardResponse> {
  try {
    const response = await fetch(`${gameConfig.leaderboardApiUrl}/leaderboard`);

    if (!response.ok) {
      return createUnavailableResponse();
    }

    const data = (await response.json()) as unknown;
    const realEntries = Array.isArray(data) ? (data as LeaderboardEntry[]) : [];

    if (import.meta.env.DEV) {
      realEntries.push(...developmentMockEntries);
    }

    return {
      ok: true,
      data: realEntries,
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
    const response = await fetch(
      `${gameConfig.leaderboardApiUrl}/leaderboard`,
      {
        method: "POST",
        headers: requestHeaders,
        body: JSON.stringify({ username, score: normalizedScore }),
      },
    );

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

function createDevelopmentMockEntries(): LeaderboardEntry[] {
  return Array.from({ length: 67 }, (_value, index) => {
    const entryNumber = index + 1;

    return {
      username: `user${entryNumber}`,
      score: entryNumber,
    };
  });
}

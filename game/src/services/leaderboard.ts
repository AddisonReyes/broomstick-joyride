import { gameConfig } from "../config.js";
import { uiText } from "../constants.js";
import type { LeaderboardEntry, LeaderboardResponse } from "../types.js";

const requestHeaders = {
  "Content-Type": "application/json",
} as const;
const leaderboardEndpoint = `${gameConfig.leaderboardApiUrl}/leaderboard`;
const developmentMockEntries = createDevelopmentMockEntries();
const scoreSubmissionErrorMessage = "Unable to submit score.";

export async function getEntries(): Promise<LeaderboardResponse> {
  try {
    const response = await fetch(leaderboardEndpoint);

    if (!response.ok) {
      return createUnavailableResponse();
    }

    const data = (await response.json()) as unknown;
    const entries = appendDevelopmentMockEntries(normalizeEntries(data));

    return {
      ok: true,
      data: entries,
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
    const response = await fetch(leaderboardEndpoint, {
      method: "POST",
      headers: requestHeaders,
      body: JSON.stringify({ username, score: normalizedScore }),
    });

    if (!response.ok) {
      throw new Error(scoreSubmissionErrorMessage);
    }
  } catch {
    throw new Error(scoreSubmissionErrorMessage);
  }
}

function createUnavailableResponse(): LeaderboardResponse {
  return {
    ok: false,
    data: [],
    message: uiText.leaderboardUnavailable,
  };
}

function normalizeEntries(data: unknown): LeaderboardEntry[] {
  if (!Array.isArray(data)) {
    return [];
  }

  return data.flatMap((entry) => {
    if (!isLeaderboardEntry(entry)) {
      return [];
    }

    return [
      {
        username: entry.username,
        score: Math.max(0, Math.floor(entry.score)),
      },
    ];
  });
}

function appendDevelopmentMockEntries(
  entries: LeaderboardEntry[],
): LeaderboardEntry[] {
  if (!import.meta.env.DEV) {
    return entries;
  }

  return [...entries, ...developmentMockEntries];
}

function isLeaderboardEntry(data: unknown): data is LeaderboardEntry {
  if (typeof data !== "object" || data === null) {
    return false;
  }

  const maybeEntry = data as Partial<LeaderboardEntry>;

  return (
    typeof maybeEntry.username === "string" &&
    typeof maybeEntry.score === "number" &&
    Number.isFinite(maybeEntry.score)
  );
}

function createDevelopmentMockEntries(): LeaderboardEntry[] {
  return Array.from({ length: 67 }, (_value, index) => {
    const score = index + 1;

    return {
      username: `user${score}`,
      score,
    };
  });
}

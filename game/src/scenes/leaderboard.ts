import "kaplay/global";
import { leaderboardSettings, uiText } from "../constants.js";
import { getEntries } from "../services/leaderboard.js";
import type { LeaderboardEntry, PlayerSceneData } from "../types.js";
import { addButton, convertDistance } from "../utils.js";

export default function leaderboardScene(): void {
  scene("leaderboard", ({ username }: PlayerSceneData) => {
    addButton("Back", vec2(width() / 2, height() - 64), () => {
      go("menu", { username });
    });

    let currentPage = 0;
    let totalPages = 0;
    let allUsers: LeaderboardEntry[] = [];
    let leaderboardAvailable = true;

    const leaderboardCenterX = width() / 2;
    const leaderboardStartY = height() / 3.5;

    const pageIndicator = add([
      text(uiText.leaderboardLoading),
      pos(width() / 2, height() / 8),
      anchor("center"),
    ]);

    const statusMessage = add([
      text(""),
      pos(width() / 2, height() / 2),
      anchor("center"),
      "leaderboard-status",
    ]);

    void loadLeaderboard();

    onScroll((delta) => {
      if (!leaderboardAvailable) {
        return;
      }

      if (delta.y > 0 && currentPage < totalPages - 1) {
        currentPage++;
        renderPage();
      } else if (delta.y < 0 && currentPage > 0) {
        currentPage--;
        renderPage();
      }
    });

    onKeyPress("right", () => {
      if (leaderboardAvailable && currentPage < totalPages - 1) {
        currentPage++;
        renderPage();
      }
    });

    onKeyPress("left", () => {
      if (leaderboardAvailable && currentPage > 0) {
        currentPage--;
        renderPage();
      }
    });

    onKeyPress("down", () => {
      if (leaderboardAvailable && currentPage < totalPages - 1) {
        currentPage++;
        renderPage();
      }
    });

    onKeyPress("up", () => {
      if (leaderboardAvailable && currentPage > 0) {
        currentPage--;
        renderPage();
      }
    });

    async function loadLeaderboard(): Promise<void> {
      const result = await getEntries();

      if (!result.ok) {
        showUnavailableState(result.message);
        return;
      }

      allUsers = result.data.sort((firstEntry, secondEntry) => {
        return secondEntry.score - firstEntry.score;
      });

      if (allUsers.length === 0) {
        showEmptyState();
        return;
      }

      leaderboardAvailable = true;
      totalPages = Math.ceil(
        allUsers.length / leaderboardSettings.itemsPerPage,
      );
      renderPage();
    }

    function renderPage(): void {
      destroyAll("leaderboard-entry");
      statusMessage.text = "";

      const startIndex = currentPage * leaderboardSettings.itemsPerPage;
      const endIndex = Math.min(
        startIndex + leaderboardSettings.itemsPerPage,
        allUsers.length,
      );
      const pageUsers = allUsers.slice(startIndex, endIndex);

      let currentY = leaderboardStartY;

      for (let index = 0; index < pageUsers.length; index++) {
        const user = pageUsers[index];
        const globalIndex = startIndex + index + 1;

        add([
          text(formatLeaderboardLabel(globalIndex, user), {
            transform:
              user.username === username
                ? (characterIndex: number) => ({
                    color: hsl2rgb(
                      (time() * 0.2 + characterIndex * 0.1) % 1,
                      0.7,
                      0.8
                    ),
                    pos: vec2(
                      0,
                      wave(-4, 4, time() * 4 + characterIndex * 0.5)
                    ),
                    scale: wave(1, 1.2, time() * 3 + characterIndex),
                    angle: wave(-6, 6, time() * 3 + characterIndex),
                  })
                : undefined,
          }),
          pos(leaderboardCenterX, currentY),
          anchor("center"),
          "leaderboard-entry",
        ]);

        currentY += 40;
      }

      pageIndicator.text = `Page ${currentPage + 1} / ${totalPages}`;
    }

    function showUnavailableState(message: string): void {
      leaderboardAvailable = false;
      pageIndicator.text = uiText.leaderboardUnavailableTitle;
      statusMessage.text = message;
      destroyAll("leaderboard-entry");
    }

    function showEmptyState(): void {
      leaderboardAvailable = true;
      currentPage = 0;
      totalPages = 1;
      pageIndicator.text = "Page 1 / 1";
      statusMessage.text = uiText.leaderboardEmpty;
      destroyAll("leaderboard-entry");
    }
  });
}

function formatLeaderboardLabel(
  rank: number,
  entry: LeaderboardEntry
): string {
  return `#${rank} ~ ${entry.username} / ${convertDistance(entry.score)}m`;
}

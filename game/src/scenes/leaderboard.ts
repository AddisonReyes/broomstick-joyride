import "kaplay/global";
import { leaderboardSettings, uiText } from "../constants.js";
import { getEntries } from "../services/leaderboard.js";
import type { LeaderboardEntry, PlayerSceneData } from "../types.js";
import { convertDistance } from "../utils.js";
import {
  addArcaneButton,
  addArcaneNightBackdrop,
  addArcanePanel,
  getArcanePalette,
} from "../ui/arcane.js";

export default function leaderboardScene(): void {
  scene("leaderboard", ({ username }: PlayerSceneData) => {
    const palette = getArcanePalette();
    const panelCenter = vec2(width() / 2, height() / 2 + 12);
    const panelSize = vec2(760, 470);
    const panelTop = panelCenter.y - panelSize.y / 2;
    const tableWidth = 560;
    const tableCenterX = width() / 2;
    const tableLeft = tableCenterX - tableWidth / 2;
    const rowHorizontalPadding = 18;
    const rankColumnWidth = 76;
    const riderColumnLeft = tableLeft + rowHorizontalPadding + rankColumnWidth;
    const rankColumnLeft = tableLeft + rowHorizontalPadding;
    const scoreColumnRight = tableLeft + tableWidth - rowHorizontalPadding;

    addArcaneNightBackdrop();
    addArcanePanel(panelCenter, panelSize, 10);

    add([
      text("Leaderboard", { size: 64 }),
      pos(width() / 2, 88),
      anchor("center"),
      color(palette.goldGlow),
      fixed(),
      z(12),
    ]);

    add([
      text("Top broom riders under the midnight moon", { size: 16 }),
      pos(width() / 2, 130),
      anchor("center"),
      color(palette.titleBlue),
      fixed(),
      z(12),
    ]);

    const tableTop = panelTop + 62;
    const rowHeight = 34;
    const firstRowOffset = rowHeight;
    const rowWidth = tableWidth - 18;
    const rowCenterX = tableCenterX;

    addTableHeader("Rank", rankColumnLeft, tableTop, "left");
    addTableHeader("Rider", riderColumnLeft, tableTop, "left");
    addTableHeader("Distance", scoreColumnRight, tableTop, "right");

    let currentPage = 0;
    let totalPages = 1;
    let allUsers: LeaderboardEntry[] = [];
    let leaderboardAvailable = true;

    const pageIndicator = add([
      text(uiText.leaderboardLoading, { size: 16 }),
      pos(width() / 2, height() - 146),
      anchor("center"),
      color(palette.footerBlue),
      fixed(),
      z(12),
    ]);

    const statusMessage = add([
      text("", { size: 16, width: 520, align: "center" }),
      pos(width() / 2, panelCenter.y + 36),
      anchor("center"),
      color(palette.parchment),
      fixed(),
      z(12),
    ]);

    addArcaneButton(
      "Back",
      vec2(width() / 2 - 210, height() - 82),
      () => {
        go("menu", { username });
      },
      "",
      210,
    );

    addArcaneButton(
      "Prev",
      vec2(width() / 2, height() - 82),
      () => {
        if (leaderboardAvailable && currentPage > 0) {
          currentPage--;
          renderPage();
        }
      },
      "",
      180,
    );

    addArcaneButton(
      "Next",
      vec2(width() / 2 + 210, height() - 82),
      () => {
        if (leaderboardAvailable && currentPage < totalPages - 1) {
          currentPage++;
          renderPage();
        }
      },
      "",
      210,
    );

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
      totalPages = Math.max(
        1,
        Math.ceil(allUsers.length / leaderboardSettings.itemsPerPage),
      );
      renderPage();
    }

    function renderPage(): void {
      destroyAll("leaderboard-entry");
      statusMessage.text = "";

      const startIndex = currentPage * leaderboardSettings.itemsPerPage;
      const pageUsers = allUsers.slice(
        startIndex,
        startIndex + leaderboardSettings.itemsPerPage,
      );

      for (let index = 0; index < pageUsers.length; index++) {
        const entry = pageUsers[index];
        const rank = startIndex + index + 1;
        const rowY = tableTop + firstRowOffset + index * rowHeight;
        const isCurrentPlayer = entry.username === username;

        add([
          rect(rowWidth, 26, { radius: 10 }),
          pos(rowCenterX, rowY),
          anchor("center"),
          color(isCurrentPlayer ? palette.arcaneBlue : palette.buttonBase),
          opacity(isCurrentPlayer ? 0.42 : 0.34),
          fixed(),
          z(11),
          "leaderboard-entry",
        ]);

        addLeaderboardCell(
          `#${rank}`,
          vec2(rankColumnLeft, rowY),
          isCurrentPlayer,
          "left",
        );

        addLeaderboardCell(
          trimRiderName(entry.username),
          vec2(riderColumnLeft, rowY),
          isCurrentPlayer,
          "left",
        );

        addLeaderboardCell(
          `${convertDistance(entry.score)}m`,
          vec2(scoreColumnRight, rowY),
          isCurrentPlayer,
          "right",
        );
      }

      pageIndicator.text = `Page ${currentPage + 1} / ${totalPages}`;
    }

    function showUnavailableState(message: string): void {
      leaderboardAvailable = false;
      pageIndicator.text = uiText.leaderboardUnavailableTitle;
      statusMessage.text = message;
      statusMessage.color = palette.danger;
      destroyAll("leaderboard-entry");
    }

    function showEmptyState(): void {
      leaderboardAvailable = true;
      currentPage = 0;
      totalPages = 1;
      pageIndicator.text = "Page 1 / 1";
      statusMessage.text = uiText.leaderboardEmpty;
      statusMessage.color = palette.parchment;
      destroyAll("leaderboard-entry");
    }

    function addTableHeader(
      textValue: string,
      x: number,
      y: number,
      align: "left" | "right",
    ): void {
      add([
        text(textValue, { size: 16 }),
        pos(x, y),
        anchor(align),
        color(palette.goldGlow),
        fixed(),
        z(12),
      ]);
    }

    function addLeaderboardCell(
      textValue: string,
      position: ReturnType<typeof vec2>,
      highlighted: boolean,
      align: "left" | "center" | "right" = "center",
    ): void {
      const displayText = add([
        text(textValue, { size: 16 }),
        pos(position),
        anchor(
          align === "left" ? "left" : align === "right" ? "right" : "center",
        ),
        color(highlighted ? palette.labelHover : palette.parchment),
        fixed(),
        z(12),
        "leaderboard-entry",
      ]);

      if (highlighted) {
        displayText.onUpdate(() => {
          displayText.color = hsl2rgb((time() * 0.15) % 1, 0.55, 0.82);
        });
      }
    }
  });
}

function trimRiderName(username: string): string {
  if (username.length <= 18) {
    return username;
  }

  return `${username.slice(0, 15)}...`;
}

import "kaplay/global";
import { leaderboardSettings, uiText } from "../constants.js";
import { scaleUi } from "../layout.js";
import { getEntries } from "../services/leaderboard.js";
import type { LeaderboardEntry, PlayerSceneData } from "../types.js";
import { convertDistance } from "../utils.js";
import {
  addArcaneButton,
  addArcaneNightBackdrop,
  addArcanePanel,
  getArcanePalette,
  type ArcanePalette,
} from "../ui/arcane.js";

const leaderboardEntryTag = "leaderboard-entry";

type TextAlign = "left" | "center" | "right";
type LeaderboardLayout = ReturnType<typeof createLeaderboardLayout>;

export default function leaderboardScene(): void {
  scene("leaderboard", ({ username }: PlayerSceneData) => {
    const palette = getArcanePalette();
    const layout = createLeaderboardLayout();
    let currentPage = 0;
    let totalPages = 1;
    let entries: LeaderboardEntry[] = [];
    let leaderboardAvailable = true;

    addArcaneNightBackdrop();
    addArcanePanel(layout.panelCenter, layout.panelSize, 10);
    addLeaderboardHeading(palette);
    addTableHeaders(layout, palette);

    const pageIndicator = addPageIndicator(palette);
    const statusMessage = addStatusMessage(layout, palette);

    addArcaneButton(
      "Back",
      layout.backButtonCenter,
      () => {
        go("menu", { username });
      },
      "",
      210,
    );

    addArcaneButton(
      "Prev",
      layout.prevButtonCenter,
      () => {
        changePage(-1);
      },
      "",
      180,
    );

    addArcaneButton(
      "Next",
      layout.nextButtonCenter,
      () => {
        changePage(1);
      },
      "",
      210,
    );

    void loadLeaderboard();

    onScroll((delta) => {
      if (delta.y !== 0) {
        changePage(delta.y > 0 ? 1 : -1);
      }
    });

    onKeyPress("right", () => {
      changePage(1);
    });

    onKeyPress("left", () => {
      changePage(-1);
    });

    async function loadLeaderboard(): Promise<void> {
      const result = await getEntries();

      if (!result.ok) {
        showUnavailableState(result.message);
        return;
      }

      entries = sortEntriesByScore(result.data);
      currentPage = 0;

      if (entries.length === 0) {
        showEmptyState();
        return;
      }

      leaderboardAvailable = true;
      totalPages = Math.max(
        1,
        Math.ceil(entries.length / leaderboardSettings.itemsPerPage),
      );
      renderPage();
    }

    function changePage(step: number): void {
      if (!leaderboardAvailable) {
        return;
      }

      const nextPage = currentPage + step;

      if (!isValidPage(nextPage, totalPages)) {
        return;
      }

      currentPage = nextPage;
      renderPage();
    }

    function renderPage(): void {
      clearLeaderboardRows();
      statusMessage.text = "";

      const startIndex = currentPage * leaderboardSettings.itemsPerPage;
      const pageEntries = entries.slice(
        startIndex,
        startIndex + leaderboardSettings.itemsPerPage,
      );

      renderLeaderboardRows(pageEntries, startIndex, username, layout, palette);

      pageIndicator.text = `Page ${currentPage + 1} / ${totalPages}`;
    }

    function showUnavailableState(message: string): void {
      leaderboardAvailable = false;
      currentPage = 0;
      totalPages = 1;
      clearLeaderboardRows();
      pageIndicator.text = uiText.leaderboardUnavailableTitle;
      statusMessage.text = message;
      statusMessage.color = palette.danger;
    }

    function showEmptyState(): void {
      leaderboardAvailable = true;
      currentPage = 0;
      totalPages = 1;
      clearLeaderboardRows();
      pageIndicator.text = "Page 1 / 1";
      statusMessage.text = uiText.leaderboardEmpty;
      statusMessage.color = palette.parchment;
    }
  });
}

function createLeaderboardLayout() {
  const panelCenter = vec2(width() / 2, height() / 2 + scaleUi(12));
  const panelSize = vec2(scaleUi(760), scaleUi(470));
  const panelTop = panelCenter.y - panelSize.y / 2;
  const tableWidth = scaleUi(560);
  const tableCenterX = width() / 2;
  const tableLeft = tableCenterX - tableWidth / 2;
  const rowHorizontalPadding = scaleUi(18);
  const rankColumnWidth = scaleUi(76);
  const rowHeight = scaleUi(34);

  return {
    panelCenter,
    panelSize,
    tableTop: panelTop + scaleUi(62),
    rowHeight,
    firstRowOffset: rowHeight,
    rowWidth: tableWidth - scaleUi(18),
    rowCenterX: tableCenterX,
    rankColumnLeft: tableLeft + rowHorizontalPadding,
    riderColumnLeft: tableLeft + rowHorizontalPadding + rankColumnWidth,
    scoreColumnRight: tableLeft + tableWidth - rowHorizontalPadding,
    statusCenter: vec2(width() / 2, panelCenter.y + scaleUi(36)),
    backButtonCenter: vec2(width() / 2 - scaleUi(210), height() - scaleUi(82)),
    prevButtonCenter: vec2(width() / 2, height() - scaleUi(82)),
    nextButtonCenter: vec2(width() / 2 + scaleUi(210), height() - scaleUi(82)),
  };
}

function addLeaderboardHeading(palette: ArcanePalette): void {
  add([
    text("Leaderboard", { size: scaleUi(64) }),
    pos(width() / 2, scaleUi(88)),
    anchor("center"),
    color(palette.goldGlow),
    fixed(),
    z(12),
  ]);

  add([
    text("Top broom riders under the midnight moon", { size: scaleUi(16) }),
    pos(width() / 2, scaleUi(130)),
    anchor("center"),
    color(palette.titleBlue),
    fixed(),
    z(12),
  ]);
}

function addTableHeaders(
  layout: LeaderboardLayout,
  palette: ArcanePalette,
): void {
  addTableHeader(
    "Rank",
    layout.rankColumnLeft,
    layout.tableTop,
    "left",
    palette,
  );
  addTableHeader(
    "Rider",
    layout.riderColumnLeft,
    layout.tableTop,
    "left",
    palette,
  );
  addTableHeader(
    "Distance",
    layout.scoreColumnRight,
    layout.tableTop,
    "right",
    palette,
  );
}

function addTableHeader(
  textValue: string,
  x: number,
  y: number,
  align: Exclude<TextAlign, "center">,
  palette: ArcanePalette,
): void {
  add([
    text(textValue, { size: scaleUi(16) }),
    pos(x, y),
    anchor(align),
    color(palette.goldGlow),
    fixed(),
    z(12),
  ]);
}

function addPageIndicator(palette: ArcanePalette) {
  return add([
    text(uiText.leaderboardLoading, { size: scaleUi(16) }),
    pos(width() / 2, height() - scaleUi(146)),
    anchor("center"),
    color(palette.footerBlue),
    fixed(),
    z(12),
  ]);
}

function addStatusMessage(layout: LeaderboardLayout, palette: ArcanePalette) {
  return add([
    text("", { size: scaleUi(16), width: scaleUi(520), align: "center" }),
    pos(layout.statusCenter),
    anchor("center"),
    color(palette.parchment),
    fixed(),
    z(12),
  ]);
}

function renderLeaderboardRows(
  pageEntries: LeaderboardEntry[],
  startIndex: number,
  username: string,
  layout: LeaderboardLayout,
  palette: ArcanePalette,
): void {
  for (let index = 0; index < pageEntries.length; index++) {
    const entry = pageEntries[index];
    const rank = startIndex + index + 1;
    const rowY =
      layout.tableTop + layout.firstRowOffset + index * layout.rowHeight;
    const isCurrentPlayer = entry.username === username;

    add([
      rect(layout.rowWidth, scaleUi(26), { radius: scaleUi(10) }),
      pos(layout.rowCenterX, rowY),
      anchor("center"),
      color(isCurrentPlayer ? palette.arcaneBlue : palette.buttonBase),
      opacity(isCurrentPlayer ? 0.42 : 0.34),
      fixed(),
      z(11),
      leaderboardEntryTag,
    ]);

    addLeaderboardCell(
      `#${rank}`,
      vec2(layout.rankColumnLeft, rowY),
      isCurrentPlayer,
      palette,
      "left",
    );

    addLeaderboardCell(
      trimRiderName(entry.username),
      vec2(layout.riderColumnLeft, rowY),
      isCurrentPlayer,
      palette,
      "left",
    );

    addLeaderboardCell(
      `${convertDistance(entry.score)}m`,
      vec2(layout.scoreColumnRight, rowY),
      isCurrentPlayer,
      palette,
      "right",
    );
  }
}

function addLeaderboardCell(
  textValue: string,
  position: ReturnType<typeof vec2>,
  highlighted: boolean,
  palette: ArcanePalette,
  align: TextAlign = "center",
): void {
  const cellAnchor =
    align === "left" ? "left" : align === "right" ? "right" : "center";
  const displayText = add([
    text(textValue, { size: scaleUi(16) }),
    pos(position),
    anchor(cellAnchor),
    color(highlighted ? palette.labelHover : palette.parchment),
    fixed(),
    z(12),
    leaderboardEntryTag,
  ]);

  if (highlighted) {
    displayText.onUpdate(() => {
      displayText.color = hsl2rgb((time() * 0.15) % 1, 0.55, 0.82);
    });
  }
}

function clearLeaderboardRows(): void {
  destroyAll(leaderboardEntryTag);
}

function sortEntriesByScore(entries: LeaderboardEntry[]): LeaderboardEntry[] {
  return [...entries].sort((firstEntry, secondEntry) => {
    return secondEntry.score - firstEntry.score;
  });
}

function isValidPage(pageIndex: number, totalPages: number): boolean {
  return pageIndex >= 0 && pageIndex < totalPages;
}

function trimRiderName(username: string): string {
  if (username.length <= 18) {
    return username;
  }

  return `${username.slice(0, 15)}...`;
}

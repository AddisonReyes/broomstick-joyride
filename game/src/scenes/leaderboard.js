import "kaplay/global";
import { addButton, convertDistance, getEntries } from "../utils.js";

export default function leaderboardScene() {
  scene("leaderboard", ({ username }) => {
    const backBtn = addButton("Back", vec2(width() / 2, height() - 64), () => {
      go("menu", { username: username });
    });

    let currentPage = 0;
    const ITEMS_PER_PAGE = 10;
    let totalPages = 0;
    let allUsers = [];

    const { x, y } = { x: width() / 2, y: height() / 3.5 };

    const pageIndicator = add([
      text("Page 1 / 1"),
      pos(width() / 2, height() / 4 / 2),
      anchor("center"),
    ]);

    function renderPage() {
      destroyAll("leaderboard-entry");

      const start = currentPage * ITEMS_PER_PAGE;
      const end = Math.min(start + ITEMS_PER_PAGE, allUsers.length);
      const pageUsers = allUsers.slice(start, end);

      let posY = y;
      for (let i = 0; i < pageUsers.length; i++) {
        const user = pageUsers[i];
        const globalIndex = start + i + 1;

        add([
          text(
            `#${globalIndex} ~ ${user.username} / ${convertDistance(
              user.score
            )}m`,
            {
              transform:
                user.username === username
                  ? (idx, ch) => ({
                      color: hsl2rgb((time() * 0.2 + idx * 0.1) % 1, 0.7, 0.8),
                      pos: vec2(0, wave(-4, 4, time() * 4 + idx * 0.5)),
                      scale: wave(1, 1.2, time() * 3 + idx),
                      angle: wave(-6, 6, time() * 3 + idx),
                    })
                  : undefined,
            }
          ),
          pos(x, posY),
          anchor("center"),
          "leaderboard-entry",
        ]);

        posY += 40;
      }

      pageIndicator.text = `Page ${currentPage + 1} / ${totalPages}`;
    }

    const entries = getEntries();
    entries.then((users) => {
      allUsers = users.sort((a, b) => b.score - a.score);
      totalPages = Math.ceil(allUsers.length / ITEMS_PER_PAGE);
      renderPage();
    });

    onScroll((delta) => {
      if (delta.y > 0 && currentPage < totalPages - 1) {
        currentPage++;
        renderPage();
      } else if (delta.y < 0 && currentPage > 0) {
        currentPage--;
        renderPage();
      }
    });

    onKeyPress("right", () => {
      if (currentPage < totalPages - 1) {
        currentPage++;
        renderPage();
      }
    });

    onKeyPress("left", () => {
      if (currentPage > 0) {
        currentPage--;
        renderPage();
      }
    });

    onKeyPress("down", () => {
      if (currentPage < totalPages - 1) {
        currentPage++;
        renderPage();
      }
    });

    onKeyPress("up", () => {
      if (currentPage > 0) {
        currentPage--;
        renderPage();
      }
    });
  });
}

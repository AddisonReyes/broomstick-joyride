import "kaplay/global";
import { addButton } from "../utils.js";

export default function menuScene() {
  scene("menu", ({ username }) => {
    add([
      text("Broomstick Joyride", { size: 64 }),
      pos(width() / 2, height() / 2 - 160 + 6),
      anchor("center"),
      color(0, 0, 0),
      z(-1),
    ]);

    add([
      text("Broomstick Joyride", { size: 64 }),
      pos(width() / 2, height() / 2 - 160),
      anchor("center"),
      z(1),
    ]);

    const playBtn = addButton(
      "Play",
      vec2(width() / 2, height() / 2 - 64),
      () => {
        go("game", { username: username });
      }
    );

    const userBtn = addButton(
      "User",
      vec2(width() / 2, height() / 2 + 32),
      () => {
        go("user", { username: username });
      },
      username
    );

    const leaderboardBtn = addButton(
      "Leaderboard",
      vec2(width() / 2, height() / 2 + 128),
      () => {
        go("leaderboard", { username: username });
      }
    );
  });
}

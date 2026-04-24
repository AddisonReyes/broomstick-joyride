import "kaplay/global";
import type { PlayerSceneData } from "../types.js";
import { addButton } from "../utils.js";

export default function menuScene(): void {
  scene("menu", ({ username }: PlayerSceneData) => {
    add([
      text("Broomstick Joyride", { size: 64 }),
      pos(width() / 2, height() / 2 - 154),
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

    addButton("Play", vec2(width() / 2, height() / 2 - 64), () => {
      go("game", { username });
    });

    addButton(
      "User",
      vec2(width() / 2, height() / 2 + 32),
      () => {
        go("user", { username });
      },
      username
    );

    addButton("Leaderboard", vec2(width() / 2, height() / 2 + 128), () => {
      go("leaderboard", { username });
    });
  });
}

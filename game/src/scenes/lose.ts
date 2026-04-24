import "kaplay/global";
import { postEntry } from "../services/leaderboard.js";
import type { LoseSceneData } from "../types.js";
import { addButton, convertDistance } from "../utils.js";

export default function loseScene(): void {
  scene("lose", ({ username, score }: LoseSceneData) => {
    add([
      sprite("player"),
      pos(width() / 2, height() / 2 - 160),
      scale(2),
      anchor("center"),
    ]);

    add([
      text(`${convertDistance(score)}m` || "0m"),
      pos(width() / 2, height() / 2 - 32),
      scale(2),
      anchor("center"),
    ]);

    addButton("Play again", vec2(width() / 2, height() / 2 + 64), () => {
      go("game", { username });
    });

    const submitButtonPosition = vec2(width() / 2, height() / 2 + 160);

    const statusLabel = add([
      text(""),
      pos(submitButtonPosition.x + 170, submitButtonPosition.y),
      anchor("left"),
    ]);

    addButton("Submit score", submitButtonPosition, async () => {
      statusLabel.text = "Submitting score...";

      try {
        await postEntry(username, score);
        go("leaderboard", { username });
      } catch {
        statusLabel.text = "Score could not be submitted right now.";
      }
    });

    addButton("Main menu", vec2(width() / 2, height() / 2 + 256), () => {
      go("menu", { username });
    });
  });
}

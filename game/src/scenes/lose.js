import "kaplay/global";
import { addButton, convertDistance, postEntry } from "../utils.js";

export default function loseScene() {
  scene("lose", ({ username, score }) => {
    add([
      sprite("player"),
      pos(width() / 2, height() / 2 - 160),
      scale(2),
      anchor("center"),
    ]);

    // display score
    add([
      text(`${convertDistance(score)}m` || "0m"),
      pos(width() / 2, height() / 2 - 32),
      scale(2),
      anchor("center"),
    ]);

    const gameFunction = () => go("game", { username });

    addButton("Play again", vec2(width() / 2, height() / 2 + 64), gameFunction);

    addButton("Submit score", vec2(width() / 2, height() / 2 + 160), () => {
      postEntry(username, score);
      go("leaderboard", { username: username });
    });

    addButton("Main menu", vec2(width() / 2, height() / 2 + 256), () => {
      go("menu", { username: username });
    });
  });
}

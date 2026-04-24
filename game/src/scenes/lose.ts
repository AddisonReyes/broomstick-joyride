import "kaplay/global";
import { postEntry } from "../services/leaderboard.js";
import type { LoseSceneData } from "../types.js";
import { convertDistance } from "../utils.js";
import {
  addArcaneButton,
  addArcaneNightBackdrop,
  addArcanePanel,
  getArcanePalette,
} from "../ui/arcane.js";

export default function loseScene(): void {
  scene("lose", ({ username, score }: LoseSceneData) => {
    const palette = getArcanePalette();

    addArcaneNightBackdrop();
    addArcanePanel(vec2(width() / 2, height() / 2 - 12), vec2(640, 430), 10);

    add([
      sprite("player"),
      pos(width() / 2, 160),
      scale(2.3),
      rotate(18),
      anchor("center"),
      fixed(),
      z(12),
    ]);

    add([
      rect(280, 92, { radius: 20 }),
      pos(width() / 2, 314),
      anchor("center"),
      outline(4, palette.buttonOutline),
      color(palette.buttonBase),
      fixed(),
      z(11),
    ]);

    add([
      text("Final Distance", { size: 16 }),
      pos(width() / 2, 286),
      anchor("center"),
      color(palette.footerBlue),
      fixed(),
      z(12),
    ]);

    add([
      text(`${convertDistance(score)}m`, { size: 32 }),
      pos(width() / 2, 322),
      anchor("center"),
      color(palette.parchment),
      fixed(),
      z(12),
    ]);

    const statusLabel = add([
      text("", { size: 16, width: 360 }),
      pos(width() / 2 - 144, height() / 2 + 240),
      anchor("left"),
      color(palette.descriptionBlue),
      fixed(),
      z(12),
    ]);

    addArcaneButton("Play Again", vec2(width() / 2, height() / 2 - 48), () => {
      go("game", { username });
    });

    addArcaneButton(
      "Submit Score",
      vec2(width() / 2, height() / 2 + 40),
      async () => {
        statusLabel.text = "Submitting score...";
        statusLabel.color = palette.arcaneGlow;

        try {
          await postEntry(username, score);
          go("leaderboard", { username });
        } catch {
          statusLabel.text = "Score could not be submitted right now.";
          statusLabel.color = palette.danger;
        }
      },
    );

    addArcaneButton("Main Menu", vec2(width() / 2, height() / 2 + 128), () => {
      go("menu", { username });
    });
  });
}

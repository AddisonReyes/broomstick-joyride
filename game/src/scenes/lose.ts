import "kaplay/global";
import { stopGameplayMusic } from "../audio.js";
import { postEntry } from "../services/leaderboard.js";
import { scaleUi } from "../layout.js";
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
    onSceneLeave(() => {
      stopGameplayMusic();
    });

    addArcanePanel(
      vec2(width() / 2, height() / 2 - scaleUi(12)),
      vec2(scaleUi(640), scaleUi(430)),
      10,
    );

    add([
      sprite("player"),
      pos(width() / 2, scaleUi(160)),
      scale((2.3 * scaleUi(100)) / 100),
      rotate(18),
      anchor("center"),
      fixed(),
      z(12),
    ]);

    add([
      rect(scaleUi(280), scaleUi(92), { radius: scaleUi(20) }),
      pos(width() / 2, scaleUi(314)),
      anchor("center"),
      outline(scaleUi(4), palette.buttonOutline),
      color(palette.buttonBase),
      fixed(),
      z(11),
    ]);

    add([
      text("Final Distance", { size: scaleUi(16) }),
      pos(width() / 2, scaleUi(286)),
      anchor("center"),
      color(palette.footerBlue),
      fixed(),
      z(12),
    ]);

    add([
      text(`${convertDistance(score)}m`, { size: scaleUi(32) }),
      pos(width() / 2, scaleUi(322)),
      anchor("center"),
      color(palette.parchment),
      fixed(),
      z(12),
    ]);

    const statusLabel = add([
      text("", { size: scaleUi(16), width: scaleUi(360) }),
      pos(width() / 2 - scaleUi(144), height() / 2 + scaleUi(240)),
      anchor("left"),
      color(palette.descriptionBlue),
      fixed(),
      z(12),
    ]);

    addArcaneButton(
      "Play Again",
      vec2(width() / 2, height() / 2 - scaleUi(48)),
      () => {
        go("game", { username });
      },
    );

    addArcaneButton(
      "Submit Score",
      vec2(width() / 2, height() / 2 + scaleUi(40)),
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

    addArcaneButton(
      "Main Menu",
      vec2(width() / 2, height() / 2 + scaleUi(128)),
      () => {
        go("menu", { username });
      },
    );
  });
}

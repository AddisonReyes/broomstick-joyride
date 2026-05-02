import "kaplay/global";
import { scaleUi } from "../layout.js";
import type { PlayerSceneData } from "../types.js";
import {
  addArcaneButton,
  addArcaneNightBackdrop,
  getArcanePalette,
} from "../ui/arcane.js";

export default function menuScene(): void {
  scene("menu", ({ username }: PlayerSceneData) => {
    const palette = getArcanePalette();

    setCursor("default");
    addArcaneNightBackdrop("v0.1.1\tMade by Dakotitah");
    addTitleBlock(palette);

    addArcaneButton(
      "Play",
      vec2(width() / 2, height() / 2 - scaleUi(32)),
      () => {
        go("game", { username });
      },
    );

    addArcaneButton(
      "Username",
      vec2(width() / 2, height() / 2 + scaleUi(72)),
      () => {
        go("user", { username });
      },
      username,
    );

    addArcaneButton(
      "Leaderboard",
      vec2(width() / 2, height() / 2 + scaleUi(176)),
      () => {
        go("leaderboard", { username });
      },
    );
  });
}

function addTitleBlock(palette: ReturnType<typeof getArcanePalette>): void {
  add([
    text("Broomstick", { size: scaleUi(38) }),
    pos(width() / 2, scaleUi(98)),
    anchor("center"),
    color(palette.goldGlow),
    fixed(),
    z(10),
  ]);

  add([
    text("Joyride", { size: scaleUi(82) }),
    pos(width() / 2, scaleUi(162)),
    anchor("center"),
    color(palette.inkBlack),
    opacity(0.55),
    fixed(),
    z(9),
  ]);

  add([
    text("Joyride", { size: scaleUi(82) }),
    pos(width() / 2, scaleUi(154)),
    anchor("center"),
    color(palette.parchment),
    fixed(),
    z(12),
  ]);

  const glowTitle = add([
    text("Joyride", { size: scaleUi(82) }),
    pos(width() / 2, scaleUi(154)),
    anchor("center"),
    color(palette.arcaneGlow),
    opacity(0.18),
    fixed(),
    z(11),
  ]);

  glowTitle.onUpdate(() => {
    glowTitle.opacity = wave(0.1, 0.28, time() * 2.2);
  });

  add([
    text("Dash through the enchanted night", { size: scaleUi(16) }),
    pos(width() / 2, scaleUi(222)),
    anchor("center"),
    color(palette.titleBlue),
    fixed(),
    z(10),
  ]);
}

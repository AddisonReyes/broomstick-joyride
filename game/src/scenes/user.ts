import "kaplay/global";
import { uiText } from "../constants.js";
import { scaleUi } from "../layout.js";
import type { PlayerSceneData } from "../types.js";
import {
  addArcaneButton,
  addArcaneNightBackdrop,
  addArcanePanel,
  getArcanePalette,
} from "../ui/arcane.js";

export default function userScene(): void {
  scene("user", ({ username }: PlayerSceneData) => {
    const palette = getArcanePalette();

    addArcaneNightBackdrop();
    addArcanePanel(
      vec2(width() / 2, height() / 2),
      vec2(scaleUi(620), scaleUi(360)),
      10,
    );

    add([
      text("Witch Name", { size: scaleUi(32) }),
      pos(width() / 2, scaleUi(118)),
      anchor("center"),
      color(palette.goldGlow),
      fixed(),
      z(12),
    ]);

    const titleLabel = add([
      text(uiText.usernamePrompt, {
        size: scaleUi(16),
        width: scaleUi(460),
        align: "center",
      }),
      pos(width() / 2, scaleUi(176)),
      anchor("center"),
      color(palette.titleBlue),
      fixed(),
      z(12),
    ]);

    add([
      rect(scaleUi(420), scaleUi(74), { radius: scaleUi(16) }),
      pos(width() / 2, height() / 2),
      anchor("center"),
      outline(scaleUi(4), palette.buttonOutline),
      color(palette.buttonBase),
      fixed(),
      z(11),
    ]);

    add([
      rect(scaleUi(392), scaleUi(48), { radius: scaleUi(12) }),
      pos(width() / 2, height() / 2),
      anchor("center"),
      color(palette.buttonGlow),
      opacity(0.5),
      fixed(),
      z(11),
    ]);

    const usernameInput = add([
      text(username.trim()),
      textInput(true, 16),
      pos(width() / 2, height() / 2),
      anchor("center"),
      color(palette.parchment),
      fixed(),
      z(12),
    ]);

    const enterLabel = add([
      text(uiText.usernameIdle, {
        size: scaleUi(16),
        width: scaleUi(420),
        align: "center",
      }),
      pos(width() / 2, height() / 2 + scaleUi(72)),
      anchor("center"),
      color(palette.descriptionBlue),
      fixed(),
      z(12),
    ]);

    usernameInput.onUpdate(() => {
      usernameInput.text = usernameInput.text.trim();

      if (usernameInput.text === "") {
        enterLabel.text = uiText.usernameIdle;
        titleLabel.text = uiText.usernamePrompt;
        titleLabel.color = palette.titleBlue;
        return;
      }

      enterLabel.text = uiText.usernameContinue;
      titleLabel.text = "Your broom will carry this name this night";
      titleLabel.color = palette.arcaneGlow;
    });

    onKeyPress("enter", () => {
      if (usernameInput.text.trim() !== "") {
        go("menu", { username: usernameInput.text.trim() });
      }
    });
  });
}

import "kaplay/global";
import { uiText } from "../constants.js";
import type { PlayerSceneData } from "../types.js";

export default function userScene(): void {
  scene("user", ({ username }: PlayerSceneData) => {
    const titleLabel = add([
      pos(width() / 2, 64),
      text(uiText.usernamePrompt, { align: "center", width: width() }),
      anchor("center"),
    ]);

    const usernameInput = add([
      text(username.trim()),
      textInput(true, 16),
      pos(width() / 2, height() / 2),
      anchor("center"),
    ]);

    const enterLabel = add([
      pos(width() / 2, height() - 64),
      text(uiText.usernameIdle, { align: "center", width: width() }),
      anchor("center"),
    ]);

    usernameInput.onUpdate(() => {
      usernameInput.text = usernameInput.text.trim();

      if (usernameInput.text === "") {
        enterLabel.text = uiText.usernameIdle;
        titleLabel.text = uiText.usernamePrompt;
        return;
      }

      enterLabel.text = uiText.usernameContinue;
      titleLabel.text = "";
    });

    onKeyPress("enter", () => {
      if (enterLabel.text !== uiText.usernameIdle) {
        go("menu", { username: usernameInput.text });
      }
    });
  });
}

import "kaplay/global";

export default function userScene() {
  scene("user", ({ username }) => {
    const titleLabel = add([
      pos(width() / 2, 64),
      text("Type your username", { align: "center", width: width() }),
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
      text(". . .", { align: "center", width: width() }),
      anchor("center"),
    ]);

    usernameInput.onUpdate(() => {
      usernameInput.text = usernameInput.text.trim();
      if (usernameInput.text === "") {
        enterLabel.text = ". . .";
        titleLabel.text = "Type your username";
      } else {
        enterLabel.text = "Press 'Enter' to continue...";
        titleLabel.text = "";
      }
    });

    onKeyPress("enter", () => {
      if (enterLabel.text !== ". . .") {
        go("menu", { username: usernameInput.text });
      }
    });
  });
}

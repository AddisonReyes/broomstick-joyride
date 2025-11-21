import kaplay from "kaplay";
import "kaplay/global";

// Start game
kaplay({
  font: "alagard",
  background: [46, 34, 47],
});

// Constants variables

// Load Assets
loadRoot("./");

loadSprite("bean", "sprites/bean.png");

loadFont("alagard", "fonts/alagard.ttf", { filter: "nearest" });

// Game scenes
scene("user", () => {
  add([
    pos(width() / 2, 64),
    text("Type your username", { align: "center", width: width() }),
    anchor("center"),
  ]);

  const username = add([
    text(""),
    textInput(true, 12),
    pos(width() / 2, height() / 2),
    anchor("center"),
  ]);

  const enterLabel = add([
    pos(width() / 2, height() - 64),
    text(". . .", { align: "center", width: width() }),
    anchor("center"),
  ]);

  username.onUpdate(() => {
    if (username.text === "") {
      enterLabel.text = ". . .";
    } else {
      enterLabel.text = "Press 'Enter' to continue...";
    }
  });

  onKeyPress("enter", () => {
    if (enterLabel.text !== ". . .") {
      go("menu", { username: username.text });
    }
  });
});

scene("menu", () => {});

scene("game", () => {});

scene("lose", () => {});

scene("leaderboard", () => {});

function main() {
  go("user", {});
}

main();

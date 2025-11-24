import "kaplay/global";
import {
  addButton,
  hexToRgb,
  convertDistance,
  hexColorList,
} from "../utils.js";

export default function gameScene() {
  scene("game", ({ username }) => {
    // Game objects
    const player = add([
      sprite("player"),
      pos(80, height() / 2),
      area(),
      body(),
    ]);
    let speed = 480;
    let score = 0;

    function spawnObject() {
      add([
        rect(rand(16, 128), rand(32, 128)),
        area(),
        outline(4),
        rotate(rand(0, 180)),
        pos(width() + 200, rand(64, height() - 64)),
        anchor("botleft"),
        hexToRgb(choose(hexColorList)),
        z(-1),
        "object",
      ]);
    }

    // Borders
    add([
      rect(width(), 48),
      pos(0, 0),
      outline(4),
      area(),
      body({ isStatic: true }),
      hexToRgb("#2e222f"),
    ]);

    add([
      rect(width(), 48),
      pos(0, height() - 48),
      outline(4),
      area(),
      body({ isStatic: true }),
      hexToRgb("#2e222f"),
    ]);

    // Interface
    const scoreLabel = add([
      text(`${convertDistance(score)}m`),
      pos(width() / 2, 32),
      anchor("center"),
    ]);

    // Pause menu
    let paused = false;
    const pauseFunction = () => {
      paused = !paused;
      continueBtn.hidden = !paused;
      exitBtn.hidden = !paused;
    };

    const continueBtn = addButton(
      "Continue",
      vec2(width() / 2, height() / 2 - 64)
    );

    const exitBtn = addButton(
      "Exit",
      vec2(width() / 2, height() / 2 + 32),
      () => {
        if (paused) {
          go("menu", { username: username });
        }
      }
    );

    continueBtn.hidden = !paused;
    exitBtn.hidden = !paused;

    continueBtn.onClick(() => {
      if (!continueBtn.hidden) {
        pauseFunction();
      }
    });

    // Update
    player.onUpdate(() => {
      if (!paused) {
        player.pos.y += 3;
      }
    });

    player.onCollide("object", () => {
      go("lose", { username, score });
    });

    onUpdate("object", (obj) => {
      if (!paused) {
        obj.pos.x -= speed * dt();
      }

      if (obj.pos.x < -100) {
        obj.destroy();
      }
    });

    let elapsedTime = 0;
    onUpdate(() => {
      if (!paused) {
        elapsedTime += dt();

        score += 1;
        scoreLabel.text = `${convertDistance(score)}m`;

        if (elapsedTime <= 1) return;
        spawnObject();
        if (rand(0, 1) <= 0.5) {
          spawnObject();
        }

        elapsedTime -= 1;
        speed += 6;
      }
    });

    // Keys
    onKeyDown("space", () => {
      if (!paused) {
        player.pos.y -= 6;
      }
    });

    onKeyPress("escape", pauseFunction);
  });
}

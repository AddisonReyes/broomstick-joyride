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
        rect(rand(32, 160), rand(32, 160)),
        area(),
        outline(4),
        rotate(rand(0, 180)),
        pos(rand(width() + 300, width() + 600), rand(64, height() - 64)),
        anchor("botleft"),
        hexToRgb(choose(hexColorList)),
        z(-1),
        "object",
      ]);

      wait(rand(0.5, 1.5), spawnObject);
    }

    spawnObject();

    // Borders
    add([
      rect(width(), 48),
      pos(0, 0),
      outline(4),
      area(),
      body({ isStatic: true }),
      hexToRgb("#141013"),
    ]);

    add([
      rect(width(), 48),
      pos(0, height() - 48),
      outline(4),
      area(),
      body({ isStatic: true }),
      hexToRgb("#141013"),
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

      if (obj.pos.x < -300) {
        obj.destroy();
      }
    });

    let scoreMultiplier = 0.1;
    let lastMilestone = 0;
    onUpdate(() => {
      if (!paused) {
        score += scoreMultiplier;
        scoreLabel.text = `${convertDistance(score)}m`;

        const currentScoreInt = parseInt(score);
        if (parseInt(score) % 100 === 0 && currentScoreInt > lastMilestone) {
          scoreMultiplier += 0.006;
          speed += 10;

          lastMilestone = currentScoreInt;
        }

        if (parseInt(score) % 1000 === 0 && currentScoreInt > lastMilestone) {
          speed -= 10;
        }
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

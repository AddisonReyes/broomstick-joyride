import kaplay from "kaplay";
import "kaplay/global";

// Start game
kaplay({
  background: hexToRgb("#625565", true),
  font: "alagard",
});

// Load Assets
loadRoot("./");

loadSprite("player", "sprites/bean.png");

loadFont("alagard", "fonts/alagard.ttf", { filter: "nearest" });

// Utils
function addButton(label = "text", position = vec2(200, 100), f = () => {}) {
  const btn = add([
    rect(240, 80, { radius: 6 }),
    pos(position),
    area(),
    scale(1),
    anchor("center"),
    outline(4),
    color(255, 255, 255),
  ]);

  btn.add([text(label), anchor("center"), color(0, 0, 0)]);

  btn.onHoverUpdate(() => {
    const t = time() * 10;
    btn.color = hsl2rgb((t / 10) % 1, 0.6, 0.7);
    btn.scale = vec2(1.1);
    setCursor("pointer");
  });

  btn.onHoverEnd(() => {
    btn.scale = vec2(1);
    btn.color = rgb();
  });

  btn.onClick(f);

  return btn;
}

function hexToRgb(hex, returnList = false) {
  let cleanHex = hex.replace(/^#/, "");

  if (cleanHex.length === 3) {
    cleanHex = cleanHex
      .split("")
      .map((char) => char + char)
      .join("");
  }

  if (cleanHex.length !== 6) {
    return null;
  }

  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  if (returnList) {
    return [r, g, b];
  }

  return color(r, g, b);
}

// Game scenes
scene("user", ({ username }) => {
  const titleLabel = add([
    pos(width() / 2, 64),
    text("Type your username", { align: "center", width: width() }),
    anchor("center"),
  ]);

  const usernameInput = add([
    text(username),
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

scene("menu", ({ username }) => {
  addButton("Play", vec2(width() / 2, height() / 2 - 64), () => {
    go("game", { username: username });
  });
  addButton("User", vec2(width() / 2, height() / 2 + 32), () => {
    go("user", { username: username });
  });
  addButton("Leaderboard", vec2(width() / 2, height() / 2 + 128), () => {
    go("leaderboard", { username: username });
  });
});

scene("leaderboard", ({ username }) => {
  addButton("Back", vec2(width() / 2, height() / 2 - 64), () => {
    go("menu", { username: username });
  });
});

scene("game", ({ username }) => {
  // Game objects
  const player = add([sprite("player"), pos(80, height() / 2), area(), body()]);
  let speed = 480;
  let score = 0;

  function spawnObject() {
    add([
      rect(rand(16, 96), rand(32, 96)),
      area(),
      outline(4),
      rotate(rand(0, 180)),
      pos(width(), rand(0, height())),
      anchor("botleft"),
      color(255, 180, 255),
      move(LEFT, speed),
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
  const scoreLabel = add([text(score), pos(24, 24)]);

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

  onUpdate(() => {
    score++;
    scoreLabel.text = score;
  });

  // Keys
  onKeyDown("space", () => {
    if (!paused) {
      player.pos.y -= 6;
    }
  });

  onKeyPress("escape", pauseFunction);
});

scene("lose", ({ username, score }) => {
  add([
    sprite("player"),
    pos(width() / 2, height() / 2 - 160),
    scale(2),
    anchor("center"),
  ]);

  // display score
  add([
    text(score || 0),
    pos(width() / 2, height() / 2 - 32),
    scale(2),
    anchor("center"),
  ]);

  const gameFunction = () => go("game", { username });

  addButton("Play again", vec2(width() / 2, height() / 2 + 64), gameFunction);
  addButton("Leaderboard", vec2(width() / 2, height() / 2 + 160), () => {
    go("leaderboard", { username: username });
  });

  onKeyPress("space", gameFunction);
  onClick(gameFunction);
});

function main() {
  go("lose", { username: "Dakotah" });
}

main();

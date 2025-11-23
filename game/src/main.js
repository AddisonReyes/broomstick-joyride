import kaplay from "kaplay";
import "kaplay/global";

// Start game
kaplay({
  background: hexToRgb("#625565", true),
  font: "alagard",
});

const debugMode = true;

// Load Assets
loadRoot("./");

loadSprite("player", "sprites/bean.png");

loadFont("alagard", "fonts/alagard.ttf", { filter: "nearest" });

const hexColorList = [
  "#2e222f",
  "#3e3546",
  "#625565",
  "#966c6c",
  "#ab947a",
  "#694f62",
  "#7f708a",
  "#9babb2",
  "#c7dcd0",
  "#ffffff",
  "#6e2727",
  "#b33831",
  "#ea4f36",
  "#f57d4a",
  "#ae2334",
  "#e83b3b",
  "#fb6b1d",
  "#f79617",
  "#f9c22b",
  "#7a3045",
  "#9e4539",
  "#cd683d",
  "#e6904e",
  "#fbb954",
  "#4c3e24",
  "#676633",
  "#a2a947",
  "#d5e04b",
  "#fbff86",
  "#165a4c",
  "#239063",
  "#1ebc73",
  "#91db69",
  "#cddf6c",
  "#313638",
  "#374e4a",
  "#547e64",
  "#92a984",
  "#b2ba90",
  "#0b5e65",
  "#0b8a8f",
  "#0eaf9b",
  "#30e1b9",
  "#8ff8e2",
  "#323353",
  "#484a77",
  "#4d65b4",
  "#4d9be6",
  "#8fd3ff",
  "#45293f",
  "#6b3e75",
  "#905ea9",
  "#a884f3",
  "#eaaded",
  "#753c54",
  "#a24b6f",
  "#cf657f",
  "#ed8099",
  "#831c5d",
  "#c32454",
  "#f04f78",
  "#f68181",
  "#fca790",
  "#fdcbb0",
];

// Utils
function addButton(
  buttonLabel = "text",
  position = vec2(200, 100),
  f = () => {},
  descriptionLabel = ""
) {
  const btn = add([
    rect(240, 80, { radius: 6 }),
    pos(position),
    area(),
    scale(1),
    anchor("center"),
    outline(4),
    color(255, 255, 255),
  ]);

  const description = add([
    text(descriptionLabel),
    pos(btn.pos.x + 160, btn.pos.y),
    anchor("left"),
  ]);
  description.hidden = true;

  btn.add([text(buttonLabel), anchor("center"), color(0, 0, 0)]);

  btn.onHoverUpdate(() => {
    const t = time() * 10;
    btn.color = hsl2rgb((t / 10) % 1, 0.6, 0.7);
    btn.scale = vec2(1.1);
    setCursor("pointer");

    if (descriptionLabel) description.hidden = false;
  });

  btn.onHoverEnd(() => {
    if (descriptionLabel) description.hidden = true;
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

function convertDistance(distance) {
  return distance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const leaderboardAPI = "https://leaderboard-bj.up.railway.app/leaderboard";

async function getEntries() {
  try {
    const response = await fetch(leaderboardAPI);
    const data = await response.json();

    if (debugMode) {
      debug.log("Status:", response.status);
      debug.log("Data:", data);
    }

    return data;
  } catch (error) {
    if (debugMode) {
      debug.error("Error:", error);
    }
  }
}

async function postEntry(username, score) {
  try {
    const response = await fetch(leaderboardAPI, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username, score: score }),
    });

    const result = await response.json();
    if (debugMode) {
      debug.log("Response:", result);
    }
  } catch (error) {
    if (debugMode) {
      debug.error(error);
    }
  }
}

// Game scenes
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

scene("menu", ({ username }) => {
  const playBtn = addButton(
    "Play",
    vec2(width() / 2 - 128, height() / 2 - 64),
    () => {
      go("game", { username: username });
    }
  );

  const userBtn = addButton(
    "User",
    vec2(width() / 2 - 128, height() / 2 + 32),
    () => {
      go("user", { username: username });
    },
    username
  );

  const leaderboardBtn = addButton(
    "Leaderboard",
    vec2(width() / 2 - 128, height() / 2 + 128),
    () => {
      go("leaderboard", { username: username });
    }
  );
});

scene("leaderboard", ({ username }) => {
  const backBtn = addButton("Back", vec2(width() / 2, height() - 64), () => {
    go("menu", { username: username });
  });

  let currentPage = 0;
  const ITEMS_PER_PAGE = 10;
  let totalPages = 0;
  let allUsers = [];

  const { x, y } = { x: width() / 2, y: height() / 3.5 };

  const pageIndicator = add([
    text("Page 1 / 1"),
    pos(width() / 2, height() / 4 / 2),
    anchor("center"),
  ]);

  function renderPage() {
    destroyAll("leaderboard-entry");

    const start = currentPage * ITEMS_PER_PAGE;
    const end = Math.min(start + ITEMS_PER_PAGE, allUsers.length);
    const pageUsers = allUsers.slice(start, end);

    let posY = y;
    for (let i = 0; i < pageUsers.length; i++) {
      const user = pageUsers[i];
      const globalIndex = start + i + 1;

      add([
        text(
          `#${globalIndex} ~ ${user.username} / ${convertDistance(
            user.score
          )}m`,
          {
            transform:
              user.username === username
                ? (idx, ch) => ({
                    color: hsl2rgb((time() * 0.2 + idx * 0.1) % 1, 0.7, 0.8),
                    pos: vec2(0, wave(-4, 4, time() * 4 + idx * 0.5)),
                    scale: wave(1, 1.2, time() * 3 + idx),
                    angle: wave(-6, 6, time() * 3 + idx),
                  })
                : undefined,
          }
        ),
        pos(x, posY),
        anchor("center"),
        "leaderboard-entry",
      ]);

      posY += 40;
    }

    pageIndicator.text = `Page ${currentPage + 1} / ${totalPages}`;
  }

  // Cargar datos
  const entries = getEntries();
  entries.then((users) => {
    allUsers = users;
    totalPages = Math.ceil(allUsers.length / ITEMS_PER_PAGE);
    renderPage();
  });

  // Navegación con rueda del mouse
  onScroll((delta) => {
    if (delta.y > 0 && currentPage < totalPages - 1) {
      currentPage++;
      renderPage();
    } else if (delta.y < 0 && currentPage > 0) {
      currentPage--;
      renderPage();
    }
  });

  // Navegación con teclas
  onKeyPress("right", () => {
    if (currentPage < totalPages - 1) {
      currentPage++;
      renderPage();
    }
  });

  onKeyPress("left", () => {
    if (currentPage > 0) {
      currentPage--;
      renderPage();
    }
  });

  onKeyPress("down", () => {
    if (currentPage < totalPages - 1) {
      currentPage++;
      renderPage();
    }
  });

  onKeyPress("up", () => {
    if (currentPage > 0) {
      currentPage--;
      renderPage();
    }
  });
});

scene("game", ({ username }) => {
  // Game objects
  const player = add([sprite("player"), pos(80, height() / 2), area(), body()]);
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

scene("lose", ({ username, score }) => {
  add([
    sprite("player"),
    pos(width() / 2, height() / 2 - 160),
    scale(2),
    anchor("center"),
  ]);

  // display score
  add([
    text(`${convertDistance(score)}m` || "0m"),
    pos(width() / 2, height() / 2 - 32),
    scale(2),
    anchor("center"),
  ]);

  const gameFunction = () => go("game", { username });

  addButton("Play again", vec2(width() / 2, height() / 2 + 64), gameFunction);

  addButton("Submit score", vec2(width() / 2, height() / 2 + 160), () => {
    postEntry(username, score);
    go("leaderboard", { username: username });
  });

  addButton("Main menu", vec2(width() / 2, height() / 2 + 256), () => {
    go("menu", { username: username });
  });
});

function main() {
  go("leaderboard", { username: "Dakotah", score: 100 });
}

main();

import "kaplay/global";

const debugMode = false;

export function addButton(
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

export function hexToRgb(hex, returnList = false) {
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

export function convertDistance(distance) {
  return distance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const leaderboardAPI = "https://leaderboard-bj.up.railway.app/leaderboard";

export async function getEntries() {
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

export async function postEntry(username, score) {
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

export const hexColorList = [
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

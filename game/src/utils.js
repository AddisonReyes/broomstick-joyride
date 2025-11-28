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
  distance = Math.round(distance);
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
  "#e4d2aa",
  "#c7b08b",
  "#a08662",
  "#796755",
  "#5a4e44",
  "#423934",
];

import kaplay from "kaplay";
import "kaplay/global";
import gameScene from "./scenes/game.js";
import leaderboardScene from "./scenes/leaderboard.js";
import loseScene from "./scenes/lose.js";
import menuScene from "./scenes/menu.js";
import userScene from "./scenes/user.js";
import { viewport } from "./constants.js";
import { getStoredUsername, hexToRgb } from "./utils.js";

bootGame();

function bootGame(): void {
  kaplay({
    width: viewport.width,
    height: viewport.height,
    stretch: true,
    letterbox: true,
    background: hexToRgb("#0e1128") ?? [14, 17, 40],
    crisp: true,
    texFilter: "nearest",
    font: "alagard",
  });

  loadAssets();
  registerScenes();

  const storedUsername = getStoredUsername();

  if (storedUsername) {
    go("menu", { username: storedUsername });
    return;
  }

  go("user", { username: "" });
}

function loadAssets(): void {
  loadRoot("./");
  loadSprite("player", "sprites/player.png");
  loadFont("alagard", "fonts/alagard.ttf", { filter: "nearest" });
}

function registerScenes(): void {
  userScene();
  leaderboardScene();
  gameScene();
  loseScene();
  menuScene();
}

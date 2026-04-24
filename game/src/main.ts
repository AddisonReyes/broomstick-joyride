import kaplay from "kaplay";
import "kaplay/global";
import { gameConfig } from "./config.js";
import gameScene from "./scenes/game.js";
import leaderboardScene from "./scenes/leaderboard.js";
import loseScene from "./scenes/lose.js";
import menuScene from "./scenes/menu.js";
import userScene from "./scenes/user.js";
import { hexToRgb } from "./utils.js";

bootGame();

function bootGame(): void {
  kaplay({
    background: hexToRgb("#242234") ?? [36, 34, 52],
    crisp: true,
    texFilter: "nearest",
    font: "alagard",
  });

  loadAssets();
  registerScenes();

  // gameConfig.defaultUsername;
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

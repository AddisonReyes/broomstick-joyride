import kaplay from "kaplay";
import "kaplay/global";
import gameScene from "./scenes/game.js";
import leaderboardScene from "./scenes/leaderboard.js";
import loseScene from "./scenes/lose.js";
import menuScene from "./scenes/menu.js";
import userScene from "./scenes/user.js";
import { getResponsiveViewport } from "./layout.js";
import { hexToRgb } from "./utils.js";

bootGame();

function bootGame(): void {
  const gameRoot = getGameRoot();
  const viewport = getResponsiveViewport(gameRoot);

  kaplay({
    width: viewport.width,
    height: viewport.height,
    background: hexToRgb("#0e1128") ?? [14, 17, 40],
    crisp: true,
    texFilter: "nearest",
    font: "alagard",
    root: gameRoot,
    stretch: true,
    letterbox: true,
  });

  loadAssets();
  registerScenes();
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

function getGameRoot(): HTMLElement {
  const gameRoot = document.getElementById("game-root");

  if (!gameRoot) {
    throw new Error("Missing #game-root element.");
  }

  return gameRoot;
}

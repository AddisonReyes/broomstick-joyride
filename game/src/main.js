import kaplay from "kaplay";
import "kaplay/global";

import leaderboardScene from "./scenes/leaderboard.js";
import gameScene from "./scenes/game.js";
import loseScene from "./scenes/lose.js";
import menuScene from "./scenes/menu.js";
import userScene from "./scenes/user.js";
import { hexToRgb } from "./utils.js";

// Start game
kaplay({
  background: hexToRgb("#625565", true),
  font: "alagard",
});

// Load Assets
loadRoot("./");

loadSprite("player", "sprites/player.png");

loadFont("alagard", "fonts/alagard.ttf", { filter: "nearest" });

// Game scenes
userScene();
leaderboardScene();
gameScene();
loseScene();
menuScene();

function main() {
  go("user", { username: "Dakotah" });
}

main();

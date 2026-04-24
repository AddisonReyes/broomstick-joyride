import "kaplay/global";
import {
  difficultyStages,
  gameSettings,
  obstacleColors,
} from "../constants.js";
import type { PlayerSceneData } from "../types.js";
import { addButton, convertDistance, hexToRgb } from "../utils.js";

type ObstaclePattern =
  | "single"
  | "staggered"
  | "topBottom"
  | "triple"
  | "edgeTrap";

type DifficultyStage = (typeof difficultyStages)[number];
type VerticalBand = "top" | "upperMid" | "center" | "lowerMid" | "bottom";

const bandRatios: Record<VerticalBand, number> = {
  top: 0.08,
  upperMid: 0.3,
  center: 0.5,
  lowerMid: 0.7,
  bottom: 0.92,
};

export default function gameScene(): void {
  scene("game", ({ username }: PlayerSceneData) => {
    const player = add([
      sprite("player"),
      pos(gameSettings.playerStartX, height() / 2),
      area(),
      body(),
    ]);

    let worldSpeed: number = gameSettings.initialWorldSpeed;
    let score = 0;
    let paused = false;
    let lastSingleBand: VerticalBand = "center";

    const continueButton = addButton(
      "Continue",
      vec2(width() / 2, height() / 2 - 64),
    );

    const exitButton = addButton(
      "Exit",
      vec2(width() / 2, height() / 2 + 32),
      () => {
        if (paused) {
          go("lose", { username, score });
        }
      },
    );

    const scoreLabel = add([
      text(`${convertDistance(score)}m`),
      pos(width() / 2, 32),
      anchor("center"),
      z(20),
      color(255, 255, 255),
    ]);

    addBorder(0);
    addBorder(height() - gameSettings.borderHeight);
    hidePauseButtons();
    scheduleNextWave();

    continueButton.onClick(() => {
      if (!continueButton.hidden) {
        togglePauseMenu();
      }
    });

    player.onUpdate(() => {
      if (!paused) {
        player.pos.y += gameSettings.playerFallSpeed;
      }
    });

    player.onCollide("object", () => {
      go("lose", { username, score });
    });

    onUpdate("object", (object) => {
      if (!paused) {
        object.pos.x -= worldSpeed * dt();
      }

      if (object.pos.x < gameSettings.obstacleDestroyX) {
        object.destroy();
      }
    });

    onUpdate(() => {
      if (paused) {
        return;
      }

      const difficultyStage = getDifficultyStage(score);

      worldSpeed = moveToward(
        worldSpeed,
        difficultyStage.targetWorldSpeed,
        gameSettings.speedLerpPerSecond * dt(),
      );

      const scoreRate = getScoreRate(worldSpeed);
      score += scoreRate * dt();
      scoreLabel.text = `${convertDistance(score)}m`;
    });

    onKeyDown("space", () => {
      if (!paused) {
        player.pos.y -= gameSettings.playerLiftSpeed;
      }
    });

    onKeyPress("escape", togglePauseMenu);

    function togglePauseMenu(): void {
      paused = !paused;
      continueButton.hidden = !paused;
      exitButton.hidden = !paused;
    }

    function hidePauseButtons(): void {
      continueButton.hidden = true;
      exitButton.hidden = true;
    }

    function scheduleNextWave(): void {
      const difficultyStage = getDifficultyStage(score);
      const delay = rand(
        difficultyStage.spawnDelayMin,
        difficultyStage.spawnDelayMax,
      );

      wait(delay, () => {
        if (!paused) {
          spawnWave(difficultyStage);
        }

        scheduleNextWave();
      });
    }

    function spawnWave(difficultyStage: DifficultyStage): void {
      const pattern = choose([...difficultyStage.availablePatterns]);
      const spawnX = rand(
        width() + gameSettings.obstacleSpawnMinOffsetX,
        width() + gameSettings.obstacleSpawnMaxOffsetX,
      );

      switch (pattern) {
        case "single":
          spawnSingleObstacle(spawnX, difficultyStage);
          break;
        case "staggered":
          spawnStaggeredWave(spawnX, difficultyStage);
          break;
        case "topBottom":
          spawnTopBottomWave(spawnX, difficultyStage);
          break;
        case "triple":
          spawnTripleWave(spawnX, difficultyStage);
          break;
        case "edgeTrap":
          spawnEdgeTrapWave(spawnX, difficultyStage);
          break;
      }
    }

    function spawnSingleObstacle(
      spawnX: number,
      difficultyStage: DifficultyStage,
    ): void {
      const spawnBand = getNextSingleBand();
      lastSingleBand = spawnBand;
      createObstacle(spawnX, bandCenterY(spawnBand), difficultyStage);
    }

    function spawnStaggeredWave(
      spawnX: number,
      difficultyStage: DifficultyStage,
    ): void {
      createObstacle(spawnX, bandCenterY("upperMid"), difficultyStage);
      createObstacle(
        spawnX + gameSettings.obstaclePairSpacingX,
        bandCenterY("lowerMid"),
        difficultyStage,
      );
    }

    function spawnTopBottomWave(
      spawnX: number,
      difficultyStage: DifficultyStage,
    ): void {
      createObstacle(spawnX, bandCenterY("top"), difficultyStage);
      createObstacle(spawnX, bandCenterY("bottom"), difficultyStage);
    }

    function spawnTripleWave(
      spawnX: number,
      difficultyStage: DifficultyStage,
    ): void {
      createObstacle(spawnX, bandCenterY("top"), difficultyStage);
      createObstacle(
        spawnX + gameSettings.obstacleTripleSpacingX,
        bandCenterY("center"),
        difficultyStage,
      );
      createObstacle(
        spawnX + gameSettings.obstacleTripleSpacingX * 2,
        bandCenterY("bottom"),
        difficultyStage,
      );
    }

    function spawnEdgeTrapWave(
      spawnX: number,
      difficultyStage: DifficultyStage,
    ): void {
      const firstEdgeBand = choose<VerticalBand>(["top", "bottom"]);
      const oppositeEdgeBand: VerticalBand =
        firstEdgeBand === "top" ? "bottom" : "top";
      const centerPressureBand: VerticalBand =
        firstEdgeBand === "top" ? "lowerMid" : "upperMid";

      createObstacle(spawnX, bandCenterY(firstEdgeBand), difficultyStage);
      createObstacle(
        spawnX + gameSettings.obstaclePairSpacingX,
        bandCenterY(oppositeEdgeBand),
        difficultyStage,
      );
      createObstacle(
        spawnX + gameSettings.obstacleTripleSpacingX,
        bandCenterY(centerPressureBand),
        difficultyStage,
      );
    }

    function createObstacle(
      spawnX: number,
      spawnY: number,
      difficultyStage: DifficultyStage,
    ): void {
      const obstacleWidth = rand(
        difficultyStage.obstacleSizeMin,
        difficultyStage.obstacleSizeMax,
      );
      const obstacleHeight = rand(
        difficultyStage.obstacleSizeMin,
        difficultyStage.obstacleSizeMax,
      );
      const obstacleColor = choose([...obstacleColors]);

      add([
        rect(obstacleWidth, obstacleHeight),
        pos(spawnX, spawnY),
        area(),
        rotate(rand(0, 180)),
        outline(4),
        anchor("center"),
        hexToRgb(obstacleColor),
        z(-1),
        "object",
      ]);
    }

    function getNextSingleBand(): VerticalBand {
      const availableBands = Object.keys(bandRatios).filter((band) => {
        return band !== lastSingleBand;
      }) as VerticalBand[];

      const preferredBands = getPreferredBands(lastSingleBand);
      const nextBandPool =
        preferredBands.length > 0 ? preferredBands : availableBands;

      return choose(nextBandPool);
    }

    function bandCenterY(band: VerticalBand): number {
      return laneCenterY(bandRatios[band]);
    }

    function laneCenterY(positionRatio: number): number {
      const topLimit =
        gameSettings.borderHeight + gameSettings.obstacleVerticalGapPadding;
      const bottomLimit =
        height() -
        gameSettings.borderHeight -
        gameSettings.obstacleVerticalGapPadding;

      return lerp(topLimit, bottomLimit, positionRatio);
    }

    function addBorder(y: number): void {
      add([
        rect(width(), gameSettings.borderHeight),
        pos(0, y),
        outline(4),
        area(),
        body({ isStatic: true }),
        hexToRgb("#141013"),
      ]);
    }
  });
}

function getPreferredBands(previousBand: VerticalBand): VerticalBand[] {
  switch (previousBand) {
    case "top":
    case "upperMid":
      return ["lowerMid", "bottom", "center"];
    case "bottom":
    case "lowerMid":
      return ["upperMid", "top", "center"];
    case "center":
      return ["top", "bottom", "upperMid", "lowerMid"];
  }
}

function getDifficultyStage(score: number): DifficultyStage {
  for (let index = difficultyStages.length - 1; index >= 0; index--) {
    const stage = difficultyStages[index];

    if (score >= stage.minScore) {
      return stage;
    }
  }

  return difficultyStages[0];
}

function getScoreRate(targetWorldSpeed: number): number {
  return (
    gameSettings.scorePerSecondAtBaseSpeed *
    (targetWorldSpeed / gameSettings.initialWorldSpeed)
  );
}

function moveToward(current: number, target: number, step: number): number {
  if (current < target) {
    return Math.min(current + step, target);
  }

  if (current > target) {
    return Math.max(current - step, target);
  }

  return current;
}

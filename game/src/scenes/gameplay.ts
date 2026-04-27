import "kaplay/global";
import { difficultyStages, gameSettings } from "../constants.js";

type DifficultyStageConfig = (typeof difficultyStages)[number];

export type SpawnPattern = DifficultyStageConfig["availablePatterns"][number];
export type DifficultyStage = {
  minScore: number;
  targetWorldSpeed: number;
  spawnDelayMin: number;
  spawnDelayMax: number;
  obstacleSizeMin: number;
  obstacleSizeMax: number;
  availablePatterns: readonly SpawnPattern[];
};
export type VerticalBand =
  | "top"
  | "upperMid"
  | "center"
  | "lowerMid"
  | "bottom";

export type ScaledGameSettings = {
  playerStartX: number;
  playerFallSpeed: number;
  playerLiftSpeed: number;
  initialWorldSpeed: number;
  speedLerpPerSecond: number;
  borderHeight: number;
  obstacleSpawnMinOffsetX: number;
  obstacleSpawnMaxOffsetX: number;
  obstacleDestroyX: number;
  obstaclePairSpacingX: number;
  obstacleTripleSpacingX: number;
};

type WaveSlot = {
  x: number;
  band: VerticalBand;
};

type WavePlan = {
  slots: WaveSlot[];
  nextSingleBand: VerticalBand;
};

const verticalBandRatios: Record<VerticalBand, number> = {
  top: 0.08,
  upperMid: 0.3,
  center: 0.5,
  lowerMid: 0.7,
  bottom: 0.92,
};

export function createWavePlan(
  pattern: SpawnPattern,
  spawnX: number,
  previousSingleBand: VerticalBand,
  settings: ScaledGameSettings,
): WavePlan {
  switch (pattern) {
    case "single": {
      const nextSingleBand = getNextSingleBand(previousSingleBand);

      return {
        slots: [{ x: spawnX, band: nextSingleBand }],
        nextSingleBand,
      };
    }
    case "staggered":
      return {
        slots: [
          { x: spawnX, band: "upperMid" },
          {
            x: spawnX + settings.obstaclePairSpacingX,
            band: "lowerMid",
          },
        ],
        nextSingleBand: previousSingleBand,
      };
    case "topBottom":
      return {
        slots: [
          { x: spawnX, band: "top" },
          { x: spawnX, band: "bottom" },
        ],
        nextSingleBand: previousSingleBand,
      };
    case "triple":
      return {
        slots: [
          { x: spawnX, band: "top" },
          {
            x: spawnX + settings.obstacleTripleSpacingX,
            band: "center",
          },
          {
            x: spawnX + settings.obstacleTripleSpacingX * 2,
            band: "bottom",
          },
        ],
        nextSingleBand: previousSingleBand,
      };
    case "edgeTrap":
      return createEdgeTrapWavePlan(spawnX, previousSingleBand, settings);
  }
}

export function getBandCenterY(
  band: VerticalBand,
  playfieldHeight: number,
  settings: ScaledGameSettings,
): number {
  const topLimit = settings.borderHeight;
  const bottomLimit = playfieldHeight - settings.borderHeight;

  return topLimit + (bottomLimit - topLimit) * verticalBandRatios[band];
}

export function getScaledDifficultyStage(
  score: number,
  scaleFactor: number,
): DifficultyStage {
  const difficultyStage = getDifficultyStage(score);

  return {
    ...difficultyStage,
    targetWorldSpeed: difficultyStage.targetWorldSpeed * scaleFactor,
    obstacleSizeMin: Math.round(difficultyStage.obstacleSizeMin * scaleFactor),
    obstacleSizeMax: Math.round(difficultyStage.obstacleSizeMax * scaleFactor),
  };
}

export function getScaledGameSettings(scaleFactor: number): ScaledGameSettings {
  return {
    playerStartX: Math.round(gameSettings.playerStartX * scaleFactor),
    playerFallSpeed: gameSettings.playerFallSpeed * scaleFactor,
    playerLiftSpeed: gameSettings.playerLiftSpeed * scaleFactor,
    initialWorldSpeed: gameSettings.initialWorldSpeed * scaleFactor,
    speedLerpPerSecond: gameSettings.speedLerpPerSecond * scaleFactor,
    borderHeight: Math.round(gameSettings.borderHeight * scaleFactor),
    obstacleSpawnMinOffsetX: Math.round(
      gameSettings.obstacleSpawnMinOffsetX * scaleFactor,
    ),
    obstacleSpawnMaxOffsetX: Math.round(
      gameSettings.obstacleSpawnMaxOffsetX * scaleFactor,
    ),
    obstacleDestroyX: Math.round(gameSettings.obstacleDestroyX * scaleFactor),
    obstaclePairSpacingX: Math.round(
      gameSettings.obstaclePairSpacingX * scaleFactor,
    ),
    obstacleTripleSpacingX: Math.round(
      gameSettings.obstacleTripleSpacingX * scaleFactor,
    ),
  };
}

export function getScoreRate(
  currentWorldSpeed: number,
  initialWorldSpeed: number,
): number {
  return (
    gameSettings.scorePerSecondAtBaseSpeed *
    (currentWorldSpeed / initialWorldSpeed)
  );
}

export function moveToward(
  currentValue: number,
  targetValue: number,
  step: number,
): number {
  if (currentValue < targetValue) {
    return Math.min(currentValue + step, targetValue);
  }

  if (currentValue > targetValue) {
    return Math.max(currentValue - step, targetValue);
  }

  return currentValue;
}

function createEdgeTrapWavePlan(
  spawnX: number,
  previousSingleBand: VerticalBand,
  settings: ScaledGameSettings,
): WavePlan {
  const firstEdgeBand = choose<VerticalBand>(["top", "bottom"]);
  const oppositeEdgeBand: VerticalBand =
    firstEdgeBand === "top" ? "bottom" : "top";
  const pressureBand: VerticalBand =
    firstEdgeBand === "top" ? "lowerMid" : "upperMid";

  return {
    slots: [
      { x: spawnX, band: firstEdgeBand },
      {
        x: spawnX + settings.obstaclePairSpacingX,
        band: oppositeEdgeBand,
      },
      {
        x: spawnX + settings.obstacleTripleSpacingX,
        band: pressureBand,
      },
    ],
    nextSingleBand: previousSingleBand,
  };
}

function getDifficultyStage(score: number): DifficultyStage {
  for (let index = difficultyStages.length - 1; index >= 0; index--) {
    const difficultyStage = difficultyStages[index];

    if (score >= difficultyStage.minScore) {
      return difficultyStage;
    }
  }

  return difficultyStages[0];
}

function getNextSingleBand(previousBand: VerticalBand): VerticalBand {
  const availableBands = Object.keys(verticalBandRatios).filter((band) => {
    return band !== previousBand;
  }) as VerticalBand[];
  const preferredBands = getPreferredBands(previousBand);
  const nextBandPool =
    preferredBands.length > 0 ? preferredBands : availableBands;

  return choose(nextBandPool);
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

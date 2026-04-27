import "kaplay/global";
import { obstacleColors } from "../constants.js";
import { getViewportScale, scaleUi } from "../layout.js";
import type { PlayerSceneData } from "../types.js";
import { convertDistance, hexToColor } from "../utils.js";
import {
  addArcaneNightBackdrop,
  addArcaneButton,
  addArcanePanel,
  getArcanePalette,
  type ArcanePalette,
} from "../ui/arcane.js";
import {
  createWavePlan,
  getBandCenterY,
  getScaledDifficultyStage,
  getScaledGameSettings,
  getScoreRate,
  moveToward,
  type DifficultyStage,
  type ScaledGameSettings,
  type VerticalBand,
} from "./gameplay.js";

type PauseOverlay = ReturnType<typeof createPauseOverlay>;

export default function gameScene(): void {
  scene("game", ({ username }: PlayerSceneData) => {
    const palette = getArcanePalette();
    const viewportScale = getViewportScale();
    const scaledSettings = getScaledGameSettings(viewportScale);
    let currentWorldSpeed = scaledSettings.initialWorldSpeed;
    let lastSingleBand: VerticalBand = "center";
    let paused = false;
    let score = 0;

    addArcaneNightBackdrop();
    const player = addPlayer(scaledSettings);
    const distanceLabel = addDistanceLabel(score, palette);
    const pauseOverlay = createPauseOverlay(
      palette,
      () => {
        if (paused) {
          togglePauseMenu();
        }
      },
      () => {
        if (paused) {
          endRun();
        }
      },
    );

    addObstacleBorders(scaledSettings.borderHeight, palette);
    setPauseOverlayVisible(pauseOverlay, false);
    scheduleNextWave();

    player.onUpdate(() => {
      if (!paused) {
        player.pos.y += scaledSettings.playerFallSpeed;
      }
    });

    player.onCollide("object", () => {
      endRun();
    });

    onUpdate("object", (object) => {
      if (!paused) {
        object.pos.x -= currentWorldSpeed * dt();
      }

      if (object.pos.x < scaledSettings.obstacleDestroyX) {
        object.destroy();
      }
    });

    onUpdate(() => {
      if (paused) {
        return;
      }

      const difficultyStage = getScaledDifficultyStage(score, viewportScale);

      currentWorldSpeed = moveToward(
        currentWorldSpeed,
        difficultyStage.targetWorldSpeed,
        scaledSettings.speedLerpPerSecond * dt(),
      );

      const scoreRate = getScoreRate(
        currentWorldSpeed,
        scaledSettings.initialWorldSpeed,
      );
      score += scoreRate * dt();
      distanceLabel.text = `${convertDistance(score)}m`;
    });

    onKeyDown("space", () => {
      if (!paused) {
        player.pos.y -= scaledSettings.playerLiftSpeed;
      }
    });

    onKeyPress("escape", togglePauseMenu);

    function endRun(): void {
      go("lose", { username, score });
    }

    function togglePauseMenu(): void {
      paused = !paused;
      setPauseOverlayVisible(pauseOverlay, paused);
    }

    function scheduleNextWave(): void {
      const difficultyStage = getScaledDifficultyStage(score, viewportScale);
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
        width() + scaledSettings.obstacleSpawnMinOffsetX,
        width() + scaledSettings.obstacleSpawnMaxOffsetX,
      );

      const wavePlan = createWavePlan(
        pattern,
        spawnX,
        lastSingleBand,
        scaledSettings,
      );

      lastSingleBand = wavePlan.nextSingleBand;

      for (const slot of wavePlan.slots) {
        createObstacle(
          slot.x,
          getBandCenterY(slot.band, height(), scaledSettings),
          difficultyStage,
        );
      }
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
        outline(scaleUi(4)),
        anchor("center"),
        hexToColor(obstacleColor) ?? color(255, 255, 255),
        z(-1),
        "object",
      ]);
    }
  });
}

function addPlayer(settings: ScaledGameSettings) {
  return add([
    sprite("player"),
    pos(settings.playerStartX, height() / 2),
    area(),
    body(),
  ]);
}

function addDistanceLabel(score: number, palette: ArcanePalette) {
  add([
    rect(scaleUi(256), scaleUi(64), { radius: scaleUi(18) }),
    pos(width() / 2, scaleUi(52)),
    anchor("center"),
    outline(scaleUi(4), palette.buttonOutline),
    color(palette.buttonBase),
    opacity(0.94),
    fixed(),
    z(25),
  ]);

  return add([
    text(`${convertDistance(score)}m`, { size: scaleUi(32) }),
    pos(width() / 2, scaleUi(54)),
    anchor("center"),
    color(palette.parchment),
    fixed(),
    z(26),
  ]);
}

function createPauseOverlay(
  palette: ArcanePalette,
  onContinue: () => void,
  onExit: () => void,
) {
  const panel = addArcanePanel(
    vec2(width() / 2, height() / 2 - scaleUi(18)),
    vec2(scaleUi(430), scaleUi(300)),
    40,
  );

  const title = add([
    text("Paused", { size: scaleUi(32) }),
    pos(width() / 2, height() / 2 - scaleUi(104)),
    anchor("center"),
    color(palette.goldGlow),
    fixed(),
    z(41),
  ]);

  const continueButton = addArcaneButton(
    "Continue",
    vec2(width() / 2, height() / 2 - scaleUi(32)),
    onContinue,
    "",
    220,
    42,
  );

  const exitButton = addArcaneButton(
    "Exit",
    vec2(width() / 2, height() / 2 + scaleUi(64)),
    onExit,
    "",
    220,
    42,
  );

  return {
    panel,
    title,
    continueButton,
    exitButton,
  };
}

function setPauseOverlayVisible(
  pauseOverlay: PauseOverlay,
  visible: boolean,
): void {
  pauseOverlay.panel.hidden = !visible;
  pauseOverlay.title.hidden = !visible;
  pauseOverlay.continueButton.hidden = !visible;
  pauseOverlay.exitButton.hidden = !visible;
}

function addObstacleBorders(
  borderHeight: number,
  palette: ArcanePalette,
): void {
  addBorder(-borderHeight, borderHeight, palette);
  addBorder(height(), borderHeight, palette);
}

function addBorder(
  y: number,
  borderHeight: number,
  palette: ArcanePalette,
): void {
  add([
    rect(width(), borderHeight),
    pos(0, y),
    outline(scaleUi(4)),
    area(),
    body({ isStatic: true }),
    color(palette.nightBlue),
    opacity(0.64),
  ]);
}

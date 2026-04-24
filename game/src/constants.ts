export const uiText = {
  leaderboardLoading: "Loading leaderboard...",
  leaderboardUnavailable: "Leaderboard is not available at the moment.",
  leaderboardUnavailableTitle: "Leaderboard unavailable",
  leaderboardEmpty: "No leaderboard entries yet.",
  usernamePrompt: "Type your username",
  usernameContinue: "Press 'Enter' to continue...",
  usernameIdle: ". . .",
} as const;

export const obstacleColors = [
  "#e4d2aa",
  "#c7b08b",
  "#a08662",
  "#796755",
  "#5a4e44",
  "#423934",
] as const;

export const leaderboardSettings = {
  itemsPerPage: 10,
} as const;

export const gameSettings = {
  playerStartX: 80,
  playerFallSpeed: 3,
  playerLiftSpeed: 6,
  initialWorldSpeed: 480,
  speedLerpPerSecond: 120,
  scorePerSecondAtBaseSpeed: 48,
  borderHeight: 48,
  obstacleMinSize: 32,
  obstacleMaxSize: 160,
  obstacleSpawnMinOffsetX: 300,
  obstacleSpawnMaxOffsetX: 600,
  obstacleSpawnPaddingY: 64,
  obstacleDestroyX: -300,
  obstacleVerticalGapPadding: 72,
  obstaclePairSpacingX: 170,
  obstacleTripleSpacingX: 150,
} as const;

export const difficultyStages = [
  {
    minScore: 0,
    targetWorldSpeed: 480,
    spawnDelayMin: 1.2,
    spawnDelayMax: 1.7,
    obstacleSizeMin: 46,
    obstacleSizeMax: 88,
    availablePatterns: ["single", "single", "single", "staggered"],
  },
  {
    minScore: 250,
    targetWorldSpeed: 560,
    spawnDelayMin: 1.0,
    spawnDelayMax: 1.45,
    obstacleSizeMin: 54,
    obstacleSizeMax: 108,
    availablePatterns: ["single", "staggered", "topBottom", "edgeTrap"],
  },
  {
    minScore: 700,
    targetWorldSpeed: 650,
    spawnDelayMin: 0.85,
    spawnDelayMax: 1.2,
    obstacleSizeMin: 62,
    obstacleSizeMax: 124,
    availablePatterns: ["single", "staggered", "topBottom", "triple", "edgeTrap"],
  },
  {
    minScore: 1400,
    targetWorldSpeed: 760,
    spawnDelayMin: 0.75,
    spawnDelayMax: 1.05,
    obstacleSizeMin: 70,
    obstacleSizeMax: 136,
    availablePatterns: ["staggered", "topBottom", "triple", "triple", "edgeTrap"],
  },
  {
    minScore: 2400,
    targetWorldSpeed: 860,
    spawnDelayMin: 0.65,
    spawnDelayMax: 0.95,
    obstacleSizeMin: 78,
    obstacleSizeMax: 150,
    availablePatterns: ["topBottom", "triple", "triple", "edgeTrap", "edgeTrap"],
  },
] as const;
